/*
  # Ajout phrases vocales rapides - Batch 8 (Professional 4/4 + Legal)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour templates professionnels restants
    - Templates juridiques, immobiliers, et documents spécialisés
*/

-- Documents immobiliers professionnels
UPDATE document_templates SET
  quick_vocal_fr = 'Créer bail commercial',
  quick_vocal_en = 'Create commercial lease'
WHERE slug = 'bail-commercial' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer promesse de vente immobilier',
  quick_vocal_en = 'Create real estate sales agreement'
WHERE slug = 'promesse-vente-immobilier' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer mandat de gestion',
  quick_vocal_en = 'Create property management mandate'
WHERE slug = 'mandat-gestion' AND quick_vocal_fr IS NULL;

-- Documents juridiques
UPDATE document_templates SET
  quick_vocal_fr = 'Créer mise en demeure',
  quick_vocal_en = 'Create formal notice'
WHERE slug = 'mise-en-demeure' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer procuration notariée',
  quick_vocal_en = 'Create notarized power of attorney'
WHERE slug = 'procuration-notariee' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer transaction amiable',
  quick_vocal_en = 'Create settlement agreement'
WHERE slug = 'transaction-amiable' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer déclaration de créance',
  quick_vocal_en = 'Create claim declaration'
WHERE slug = 'declaration-creance' AND quick_vocal_fr IS NULL;

-- Documents de conformité
UPDATE document_templates SET
  quick_vocal_fr = 'Créer politique confidentialité RGPD',
  quick_vocal_en = 'Create GDPR privacy policy'
WHERE slug = 'politique-confidentialite-rgpd' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer conditions générales vente',
  quick_vocal_en = 'Create terms and conditions'
WHERE slug = 'cgv' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer conditions générales utilisation',
  quick_vocal_en = 'Create terms of service'
WHERE slug = 'cgu' AND quick_vocal_fr IS NULL;

-- Documents formation
UPDATE document_templates SET
  quick_vocal_fr = 'Créer convention formation professionnelle',
  quick_vocal_en = 'Create professional training agreement'
WHERE slug = 'convention-formation' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer certificat de formation',
  quick_vocal_en = 'Create training certificate'
WHERE slug = 'certificat-formation' AND quick_vocal_fr IS NULL;

-- Documents assurance et santé
UPDATE document_templates SET
  quick_vocal_fr = 'Créer constat amiable accident',
  quick_vocal_en = 'Create accident report form'
WHERE slug = 'constat-amiable' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer déclaration sinistre',
  quick_vocal_en = 'Create insurance claim'
WHERE slug = 'declaration-sinistre' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer directives anticipées',
  quick_vocal_en = 'Create advance directives'
WHERE slug = 'directives-anticipees' AND quick_vocal_fr IS NULL;
