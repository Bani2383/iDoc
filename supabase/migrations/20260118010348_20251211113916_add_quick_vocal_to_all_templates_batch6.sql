/*
  # Ajout phrases vocales rapides - Batch 6 (Professional 2/4)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour templates professionnels
    - 15 templates de lettres professionnelles
*/

-- Lettres d'emploi
UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre de motivation',
  quick_vocal_en = 'Create cover letter'
WHERE slug = 'lettre-motivation' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre candidature spontanée',
  quick_vocal_en = 'Create unsolicited application'
WHERE slug = 'lettre-candidature-spontanee' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre de recommandation',
  quick_vocal_en = 'Create recommendation letter'
WHERE slug = 'lettre-recommandation' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre de démission',
  quick_vocal_en = 'Create resignation letter'
WHERE slug = 'lettre-demission' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer certificat de travail',
  quick_vocal_en = 'Create work certificate'
WHERE slug = 'certificat-travail' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer attestation employeur',
  quick_vocal_en = 'Create employer certificate'
WHERE slug = 'attestation-employeur' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer avertissement disciplinaire',
  quick_vocal_en = 'Create disciplinary warning'
WHERE slug = 'avertissement-disciplinaire' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer convocation entretien',
  quick_vocal_en = 'Create interview invitation'
WHERE slug = 'convocation-entretien' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre de licenciement',
  quick_vocal_en = 'Create termination letter'
WHERE slug = 'lettre-licenciement' AND quick_vocal_fr IS NULL;

-- Lettres commerciales
UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre commerciale',
  quick_vocal_en = 'Create business letter'
WHERE slug = 'lettre-commerciale' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer proposition commerciale',
  quick_vocal_en = 'Create business proposal'
WHERE slug = 'proposition-commerciale' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer devis professionnel',
  quick_vocal_en = 'Create professional quote'
WHERE slug = 'devis' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer facture professionnelle',
  quick_vocal_en = 'Create professional invoice'
WHERE slug = 'facture' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer bon de commande',
  quick_vocal_en = 'Create purchase order'
WHERE slug = 'bon-commande' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de prestation services',
  quick_vocal_en = 'Create service agreement'
WHERE slug = 'contrat-prestation-services' AND quick_vocal_fr IS NULL;
