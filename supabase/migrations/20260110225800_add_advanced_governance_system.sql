/*
  # Système Avancé de Gouvernance et Alertes
  
  1. Nouvelles Tables
    - `template_alerts` - Alertes critiques pour fallback/quarantaine/kill switch
    - `shadow_test_results` - Résultats des tests shadow mode
    - `alert_settings` - Configuration des alertes (email, slack, etc.)
    
  2. Colonnes Ajoutées aux Templates
    - Pour `idoc_guided_templates`:
      * `trust_level` (text) - LOW | MEDIUM | HIGH
      * `shadow_mode_enabled` (boolean, défaut false)
      * `shadow_tested_at` (timestamptz)
      * `shadow_test_passed` (boolean)
      * `preview_required` (boolean, défaut true)
    
    - Pour `document_templates`:
      * `trust_level` (text) - LOW | MEDIUM | HIGH
      * `shadow_mode_enabled` (boolean, défaut false)
      * `shadow_tested_at` (timestamptz)
      * `shadow_test_passed` (boolean)
      * `preview_required` (boolean, défaut true)
  
  3. System Settings
    - `read_only_emergency_mode` - Mode urgence read-only global
  
  4. Sécurité
    - RLS activé sur toutes les tables
    - Alertes accessibles aux admins
    - Shadow results lisibles par admins
*/

-- Table: template_alerts (alertes critiques)
CREATE TABLE IF NOT EXISTS template_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL CHECK (alert_type IN ('fallback_used', 'template_quarantined', 'kill_switch_activated', 'shadow_test_failed', 'high_trust_modification')),
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
  template_id uuid,
  template_source text CHECK (template_source IN ('idoc_guided_templates', 'document_templates')),
  template_code text,
  environment text NOT NULL CHECK (environment IN ('production', 'staging', 'development')) DEFAULT 'production',
  title text NOT NULL,
  message text NOT NULL,
  details jsonb DEFAULT '{}',
  acknowledged boolean DEFAULT false,
  acknowledged_by uuid REFERENCES auth.users(id),
  acknowledged_at timestamptz,
  sent_email boolean DEFAULT false,
  sent_slack boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_created ON template_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON template_alerts(acknowledged, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON template_alerts(alert_type, environment);
CREATE INDEX IF NOT EXISTS idx_alerts_template ON template_alerts(template_id, created_at DESC);

-- Table: shadow_test_results (résultats shadow mode)
CREATE TABLE IF NOT EXISTS shadow_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL,
  template_source text NOT NULL CHECK (template_source IN ('idoc_guided_templates', 'document_templates')),
  template_code text,
  active_template_id uuid,
  test_data jsonb NOT NULL,
  active_output text,
  shadow_output text,
  render_success boolean NOT NULL,
  error_message text,
  differences_detected boolean DEFAULT false,
  difference_summary text,
  metrics jsonb DEFAULT '{}',
  environment text NOT NULL DEFAULT 'production',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shadow_template ON shadow_test_results(template_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shadow_success ON shadow_test_results(render_success, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shadow_differences ON shadow_test_results(differences_detected, created_at DESC);

-- Table: alert_settings (configuration alertes)
CREATE TABLE IF NOT EXISTS alert_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email_enabled boolean DEFAULT false,
  email_address text,
  slack_enabled boolean DEFAULT false,
  slack_webhook_url text,
  alert_types jsonb DEFAULT '["fallback_used", "template_quarantined", "kill_switch_activated"]',
  min_severity text DEFAULT 'medium' CHECK (min_severity IN ('critical', 'high', 'medium', 'low')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alert_settings_user ON alert_settings(user_id);

-- Ajout trust_level et shadow mode pour idoc_guided_templates
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'trust_level'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN trust_level text DEFAULT 'MEDIUM' CHECK (trust_level IN ('LOW', 'MEDIUM', 'HIGH'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'shadow_mode_enabled'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN shadow_mode_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'shadow_tested_at'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN shadow_tested_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'shadow_test_passed'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN shadow_test_passed boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'preview_required'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN preview_required boolean DEFAULT true;
  END IF;
END $$;

-- Ajout trust_level et shadow mode pour document_templates
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'trust_level'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN trust_level text DEFAULT 'MEDIUM' CHECK (trust_level IN ('LOW', 'MEDIUM', 'HIGH'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'shadow_mode_enabled'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN shadow_mode_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'shadow_tested_at'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN shadow_tested_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'shadow_test_passed'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN shadow_test_passed boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'preview_required'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN preview_required boolean DEFAULT true;
  END IF;
END $$;

-- Index pour trust level
CREATE INDEX IF NOT EXISTS idx_idoc_trust_level ON idoc_guided_templates(trust_level);
CREATE INDEX IF NOT EXISTS idx_doc_trust_level ON document_templates(trust_level);

-- Index pour shadow mode
CREATE INDEX IF NOT EXISTS idx_idoc_shadow ON idoc_guided_templates(shadow_mode_enabled, shadow_tested_at);
CREATE INDEX IF NOT EXISTS idx_doc_shadow ON document_templates(shadow_mode_enabled, shadow_tested_at);

-- Ajouter read-only emergency mode aux system_settings
INSERT INTO system_settings (key, value, description)
VALUES (
  'read_only_emergency_mode',
  '{"enabled": false, "reason": "", "enabled_at": null, "enabled_by": null}',
  'Mode urgence lecture seule - bloque toutes les modifications'
)
ON CONFLICT (key) DO NOTHING;

-- RLS pour template_alerts
ALTER TABLE template_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read alerts"
  ON template_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert alerts"
  ON template_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can acknowledge alerts"
  ON template_alerts FOR UPDATE
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

-- RLS pour shadow_test_results
ALTER TABLE shadow_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read shadow results"
  ON shadow_test_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert shadow results"
  ON shadow_test_results FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS pour alert_settings
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own alert settings"
  ON alert_settings FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Fonction: Créer une alerte
CREATE OR REPLACE FUNCTION create_template_alert(
  p_alert_type text,
  p_severity text,
  p_template_id uuid,
  p_template_source text,
  p_template_code text,
  p_environment text,
  p_title text,
  p_message text,
  p_details jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alert_id uuid;
BEGIN
  -- Vérifier si alerte similaire existe récemment (dernière heure)
  SELECT id INTO v_alert_id
  FROM template_alerts
  WHERE alert_type = p_alert_type
    AND template_id = p_template_id
    AND environment = p_environment
    AND created_at > now() - interval '1 hour'
  ORDER BY created_at DESC
  LIMIT 1;

  -- Si alerte récente existe, ne pas créer de doublon
  IF v_alert_id IS NOT NULL THEN
    RETURN v_alert_id;
  END IF;

  -- Créer nouvelle alerte
  INSERT INTO template_alerts (
    alert_type,
    severity,
    template_id,
    template_source,
    template_code,
    environment,
    title,
    message,
    details
  ) VALUES (
    p_alert_type,
    p_severity,
    p_template_id,
    p_template_source,
    p_template_code,
    p_environment,
    p_title,
    p_message,
    p_details
  )
  RETURNING id INTO v_alert_id;

  RETURN v_alert_id;
END;
$$;

-- Fonction: Mettre à jour métriques de confiance
CREATE OR REPLACE FUNCTION update_template_trust_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Pour les templates HIGH trust avec problèmes → Alertes
  INSERT INTO template_alerts (
    alert_type,
    severity,
    template_id,
    template_source,
    template_code,
    environment,
    title,
    message,
    details
  )
  SELECT 
    'high_trust_modification',
    'high',
    id,
    'idoc_guided_templates',
    template_code,
    'production',
    'Template HIGH trust nécessite attention',
    'Un template de niveau HIGH trust a été modifié ou présente des problèmes',
    jsonb_build_object(
      'fallback_count', fallback_count,
      'quarantined', quarantined,
      'trust_level', trust_level
    )
  FROM idoc_guided_templates
  WHERE trust_level = 'HIGH'
    AND (fallback_count > 0 OR quarantined = true)
    AND NOT EXISTS (
      SELECT 1 FROM template_alerts
      WHERE template_alerts.template_id = idoc_guided_templates.id
        AND template_alerts.alert_type = 'high_trust_modification'
        AND template_alerts.created_at > now() - interval '24 hours'
    );
END;
$$;

-- Commentaires
COMMENT ON TABLE template_alerts IS 'Alertes critiques pour événements templates (fallback, quarantaine, kill switch)';
COMMENT ON TABLE shadow_test_results IS 'Résultats des tests shadow mode (comparaison templates actif vs shadow)';
COMMENT ON TABLE alert_settings IS 'Configuration des alertes par utilisateur (email, slack)';
COMMENT ON COLUMN idoc_guided_templates.trust_level IS 'Niveau de confiance/risque: LOW | MEDIUM | HIGH';
COMMENT ON COLUMN idoc_guided_templates.shadow_mode_enabled IS 'Template en mode shadow (test silencieux)';
COMMENT ON COLUMN idoc_guided_templates.preview_required IS 'Preview métier obligatoire avant publication';
