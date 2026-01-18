/*
  # Ajout phrases vocales rapides - Batch 4 (Personal OBNL)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour templates OBNL
    - 3 templates pour organismes à but non lucratif
*/

-- Documents pour OBNL
UPDATE document_templates SET
  quick_vocal_fr = 'Créer convention subvention OBNL',
  quick_vocal_en = 'Create nonprofit grant agreement'
WHERE slug = 'convention-subvention-obnl' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer politique conflits intérêts',
  quick_vocal_en = 'Create conflict of interest policy'
WHERE slug = 'politique-conflits-interets-obnl' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer règlements administratifs OBNL',
  quick_vocal_en = 'Create nonprofit bylaws'
WHERE slug = 'reglements-administratifs-obnl' AND quick_vocal_fr IS NULL;
