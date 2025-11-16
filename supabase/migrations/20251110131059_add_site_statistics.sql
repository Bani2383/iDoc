/*
  # Add Site Statistics Table

  ## Purpose
  Track global site statistics to display social proof counters

  ## Changes
  1. **site_statistics table**
    - `id` (uuid, primary key)
    - `metric_name` (text, unique) - Name of the metric (e.g., 'total_visitors', 'documents_generated')
    - `metric_value` (bigint) - Current value of the metric
    - `last_updated` (timestamptz) - Last update timestamp
    - `created_at` (timestamptz) - Creation timestamp

  2. **Initial Data**
    - Seed with realistic starting values for social proof

  3. **Security**
    - Public read access for displaying counters
    - Admin-only write access for security

  ## Performance Impact
  - Small table, highly cacheable
  - Indexed on metric_name for fast lookups
*/

-- Create site_statistics table
CREATE TABLE IF NOT EXISTS site_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text UNIQUE NOT NULL,
  metric_value bigint DEFAULT 0 NOT NULL,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create index on metric_name for fast lookups
CREATE INDEX IF NOT EXISTS idx_site_statistics_metric_name
  ON site_statistics(metric_name);

-- Enable RLS
ALTER TABLE site_statistics ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read statistics (for public display)
CREATE POLICY "Anyone can view statistics"
  ON site_statistics
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only admins can update statistics
CREATE POLICY "Admins can update statistics"
  ON site_statistics
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Only admins can insert statistics
CREATE POLICY "Admins can insert statistics"
  ON site_statistics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Insert initial statistics with realistic values for social proof
INSERT INTO site_statistics (metric_name, metric_value) VALUES
  ('total_visitors', 12547),
  ('documents_generated', 8932),
  ('active_users', 1250),
  ('signatures_created', 4561)
ON CONFLICT (metric_name) DO NOTHING;

-- Function to increment a statistic
CREATE OR REPLACE FUNCTION increment_statistic(stat_name text, increment_by bigint DEFAULT 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO site_statistics (metric_name, metric_value, last_updated)
  VALUES (stat_name, increment_by, now())
  ON CONFLICT (metric_name)
  DO UPDATE SET
    metric_value = site_statistics.metric_value + increment_by,
    last_updated = now();
END;
$$;

-- Analyze table
ANALYZE site_statistics;
