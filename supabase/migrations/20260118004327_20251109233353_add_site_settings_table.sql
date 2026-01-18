/*
  # Add site settings table

  1. New Table
    - `site_settings`
      - `id` (uuid, primary key) - Settings identifier (singleton)
      - `site_name` (text) - Name of the site
      - `site_description` (text) - Site description
      - `default_document_price` (decimal) - Default price for documents
      - `contact_email` (text) - Contact email
      - `enable_ai_generation` (boolean) - Enable AI generation feature
      - `enable_guest_access` (boolean) - Enable guest access
      - `max_documents_per_user` (integer) - Max documents per user
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on site_settings table
    - Only admins can modify settings
    - Everyone can read settings

  3. Notes
    - This is a singleton table (only one row)
    - Insert default values
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  site_name text NOT NULL DEFAULT 'iDoc',
  site_description text NOT NULL DEFAULT 'Créez facilement tous vos documents',
  default_document_price decimal(10, 2) NOT NULL DEFAULT 9.99,
  contact_email text NOT NULL DEFAULT 'contact@idoc.com',
  enable_ai_generation boolean NOT NULL DEFAULT true,
  enable_guest_access boolean NOT NULL DEFAULT true,
  max_documents_per_user integer NOT NULL DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO site_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view site settings"
  ON site_settings FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );