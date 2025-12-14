/*
  # Page Visits Tracking System

  1. Improvements to existing table
    - Add indexes to `user_activity` table for better query performance
    - Add a view for aggregated page visit statistics

  2. New Features
    - Create a materialized view for daily page visits stats
    - Add helper functions for tracking

  3. Security
    - Ensure RLS policies are properly configured
    - Add policy for users to view their own activity
*/

-- Add indexes for better performance on user_activity table
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_timestamp ON user_activity(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_page_url ON user_activity(page_url);
CREATE INDEX IF NOT EXISTS idx_user_activity_activity_type ON user_activity(activity_type);

-- Create a view for page visit statistics
CREATE OR REPLACE VIEW page_visit_stats AS
SELECT 
  page_url,
  activity_type,
  COUNT(*) as visit_count,
  COUNT(DISTINCT user_id) as unique_visitors,
  MAX(timestamp) as last_visit,
  DATE(timestamp) as visit_date
FROM user_activity
WHERE activity_type IN ('page_view', 'visit')
GROUP BY page_url, activity_type, DATE(timestamp)
ORDER BY visit_date DESC, visit_count DESC;

-- Create function to track page visits
CREATE OR REPLACE FUNCTION track_page_visit(
  p_user_id uuid,
  p_page_url text,
  p_activity_type text DEFAULT 'page_view',
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid AS $$
DECLARE
  v_activity_id uuid;
BEGIN
  INSERT INTO user_activity (
    user_id,
    activity_type,
    page_url,
    metadata,
    timestamp
  ) VALUES (
    p_user_id,
    p_activity_type,
    p_page_url,
    p_metadata,
    now()
  )
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for user_activity
DROP POLICY IF EXISTS "Users can view own activity" ON user_activity;
DROP POLICY IF EXISTS "Users can insert own activity" ON user_activity;
DROP POLICY IF EXISTS "Admins can view all activity" ON user_activity;

CREATE POLICY "Users can view own activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON user_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create a table for page visit summaries (daily aggregations)
CREATE TABLE IF NOT EXISTS page_visit_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url text NOT NULL,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  total_visits integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  avg_duration_seconds integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_url, visit_date)
);

-- Enable RLS
ALTER TABLE page_visit_summaries ENABLE ROW LEVEL SECURITY;

-- RLS policies for page_visit_summaries
CREATE POLICY "Admins can view all summaries"
  ON page_visit_summaries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert summaries"
  ON page_visit_summaries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update summaries"
  ON page_visit_summaries FOR UPDATE
  TO authenticated
  USING (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_page_visit_summaries_date ON page_visit_summaries(visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_page_visit_summaries_url ON page_visit_summaries(page_url);

-- Function to update daily summaries
CREATE OR REPLACE FUNCTION update_page_visit_summary(p_date date DEFAULT CURRENT_DATE) 
RETURNS void AS $$
BEGIN
  INSERT INTO page_visit_summaries (page_url, visit_date, total_visits, unique_visitors)
  SELECT 
    page_url,
    p_date,
    COUNT(*) as total_visits,
    COUNT(DISTINCT user_id) as unique_visitors
  FROM user_activity
  WHERE DATE(timestamp) = p_date
    AND activity_type IN ('page_view', 'visit')
  GROUP BY page_url
  ON CONFLICT (page_url, visit_date)
  DO UPDATE SET
    total_visits = EXCLUDED.total_visits,
    unique_visitors = EXCLUDED.unique_visitors,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;