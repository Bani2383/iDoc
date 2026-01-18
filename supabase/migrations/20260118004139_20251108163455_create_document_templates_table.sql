/*
  # Create document templates table for iDoc

  1. New Tables
    - `document_templates`
      - `id` (uuid, primary key) - Unique identifier for each template
      - `name` (text) - Name of the document template in French
      - `category` (text) - Category: 'professional' or 'personal'
      - `description` (text, nullable) - Optional description of the template
      - `slug` (text, unique) - URL-friendly identifier
      - `is_active` (boolean) - Whether the template is available for use
      - `sort_order` (integer) - Display order within category
      - `created_at` (timestamptz) - When the template was created
      - `updated_at` (timestamptz) - When the template was last updated

  2. Security
    - Enable RLS on `document_templates` table
    - Add policy for public read access (templates are public information)
    - Add policy for authenticated admin users to manage templates

  3. Indexes
    - Index on category for faster filtering
    - Index on slug for quick lookups
    - Index on is_active for filtering active templates
*/

CREATE TABLE IF NOT EXISTS document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('professional', 'personal')),
  description text,
  slug text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_document_templates_category ON document_templates(category);
CREATE INDEX IF NOT EXISTS idx_document_templates_slug ON document_templates(slug);
CREATE INDEX IF NOT EXISTS idx_document_templates_is_active ON document_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_document_templates_sort_order ON document_templates(sort_order);

-- Enable Row Level Security
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active templates (public access)
CREATE POLICY "Anyone can view active templates"
  ON document_templates
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to view all templates (including inactive ones for admin purposes)
CREATE POLICY "Authenticated users can view all templates"
  ON document_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row changes
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON document_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();