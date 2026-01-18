/*
  # Ajout colonnes pour Pack Immigration

  1. Nouvelles colonnes
    - ai_metadata (jsonb) : métadonnées pour IA (template_code, quick_vocal, etc.)
    - price (decimal) : prix du template
    - quick_vocal_fr (text) : phrase vocale rapide FR
    - quick_vocal_en (text) : phrase vocale rapide EN

  2. Modification
    - Utiliser colonne slug existante pour SEO
*/

-- Ajouter colonnes si elles n'existent pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'ai_metadata'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN ai_metadata jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'price'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN price decimal(10,2) DEFAULT 1.99;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'quick_vocal_fr'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN quick_vocal_fr text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'quick_vocal_en'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN quick_vocal_en text;
  END IF;
END $$;