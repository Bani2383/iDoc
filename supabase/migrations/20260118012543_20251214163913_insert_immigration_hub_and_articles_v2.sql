/*
  # Insert Immigration Hub and Articles

  1. Content
    - 1 Global Hub page for immigration templates (bilingual FR/EN)
    - 6 Blog articles covering various countries

  2. SEO Optimization
    - Meta titles and descriptions for each page
    - Structured content with clear CTAs
    - Country-specific slugs and locales

  3. Security
    - All pages inserted as published
    - Public read access via existing RLS policies
*/

-- Insert the Global Hub page into seo_landing_pages (bilingual)
INSERT INTO seo_landing_pages (
  slug,
  title_fr,
  subtitle_fr,
  content_html_fr,
  meta_title_fr,
  meta_description_fr,
  title_en,
  subtitle_en,
  content_html_en,
  meta_title_en,
  meta_description_en,
  page_type,
  cta_text_fr,
  cta_text_en,
  cta_link,
  keywords,
  is_published,
  published_at
) VALUES (
  '/immigration-letter-templates',
  'Modèles de lettres d''immigration (Global) : Canada, USA, UK, Schengen & Australie',
  'Ce hub fournit des modèles structurés pour les lettres d''immigration les plus courantes à travers plusieurs pays.',
  '<div class="immigration-hub">
    <h1>Modèles de lettres d''immigration (Global)</h1>
    <p>Ce hub fournit des modèles structurés pour les lettres d''immigration les plus courantes à travers plusieurs pays. Chaque modèle se concentre sur la clarté, la cohérence et les attentes administratives.</p>

    <div class="callout callout-info">
      <p><strong>Important :</strong> iD0c est une plateforme d''automatisation de documents. Elle ne fournit pas de conseils juridiques et ne remplace pas un avocat ou consultant agréé.</p>
    </div>

    <h2>Pays et modèles disponibles</h2>
    <ul>
      <li>Canada (IRCC) : lettres d''explication, permis d''études, preuve de fonds</li>
      <li>États-Unis (USCIS) : lettres de présentation, intention F-1, explications de refus</li>
      <li>Royaume-Uni (UKVI) : lettres de présentation visa, explications financières</li>
      <li>Schengen / France : lettres de motivation, attestations d''hébergement</li>
      <li>Australie : déclarations GTE (Genuine Temporary Entrant)</li>
    </ul>

    <div class="cta-section">
      <a href="/fr/generateur" class="btn-primary">👉 Générer une lettre d''immigration structurée avec iD0c</a>
    </div>
  </div>',
  'Modèles de lettres d''immigration (Global) : Canada, USA, UK, Schengen & Australie | iD0c',
  'Modèles de lettres d''immigration structurés pour le Canada (IRCC), USA (USCIS), UK (UKVI), Schengen et Australie. Formats clairs, ton factuel, structures prêtes à l''emploi.',
  'Immigration Letter Templates (Global): Canada, USA, UK, Schengen & Australia',
  'This hub provides structured templates for the most common immigration letters across multiple countries.',
  '<div class="immigration-hub">
    <h1>Immigration Letter Templates (Global)</h1>
    <p>This hub provides structured templates for the most common immigration letters across multiple countries. Each template focuses on clarity, consistency, and administrative expectations.</p>

    <div class="callout callout-info">
      <p><strong>Important:</strong> iD0c is a document automation platform. It does not provide legal advice and does not replace a lawyer or licensed consultant.</p>
    </div>

    <h2>Available countries and templates</h2>
    <ul>
      <li>Canada (IRCC): explanation letters, study permits, proof of funds</li>
      <li>United States (USCIS): cover letters, F-1 intent, refusal explanations</li>
      <li>United Kingdom (UKVI): visa cover letters, financial explanations</li>
      <li>Schengen / France: motivation letters, accommodation letters</li>
      <li>Australia: Genuine Temporary Entrant (GTE) statements</li>
    </ul>

    <div class="cta-section">
      <a href="/en/generator" class="btn-primary">👉 Generate a structured immigration letter with iD0c</a>
    </div>
  </div>',
  'Immigration Letter Templates (Global): Canada, USA, UK, Schengen & Australia | iD0c',
  'Structured immigration letter templates for Canada (IRCC), USA (USCIS), UK (UKVI), Schengen and Australia. Clear formats, factual tone, ready-to-use structures.',
  'immigration',
  '👉 Générer une lettre d''immigration avec iD0c',
  '👉 Generate an immigration letter with iD0c',
  '/en/generator',
  ARRAY['immigration', 'visa', 'letter templates', 'IRCC', 'USCIS', 'UKVI', 'Schengen', 'Australia', 'cover letter', 'motivation letter'],
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Insert USCIS Cover Letter article
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  meta_title,
  meta_description,
  category,
  tags,
  is_published,
  published_at,
  created_at
) VALUES (
  '/en-us/blog/uscis-cover-letter-template',
  'USCIS Cover Letter Template: What to Include and How to Structure It',
  'A clear USCIS cover letter template explaining how to organize forms, supporting documents, and explanations for an application.',
  '<div class="blog-article">
    <h1>USCIS Cover Letter Template: What to Include and How to Structure It</h1>
    <p>A USCIS cover letter helps officers quickly understand the content of an application. It lists forms, supporting documents, and any brief clarifications in a structured manner.</p>
    <h2>Essential Components of a USCIS Cover Letter</h2>
    <ol>
      <li><strong>Applicant identification</strong> - Full name, date of birth, and case number if applicable</li>
      <li><strong>Type of petition or application</strong> - Clearly state the form number and purpose</li>
      <li><strong>List of forms included</strong> - Enumerate all completed forms by number and title</li>
      <li><strong>List of supporting documents</strong> - Provide an organized checklist of evidence</li>
      <li><strong>Brief explanations (if applicable)</strong> - Address any potential concerns proactively</li>
      <li><strong>Signature and date</strong> - Sign and date the letter formally</li>
    </ol>
    <div class="cta-section">
      <a href="/en-us/generator/uscis-cover-letter" class="btn-primary">👉 Generate a USCIS cover letter with iD0c</a>
    </div>
  </div>',
  'USCIS Cover Letter Template: What to Include | iD0c',
  'A clear USCIS cover letter template explaining how to organize forms, supporting documents, and explanations for an application.',
  'immigration',
  ARRAY['USCIS', 'cover letter', 'immigration', 'USA', 'visa application', 'petition'],
  true,
  now(),
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Insert F-1 Letter of Intent article
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  meta_title,
  meta_description,
  category,
  tags,
  is_published,
  published_at,
  created_at
) VALUES (
  '/en-us/blog/f1-letter-of-intent-template',
  'F-1 Student Visa Letter of Intent Template: Key Sections',
  'Learn how to structure an F-1 student visa letter of intent with clear sections and a factual tone.',
  '<div class="blog-article">
    <h1>F-1 Student Visa Letter of Intent Template: Key Sections</h1>
    <p>An F-1 letter of intent is a critical document for US student visa applications. It demonstrates your academic goals, temporary intent, and financial capacity to study in the United States.</p>
    <h2>Key Sections to Include</h2>
    <ol>
      <li><strong>Introduction and applicant background</strong> - Personal details and educational history</li>
      <li><strong>Academic history</strong> - Previous degrees, achievements, and relevant coursework</li>
      <li><strong>Program and institution choice</strong> - Why this specific program and university</li>
      <li><strong>Temporary intent and future plans</strong> - Clear statement of intent to return home</li>
      <li><strong>Financial overview</strong> - Proof of ability to cover tuition and living expenses</li>
      <li><strong>Conclusion</strong> - Respectful closing and contact information</li>
    </ol>
    <div class="cta-section">
      <a href="/en-us/generator/f1-letter-intent" class="btn-primary">👉 Create an F-1 letter of intent with iD0c</a>
    </div>
  </div>',
  'F-1 Student Visa Letter of Intent Template | iD0c',
  'Learn how to structure an F-1 student visa letter of intent with clear sections and a factual tone.',
  'immigration',
  ARRAY['F-1 visa', 'student visa', 'letter of intent', 'USA', 'study abroad', 'USCIS'],
  true,
  now(),
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Insert UK Visa Cover Letter article
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  meta_title,
  meta_description,
  category,
  tags,
  is_published,
  published_at,
  created_at
) VALUES (
  '/en-gb/blog/uk-visa-cover-letter-template',
  'UK Visa Cover Letter Template: How to Write a Clear Application Letter',
  'A practical UK visa cover letter template explaining structure, tone, and supporting documents.',
  '<div class="blog-article">
    <h1>UK Visa Cover Letter Template: How to Write a Clear Application Letter</h1>
    <p>A UK visa cover letter accompanies your application to UK Visas and Immigration (UKVI). It provides a clear overview of your application, supporting documents, and the purpose of your visit or stay.</p>
    <h2>Essential Components</h2>
    <ol>
      <li><strong>Applicant details</strong> - Full name, passport number, date of birth, and nationality</li>
      <li><strong>Type of visa requested</strong> - Specify the exact visa category you are applying for</li>
      <li><strong>Purpose of travel or stay</strong> - Clear explanation of why you are visiting the UK</li>
      <li><strong>Financial and accommodation summary</strong> - Proof of sufficient funds and where you will stay</li>
      <li><strong>List of supporting documents</strong> - Organized checklist of all evidence provided</li>
    </ol>
    <div class="cta-section">
      <a href="/en-gb/generator/uk-visa-cover-letter" class="btn-primary">👉 Generate a UK visa cover letter with iD0c</a>
    </div>
  </div>',
  'UK Visa Cover Letter Template: How to Write It | iD0c',
  'A practical UK visa cover letter template explaining structure, tone, and supporting documents.',
  'immigration',
  ARRAY['UK visa', 'cover letter', 'UKVI', 'visa application', 'United Kingdom', 'immigration'],
  true,
  now(),
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Insert Schengen Motivation Letter article (French)
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  meta_title,
  meta_description,
  category,
  tags,
  is_published,
  published_at,
  created_at
) VALUES (
  '/fr/blog/modele-lettre-motivation-visa-schengen',
  'Modèle de lettre de motivation pour visa Schengen : structure recommandée',
  'Structure claire et éléments essentiels pour une lettre de motivation de visa Schengen.',
  '<div class="blog-article">
    <h1>Modèle de lettre de motivation pour visa Schengen : structure recommandée</h1>
    <p>Une lettre de motivation pour un visa Schengen doit présenter clairement l''objet de votre voyage, votre itinéraire, vos moyens financiers et votre engagement à respecter les conditions du visa.</p>
    <h2>Structure recommandée</h2>
    <ol>
      <li><strong>Objet et contexte du voyage</strong> - Expliquez pourquoi vous souhaitez visiter l''espace Schengen</li>
      <li><strong>Dates et itinéraire</strong> - Détaillez votre plan de voyage avec dates précises</li>
      <li><strong>Hébergement et ressources financières</strong> - Preuves de réservation et capacité financière</li>
      <li><strong>Engagement de retour</strong> - Démontrez vos liens avec votre pays d''origine</li>
      <li><strong>Conclusion</strong> - Formule de politesse et coordonnées</li>
    </ol>
    <div class="cta-section">
      <a href="/fr/generateur/visa-schengen" class="btn-primary">👉 Générer une lettre de motivation Schengen avec iD0c</a>
    </div>
  </div>',
  'Modèle lettre motivation visa Schengen | iD0c',
  'Structure claire et éléments essentiels pour une lettre de motivation de visa Schengen.',
  'immigration',
  ARRAY['visa Schengen', 'lettre de motivation', 'Europe', 'France', 'voyage', 'immigration'],
  true,
  now(),
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Insert Schengen Accommodation Letter article (French)
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  meta_title,
  meta_description,
  category,
  tags,
  is_published,
  published_at,
  created_at
) VALUES (
  '/fr/blog/modele-lettre-hebergement-visa',
  'Modèle de lettre d''hébergement pour visa : quoi inclure',
  'Lettre d''hébergement pour visa : structure, informations requises et bonnes pratiques.',
  '<div class="blog-article">
    <h1>Modèle de lettre d''hébergement pour visa : quoi inclure</h1>
    <p>Une lettre d''hébergement (ou attestation d''accueil) est souvent requise pour les demandes de visa. Elle certifie qu''une personne résidant dans le pays de destination s''engage à héberger le demandeur pendant son séjour.</p>
    <h2>Informations essentielles à inclure</h2>
    <ol>
      <li><strong>Identité de l''hébergeant</strong> - Nom complet, adresse, nationalité ou statut de résident</li>
      <li><strong>Adresse et durée d''hébergement</strong> - Adresse exacte et dates du séjour prévu</li>
      <li><strong>Lien avec le demandeur</strong> - Nature de la relation (famille, ami, professionnel)</li>
      <li><strong>Signature et date</strong> - Signature manuscrite de l''hébergeant et date de rédaction</li>
    </ol>
    <div class="cta-section">
      <a href="/fr/generateur/lettre-hebergement" class="btn-primary">👉 Générer une lettre d''hébergement avec iD0c</a>
    </div>
  </div>',
  'Modèle lettre d''hébergement visa | iD0c',
  'Lettre d''hébergement pour visa : structure, informations requises et bonnes pratiques.',
  'immigration',
  ARRAY['lettre hébergement', 'attestation accueil', 'visa', 'France', 'Schengen', 'immigration'],
  true,
  now(),
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Insert Australian GTE Statement article
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  meta_title,
  meta_description,
  category,
  tags,
  is_published,
  published_at,
  created_at
) VALUES (
  '/en-au/blog/gte-statement-template',
  'Genuine Temporary Entrant (GTE) Statement Template: How to Structure It',
  'A clear template for an Australian Genuine Temporary Entrant (GTE) statement.',
  '<div class="blog-article">
    <h1>Genuine Temporary Entrant (GTE) Statement Template: How to Structure It</h1>
    <p>The Genuine Temporary Entrant (GTE) statement is a critical requirement for Australian student visa applications. It demonstrates that you genuinely intend to stay in Australia temporarily for study purposes only.</p>
    <h2>Key Sections of a GTE Statement</h2>
    <ol>
      <li><strong>Personal background</strong> - Your educational and professional history, family circumstances</li>
      <li><strong>Study plan in Australia</strong> - Why this course, institution, and Australia specifically</li>
      <li><strong>Ties to home country</strong> - Family, employment, property, or other connections demonstrating intent to return</li>
      <li><strong>Financial capacity</strong> - Ability to cover tuition, living expenses, and dependents if applicable</li>
      <li><strong>Post-study intentions</strong> - How this qualification will benefit your career in your home country</li>
    </ol>
    <div class="cta-section">
      <a href="/en-au/generator/gte-statement" class="btn-primary">👉 Generate a GTE statement with iD0c</a>
    </div>
  </div>',
  'GTE Statement Template Australia | iD0c',
  'A clear template for an Australian Genuine Temporary Entrant (GTE) statement.',
  'immigration',
  ARRAY['GTE', 'Genuine Temporary Entrant', 'Australia', 'student visa', 'study abroad', 'visa statement'],
  true,
  now(),
  now()
) ON CONFLICT (slug) DO NOTHING;