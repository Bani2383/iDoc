/*
  # Create SEO Landing Pages Table
  
  1. New Table
    - `seo_landing_pages` 
      - Stores specialized landing pages for conversion funnels
      - Includes FR and EN-CA versions
      - SEO-optimized fields (meta tags, schema markup)
      - Disclaimer and legal compliance fields
  
  2. Security
    - Enable RLS on `seo_landing_pages` table
    - Public read access for published pages
    - Admin-only write access
*/

-- Create seo_landing_pages table
CREATE TABLE IF NOT EXISTS seo_landing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  
  -- French (FR-CA) Content
  title_fr text NOT NULL,
  subtitle_fr text,
  content_html_fr text NOT NULL,
  meta_title_fr text,
  meta_description_fr text,
  
  -- English (EN-CA) Content
  title_en text,
  subtitle_en text,
  content_html_en text,
  meta_title_en text,
  meta_description_en text,
  
  -- Page Configuration
  page_type text CHECK (page_type IN ('immigration', 'business', 'general', 'legal')),
  cta_text_fr text,
  cta_text_en text,
  cta_link text,
  
  -- Legal & Compliance
  disclaimer_fr text,
  disclaimer_en text,
  show_disclaimer boolean DEFAULT true,
  
  -- SEO & Analytics
  keywords text[],
  canonical_url text,
  schema_markup jsonb DEFAULT '{}'::jsonb,
  
  -- Status
  is_published boolean DEFAULT false,
  published_at timestamptz,
  view_count integer DEFAULT 0,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_seo_landing_pages_slug ON seo_landing_pages(slug);

-- Create index for published pages
CREATE INDEX IF NOT EXISTS idx_seo_landing_pages_published ON seo_landing_pages(is_published, published_at);

-- Enable RLS
ALTER TABLE seo_landing_pages ENABLE ROW LEVEL SECURITY;

-- Public read policy for published pages
CREATE POLICY "Anyone can view published landing pages"
  ON seo_landing_pages
  FOR SELECT
  USING (is_published = true);

-- Admin write policy
CREATE POLICY "Admins can manage all landing pages"
  ON seo_landing_pages
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
CREATE OR REPLACE FUNCTION update_seo_landing_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_seo_landing_pages_timestamp
  BEFORE UPDATE ON seo_landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_landing_pages_updated_at();