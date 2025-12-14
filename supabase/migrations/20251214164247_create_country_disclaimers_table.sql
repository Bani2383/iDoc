/*
  # Create Country Disclaimers Table

  1. New Table
    - `country_disclaimers`
      - Stores legal disclaimers for different countries
      - Supports multiple languages (FR/EN)
      - Used across immigration templates and articles

  2. Security
    - Enable RLS on `country_disclaimers` table
    - Public read access for all disclaimers
    - Admin-only write access

  3. Initial Data
    - US disclaimer (USCIS)
    - UK disclaimer (UKVI)
    - Australia disclaimer (Home Affairs)
*/

-- Create country_disclaimers table
CREATE TABLE IF NOT EXISTS country_disclaimers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text UNIQUE NOT NULL,
  country_name_en text NOT NULL,
  country_name_fr text,
  
  -- Disclaimer text in multiple languages
  disclaimer_text_en text NOT NULL,
  disclaimer_text_fr text,
  
  -- Display settings
  show_on_templates boolean DEFAULT true,
  show_on_articles boolean DEFAULT true,
  display_style text DEFAULT 'warning' CHECK (display_style IN ('info', 'warning', 'danger')),
  
  -- Metadata
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for country code lookups
CREATE INDEX IF NOT EXISTS idx_country_disclaimers_code ON country_disclaimers(country_code);

-- Create index for active disclaimers
CREATE INDEX IF NOT EXISTS idx_country_disclaimers_active ON country_disclaimers(is_active);

-- Enable RLS
ALTER TABLE country_disclaimers ENABLE ROW LEVEL SECURITY;

-- Public read policy for active disclaimers
CREATE POLICY "Anyone can view active country disclaimers"
  ON country_disclaimers
  FOR SELECT
  USING (is_active = true);

-- Admin write policy
CREATE POLICY "Admins can manage country disclaimers"
  ON country_disclaimers
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
CREATE OR REPLACE FUNCTION update_country_disclaimers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_country_disclaimers_timestamp
  BEFORE UPDATE ON country_disclaimers
  FOR EACH ROW
  EXECUTE FUNCTION update_country_disclaimers_updated_at();

-- Insert initial country disclaimers
INSERT INTO country_disclaimers (
  country_code,
  country_name_en,
  country_name_fr,
  disclaimer_text_en,
  disclaimer_text_fr,
  display_style
) VALUES 
(
  'us',
  'United States',
  'États-Unis',
  'Templates adapted to USCIS administrative practices. Not legal advice.',
  'Modèles adaptés aux pratiques administratives de l''USCIS. Ne constitue pas un conseil juridique.',
  'warning'
),
(
  'uk',
  'United Kingdom',
  'Royaume-Uni',
  'Templates aligned with UKVI administrative expectations. Not legal advice.',
  'Modèles alignés avec les attentes administratives du UKVI. Ne constitue pas un conseil juridique.',
  'warning'
),
(
  'au',
  'Australia',
  'Australie',
  'Templates adapted to Home Affairs requirements. Not legal advice.',
  'Modèles adaptés aux exigences du ministère de l''Intérieur australien. Ne constitue pas un conseil juridique.',
  'warning'
),
(
  'ca',
  'Canada',
  'Canada',
  'Templates structured according to IRCC guidelines. Not legal advice.',
  'Modèles structurés selon les directives d''IRCC. Ne constitue pas un conseil juridique.',
  'warning'
),
(
  'fr',
  'France',
  'France',
  'Templates adapted to French administrative requirements. Not legal advice.',
  'Modèles adaptés aux exigences administratives françaises. Ne constitue pas un conseil juridique.',
  'warning'
),
(
  'schengen',
  'Schengen Area',
  'Espace Schengen',
  'Templates adapted to Schengen visa requirements. Not legal advice.',
  'Modèles adaptés aux exigences de visa Schengen. Ne constitue pas un conseil juridique.',
  'warning'
)
ON CONFLICT (country_code) DO NOTHING;