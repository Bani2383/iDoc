/*
  # Ajout phrases vocales rapides - Batch Final
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour les 9 derniers templates
    - Completion à 100% de tous les templates
*/

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre de motivation bilingue',
  quick_vocal_en = 'Create bilingual cover letter'
WHERE slug = 'lettre-motivation-bilingue' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer plan d affaires',
  quick_vocal_en = 'Create business plan'
WHERE slug = 'plan-affaires' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer politique anti harcèlement',
  quick_vocal_en = 'Create anti harassment policy'
WHERE slug = 'politique-anti-harcelement' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer politique protection données',
  quick_vocal_en = 'Create data protection policy'
WHERE slug = 'politique-protection-donnees' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer politique sécurité information',
  quick_vocal_en = 'Create information security policy'
WHERE slug = 'politique-securite-information' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer politique télétravail',
  quick_vocal_en = 'Create remote work policy'
WHERE slug = 'politique-teletravail' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer rapport annuel',
  quick_vocal_en = 'Create annual report'
WHERE slug = 'rapport-annuel' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer reçu de paiement',
  quick_vocal_en = 'Create payment receipt'
WHERE slug = 'recu-paiement' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer relevé d heures',
  quick_vocal_en = 'Create timesheet'
WHERE slug = 'releve-heures' AND quick_vocal_fr IS NULL;
