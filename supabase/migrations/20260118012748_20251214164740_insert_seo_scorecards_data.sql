/*
  # Insert SEO Scorecards Data

  1. SEO Scorecards
    - Canada (en-CA)
    - United States (en-US)
    - United Kingdom (en-GB)
    - European Union (fr-FR)
    - Australia (en-AU)

  2. Priority Keywords
    - 4 keywords for CA
    - 3 keywords for US
    - 3 keywords for UK
    - 3 keywords for EU
    - 3 keywords for AU
*/

-- Insert SEO scorecards
DO $$
DECLARE
  scorecard_ca uuid;
  scorecard_us uuid;
  scorecard_uk uuid;
  scorecard_eu uuid;
  scorecard_au uuid;
BEGIN
  -- Canada scorecard
  INSERT INTO seo_scorecards (country_code, locale, conversion_notes)
  VALUES (
    'ca',
    'en-CA',
    ARRAY[
      'Use preview-before-payment as primary trust hook.',
      'Keep disclaimers visible on generator + checkout.'
    ]
  )
  RETURNING id INTO scorecard_ca;

  -- Insert CA keywords
  INSERT INTO seo_priority_keywords (scorecard_id, keyword, intent, target_page, funnel) VALUES
    (scorecard_ca, 'IRCC explanation letter template', 'high', '/en/blog/ircc-explanation-letter-template', 'blog -> generator -> checkout'),
    (scorecard_ca, 'study permit letter of intent template canada', 'high', '/en/landing/study-permit-letter-of-intent', 'landing -> generator -> checkout'),
    (scorecard_ca, 'proof of funds explanation letter canada', 'high', '/en/blog/proof-of-funds-explanation-letter-template-ircc', 'blog -> generator -> checkout'),
    (scorecard_ca, 'study gap explanation letter canada', 'medium', '/en/blog/study-gap-explanation-letter-template', 'blog -> generator -> checkout');

  -- United States scorecard
  INSERT INTO seo_scorecards (country_code, locale, conversion_notes)
  VALUES (
    'us',
    'en-US',
    ARRAY[
      'Push cover-letter generator as the primary paid action.',
      'Use one CTA per section (avoid clutter).'
    ]
  )
  RETURNING id INTO scorecard_us;

  -- Insert US keywords
  INSERT INTO seo_priority_keywords (scorecard_id, keyword, intent, target_page, funnel) VALUES
    (scorecard_us, 'USCIS cover letter template', 'high', '/en-us/blog/uscis-cover-letter-template', 'blog -> generator -> checkout'),
    (scorecard_us, 'F1 visa letter of intent template', 'high', '/en-us/blog/f1-letter-of-intent-template', 'blog -> generator -> checkout'),
    (scorecard_us, 'visa refusal explanation letter template', 'medium', '/en-us/blog/visa-refusal-explanation-letter-template', 'blog -> generator -> checkout');

  -- United Kingdom scorecard
  INSERT INTO seo_scorecards (country_code, locale, conversion_notes)
  VALUES (
    'uk',
    'en-GB',
    ARRAY[
      'Add a short ''documents checklist'' block above CTA.',
      'Show the disclaimer in the CTA vicinity.'
    ]
  )
  RETURNING id INTO scorecard_uk;

  -- Insert UK keywords
  INSERT INTO seo_priority_keywords (scorecard_id, keyword, intent, target_page, funnel) VALUES
    (scorecard_uk, 'UK visa cover letter template', 'high', '/en-gb/blog/uk-visa-cover-letter-template', 'blog -> generator -> checkout'),
    (scorecard_uk, 'UK student visa cover letter template', 'high', '/en-gb/blog/uk-student-visa-cover-letter-template', 'blog -> generator -> checkout'),
    (scorecard_uk, 'UK visa financial explanation letter', 'medium', '/en-gb/blog/uk-visa-financial-explanation-letter-template', 'blog -> generator -> checkout');

  -- European Union scorecard
  INSERT INTO seo_scorecards (country_code, locale, conversion_notes)
  VALUES (
    'eu',
    'fr-FR',
    ARRAY[
      'Keep the letter structure extremely concise (snippet-friendly).',
      'Use one trust callout per page.'
    ]
  )
  RETURNING id INTO scorecard_eu;

  -- Insert EU keywords
  INSERT INTO seo_priority_keywords (scorecard_id, keyword, intent, target_page, funnel) VALUES
    (scorecard_eu, 'modèle lettre motivation visa schengen', 'high', '/fr/blog/modele-lettre-motivation-visa-schengen', 'blog -> generator -> checkout'),
    (scorecard_eu, 'modèle lettre d''hébergement visa', 'high', '/fr/blog/modele-lettre-hebergement-visa', 'blog -> generator -> checkout'),
    (scorecard_eu, 'lettre explicative refus visa schengen', 'medium', '/fr/blog/modele-lettre-explicative-visa', 'blog -> generator -> checkout');

  -- Australia scorecard
  INSERT INTO seo_scorecards (country_code, locale, conversion_notes)
  VALUES (
    'au',
    'en-AU',
    ARRAY[
      'GTE is the main paid generator — push it site-wide on AU pages.',
      'Use a small FAQ block for snippets.'
    ]
  )
  RETURNING id INTO scorecard_au;

  -- Insert AU keywords
  INSERT INTO seo_priority_keywords (scorecard_id, keyword, intent, target_page, funnel) VALUES
    (scorecard_au, 'GTE statement template', 'high', '/en-au/blog/gte-statement-template', 'blog -> generator -> checkout'),
    (scorecard_au, 'genuine temporary entrant statement example', 'high', '/en-au/blog/gte-statement-template', 'blog -> generator -> checkout'),
    (scorecard_au, 'australia student visa statement template', 'medium', '/en-au/generator/gte-statement', 'generator -> checkout');
END $$;