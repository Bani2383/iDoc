/*
  # Pack Immigration - Batch 4 (Templates 16-20) - FINAL

  Templates:
    - Lettre consentement propriétaire
    - Lettre antécédents judiciaires
    - Lettre changement statut
    - Lettre clarification séjour prolongé
    - Lettre attestation lien familial
*/

-- Template 16: Consentement propriétaire
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre consentement propriétaire hébergement',
  'immigration',
  'both',
  'lettre-consentement-proprietaire-hebergement',
  'LETTRE DE CONSENTEMENT DU PROPRIÉTAIRE

Je soussigné(e) {{nom_proprietaire}}, propriétaire du logement situé au {{adresse_logement}},

Autorise {{nom_locataire}}, locataire de ce logement, à héberger {{nom_heberge}} pour une durée de {{duree_hebergement}}.

DÉTAILS DU LOGEMENT
Type : {{type_logement}}
Surface : {{surface}} m²
Bail en cours : Du {{date_debut_bail}} au {{date_fin_bail}}

AUTORISATION
{{details_autorisation}}

CONDITIONS
{{conditions}}

DOCUMENTS JOINTS
- Copie titre de propriété
- Copie bail locatif
{{autres_documents}}

Fait à {{ville}}, le {{date}}

{{nom_proprietaire}}
Signature',
'[
  {"name": "nom_proprietaire", "label": "Nom propriétaire", "type": "text", "required": true},
  {"name": "adresse_logement", "label": "Adresse logement", "type": "text", "required": true},
  {"name": "nom_locataire", "label": "Nom locataire", "type": "text", "required": true},
  {"name": "nom_heberge", "label": "Nom hébergé", "type": "text", "required": true},
  {"name": "duree_hebergement", "label": "Durée", "type": "text", "required": true},
  {"name": "type_logement", "label": "Type logement", "type": "text", "required": true, "placeholder": "Appartement 3 pièces"},
  {"name": "surface", "label": "Surface m²", "type": "number", "required": false},
  {"name": "date_debut_bail", "label": "Début bail", "type": "date", "required": true},
  {"name": "date_fin_bail", "label": "Fin bail", "type": "date", "required": false},
  {"name": "details_autorisation", "label": "Détails autorisation", "type": "textarea", "required": true},
  {"name": "conditions", "label": "Conditions", "type": "textarea", "required": false},
  {"name": "autres_documents", "label": "Autres documents", "type": "text", "required": false},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "consentement_proprietaire"}'::jsonb,
1.99,
'Consentement propriétaire pour hébergement prêt',
'Lettre consentement propriétaire — Hébergement'
) ON CONFLICT (slug) DO NOTHING;

-- Template 17: Antécédents judiciaires
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre explication antécédents judiciaires',
  'immigration',
  'both',
  'lettre-explication-antecedents-judiciaires',
  'LETTRE D EXPLICATION — ANTÉCÉDENTS JUDICIAIRES

Nom : {{nom_complet}}
Date de naissance : {{date_naissance}}
Numéro de dossier : {{numero_dossier}}

Objet : Explication concernant mes antécédents judiciaires

Madame, Monsieur,

Je souhaite apporter des clarifications concernant mes antécédents judiciaires mentionnés dans mon dossier.

FAITS
Date de l incident : {{date_incident}}
Nature : {{nature_incident}}
{{description_faits}}

CONTEXTE
{{contexte_incident}}

CONSÉQUENCES JUDICIAIRES
{{consequences_judiciaires}}

RÉHABILITATION
{{rehabilitation}}

CHANGEMENTS DEPUIS
{{changements}}

GARANTIES
{{garanties}}

DOCUMENTS JOINTS
- Copie du jugement
- Certificat de non-récidive
- {{autres_documents}}

Je certifie l exactitude de ces informations.

Fait à {{ville}}, le {{date}}

{{nom_complet}}',
'[
  {"name": "nom_complet", "label": "Nom complet", "type": "text", "required": true},
  {"name": "date_naissance", "label": "Date naissance", "type": "date", "required": true},
  {"name": "numero_dossier", "label": "Numéro dossier", "type": "text", "required": true},
  {"name": "date_incident", "label": "Date incident", "type": "date", "required": true},
  {"name": "nature_incident", "label": "Nature incident", "type": "text", "required": true},
  {"name": "description_faits", "label": "Description", "type": "textarea", "required": true},
  {"name": "contexte_incident", "label": "Contexte", "type": "textarea", "required": true},
  {"name": "consequences_judiciaires", "label": "Conséquences", "type": "textarea", "required": true},
  {"name": "rehabilitation", "label": "Réhabilitation", "type": "textarea", "required": true},
  {"name": "changements", "label": "Changements depuis", "type": "textarea", "required": true},
  {"name": "garanties", "label": "Garanties", "type": "textarea", "required": true},
  {"name": "autres_documents", "label": "Autres documents", "type": "text", "required": false},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "explication_antecedents"}'::jsonb,
1.99,
'Lettre explication antécédents judiciaires',
'Lettre explication antécédents — Immigration'
) ON CONFLICT (slug) DO NOTHING;

-- Template 18: Changement statut
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre demande changement statut',
  'immigration',
  'both',
  'lettre-changement-statut-immigration',
  'DEMANDE DE CHANGEMENT DE STATUT

Nom : {{nom_complet}}
Statut actuel : {{statut_actuel}}
Date d expiration : {{date_expiration}}

Objet : Demande de changement de statut de {{statut_actuel}} à {{statut_demande}}

Madame, Monsieur,

Je sollicite le changement de mon statut d immigration.

STATUT ACTUEL
{{details_statut_actuel}}

STATUT DEMANDÉ
{{statut_demande}}

RAISONS DU CHANGEMENT
{{raisons_changement}}

ÉLIGIBILITÉ
{{criteres_eligibilite}}

SITUATION ACTUELLE
Emploi : {{situation_emploi}}
Logement : {{situation_logement}}
Finances : {{situation_financiere}}

PLAN FUTUR
{{plan_futur}}

DOCUMENTS JOINTS
{{liste_documents}}

Je m engage à respecter toutes les conditions du nouveau statut.

Fait à {{ville}}, le {{date}}

{{nom_complet}}',
'[
  {"name": "nom_complet", "label": "Nom complet", "type": "text", "required": true},
  {"name": "statut_actuel", "label": "Statut actuel", "type": "text", "required": true, "placeholder": "Visiteur"},
  {"name": "date_expiration", "label": "Date expiration", "type": "date", "required": true},
  {"name": "statut_demande", "label": "Statut demandé", "type": "text", "required": true, "placeholder": "Étudiant"},
  {"name": "details_statut_actuel", "label": "Détails statut actuel", "type": "textarea", "required": true},
  {"name": "raisons_changement", "label": "Raisons changement", "type": "textarea", "required": true},
  {"name": "criteres_eligibilite", "label": "Critères éligibilité", "type": "textarea", "required": true},
  {"name": "situation_emploi", "label": "Situation emploi", "type": "text", "required": false},
  {"name": "situation_logement", "label": "Situation logement", "type": "text", "required": true},
  {"name": "situation_financiere", "label": "Situation financière", "type": "textarea", "required": true},
  {"name": "plan_futur", "label": "Plan futur", "type": "textarea", "required": true},
  {"name": "liste_documents", "label": "Documents joints", "type": "textarea", "required": true},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "changement_statut"}'::jsonb,
1.99,
'Demande changement statut immigration prête',
'Lettre changement statut — Immigration'
) ON CONFLICT (slug) DO NOTHING;

-- Template 19: Clarification séjour prolongé
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre clarification séjour prolongé',
  'immigration',
  'both',
  'lettre-clarification-sejour-prolonge',
  'LETTRE DE CLARIFICATION — SÉJOUR PROLONGÉ

Nom : {{nom_complet}}
Numéro de passeport : {{numero_passeport}}
Date d entrée : {{date_entree}}
Autorisation initiale : {{duree_initiale}}

Objet : Clarification sur la durée de mon séjour

Madame, Monsieur,

Je souhaite clarifier les raisons de mon séjour prolongé dans votre pays.

SÉJOUR INITIAL
Motif : {{motif_initial}}
Durée prévue : {{duree_initiale}}

PROLONGATION
Nouvelle date de départ : {{nouvelle_date_depart}}
Durée totale : {{duree_totale}}

RAISONS DE LA PROLONGATION
{{raisons_prolongation}}

SITUATION ACTUELLE
{{situation_actuelle}}

MOYENS DE SUBSISTANCE
{{moyens_subsistance}}

PREUVE DE DÉPART
{{preuve_depart}}

DOCUMENTS JOINTS
- Billet retour
- Relevés bancaires
- {{autres_documents}}

Je m engage à quitter le territoire à la date indiquée.

Fait à {{ville}}, le {{date}}

{{nom_complet}}',
'[
  {"name": "nom_complet", "label": "Nom complet", "type": "text", "required": true},
  {"name": "numero_passeport", "label": "Numéro passeport", "type": "text", "required": true},
  {"name": "date_entree", "label": "Date entrée", "type": "date", "required": true},
  {"name": "duree_initiale", "label": "Durée initiale", "type": "text", "required": true, "placeholder": "3 mois"},
  {"name": "motif_initial", "label": "Motif initial", "type": "text", "required": true},
  {"name": "nouvelle_date_depart", "label": "Nouvelle date départ", "type": "date", "required": true},
  {"name": "duree_totale", "label": "Durée totale", "type": "text", "required": true},
  {"name": "raisons_prolongation", "label": "Raisons prolongation", "type": "textarea", "required": true},
  {"name": "situation_actuelle", "label": "Situation actuelle", "type": "textarea", "required": true},
  {"name": "moyens_subsistance", "label": "Moyens subsistance", "type": "textarea", "required": true},
  {"name": "preuve_depart", "label": "Preuve départ", "type": "textarea", "required": true},
  {"name": "autres_documents", "label": "Autres documents", "type": "text", "required": false},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "clarification_sejour_prolonge"}'::jsonb,
1.99,
'Clarification séjour prolongé prête en 2 minutes',
'Lettre clarification séjour prolongé — Visa'
) ON CONFLICT (slug) DO NOTHING;

-- Template 20: Attestation lien familial
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre attestation lien familial',
  'immigration',
  'both',
  'lettre-attestation-lien-familial',
  'ATTESTATION DE LIEN FAMILIAL

Je soussigné(e) {{nom_declarant}}, né(e) le {{date_naissance_declarant}} à {{lieu_naissance_declarant}},

Atteste sur l honneur du lien de parenté suivant avec {{nom_personne_concernee}} :

LIEN DE PARENTÉ : {{lien_parente}}

DÉTAILS DU LIEN
{{details_lien}}

PREUVES DU LIEN
{{preuves_lien}}

HISTORIQUE DE LA RELATION
{{historique_relation}}

CONTACTS ET SOUTIEN
{{contacts_soutien}}

DOCUMENTS JOINTS
- Certificats de naissance
- Livret de famille
- Photos de famille
- {{autres_preuves}}

Je certifie l exactitude de ces informations et autorise leur vérification.

Coordonnées du déclarant :
Adresse : {{adresse_declarant}}
Téléphone : {{telephone}}
Email : {{email}}

Fait à {{ville}}, le {{date}}

{{nom_declarant}}
Signature',
'[
  {"name": "nom_declarant", "label": "Nom déclarant", "type": "text", "required": true},
  {"name": "date_naissance_declarant", "label": "Date naissance", "type": "date", "required": true},
  {"name": "lieu_naissance_declarant", "label": "Lieu naissance", "type": "text", "required": true},
  {"name": "nom_personne_concernee", "label": "Nom personne concernée", "type": "text", "required": true},
  {"name": "lien_parente", "label": "Lien de parenté", "type": "text", "required": true, "placeholder": "Père/Mère/Frère/Soeur/Conjoint"},
  {"name": "details_lien", "label": "Détails du lien", "type": "textarea", "required": true},
  {"name": "preuves_lien", "label": "Preuves du lien", "type": "textarea", "required": true},
  {"name": "historique_relation", "label": "Historique", "type": "textarea", "required": true},
  {"name": "contacts_soutien", "label": "Contacts et soutien", "type": "textarea", "required": true},
  {"name": "autres_preuves", "label": "Autres preuves", "type": "text", "required": false},
  {"name": "adresse_declarant", "label": "Adresse", "type": "text", "required": true},
  {"name": "telephone", "label": "Téléphone", "type": "tel", "required": true},
  {"name": "email", "label": "Email", "type": "email", "required": true},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "attestation_lien_familial"}'::jsonb,
1.99,
'Attestation lien familial prête à télécharger',
'Attestation lien familial — Immigration'
) ON CONFLICT (slug) DO NOTHING;