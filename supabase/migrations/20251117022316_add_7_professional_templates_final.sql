/*
  # Ajout de 7 nouveaux modèles professionnels

  1. Nouveaux templates
    - Attestation de travail (CNP/FEER)
    - Entente de confidentialité employé
    - Engagement non-concurrence
    - Engagement confidentialité simple
    - Engagement non-sollicitation
    - Contrat TET Québec
    - Contrat de services

  2. Catégories: professional, immigration
*/

-- 1) Attestation de travail
INSERT INTO document_templates (
  name, slug, category, description, template_content, template_variables, is_active, language
) VALUES (
  'Attestation de travail',
  'attestation-travail',
  'professional',
  'Attestation de travail avec CNP et FEER',
  'ATTESTATION DE TRAVAIL

{{entreprise_nom}}
Adresse : {{entreprise_adresse}}
Téléphone : {{entreprise_telephone}}
Courriel : {{entreprise_courriel}}

Objet : Attestation de travail

Je soussigné(e), {{signataire_nom}}, {{signataire_titre}} au sein de {{entreprise_nom}}, atteste que :

{{employe_nom}} a travaillé selon les conditions suivantes :

Poste : {{poste_titre}}
CNP : {{cnp_code}}
FEER : {{feer_categorie}}
Lieu : {{lieu_emploi}}
Période : du {{date_debut}} au {{date_fin}}
Horaire : {{heures_semaine}} h/semaine
Salaire : {{salaire_montant}} $/{{salaire_type}}

Tâches :
- {{tache_1}}
- {{tache_2}}
- {{tache_3}}
- {{tache_4}}

Fait à {{ville_signature}}, le {{date_signature}}.

{{signataire_nom}}, {{signataire_titre}}
{{signataire_telephone}} / {{signataire_courriel}}',
  '[
    {"key":"entreprise_nom","label":"Nom entreprise","type":"text","required":true},
    {"key":"entreprise_adresse","label":"Adresse","type":"textarea","required":true},
    {"key":"entreprise_telephone","label":"Téléphone","type":"text"},
    {"key":"entreprise_courriel","label":"Courriel","type":"text"},
    {"key":"signataire_nom","label":"Nom signataire","type":"text","required":true},
    {"key":"signataire_titre","label":"Titre","type":"text","required":true},
    {"key":"employe_nom","label":"Nom employé","type":"text","required":true},
    {"key":"poste_titre","label":"Poste","type":"text","required":true},
    {"key":"cnp_code","label":"Code CNP","type":"text"},
    {"key":"feer_categorie","label":"FEER","type":"text"},
    {"key":"lieu_emploi","label":"Lieu","type":"text","required":true},
    {"key":"date_debut","label":"Date début","type":"date","required":true},
    {"key":"date_fin","label":"Date fin","type":"text","required":true},
    {"key":"heures_semaine","label":"Heures/sem","type":"number","required":true},
    {"key":"salaire_montant","label":"Salaire","type":"number","required":true},
    {"key":"salaire_type","label":"Type salaire","type":"text","required":true},
    {"key":"tache_1","label":"Tâche 1","type":"textarea","required":true},
    {"key":"tache_2","label":"Tâche 2","type":"textarea"},
    {"key":"tache_3","label":"Tâche 3","type":"textarea"},
    {"key":"tache_4","label":"Tâche 4","type":"textarea"},
    {"key":"ville_signature","label":"Ville","type":"text","required":true},
    {"key":"date_signature","label":"Date","type":"date","required":true},
    {"key":"signataire_telephone","label":"Tél signataire","type":"text"},
    {"key":"signataire_courriel","label":"Email signataire","type":"text"}
  ]'::jsonb,
  true,
  'fr'
);

-- 2) Entente confidentialité employé
INSERT INTO document_templates (
  name, slug, category, description, template_content, template_variables, is_active, language
) VALUES (
  'Entente de confidentialité',
  'entente-confidentialite-employe',
  'professional',
  'Entente de confidentialité pour employés',
  'ENTENTE DE CONFIDENTIALITÉ

Entre {{bureau_nom}}, représenté par {{bureau_representant_nom}}, {{bureau_representant_titre}} (le Bureau)
et {{employe_nom}}, {{employe_statut}} (l''Employé)

1. Objet
Assurer la confidentialité des informations du Bureau.

2. Engagement
L''Employé s''engage à garder confidentielle toute information et à ne pas divulguer les renseignements.

3. Sécurité
L''Employé ne consultera que les informations nécessaires et utilisera les plateformes uniquement à des fins professionnelles.

4. Durée
Sans limite de temps.

5. Sanctions
Fin d''emploi et recours légaux en cas de manquement.

Fait à {{ville_signature}}, le {{date_signature}}.

Le Bureau: {{bureau_representant_nom}}
Signature: _______________

L''Employé: {{employe_nom}}
{{employe_adresse}}
{{employe_telephone}} / {{employe_courriel}}
Signature: _______________',
  '[
    {"key":"bureau_nom","label":"Nom cabinet","type":"text","required":true},
    {"key":"bureau_representant_nom","label":"Représentant","type":"text","required":true},
    {"key":"bureau_representant_titre","label":"Titre","type":"text","required":true},
    {"key":"employe_nom","label":"Nom employé","type":"text","required":true},
    {"key":"employe_statut","label":"Statut","type":"text","required":true},
    {"key":"employe_adresse","label":"Adresse","type":"textarea"},
    {"key":"employe_telephone","label":"Téléphone","type":"text"},
    {"key":"employe_courriel","label":"Courriel","type":"text"},
    {"key":"ville_signature","label":"Ville","type":"text","required":true},
    {"key":"date_signature","label":"Date","type":"date","required":true}
  ]'::jsonb,
  true,
  'fr'
);

-- 3) Non-concurrence
INSERT INTO document_templates (
  name, slug, category, description, template_content, template_variables, is_active, language
) VALUES (
  'Non-concurrence',
  'non-concurrence',
  'professional',
  'Engagement de non-concurrence',
  'UNDERTAKING NOT TO COMPETE

FROM: {{employe_nom}} (Employee)
TOWARDS: {{employeur_nom}} (Employer)

The Employee undertakes not to compete with the Employer in: {{activites_employeur}}.

Territory: {{territoire}}
Term: {{duree_annees}} year(s) after employment

Signed in {{ville_signature}}, {{date_signature}}

Employee: _______________ ({{employe_nom}})
Employer: _______________ ({{employeur_nom}})',
  '[
    {"key":"employe_nom","label":"Employee","type":"text","required":true},
    {"key":"employeur_nom","label":"Employer","type":"text","required":true},
    {"key":"activites_employeur","label":"Activities","type":"textarea","required":true},
    {"key":"territoire","label":"Territory","type":"text","required":true},
    {"key":"duree_annees","label":"Years","type":"number","required":true},
    {"key":"ville_signature","label":"City","type":"text","required":true},
    {"key":"date_signature","label":"Date","type":"date","required":true}
  ]'::jsonb,
  true,
  'en'
);

-- 4) Confidentialité simple
INSERT INTO document_templates (
  name, slug, category, description, template_content, template_variables, is_active, language
) VALUES (
  'Confidentialité simple',
  'confidentialite-simple',
  'professional',
  'Engagement de confidentialité simple',
  'UNDERTAKING OF CONFIDENTIALITY

FROM: {{employe_nom}} (Employee)
TOWARDS: {{employeur_nom}} (Employer)

The Employee acknowledges all information is confidential.

Term: {{duree_annees}} year(s) after employment

Signed in {{ville_signature}}, {{date_signature}}

Employee: _______________ ({{employe_nom}})
Employer: _______________ ({{employeur_nom}})',
  '[
    {"key":"employe_nom","label":"Employee","type":"text","required":true},
    {"key":"employeur_nom","label":"Employer","type":"text","required":true},
    {"key":"description_infos","label":"Information","type":"textarea"},
    {"key":"duree_annees","label":"Years","type":"number","required":true},
    {"key":"ville_signature","label":"City","type":"text","required":true},
    {"key":"date_signature","label":"Date","type":"date","required":true}
  ]'::jsonb,
  true,
  'en'
);

-- 5) Non-sollicitation
INSERT INTO document_templates (
  name, slug, category, description, template_content, template_variables, is_active, language
) VALUES (
  'Non-sollicitation',
  'non-sollicitation',
  'professional',
  'Non-sollicitation de clientèle',
  'NON-SOLLICITATION DE CLIENTÈLE

DE: {{employe_nom}}
ENVERS: {{employeur_nom}}

L''employé s''engage à ne pas solliciter les clients.

Territoire: {{territoire}}
Durée: {{duree_annees}} an(s)

Signé à {{ville_signature}}, le {{date_signature}}

Employé: _______________ ({{employe_nom}})
Employeur: _______________ ({{employeur_nom}})',
  '[
    {"key":"employe_nom","label":"Employé","type":"text","required":true},
    {"key":"employeur_nom","label":"Employeur","type":"text","required":true},
    {"key":"territoire","label":"Territoire","type":"text","required":true},
    {"key":"duree_annees","label":"Durée","type":"number","required":true},
    {"key":"ville_signature","label":"Ville","type":"text","required":true},
    {"key":"date_signature","label":"Date","type":"date","required":true}
  ]'::jsonb,
  true,
  'fr'
);

-- 6) Contrat TET
INSERT INTO document_templates (
  name, slug, category, description, template_content, template_variables, is_active, language
) VALUES (
  'Contrat TET Québec',
  'contrat-tet-quebec',
  'immigration',
  'Contrat travailleur étranger temporaire',
  'CONTRAT DE TRAVAIL TET

Employeur: {{entreprise_nom}} ({{entreprise_neq}})
{{entreprise_adresse}}

Employé: {{employe_prenom}} {{employe_nom}}
Né le: {{employe_date_naissance}}

Lieu: {{lieu_travail_adresse}}
Poste: {{poste_titre}}
Tâches: {{description_poste}}

Durée: {{duree_mois}} mois à partir du {{date_entree}}
Salaire: {{taux_horaire}} $/h
Horaire: {{heures_semaine}} h/semaine

Fait à {{ville_signature}}, le {{date_signature}}

Employeur: _______________
Employé: _______________',
  '[
    {"key":"entreprise_nom","label":"Entreprise","type":"text","required":true},
    {"key":"entreprise_neq","label":"NEQ","type":"text"},
    {"key":"entreprise_adresse","label":"Adresse","type":"textarea","required":true},
    {"key":"lieu_travail_adresse","label":"Lieu travail","type":"textarea","required":true},
    {"key":"employe_nom","label":"Nom","type":"text","required":true},
    {"key":"employe_prenom","label":"Prénom","type":"text","required":true},
    {"key":"employe_date_naissance","label":"Naissance","type":"date"},
    {"key":"duree_mois","label":"Durée (mois)","type":"number","required":true},
    {"key":"date_entree","label":"Date début","type":"date","required":true},
    {"key":"poste_titre","label":"Poste","type":"text","required":true},
    {"key":"description_poste","label":"Tâches","type":"textarea","required":true},
    {"key":"taux_horaire","label":"Taux $/h","type":"number","required":true},
    {"key":"heures_semaine","label":"Heures/sem","type":"number","required":true},
    {"key":"ville_signature","label":"Ville","type":"text","required":true},
    {"key":"date_signature","label":"Date","type":"date","required":true}
  ]'::jsonb,
  true,
  'fr'
);

-- 7) Contrat services
INSERT INTO document_templates (
  name, slug, category, description, template_content, template_variables, is_active, language
) VALUES (
  'Contrat de services',
  'contrat-services',
  'professional',
  'Contrat de services professionnel',
  'CONTRACT FOR SERVICES

Client: {{client_nom}}
{{client_adresse}}

Contractor: {{prestataire_nom}}
{{prestataire_adresse}}

Services: {{services_description}}

Term: {{date_debut}} to {{date_fin}}
Fees: {{taux_horaire}} ({{devise}})

Signed in {{ville_signature}}, {{date_signature}}

Client: _______________ ({{client_nom}})
Contractor: _______________ ({{prestataire_nom}})',
  '[
    {"key":"client_nom","label":"Client","type":"text","required":true},
    {"key":"client_adresse","label":"Client address","type":"textarea","required":true},
    {"key":"prestataire_nom","label":"Contractor","type":"text","required":true},
    {"key":"prestataire_adresse","label":"Contractor address","type":"textarea","required":true},
    {"key":"services_description","label":"Services","type":"textarea","required":true},
    {"key":"date_debut","label":"Start","type":"date","required":true},
    {"key":"date_fin","label":"End","type":"text","required":true},
    {"key":"taux_horaire","label":"Rate","type":"text","required":true},
    {"key":"devise","label":"Currency","type":"text","required":true},
    {"key":"ville_signature","label":"City","type":"text","required":true},
    {"key":"date_signature","label":"Date","type":"date","required":true}
  ]'::jsonb,
  true,
  'en'
);
