/*
  # Insert 4 Additional Regional Generators

  1. New Generators
    - Africa (fr) - Study project explanation letter
    - UAE (en-AE) - UAE visa explanation letter
    - Spain (es-ES) - Student visa motivation letter
    - Germany (en-DE) - Student visa motivation letter

  2. Steps and Fields
    - Each generator has 2-4 steps
    - All configured with proper types and validation
*/

-- Insert generators
INSERT INTO document_generators (id, country_code, locale, slug, title, disclaimer, price, currency, pre_payment_notice, checkout_disclaimer, display_order)
VALUES
  (
    'af-gen-study-project',
    'af',
    'fr',
    '/fr-afrique/generateur/lettre-explicative-projet-etudes',
    'Générateur – Lettre explicative de projet d''études à l''étranger',
    'iD0c est un outil de génération de documents. Il ne fournit pas de conseils juridiques et ne garantit aucune décision.',
    1.99,
    'EUR',
    'Aperçu disponible avant paiement. Téléchargement PDF après paiement.',
    'Document généré automatiquement – ne constitue pas un avis juridique.',
    7
  ),
  (
    'ae-gen-visa-explanation',
    'ae',
    'en-AE',
    '/en-ae/generator/uae-visa-explanation-letter',
    'Generator – UAE Visa Explanation Letter',
    'iD0c does not provide legal advice and does not replace a licensed immigration consultant. No document guarantees approval.',
    1.99,
    'AED',
    'Preview is available before payment. PDF download becomes available after payment.',
    'Automatically generated document – not legal advice.',
    8
  ),
  (
    'es-gen-student-motivation',
    'es',
    'es-ES',
    '/es/generador/carta-motivacion-visado-estudios',
    'Generador – Carta de motivación para visado de estudios (España)',
    'iD0c es una plataforma de generación de documentos. No ofrece asesoramiento jurídico ni garantiza la concesión del visado.',
    1.99,
    'EUR',
    'Vista previa disponible antes del pago. Descarga del PDF después del pago.',
    'Documento generado automáticamente – no constituye asesoramiento jurídico.',
    9
  ),
  (
    'de-gen-student-motivation',
    'de',
    'en-DE',
    '/en-de/generator/germany-student-visa-motivation-letter',
    'Generator – Germany Student Visa Motivation Letter',
    'iD0c is a document automation platform. It does not provide legal advice and does not replace an immigration advisor. No document guarantees visa approval.',
    1.99,
    'EUR',
    'Preview is available before payment. PDF download becomes available after payment.',
    'Automatically generated document – not legal advice.',
    10
  )
ON CONFLICT (id) DO NOTHING;

-- Insert steps for Africa generator (fr)
DO $$
DECLARE
  step_identite uuid;
  step_projet uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('af-gen-study-project', 'identite', 1, 'Identité') RETURNING id INTO step_identite;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('af-gen-study-project', 'projet', 2, 'Projet d''études') RETURNING id INTO step_projet;

  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_identite, 'fullName', 1, 'Nom complet', 'text', true, null),
    (step_identite, 'country', 2, 'Pays de résidence', 'text', true, null),
    (step_projet, 'studyPlan', 1, 'Description du projet d''études', 'textarea', true, null),
    (step_projet, 'returnPlan', 2, 'Projet après les études (retour)', 'textarea', true, null);
END $$;

-- Insert steps for UAE generator (en-AE)
DO $$
DECLARE
  step_profile uuid;
  step_income uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ae-gen-visa-explanation', 'profile', 1, 'Applicant details') RETURNING id INTO step_profile;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ae-gen-visa-explanation', 'income', 2, 'Income and activity') RETURNING id INTO step_income;

  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_profile, 'fullName', 1, 'Full name', 'text', true, null),
    (step_profile, 'visaType', 2, 'Visa type (employment / freelance)', 'text', true, null),
    (step_income, 'incomeSource', 1, 'Source of income', 'textarea', true, null),
    (step_income, 'activityDescription', 2, 'Professional activity description', 'textarea', true, null);
END $$;

-- Insert steps for Spain generator (es-ES)
DO $$
DECLARE
  step_identidad uuid;
  step_motivacion uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('es-gen-student-motivation', 'identidad', 1, 'Datos del solicitante') RETURNING id INTO step_identidad;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('es-gen-student-motivation', 'motivacion', 2, 'Motivación') RETURNING id INTO step_motivacion;

  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_identidad, 'fullName', 1, 'Nombre completo', 'text', true, null),
    (step_identidad, 'program', 2, 'Programa de estudios', 'text', true, null),
    (step_identidad, 'institution', 3, 'Centro educativo', 'text', true, null),
    (step_motivacion, 'whySpain', 1, '¿Por qué España?', 'textarea', true, null),
    (step_motivacion, 'careerPlan', 2, 'Proyecto académico y profesional', 'textarea', true, null);
END $$;

-- Insert steps for Germany generator (en-DE)
DO $$
DECLARE
  step_profile uuid;
  step_motivation uuid;
  step_finances uuid;
  step_return uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('de-gen-student-motivation', 'profile', 1, 'Applicant profile') RETURNING id INTO step_profile;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('de-gen-student-motivation', 'motivation', 2, 'Study motivation') RETURNING id INTO step_motivation;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('de-gen-student-motivation', 'finances', 3, 'Financial capacity') RETURNING id INTO step_finances;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('de-gen-student-motivation', 'return', 4, 'Post-study plans') RETURNING id INTO step_return;

  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step_profile, 'fullName', 1, 'Full name', 'text', true, null),
    (step_profile, 'nationality', 2, 'Nationality', 'text', true, null),
    (step_profile, 'program', 3, 'Program of study', 'text', true, null),
    (step_profile, 'institution', 4, 'Institution', 'text', true, null),
    (step_motivation, 'whyProgram', 1, 'Why this program?', 'textarea', true, null),
    (step_motivation, 'whyGermany', 2, 'Why Germany?', 'textarea', true, null),
    (step_finances, 'blockedAccount', 1, 'Blocked account (Sperrkonto) or funding explanation', 'textarea', true, null),
    (step_return, 'postStudy', 1, 'Plans after studies', 'textarea', true, null);
END $$;