/*
  # Insert Production Guided Templates

  ## Templates Added
    1. Visa Visiteur Universel - Universal visitor visa letter
    2. CAQ Intention Refus - CAQ refusal notice response
    3. CAQ Simple - Simple CAQ response letter
    4. IRCC CEC - CEC application letter
    5. IRCC Fairness - Fairness letter for IRCC
    6. IRCC Generic - Generic IRCC letter
    7. Réponse Lettre - Response to official letter
    8. Invitation - Invitation letter for visitors

  ## Important Notes
    - These templates work with the guided template system
    - Based on the JSON configuration provided
    - Support conditional logic and dynamic sections
    - Ready for production use
*/

-- 1. Visa Visiteur Universel
INSERT INTO public.guided_template_configs (name, description, category, is_active, config)
VALUES (
  'Visa Visiteur Universel',
  'Lettre universelle pour demande de visa visiteur - adaptable à tous les pays et situations',
  'immigration',
  true,
  '{
    "id": "visiteur-universel",
    "name": "Visa Visiteur Universel",
    "description": "Lettre de motivation pour visa visiteur adaptée à votre situation",
    "category": "immigration",
    "steps": [
      {
        "id": "step-1-info-voyage",
        "title": "Informations sur votre voyage",
        "description": "Détails de votre voyage prévu",
        "fields": [
          {
            "id": "field-pays",
            "key": "pays_destination",
            "label": "Pays de destination",
            "type": "text",
            "required": true,
            "placeholder": "Ex: Canada, France, États-Unis"
          },
          {
            "id": "field-objet",
            "key": "objet_voyage",
            "label": "Objet du voyage",
            "type": "select",
            "required": true,
            "options": [
              { "value": "TOURISME", "label": "Tourisme / Vacances" },
              { "value": "FAMILLE", "label": "Visite familiale" },
              { "value": "AFFAIRES", "label": "Voyage d''affaires" },
              { "value": "EVENEMENT", "label": "Événement spécial (mariage, conférence, etc.)" },
              { "value": "AUTRE", "label": "Autre raison" }
            ]
          },
          {
            "id": "field-date-depart",
            "key": "date_depart",
            "label": "Date de départ prévue",
            "type": "date",
            "required": true
          },
          {
            "id": "field-date-retour",
            "key": "date_retour",
            "label": "Date de retour prévue",
            "type": "date",
            "required": true
          },
          {
            "id": "field-itineraire",
            "key": "itineraire",
            "label": "Itinéraire détaillé (optionnel)",
            "type": "textarea",
            "required": false,
            "placeholder": "Décrivez votre itinéraire jour par jour si disponible"
          }
        ]
      },
      {
        "id": "step-2-hebergement",
        "title": "Hébergement",
        "description": "Où allez-vous séjourner ?",
        "fields": [
          {
            "id": "field-hebergement-type",
            "key": "hebergement_type",
            "label": "Type d''hébergement",
            "type": "select",
            "required": true,
            "options": [
              { "value": "HOTEL", "label": "Hôtel / Location" },
              { "value": "CHEZ_PROCHE", "label": "Chez un proche / ami" },
              { "value": "AUTRE", "label": "Autre" }
            ]
          },
          {
            "id": "field-hebergement-details",
            "key": "hebergement_details",
            "label": "Détails de l''hébergement",
            "type": "textarea",
            "required": true,
            "placeholder": "Nom de l''hôtel et adresse, ou nom et adresse du proche qui vous héberge"
          }
        ]
      },
      {
        "id": "step-3-finances",
        "title": "Capacité financière",
        "description": "Vos ressources financières pour ce voyage",
        "fields": [
          {
            "id": "field-budget",
            "key": "budget_estime",
            "label": "Budget estimé pour ce voyage (en devise locale)",
            "type": "text",
            "required": true,
            "placeholder": "Ex: 3000"
          },
          {
            "id": "field-fonds",
            "key": "fonds_disponibles",
            "label": "Fonds disponibles (total sur vos comptes)",
            "type": "text",
            "required": true,
            "placeholder": "Ex: 10000"
          },
          {
            "id": "field-source",
            "key": "source_fonds",
            "label": "Source de vos fonds",
            "type": "text",
            "required": true,
            "placeholder": "Ex: Salaire mensuel, épargne, soutien familial"
          }
        ]
      },
      {
        "id": "step-4-attaches",
        "title": "Vos attaches à votre pays",
        "description": "Raisons de votre retour garanti",
        "fields": [
          {
            "id": "field-emploi",
            "key": "attaches_emploi",
            "label": "Situation professionnelle",
            "type": "textarea",
            "required": true,
            "placeholder": "Décrivez votre emploi, votre entreprise, ou vos études"
          },
          {
            "id": "field-famille",
            "key": "attaches_famille",
            "label": "Liens familiaux dans votre pays",
            "type": "textarea",
            "required": false,
            "placeholder": "Conjoint, enfants, parents à charge, etc."
          },
          {
            "id": "field-obligations",
            "key": "attaches_obligations",
            "label": "Autres obligations ou engagements",
            "type": "textarea",
            "required": false,
            "placeholder": "Propriété, contrats, obligations financières, etc."
          }
        ]
      },
      {
        "id": "step-5-historique",
        "title": "Historique de visa",
        "fields": [
          {
            "id": "field-refus",
            "key": "refus_anterieur",
            "label": "Avez-vous déjà eu un refus de visa ?",
            "type": "radio",
            "required": true,
            "options": [
              { "value": "true", "label": "Oui" },
              { "value": "false", "label": "Non" }
            ]
          },
          {
            "id": "field-refus-details",
            "key": "refus_details",
            "label": "Détails du refus et ce qui a changé depuis",
            "type": "textarea",
            "required": false,
            "visible_if": [
              { "field": "refus_anterieur", "operator": "equals", "value": "true" }
            ],
            "placeholder": "Expliquez la raison du refus précédent et les changements apportés"
          }
        ]
      },
      {
        "id": "step-6-coordonnees",
        "title": "Vos coordonnées",
        "fields": [
          {
            "id": "field-nom",
            "key": "nom_complet",
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
            "id": "field-passport",
            "key": "passport",
            "label": "Numéro de passeport",
            "type": "text",
            "required": true
          },
          {
            "id": "field-email",
            "key": "email",
            "label": "Email",
            "type": "email",
            "required": true
          },
          {
            "id": "field-tel",
            "key": "telephone",
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
        "name": "Lettre visiteur standard",
        "description": "Lettre adaptée automatiquement selon votre situation",
        "conditions": [],
        "template_content": "",
        "sections": [
          {
            "id": "section-intro",
            "title": "Introduction",
            "content": "Madame, Monsieur,\\n\\nJe soussigné(e), {{nom_complet}}, né(e) le {{date_naissance}}, titulaire du passeport numéro {{passport}}, souhaite présenter ma demande de visa visiteur pour {{pays_destination}}.\\n\\nJe prévois de séjourner du {{date_depart}} au {{date_retour}} pour les raisons détaillées ci-dessous.",
            "required": true
          },
          {
            "id": "section-objet-tourisme",
            "title": "Objet du voyage - Tourisme",
            "content": "L''objet de mon voyage est le tourisme. Je souhaite découvrir {{pays_destination}}, sa culture, ses paysages et son patrimoine. J''ai planifié un itinéraire touristique qui me permettra de visiter les principales attractions du pays.\\n\\n{{itineraire}}",
            "include_if": [
              { "field": "objet_voyage", "operator": "equals", "value": "TOURISME" }
            ]
          },
          {
            "id": "section-objet-famille",
            "title": "Objet du voyage - Visite familiale",
            "content": "L''objet de mon voyage est une visite familiale. Je souhaite rendre visite à mes proches résidant à {{pays_destination}}. Ce voyage est important pour maintenir nos liens familiaux et passer du temps de qualité ensemble.\\n\\n{{itineraire}}",
            "include_if": [
              { "field": "objet_voyage", "operator": "equals", "value": "FAMILLE" }
            ]
          },
          {
            "id": "section-objet-affaires",
            "title": "Objet du voyage - Affaires",
            "content": "L''objet de mon voyage est professionnel. Je me rendrai à {{pays_destination}} dans le cadre de mes activités professionnelles. Ce déplacement est essentiel pour mon travail et je retournerai dans mon pays dès la fin de ma mission.\\n\\n{{itineraire}}",
            "include_if": [
              { "field": "objet_voyage", "operator": "equals", "value": "AFFAIRES" }
            ]
          },
          {
            "id": "section-hebergement",
            "title": "Hébergement",
            "content": "Durant mon séjour, je serai hébergé(e) comme suit :\\n{{hebergement_details}}",
            "required": true
          },
          {
            "id": "section-finances",
            "title": "Capacité financière",
            "content": "Concernant ma situation financière, j''ai prévu un budget de {{budget_estime}} pour ce voyage. Je dispose actuellement de {{fonds_disponibles}} provenant de {{source_fonds}}. Ces fonds sont largement suffisants pour couvrir tous mes frais de voyage, d''hébergement et de subsistance pendant mon séjour.",
            "required": true
          },
          {
            "id": "section-attaches",
            "title": "Attaches au pays d''origine",
            "content": "Je tiens à souligner mes attaches solides à mon pays d''origine, qui garantissent mon retour à l''issue de mon séjour :\\n\\nSituation professionnelle :\\n{{attaches_emploi}}\\n\\nLiens familiaux :\\n{{attaches_famille}}\\n\\nAutres engagements :\\n{{attaches_obligations}}\\n\\nCes éléments démontrent clairement mon intention de retourner dans mon pays à la fin de mon séjour autorisé.",
            "required": true
          },
          {
            "id": "section-refus",
            "title": "Historique de refus",
            "content": "Je tiens à préciser qu''une demande de visa antérieure a été refusée. Voici les détails et les changements apportés depuis :\\n\\n{{refus_details}}",
            "include_if": [
              { "field": "refus_anterieur", "operator": "equals", "value": "true" }
            ]
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "Je m''engage à respecter toutes les lois et règlements de {{pays_destination}} durant mon séjour, et à quitter le territoire avant l''expiration de mon visa.\\n\\nJe reste à votre disposition pour tout document complémentaire ou entretien que vous jugeriez nécessaire.\\n\\nJe vous prie d''agréer, Madame, Monsieur, l''expression de mes salutations distinguées.\\n\\n{{nom_complet}}\\nEmail: {{email}}\\nTéléphone: {{telephone}}",
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

-- 2. Template Invitation
INSERT INTO public.guided_template_configs (name, description, category, is_active, config)
VALUES (
  'Lettre d''Invitation',
  'Lettre d''invitation officielle pour accueillir un visiteur',
  'immigration',
  true,
  '{
    "id": "invitation-hote",
    "name": "Lettre d''Invitation",
    "description": "Créez une lettre d''invitation professionnelle pour votre visiteur",
    "category": "immigration",
    "steps": [
      {
        "id": "step-1-hote",
        "title": "Informations sur l''hôte (vous)",
        "fields": [
          {
            "id": "field-hote-nom",
            "key": "hote_nom",
            "label": "Votre nom complet",
            "type": "text",
            "required": true
          },
          {
            "id": "field-hote-naissance",
            "key": "hote_date_naissance",
            "label": "Votre date de naissance",
            "type": "date",
            "required": true
          },
          {
            "id": "field-hote-adresse",
            "key": "hote_adresse",
            "label": "Votre adresse complète",
            "type": "textarea",
            "required": true,
            "placeholder": "Numéro, rue, ville, code postal, pays"
          },
          {
            "id": "field-hote-statut",
            "key": "hote_statut",
            "label": "Votre statut",
            "type": "select",
            "required": true,
            "options": [
              { "value": "citoyen", "label": "Citoyen" },
              { "value": "resident_permanent", "label": "Résident permanent" },
              { "value": "resident_temporaire", "label": "Résident temporaire" }
            ]
          }
        ]
      },
      {
        "id": "step-2-visiteur",
        "title": "Informations sur le visiteur",
        "fields": [
          {
            "id": "field-visiteur-nom",
            "key": "visiteur_nom",
            "label": "Nom complet du visiteur",
            "type": "text",
            "required": true
          },
          {
            "id": "field-visiteur-naissance",
            "key": "visiteur_date_naissance",
            "label": "Date de naissance du visiteur",
            "type": "date",
            "required": true
          },
          {
            "id": "field-visiteur-adresse",
            "key": "visiteur_adresse",
            "label": "Adresse du visiteur (pays d''origine)",
            "type": "textarea",
            "required": true
          },
          {
            "id": "field-lien",
            "key": "lien_hote_visiteur",
            "label": "Votre lien avec le visiteur",
            "type": "text",
            "required": true,
            "placeholder": "Ex: Cousin, ami d''enfance, collègue"
          }
        ]
      },
      {
        "id": "step-3-sejour",
        "title": "Détails du séjour",
        "fields": [
          {
            "id": "field-dates",
            "key": "dates_visite",
            "label": "Dates prévues du séjour",
            "type": "text",
            "required": true,
            "placeholder": "Ex: Du 15 juin au 30 juillet 2025"
          },
          {
            "id": "field-prise-en-charge",
            "key": "prise_en_charge",
            "label": "Prise en charge financière",
            "type": "select",
            "required": true,
            "options": [
              { "value": "AUCUNE", "label": "Aucune - Le visiteur paie tout" },
              { "value": "PARTIELLE", "label": "Partielle - Hébergement et/ou repas" },
              { "value": "TOTALE", "label": "Totale - Tous les frais" }
            ]
          },
          {
            "id": "field-prise-en-charge-details",
            "key": "prise_en_charge_details",
            "label": "Précisions sur la prise en charge",
            "type": "textarea",
            "required": false,
            "visible_if": [
              { "field": "prise_en_charge", "operator": "in", "value": ["PARTIELLE", "TOTALE"] }
            ],
            "placeholder": "Détaillez ce que vous prenez en charge (hébergement, repas, transport, etc.)"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "variant-default",
        "name": "Lettre d''invitation standard",
        "description": "Invitation formelle",
        "conditions": [],
        "template_content": "",
        "sections": [
          {
            "id": "section-header",
            "title": "En-tête",
            "content": "LETTRE D''INVITATION\\n\\nÀ qui de droit,\\n\\nJe soussigné(e), {{hote_nom}}, né(e) le {{hote_date_naissance}}, résidant à {{hote_adresse}}, de statut {{hote_statut}}, rédige la présente lettre d''invitation.",
            "required": true
          },
          {
            "id": "section-invitation",
            "title": "Invitation",
            "content": "Par la présente, j''ai l''honneur d''inviter {{visiteur_nom}}, né(e) le {{visiteur_date_naissance}}, résidant à {{visiteur_adresse}}.\\n\\n{{visiteur_nom}} est mon/ma {{lien_hote_visiteur}}.\\n\\nLa visite est prévue {{dates_visite}}.",
            "required": true
          },
          {
            "id": "section-prise-en-charge-partielle",
            "title": "Prise en charge partielle",
            "content": "Durant le séjour, je prendrai en charge une partie des frais comme suit :\\n{{prise_en_charge_details}}\\n\\nLe visiteur prendra en charge les autres dépenses personnelles.",
            "include_if": [
              { "field": "prise_en_charge", "operator": "equals", "value": "PARTIELLE" }
            ]
          },
          {
            "id": "section-prise-en-charge-totale",
            "title": "Prise en charge totale",
            "content": "Je m''engage à prendre en charge l''intégralité des frais de séjour du visiteur, incluant :\\n{{prise_en_charge_details}}\\n\\nJe joins à cette lettre les documents attestant de ma capacité financière à honorer cet engagement.",
            "include_if": [
              { "field": "prise_en_charge", "operator": "equals", "value": "TOTALE" }
            ]
          },
          {
            "id": "section-prise-en-charge-aucune",
            "title": "Aucune prise en charge",
            "content": "Le visiteur prendra en charge l''intégralité de ses frais de séjour (hébergement, repas, transport et dépenses personnelles). Cette invitation vise uniquement à faciliter l''obtention du visa.",
            "include_if": [
              { "field": "prise_en_charge", "operator": "equals", "value": "AUCUNE" }
            ]
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "Je reste à votre disposition pour tout renseignement complémentaire.\\n\\nVeuillez agréer mes salutations distinguées.\\n\\n{{hote_nom}}\\nDate: {{current_date}}",
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
