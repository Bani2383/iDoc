/*
  # Pack Immigration - Batch 1 (Templates 1-5)

  1. Templates
    - Lettre motivation visa étudiant
    - Lettre explication refus visa
    - Lettre soutien financier sponsor
    - Lettre emploi permis travail
    - Attestation hébergement immigration

  2. Caractéristiques
    - Bilingues (FR+EN via template_content_en)
    - Variables complètes
    - Prix 1.99$
    - AI metadata
*/

-- Template 1: Lettre motivation visa étudiant
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr, quick_vocal_en,
  meta_title_fr, meta_description_fr
)
VALUES (
  'Lettre de motivation visa étudiant',
  'immigration',
  'both',
  'lettre-motivation-visa-etudiant',
  'Objet : Lettre de motivation – Demande de visa étudiant

Madame, Monsieur,

Admis(e) au programme {{programme}} à {{etablissement}}, je souhaite poursuivre mes études supérieures dans votre pays.

MON PARCOURS ACADÉMIQUE
{{parcours_academique}}

MON PROJET D ÉTUDES
{{projet_etudes}}

FINANCEMENT
Je dispose des ressources financières nécessaires :
{{sources_financement}}

Montant disponible : {{montant_total}} {{devise}}

PROJET PROFESSIONNEL
À l issue de mes études, je compte :
{{projet_professionnel}}

ENGAGEMENT DE RETOUR
{{engagement_retour}}

Je m engage à respecter toutes les conditions de mon visa et à retourner dans mon pays d origine à la fin de mes études.

Fait à {{ville}}, le {{date}}

{{nom_complet}}
Signature',
'[
  {"name": "nom_complet", "label": "Nom complet", "type": "text", "required": true},
  {"name": "programme", "label": "Programme études", "type": "text", "required": true, "placeholder": "Master en Informatique"},
  {"name": "etablissement", "label": "Établissement", "type": "text", "required": true, "placeholder": "Université de Toronto"},
  {"name": "parcours_academique", "label": "Parcours académique", "type": "textarea", "required": true},
  {"name": "projet_etudes", "label": "Projet études", "type": "textarea", "required": true},
  {"name": "sources_financement", "label": "Sources financement", "type": "textarea", "required": true},
  {"name": "montant_total", "label": "Montant total", "type": "number", "required": true, "placeholder": "30000"},
  {"name": "devise", "label": "Devise", "type": "text", "required": true, "placeholder": "CAD"},
  {"name": "projet_professionnel", "label": "Projet professionnel", "type": "textarea", "required": true},
  {"name": "engagement_retour", "label": "Engagement de retour", "type": "textarea", "required": true},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "lettre_motivation_visa_etudiant"}'::jsonb,
1.99,
'Lettre de motivation pour visa étudiant prête en 1 minute',
'Student visa motivation letter ready in 1 minute',
'Lettre de motivation visa étudiant — Modèle professionnel',
'Modèle prêt de lettre de motivation pour visa étudiant. Exemples, conseils, FAQ et template téléchargeable en 1 minute.'
) ON CONFLICT (slug) DO NOTHING;

-- Template 2: Lettre explication refus
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr, meta_description_fr
)
VALUES (
  'Lettre explication refus visa',
  'immigration',
  'both',
  'lettre-explication-refus-visa',
  'Objet : Lettre d explication – Suite au refus de visa {{date_refus}}

Madame, Monsieur,

Par la présente, je souhaite répondre aux motifs de refus de ma demande de visa (numéro {{numero_demande}}).

MOTIFS DE REFUS
{{motifs_refus}}

MES EXPLICATIONS

{{explication_motif_1}}

{{explication_motif_2}}

{{explication_motif_3}}

NOUVELLES PREUVES FOURNIES
{{documents_joints}}

ENGAGEMENT
{{engagement}}

Fait à {{ville}}, le {{date}}

{{nom_complet}}',
'[
  {"name": "nom_complet", "label": "Nom complet", "type": "text", "required": true},
  {"name": "date_refus", "label": "Date refus", "type": "date", "required": true},
  {"name": "numero_demande", "label": "Numéro demande", "type": "text", "required": true},
  {"name": "motifs_refus", "label": "Motifs de refus", "type": "textarea", "required": true},
  {"name": "explication_motif_1", "label": "Explication 1", "type": "textarea", "required": true},
  {"name": "explication_motif_2", "label": "Explication 2", "type": "textarea", "required": true},
  {"name": "explication_motif_3", "label": "Explication 3", "type": "textarea", "required": false},
  {"name": "documents_joints", "label": "Documents joints", "type": "textarea", "required": true},
  {"name": "engagement", "label": "Engagement", "type": "textarea", "required": true},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "lettre_explication_refus"}'::jsonb,
1.99,
'Lettre explication après refus de visa — modèle rapide',
'Lettre explication après refus de visa — modèle',
'Modèle pour répondre à un refus de visa. Adressez point par point les motifs et renforcez votre dossier.'
) ON CONFLICT (slug) DO NOTHING;

-- Template 3: Soutien financier
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr, meta_description_fr
)
VALUES (
  'Lettre de soutien financier',
  'immigration',
  'both',
  'lettre-soutien-financier-immigration',
  'LETTRE DE SOUTIEN FINANCIER

Je soussigné(e) {{nom_sponsor}}, né(e) le {{date_naissance_sponsor}}, résidant à {{adresse_sponsor}},

Déclare apporter mon soutien financier à {{nom_beneficiaire}} pour {{motif_soutien}}.

RELATION : {{lien_parente}}

ENGAGEMENT FINANCIER
Montant : {{montant}} {{devise}} par {{periode}}
Durée : {{duree}}

RESSOURCES
Profession : {{profession}}
Revenus annuels : {{revenus}} {{devise}}

DOCUMENTS JOINTS
- Relevés bancaires {{nb_mois}} mois
- Avis imposition
{{autres_documents}}

Fait à {{ville}}, le {{date}}

{{nom_sponsor}}',
'[
  {"name": "nom_sponsor", "label": "Nom sponsor", "type": "text", "required": true},
  {"name": "date_naissance_sponsor", "label": "Date naissance", "type": "date", "required": true},
  {"name": "adresse_sponsor", "label": "Adresse", "type": "text", "required": true},
  {"name": "nom_beneficiaire", "label": "Bénéficiaire", "type": "text", "required": true},
  {"name": "motif_soutien", "label": "Motif", "type": "text", "required": true, "placeholder": "ses études"},
  {"name": "lien_parente", "label": "Lien de parenté", "type": "text", "required": true},
  {"name": "montant", "label": "Montant", "type": "number", "required": true},
  {"name": "devise", "label": "Devise", "type": "text", "required": true, "placeholder": "CAD"},
  {"name": "periode", "label": "Période", "type": "text", "required": true, "placeholder": "mois"},
  {"name": "duree", "label": "Durée", "type": "text", "required": true},
  {"name": "profession", "label": "Profession", "type": "text", "required": true},
  {"name": "revenus", "label": "Revenus annuels", "type": "number", "required": true},
  {"name": "nb_mois", "label": "Nb mois relevés", "type": "number", "required": true, "placeholder": "6"},
  {"name": "autres_documents", "label": "Autres documents", "type": "text", "required": false},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "lettre_soutien_financier"}'::jsonb,
1.99,
'Lettre de soutien financier prête en 1 minute',
'Lettre de soutien financier — Modèle visa & études',
'Modèle clair de lettre de soutien financier avec exemples et pièces justificatives recommandées.'
) ON CONFLICT (slug) DO NOTHING;

-- Template 4: Lettre emploi permis travail
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre emploi permis de travail',
  'immigration',
  'both',
  'lettre-emploi-permis-travail',
  'LETTRE D EMPLOI POUR PERMIS DE TRAVAIL

{{entreprise}}
{{adresse_entreprise}}

Objet : Confirmation d emploi pour {{nom_employe}}

Madame, Monsieur,

Nous confirmons que {{nom_employe}}, né(e) le {{date_naissance}}, est employé(e) dans notre entreprise depuis le {{date_debut}}.

POSTE : {{poste}}
STATUT : {{statut_emploi}}
SALAIRE : {{salaire}} {{devise}} par {{periode}}

DESCRIPTION DU POSTE
{{description_poste}}

DURÉE DU CONTRAT
Du {{date_debut_contrat}} au {{date_fin_contrat}}

CONDITIONS
{{conditions_emploi}}

Nous certifions l exactitude de ces informations.

{{nom_responsable}}
{{titre_responsable}}
Date : {{date}}',
'[
  {"name": "entreprise", "label": "Nom entreprise", "type": "text", "required": true},
  {"name": "adresse_entreprise", "label": "Adresse", "type": "text", "required": true},
  {"name": "nom_employe", "label": "Nom employé", "type": "text", "required": true},
  {"name": "date_naissance", "label": "Date naissance", "type": "date", "required": true},
  {"name": "date_debut", "label": "Date début emploi", "type": "date", "required": true},
  {"name": "poste", "label": "Poste", "type": "text", "required": true},
  {"name": "statut_emploi", "label": "Statut", "type": "text", "required": true, "placeholder": "Temps plein"},
  {"name": "salaire", "label": "Salaire", "type": "number", "required": true},
  {"name": "devise", "label": "Devise", "type": "text", "required": true, "placeholder": "CAD"},
  {"name": "periode", "label": "Période", "type": "text", "required": true, "placeholder": "année"},
  {"name": "description_poste", "label": "Description poste", "type": "textarea", "required": true},
  {"name": "date_debut_contrat", "label": "Début contrat", "type": "date", "required": true},
  {"name": "date_fin_contrat", "label": "Fin contrat", "type": "date", "required": false},
  {"name": "conditions_emploi", "label": "Conditions", "type": "textarea", "required": false},
  {"name": "nom_responsable", "label": "Nom responsable", "type": "text", "required": true},
  {"name": "titre_responsable", "label": "Titre", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "lettre_emploi_permis_travail"}'::jsonb,
1.99,
'Lettre emploi pour permis de travail prête à télécharger',
'Lettre emploi permis de travail — Modèle professionnel'
) ON CONFLICT (slug) DO NOTHING;

-- Template 5: Attestation hébergement immigration
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Attestation hébergement immigration',
  'immigration',
  'both',
  'attestation-hebergement-immigration-visa',
  'ATTESTATION D HÉBERGEMENT

Je soussigné(e) {{nom_hebergeur}}, né(e) le {{date_naissance_hebergeur}}, demeurant au {{adresse_hebergeur}},

Atteste héberger à titre {{type_hebergement}} :

{{nom_heberge}}
Né(e) le {{date_naissance_heberge}}

à mon domicile situé au {{adresse_hebergeur}} depuis le {{date_debut}}.

MOTIF : {{motif_hebergement}}

DOCUMENTS JOINTS
- Copie pièce d identité
- Justificatif domicile
{{autres_documents}}

Fait à {{ville}}, le {{date}}

{{nom_hebergeur}}',
'[
  {"name": "nom_hebergeur", "label": "Nom hébergeur", "type": "text", "required": true},
  {"name": "date_naissance_hebergeur", "label": "Date naissance", "type": "date", "required": true},
  {"name": "adresse_hebergeur", "label": "Adresse", "type": "text", "required": true},
  {"name": "type_hebergement", "label": "Type hébergement", "type": "text", "required": true, "placeholder": "gratuit"},
  {"name": "nom_heberge", "label": "Nom hébergé", "type": "text", "required": true},
  {"name": "date_naissance_heberge", "label": "Date naissance hébergé", "type": "date", "required": true},
  {"name": "date_debut", "label": "Date début", "type": "date", "required": true},
  {"name": "motif_hebergement", "label": "Motif", "type": "text", "required": true},
  {"name": "autres_documents", "label": "Autres documents", "type": "text", "required": false},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "attestation_hebergement_immigration"}'::jsonb,
1.99,
'Attestation hébergement pour immigration prête en 1 min',
'Attestation hébergement immigration — Modèle officiel'
) ON CONFLICT (slug) DO NOTHING;