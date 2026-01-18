/*
  # Ajout phrases vocales rapides - Batch 2 (Personal 1/3)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour templates personnels
    - 15 templates de location, hébergement, attestations
*/

-- Attestations et documents administratifs
UPDATE document_templates SET
  quick_vocal_fr = 'Créer attestation hébergement',
  quick_vocal_en = 'Create accommodation certificate'
WHERE slug = 'attestation-hebergement' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer attestation de résidence',
  quick_vocal_en = 'Create residence certificate'
WHERE slug = 'attestation-residence' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer autorisation parentale',
  quick_vocal_en = 'Create parental authorization'
WHERE slug = 'autorisation-parentale' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer déclaration sur honneur',
  quick_vocal_en = 'Create sworn statement'
WHERE slug = 'declaration-honneur' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer procuration générale',
  quick_vocal_en = 'Create general power of attorney'
WHERE slug = 'procuration-generale' AND quick_vocal_fr IS NULL;

-- Contrats de location
UPDATE document_templates SET
  quick_vocal_fr = 'Créer bail résidentiel',
  quick_vocal_en = 'Create residential lease'
WHERE slug = 'bail-residentiel-bilingue' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de colocation',
  quick_vocal_en = 'Create roommate agreement'
WHERE slug = 'contrat-colocation' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer convention de colocataires',
  quick_vocal_en = 'Create roommate convention'
WHERE slug = 'convention-colocataires' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de sous-location',
  quick_vocal_en = 'Create sublease agreement'
WHERE slug = 'contrat-sous-location' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer avis de sous-location',
  quick_vocal_en = 'Create sublease notice'
WHERE slug = 'avis-sous-location' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer cession de bail',
  quick_vocal_en = 'Create lease transfer'
WHERE slug = 'contrat-cession-bail' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer résiliation de bail',
  quick_vocal_en = 'Create lease termination'
WHERE slug = 'resiliation-bail' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer location saisonnière',
  quick_vocal_en = 'Create seasonal rental'
WHERE slug = 'contrat-location-saisonniere' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer location stationnement',
  quick_vocal_en = 'Create parking rental'
WHERE slug = 'contrat-location-stationnement' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre au propriétaire',
  quick_vocal_en = 'Create letter to landlord'
WHERE slug = 'lettre-proprietaire' AND quick_vocal_fr IS NULL;
