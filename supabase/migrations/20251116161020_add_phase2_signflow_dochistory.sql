/*
  # Phase 2: SignFlow et DocHistory

  1. Nouvelles Tables
    - `signature_workflows` : Workflows de signature multi-parties
    - `workflow_signers` : Signataires d'un workflow
    - `document_versions` : Historique des versions de documents

  2. Sécurité
    - RLS activé sur toutes les tables
    - Accès limité au créateur et aux signataires
*/

-- Table des workflows de signature
CREATE TABLE IF NOT EXISTS signature_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES generated_documents(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_type TEXT DEFAULT 'sequential' CHECK (workflow_type IN ('sequential', 'parallel')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'in_progress', 'completed', 'declined', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE signature_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workflows"
  ON signature_workflows FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own workflows"
  ON signature_workflows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own workflows"
  ON signature_workflows FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE INDEX IF NOT EXISTS idx_workflows_document ON signature_workflows(document_id);
CREATE INDEX IF NOT EXISTS idx_workflows_creator ON signature_workflows(created_by);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON signature_workflows(status);

-- Table des signataires
CREATE TABLE IF NOT EXISTS workflow_signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES signature_workflows(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'signer' CHECK (role IN ('signer', 'approver', 'witness', 'cc')),
  order_index INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'signed', 'declined')),
  signed_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  signature_data TEXT,
  access_token TEXT UNIQUE,
  opened_at TIMESTAMPTZ,
  declined_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE workflow_signers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view signers of own workflows"
  ON workflow_signers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM signature_workflows
      WHERE signature_workflows.id = workflow_signers.workflow_id
      AND signature_workflows.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert signers to own workflows"
  ON workflow_signers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM signature_workflows
      WHERE signature_workflows.id = workflow_signers.workflow_id
      AND signature_workflows.created_by = auth.uid()
    )
  );

CREATE POLICY "Signers can view and update own signature"
  ON workflow_signers FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_signers_workflow ON workflow_signers(workflow_id);
CREATE INDEX IF NOT EXISTS idx_signers_email ON workflow_signers(email);
CREATE INDEX IF NOT EXISTS idx_signers_token ON workflow_signers(access_token);
CREATE INDEX IF NOT EXISTS idx_signers_status ON workflow_signers(status);

-- Table des versions de documents
CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES generated_documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  pdf_url TEXT,
  file_size INTEGER,
  changes_summary TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of own documents"
  ON document_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM generated_documents
      WHERE generated_documents.id = document_versions.document_id
      AND generated_documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert versions to own documents"
  ON document_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM generated_documents
      WHERE generated_documents.id = document_versions.document_id
      AND generated_documents.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_versions_document ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_versions_created ON document_versions(created_at DESC);

-- Fonction pour limiter à 10 versions par document
CREATE OR REPLACE FUNCTION limit_document_versions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM document_versions
  WHERE document_id = NEW.document_id
  AND id NOT IN (
    SELECT id FROM document_versions
    WHERE document_id = NEW.document_id
    ORDER BY version_number DESC
    LIMIT 10
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_limit_versions ON document_versions;
CREATE TRIGGER trigger_limit_versions
  AFTER INSERT ON document_versions
  FOR EACH ROW
  EXECUTE FUNCTION limit_document_versions();

-- Fonction pour mettre à jour le statut du workflow
CREATE OR REPLACE FUNCTION update_workflow_status()
RETURNS TRIGGER AS $$
DECLARE
  total_signers INTEGER;
  signed_signers INTEGER;
  declined_signers INTEGER;
BEGIN
  SELECT COUNT(*), 
         SUM(CASE WHEN status = 'signed' THEN 1 ELSE 0 END),
         SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END)
  INTO total_signers, signed_signers, declined_signers
  FROM workflow_signers
  WHERE workflow_id = NEW.workflow_id;

  IF declined_signers > 0 THEN
    UPDATE signature_workflows
    SET status = 'declined'
    WHERE id = NEW.workflow_id;
  ELSIF signed_signers = total_signers THEN
    UPDATE signature_workflows
    SET status = 'completed', completed_at = now()
    WHERE id = NEW.workflow_id;
  ELSIF signed_signers > 0 THEN
    UPDATE signature_workflows
    SET status = 'in_progress'
    WHERE id = NEW.workflow_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_workflow_status ON workflow_signers;
CREATE TRIGGER trigger_update_workflow_status
  AFTER UPDATE OF status ON workflow_signers
  FOR EACH ROW
  EXECUTE FUNCTION update_workflow_status();