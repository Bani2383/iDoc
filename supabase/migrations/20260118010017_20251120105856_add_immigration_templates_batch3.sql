/*
  # Pack Immigration - Batch 3 (Templates 11-15)

  Templates:
    - Lettre preuve expérience travail
    - Lettre cessation emploi
    - Autorisation parentale mineur
    - Demande réexamen/appel
    - Lettre garantie financière parrainage
*/

-- Template 11: Preuve expérience travail
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre preuve expérience travail',
  'immigration',
  'both',
  'lettre-preuve-experience-travail-immigration',
  'LETTRE DE PREUVE D EXPÉRIENCE DE TRAVAIL

{{entreprise}}
{{adresse_entreprise}}

Objet : Attestation d expérience professionnelle

À qui de droit,

Nous certifions que {{nom_employe}}, {{numero_employe}}, a travaillé dans notre entreprise aux conditions suivantes :

PÉRIODE : Du {{date_debut}} au {{date_fin}}
DURÉE : {{duree_totale}}

POSTE : {{titre_poste}}
CODE NOC : {{code_noc}}
STATUT : {{statut}} ({{heures_semaine}} heures/semaine)

TÂCHES PRINCIPALES
{{taches_principales}}

SALAIRE : {{salaire}} {{devise}} par {{periode_salaire}}

SUPERVISEUR : {{nom_superviseur}}
Contact : {{contact_superviseur}}

Cette lettre est délivrée pour servir dans le cadre de sa demande d immigration.

{{nom_responsable_rh}}
{{poste_responsable}}
Date : {{date}}

Sceau de l entreprise',
'[
  {"name": "entreprise", "label": "Entreprise", "type": "text", "required": true},
  {"name": "adresse_entreprise", "label": "Adresse", "type": "text", "required": true},
  {"name": "nom_employe", "label": "Nom employé", "type": "text", "required": true},
  {"name": "numero_employe", "label": "Numéro employé", "type": "text", "required": false},
  {"name": "date_debut", "label": "Date début", "type": "date", "required": true},
  {"name": "date_fin", "label": "Date fin", "type": "date", "required": true},
  {"name": "duree_totale", "label": "Durée totale", "type": "text", "required": true, "placeholder": "2 ans 6 mois"},
  {"name": "titre_poste", "label": "Titre poste", "type": "text", "required": true},
  {"name": "code_noc", "label": "Code NOC", "type": "text", "required": false, "placeholder": "2174"},
  {"name": "statut", "label": "Statut", "type": "text", "required": true, "placeholder": "Temps plein"},
  {"name": "heures_semaine", "label": "Heures/semaine", "type": "number", "required": true, "placeholder": "40"},
  {"name": "taches_principales", "label": "Tâches principales", "type": "textarea", "required": true},
  {"name": "salaire", "label": "Salaire", "type": "number", "required": true},
  {"name": "devise", "label": "Devise", "type": "text", "required": true, "placeholder": "CAD"},
  {"name": "periode_salaire", "label": "Période", "type": "text", "required": true, "placeholder": "année"},
  {"name": "nom_superviseur", "label": "Nom superviseur", "type": "text", "required": true},
  {"name": "contact_superviseur", "label": "Contact superviseur", "type": "text", "required": true},
  {"name": "nom_responsable_rh", "label": "Nom RH", "type": "text", "required": true},
  {"name": "poste_responsable", "label": "Poste", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "preuve_experience_travail"}'::jsonb,
1.99,
'Preuve expérience travail pour immigration prête',
'Lettre preuve expérience travail — Immigration'
) ON CONFLICT (slug) DO NOTHING;

-- Template 12: Cessation emploi
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre cessation emploi immigration',
  'immigration',
  'both',
  'lettre-cessation-emploi-immigration',
  'LETTRE DE CESSATION D EMPLOI

{{entreprise}}
{{adresse_entreprise}}

Objet : Fin de contrat de travail

Nous confirmons que le contrat de travail de {{nom_employe}} prend fin le {{date_fin}}.

PÉRIODE D EMPLOI : Du {{date_debut}} au {{date_fin}}
POSTE : {{poste}}

RAISON DE LA CESSATION
{{raison_cessation}}

{{commentaire_performance}}

DROITS ET OBLIGATIONS
{{droits_obligations}}

Cette lettre est délivrée à la demande de l intéressé(e).

{{nom_responsable}}
{{poste_responsable}}
Date : {{date}}',
'[
  {"name": "entreprise", "label": "Entreprise", "type": "text", "required": true},
  {"name": "adresse_entreprise", "label": "Adresse", "type": "text", "required": true},
  {"name": "nom_employe", "label": "Nom employé", "type": "text", "required": true},
  {"name": "date_debut", "label": "Date début", "type": "date", "required": true},
  {"name": "date_fin", "label": "Date fin", "type": "date", "required": true},
  {"name": "poste", "label": "Poste", "type": "text", "required": true},
  {"name": "raison_cessation", "label": "Raison cessation", "type": "text", "required": true, "placeholder": "Fin de contrat temporaire"},
  {"name": "commentaire_performance", "label": "Commentaire performance", "type": "textarea", "required": false},
  {"name": "droits_obligations", "label": "Droits et obligations", "type": "textarea", "required": false},
  {"name": "nom_responsable", "label": "Nom responsable", "type": "text", "required": true},
  {"name": "poste_responsable", "label": "Poste", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "cessation_emploi"}'::jsonb,
1.99,
'Lettre cessation emploi pour dossier immigration',
'Lettre cessation emploi — Immigration'
) ON CONFLICT (slug) DO NOTHING;

-- Template 13: Autorisation parentale mineur
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Autorisation parentale mineur voyage',
  'immigration',
  'both',
  'autorisation-parentale-mineur-voyage',
  'AUTORISATION PARENTALE DE VOYAGE

Nous soussignés :

PARENT 1 : {{nom_parent1}}, né(e) le {{date_naissance_parent1}}
Pièce identité : {{numero_id_parent1}}

PARENT 2 : {{nom_parent2}}, né(e) le {{date_naissance_parent2}}
Pièce identité : {{numero_id_parent2}}

Demeurant à {{adresse_parents}},

Autorisons notre enfant mineur :

{{nom_enfant}}, né(e) le {{date_naissance_enfant}}, à voyager vers {{destination}} du {{date_debut}} au {{date_fin}}.

ACCOMPAGNATEUR
{{details_accompagnateur}}

MOTIF DU VOYAGE
{{motif_voyage}}

HÉBERGEMENT
{{details_hebergement}}

CONTACT D URGENCE
{{contact_urgence}}

DOCUMENTS JOINTS
- Copies pièces d identité parents
- Copie acte naissance enfant
- {{autres_documents}}

Nous certifions l exactitude de ces informations.

Fait à {{ville}}, le {{date}}

{{nom_parent1}}                    {{nom_parent2}}
Signature Parent 1                 Signature Parent 2',
'[
  {"name": "nom_parent1", "label": "Nom parent 1", "type": "text", "required": true},
  {"name": "date_naissance_parent1", "label": "Date naissance parent 1", "type": "date", "required": true},
  {"name": "numero_id_parent1", "label": "Numéro ID parent 1", "type": "text", "required": true},
  {"name": "nom_parent2", "label": "Nom parent 2", "type": "text", "required": false},
  {"name": "date_naissance_parent2", "label": "Date naissance parent 2", "type": "date", "required": false},
  {"name": "numero_id_parent2", "label": "Numéro ID parent 2", "type": "text", "required": false},
  {"name": "adresse_parents", "label": "Adresse parents", "type": "text", "required": true},
  {"name": "nom_enfant", "label": "Nom enfant", "type": "text", "required": true},
  {"name": "date_naissance_enfant", "label": "Date naissance enfant", "type": "date", "required": true},
  {"name": "destination", "label": "Destination", "type": "text", "required": true},
  {"name": "date_debut", "label": "Date début", "type": "date", "required": true},
  {"name": "date_fin", "label": "Date fin", "type": "date", "required": true},
  {"name": "details_accompagnateur", "label": "Accompagnateur", "type": "textarea", "required": true},
  {"name": "motif_voyage", "label": "Motif", "type": "textarea", "required": true},
  {"name": "details_hebergement", "label": "Hébergement", "type": "textarea", "required": true},
  {"name": "contact_urgence", "label": "Contact urgence", "type": "text", "required": true},
  {"name": "autres_documents", "label": "Autres documents", "type": "text", "required": false},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "autorisation_parentale_mineur"}'::jsonb,
1.99,
'Autorisation parentale mineur prête à télécharger',
'Autorisation parentale mineur — Voyage international'
) ON CONFLICT (slug) DO NOTHING;

-- Template 14: Demande réexamen/appel
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Demande réexamen appel immigration',
  'immigration',
  'both',
  'demande-reexamen-appel-immigration',
  'DEMANDE DE RÉEXAMEN / APPEL

Nom : {{nom_complet}}
Numéro de dossier : {{numero_dossier}}
Date de la décision : {{date_decision}}

Objet : Demande de réexamen de la décision du {{date_decision}}

Madame, Monsieur,

Je sollicite le réexamen de votre décision concernant {{objet_demande}}.

MOTIFS DE LA DEMANDE
{{motifs_demande}}

ERREURS IDENTIFIÉES
{{erreurs_identifiees}}

NOUVEAUX ÉLÉMENTS
{{nouveaux_elements}}

ARGUMENTS JURIDIQUES
{{arguments_juridiques}}

PREUVES ADDITIONNELLES
{{preuves_additionnelles}}

DEMANDE
{{demande_precise}}

Je reste à votre disposition pour toute information complémentaire.

Fait à {{ville}}, le {{date}}

{{nom_complet}}
Signature

Documents joints : {{liste_documents}}',
'[
  {"name": "nom_complet", "label": "Nom complet", "type": "text", "required": true},
  {"name": "numero_dossier", "label": "Numéro dossier", "type": "text", "required": true},
  {"name": "date_decision", "label": "Date décision", "type": "date", "required": true},
  {"name": "objet_demande", "label": "Objet demande", "type": "text", "required": true},
  {"name": "motifs_demande", "label": "Motifs", "type": "textarea", "required": true},
  {"name": "erreurs_identifiees", "label": "Erreurs identifiées", "type": "textarea", "required": true},
  {"name": "nouveaux_elements", "label": "Nouveaux éléments", "type": "textarea", "required": true},
  {"name": "arguments_juridiques", "label": "Arguments juridiques", "type": "textarea", "required": false},
  {"name": "preuves_additionnelles", "label": "Preuves additionnelles", "type": "textarea", "required": true},
  {"name": "demande_precise", "label": "Demande précise", "type": "textarea", "required": true},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true},
  {"name": "liste_documents", "label": "Liste documents", "type": "text", "required": true}
]'::jsonb,
'{"template_code": "demande_reexamen_appel"}'::jsonb,
1.99,
'Demande réexamen appel immigration prête',
'Demande réexamen appel — Immigration'
) ON CONFLICT (slug) DO NOTHING;

-- Template 15: Garantie financière parrainage
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre garantie financière parrainage',
  'immigration',
  'both',
  'lettre-garantie-financiere-parrainage',
  'LETTRE DE GARANTIE FINANCIÈRE

Je soussigné(e) {{nom_garant}}, né(e) le {{date_naissance}}, résidant à {{adresse_garant}},

M engage à parrainer {{nom_parraine}} dans le cadre de sa demande de {{type_parrainage}}.

RELATION AVEC LA PERSONNE PARRAINÉE
{{relation}}

ENGAGEMENT FINANCIER
Je m engage à subvenir aux besoins de {{nom_parraine}} pour une période de {{duree_engagement}}.

SITUATION FINANCIÈRE DU GARANT
Revenus annuels : {{revenus_annuels}} {{devise}}
Emploi : {{emploi}}
Patrimoine : {{patrimoine}}

PERSONNES À CHARGE
{{personnes_a_charge}}

CAPACITÉ FINANCIÈRE
{{capacite_financiere}}

DOCUMENTS JOINTS
- Avis d imposition ({{nb_annees}} dernières années)
- Relevés bancaires
- Attestation emploi
- {{autres_documents}}

Je certifie l exactitude de ces informations et comprends mes obligations légales.

Fait à {{ville}}, le {{date}}

{{nom_garant}}
Signature',
'[
  {"name": "nom_garant", "label": "Nom garant", "type": "text", "required": true},
  {"name": "date_naissance", "label": "Date naissance", "type": "date", "required": true},
  {"name": "adresse_garant", "label": "Adresse", "type": "text", "required": true},
  {"name": "nom_parraine", "label": "Nom parrainé", "type": "text", "required": true},
  {"name": "type_parrainage", "label": "Type parrainage", "type": "text", "required": true, "placeholder": "regroupement familial"},
  {"name": "relation", "label": "Relation", "type": "text", "required": true},
  {"name": "duree_engagement", "label": "Durée engagement", "type": "text", "required": true, "placeholder": "3 ans"},
  {"name": "revenus_annuels", "label": "Revenus annuels", "type": "number", "required": true},
  {"name": "devise", "label": "Devise", "type": "text", "required": true, "placeholder": "CAD"},
  {"name": "emploi", "label": "Emploi", "type": "text", "required": true},
  {"name": "patrimoine", "label": "Patrimoine", "type": "textarea", "required": false},
  {"name": "personnes_a_charge", "label": "Personnes à charge", "type": "text", "required": true},
  {"name": "capacite_financiere", "label": "Capacité financière", "type": "textarea", "required": true},
  {"name": "nb_annees", "label": "Nb années avis", "type": "number", "required": true, "placeholder": "3"},
  {"name": "autres_documents", "label": "Autres documents", "type": "text", "required": false},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "garantie_financiere_parrainage"}'::jsonb,
1.99,
'Garantie financière parrainage prête en 2 minutes',
'Lettre garantie financière — Parrainage familial'
) ON CONFLICT (slug) DO NOTHING;