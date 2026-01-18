/*
  # Élargir les catégories de templates et ajouter support SEO + Multilingue
  
  1. Modifications
    - Élargir la contrainte de catégorie pour inclure 'academic' et 'immigration'
    - Ajouter colonnes pour le support multilingue (FR/EN)
    - Ajouter métadonnées SEO (meta_title, meta_description, keywords)
    - Ajouter champs pour le nom et description en anglais
    
  2. Nouvelles Colonnes
    - name_en: Nom du template en anglais
    - description_en: Description en anglais
    - template_content_en: Contenu du template en anglais
    - meta_title_fr: Titre SEO en français
    - meta_title_en: Titre SEO en anglais
    - meta_description_fr: Description SEO en français
    - meta_description_en: Description SEO en anglais
    - keywords: Mots-clés SEO (array)
*/

-- Supprimer l'ancienne contrainte de catégorie
ALTER TABLE document_templates 
DROP CONSTRAINT IF EXISTS document_templates_category_check;

-- Ajouter la nouvelle contrainte avec toutes les catégories
ALTER TABLE document_templates
ADD CONSTRAINT document_templates_category_check 
CHECK (category = ANY (ARRAY['professional'::text, 'personal'::text, 'academic'::text, 'immigration'::text]));

-- Ajouter les colonnes pour le support multilingue
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'name_en') THEN
    ALTER TABLE document_templates ADD COLUMN name_en text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'description_en') THEN
    ALTER TABLE document_templates ADD COLUMN description_en text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'template_content_en') THEN
    ALTER TABLE document_templates ADD COLUMN template_content_en text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'instructions_en') THEN
    ALTER TABLE document_templates ADD COLUMN instructions_en text;
  END IF;
END $$;

-- Ajouter les colonnes pour le SEO
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'meta_title_fr') THEN
    ALTER TABLE document_templates ADD COLUMN meta_title_fr text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'meta_title_en') THEN
    ALTER TABLE document_templates ADD COLUMN meta_title_en text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'meta_description_fr') THEN
    ALTER TABLE document_templates ADD COLUMN meta_description_fr text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'meta_description_en') THEN
    ALTER TABLE document_templates ADD COLUMN meta_description_en text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'keywords') THEN
    ALTER TABLE document_templates ADD COLUMN keywords text[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_templates' AND column_name = 'language') THEN
    ALTER TABLE document_templates ADD COLUMN language text DEFAULT 'fr' CHECK (language = ANY (ARRAY['fr'::text, 'en'::text, 'both'::text]));
  END IF;
END $$;

-- Créer un index sur les keywords pour la recherche
CREATE INDEX IF NOT EXISTS idx_document_templates_keywords ON document_templates USING GIN (keywords);

-- Créer un index sur la langue
CREATE INDEX IF NOT EXISTS idx_document_templates_language ON document_templates (language);

-- Créer un index sur la catégorie pour le filtrage
CREATE INDEX IF NOT EXISTS idx_document_templates_category ON document_templates (category);