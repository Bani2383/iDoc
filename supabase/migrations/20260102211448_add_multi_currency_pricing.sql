/*
  # Ajout des prix multi-devises pour les templates
  
  1. Modifications
    - Ajout de colonnes de prix pour `idoc_guided_templates`:
      * `price_usd` (numeric, défaut 1.99)
      * `price_cad` (numeric, défaut 1.99)
      * `price_eur` (numeric, défaut 1.99)
      * `is_free` (boolean, défaut false)
    
    - Ajout de colonnes de prix pour `document_templates`:
      * `price_usd` (numeric, défaut 1.99)
      * `price_cad` (numeric, défaut 1.99)
      * `price_eur` (numeric, défaut 1.99)
      * `is_free` (boolean, défaut false)
    
  2. Sécurité
    - Les prix sont accessibles en lecture publique
    - Seuls les admins peuvent modifier les prix
*/

-- Ajout des colonnes de prix pour idoc_guided_templates
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'price_usd'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN price_usd numeric(10,2) DEFAULT 1.99;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'price_cad'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN price_cad numeric(10,2) DEFAULT 1.99;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'price_eur'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN price_eur numeric(10,2) DEFAULT 1.99;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'is_free'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN is_free boolean DEFAULT false;
  END IF;
END $$;

-- Ajout des colonnes de prix pour document_templates
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'price_usd'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN price_usd numeric(10,2) DEFAULT 1.99;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'price_cad'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN price_cad numeric(10,2) DEFAULT 1.99;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'price_eur'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN price_eur numeric(10,2) DEFAULT 1.99;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_templates' AND column_name = 'is_free'
  ) THEN
    ALTER TABLE document_templates 
    ADD COLUMN is_free boolean DEFAULT false;
  END IF;
END $$;

-- Index pour améliorer les performances des requêtes par prix
CREATE INDEX IF NOT EXISTS idx_idoc_templates_pricing ON idoc_guided_templates(is_free, price_usd);
CREATE INDEX IF NOT EXISTS idx_doc_templates_pricing ON document_templates(is_free, price_usd);

-- Commentaires
COMMENT ON COLUMN idoc_guided_templates.price_usd IS 'Prix en USD (défaut: 1.99)';
COMMENT ON COLUMN idoc_guided_templates.price_cad IS 'Prix en CAD (défaut: 1.99)';
COMMENT ON COLUMN idoc_guided_templates.price_eur IS 'Prix en EUR (défaut: 1.99)';
COMMENT ON COLUMN idoc_guided_templates.is_free IS 'Gratuit ou payant';

COMMENT ON COLUMN document_templates.price_usd IS 'Prix en USD (défaut: 1.99)';
COMMENT ON COLUMN document_templates.price_cad IS 'Prix en CAD (défaut: 1.99)';
COMMENT ON COLUMN document_templates.price_eur IS 'Prix en EUR (défaut: 1.99)';
COMMENT ON COLUMN document_templates.is_free IS 'Gratuit ou payant';
