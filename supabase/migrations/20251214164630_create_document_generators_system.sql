/*
  # Create Document Generators System

  1. New Tables
    - `document_generators` - Main generator configurations
    - `generator_steps` - Multi-step form steps for each generator
    - `generator_fields` - Form fields for each step

  2. Features
    - Multi-country support (CA, US, UK, EU, AU)
    - Multi-locale support (en-CA, en-US, en-GB, fr-FR, en-AU)
    - Step-by-step form configuration
    - Payment configuration per generator
    - Country-specific disclaimers

  3. Security
    - Enable RLS on all tables
    - Public read access for active generators
    - Admin-only write access

  4. Indexes
    - Country and locale lookups
    - Slug lookups for routing
    - Step ordering
*/

-- Create document_generators table
CREATE TABLE IF NOT EXISTS document_generators (
  id text PRIMARY KEY,
  country_code text NOT NULL,
  locale text NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  disclaimer text NOT NULL,
  
  -- Payment configuration
  price numeric(10,2) NOT NULL,
  currency text NOT NULL CHECK (currency IN ('CAD', 'USD', 'GBP', 'EUR', 'AUD')),
  pre_payment_notice text,
  checkout_disclaimer text,
  
  -- Metadata
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create generator_steps table
CREATE TABLE IF NOT EXISTS generator_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generator_id text NOT NULL REFERENCES document_generators(id) ON DELETE CASCADE,
  step_id text NOT NULL,
  step_order integer NOT NULL,
  title text NOT NULL,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(generator_id, step_id),
  UNIQUE(generator_id, step_order)
);

-- Create generator_fields table
CREATE TABLE IF NOT EXISTS generator_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_uuid uuid NOT NULL REFERENCES generator_steps(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  field_order integer NOT NULL,
  label text NOT NULL,
  field_type text NOT NULL CHECK (field_type IN ('text', 'textarea', 'select', 'date', 'email', 'number')),
  is_required boolean DEFAULT false,
  placeholder text,
  options jsonb,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(step_uuid, field_key),
  UNIQUE(step_uuid, field_order)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_generators_country ON document_generators(country_code);
CREATE INDEX IF NOT EXISTS idx_generators_locale ON document_generators(locale);
CREATE INDEX IF NOT EXISTS idx_generators_slug ON document_generators(slug);
CREATE INDEX IF NOT EXISTS idx_generators_active ON document_generators(is_active);

CREATE INDEX IF NOT EXISTS idx_steps_generator ON generator_steps(generator_id);
CREATE INDEX IF NOT EXISTS idx_steps_order ON generator_steps(generator_id, step_order);

CREATE INDEX IF NOT EXISTS idx_fields_step ON generator_fields(step_uuid);
CREATE INDEX IF NOT EXISTS idx_fields_order ON generator_fields(step_uuid, field_order);

-- Enable RLS
ALTER TABLE document_generators ENABLE ROW LEVEL SECURITY;
ALTER TABLE generator_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE generator_fields ENABLE ROW LEVEL SECURITY;

-- Public read policies for active generators
CREATE POLICY "Anyone can view active generators"
  ON document_generators
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view generator steps"
  ON generator_steps
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM document_generators
      WHERE document_generators.id = generator_steps.generator_id
      AND document_generators.is_active = true
    )
  );

CREATE POLICY "Anyone can view generator fields"
  ON generator_fields
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM generator_steps
      JOIN document_generators ON document_generators.id = generator_steps.generator_id
      WHERE generator_steps.id = generator_fields.step_uuid
      AND document_generators.is_active = true
    )
  );

-- Admin write policies
CREATE POLICY "Admins can manage generators"
  ON document_generators
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

CREATE POLICY "Admins can manage generator steps"
  ON generator_steps
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

CREATE POLICY "Admins can manage generator fields"
  ON generator_fields
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
CREATE OR REPLACE FUNCTION update_generators_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_generators_timestamp
  BEFORE UPDATE ON document_generators
  FOR EACH ROW
  EXECUTE FUNCTION update_generators_updated_at();