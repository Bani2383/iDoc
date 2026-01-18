/*
  # Module Gestion Clients + Dossiers + Workflow

  1. Nouvelles Tables
    A) clients - Gestion des clients
    B) dossiers - Dossiers projet avec workflow de statut
    C) dossier_documents - Relation dossiers <-> documents générés
    D) dossier_activity - Journal d'activité des dossiers

  2. Enums
    - dossier_status: draft, in_review, approved, signed, archived
    - document_status: draft, in_review, approved, signed
    - priority: low, normal, high
    - activity_type: created, updated, status_change, document_added, etc.

  3. Security
    - RLS sur toutes les tables
    - Admins: accès complet
    - Users: accès à leurs propres dossiers uniquement
*/

-- Types ENUM pour les statuts
DO $$ BEGIN
  CREATE TYPE dossier_status AS ENUM ('draft', 'in_review', 'approved', 'signed', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE document_status AS ENUM ('draft', 'in_review', 'approved', 'signed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Table: clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  company text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: dossiers
CREATE TABLE IF NOT EXISTS dossiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  status dossier_status DEFAULT 'draft',
  priority priority_level DEFAULT 'normal',
  created_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}',
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: dossier_documents (relation dossier <-> generated_documents)
CREATE TABLE IF NOT EXISTS dossier_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid REFERENCES dossiers(id) ON DELETE CASCADE NOT NULL,
  document_id uuid NOT NULL,
  status document_status DEFAULT 'draft',
  review_comments text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Table: dossier_activity (historique)
CREATE TABLE IF NOT EXISTS dossier_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid REFERENCES dossiers(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossier_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies: clients
CREATE POLICY "Admins can view all clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own client profile"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update clients"
  ON clients
  FOR UPDATE
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

-- RLS Policies: dossiers
CREATE POLICY "Admins can view all dossiers"
  ON dossiers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view dossiers they created"
  ON dossiers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by_user_id);

CREATE POLICY "Users can view dossiers linked to their client profile"
  ON dossiers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = dossiers.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert dossiers"
  ON dossiers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update dossiers"
  ON dossiers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies: dossier_documents
CREATE POLICY "Users can view documents in their dossiers"
  ON dossier_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers
      WHERE dossiers.id = dossier_documents.dossier_id
      AND (
        dossiers.created_by_user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Admins can insert dossier documents"
  ON dossier_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update dossier documents"
  ON dossier_documents
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies: dossier_activity
CREATE POLICY "Users can view activity in their dossiers"
  ON dossier_activity
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers
      WHERE dossiers.id = dossier_activity.dossier_id
      AND (
        dossiers.created_by_user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "System can insert activity"
  ON dossier_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

CREATE INDEX IF NOT EXISTS idx_dossiers_client_id ON dossiers(client_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_created_by ON dossiers(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_status ON dossiers(status);
CREATE INDEX IF NOT EXISTS idx_dossiers_created_at ON dossiers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_dossier_documents_dossier_id ON dossier_documents(dossier_id);
CREATE INDEX IF NOT EXISTS idx_dossier_documents_document_id ON dossier_documents(document_id);

CREATE INDEX IF NOT EXISTS idx_dossier_activity_dossier_id ON dossier_activity(dossier_id);
CREATE INDEX IF NOT EXISTS idx_dossier_activity_created_at ON dossier_activity(created_at DESC);

-- Triggers pour updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dossiers_updated_at
  BEFORE UPDATE ON dossiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour logger une activité de dossier
CREATE OR REPLACE FUNCTION log_dossier_activity(
  p_dossier_id uuid,
  p_user_id uuid,
  p_activity_type text,
  p_details jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO dossier_activity (
    dossier_id,
    user_id,
    activity_type,
    details
  ) VALUES (
    p_dossier_id,
    p_user_id,
    p_activity_type,
    p_details
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour changer le statut d'un dossier avec log
CREATE OR REPLACE FUNCTION change_dossier_status(
  p_dossier_id uuid,
  p_new_status dossier_status,
  p_user_id uuid,
  p_notes text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  v_old_status dossier_status;
BEGIN
  -- Récupérer l'ancien statut
  SELECT status INTO v_old_status
  FROM dossiers
  WHERE id = p_dossier_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dossier not found';
  END IF;
  
  -- Mettre à jour le statut
  UPDATE dossiers
  SET status = p_new_status, updated_at = now()
  WHERE id = p_dossier_id;
  
  -- Logger l'activité
  PERFORM log_dossier_activity(
    p_dossier_id,
    p_user_id,
    'status_change',
    jsonb_build_object(
      'old_status', v_old_status,
      'new_status', p_new_status,
      'notes', p_notes
    )
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;