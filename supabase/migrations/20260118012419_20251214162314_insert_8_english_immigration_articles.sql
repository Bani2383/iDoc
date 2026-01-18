/*
  # Insert 8 English Immigration Articles

  1. Content
    - 8 complete English articles about immigration letter templates
    - IRCC explanation letters, study permits, proof of funds, financial support
    - Study gap, cohabitation, corrections, travel history
    - Each article includes full HTML content with proper structure
    - SEO optimized with meta titles and descriptions
    - CTAs preserved for conversion optimization

  2. SEO Strategy
    - Target keywords: immigration letter templates, IRCC, study permit, explanation letter
    - Structured content with clear headings and lists
    - Internal linking to document generator
    - FAQ-style content for featured snippets
*/

-- Article 1: IRCC Explanation Letter Template
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  category,
  tags,
  meta_title,
  meta_description,
  is_published,
  published_at
)
VALUES (
  'ircc-explanation-letter-template-simple-effective-structure',
  'IRCC Explanation Letter Template: A Simple and Effective Structure',
  'A practical structure for an IRCC explanation letter: essential sections, tone, and common mistakes to avoid.',
  '<p>An explanation letter is commonly used to clarify a file element: a study or work gap, a change in background, financial context, or a specific concern raised by the officer. A strong template is not a generic text—it is a structure that helps you be clear, factual, and consistent.</p>

<h2>When should you use an explanation letter?</h2>
<ul>
<li>Study or employment interruption</li>
<li>Change of program, institution, or country</li>
<li>Date or document inconsistencies</li>
<li>Large deposits or transfers in bank statements</li>
<li>Responding to a concern referenced by IRCC</li>
</ul>

<h2>Recommended structure (template)</h2>
<ol>
<li><strong>Header</strong><br>Full name, date of birth (if relevant), application number (if applicable), date, recipient (IRCC).</li>
<li><strong>Subject line</strong><br>Example: "Explanation Letter – [application type]".</li>
<li><strong>Introduction</strong><br>Who you are and why you are writing.</li>
<li><strong>Facts (timeline)</strong><br>Specific dates, events, transitions.</li>
<li><strong>Explanation / clarification</strong><br>Objective, coherent, and verifiable reasons.</li>
<li><strong>Supporting documents</strong><br>List the attached documents and what they demonstrate.</li>
<li><strong>Conclusion</strong><br>Short summary and polite closing.</li>
<li><strong>Signature</strong><br>Full name and contact details.</li>
</ol>

<h2>Tone and style</h2>
<ul>
<li>Professional and neutral tone</li>
<li>Short factual sentences</li>
<li>No contradictions with evidence</li>
<li>Avoid emotional or defensive language</li>
</ul>

<div class="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
<p class="font-semibold text-blue-900">Legal Compliance</p>
<p class="text-blue-800">iD0c is a document automation platform. It does not provide legal advice and does not replace a lawyer or licensed consultant.</p>
</div>

<p><a href="#" class="text-blue-600 font-semibold hover:underline">Generate a structured explanation letter with iD0c →</a></p>',
  'Immigration',
  ARRAY['IRCC', 'explanation letter', 'immigration', 'Canada', 'template', 'study permit'],
  'IRCC Explanation Letter Template: A Simple and Effective Structure | iD0c',
  'A practical structure for an IRCC explanation letter: essential sections, tone, and common mistakes to avoid.',
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Article 2: Study Permit Letter of Intent
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  category,
  tags,
  meta_title,
  meta_description,
  is_published,
  published_at
)
VALUES (
  'study-permit-letter-of-intent-template-essential-sections',
  'Study Permit Letter of Intent Template: Essential Sections',
  'A practical study permit letter of intent template: key sections, common pitfalls, and writing guidance for Canada.',
  '<p>A strong letter of intent explains your study plan, the logic of your background, and your intention to comply with temporary stay conditions. A useful template helps you present your file in a credible and structured way.</p>

<h2>Template (recommended outline)</h2>
<ol>
<li><strong>Introduction</strong><br>Identity, application type, brief context.</li>
<li><strong>Academic and professional background</strong><br>Timeline and logic behind choices.</li>
<li><strong>Program and institution choice</strong><br>Why this program, why this institution.</li>
<li><strong>Connection to your objectives</strong><br>How the program fits your plan.</li>
<li><strong>Financial capacity (summary)</strong><br>Sources of funds and spending logic (consistent with evidence).</li>
<li><strong>Post-study plan</strong><br>Clear and realistic plan after studies.</li>
<li><strong>Conclusion</strong><br>Short summary and polite closing.</li>
</ol>

<h2>Common mistakes</h2>
<ul>
<li>Using a generic copy-paste letter</li>
<li>Not explaining study gaps or timeline issues</li>
<li>Unrealistic statements that conflict with evidence</li>
<li>Financial claims not aligned with bank statements</li>
</ul>

<h2>What IRCC evaluates</h2>
<p>Officers assess whether your plan is coherent, realistic, and supported by your background and evidence. A strong letter demonstrates logical progression and genuine intent.</p>

<div class="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
<p class="font-semibold text-blue-900">Legal Compliance</p>
<p class="text-blue-800">iD0c is a document automation platform and does not replace a licensed immigration consultant or lawyer.</p>
</div>

<p><a href="#" class="text-blue-600 font-semibold hover:underline">Create your Study Permit Letter of Intent PDF with iD0c →</a></p>',
  'Immigration',
  ARRAY['study permit', 'letter of intent', 'Canada', 'IRCC', 'student visa', 'template'],
  'Study Permit Letter of Intent Template: Essential Sections | iD0c',
  'A practical study permit letter of intent template: key sections, common pitfalls, and writing guidance for Canada.',
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Article 3: Proof of Funds Explanation Letter
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  category,
  tags,
  meta_title,
  meta_description,
  is_published,
  published_at
)
VALUES (
  'proof-of-funds-explanation-letter-template-ircc-what-to-include',
  'Proof of Funds Explanation Letter Template (IRCC): What to Include',
  'How to explain your funds to IRCC: structure, what to detail, and which documents to reference.',
  '<p>When proof of funds includes large deposits, transfers, or multiple sources, an explanation letter can clarify the origin and availability of the amounts.</p>

<h2>What the letter should demonstrate</h2>
<ul>
<li>Source of funds (salary, savings, family support, sale, scholarship, etc.)</li>
<li>Traceability (dates, amounts, accounts involved)</li>
<li>Actual availability (access, restrictions, conditions)</li>
<li>Consistency with expenses (tuition, housing, transportation)</li>
</ul>

<h2>Template (structure)</h2>
<ol>
<li><strong>Subject:</strong> Proof of Funds Explanation – [application type]</li>
<li><strong>Summary of available funds</strong> (total amount and currency)</li>
<li><strong>Breakdown by source</strong> (table recommended: source / amount / date / evidence)</li>
<li><strong>Explanation of unusual deposits</strong> (if applicable)</li>
<li><strong>Link to supporting documents</strong> (statements, letters, contracts, scholarships)</li>
<li><strong>Conclusion</strong></li>
</ol>

<h2>Example breakdown table</h2>
<table class="w-full my-4 border-collapse border border-gray-300">
<thead>
<tr class="bg-gray-100">
<th class="border border-gray-300 p-2">Source</th>
<th class="border border-gray-300 p-2">Amount (CAD)</th>
<th class="border border-gray-300 p-2">Date</th>
<th class="border border-gray-300 p-2">Evidence</th>
</tr>
</thead>
<tbody>
<tr>
<td class="border border-gray-300 p-2">Personal savings</td>
<td class="border border-gray-300 p-2">$15,000</td>
<td class="border border-gray-300 p-2">Jan 2024</td>
<td class="border border-gray-300 p-2">Bank statement</td>
</tr>
<tr>
<td class="border border-gray-300 p-2">Parent support</td>
<td class="border border-gray-300 p-2">$25,000</td>
<td class="border border-gray-300 p-2">Feb 2024</td>
<td class="border border-gray-300 p-2">Support letter + statements</td>
</tr>
</tbody>
</table>

<div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-6">
<p class="font-semibold text-yellow-900">Important</p>
<p class="text-yellow-800">Avoid unverifiable claims: IRCC assesses consistency between your letter and your evidence.</p>
</div>

<p><a href="#" class="text-blue-600 font-semibold hover:underline">Generate a proof of funds explanation letter with iD0c →</a></p>',
  'Immigration',
  ARRAY['proof of funds', 'IRCC', 'financial evidence', 'explanation letter', 'Canada immigration'],
  'Proof of Funds Explanation Letter Template (IRCC): What to Include | iD0c',
  'How to explain your funds to IRCC: structure, what to detail, and which documents to reference.',
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Article 4: Parents' Financial Support Letter
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  category,
  tags,
  meta_title,
  meta_description,
  is_published,
  published_at
)
VALUES (
  'parents-financial-support-letter-template-study-immigration',
  'Parents'' Financial Support Letter Template (Study/Immigration)',
  'A practical parents'' financial support letter template: what to include, how to structure it, and what evidence to attach.',
  '<p>When a parent or family member supports the applicant financially, a support letter can clarify the relationship, the commitment, and the sponsor''s financial capacity.</p>

<h2>Template (structure)</h2>
<ol>
<li><strong>Sponsor identification</strong><br>Full name, address, employment, relationship to the applicant.</li>
<li><strong>Subject:</strong> Financial Support Letter</li>
<li><strong>Commitment</strong><br>Amounts, duration of support, expenses covered (tuition, housing, etc.).</li>
<li><strong>Financial capacity</strong><br>Short summary and reference to evidence.</li>
<li><strong>Attachments</strong><br>Bank statements, proof of income, employment letter, tax documents (as available).</li>
<li><strong>Conclusion and signature</strong></li>
</ol>

<h2>What to include in the commitment section</h2>
<ul>
<li>Specific amount or range of support</li>
<li>Duration (e.g., "for the duration of studies")</li>
<li>Purpose (tuition, living expenses, housing)</li>
<li>Method of transfer or payment</li>
</ul>

<h2>Supporting evidence</h2>
<p>The letter should be consistent with the financial evidence provided:</p>
<ul>
<li>Bank statements showing available funds</li>
<li>Proof of income (employment letter, pay stubs)</li>
<li>Tax returns or assessments</li>
<li>Property ownership documents (if relevant)</li>
</ul>

<div class="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
<p class="font-semibold text-blue-900">Consistency is Key</p>
<p class="text-blue-800">The letter should be consistent with the financial evidence provided (amounts, dates, accounts).</p>
</div>

<p><a href="#" class="text-blue-600 font-semibold hover:underline">Create a financial support letter PDF with iD0c →</a></p>',
  'Immigration',
  ARRAY['financial support letter', 'parents support', 'sponsor letter', 'study permit', 'IRCC'],
  'Parents'' Financial Support Letter Template (Study/Immigration) | iD0c',
  'A practical parents'' financial support letter template: what to include, how to structure it, and what evidence to attach.',
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Article 5: Study Gap Explanation Letter
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  category,
  tags,
  meta_title,
  meta_description,
  is_published,
  published_at
)
VALUES (
  'study-gap-explanation-letter-template-immigration-how-to-write',
  'Study Gap Explanation Letter Template (Immigration): How to Write Clearly',
  'How to explain a study gap: timeline structure, what to say, and supporting documents to strengthen credibility.',
  '<p>A study interruption is not necessarily an issue, but it should be explained clearly. The goal is to present a complete and coherent timeline, supported by documents when possible.</p>

<h2>Template (structure)</h2>
<ol>
<li><strong>Subject:</strong> Study Gap Explanation Letter</li>
<li><strong>Timeline</strong><br>Start/end study dates and gap period.</li>
<li><strong>Main reason</strong><br>Factual explanation (health, finances, family obligations, work, etc.).</li>
<li><strong>Activities during the gap</strong><br>Employment, training, responsibilities, steps taken.</li>
<li><strong>Current situation</strong><br>Return to studies and coherence of the plan.</li>
<li><strong>Supporting documents</strong><br>Work contracts, attestations, records, etc.</li>
<li><strong>Conclusion</strong></li>
</ol>

<h2>Common reasons for study gaps</h2>
<ul>
<li><strong>Financial reasons:</strong> Need to work and save for education</li>
<li><strong>Health reasons:</strong> Medical treatment or recovery period</li>
<li><strong>Family obligations:</strong> Caring for family members</li>
<li><strong>Professional development:</strong> Gaining work experience</li>
<li><strong>Personal circumstances:</strong> Other legitimate reasons</li>
</ul>

<h2>How to strengthen your explanation</h2>
<p>Support your explanation with concrete evidence:</p>
<ul>
<li>Employment letters or contracts</li>
<li>Medical certificates (if health-related)</li>
<li>Training or certification documents</li>
<li>Bank statements showing savings accumulation</li>
<li>Letters from employers or institutions</li>
</ul>

<div class="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
<p class="font-semibold text-blue-900">Be Factual and Coherent</p>
<p class="text-blue-800">Focus on presenting a complete timeline with verifiable information. Avoid vague statements.</p>
</div>

<p><a href="#" class="text-blue-600 font-semibold hover:underline">Generate a study gap explanation letter with iD0c →</a></p>',
  'Immigration',
  ARRAY['study gap', 'explanation letter', 'education gap', 'IRCC', 'study permit', 'Canada'],
  'Study Gap Explanation Letter Template (Immigration): How to Write Clearly | iD0c',
  'How to explain a study gap: timeline structure, what to say, and supporting documents to strengthen credibility.',
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Article 6: Cohabitation Declaration Letter
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  category,
  tags,
  meta_title,
  meta_description,
  is_published,
  published_at
)
VALUES (
  'cohabitation-declaration-letter-template-immigration-what-to-include',
  'Cohabitation Declaration Letter Template (Immigration): What to Include',
  'Cohabitation declaration letter: essential elements, structure, possible supporting evidence, and recommended tone.',
  '<p>A cohabitation declaration letter presents facts (shared address, period, circumstances) in a formal way. The content should remain factual and consistent with evidence (lease, bills, correspondence).</p>

<h2>Template (structure)</h2>
<ol>
<li><strong>Identification</strong><br>Full names, dates of birth (if relevant), addresses.</li>
<li><strong>Subject:</strong> Cohabitation Declaration</li>
<li><strong>Facts</strong><br>Shared address, start date, continuity (or periods).</li>
<li><strong>Evidence</strong><br>Lease, bills, mail, accounts, etc.</li>
<li><strong>Declaration</strong><br>Statement that information is accurate.</li>
<li><strong>Date and signatures</strong></li>
</ol>

<h2>Supporting evidence examples</h2>
<ul>
<li>Joint lease agreement or both names on lease</li>
<li>Utility bills in one or both names</li>
<li>Bank statements showing shared address</li>
<li>Government correspondence (tax notices, IDs)</li>
<li>Joint bank accounts or credit cards</li>
<li>Insurance policies listing both parties</li>
<li>Photos showing shared living space</li>
</ul>

<h2>Important considerations</h2>
<p>When preparing a cohabitation declaration:</p>
<ul>
<li>Be precise with dates (start date, any interruptions)</li>
<li>List all addresses if you moved together</li>
<li>Ensure evidence covers the entire period claimed</li>
<li>Both parties should sign the declaration</li>
<li>Include current contact information</li>
</ul>

<div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-6">
<p class="font-semibold text-yellow-900">Precision Matters</p>
<p class="text-yellow-800">Avoid vague wording: a precise timeline strengthens credibility.</p>
</div>

<p><a href="#" class="text-blue-600 font-semibold hover:underline">Generate a cohabitation declaration letter with iD0c →</a></p>',
  'Immigration',
  ARRAY['cohabitation declaration', 'common-law', 'IRCC', 'relationship proof', 'immigration Canada'],
  'Cohabitation Declaration Letter Template (Immigration): What to Include | iD0c',
  'Cohabitation declaration letter: essential elements, structure, possible supporting evidence, and recommended tone.',
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Article 7: IRCC Correction Letter
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  category,
  tags,
  meta_title,
  meta_description,
  is_published,
  published_at
)
VALUES (
  'ircc-correction-letter-template-rectify-error-clearly',
  'IRCC Correction Letter Template: How to Rectify an Error Clearly',
  'Correction letter for IRCC: how to present the error, the corrected information, and the supporting evidence.',
  '<p>If incorrect information was submitted (date, employer, period, document), a correction letter can explain the mistake, provide the exact correction, and maintain consistency across the application.</p>

<h2>Template (structure)</h2>
<ol>
<li><strong>Subject:</strong> Information Correction – [application type / file number]</li>
<li><strong>Original information</strong><br>What was submitted (reference the form/document).</li>
<li><strong>Correction</strong><br>Correct information (including effective date).</li>
<li><strong>Explanation</strong><br>Factual reason the error occurred (brief).</li>
<li><strong>Supporting documents</strong><br>Evidence confirming the correction.</li>
<li><strong>Conclusion</strong><br>Request that IRCC consider the correction.</li>
</ol>

<h2>Common types of corrections</h2>
<ul>
<li><strong>Date errors:</strong> Incorrect start/end dates for employment or studies</li>
<li><strong>Personal information:</strong> Misspelled names, wrong birth dates</li>
<li><strong>Employment details:</strong> Wrong employer name, job title, or location</li>
<li><strong>Educational information:</strong> Incorrect institution, program, or graduation date</li>
<li><strong>Address history:</strong> Missing or incorrect addresses</li>
<li><strong>Travel history:</strong> Incorrect entry/exit dates or destinations</li>
</ul>

<h2>How to write an effective correction letter</h2>
<ul>
<li>Be direct and specific about the error</li>
<li>Provide the exact correction with dates</li>
<li>Keep the explanation brief and factual</li>
<li>Attach supporting documents proving the correction</li>
<li>Reference the specific form or section where the error appears</li>
<li>Maintain a professional and neutral tone</li>
</ul>

<div class="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
<p class="font-semibold text-blue-900">Keep It Concise</p>
<p class="text-blue-800">The goal is to correct clearly and preserve overall consistency. Don''t over-explain simple errors.</p>
</div>

<p><a href="#" class="text-blue-600 font-semibold hover:underline">Generate an IRCC correction letter with iD0c →</a></p>',
  'Immigration',
  ARRAY['IRCC correction', 'error correction', 'immigration correction', 'rectification letter', 'Canada'],
  'IRCC Correction Letter Template: How to Rectify an Error Clearly | iD0c',
  'Correction letter for IRCC: how to present the error, the corrected information, and the supporting evidence.',
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;

-- Article 8: Travel History Explanation Letter
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content_html,
  category,
  tags,
  meta_title,
  meta_description,
  is_published,
  published_at
)
VALUES (
  'travel-history-explanation-letter-template-ircc-clear-timeline',
  'Travel History Explanation Letter Template (IRCC): A Clear Timeline Approach',
  'Travel history explanation letter: when to use it, timeline structure, and how to reference visas, stamps, and tickets.',
  '<p>When travel history is extensive, involves frequent trips, or appears inconsistent, a short explanation letter can clarify the timeline and reduce misunderstandings.</p>

<h2>When to use a travel history explanation letter</h2>
<ul>
<li>Extensive travel to multiple countries</li>
<li>Frequent trips to the same country</li>
<li>Long stays abroad that need context</li>
<li>Missing stamps or unclear passport entries</li>
<li>Travel for work, study, or family reasons</li>
<li>Gaps in travel documentation</li>
</ul>

<h2>Template (structure)</h2>
<ol>
<li><strong>Subject:</strong> Travel History Explanation Letter</li>
<li><strong>Chronology table (recommended)</strong><br>Country / entry date / exit date / purpose / evidence.</li>
<li><strong>Clarifications</strong><br>Long stays, visas, repeated entries, etc.</li>
<li><strong>Supporting documents</strong><br>Visa copies, stamps, tickets, bookings, attestations.</li>
<li><strong>Conclusion</strong></li>
</ol>

<h2>Example travel history table</h2>
<table class="w-full my-4 border-collapse border border-gray-300">
<thead>
<tr class="bg-gray-100">
<th class="border border-gray-300 p-2">Country</th>
<th class="border border-gray-300 p-2">Entry Date</th>
<th class="border border-gray-300 p-2">Exit Date</th>
<th class="border border-gray-300 p-2">Purpose</th>
<th class="border border-gray-300 p-2">Evidence</th>
</tr>
</thead>
<tbody>
<tr>
<td class="border border-gray-300 p-2">USA</td>
<td class="border border-gray-300 p-2">Jan 15, 2023</td>
<td class="border border-gray-300 p-2">Jan 22, 2023</td>
<td class="border border-gray-300 p-2">Business conference</td>
<td class="border border-gray-300 p-2">Conference invitation, flight tickets</td>
</tr>
<tr>
<td class="border border-gray-300 p-2">UK</td>
<td class="border border-gray-300 p-2">Mar 10, 2023</td>
<td class="border border-gray-300 p-2">Mar 20, 2023</td>
<td class="border border-gray-300 p-2">Family visit</td>
<td class="border border-gray-300 p-2">Passport stamps, booking confirmation</td>
</tr>
</tbody>
</table>

<h2>Tips for organizing travel history</h2>
<ul>
<li>List trips in chronological order</li>
<li>Include all countries visited (even short stays)</li>
<li>Specify purpose for each trip</li>
<li>Reference supporting documents for each entry</li>
<li>Explain any long stays or frequent travel patterns</li>
<li>Note any visa types obtained</li>
</ul>

<div class="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
<p class="font-semibold text-blue-900">Clarity and Completeness</p>
<p class="text-blue-800">A well-organized travel history table makes it easy for officers to verify your movements and understand your travel patterns.</p>
</div>

<p><a href="#" class="text-blue-600 font-semibold hover:underline">Generate a travel history explanation letter with iD0c →</a></p>',
  'Immigration',
  ARRAY['travel history', 'IRCC', 'explanation letter', 'passport stamps', 'immigration Canada'],
  'Travel History Explanation Letter Template (IRCC): A Clear Timeline Approach | iD0c',
  'Travel history explanation letter: when to use it, timeline structure, and how to reference visas, stamps, and tickets.',
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;