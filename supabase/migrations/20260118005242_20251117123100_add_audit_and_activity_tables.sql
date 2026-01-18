/*
  # Ajout des tables AuditLog, UserActivity et système de rôles

  1. Nouvelles Tables
    A) audit_log - Journal d'audit pour toutes les actions admin
    B) user_activity - Tracking complet des activités utilisateurs
    
  2. Modifications
    - Ajout de la colonne 'role' à user_profiles (si pas déjà présente)
    - Ajout de la colonne 'login_count' à user_profiles
    
  3. Security
    - Toutes les tables protégées par RLS
    - Accès ADMIN uniquement pour audit_log
    - Accès ADMIN uniquement pour user_activity
*/

-- Table: audit_log (Journal d'audit admin)
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  target_type text,
  target_id uuid,
  timestamp timestamptz DEFAULT now(),
  details jsonb DEFAULT '{}',
  valeur_avant jsonb,
  valeur_apres jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Table: user_activity (Tracking activité utilisateurs)
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  activity_type text NOT NULL,
  page_url text,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Ajouter colonne login_count si elle n'existe pas déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'login_count'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN login_count integer DEFAULT 0;
  END IF;
END $$;

-- Ajouter colonne last_login_at si elle n'existe pas déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_login_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_login_at timestamptz;
  END IF;
END $$;

-- Ajouter colonne last_ip si elle n'existe pas déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_ip'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_ip text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies: audit_log (ADMIN uniquement)
CREATE POLICY "Only admins can view audit log"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert audit log"
  ON audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies: user_activity
CREATE POLICY "Users can view own activity"
  ON user_activity
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity"
  ON user_activity
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert activity"
  ON user_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action_type ON audit_log(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_target ON audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_timestamp ON user_activity(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_login_count ON user_profiles(login_count DESC);

-- Fonction pour incrémenter login_count
CREATE OR REPLACE FUNCTION increment_login_count(user_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET 
    login_count = COALESCE(login_count, 0) + 1,
    last_login_at = now()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour logger une activité
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id uuid,
  p_activity_type text,
  p_page_url text DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO user_activity (
    user_id,
    activity_type,
    page_url,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_user_id,
    p_activity_type,
    p_page_url,
    p_ip_address,
    p_user_agent,
    p_metadata
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour logger une action admin
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id uuid,
  p_action_type text,
  p_target_type text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}',
  p_valeur_avant jsonb DEFAULT NULL,
  p_valeur_apres jsonb DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  audit_id uuid;
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;
  
  INSERT INTO audit_log (
    admin_id,
    action_type,
    target_type,
    target_id,
    details,
    valeur_avant,
    valeur_apres,
    ip_address,
    user_agent
  ) VALUES (
    p_admin_id,
    p_action_type,
    p_target_type,
    p_target_id,
    p_details,
    p_valeur_avant,
    p_valeur_apres,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;