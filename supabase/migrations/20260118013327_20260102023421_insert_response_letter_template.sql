/*
  # Insert Response Letter Template

  ## Template
    - Réponse Lettre - Universal response to official letters

  ## Notes
    - Adaptable to any official correspondence
    - Structured response format
    - Document tracking
*/

INSERT INTO public.guided_template_configs (name, description, category, is_active, config)
VALUES (
  'Réponse à une Lettre Officielle',
  'Créez une réponse professionnelle à une correspondance officielle',
  'legal',
  true,
  '{
    "id": "reponse-lettre",
    "name": "Réponse à une Lettre Officielle",
    "description": "Template universel pour répondre à toute lettre officielle",
    "category": "legal",
    "steps": [
      {
        "id": "step-1-references",
        "title": "Références de la lettre",
        "fields": [
          {
            "id": "field-autorite",
            "key": "autorite_lettre",
            "label": "Autorité émettrice",
            "type": "text",
            "required": true,
            "placeholder": "Ex: Immigration Canada, Revenu Québec, etc."
          },
          {
            "id": "field-numero-reference",
            "key": "numero_reference",
            "label": "Numéro de référence / dossier",
            "type": "text",
            "required": true,
            "placeholder": "Numéro mentionné dans la lettre reçue"
          },
          {
            "id": "field-date-lettre",
            "key": "date_lettre_recue",
            "label": "Date de la lettre reçue",
            "type": "date",
            "required": true
          },
          {
            "id": "field-echeance",
            "key": "echeance_reponse",
            "label": "Date limite de réponse (si applicable)",
            "type": "date",
            "required": false
          }
        ]
      },
      {
        "id": "step-2-points-adresser",
        "title": "Points à adresser",
        "fields": [
          {
            "id": "field-objet",
            "key": "objet_lettre",
            "label": "Objet de la lettre reçue",
            "type": "text",
            "required": true,
            "placeholder": "Ex: Demande de documents supplémentaires, Clarification requise"
          },
          {
            "id": "field-liste-points",
            "key": "liste_points",
            "label": "Liste des points/questions soulevés",
            "type": "textarea",
            "required": true,
            "placeholder": "Listez chaque point ou question mentionné dans la lettre (un par ligne)"
          }
        ]
      },
      {
        "id": "step-3-reponse",
        "title": "Votre réponse",
        "fields": [
          {
            "id": "field-reponse-detaillee",
            "key": "reponse_detaillee",
            "label": "Réponse détaillée aux points soulevés",
            "type": "textarea",
            "required": true,
            "placeholder": "Répondez à chaque point de manière claire et structurée"
          },
          {
            "id": "field-pieces-jointes",
            "key": "liste_pieces",
            "label": "Documents joints",
            "type": "textarea",
            "required": true,
            "placeholder": "Listez tous les documents que vous joignez à votre réponse"
          },
          {
            "id": "field-clarification",
            "key": "clarification",
            "label": "Clarifications supplémentaires (optionnel)",
            "type": "textarea",
            "required": false,
            "placeholder": "Toute information additionnelle pertinente"
          }
        ]
      },
      {
        "id": "step-4-coordonnees",
        "title": "Vos coordonnées",
        "fields": [
          {
            "id": "field-nom",
            "key": "nom_expediteur",
            "label": "Votre nom complet",
            "type": "text",
            "required": true
          },
          {
            "id": "field-adresse",
            "key": "adresse_expediteur",
            "label": "Votre adresse",
            "type": "textarea",
            "required": true
          },
          {
            "id": "field-email",
            "key": "email_expediteur",
            "label": "Email",
            "type": "email",
            "required": true
          },
          {
            "id": "field-tel",
            "key": "telephone_expediteur",
            "label": "Téléphone",
            "type": "text",
            "required": true
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "variant-default",
        "name": "Réponse standard",
        "description": "Format de réponse professionnelle",
        "conditions": [],
        "template_content": "",
        "sections": [
          {
            "id": "section-header",
            "title": "En-tête",
            "content": "{{nom_expediteur}}\\n{{adresse_expediteur}}\\nEmail: {{email_expediteur}}\\nTél: {{telephone_expediteur}}\\n\\nDate: {{current_date}}\\n\\nÀ l''attention de:\\n{{autorite_lettre}}\\n\\nObjet: Réponse à votre lettre du {{date_lettre_recue}}\\nRéférence: {{numero_reference}}",
            "required": true
          },
          {
            "id": "section-intro",
            "title": "Introduction",
            "content": "Madame, Monsieur,\\n\\nJe fais suite à votre lettre datée du {{date_lettre_recue}} concernant {{objet_lettre}}, portant la référence {{numero_reference}}.\\n\\nJe tiens à répondre aux points soulevés dans votre correspondance.",
            "required": true
          },
          {
            "id": "section-points-souleves",
            "title": "Points soulevés",
            "content": "Votre lettre mentionnait les points suivants :\\n\\n{{liste_points}}",
            "required": true
          },
          {
            "id": "section-reponse",
            "title": "Réponse détaillée",
            "content": "En réponse à ces points, je tiens à préciser ce qui suit :\\n\\n{{reponse_detaillee}}",
            "required": true
          },
          {
            "id": "section-clarification",
            "title": "Clarifications additionnelles",
            "content": "Je souhaite également apporter les clarifications suivantes :\\n\\n{{clarification}}",
            "include_if": [
              { "field": "clarification", "operator": "notEquals", "value": "" }
            ]
          },
          {
            "id": "section-documents",
            "title": "Pièces jointes",
            "content": "Je joints à la présente les documents suivants :\\n\\n{{liste_pieces}}\\n\\nCes documents apportent les preuves nécessaires pour appuyer ma réponse.",
            "required": true
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "Je reste à votre entière disposition pour toute information complémentaire ou tout document additionnel que vous jugeriez nécessaire.\\n\\nJe vous prie d''agréer, Madame, Monsieur, l''expression de mes salutations distinguées.\\n\\n{{nom_expediteur}}",
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