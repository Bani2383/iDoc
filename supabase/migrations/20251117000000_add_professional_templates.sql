/*
  # Ajout de 7 nouveaux modèles professionnels

  1. Nouveaux templates
    - Attestation de travail (avec CNP et FEER)
    - Entente de confidentialité (employé)
    - Engagement de non-concurrence
    - Engagement de confidentialité simple
    - Engagement de non-sollicitation de la clientèle
    - Contrat de travail TET Québec
    - Contrat de services 1476

  2. Notes
    - Templates bilingues (français/anglais selon le modèle)
    - Champs structurés avec types appropriés
    - Catégories: RH, Juridique, Immigration
*/

-- Attestation de travail
INSERT INTO document_templates (
  name,
  category,
  description,
  content,
  fields,
  is_active
) VALUES (
  'Attestation de travail',
  'RH',
  'Attestation de travail standard pour un employé avec CNP et FEER.',
  'ATTESTATION DE TRAVAIL

{{entreprise_nom}}
Adresse : {{entreprise_adresse}}
Téléphone : {{entreprise_telephone}}
Courriel : {{entreprise_courriel}}

Objet : Attestation de travail

Je soussigné(e), {{signataire_nom}}, agissant en qualité de {{signataire_titre}} au sein de {{entreprise_nom}},
atteste par la présente que :

{{employe_nom}} a travaillé au sein de notre entreprise selon les conditions suivantes :

Titre du poste : {{poste_titre}}
Code national des professions (CNP) : {{cnp_code}}
Catégorie FEER : {{feer_categorie}}

Lieu d''emploi : {{lieu_emploi}}

Durée d''emploi : du {{date_debut}} au {{date_fin}}

Horaire : {{heures_semaine}} heures par semaine

Salaire : {{salaire_montant}} $ par {{salaire_type}}

Principales tâches et responsabilités :
- {{tache_1}}
- {{tache_2}}
- {{tache_3}}
- {{tache_4}}

Fait à {{ville_signature}}, le {{date_signature}}.

Signature : ____________________________

{{signataire_nom}}
{{signataire_titre}}
{{signataire_telephone}} / {{signataire_courriel}}',
  '[
    {"key": "entreprise_nom", "label": "Nom de l''entreprise", "type": "text", "required": true},
    {"key": "entreprise_adresse", "label": "Adresse de l''entreprise", "type": "textarea", "required": true},
    {"key": "entreprise_telephone", "label": "Téléphone de l''entreprise", "type": "text"},
    {"key": "entreprise_courriel", "label": "Courriel de l''entreprise", "type": "text"},
    {"key": "signataire_nom", "label": "Nom complet du signataire", "type": "text", "required": true},
    {"key": "signataire_titre", "label": "Titre du signataire", "type": "text", "required": true},
    {"key": "employe_nom", "label": "Nom complet de l''employé(e)", "type": "text", "required": true},
    {"key": "poste_titre", "label": "Titre du poste", "type": "text", "required": true},
    {"key": "cnp_code", "label": "Code national des professions (CNP)", "type": "text"},
    {"key": "feer_categorie", "label": "Catégorie FEER", "type": "text"},
    {"key": "lieu_emploi", "label": "Lieu d''emploi (ville, province)", "type": "text", "required": true},
    {"key": "date_debut", "label": "Date de début d''emploi", "type": "date", "required": true},
    {"key": "date_fin", "label": "Date de fin (ou à ce jour)", "type": "text", "required": true},
    {"key": "heures_semaine", "label": "Nombre d''heures par semaine", "type": "number", "required": true},
    {"key": "salaire_montant", "label": "Salaire (montant)", "type": "number", "required": true},
    {"key": "salaire_type", "label": "Type de salaire (heure/année)", "type": "text", "required": true},
    {"key": "tache_1", "label": "Tâche / responsabilité 1", "type": "textarea", "required": true},
    {"key": "tache_2", "label": "Tâche / responsabilité 2", "type": "textarea"},
    {"key": "tache_3", "label": "Tâche / responsabilité 3", "type": "textarea"},
    {"key": "tache_4", "label": "Tâche / responsabilité 4", "type": "textarea"},
    {"key": "ville_signature", "label": "Ville de signature", "type": "text", "required": true},
    {"key": "date_signature", "label": "Date de signature", "type": "date", "required": true},
    {"key": "signataire_telephone", "label": "Téléphone du signataire", "type": "text"},
    {"key": "signataire_courriel", "label": "Courriel du signataire", "type": "text"}
  ]'::jsonb,
  true
);

-- Entente de confidentialité (employé)
INSERT INTO document_templates (
  name,
  category,
  description,
  content,
  fields,
  is_active
) VALUES (
  'Entente de confidentialité (employé)',
  'RH',
  'Entente de confidentialité et de protection des renseignements personnels pour les employés du cabinet.',
  'ENTENTE DE CONFIDENTIALITÉ ET DE PROTECTION DES RENSEIGNEMENTS PERSONNELS

Entre
{{bureau_nom}}, représenté par {{bureau_representant_nom}}, {{bureau_representant_titre}},
ci-après désigné « le Bureau »

et
{{employe_nom}},
{{employe_statut}},
Adresse : {{employe_adresse}}
Téléphone : {{employe_telephone}}
Courriel : {{employe_courriel}}
ci-après désigné(e) « l''Employé(e) »

1. Objet de l''entente

La présente entente a pour but d''assurer la confidentialité des informations traitées par l''Employé(e) dans le cadre
de son emploi, ainsi que la protection des renseignements personnels des clients, partenaires et collaborateurs du Bureau.

2. Engagement de confidentialité

L''Employé(e) s''engage à :

- garder confidentielle toute information obtenue ou consultée dans le cadre de ses fonctions, qu''elle soit de nature
  juridique, administrative, financière ou personnelle;
- ne pas divulguer, partager ou reproduire, de quelque manière que ce soit, les documents ou renseignements
  confidentiels à des tiers, pendant ou après la durée de son emploi;
- ne pas conserver de copies physiques ou numériques des documents ou dossiers du Bureau après la fin de son emploi.

3. Protection des renseignements personnels et sécurité

L''Employé(e) reconnaît que toute information relative à l''identité, la situation familiale, le statut migratoire,
les dossiers juridiques ou financiers des clients constitue un renseignement personnel et s''engage à :

- ne consulter que les renseignements nécessaires à l''exécution de ses tâches;
- utiliser les plateformes du Bureau uniquement à des fins professionnelles;
- aviser immédiatement le Bureau en cas de bris de confidentialité ou d''accès non autorisé;
- s''abstenir d''utiliser des appareils personnels pour transférer ou conserver des documents ou informations des clients;
- limiter l''usage du téléphone cellulaire aux seules fins professionnelles, sauf urgence.

4. Durée de l''engagement

La présente entente entre en vigueur à compter de sa signature et se poursuit sans limite de temps, y compris après
la fin de l''emploi.

5. Sanctions

Tout manquement à la présente entente pourra entraîner la fin immédiate de l''emploi ainsi que des recours légaux, au besoin.

6. Signatures

Fait à {{ville_signature}}, le {{date_signature}}.

Pour {{bureau_nom}}
{{bureau_representant_nom}}
Signature : ___________________________

L''Employé(e)
{{employe_nom}}
Adresse : {{employe_adresse}}
Tél. : {{employe_telephone}}
Courriel : {{employe_courriel}}

Signature : ___________________________',
  '[
    {"key": "bureau_nom", "label": "Nom du cabinet", "type": "text", "required": true},
    {"key": "bureau_representant_nom", "label": "Nom du représentant du cabinet", "type": "text", "required": true},
    {"key": "bureau_representant_titre", "label": "Titre du représentant", "type": "text", "required": true},
    {"key": "employe_nom", "label": "Nom complet de l''employé(e)", "type": "text", "required": true},
    {"key": "employe_statut", "label": "Statut (employé, stagiaire, etc.)", "type": "text", "required": true},
    {"key": "employe_adresse", "label": "Adresse de l''employé(e)", "type": "textarea"},
    {"key": "employe_telephone", "label": "Téléphone de l''employé(e)", "type": "text"},
    {"key": "employe_courriel", "label": "Courriel de l''employé(e)", "type": "text"},
    {"key": "ville_signature", "label": "Ville de signature", "type": "text", "required": true},
    {"key": "date_signature", "label": "Date de signature", "type": "date", "required": true}
  ]'::jsonb,
  true
);

-- Engagement de non-concurrence
INSERT INTO document_templates (
  name,
  category,
  description,
  content,
  fields,
  is_active
) VALUES (
  'Engagement de non-concurrence',
  'Juridique',
  'Engagement individuel de non-concurrence de l''employé envers l''employeur.',
  'UNDERTAKING NOT TO COMPETE

FROM: {{employe_nom}} (hereinafter referred to as the "Employee")

TOWARDS: {{employeur_nom}} (hereinafter referred to as the "Employer")

For good and valuable consideration, particularly his/her employment and continued status as an employee,
the Employee undertakes in favour of the Employer not to compete with the Employer, nor to participate in any
manner whatsoever (whether directly or indirectly, or whether personally or through the intermediary of a legal or
natural person) in another business with operations similar to the Employer''s operations as of the date of this
undertaking, namely: {{activites_employeur}}.

Without limiting the generality of the foregoing, the Employee undertakes not to participate, whether as owner,
partner, employee, director, officer, advisor, shareholder or investor, in any business whose activities are similar
to the Employer''s.

Territory: This undertaking shall apply to the following territory: {{territoire}}.

Term: This undertaking shall apply for the entire term of the employment relationship and for a further period
of {{duree_annees}} year(s) following the termination of the said relationship.

In the event of default, the Employee shall compensate the Employer for any damage resulting therefrom, without
prejudice to the Employer''s other rights and recourses, including the right to seek injunctive relief.

SIGNED IN {{ville_signature}}, on {{date_signature}}.

THE EMPLOYEE

______________________________        ______________________________
Witness                               {{employe_nom}}

THE EMPLOYER

______________________________        ______________________________
Witness                               {{employeur_nom}}',
  '[
    {"key": "employe_nom", "label": "Nom de l''employé", "type": "text", "required": true},
    {"key": "employeur_nom", "label": "Nom de l''employeur", "type": "text", "required": true},
    {"key": "activites_employeur", "label": "Description des activités de l''employeur", "type": "textarea", "required": true},
    {"key": "territoire", "label": "Territoire visé", "type": "text", "required": true},
    {"key": "duree_annees", "label": "Durée (années)", "type": "number", "required": true},
    {"key": "ville_signature", "label": "Ville de signature", "type": "text", "required": true},
    {"key": "date_signature", "label": "Date de signature", "type": "date", "required": true}
  ]'::jsonb,
  true
);

-- Engagement de confidentialité simple
INSERT INTO document_templates (
  name,
  category,
  description,
  content,
  fields,
  is_active
) VALUES (
  'Engagement de confidentialité (simple)',
  'Juridique',
  'Engagement de confidentialité unilatéral de l''employé envers l''employeur.',
  'UNDERTAKING OF CONFIDENTIALITY

FROM: {{employe_nom}} (hereinafter referred to as the "Employee")

TOWARDS: {{employeur_nom}} (hereinafter referred to as the "Employer")

Right of Ownership:
The Employee acknowledges that all the information and documents supplied or to be supplied by the Employer
(client lists, price lists, procedures, methods, contracts, software, databases, plans, etc.) are strictly confidential
and remain the property of the Employer.

Undertaking:
The Employee undertakes to:

- maintain the confidentiality of all such information and documents, including but not limited to:
  {{description_infos}};
- not convey or transmit any of the said information or documents, and not use them except in the performance
  of his/her duties;
- take all necessary measures to preserve confidentiality;
- not make or keep copies, photocopies, drafts or any other reproduction of such documents or information,
  except in the performance of duties.

No License:
All such information and documents remain the exclusive property of the Employer, and the Employee acquires
no licence or interest therein.

Term:
This undertaking shall apply for the entire term of the employment relationship and for a further period of
{{duree_annees}} year(s) following its termination.

In the event of default, the Employee shall compensate the Employer for any damage resulting therefrom, without
prejudice to the Employer''s other rights and recourses, including the right to seek injunctive relief.

SIGNED IN {{ville_signature}}, on {{date_signature}}.

THE EMPLOYEE

______________________________        ______________________________
Witness                               {{employe_nom}}

THE EMPLOYER

______________________________        ______________________________
Witness                               {{employeur_nom}}',
  '[
    {"key": "employe_nom", "label": "Nom de l''employé", "type": "text", "required": true},
    {"key": "employeur_nom", "label": "Nom de l''employeur", "type": "text", "required": true},
    {"key": "description_infos", "label": "Description des informations/confidentialité (Annexe)", "type": "textarea"},
    {"key": "duree_annees", "label": "Durée (années après la fin)", "type": "number", "required": true},
    {"key": "ville_signature", "label": "Ville de signature", "type": "text", "required": true},
    {"key": "date_signature", "label": "Date de signature", "type": "date", "required": true}
  ]'::jsonb,
  true
);

-- Engagement de non-sollicitation de la clientèle
INSERT INTO document_templates (
  name,
  category,
  description,
  content,
  fields,
  is_active
) VALUES (
  'Engagement de non-sollicitation de la clientèle',
  'Juridique',
  'Engagement de non-sollicitation de la clientèle par l''employé.',
  'ENGAGEMENT DE NON-SOLLICITATION DE LA CLIENTÈLE

DE: {{employe_nom}} (ci-après appelé(e) « l''employé »)
ENVERS: {{employeur_nom}} (ci-après appelé(e) « l''employeur »)

L''employé reconnaît qu''il obtient, dans le cadre de son emploi, un accès privilégié à des informations et documents
relatifs aux activités de l''employeur et particulièrement à sa clientèle.

Engagement:
En contrepartie notamment de son embauche et du maintien de son emploi, l''employé s''engage à ne pas solliciter,
directement ou indirectement, les clients de l''employeur autrement que dans l''exécution de ses fonctions pour et
au bénéfice de l''employeur, que l''initiative provienne de l''employé ou du client.

Un « client de l''employeur » s''entend de tout acheteur ou locataire des biens ou services offerts par l''employeur.

Territoire: Cet engagement vaut pour le territoire suivant : {{territoire}}.

Durée: Cet engagement demeure en vigueur pendant toute la durée de l''emploi et pour une période de
{{duree_annees}} an(s) à compter de la fin de celui-ci.

En cas de défaut, l''employé devra indemniser l''employeur pour tous les dommages subis, sans préjudice aux autres
droits et recours, y compris la possibilité d''obtenir une injonction.

Caractère raisonnable:
L''employé reconnaît que le présent engagement est raisonnable quant à son objet, son étendue et sa durée, et
qu''il ne l''empêche pas de gagner raisonnablement sa vie.

SIGNÉ EN {{ville_signature}}, le {{date_signature}}.

L''EMPLOYÉ

______________________________        ______________________________
Témoin                                {{employe_nom}}

L''EMPLOYEUR

______________________________        ______________________________
Témoin                                {{employeur_nom}}',
  '[
    {"key": "employe_nom", "label": "Nom de l''employé", "type": "text", "required": true},
    {"key": "employeur_nom", "label": "Nom de l''employeur", "type": "text", "required": true},
    {"key": "territoire", "label": "Territoire visé", "type": "text", "required": true},
    {"key": "duree_annees", "label": "Durée (années après la fin)", "type": "number", "required": true},
    {"key": "ville_signature", "label": "Ville de signature", "type": "text", "required": true},
    {"key": "date_signature", "label": "Date de signature", "type": "date", "required": true}
  ]'::jsonb,
  true
);

-- Contrat de travail TET Québec
INSERT INTO document_templates (
  name,
  category,
  description,
  content,
  fields,
  is_active
) VALUES (
  'Contrat de travail type – TET Québec',
  'Immigration',
  'Modèle type de contrat de travail pour travailleurs étrangers temporaires.',
  'CONTRAT DE TRAVAIL TYPE – TRAVAILLEUR ÉTRANGER TEMPORAIRE

Employeur :
{{entreprise_nom}} (NEQ : {{entreprise_neq}})
Adresse : {{entreprise_adresse}}

Employé :
{{employe_prenom}} {{employe_nom}}
Date de naissance : {{employe_date_naissance}}

Lieu de travail :
{{lieu_travail_adresse}}

Titre du poste : {{poste_titre}}
Description des tâches :
{{description_poste}}

Durée du contrat : {{duree_mois}} mois
Date d''entrée en fonction : {{date_entree}}

Conditions de travail :
Taux horaire : {{taux_horaire}} $/h
Horaire : {{heures_semaine}} heures par semaine

[Les clauses officielles du contrat TET doivent être complétées : durée, probation, congés, assurances, rupture, etc.]

Fait à {{ville_signature}}, le {{date_signature}}.

L''EMPLOYEUR
{{entreprise_nom}}
Signature : ________________________

L''EMPLOYÉ(E)
{{employe_prenom}} {{employe_nom}}
Signature : ________________________',
  '[
    {"key": "entreprise_nom", "label": "Nom légal de l''entreprise", "type": "text", "required": true},
    {"key": "entreprise_neq", "label": "NEQ", "type": "text"},
    {"key": "entreprise_adresse", "label": "Adresse de l''entreprise", "type": "textarea", "required": true},
    {"key": "lieu_travail_adresse", "label": "Lieu de travail au Québec", "type": "textarea", "required": true},
    {"key": "employe_nom", "label": "Nom de famille de l''employé", "type": "text", "required": true},
    {"key": "employe_prenom", "label": "Prénom de l''employé", "type": "text", "required": true},
    {"key": "employe_date_naissance", "label": "Date de naissance", "type": "date"},
    {"key": "duree_mois", "label": "Durée du contrat (mois)", "type": "number", "required": true},
    {"key": "date_entree", "label": "Date d''entrée en fonction", "type": "date", "required": true},
    {"key": "poste_titre", "label": "Titre du poste", "type": "text", "required": true},
    {"key": "description_poste", "label": "Description des tâches", "type": "textarea", "required": true},
    {"key": "taux_horaire", "label": "Taux horaire ($)", "type": "number", "required": true},
    {"key": "heures_semaine", "label": "Heures par semaine", "type": "number", "required": true},
    {"key": "ville_signature", "label": "Ville de signature", "type": "text", "required": true},
    {"key": "date_signature", "label": "Date de signature", "type": "date", "required": true}
  ]'::jsonb,
  true
);

-- Contrat de services 1476
INSERT INTO document_templates (
  name,
  category,
  description,
  content,
  fields,
  is_active
) VALUES (
  'Contract for Services – 1476',
  'Juridique',
  'Contrat de services type Jurifax 1476.',
  'CONTRACT FOR SERVICES

BETWEEN:
{{client_nom}}
{{client_adresse}}
(hereinafter the "Client")

AND:
{{prestataire_nom}}
{{prestataire_adresse}}
(hereinafter the "Contractor")

WHEREAS the Client wishes to retain the Contractor to provide certain services and the Contractor agrees to provide
such services on the terms and conditions set forth herein;

1. Services

The Contractor agrees to provide the following services to the Client:
{{services_description}}

2. Term

This Contract shall commence on {{date_debut}} and shall continue until {{date_fin}}, unless terminated earlier in
accordance with the provisions hereof.

3. Fees and payment

In consideration of the services rendered, the Client shall pay to the Contractor the following compensation:
{{taux_horaire}} ({{devise}}).

[Les clauses détaillées du modèle 1476 doivent être complétées : facturation, dépenses, indépendance des parties,
confidentialité, propriété intellectuelle, résiliation, limitation de responsabilité, loi applicable, etc.]

4. Miscellaneous

[Clauses de droit applicable, avis, cession, divisibilité, modifications, etc.]

IN WITNESS WHEREOF, the parties have signed this Contract for Services.

Signed in {{ville_signature}}, on {{date_signature}}.

THE CLIENT

____________________________________
{{client_nom}}

THE CONTRACTOR

____________________________________
{{prestataire_nom}}',
  '[
    {"key": "client_nom", "label": "Nom du client", "type": "text", "required": true},
    {"key": "client_adresse", "label": "Adresse du client", "type": "textarea", "required": true},
    {"key": "prestataire_nom", "label": "Nom du prestataire de services", "type": "text", "required": true},
    {"key": "prestataire_adresse", "label": "Adresse du prestataire", "type": "textarea", "required": true},
    {"key": "services_description", "label": "Description des services", "type": "textarea", "required": true},
    {"key": "date_debut", "label": "Date de début du contrat", "type": "date", "required": true},
    {"key": "date_fin", "label": "Date de fin (ou indéterminée)", "type": "text", "required": true},
    {"key": "taux_horaire", "label": "Taux horaire / honoraires", "type": "text", "required": true},
    {"key": "devise", "label": "Devise (CAD, USD, etc.)", "type": "text", "required": true},
    {"key": "ville_signature", "label": "Ville de signature", "type": "text", "required": true},
    {"key": "date_signature", "label": "Date de signature", "type": "date", "required": true}
  ]'::jsonb,
  true
);
