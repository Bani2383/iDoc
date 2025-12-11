/*
  # Ajout phrases vocales rapides - Batch 7 (Professional 3/4)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour templates professionnels
    - 15 templates de contrats commerciaux et partenariats
*/

-- Contrats de partenariat
UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de partenariat',
  quick_vocal_en = 'Create partnership agreement'
WHERE slug = 'contrat-partenariat' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer accord joint-venture',
  quick_vocal_en = 'Create joint venture agreement'
WHERE slug = 'accord-joint-venture' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer protocole accord',
  quick_vocal_en = 'Create memorandum of understanding'
WHERE slug = 'protocole-accord' AND quick_vocal_fr IS NULL;

-- Contrats de vente
UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de vente',
  quick_vocal_en = 'Create sales contract'
WHERE slug = 'contrat-vente' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat fournisseur',
  quick_vocal_en = 'Create supplier agreement'
WHERE slug = 'contrat-fournisseur' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat distribution',
  quick_vocal_en = 'Create distribution agreement'
WHERE slug = 'contrat-distribution' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer mandat de vente',
  quick_vocal_en = 'Create sales mandate'
WHERE slug = 'mandat-vente' AND quick_vocal_fr IS NULL;

-- Contrats de franchise et licence
UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de franchise',
  quick_vocal_en = 'Create franchise agreement'
WHERE slug = 'contrat-franchise' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer licence exploitation marque',
  quick_vocal_en = 'Create trademark license'
WHERE slug = 'licence-exploitation-marque' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer cession droits auteur',
  quick_vocal_en = 'Create copyright assignment'
WHERE slug = 'cession-droits-auteur' AND quick_vocal_fr IS NULL;

-- Documents juridiques entreprise
UPDATE document_templates SET
  quick_vocal_fr = 'Créer statuts société',
  quick_vocal_en = 'Create articles of incorporation'
WHERE slug = 'statuts-societe' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer pacte associés',
  quick_vocal_en = 'Create shareholders agreement'
WHERE slug = 'pacte-associes' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer procès-verbal assemblée',
  quick_vocal_en = 'Create meeting minutes'
WHERE slug = 'pv-assemblee' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer règlement intérieur',
  quick_vocal_en = 'Create internal regulations'
WHERE slug = 'reglement-interieur' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer charte éthique entreprise',
  quick_vocal_en = 'Create corporate ethics charter'
WHERE slug = 'charte-ethique' AND quick_vocal_fr IS NULL;
