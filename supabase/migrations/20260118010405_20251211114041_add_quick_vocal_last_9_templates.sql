/*
  # Ajout phrases vocales rapides - 9 derniers templates
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour les 9 vrais derniers templates
    - Completion finale à 100%
*/

UPDATE document_templates SET
  quick_vocal_fr = 'Créer manuel de l employé',
  quick_vocal_en = 'Create employee handbook'
WHERE slug = 'manuel-employe' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer clause de non concurrence',
  quick_vocal_en = 'Create non compete clause'
WHERE slug = 'non-concurrence' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer clause de non sollicitation',
  quick_vocal_en = 'Create non solicitation clause'
WHERE slug = 'non-sollicitation' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer note de service',
  quick_vocal_en = 'Create office memo'
WHERE slug = 'note-service' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer plan de vente',
  quick_vocal_en = 'Create sales plan'
WHERE slug = 'plan-vente' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer plan marketing',
  quick_vocal_en = 'Create marketing plan'
WHERE slug = 'plan-marketing' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer politique confidentialité web',
  quick_vocal_en = 'Create website privacy policy'
WHERE slug = 'politique-confidentialite-site-web' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer politique RGPD',
  quick_vocal_en = 'Create GDPR policy'
WHERE slug = 'politique-rgpd' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer règlement intérieur société',
  quick_vocal_en = 'Create corporate bylaws'
WHERE slug = 'reglement-interieur-societe' AND quick_vocal_fr IS NULL;
