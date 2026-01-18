/*
  # Create Country Auto-Detect UX System

  1. New Table
    - `country_auto_detect_configs` - Configuration for country auto-detection banners

  2. Features
    - Multi-locale banner support (EN, FR, etc.)
    - Detection signals (navigator language, timezone, geoIP)
    - Dismissal persistence (localStorage)
    - Customizable banner position, variant, copy template
    - Primary and secondary actions

  3. Security
    - Enable RLS on table
    - Public read access for active configs
    - Admin-only write access

  4. Indexes
    - Active configs lookup
    - Locale filtering
*/

-- Create country_auto_detect_configs table
CREATE TABLE IF NOT EXISTS country_auto_detect_configs (
  id text PRIMARY KEY,
  is_enabled boolean DEFAULT true,
  locale text NOT NULL,
  
  -- Detection signals
  detection_signals jsonb NOT NULL DEFAULT '["navigatorLanguage", "timezone"]'::jsonb,
  
  -- Behavior configuration
  no_redirect boolean DEFAULT true,
  dismiss_persistence text DEFAULT 'localStorage:30d',
  show_once_per_session_if_not_dismissed boolean DEFAULT true,
  
  -- Banner configuration
  banner_position text DEFAULT 'top' CHECK (banner_position IN ('top', 'bottom', 'modal')),
  banner_variant text DEFAULT 'neutral' CHECK (banner_variant IN ('neutral', 'info', 'success', 'warning')),
  banner_copy_template text NOT NULL,
  
  -- Actions
  primary_action_label text NOT NULL,
  primary_action_type text NOT NULL CHECK (primary_action_type IN ('countrySwitch', 'redirect', 'dismiss')),
  primary_action_intent_preserving boolean DEFAULT true,
  
  secondary_action_label text,
  secondary_action_type text CHECK (secondary_action_type IN ('countrySwitch', 'redirect', 'dismiss')),
  
  -- Metadata
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_country_detect_active ON country_auto_detect_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_country_detect_enabled ON country_auto_detect_configs(is_enabled);
CREATE INDEX IF NOT EXISTS idx_country_detect_locale ON country_auto_detect_configs(locale);

-- Enable RLS
ALTER TABLE country_auto_detect_configs ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Anyone can view active country detect configs"
  ON country_auto_detect_configs
  FOR SELECT
  USING (is_active = true AND is_enabled = true);

-- Admin write policy
CREATE POLICY "Admins can manage country detect configs"
  ON country_auto_detect_configs
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
CREATE OR REPLACE FUNCTION update_country_detect_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_country_detect_timestamp
  BEFORE UPDATE ON country_auto_detect_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_country_detect_updated_at();

-- Insert initial configurations
INSERT INTO country_auto_detect_configs (
  id,
  is_enabled,
  locale,
  detection_signals,
  no_redirect,
  dismiss_persistence,
  show_once_per_session_if_not_dismissed,
  banner_position,
  banner_variant,
  banner_copy_template,
  primary_action_label,
  primary_action_type,
  primary_action_intent_preserving,
  secondary_action_label,
  secondary_action_type
) VALUES
  (
    'country-auto-detect-banner',
    true,
    'en',
    '["navigatorLanguage", "timezone", "geoIP_if_available"]'::jsonb,
    true,
    'localStorage:30d',
    true,
    'top',
    'neutral',
    'It looks like you may be in {{countryLabel}} {{flag}}. Want to view templates for {{countryLabel}}?',
    'Switch country',
    'countrySwitch',
    true,
    'Not now',
    'dismiss'
  ),
  (
    'country-auto-detect-banner-fr',
    true,
    'fr',
    '["navigatorLanguage", "timezone", "geoIP_if_available"]'::jsonb,
    true,
    'localStorage:30d',
    true,
    'top',
    'neutral',
    'Il semble que vous soyez en {{countryLabel}} {{flag}}. Voulez-vous voir les modèles pour {{countryLabel}} ?',
    'Changer de pays',
    'countrySwitch',
    true,
    'Plus tard',
    'dismiss'
  )
ON CONFLICT (id) DO NOTHING;