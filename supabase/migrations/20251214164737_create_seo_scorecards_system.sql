/*
  # Create SEO Scorecards System

  1. New Tables
    - `seo_scorecards` - Country/locale specific SEO strategies
    - `seo_priority_keywords` - Priority keywords with intent and funnel tracking

  2. Features
    - Country and locale specific SEO strategies
    - Keyword intent tracking (high, medium, low)
    - Funnel tracking (blog -> generator -> checkout)
    - Target page mapping
    - Conversion notes per country

  3. Security
    - Enable RLS on all tables
    - Public read access for active scorecards
    - Admin-only write access

  4. Indexes
    - Country and locale lookups
    - Keyword searches
    - Intent filtering
*/

-- Create seo_scorecards table
CREATE TABLE IF NOT EXISTS seo_scorecards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  locale text NOT NULL,
  conversion_notes text[],
  
  -- Metadata
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(country_code, locale)
);

-- Create seo_priority_keywords table
CREATE TABLE IF NOT EXISTS seo_priority_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scorecard_id uuid NOT NULL REFERENCES seo_scorecards(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  intent text NOT NULL CHECK (intent IN ('high', 'medium', 'low')),
  target_page text NOT NULL,
  funnel text NOT NULL,
  
  -- SEO metrics (optional for future tracking)
  search_volume integer,
  competition_level text,
  current_ranking integer,
  
  -- Metadata
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_seo_scorecards_country ON seo_scorecards(country_code);
CREATE INDEX IF NOT EXISTS idx_seo_scorecards_locale ON seo_scorecards(locale);
CREATE INDEX IF NOT EXISTS idx_seo_scorecards_active ON seo_scorecards(is_active);

CREATE INDEX IF NOT EXISTS idx_seo_keywords_scorecard ON seo_priority_keywords(scorecard_id);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_intent ON seo_priority_keywords(intent);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_keyword ON seo_priority_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_target_page ON seo_priority_keywords(target_page);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_active ON seo_priority_keywords(is_active);

-- Enable RLS
ALTER TABLE seo_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_priority_keywords ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view active SEO scorecards"
  ON seo_scorecards
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active SEO keywords"
  ON seo_priority_keywords
  FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM seo_scorecards
      WHERE seo_scorecards.id = seo_priority_keywords.scorecard_id
      AND seo_scorecards.is_active = true
    )
  );

-- Admin write policies
CREATE POLICY "Admins can manage SEO scorecards"
  ON seo_scorecards
  FOR ALL
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

CREATE POLICY "Admins can manage SEO keywords"
  ON seo_priority_keywords
  FOR ALL
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_seo_scorecards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_seo_keywords_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_seo_scorecards_timestamp
  BEFORE UPDATE ON seo_scorecards
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_scorecards_updated_at();

CREATE TRIGGER update_seo_keywords_timestamp
  BEFORE UPDATE ON seo_priority_keywords
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_keywords_updated_at();