/*
  # Phase 3: API, RegulaSmart et BulkSend

  1. Nouvelles Tables
    - `api_keys` : Clés API pour iDoc Connect
    - `api_logs` : Logs des appels API
    - `jurisdictions` : Juridictions légales supportées
    - `legal_rules` : Règles légales par juridiction
    - `bulk_campaigns` : Campagnes d'envoi groupé
    - `bulk_sends` : Envois individuels d'une campagne

  2. Sécurité
    - RLS activé sur toutes les tables
    - API keys hashées pour sécurité
*/

-- Table des clés API
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  permissions JSONB DEFAULT '["documents:generate"]'::jsonb,
  rate_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON api_keys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);

-- Table des logs API
CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  request_body JSONB,
  response_body JSONB,
  ip_address TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs of own API keys"
  ON api_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM api_keys
      WHERE api_keys.id = api_logs.api_key_id
      AND api_keys.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_api_logs_key ON api_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_created ON api_logs(created_at DESC);

-- Fonction pour nettoyer les vieux logs (30 jours)
CREATE OR REPLACE FUNCTION cleanup_old_api_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM api_logs
  WHERE created_at < now() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Table des juridictions
CREATE TABLE IF NOT EXISTS jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE jurisdictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jurisdictions"
  ON jurisdictions FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage jurisdictions"
  ON jurisdictions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_jurisdictions_code ON jurisdictions(code);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_active ON jurisdictions(is_active);

-- Insérer les juridictions par défaut
INSERT INTO jurisdictions (code, name, country, region, is_active)
VALUES
  ('CA_QC', 'Québec', 'Canada', 'Québec', true),
  ('CA_ON', 'Ontario', 'Canada', 'Ontario', true),
  ('CA_BC', 'Colombie-Britannique', 'Canada', 'Colombie-Britannique', true),
  ('FR', 'France', 'France', NULL, true),
  ('BE', 'Belgique', 'Belgique', NULL, true),
  ('CH', 'Suisse', 'Suisse', NULL, true),
  ('LU', 'Luxembourg', 'Luxembourg', NULL, true)
ON CONFLICT (code) DO NOTHING;

-- Table des règles légales
CREATE TABLE IF NOT EXISTS legal_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
  jurisdiction_id UUID REFERENCES jurisdictions(id) ON DELETE CASCADE,
  clause_key TEXT NOT NULL,
  clause_text TEXT NOT NULL,
  legal_reference TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE legal_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view legal rules"
  ON legal_rules FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage legal rules"
  ON legal_rules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_legal_rules_template ON legal_rules(template_id);
CREATE INDEX IF NOT EXISTS idx_legal_rules_jurisdiction ON legal_rules(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_legal_rules_key ON legal_rules(clause_key);

-- Table des campagnes d'envoi groupé
CREATE TABLE IF NOT EXISTS bulk_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_id UUID REFERENCES document_templates(id),
  total_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  csv_mapping JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE bulk_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bulk campaigns"
  ON bulk_campaigns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bulk campaigns"
  ON bulk_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bulk campaigns"
  ON bulk_campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bulk_campaigns_user ON bulk_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_bulk_campaigns_status ON bulk_campaigns(status);

-- Table des envois individuels
CREATE TABLE IF NOT EXISTS bulk_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES bulk_campaigns(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_data JSONB,
  document_id UUID REFERENCES generated_documents(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bulk_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sends of own campaigns"
  ON bulk_sends FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bulk_campaigns
      WHERE bulk_campaigns.id = bulk_sends.campaign_id
      AND bulk_campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert sends to own campaigns"
  ON bulk_sends FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bulk_campaigns
      WHERE bulk_campaigns.id = bulk_sends.campaign_id
      AND bulk_campaigns.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_bulk_sends_campaign ON bulk_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_bulk_sends_status ON bulk_sends(status);

-- Fonction pour mettre à jour les compteurs de campagne
CREATE OR REPLACE FUNCTION update_campaign_counts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bulk_campaigns
  SET 
    success_count = (SELECT COUNT(*) FROM bulk_sends WHERE campaign_id = NEW.campaign_id AND status = 'sent'),
    error_count = (SELECT COUNT(*) FROM bulk_sends WHERE campaign_id = NEW.campaign_id AND status = 'failed')
  WHERE id = NEW.campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_campaign_counts ON bulk_sends;
CREATE TRIGGER trigger_update_campaign_counts
  AFTER UPDATE OF status ON bulk_sends
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_counts();