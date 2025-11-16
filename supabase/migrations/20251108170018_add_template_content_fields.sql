/*
  # Add template content and variables to document_templates

  1. Changes
    - Add `template_content` column to store the full document template text
    - Add `template_variables` column to store JSON array of required variables
    - Add `instructions` column to provide guidance for filling out the document
    
  2. Notes
    - `template_content` uses TEXT type for large document content
    - `template_variables` stores variable definitions like: [{"name": "client_name", "label": "Nom du client", "type": "text"}]
    - `instructions` provides user guidance for completing the document
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'template_content'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN template_content TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'template_variables'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN template_variables JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'instructions'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN instructions TEXT;
  END IF;
END $$;