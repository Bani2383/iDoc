/*
  # Module Lab des Modèles - Système de Conformité

  1. Modifications Tables Existantes
    - Ajout colonnes review_status, last_reviewed_at, last_reviewed_by, internal_notes à document_templates
    
  2. Nouvelles Tables
    A) template_test_runs - Tests et validations des modèles
    B) template_certificates - Certificats de conformité interne

  3. Enums
    - review_status: draft, in_review, approved, rejected, published
    - test_result: passed, failed
    - certificate_status: valid, revoked

  4. Security
    - RLS strict : ADMIN uniquement
    - Audit de toutes les actions
*/

-- Types ENUM
DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('draft', 'in_review', 'approved', 'rejected', 'published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE test_result AS ENUM ('passed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE certificate_status AS ENUM ('valid', 'revoked');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Ajouter colonnes de review à document_templates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'review_status'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN review_status review_status DEFAULT 'draft';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'last_reviewed_at'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN last_reviewed_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'last_reviewed_by'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN last_reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'internal_notes'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN internal_notes text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'version'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN version integer DEFAULT 1;
  END IF;
END $$;

-- Table: template_test_runs (campagnes de test)
CREATE TABLE IF NOT EXISTS template_test_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES document_templates(id) ON DELETE CASCADE NOT NULL,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  test_values jsonb DEFAULT '{}',
  rendered_preview text,
  result test_result NOT NULL,
  issues_found text,
  execution_time_ms integer,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Table: template_certificates (certificats de conformité)
CREATE TABLE IF NOT EXISTS template_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES document_templates(id) ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  approved_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz DEFAULT now(),
  summary text,
  status certificate_status DEFAULT 'valid',
  metadata jsonb DEFAULT '{}',
  checklist jsonb DEFAULT '{}',
  test_runs_included uuid[],
  created_at timestamptz DEFAULT now(),
  revoked_at timestamptz,
  revoked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  revoke_reason text
);

-- Enable RLS
ALTER TABLE template_test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: template_test_runs (ADMIN uniquement)
CREATE POLICY "Only admins can view template test runs"
  ON template_test_runs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert template test runs"
  ON template_test_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies: template_certificates (ADMIN uniquement)
CREATE POLICY "Only admins can view template certificates"
  ON template_certificates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert template certificates"
  ON template_certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update template certificates"
  ON template_certificates
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_template_test_runs_template_id ON template_test_runs(template_id);
CREATE INDEX IF NOT EXISTS idx_template_test_runs_admin_id ON template_test_runs(admin_id);
CREATE INDEX IF NOT EXISTS idx_template_test_runs_result ON template_test_runs(result);
CREATE INDEX IF NOT EXISTS idx_template_test_runs_created_at ON template_test_runs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_template_certificates_template_id ON template_certificates(template_id);
CREATE INDEX IF NOT EXISTS idx_template_certificates_status ON template_certificates(status);
CREATE INDEX IF NOT EXISTS idx_template_certificates_approved_by ON template_certificates(approved_by_user_id);

CREATE INDEX IF NOT EXISTS idx_document_templates_review_status ON document_templates(review_status);
CREATE INDEX IF NOT EXISTS idx_document_templates_last_reviewed ON document_templates(last_reviewed_at DESC);

-- Fonction: Exécuter un test de template
CREATE OR REPLACE FUNCTION run_template_test(
  p_template_id uuid,
  p_admin_id uuid,
  p_test_values jsonb,
  p_result test_result,
  p_issues_found text DEFAULT NULL,
  p_execution_time_ms integer DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  test_run_id uuid;
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;
  
  -- Créer le test run
  INSERT INTO template_test_runs (
    template_id,
    admin_id,
    test_values,
    result,
    issues_found,
    execution_time_ms
  ) VALUES (
    p_template_id,
    p_admin_id,
    p_test_values,
    p_result,
    p_issues_found,
    p_execution_time_ms
  )
  RETURNING id INTO test_run_id;
  
  -- Logger dans audit
  PERFORM log_admin_action(
    p_admin_id,
    'template_test_run',
    'template',
    p_template_id,
    jsonb_build_object('result', p_result, 'test_run_id', test_run_id)
  );
  
  RETURN test_run_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Approuver un template (créer certificat)
CREATE OR REPLACE FUNCTION approve_template(
  p_template_id uuid,
  p_admin_id uuid,
  p_summary text,
  p_checklist jsonb DEFAULT '{}',
  p_test_runs_included uuid[] DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  cert_id uuid;
  template_version integer;
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;
  
  -- Récupérer la version du template
  SELECT version INTO template_version
  FROM document_templates
  WHERE id = p_template_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found';
  END IF;
  
  -- Mettre à jour le statut du template
  UPDATE document_templates
  SET 
    review_status = 'approved',
    last_reviewed_at = now(),
    last_reviewed_by = p_admin_id
  WHERE id = p_template_id;
  
  -- Créer le certificat
  INSERT INTO template_certificates (
    template_id,
    version_number,
    approved_by_user_id,
    summary,
    status,
    checklist,
    test_runs_included
  ) VALUES (
    p_template_id,
    template_version,
    p_admin_id,
    p_summary,
    'valid',
    p_checklist,
    p_test_runs_included
  )
  RETURNING id INTO cert_id;
  
  -- Logger dans audit
  PERFORM log_admin_action(
    p_admin_id,
    'template_approved',
    'template',
    p_template_id,
    jsonb_build_object('certificate_id', cert_id, 'version', template_version)
  );
  
  RETURN cert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Rejeter un template
CREATE OR REPLACE FUNCTION reject_template(
  p_template_id uuid,
  p_admin_id uuid,
  p_internal_notes text,
  p_issues_found text
)
RETURNS boolean AS $$
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;
  
  -- Mettre à jour le statut du template
  UPDATE document_templates
  SET 
    review_status = 'rejected',
    last_reviewed_at = now(),
    last_reviewed_by = p_admin_id,
    internal_notes = p_internal_notes
  WHERE id = p_template_id;
  
  -- Logger dans audit
  PERFORM log_admin_action(
    p_admin_id,
    'template_rejected',
    'template',
    p_template_id,
    jsonb_build_object('issues', p_issues_found, 'notes', p_internal_notes)
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Publier un template (doit être approved)
CREATE OR REPLACE FUNCTION publish_template(
  p_template_id uuid,
  p_admin_id uuid
)
RETURNS boolean AS $$
DECLARE
  current_status review_status;
  has_valid_cert boolean;
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;
  
  -- Vérifier le statut actuel
  SELECT review_status INTO current_status
  FROM document_templates
  WHERE id = p_template_id;
  
  IF current_status != 'approved' THEN
    RAISE EXCEPTION 'Template must be approved before publishing';
  END IF;
  
  -- Vérifier qu'un certificat valide existe
  SELECT EXISTS (
    SELECT 1 FROM template_certificates
    WHERE template_id = p_template_id
    AND status = 'valid'
  ) INTO has_valid_cert;
  
  IF NOT has_valid_cert THEN
    RAISE EXCEPTION 'Template must have a valid certificate before publishing';
  END IF;
  
  -- Publier
  UPDATE document_templates
  SET review_status = 'published'
  WHERE id = p_template_id;
  
  -- Logger
  PERFORM log_admin_action(
    p_admin_id,
    'template_published',
    'template',
    p_template_id,
    '{}'::jsonb
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vue pour les templates éligibles à la vente (approved ou published uniquement)
CREATE OR REPLACE VIEW templates_available_for_sale AS
SELECT t.*
FROM document_templates t
WHERE t.review_status IN ('approved', 'published')
AND EXISTS (
  SELECT 1 FROM template_certificates c
  WHERE c.template_id = t.id
  AND c.status = 'valid'
);