/*
  # iDoc Guided Templates System - Isolated Module

  Creates new isolated system for guided templates (iDoc generator).
  Does NOT modify existing template tables or systems.
*/

-- ============================================================================
-- IDOC GUIDED TEMPLATES - Master Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS idoc_guided_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  template_code text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  
  title jsonb NOT NULL DEFAULT '{}'::jsonb,
  description jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL,
  sub_category text,
  
  template_content jsonb NOT NULL,
  routing_conditions jsonb DEFAULT '[]'::jsonb,
  
  required_variables jsonb DEFAULT '[]'::jsonb,
  optional_variables jsonb DEFAULT '[]'::jsonb,
  
  meta_title jsonb DEFAULT '{}'::jsonb,
  meta_description jsonb DEFAULT '{}'::jsonb,
  keywords jsonb DEFAULT '[]'::jsonb,
  
  free_tier_enabled boolean DEFAULT true,
  premium_tier_enabled boolean DEFAULT true,
  free_features jsonb DEFAULT '["PDF"]'::jsonb,
  premium_features jsonb DEFAULT '["PDF", "DOCX", "EDIT", "VARIANTS"]'::jsonb,
  
  is_active boolean DEFAULT true,
  is_published boolean DEFAULT false,
  usage_count int DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_idoc_templates_category ON idoc_guided_templates(category);
CREATE INDEX IF NOT EXISTS idx_idoc_templates_slug ON idoc_guided_templates(slug);
CREATE INDEX IF NOT EXISTS idx_idoc_templates_active ON idoc_guided_templates(is_active, is_published);

-- ============================================================================
-- IDOC TEMPLATE SECTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS idoc_template_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  section_code text UNIQUE NOT NULL,
  title jsonb NOT NULL DEFAULT '{}'::jsonb,
  description jsonb DEFAULT '{}'::jsonb,
  content jsonb NOT NULL,
  
  include_if jsonb DEFAULT '[]'::jsonb,
  exclude_if jsonb DEFAULT '[]'::jsonb,
  is_required boolean DEFAULT false,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_idoc_sections_code ON idoc_template_sections(section_code);
CREATE INDEX IF NOT EXISTS idx_idoc_sections_active ON idoc_template_sections(is_active);

-- ============================================================================
-- IDOC TEMPLATE SECTIONS MAPPING
-- ============================================================================

CREATE TABLE IF NOT EXISTS idoc_template_section_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES idoc_guided_templates(id) ON DELETE CASCADE,
  section_id uuid REFERENCES idoc_template_sections(id) ON DELETE CASCADE,
  display_order int DEFAULT 0,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(template_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_idoc_mapping_template ON idoc_template_section_mapping(template_id);
CREATE INDEX IF NOT EXISTS idx_idoc_mapping_section ON idoc_template_section_mapping(section_id);

-- ============================================================================
-- IDOC GENERATED DOCUMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS idoc_generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  template_id uuid REFERENCES idoc_guided_templates(id) ON DELETE SET NULL,
  template_code text NOT NULL,
  form_data jsonb NOT NULL,
  selected_sections jsonb DEFAULT '[]'::jsonb,
  generated_content text,
  export_format text DEFAULT 'PDF',
  file_url text,
  tier_used text DEFAULT 'free',
  payment_id uuid,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_idoc_docs_user ON idoc_generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_idoc_docs_template ON idoc_generated_documents(template_id);
CREATE INDEX IF NOT EXISTS idx_idoc_docs_session ON idoc_generated_documents(session_id);
CREATE INDEX IF NOT EXISTS idx_idoc_docs_created ON idoc_generated_documents(created_at DESC);

-- ============================================================================
-- IDOC TEMPLATE ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS idoc_template_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES idoc_guided_templates(id) ON DELETE CASCADE,
  template_code text NOT NULL,
  event_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_idoc_analytics_template ON idoc_template_analytics(template_id);
CREATE INDEX IF NOT EXISTS idx_idoc_analytics_event ON idoc_template_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_idoc_analytics_created ON idoc_template_analytics(created_at DESC);

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE idoc_guided_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE idoc_template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE idoc_template_section_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE idoc_generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE idoc_template_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published idoc templates"
  ON idoc_guided_templates FOR SELECT TO public
  USING (is_published = true AND is_active = true);

CREATE POLICY "Admins can manage idoc templates"
  ON idoc_guided_templates FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Public can view active idoc sections"
  ON idoc_template_sections FOR SELECT TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage idoc sections"
  ON idoc_template_sections FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Public can view idoc section mappings"
  ON idoc_template_section_mapping FOR SELECT TO public
  USING (true);

CREATE POLICY "Admins can manage idoc section mappings"
  ON idoc_template_section_mapping FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Users can view own idoc documents"
  ON idoc_generated_documents FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can create idoc documents"
  ON idoc_generated_documents FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all idoc documents"
  ON idoc_generated_documents FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

CREATE POLICY "Public can log idoc analytics"
  ON idoc_template_analytics FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view idoc analytics"
  ON idoc_template_analytics FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION increment_idoc_template_usage(template_id_param uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE idoc_guided_templates SET usage_count = usage_count + 1, updated_at = now()
  WHERE id = template_id_param;
END; $$;

CREATE OR REPLACE FUNCTION get_idoc_template_by_slug(slug_param text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
  SELECT to_jsonb(t.*) INTO result FROM idoc_guided_templates t
  WHERE t.slug = slug_param AND t.is_published = true AND t.is_active = true;
  RETURN result;
END; $$;

CREATE OR REPLACE FUNCTION get_idoc_template_sections(template_id_param uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
  SELECT jsonb_agg(jsonb_build_object('section', to_jsonb(s.*), 'display_order', m.display_order, 'is_default', m.is_default) ORDER BY m.display_order, s.display_order)
  INTO result FROM idoc_template_section_mapping m
  JOIN idoc_template_sections s ON s.id = m.section_id
  WHERE m.template_id = template_id_param AND s.is_active = true;
  RETURN COALESCE(result, '[]'::jsonb);
END; $$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_idoc_templates_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS idoc_templates_updated_at ON idoc_guided_templates;
  CREATE TRIGGER idoc_templates_updated_at BEFORE UPDATE ON idoc_guided_templates FOR EACH ROW EXECUTE FUNCTION update_idoc_templates_updated_at();
  
  DROP TRIGGER IF EXISTS idoc_sections_updated_at ON idoc_template_sections;
  CREATE TRIGGER idoc_sections_updated_at BEFORE UPDATE ON idoc_template_sections FOR EACH ROW EXECUTE FUNCTION update_idoc_templates_updated_at();
END $$;
