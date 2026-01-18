/*
  # Ajout phrases vocales rapides - Batch 1 (Academic + Immigration)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour templates académiques et immigration
    - Phrases courtes et naturelles pour génération vocale
  
  2. Templates modifiés
    - 6 templates académiques
    - 4 templates immigration
*/

-- Templates Académiques
UPDATE document_templates SET
  quick_vocal_fr = 'Créer actes de colloque',
  quick_vocal_en = 'Create conference proceedings'
WHERE slug = 'actes-colloque' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer demande de stage',
  quick_vocal_en = 'Create internship application'
WHERE slug = 'demande-stage' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer fiche de lecture',
  quick_vocal_en = 'Create reading summary'
WHERE slug = 'fiche-lecture' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer mémoire académique',
  quick_vocal_en = 'Create academic thesis'
WHERE slug = 'memoire-academique' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer rapport de recherche',
  quick_vocal_en = 'Create research report'
WHERE slug = 'rapport-recherche-academique' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer rapport de stage',
  quick_vocal_en = 'Create internship report'
WHERE slug = 'rapport-stage-professionnel' AND quick_vocal_fr IS NULL;

-- Templates Immigration
UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat TET Québec',
  quick_vocal_en = 'Create TET Quebec contract'
WHERE slug = 'contrat-tet-quebec' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre motivation visa',
  quick_vocal_en = 'Create visa motivation letter'
WHERE slug = 'lettre-motivation-visa' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre Entrée Express',
  quick_vocal_en = 'Create Express Entry letter'
WHERE slug = 'lettre-entree-express' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre explicative IRCC',
  quick_vocal_en = 'Create IRCC explanation letter'
WHERE slug = 'lettre-explicative-ircc' AND quick_vocal_fr IS NULL;
