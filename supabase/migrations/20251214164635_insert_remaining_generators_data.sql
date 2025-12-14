/*
  # Insert Remaining Generators Data

  1. CA Study Intent Generator
  2. US USCIS Cover Generator
  3. UK UKVI Cover Generator
  4. EU Schengen Generator
  5. AU GTE Generator
*/

-- CA Study Intent
DO $$
DECLARE
  step1 uuid; step2 uuid; step3 uuid; step4 uuid; step5 uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-study-intent', 'profile', 1, 'Applicant profile') RETURNING id INTO step1;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-study-intent', 'background', 2, 'Academic and professional background') RETURNING id INTO step2;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-study-intent', 'studyplan', 3, 'Study plan and rationale') RETURNING id INTO step3;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-study-intent', 'finances', 4, 'Financial capacity (summary)') RETURNING id INTO step4;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('ca-gen-study-intent', 'poststudy', 5, 'Post-study plan') RETURNING id INTO step5;

  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step1, 'fullName', 1, 'Full name', 'text', true, null),
    (step1, 'countryOfResidence', 2, 'Country of residence', 'text', true, null),
    (step1, 'programName', 3, 'Program name', 'text', true, null),
    (step1, 'institutionName', 4, 'Institution name', 'text', true, null),
    (step2, 'backgroundSummary', 1, 'Background summary', 'textarea', true, null),
    (step2, 'gaps', 2, 'Any gaps to explain? (optional)', 'textarea', false, null),
    (step3, 'whyProgram', 1, 'Why this program?', 'textarea', true, null),
    (step3, 'whyCanada', 2, 'Why Canada and this institution?', 'textarea', true, null),
    (step4, 'fundsSummary', 1, 'Funds summary', 'textarea', true, 'Sources of funds and how expenses will be covered (consistent with evidence).'),
    (step5, 'postStudyPlan', 1, 'Plan after studies', 'textarea', true, null);
END $$;

-- US USCIS Cover
DO $$
DECLARE
  step1 uuid; step2 uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('us-gen-uscis-cover', 'basics', 1, 'Basics') RETURNING id INTO step1;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('us-gen-uscis-cover', 'package', 2, 'Package contents') RETURNING id INTO step2;

  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step1, 'fullName', 1, 'Full name', 'text', true, null),
    (step1, 'petitionType', 2, 'Petition / application type', 'text', true, 'e.g., I-130, I-485, N-400…'),
    (step1, 'receiptNumber', 3, 'Receipt number (if any)', 'text', false, null),
    (step2, 'formsList', 1, 'Forms included', 'textarea', true, null),
    (step2, 'evidenceList', 2, 'Supporting documents', 'textarea', true, null),
    (step2, 'briefNotes', 3, 'Brief clarifications (optional)', 'textarea', false, null);
END $$;

-- UK UKVI Cover
DO $$
DECLARE
  step1 uuid; step2 uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('uk-gen-ukvi-cover', 'basics', 1, 'Basics') RETURNING id INTO step1;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('uk-gen-ukvi-cover', 'purpose', 2, 'Purpose and summary') RETURNING id INTO step2;

  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step1, 'fullName', 1, 'Full name', 'text', true, null),
    (step1, 'visaType', 2, 'Visa type', 'text', true, null),
    (step1, 'travelDates', 3, 'Travel dates (if applicable)', 'text', false, null),
    (step2, 'purpose', 1, 'Purpose of travel/stay', 'textarea', true, null),
    (step2, 'accommodation', 2, 'Accommodation summary', 'textarea', false, null),
    (step2, 'finances', 3, 'Financial summary', 'textarea', true, null),
    (step2, 'documents', 4, 'List of supporting documents', 'textarea', true, null);
END $$;

-- EU Schengen
DO $$
DECLARE
  step1 uuid; step2 uuid; step3 uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('eu-gen-schengen-motivation', 'identite', 1, 'Identité et voyage') RETURNING id INTO step1;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('eu-gen-schengen-motivation', 'hebergement-finances', 2, 'Hébergement et ressources') RETURNING id INTO step2;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('eu-gen-schengen-motivation', 'retour', 3, 'Engagement de retour') RETURNING id INTO step3;

  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step1, 'fullName', 1, 'Nom complet', 'text', true, null),
    (step1, 'passportNationality', 2, 'Nationalité', 'text', true, null),
    (step1, 'travelDates', 3, 'Dates de voyage', 'text', true, null),
    (step1, 'itinerary', 4, 'Itinéraire (résumé)', 'textarea', true, null),
    (step2, 'accommodation', 1, 'Hébergement', 'textarea', true, null),
    (step2, 'funds', 2, 'Ressources financières (résumé)', 'textarea', true, null),
    (step3, 'returnTies', 1, 'Éléments de retour (emploi, études, famille, etc.)', 'textarea', true, null);
END $$;

-- AU GTE
DO $$
DECLARE
  step1 uuid; step2 uuid;
BEGIN
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('au-gen-gte', 'profile', 1, 'Profile') RETURNING id INTO step1;
  INSERT INTO generator_steps (generator_id, step_id, step_order, title) VALUES
    ('au-gen-gte', 'rationale', 2, 'Rationale') RETURNING id INTO step2;

  INSERT INTO generator_fields (step_uuid, field_key, field_order, label, field_type, is_required, placeholder) VALUES
    (step1, 'fullName', 1, 'Full name', 'text', true, null),
    (step1, 'program', 2, 'Program', 'text', true, null),
    (step1, 'institution', 3, 'Institution', 'text', true, null),
    (step2, 'whyAustralia', 1, 'Why Australia?', 'textarea', true, null),
    (step2, 'tiesHome', 2, 'Ties to home country', 'textarea', true, null),
    (step2, 'finances', 3, 'Financial capacity (summary)', 'textarea', true, null),
    (step2, 'postStudy', 4, 'Post-study intentions', 'textarea', true, null);
END $$;