/*
  # Phase 1: DocPilot V2 et DocVault

  1. Nouvelles Tables
    - `document_views` : Tracking des consultations pour recommandations
    - `recommendation_rules` : Règles de recommandation entre documents
    - `document_folders` : Dossiers pour organisation des documents

  2. Modifications
    - Ajout de `folder_id` et `is_favorite` à `generated_documents`

  3. Sécurité
    - RLS activé sur toutes les tables
    - Accès limité aux données de l'utilisateur authentifié
*/

-- Table de tracking des consultations pour DocPilot
CREATE TABLE IF NOT EXISTS document_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  template_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  duration_seconds INTEGER,
  source TEXT CHECK (source IN ('search', 'category', 'recommendation', 'direct'))
);

ALTER TABLE document_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own document views"
  ON document_views FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own document views"
  ON document_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can insert guest views"
  ON document_views FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_document_views_user ON document_views(user_id);
CREATE INDEX IF NOT EXISTS idx_document_views_template ON document_views(template_id);
CREATE INDEX IF NOT EXISTS idx_document_views_session ON document_views(session_id);

-- Table de règles de recommandation
CREATE TABLE IF NOT EXISTS recommendation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_template_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
  recommended_template_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('similar', 'complementary', 'popular')),
  weight INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recommendation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active recommendation rules"
  ON recommendation_rules FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage recommendation rules"
  ON recommendation_rules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_source ON recommendation_rules(source_template_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_active ON recommendation_rules(is_active);

-- Table des dossiers pour DocVault
CREATE TABLE IF NOT EXISTS document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_folder_id UUID REFERENCES document_folders(id) ON DELETE CASCADE,
  color TEXT,
  icon TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own folders"
  ON document_folders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own folders"
  ON document_folders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update own non-system folders"
  ON document_folders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_system = false)
  WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete own non-system folders"
  ON document_folders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND is_system = false);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_folders_user ON document_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent ON document_folders(parent_folder_id);

-- Ajouter folder_id et is_favorite à generated_documents
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generated_documents' AND column_name = 'folder_id') THEN
    ALTER TABLE generated_documents ADD COLUMN folder_id UUID REFERENCES document_folders(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generated_documents' AND column_name = 'is_favorite') THEN
    ALTER TABLE generated_documents ADD COLUMN is_favorite BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_documents_folder ON generated_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_favorite ON generated_documents(is_favorite);

-- Function pour créer les dossiers système lors de la création d'un utilisateur
CREATE OR REPLACE FUNCTION create_default_folders()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO document_folders (user_id, name, icon, is_system)
  VALUES
    (NEW.id, 'Favoris', '⭐', true),
    (NEW.id, 'Non classés', '📄', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer les dossiers système
DROP TRIGGER IF EXISTS on_user_created_folders ON user_profiles;
CREATE TRIGGER on_user_created_folders
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_folders();