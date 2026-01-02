/*
  # Insert Sample IRCC Guided Template

  ## Sample Template
    - IRCC Refusal Letter Response - A guided template for responding to IRCC refusal letters
    - Uses conditional logic based on refusal reasons
    - Demonstrates the guided template system in action

  ## Important Notes
    - This is a SAMPLE template for demonstration
    - Does NOT affect existing document_templates or document_generators
    - This is part of the NEW guided template system
*/

-- Insert sample IRCC guided template configuration
INSERT INTO public.guided_template_configs (id, name, description, category, is_active, config)
VALUES (
  gen_random_uuid(),
  'IRCC Refusal Letter Response',
  'Create a professional response to an IRCC refusal letter with intelligent guidance based on your specific situation',
  'immigration',
  true,
  '{
    "id": "ircc-refusal-response",
    "name": "IRCC Refusal Letter Response",
    "description": "Professional template for responding to IRCC refusal letters",
    "category": "immigration",
    "steps": [
      {
        "id": "step-1-personal-info",
        "title": "Personal Information",
        "description": "Basic information about the applicant",
        "fields": [
          {
            "id": "field-full-name",
            "key": "full_name",
            "label": "Full Legal Name",
            "type": "text",
            "required": true,
            "placeholder": "Enter your full name as it appears on your passport"
          },
          {
            "id": "field-date-of-birth",
            "key": "date_of_birth",
            "label": "Date of Birth",
            "type": "date",
            "required": true
          },
          {
            "id": "field-passport-number",
            "key": "passport_number",
            "label": "Passport Number",
            "type": "text",
            "required": true,
            "placeholder": "Your passport number"
          },
          {
            "id": "field-email",
            "key": "email",
            "label": "Email Address",
            "type": "email",
            "required": true,
            "validators": [
              {
                "type": "email",
                "message": "Please enter a valid email address"
              }
            ]
          },
          {
            "id": "field-phone",
            "key": "phone",
            "label": "Phone Number",
            "type": "text",
            "required": true
          }
        ]
      },
      {
        "id": "step-2-refusal-details",
        "title": "Refusal Details",
        "description": "Information about your IRCC refusal",
        "fields": [
          {
            "id": "field-application-type",
            "key": "application_type",
            "label": "Type of Application Refused",
            "type": "select",
            "required": true,
            "options": [
              { "value": "visitor_visa", "label": "Visitor Visa" },
              { "value": "study_permit", "label": "Study Permit" },
              { "value": "work_permit", "label": "Work Permit" },
              { "value": "pr_application", "label": "Permanent Residence Application" }
            ]
          },
          {
            "id": "field-refusal-date",
            "key": "refusal_date",
            "label": "Date of Refusal Letter",
            "type": "date",
            "required": true
          },
          {
            "id": "field-application-number",
            "key": "application_number",
            "label": "Application Number",
            "type": "text",
            "required": true,
            "placeholder": "Your IRCC application number"
          },
          {
            "id": "field-refusal-reasons",
            "key": "refusal_reasons",
            "label": "Primary Reason(s) for Refusal",
            "type": "select",
            "required": true,
            "options": [
              { "value": "insufficient_funds", "label": "Insufficient Funds / Financial Documentation" },
              { "value": "travel_history", "label": "Travel History / Purpose of Visit" },
              { "value": "ties_to_home", "label": "Ties to Home Country" },
              { "value": "employment", "label": "Employment / Income Documentation" },
              { "value": "other", "label": "Other Reasons" }
            ]
          },
          {
            "id": "field-refusal-details",
            "key": "refusal_details",
            "label": "Detailed Refusal Reasons",
            "type": "textarea",
            "required": true,
            "placeholder": "Copy the exact wording from your refusal letter explaining why your application was refused",
            "description": "Please provide the complete text from your refusal letter"
          }
        ]
      },
      {
        "id": "step-3-financial-info",
        "title": "Financial Information",
        "description": "Your financial situation and supporting documents",
        "visible_if": [
          {
            "field": "refusal_reasons",
            "operator": "equals",
            "value": "insufficient_funds"
          }
        ],
        "fields": [
          {
            "id": "field-bank-balance",
            "key": "bank_balance",
            "label": "Current Bank Balance (CAD)",
            "type": "text",
            "required": true,
            "placeholder": "$XX,XXX.XX"
          },
          {
            "id": "field-income-source",
            "key": "income_source",
            "label": "Source of Income",
            "type": "text",
            "required": true,
            "placeholder": "Employment, Business, Investments, etc."
          },
          {
            "id": "field-monthly-income",
            "key": "monthly_income",
            "label": "Monthly Income (CAD)",
            "type": "text",
            "required": true
          }
        ]
      },
      {
        "id": "step-4-ties-to-home",
        "title": "Ties to Home Country",
        "description": "Your connections and reasons to return home",
        "visible_if": [
          {
            "field": "refusal_reasons",
            "operator": "equals",
            "value": "ties_to_home"
          }
        ],
        "fields": [
          {
            "id": "field-property-ownership",
            "key": "property_ownership",
            "label": "Do you own property in your home country?",
            "type": "radio",
            "required": true,
            "options": [
              { "value": "yes", "label": "Yes" },
              { "value": "no", "label": "No" }
            ]
          },
          {
            "id": "field-family-ties",
            "key": "family_ties",
            "label": "Describe your family ties to your home country",
            "type": "textarea",
            "required": true,
            "placeholder": "Spouse, children, parents, etc. living in home country"
          },
          {
            "id": "field-employment-home",
            "key": "employment_home",
            "label": "Current Employment in Home Country",
            "type": "text",
            "required": true,
            "placeholder": "Your job title and company"
          }
        ]
      },
      {
        "id": "step-5-additional-docs",
        "title": "New Supporting Documents",
        "description": "Additional documentation you are providing with this response",
        "fields": [
          {
            "id": "field-new-documents",
            "key": "new_documents",
            "label": "List of New Documents",
            "type": "textarea",
            "required": true,
            "placeholder": "List all new documents you are submitting (e.g., updated bank statements, employment letter, property deed, etc.)"
          },
          {
            "id": "field-letter-purpose",
            "key": "letter_purpose",
            "label": "Purpose of This Response Letter",
            "type": "textarea",
            "required": true,
            "placeholder": "Explain why you are submitting this response and what has changed since your initial application"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "variant-financial",
        "name": "Financial Concerns Response",
        "description": "Response focused on addressing insufficient funds",
        "conditions": [
          {
            "field": "refusal_reasons",
            "operator": "equals",
            "value": "insufficient_funds"
          }
        ],
        "template_content": "Response letter addressing financial documentation concerns",
        "sections": [
          {
            "id": "section-intro",
            "title": "Introduction",
            "content": "Dear Immigration Officer,\\n\\nI am writing to respectfully address the refusal of my {{application_type}} application (Application Number: {{application_number}}) dated {{refusal_date}}.\\n\\nAfter careful review of the refusal letter, I understand that the primary concern was related to insufficient financial documentation. I would like to provide additional clarification and supporting documents to demonstrate my financial capacity.",
            "required": true
          },
          {
            "id": "section-financial-clarification",
            "title": "Financial Clarification",
            "content": "Financial Overview:\\n\\n- Current Bank Balance: {{bank_balance}} CAD\\n- Source of Income: {{income_source}}\\n- Monthly Income: {{monthly_income}} CAD\\n\\nI have attached updated financial documents that clearly demonstrate my ability to support myself during my stay in Canada. These documents include recent bank statements showing consistent savings and income over the past six months.",
            "include_if": [
              {
                "field": "refusal_reasons",
                "operator": "equals",
                "value": "insufficient_funds"
              }
            ]
          },
          {
            "id": "section-new-documents",
            "title": "Supporting Documentation",
            "content": "New Documents Submitted:\\n\\n{{new_documents}}\\n\\nEach document has been certified and translated where necessary, in accordance with IRCC requirements.",
            "required": true
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "{{letter_purpose}}\\n\\nI believe these additional documents clearly address the concerns raised in the refusal letter. I respectfully request that you reconsider my application in light of this new information.\\n\\nThank you for your time and consideration.\\n\\nSincerely,\\n{{full_name}}\\nPassport: {{passport_number}}\\nEmail: {{email}}\\nPhone: {{phone}}",
            "required": true
          }
        ]
      },
      {
        "id": "variant-ties",
        "name": "Ties to Home Country Response",
        "description": "Response focused on demonstrating ties to home country",
        "conditions": [
          {
            "field": "refusal_reasons",
            "operator": "equals",
            "value": "ties_to_home"
          }
        ],
        "template_content": "Response letter addressing ties to home country concerns",
        "sections": [
          {
            "id": "section-intro",
            "title": "Introduction",
            "content": "Dear Immigration Officer,\\n\\nI am writing to respectfully address the refusal of my {{application_type}} application (Application Number: {{application_number}}) dated {{refusal_date}}.\\n\\nI understand that the primary concern was regarding my ties to my home country and the likelihood of my return. I would like to provide additional evidence to demonstrate my strong connections to my home country.",
            "required": true
          },
          {
            "id": "section-ties-evidence",
            "title": "Ties to Home Country",
            "content": "My Strong Ties to Home Country:\\n\\n- Property Ownership: {{property_ownership}}\\n- Employment: {{employment_home}}\\n- Family Connections: {{family_ties}}\\n\\nThese ties represent significant commitments and responsibilities that require my presence in my home country. I have no intention of remaining in Canada beyond the authorized period.",
            "include_if": [
              {
                "field": "refusal_reasons",
                "operator": "equals",
                "value": "ties_to_home"
              }
            ]
          },
          {
            "id": "section-new-documents",
            "title": "Supporting Documentation",
            "content": "New Documents Submitted:\\n\\n{{new_documents}}\\n\\nThese documents provide concrete evidence of my ties to my home country.",
            "required": true
          },
          {
            "id": "section-conclusion",
            "title": "Conclusion",
            "content": "{{letter_purpose}}\\n\\nI respectfully request that you reconsider my application in light of this additional evidence demonstrating my strong ties to my home country.\\n\\nThank you for your consideration.\\n\\nSincerely,\\n{{full_name}}\\nPassport: {{passport_number}}\\nEmail: {{email}}\\nPhone: {{phone}}",
            "required": true
          }
        ]
      }
    ],
    "default_variant": "variant-financial",
    "pricing": {
      "free_tier": ["pdf_download"],
      "premium_tier": ["pdf_download", "docx_download", "document_edit"]
    }
  }'::jsonb
)
ON CONFLICT DO NOTHING;
