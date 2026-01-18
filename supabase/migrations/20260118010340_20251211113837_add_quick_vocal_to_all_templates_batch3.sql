/*
  # Ajout phrases vocales rapides - Batch 3 (Personal 2/3)
  
  1. Modification
    - Ajout de quick_vocal_fr et quick_vocal_en pour templates personnels
    - 15 templates de prêt, vente, services
*/

-- Contrats financiers
UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de prêt argent',
  quick_vocal_en = 'Create personal loan agreement'
WHERE slug = 'contrat-pret-argent' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer reconnaissance de dette',
  quick_vocal_en = 'Create debt acknowledgment'
WHERE slug = 'reconnaissance-dette-bilingue' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat prêt de bien',
  quick_vocal_en = 'Create item loan agreement'
WHERE slug = 'contrat-pret-bien' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer demande de remboursement',
  quick_vocal_en = 'Create refund request'
WHERE slug = 'demande-remboursement' AND quick_vocal_fr IS NULL;

-- Contrats de vente et location véhicule
UPDATE document_templates SET
  quick_vocal_fr = 'Créer vente véhicule occasion',
  quick_vocal_en = 'Create used vehicle sale'
WHERE slug = 'contrat-vente-vehicule' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer vente auto occasion',
  quick_vocal_en = 'Create used car sale'
WHERE slug = 'contrat-vente-vehicule-occasion-complet' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer location de véhicule',
  quick_vocal_en = 'Create vehicle rental'
WHERE slug = 'location-vehicule' AND quick_vocal_fr IS NULL;

-- Contrats de service
UPDATE document_templates SET
  quick_vocal_fr = 'Créer contrat de nettoyage',
  quick_vocal_en = 'Create cleaning service agreement'
WHERE slug = 'contrat-service-nettoyage' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer service de nettoyage',
  quick_vocal_en = 'Create cleaning service contract'
WHERE slug = 'service-nettoyage' AND quick_vocal_fr IS NULL;

-- Documents voyage et lettres
UPDATE document_templates SET
  quick_vocal_fr = 'Créer plan de voyage',
  quick_vocal_en = 'Create travel plan'
WHERE slug = 'plan-voyage' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer invitation visa Canada',
  quick_vocal_en = 'Create Canada visa invitation'
WHERE slug = 'lettre-invitation-visa-canada' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre invitation Canada',
  quick_vocal_en = 'Create Canada invitation letter'
WHERE slug = 'lettre-invitation-visa-canada-complet' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer lettre de plainte',
  quick_vocal_en = 'Create complaint letter'
WHERE slug = 'lettre-plainte' AND quick_vocal_fr IS NULL;

-- Résiliations
UPDATE document_templates SET
  quick_vocal_fr = 'Créer résiliation abonnement',
  quick_vocal_en = 'Create subscription cancellation'
WHERE slug = 'resiliation-abonnement' AND quick_vocal_fr IS NULL;

UPDATE document_templates SET
  quick_vocal_fr = 'Créer location saisonnière complète',
  quick_vocal_en = 'Create complete seasonal rental'
WHERE slug = 'contrat-location-saisonniere-complet' AND quick_vocal_fr IS NULL;
