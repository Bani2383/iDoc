/*
  # Insert CAQ Templates

  ## Templates
    1. CAQ Simple Response
    2. CAQ Intention de Refus Response

  ## Notes
    - Based on Quebec immigration requirements
    - Handles specific CAQ scenarios
    - Conditional sections based on student situation
*/

-- 1. CAQ Simple
INSERT INTO public.guided_template_configs (name, description, category, is_active, config)
VALUES (
  'CAQ - Réponse Simple',
  'Lettre de réponse pour demande de CAQ - situation standard',
  'immigration',
  true,
  '{
    "id": "caq-simple",
    "name": "CAQ - Réponse Simple",
    "description": "Réponse professionnelle pour votre demande de CAQ",
    "category": "immigration",
    "steps": [
      {
        "id": "step-1-etudiant",
        "title": "Informations de l''étudiant",
        "fields": [
          {
            "id": "field-nom-etudiant",
            "key": "nom_etudiant",
            "label": "Nom complet de l''étudiant",
            "type": "text",
            "required": true
          },
          {
            "id": "field-date-naissance",
            "key": "date_naissance",
            "label": "Date de naissance",
            "type": "date",
            "required": true
          },
          {
            "id": "field-numero-demande",
            "key": "numero_demande",
            "label": "Numéro de demande CAQ",
            "type": "text",
            "required": true,
            "placeholder": "Ex: CAQ123456"
          },
          {
            "id": "field-etablissement",
            "key": "etablissement",
            "label": "Établissement d''enseignement",
            "type": "text",
            "required": true,
            "placeholder": "Nom de votre université ou collège"
          },
          {
            "id": "field-programme",
            "key": "programme_etudes",
            "label": "Programme d''études",
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
            "id": "field-periode-sans-etudes",
            "key": "periode_sans_etudes",
            "label": "Avez-vous eu une période sans études ?",
            "type": "radio",
            "required": true,
            "options": [
              { "value": "true", "label": "Oui" },
              { "value": "false", "label": "Non" }
            ]
          },
          {
            "id": "field-explication-periode",
            "key": "explication_periode",
            "label": "Expliquez la période sans études",
            "type": "textarea",
            "required": false,
            "visible_if": [
              { "field": "periode_sans_etudes", "operator": "equals", "value": "true" }
            ],
            "placeholder": "Raisons de la période sans études (travail, raisons personnelles, etc.)"
          },
          {
            "id": "field-solde",
            "key": "solde_scolaire",
            "label": "Solde restant dû à l''établissement (en CAD)",
            "type": "text",
            "required": true,
            "placeholder": "0 si aucun solde"
          },
          {
            "id": "field-assurance",
            "key": "assurance_valide",
            "label": "Avez-vous une assurance maladie valide ?",
            "type": "radio",
            "required": true,
            "options": [
              { "value": "true", "label": "Oui" },
              { "value": "false", "label": "Non - Je vais en obtenir une" }
            ]
          }
        ]
      },
      {
        "id": "step-3-documents",
        "title": "Documents fournis",
        "fields": [
          {
            "id": "field-liste-documents",
            "key": "liste_documents",
            "label": "Liste des documents que vous joignez",
            "type": "textarea",
            "required": true,
            "placeholder": "Listez tous les documents joints (lettre d''admission, relevés bancaires, etc.)"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "variant-default",
        "name": "Réponse CAQ standard",
        "description": "Lettre de réponse pour CAQ",
        "conditions": [],
        "template_content": "",
        "sections": [
          {
            "id": "section-intro",
            "title": "Introduction",
            "content": "Madame, Monsieur,\\n\\nJe soussigné(e), {{nom_etudiant}}, né(e) le {{date_naissance}}, fais suite à ma demande de Certificat d''acceptation du Québec (CAQ) portant le numéro {{numero_demande}}.\\n\\nJe suis admis(e) à {{etablissement}} pour le programme {{programme_etudes}}.",
            "required": true
          },
          {
            "id": "section-article-14",
            "title": "Réponse - Article 14 (période sans études)",
            "content": "Concernant la période sans études mentionnée dans votre demande, je tiens à apporter les précisions suivantes :\\n\\n{{explication_periode}}\\n\\nCette période était justifiée et n''affecte en rien ma détermination à poursuivre mes études au Québec avec sérieux et assiduité.",
            "include_if": [
              { "field": "periode_sans_etudes", "operator": "equals", "value": "true" }
            ]
          },
          {
            "id": "section-finances-detaillee",
            "title": "Situation financière - Solde à payer",
            "content": "Concernant ma situation financière, je confirme qu''un solde de {{solde_scolaire}} CAD reste dû à l''établissement. Je joins à cette lettre les preuves de mes capacités financières suffisantes pour couvrir ce montant ainsi que l''ensemble de mes frais de subsistance au Québec.\\n\\nJe m''engage à régler ce solde avant le début de mes études.",
            "include_if": [
              { "field": "solde_scolaire", "operator": "gt", "value": 0 }
            ]
          },
          {
            "id": "section-finances-abregee",
            "title": "Situation financière - Aucun solde",
            "content": "Ma situation financière est saine. Aucun solde n''est dû à l''établissement et je dispose des ressources nécessaires pour couvrir mes frais de scolarité et de subsistance au Québec. Les documents bancaires joints en attestent.",
            "include_if": [
              { "field": "solde_scolaire", "operator": "equals", "value": "0" }
            ]
          },
          {
            "id": "section-article-15",
            "title": "Assurance maladie",
            "content": "Concernant l''assurance maladie obligatoire, je m''engage à souscrire une assurance maladie valide avant mon arrivée au Québec et à maintenir cette couverture durant toute la durée de mes études, conformément aux exigences réglementaires.",
            "include_if": [
              { "field": "assurance_valide", "operator": "equals", "value": "false" }
            ]
          },
          {
            "id": "section-documents",
            "title": "Documents joints",
            "content": "Je joins à la présente les documents suivants :\\n\\n{{liste_documents}}",
            "required": true
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "Je reste à votre entière disposition pour tout renseignement complémentaire ou document additionnel.\\n\\nJe vous prie d''agréer, Madame, Monsieur, l''expression de mes salutations distinguées.\\n\\n{{nom_etudiant}}\\nDate: {{current_date}}",
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

-- 2. CAQ Intention de Refus
INSERT INTO public.guided_template_configs (name, description, category, is_active, config)
VALUES (
  'CAQ - Réponse à Intention de Refus',
  'Réponse professionnelle à un avis d''intention de refus de CAQ',
  'immigration',
  true,
  '{
    "id": "caq-intention-refus",
    "name": "CAQ - Réponse à Intention de Refus",
    "description": "Répondez efficacement à un avis d''intention de refus de votre CAQ",
    "category": "immigration",
    "steps": [
      {
        "id": "step-1-etudiant",
        "title": "Vos informations",
        "fields": [
          {
            "id": "field-nom",
            "key": "nom_etudiant",
            "label": "Nom complet",
            "type": "text",
            "required": true
          },
          {
            "id": "field-date-naissance",
            "key": "date_naissance",
            "label": "Date de naissance",
            "type": "date",
            "required": true
          },
          {
            "id": "field-numero",
            "key": "numero_demande",
            "label": "Numéro de demande CAQ",
            "type": "text",
            "required": true
          },
          {
            "id": "field-etablissement",
            "key": "etablissement",
            "label": "Établissement",
            "type": "text",
            "required": true
          }
        ]
      },
      {
        "id": "step-2-intention-refus",
        "title": "Détails de l''intention de refus",
        "fields": [
          {
            "id": "field-date-intention",
            "key": "date_intention_refus",
            "label": "Date de l''avis d''intention de refus",
            "type": "date",
            "required": true
          },
          {
            "id": "field-motifs",
            "key": "motifs_refus",
            "label": "Motifs invoqués",
            "type": "textarea",
            "required": true,
            "placeholder": "Copiez les motifs exacts mentionnés dans l''avis d''intention de refus"
          }
        ]
      },
      {
        "id": "step-3-reponse",
        "title": "Votre réponse",
        "fields": [
          {
            "id": "field-arguments",
            "key": "arguments_reponse",
            "label": "Vos arguments et clarifications",
            "type": "textarea",
            "required": true,
            "placeholder": "Expliquez point par point pourquoi les motifs de refus ne sont pas fondés, avec preuves à l''appui"
          },
          {
            "id": "field-nouveaux-documents",
            "key": "nouveaux_documents",
            "label": "Nouveaux documents fournis",
            "type": "textarea",
            "required": true,
            "placeholder": "Liste des documents additionnels que vous joignez pour appuyer votre réponse"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "variant-default",
        "name": "Réponse intention de refus",
        "description": "Réponse structurée à l''intention de refus",
        "conditions": [],
        "template_content": "",
        "sections": [
          {
            "id": "section-intro",
            "title": "Introduction",
            "content": "Madame, Monsieur,\\n\\nJe soussigné(e), {{nom_etudiant}}, né(e) le {{date_naissance}}, fais suite à l''avis d''intention de refus de ma demande de CAQ (numéro {{numero_demande}}) reçu le {{date_intention_refus}}.\\n\\nJe souhaite respectueusement contester cette décision et apporter les clarifications nécessaires.",
            "required": true
          },
          {
            "id": "section-motifs",
            "title": "Motifs invoqués",
            "content": "Les motifs invoqués dans l''avis d''intention de refus sont les suivants :\\n\\n{{motifs_refus}}",
            "required": true
          },
          {
            "id": "section-reponse",
            "title": "Mes arguments",
            "content": "En réponse à ces motifs, je tiens à apporter les précisions suivantes :\\n\\n{{arguments_reponse}}\\n\\nJe joins à cette lettre des documents supplémentaires qui démontrent clairement que les préoccupations soulevées ne sont pas fondées.",
            "required": true
          },
          {
            "id": "section-documents",
            "title": "Documents additionnels",
            "content": "Documents joints à l''appui de ma réponse :\\n\\n{{nouveaux_documents}}\\n\\nCes documents attestent de la solidité de ma demande et de ma pleine conformité aux exigences du programme.",
            "required": true
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "Au vu des éléments ci-dessus, je sollicite respectueusement la reconsidération de ma demande de CAQ. Je suis convaincu(e) que ces clarifications dissiperont toute préoccupation.\\n\\nJe me tiens à votre disposition pour tout complément d''information.\\n\\nVeuillez agréer, Madame, Monsieur, l''expression de mes salutations respectueuses.\\n\\n{{nom_etudiant}}\\nDate: {{current_date}}",
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
