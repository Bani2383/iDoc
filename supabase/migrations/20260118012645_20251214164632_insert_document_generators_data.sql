/*
  # Insert Document Generators Data

  1. Generators
    - CA: IRCC Explanation Letter (en-CA)
    - CA: Study Permit Letter of Intent (en-CA)
    - US: USCIS Cover Letter (en-US)
    - UK: UK Visa Cover Letter (en-GB)
    - EU: Schengen Motivation Letter (fr-FR)
    - AU: GTE Statement (en-AU)

  2. Steps and Fields
    - Each generator has 2-6 steps
    - Each step has 1-5 fields
    - All configured with proper types, validation, and placeholders
*/

-- Insert generators
INSERT INTO document_generators (id, country_code, locale, slug, title, disclaimer, price, currency, pre_payment_notice, checkout_disclaimer, display_order)
VALUES
  (
    'ca-gen-ircc-explanation',
    'ca',
    'en-CA',
    '/en/generator/ircc-explanation-letter',
    'Generator – IRCC Explanation Letter',
    'iD0c is a document automation platform. It does not provide legal advice and does not replace a lawyer or licensed consultant. No document guarantees a positive decision.',
    1.99,
    'CAD',
    'Preview is available before payment. PDF download becomes available after payment.',
    'Automatically generated document – not legal advice.',
    1
  ),
  (
    'ca-gen-study-intent',
    'ca',
    'en-CA',
    '/en/generator/study-permit-letter-of-intent',
    'Generator – Study Permit Letter of Intent (Canada)',
    'iD0c is a document automation platform. It does not provide legal advice and does not replace a lawyer or licensed consultant. No document guarantees approval by IRCC.',
    1.99,
    'CAD',
    'Preview is available before payment. PDF download becomes available after payment.',
    'Automatically generated document – not legal advice.',
    2
  ),
  (
    'us-gen-uscis-cover',
    'us',
    'en-US',
    '/en-us/generator/uscis-cover-letter',
    'Generator – USCIS Cover Letter',
    'iD0c is a document automation platform. It does not provide legal advice and does not replace an attorney. No document guarantees an outcome.',
    1.99,
    'USD',
    'Preview is available before payment. PDF download becomes available after payment.',
    'Automatically generated document – not legal advice.',
    3
  ),
  (
    'uk-gen-ukvi-cover',
    'uk',
    'en-GB',
    '/en-gb/generator/uk-visa-cover-letter',
    'Generator – UK Visa Cover Letter (UKVI)',
    'iD0c is a document automation platform. It does not provide legal advice and does not replace a solicitor or regulated advisor. No document guarantees an outcome.',
    1.99,
    'GBP',
    'Preview is available before payment. PDF download becomes available after payment.',
    'Automatically generated document – not legal advice.',
    4
  ),
  (
    'eu-gen-schengen-motivation',
    'eu',
    'fr-FR',
    '/fr/generateur/visa-schengen',
    'Générateur – Lettre de motivation visa Schengen',
    'iD0c est une plateforme d''automatisation documentaire. Elle ne fournit pas de conseils juridiques. Aucun document ne garantit l''obtention d''un visa.',
    1.99,
    'EUR',
    'Aperçu disponible avant paiement. Téléchargement PDF après paiement.',
    'Document généré automatiquement – ne constitue pas un avis juridique.',
    5
  ),
  (
    'au-gen-gte',
    'au',
    'en-AU',
    '/en-au/generator/gte-statement',
    'Generator – Genuine Temporary Entrant (GTE) Statement (Australia)',
    'iD0c is a document automation platform. It does not provide legal advice and does not replace a registered migration agent. No document guarantees an outcome.',
    1.99,
    'AUD',
    'Preview is available before payment. PDF download becomes available after payment.',
    'Automatically generated document – not legal advice.',
    6
  )
ON CONFLICT (id) DO NOTHING;

-- Insert steps for CA IRCC Explanation
DO $$
DECLARE
  step_basics uuid;
  step_context uuid;
  step_timeline uuid;
  step_explanation uuid;
  step_evidence uuid;
  step_closing uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-ircc-explanation', 'basics', 1, 'Basics') RETURNING id INTO step_basics;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-ircc-explanation', 'context', 2, 'Purpose and context') RETURNING id INTO step_context;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-ircc-explanation', 'timeline', 3, 'Timeline') RETURNING id INTO step_timeline;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-ircc-explanation', 'explanation', 4, 'Explanation') RETURNING id INTO step_explanation;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-ircc-explanation', 'evidence', 5, 'Supporting documents') RETURNING id INTO step_evidence;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-ircc-explanation', 'closing', 6, 'Closing') RETURNING id INTO step_closing;

  -- Fields for basics step
  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_basics, 'fullName', 1, 'Full name', 'text', true, 'First LAST'),
    (step_basics, 'applicationType', 2, 'Application type', 'select', true, null),
    (step_basics, 'fileNumber', 3, 'File number (if applicable)', 'text', false, 'e.g., V123456789'),
    (step_basics, 'dateOfLetter', 4, 'Letter date', 'date', true, null);
  
  UPDATE generator_fields SET options = '["Study Permit", "Work Permit", "Visitor Visa", "Other"]'::jsonb
  WHERE step_uuid = step_basics AND field_key = 'applicationType';

  -- Fields for context step
  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_context, 'subjectLine', 1, 'Subject line', 'text', true, 'Explanation Letter – Study Permit'),
    (step_context, 'purpose', 2, 'Why are you writing this letter?', 'textarea', true, 'Explain the specific issue (gap, funds, correction, inconsistency…)');

  -- Fields for timeline step
  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_timeline, 'timeline', 1, 'Timeline (dates and events)', 'textarea', true, 'YYYY-MM to YYYY-MM: … / YYYY-MM: …');

  -- Fields for explanation step
  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_explanation, 'explanations', 1, 'Explanation (objective and verifiable)', 'textarea', true, null);

  -- Fields for evidence step
  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_evidence, 'attachmentsList', 1, 'Attachments list (optional)', 'textarea', false, 'Bank statements, letters, contracts, attestations…');

  -- Fields for closing step
  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_closing, 'closing', 1, 'Closing (short)', 'textarea', true, 'I confirm the information is accurate…'),
    (step_closing, 'contactEmail', 2, 'Email (optional)', 'email', false, 'name@email.com');
END $$;