/*
  # Ajout phrases vocales rapides - Batch 5 (Professional 1/4)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour templates professionnels
    - 15 templates d'accords et contrats professionnels
*/

-- Accords professionnels
UPDATE document_templates SET
  quick_vocal_fr = 'Créer accord de confidentialité',
  quick_vocal_en = 'Create confidentiality agreement'
WHERE slug = 'accord-confidentialite' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer NDA bilingue',
  quick_vocal_en = 'Create bilingual NDA'
WHERE slug = 'nda-confidentialite-bilingue' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer accord de commercialisation',
  quick_vocal_en = 'Create marketing agreement'
WHERE slug = 'accord-commercialisation' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer accord distribution marchandises',
  quick_vocal_en = 'Create goods distribution agreement'
WHERE slug = 'accord-distribution-marchandises' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer accord production artistique',
  quick_vocal_en = 'Create artistic production agreement'
WHERE slug = 'accord-production-artistique' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer accord séminaires en ligne',
  quick_vocal_en = 'Create online seminar agreement'
WHERE slug = 'accord-seminaires-en-ligne' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer accord services traiteur',
  quick_vocal_en = 'Create catering services agreement'
WHERE slug = 'accord-services-traiteur' AND quick_vocal_fr IS NULL;

-- Contrats d'emploi
UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de travail',
  quick_vocal_en = 'Create employment contract'
WHERE slug = 'contrat-travail' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de travail CDD',
  quick_vocal_en = 'Create fixed-term contract'
WHERE slug = 'contrat-travail-cdd' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat travail CDI',
  quick_vocal_en = 'Create permanent contract'
WHERE slug = 'contrat-travail-cdi' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer avenant au contrat',
  quick_vocal_en = 'Create contract amendment'
WHERE slug = 'avenant-contrat-travail' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat freelance',
  quick_vocal_en = 'Create freelance contract'
WHERE slug = 'contrat-freelance' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat consultant indépendant',
  quick_vocal_en = 'Create independent consultant contract'
WHERE slug = 'contrat-consultant-independant' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de stage',
  quick_vocal_en = 'Create internship contract'
WHERE slug = 'contrat-stage' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer promesse embauche',
  quick_vocal_en = 'Create job offer letter'
WHERE slug = 'promesse-embauche' AND quick_vocal_fr IS NULL;
