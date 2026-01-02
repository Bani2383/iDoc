/*
  # Insert IRCC Templates

  ## Templates
    1. IRCC CEC - Express Entry CEC dispense de fonds
    2. IRCC Fairness - Fairness letter
    3. IRCC Generic - Generic IRCC letter

  ## Notes
    - Canadian immigration specific templates
    - Express Entry and other IRCC programs
    - Conditional content based on application type
*/

-- 1. IRCC CEC
INSERT INTO public.guided_template_configs (name, description, category, is_active, config)
VALUES (
  'IRCC - Lettre CEC Dispense Fonds',
  'Lettre pour Entrée Express (CEC) - Demande de dispense de fonds',
  'immigration',
  true,
  '{
    "id": "ircc-cec",
    "name": "IRCC - CEC Dispense Fonds",
    "description": "Lettre pour candidats CEC demandant la dispense de preuve de fonds",
    "category": "immigration",
    "steps": [
      {
        "id": "step-1-candidat",
        "title": "Informations du candidat",
        "fields": [
          {
            "id": "field-nom",
            "key": "nom_demandeur",
            "label": "Nom complet",
            "type": "text",
            "required": true
          },
          {
            "id": "field-numero-demande",
            "key": "numero_demande",
            "label": "Numéro de demande Entrée Express",
            "type": "text",
            "required": true,
            "placeholder": "Ex: E000123456"
          },
          {
            "id": "field-date-ita",
            "key": "date_ita",
            "label": "Date de l''ITA (Invitation à Présenter une Demande)",
            "type": "date",
            "required": true
          }
        ]
      },
      {
        "id": "step-2-situation",
        "title": "Situation actuelle au Canada",
        "fields": [
          {
            "id": "field-employeur",
            "key": "employeur_actuel",
            "label": "Employeur actuel au Canada",
            "type": "text",
            "required": true
          },
          {
            "id": "field-poste",
            "key": "poste_actuel",
            "label": "Poste occupé",
            "type": "text",
            "required": true
          },
          {
            "id": "field-duree-emploi",
            "key": "duree_emploi",
            "label": "Durée d''emploi au Canada",
            "type": "text",
            "required": true,
            "placeholder": "Ex: 2 ans et 3 mois"
          },
          {
            "id": "field-revenu",
            "key": "revenu_annuel",
            "label": "Revenu annuel (CAD)",
            "type": "text",
            "required": true
          }
        ]
      },
      {
        "id": "step-3-justification",
        "title": "Justification de la dispense",
        "fields": [
          {
            "id": "field-arguments",
            "key": "arguments_dispense",
            "label": "Vos arguments pour la dispense de fonds",
            "type": "textarea",
            "required": true,
            "placeholder": "Expliquez pourquoi vous demandez la dispense (emploi stable, résidence établie, etc.)"
          },
          {
            "id": "field-documents",
            "key": "documents_fournis",
            "label": "Documents joints",
            "type": "textarea",
            "required": true,
            "placeholder": "Listez les documents (lettre d''emploi, relevés de paie, bail, etc.)"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "variant-default",
        "name": "Lettre CEC standard",
        "description": "Demande de dispense de preuve de fonds pour CEC",
        "conditions": [],
        "template_content": "",
        "sections": [
          {
            "id": "section-intro",
            "title": "Introduction",
            "content": "À l''attention d''Immigration, Réfugiés et Citoyenneté Canada,\\n\\nJe soussigné(e), {{nom_demandeur}}, détenteur de la demande d''Entrée Express numéro {{numero_demande}}, ai reçu une Invitation à Présenter une Demande (ITA) le {{date_ita}} dans le cadre de la Catégorie de l''expérience canadienne (CEC).\\n\\nPar la présente, je sollicite respectueusement la dispense de preuve de fonds de subsistance, conformément aux dispositions applicables aux candidats CEC.",
            "required": true
          },
          {
            "id": "section-situation",
            "title": "Situation actuelle",
            "content": "Situation professionnelle actuelle :\\n\\n- Employeur: {{employeur_actuel}}\\n- Poste: {{poste_actuel}}\\n- Durée d''emploi au Canada: {{duree_emploi}}\\n- Revenu annuel: {{revenu_annuel}} CAD\\n\\nJe travaille de manière continue au Canada et dispose d''un emploi stable et bien rémunéré.",
            "required": true
          },
          {
            "id": "section-justification",
            "title": "Justification",
            "content": "Justification de ma demande de dispense :\\n\\n{{arguments_dispense}}\\n\\nÉtant déjà établi(e) au Canada avec un emploi stable, je ne nécessite pas de fonds de subsistance additionnels pour m''établir, puisque je suis déjà établi(e) et autonome financièrement.",
            "required": true
          },
          {
            "id": "section-documents",
            "title": "Documents joints",
            "content": "Documents fournis à l''appui :\\n\\n{{documents_fournis}}",
            "required": true
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "Je vous remercie de l''attention portée à ma demande et reste disponible pour tout renseignement complémentaire.\\n\\nVeuillez agréer l''expression de mes salutations respectueuses.\\n\\n{{nom_demandeur}}\\nDate: {{current_date}}",
            "required": true
          }
        ]
      }
    ],
    "default_variant": "variant-default",
    "pricing": {
      "free_tier": ["pdf_download"],
      "premium_tier": ["pdf_download", "docx_download", "document_edit"]
    }
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- 2. IRCC Fairness
INSERT INTO public.guided_template_configs (name, description, category, is_active, config)
VALUES (
  'IRCC - Lettre de Fairness',
  'Lettre de fairness pour IRCC - Demande d''équité procédurale',
  'immigration',
  true,
  '{
    "id": "ircc-fairness",
    "name": "IRCC - Fairness Letter",
    "description": "Demande d''équité procédurale auprès d''IRCC",
    "category": "immigration",
    "steps": [
      {
        "id": "step-1-info",
        "title": "Informations de base",
        "fields": [
          {
            "id": "field-nom",
            "key": "nom_demandeur",
            "label": "Nom complet",
            "type": "text",
            "required": true
          },
          {
            "id": "field-numero",
            "key": "numero_demande",
            "label": "Numéro de demande IRCC",
            "type": "text",
            "required": true
          }
        ]
      },
      {
        "id": "step-2-situation",
        "title": "Votre situation",
        "fields": [
          {
            "id": "field-probleme",
            "key": "probleme_equite",
            "label": "Problème d''équité procédurale rencontré",
            "type": "textarea",
            "required": true,
            "placeholder": "Décrivez la situation où vos droits procéduraux n''ont pas été respectés"
          },
          {
            "id": "field-impact",
            "key": "impact_decision",
            "label": "Impact sur votre demande",
            "type": "textarea",
            "required": true,
            "placeholder": "Expliquez comment cette situation a affecté négativement votre demande"
          },
          {
            "id": "field-demande",
            "key": "demande_reconsideration",
            "label": "Ce que vous demandez",
            "type": "textarea",
            "required": true,
            "placeholder": "Quelle action demandez-vous ? (reconsidération, nouvelle évaluation, etc.)"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "variant-default",
        "name": "Fairness letter standard",
        "description": "Demande d''équité procédurale",
        "conditions": [],
        "template_content": "",
        "sections": [
          {
            "id": "section-intro",
            "title": "Introduction",
            "content": "À l''attention d''Immigration, Réfugiés et Citoyenneté Canada,\\n\\nJe soussigné(e), {{nom_demandeur}}, concernant la demande numéro {{numero_demande}}, souhaite invoquer mon droit à l''équité procédurale conformément aux principes de justice naturelle et de droit administratif canadien.",
            "required": true
          },
          {
            "id": "section-probleme",
            "title": "Problème d''équité",
            "content": "Je tiens à porter à votre attention le problème suivant d''équité procédurale :\\n\\n{{probleme_equite}}\\n\\nCette situation constitue un manquement aux principes d''équité procédurale auxquels j''ai droit en tant que demandeur.",
            "required": true
          },
          {
            "id": "section-impact",
            "title": "Impact",
            "content": "Ce manquement a eu les conséquences suivantes sur ma demande :\\n\\n{{impact_decision}}\\n\\nSi l''équité procédurale avait été respectée, le résultat de ma demande aurait pu être différent.",
            "required": true
          },
          {
            "id": "section-demande",
            "title": "Demande",
            "content": "En conséquence, je demande respectueusement :\\n\\n{{demande_reconsideration}}\\n\\nJe crois fermement qu''une réévaluation équitable de ma demande aboutira à une décision favorable.",
            "required": true
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "Je vous remercie de votre attention à cette question importante et reste disponible pour toute clarification.\\n\\nVeuillez agréer l''expression de mes salutations respectueuses.\\n\\n{{nom_demandeur}}\\nDate: {{current_date}}",
            "required": true
          }
        ]
      }
    ],
    "default_variant": "variant-default",
    "pricing": {
      "free_tier": ["pdf_download"],
      "premium_tier": ["pdf_download", "docx_download", "document_edit"]
    }
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- 3. IRCC Generic
INSERT INTO public.guided_template_configs (name, description, category, is_active, config)
VALUES (
  'IRCC - Lettre Générique',
  'Lettre générique pour IRCC - Tout type de correspondance',
  'immigration',
  true,
  '{
    "id": "ircc-generique",
    "name": "IRCC - Lettre Générique",
    "description": "Template flexible pour toute correspondance avec IRCC",
    "category": "immigration",
    "steps": [
      {
        "id": "step-1-reference",
        "title": "Références",
        "fields": [
          {
            "id": "field-nom",
            "key": "nom_demandeur",
            "label": "Votre nom complet",
            "type": "text",
            "required": true
          },
          {
            "id": "field-numero",
            "key": "numero_demande",
            "label": "Numéro de demande",
            "type": "text",
            "required": true
          },
          {
            "id": "field-type",
            "key": "type_demande",
            "label": "Type de demande",
            "type": "select",
            "required": true,
            "options": [
              { "value": "express_entry", "label": "Entrée Express" },
              { "value": "famille", "label": "Parrainage familial" },
              { "value": "etudes", "label": "Permis d''études" },
              { "value": "travail", "label": "Permis de travail" },
              { "value": "visiteur", "label": "Visa visiteur" },
              { "value": "autre", "label": "Autre" }
            ]
          }
        ]
      },
      {
        "id": "step-2-objet",
        "title": "Objet de votre lettre",
        "fields": [
          {
            "id": "field-objet",
            "key": "objet_lettre",
            "label": "Objet",
            "type": "text",
            "required": true,
            "placeholder": "Ex: Documents additionnels, Clarification, etc."
          },
          {
            "id": "field-contexte",
            "key": "contexte",
            "label": "Contexte",
            "type": "textarea",
            "required": true,
            "placeholder": "Expliquez brièvement le contexte de votre correspondance"
          }
        ]
      },
      {
        "id": "step-3-contenu",
        "title": "Contenu de votre lettre",
        "fields": [
          {
            "id": "field-message",
            "key": "message_principal",
            "label": "Message principal",
            "type": "textarea",
            "required": true,
            "placeholder": "Le corps de votre message"
          },
          {
            "id": "field-documents",
            "key": "documents_joints",
            "label": "Documents joints (si applicable)",
            "type": "textarea",
            "required": false,
            "placeholder": "Liste des documents que vous joignez"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "variant-default",
        "name": "Lettre IRCC standard",
        "description": "Format professionnel pour IRCC",
        "conditions": [],
        "template_content": "",
        "sections": [
          {
            "id": "section-header",
            "title": "En-tête",
            "content": "À l''attention d''Immigration, Réfugiés et Citoyenneté Canada\\n\\nObjet: {{objet_lettre}}\\nRéférence: {{numero_demande}}\\nType de demande: {{type_demande}}\\nDate: {{current_date}}",
            "required": true
          },
          {
            "id": "section-intro",
            "title": "Introduction",
            "content": "Madame, Monsieur,\\n\\nJe soussigné(e), {{nom_demandeur}}, détenteur de la demande numéro {{numero_demande}}, vous écris concernant {{objet_lettre}}.\\n\\nContexte:\\n{{contexte}}",
            "required": true
          },
          {
            "id": "section-message",
            "title": "Message",
            "content": "{{message_principal}}",
            "required": true
          },
          {
            "id": "section-documents",
            "title": "Documents joints",
            "content": "Je joins à cette lettre les documents suivants :\\n\\n{{documents_joints}}",
            "include_if": [
              { "field": "documents_joints", "operator": "notEquals", "value": "" }
            ]
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "Je reste à votre disposition pour tout renseignement complémentaire.\\n\\nVeuillez agréer, Madame, Monsieur, l''expression de mes salutations distinguées.\\n\\n{{nom_demandeur}}",
            "required": true
          }
        ]
      }
    ],
    "default_variant": "variant-default",
    "pricing": {
      "free_tier": ["pdf_download"],
      "premium_tier": ["pdf_download", "docx_download", "document_edit"]
    }
  }'::jsonb
)
ON CONFLICT DO NOTHING;
