/*
  # Pack Immigration - Batch 2 (Templates 6-10)

  Templates:
    - Déclaration sur honneur résidence
    - Lettre invitation famille/visiteurs
    - Plan études (Study Plan)
    - Plan réinstallation (Settlement Plan)
    - Lettre référence professionnelle
*/

-- Template 6: Déclaration honneur résidence
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr, meta_description_fr
)
VALUES (
  'Déclaration honneur résidence immigration',
  'immigration',
  'both',
  'declaration-honneur-residence-immigration',
  'DÉCLARATION SUR L HONNEUR

Je soussigné(e) {{nom_complet}}, né(e) le {{date_naissance}} à {{lieu_naissance}},

Demeurant à {{adresse_actuelle}} depuis le {{date_debut_residence}},

Déclare sur l honneur :

{{declaration}}

Je certifie l exactitude de ces informations et m engage à signaler tout changement de situation.

DOCUMENTS JOINTS
{{documents_joints}}

Fait à {{ville}}, le {{date}}

{{nom_complet}}
Signature',
'[
  {"name": "nom_complet", "label": "Nom complet", "type": "text", "required": true},
  {"name": "date_naissance", "label": "Date naissance", "type": "date", "required": true},
  {"name": "lieu_naissance", "label": "Lieu naissance", "type": "text", "required": true},
  {"name": "adresse_actuelle", "label": "Adresse actuelle", "type": "text", "required": true},
  {"name": "date_debut_residence", "label": "Depuis le", "type": "date", "required": true},
  {"name": "declaration", "label": "Déclaration", "type": "textarea", "required": true, "placeholder": "Que je réside de manière permanente à cette adresse..."},
  {"name": "documents_joints", "label": "Documents joints", "type": "text", "required": true, "placeholder": "Factures services publics, bail..."},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "declaration_honneur_residence"}'::jsonb,
1.99,
'Déclaration sur honneur résidence prête en 1 minute',
'Déclaration honneur résidence — Modèle immigration',
'Déclaration sur honneur de résidence pour dossier immigration. Modèle complet avec pièces justificatives.'
) ON CONFLICT (slug) DO NOTHING;

-- Template 7: Lettre invitation famille
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr, meta_description_fr
)
VALUES (
  'Lettre invitation famille visiteurs',
  'immigration',
  'both',
  'lettre-invitation-famille-visiteurs-visa',
  'LETTRE D INVITATION

Je soussigné(e) {{nom_invitant}}, {{statut_immigration}}, résidant à {{adresse_invitant}},

Invite {{nom_invite}}, né(e) le {{date_naissance_invite}}, résidant actuellement à {{adresse_invite}},

à me rendre visite au {{pays}} pour une durée de {{duree_sejour}}.

DATES DU SÉJOUR
Du {{date_debut}} au {{date_fin}}

LIEN DE PARENTÉ
{{lien_parente}}

MOTIF DE LA VISITE
{{motif_visite}}

HÉBERGEMENT
{{details_hebergement}}

PRISE EN CHARGE FINANCIÈRE
{{prise_en_charge}}

DOCUMENTS JOINTS
- Copie pièce d identité
- Preuve de résidence
- Preuves financières
{{autres_documents}}

Fait à {{ville}}, le {{date}}

{{nom_invitant}}
Signature',
'[
  {"name": "nom_invitant", "label": "Nom invitant", "type": "text", "required": true},
  {"name": "statut_immigration", "label": "Statut", "type": "text", "required": true, "placeholder": "citoyen canadien"},
  {"name": "adresse_invitant", "label": "Adresse invitant", "type": "text", "required": true},
  {"name": "nom_invite", "label": "Nom invité", "type": "text", "required": true},
  {"name": "date_naissance_invite", "label": "Date naissance invité", "type": "date", "required": true},
  {"name": "adresse_invite", "label": "Adresse invité", "type": "text", "required": true},
  {"name": "pays", "label": "Pays", "type": "text", "required": true, "placeholder": "Canada"},
  {"name": "duree_sejour", "label": "Durée séjour", "type": "text", "required": true, "placeholder": "3 semaines"},
  {"name": "date_debut", "label": "Date début", "type": "date", "required": true},
  {"name": "date_fin", "label": "Date fin", "type": "date", "required": true},
  {"name": "lien_parente", "label": "Lien de parenté", "type": "text", "required": true},
  {"name": "motif_visite", "label": "Motif visite", "type": "textarea", "required": true},
  {"name": "details_hebergement", "label": "Hébergement", "type": "textarea", "required": true},
  {"name": "prise_en_charge", "label": "Prise en charge", "type": "textarea", "required": true},
  {"name": "autres_documents", "label": "Autres documents", "type": "text", "required": false},
  {"name": "ville", "label": "Ville", "type": "text", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "lettre_invitation_famille"}'::jsonb,
1.99,
'Lettre invitation famille prête en 30 secondes',
'Lettre invitation famille — Modèle visa visiteur',
'Lettre invitation pour visite familiale. Modèle pour visa visiteur avec tous les éléments requis.'
) ON CONFLICT (slug) DO NOTHING;

-- Template 8: Plan études (Study Plan)
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr, meta_description_fr
)
VALUES (
  'Plan études Study Plan',
  'immigration',
  'both',
  'plan-etudes-study-plan-visa-etudiant',
  'PLAN D ÉTUDES / STUDY PLAN

Nom : {{nom_complet}}
Programme : {{programme}}
Établissement : {{etablissement}}

1. CONTEXTE ACADÉMIQUE
{{contexte_academique}}

2. CHOIX DU PROGRAMME
{{raisons_choix_programme}}

3. CHOIX DE L ÉTABLISSEMENT
{{raisons_choix_etablissement}}

4. OBJECTIFS D APPRENTISSAGE
{{objectifs_apprentissage}}

5. PLAN DE CARRIÈRE
Court terme (0-2 ans) : {{plan_court_terme}}

Moyen terme (3-5 ans) : {{plan_moyen_terme}}

Long terme (5+ ans) : {{plan_long_terme}}

6. RETOUR DANS LE PAYS D ORIGINE
{{plan_retour}}

7. CONTRIBUTION
{{contribution_prevue}}

Date : {{date}}
{{nom_complet}}',
'[
  {"name": "nom_complet", "label": "Nom complet", "type": "text", "required": true},
  {"name": "programme", "label": "Programme", "type": "text", "required": true},
  {"name": "etablissement", "label": "Établissement", "type": "text", "required": true},
  {"name": "contexte_academique", "label": "Contexte académique", "type": "textarea", "required": true, "placeholder": "Mon parcours antérieur..."},
  {"name": "raisons_choix_programme", "label": "Raisons choix programme", "type": "textarea", "required": true},
  {"name": "raisons_choix_etablissement", "label": "Raisons choix établissement", "type": "textarea", "required": true},
  {"name": "objectifs_apprentissage", "label": "Objectifs apprentissage", "type": "textarea", "required": true},
  {"name": "plan_court_terme", "label": "Plan court terme", "type": "textarea", "required": true},
  {"name": "plan_moyen_terme", "label": "Plan moyen terme", "type": "textarea", "required": true},
  {"name": "plan_long_terme", "label": "Plan long terme", "type": "textarea", "required": true},
  {"name": "plan_retour", "label": "Plan de retour", "type": "textarea", "required": true},
  {"name": "contribution_prevue", "label": "Contribution prévue", "type": "textarea", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "study_plan"}'::jsonb,
1.99,
'Study Plan pour visa étudiant prêt en 2 minutes',
'Plan études Study Plan — Visa étudiant',
'Study Plan professionnel pour demande visa étudiant. Structure complète avec objectifs et plan de carrière.'
) ON CONFLICT (slug) DO NOTHING;

-- Template 9: Plan réinstallation (Settlement Plan)
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Plan réinstallation Settlement Plan',
  'immigration',
  'both',
  'plan-reinstallation-settlement-plan',
  'PLAN DE RÉINSTALLATION / SETTLEMENT PLAN

Nom : {{nom_complet}}
Destination : {{ville_destination}}, {{pays_destination}}

1. RAISONS DE L IMMIGRATION
{{raisons_immigration}}

2. LOGEMENT
{{plan_logement}}

3. EMPLOI ET CARRIÈRE
{{plan_emploi}}

4. INTÉGRATION
Langue : {{competences_linguistiques}}
Réseau : {{reseau_social}}
Communauté : {{integration_communaute}}

5. FINANCES
Fonds disponibles : {{fonds_disponibles}} {{devise}}
Budget mensuel : {{budget_mensuel}} {{devise}}
{{plan_financier}}

6. FAMILLE
{{situation_familiale}}

7. OBJECTIFS PREMIERS MOIS
{{objectifs_3_mois}}

8. PLAN LONG TERME
{{objectifs_long_terme}}

Date : {{date}}
{{nom_complet}}',
'[
  {"name": "nom_complet", "label": "Nom complet", "type": "text", "required": true},
  {"name": "ville_destination", "label": "Ville", "type": "text", "required": true},
  {"name": "pays_destination", "label": "Pays", "type": "text", "required": true},
  {"name": "raisons_immigration", "label": "Raisons immigration", "type": "textarea", "required": true},
  {"name": "plan_logement", "label": "Plan logement", "type": "textarea", "required": true},
  {"name": "plan_emploi", "label": "Plan emploi", "type": "textarea", "required": true},
  {"name": "competences_linguistiques", "label": "Compétences langue", "type": "text", "required": true},
  {"name": "reseau_social", "label": "Réseau social", "type": "text", "required": true},
  {"name": "integration_communaute", "label": "Intégration", "type": "textarea", "required": true},
  {"name": "fonds_disponibles", "label": "Fonds disponibles", "type": "number", "required": true},
  {"name": "devise", "label": "Devise", "type": "text", "required": true, "placeholder": "CAD"},
  {"name": "budget_mensuel", "label": "Budget mensuel", "type": "number", "required": true},
  {"name": "plan_financier", "label": "Plan financier", "type": "textarea", "required": true},
  {"name": "situation_familiale", "label": "Situation familiale", "type": "textarea", "required": true},
  {"name": "objectifs_3_mois", "label": "Objectifs 3 premiers mois", "type": "textarea", "required": true},
  {"name": "objectifs_long_terme", "label": "Objectifs long terme", "type": "textarea", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "settlement_plan"}'::jsonb,
1.99,
'Settlement Plan pour résidence permanente prêt',
'Plan réinstallation Settlement Plan — Immigration'
) ON CONFLICT (slug) DO NOTHING;

-- Template 10: Lettre référence professionnelle
INSERT INTO document_templates (
  name, category, language, slug,
  template_content, template_variables,
  ai_metadata, price, quick_vocal_fr,
  meta_title_fr
)
VALUES (
  'Lettre référence professionnelle immigration',
  'immigration',
  'both',
  'lettre-reference-professionnelle-immigration',
  'LETTRE DE RÉFÉRENCE PROFESSIONNELLE

{{entreprise}}
{{adresse_entreprise}}

Objet : Lettre de référence pour {{nom_employe}}

Madame, Monsieur,

Je soussigné(e) {{nom_referent}}, {{poste_referent}} chez {{entreprise}}, confirme avoir supervisé {{nom_employe}} du {{date_debut}} au {{date_fin}}.

POSTE OCCUPÉ : {{poste}}

RESPONSABILITÉS
{{responsabilites}}

COMPÉTENCES DÉMONTRÉES
{{competences}}

RÉALISATIONS
{{realisations}}

QUALITÉS PROFESSIONNELLES
{{qualites}}

Je recommande {{nom_employe}} sans réserve pour {{motif_recommandation}}.

Contact : {{email_referent}} | {{telephone_referent}}

{{nom_referent}}
{{poste_referent}}
Date : {{date}}',
'[
  {"name": "entreprise", "label": "Entreprise", "type": "text", "required": true},
  {"name": "adresse_entreprise", "label": "Adresse", "type": "text", "required": true},
  {"name": "nom_referent", "label": "Nom référent", "type": "text", "required": true},
  {"name": "poste_referent", "label": "Poste référent", "type": "text", "required": true},
  {"name": "nom_employe", "label": "Nom employé", "type": "text", "required": true},
  {"name": "date_debut", "label": "Date début", "type": "date", "required": true},
  {"name": "date_fin", "label": "Date fin", "type": "date", "required": true},
  {"name": "poste", "label": "Poste occupé", "type": "text", "required": true},
  {"name": "responsabilites", "label": "Responsabilités", "type": "textarea", "required": true},
  {"name": "competences", "label": "Compétences", "type": "textarea", "required": true},
  {"name": "realisations", "label": "Réalisations", "type": "textarea", "required": true},
  {"name": "qualites", "label": "Qualités", "type": "textarea", "required": true},
  {"name": "motif_recommandation", "label": "Motif recommandation", "type": "text", "required": true, "placeholder": "son immigration au Canada"},
  {"name": "email_referent", "label": "Email référent", "type": "email", "required": true},
  {"name": "telephone_referent", "label": "Téléphone", "type": "tel", "required": true},
  {"name": "date", "label": "Date", "type": "date", "required": true}
]'::jsonb,
'{"template_code": "lettre_reference_professionnelle"}'::jsonb,
1.99,
'Lettre référence professionnelle pour immigration',
'Lettre référence professionnelle — Immigration'
) ON CONFLICT (slug) DO NOTHING;