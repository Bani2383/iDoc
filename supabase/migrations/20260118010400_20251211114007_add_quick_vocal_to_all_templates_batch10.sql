/*
  # Ajout phrases vocales rapides - Batch 10 (Professional Final 2/2)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour derniers templates
    - 14 templates finaux
*/

UPDATE document_templates SET
  quick_vocal_fr = 'Créer demande de congé',
  quick_vocal_en = 'Create leave request'
WHERE slug = 'demande-conge' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer document PRD technique',
  quick_vocal_en = 'Create technical PRD document'
WHERE slug = 'prd-specifications-techniques' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer entente confidentialité employé',
  quick_vocal_en = 'Create employee confidentiality agreement'
WHERE slug = 'entente-confidentialite-employe' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer facture professionnelle complète',
  quick_vocal_en = 'Create complete professional invoice'
WHERE slug = 'facture-professionnelle' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre de mission',
  quick_vocal_en = 'Create mission letter'
WHERE slug = 'lettre-mission' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre de motivation bilingue',
  quick_vocal_en = 'Create bilingual cover letter'
WHERE slug = 'lettre-motivation-bilingue' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer plan affaires',
  quick_vocal_en = 'Create business plan'
WHERE slug = 'plan-affaires' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer politique anti-harcèlement',
  quick_vocal_en = 'Create anti-harassment policy'
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
  quick_vocal_fr = 'Créer rapport annuel entreprise',
  quick_vocal_en = 'Create annual business report'
WHERE slug = 'rapport-annuel' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer reçu paiement',
  quick_vocal_en = 'Create payment receipt'
WHERE slug = 'recu-paiement' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer relevé heures travaillées',
  quick_vocal_en = 'Create timesheet'
WHERE slug = 'releve-heures' AND quick_vocal_fr IS NULL;
