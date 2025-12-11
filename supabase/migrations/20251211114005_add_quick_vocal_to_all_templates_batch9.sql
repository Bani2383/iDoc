/*
  # Ajout phrases vocales rapides - Batch 9 (Professional Final 1/2)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour templates professionnels restants
    - 15 templates
*/

UPDATE document_templates SET
  quick_vocal_fr = 'Créer attestation de présence',
  quick_vocal_en = 'Create attendance certificate'
WHERE slug = 'attestation-presence' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer attestation de travail',
  quick_vocal_en = 'Create work certificate'
WHERE slug = 'attestation-travail' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer conditions utilisation site web',
  quick_vocal_en = 'Create website terms of use'
WHERE slug = 'conditions-utilisation-site-web' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer confidentialité simple',
  quick_vocal_en = 'Create simple confidentiality'
WHERE slug = 'confidentialite-simple' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat bureau virtuel',
  quick_vocal_en = 'Create virtual office contract'
WHERE slug = 'contrat-bureau-virtuel' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer licence logicielle',
  quick_vocal_en = 'Create software license'
WHERE slug = 'licence-logicielle' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat location de bien',
  quick_vocal_en = 'Create property rental contract'
WHERE slug = 'contrat-location-bien' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de prestation',
  quick_vocal_en = 'Create service contract'
WHERE slug = 'contrat-prestation' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat service complet',
  quick_vocal_en = 'Create complete service contract'
WHERE slug = 'contrat-service-complet' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de service détaillé',
  quick_vocal_en = 'Create detailed service contract'
WHERE slug = 'contrat-de-service-complet' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de services',
  quick_vocal_en = 'Create services contract'
WHERE slug = 'contrat-services' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat services recrutement',
  quick_vocal_en = 'Create recruitment services contract'
WHERE slug = 'contrat-services-recrutement' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat CDI bilingue',
  quick_vocal_en = 'Create bilingual permanent contract'
WHERE slug = 'contrat-travail-cdi-bilingue' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer convention vente actions',
  quick_vocal_en = 'Create share purchase agreement'
WHERE slug = 'convention-vente-actions' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer CV professionnel',
  quick_vocal_en = 'Create professional resume'
WHERE slug = 'cv-professionnel' AND quick_vocal_fr IS NULL;
