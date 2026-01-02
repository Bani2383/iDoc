/*
  # Système de Sécurité Production - Centre de Validation
  
  1. Nouvelles Tables
    - `template_health_log` - Journal de santé des templates
    - `template_render_fallbacks` - Logs des fallbacks utilisés
    - `system_settings` - Paramètres système (kill switch)
    
  2. Colonnes Ajoutées aux Templates
    - Pour `idoc_guided_templates`:
      * `eligible_for_production` (boolean, défaut false)
      * `last_smoke_test_at` (timestamptz)
      * `smoke_test_passed` (boolean)
      * `quarantined` (boolean, défaut false)
      * `quarantine_reason` (text)
      * `fallback_count` (integer, défaut 0)
    
    - Pour `document_templates`:
      * `eligible_for_production` (boolean, défaut false)
      * `last_smoke_test_at` (timestamptz)
      * `smoke_test_passed` (boolean)
      * `quarantined` (boolean, défaut false)
      * `quarantine_reason` (text)
      * `fallback_count` (integer, défaut 0)
  
  3. Sécurité
    - RLS activé sur toutes les nouvelles tables
    - Logs accessibles en lecture aux admins
    - Kill switch modifiable par admins uniquement
*/

-- Table: template_health_log (logs de santé)
CREATE TABLE IF NOT EXISTS template_health_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL,
  template_source text NOT NULL CHECK (template_source IN ('idoc_guided_templates', 'document_templates')),
  event_type text NOT NULL CHECK (event_type IN ('preview_run', 'auto_fix_applied', 'smoke_test_passed', 'smoke_test_failed', 'blocked_unverified', 'render_failed', 'fallback_used', 'quarantined', 'published')),
  environment text NOT NULL DEFAULT 'production' CHECK (environment IN ('production', 'staging', 'development')),
  details jsonb DEFAULT '{}',
  error_message text,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_log_template ON template_health_log(template_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_log_event ON template_health_log(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_log_environment ON template_health_log(environment, event_type);

-- Table: template_render_fallbacks (logs des fallbacks)
CREATE TABLE IF NOT EXISTS template_render_fallbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL,
  template_source text NOT NULL CHECK (template_source IN ('idoc_guided_templates', 'document_templates')),
  template_code text,
  error_message text NOT NULL,
  error_stack text,
  user_id uuid REFERENCES auth.users(id),
  environment text NOT NULL DEFAULT 'production',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fallbacks_template ON template_render_fallbacks(template_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fallbacks_created ON template_render_fallbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fallbacks_environment ON template_render_fallbacks(environment);

-- Table: system_settings (paramètres système)
CREATE TABLE IF NOT EXISTS system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

-- Insérer le kill switch par défaut
INSERT INTO system_settings (key, value, description)
VALUES (
  'template_kill_switch',
  '{"enabled": false, "reason": "", "enabled_at": null, "enabled_by": null}',
  'Kill switch global pour forcer tous les templates à utiliser le fallback'
)
ON CONFLICT (key) DO NOTHING;

-- Ajout des colonnes de sécurité pour idoc_guided_templates
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'eligible_for_production'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN eligible_for_production boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'last_smoke_test_at'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN last_smoke_test_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'smoke_test_passed'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN smoke_test_passed boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'quarantined'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN quarantined boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'quarantine_reason'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN quarantine_reason text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'fallback_count'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN fallback_count integer DEFAULT 0;
  END IF;
END $$;

-- Ajout des colonnes de sécurité pour document_templates
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'eligible_for_production'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN eligible_for_production boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'last_smoke_test_at'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN last_smoke_test_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'smoke_test_passed'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN smoke_test_passed boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'quarantined'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN quarantined boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'quarantine_reason'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN quarantine_reason text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'fallback_count'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN fallback_count integer DEFAULT 0;
  END IF;
END $$;

-- Index pour les requêtes de production
CREATE INDEX IF NOT EXISTS idx_idoc_production_eligible ON idoc_guided_templates(eligible_for_production, quarantined);
CREATE INDEX IF NOT EXISTS idx_doc_production_eligible ON document_templates(eligible_for_production, quarantined);

-- RLS pour template_health_log
ALTER TABLE template_health_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read health logs"
  ON template_health_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert health logs"
  ON template_health_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS pour template_render_fallbacks
ALTER TABLE template_render_fallbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read fallback logs"
  ON template_render_fallbacks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert fallback logs"
  ON template_render_fallbacks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS pour system_settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read system settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update system settings"
  ON system_settings FOR UPDATE
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

-- Fonction: Calculer l'éligibilité production
CREATE OR REPLACE FUNCTION calculate_production_eligibility()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Pour idoc_guided_templates
  UPDATE idoc_guided_templates
  SET eligible_for_production = (
    status = 'verified' AND
    verification_required = false AND
    smoke_test_passed = true AND
    quarantined = false
  );

  -- Pour document_templates
  UPDATE document_templates
  SET eligible_for_production = (
    smoke_test_passed = true AND
    quarantined = false
  );
END;
$$;

-- Commentaires
COMMENT ON TABLE template_health_log IS 'Journal de santé et événements des templates';
COMMENT ON TABLE template_render_fallbacks IS 'Logs des fallbacks de rendu utilisés en production';
COMMENT ON TABLE system_settings IS 'Paramètres système incluant le kill switch';
COMMENT ON COLUMN idoc_guided_templates.eligible_for_production IS 'Template éligible pour production (auto-calculé)';
COMMENT ON COLUMN idoc_guided_templates.quarantined IS 'Template mis en quarantaine suite à erreurs répétées';
COMMENT ON COLUMN idoc_guided_templates.fallback_count IS 'Nombre de fois où le fallback a été utilisé';
