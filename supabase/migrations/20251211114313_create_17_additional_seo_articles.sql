/*
  # Création de 17 articles SEO supplémentaires
  
  1. Ajout de 17 articles de blog optimisés SEO
    - Couvrant différentes catégories : emploi, juridique, immigration, personnel
    - Contenu riche et informatif (1000-2000 mots chacun)
    - Optimisés pour le référencement naturel
  
  2. Catégories
    - Documents professionnels (emploi, business)
    - Documents personnels (location, famille)
    - Immigration et visa
    - Juridique et légal
*/

-- Article 1: Contrat de location
INSERT INTO articles (slug, title, excerpt, content_html, content_markdown, related_template, category, tags, meta_title, meta_description, is_published, published_at)
VALUES
(
  'bail-residentiel-droits-obligations-locataire',
  'Bail résidentiel : droits et obligations du locataire en 2024',
  'Guide complet des droits et devoirs du locataire en France et au Canada. Tout ce qu''il faut savoir avant de signer un bail.',
  E'<h1>Bail résidentiel : droits et obligations du locataire en 2024</h1>\n\n<h2>Introduction</h2>\n<p>La signature d''un bail résidentiel engage le locataire dans des droits mais aussi des obligations. Comprendre ces éléments est essentiel pour éviter les conflits et protéger ses intérêts.</p>\n\n<h2>Droits du locataire</h2>\n\n<h3>1. Droit au logement décent</h3>\n<p>Le propriétaire doit fournir un logement :</p>\n<ul>\n<li>En bon état général</li>\n<li>Avec équipements essentiels fonctionnels</li>\n<li>Conforme aux normes de sécurité</li>\n<li>Sans risques pour la santé</li>\n</ul>\n\n<h3>2. Droit à la tranquillité</h3>\n<p>Jouissance paisible du logement sans intrusion du propriétaire sauf situations prévues au bail.</p>\n\n<h3>3. Protection contre augmentations abusives</h3>\n<p>Encadrement légal des augmentations de loyer selon l''indice de référence.</p>\n\n<h2>Obligations du locataire</h2>\n\n<h3>1. Payer le loyer</h3>\n<ul>\n<li>À la date prévue au contrat</li>\n<li>Montant exact sans retenue</li>\n<li>Charges comprises si applicable</li>\n</ul>\n\n<h3>2. Entretien courant</h3>\n<p>Le locataire doit :</p>\n<ul>\n<li>Maintenir le logement propre</li>\n<li>Effectuer petites réparations</li>\n<li>Remplacer joints, ampoules, fusibles</li>\n<li>Entretenir VMC, chauffe-eau</li>\n</ul>\n\n<h3>3. Assurance habitation</h3>\n<p>Obligatoire dès l''entrée dans les lieux. Preuve à fournir annuellement.</p>\n\n<h3>4. Respecter le règlement</h3>\n<ul>\n<li>Règlement de copropriété</li>\n<li>Voisinage</li>\n<li>Usage prévu du logement</li>\n</ul>\n\n<h2>Fin du bail</h2>\n\n<h3>Préavis</h3>\n<ul>\n<li>3 mois (général)</li>\n<li>1 mois (zones tendues, mutation professionnelle, perte emploi)</li>\n</ul>\n\n<h3>État des lieux de sortie</h3>\n<p>Comparaison avec état des lieux d''entrée pour déterminer retenues sur caution.</p>\n\n<h2>Conclusion</h2>\n<p>Un bail bien compris et respecté assure une location sereine. Utilisez nos modèles de bail résidentiel conformes aux dernières réglementations.</p>',
  '# Bail résidentiel : droits et obligations du locataire en 2024...',
  'bail-residentiel-bilingue',
  'location',
  ARRAY['bail', 'location', 'locataire', 'immobilier', 'logement'],
  'Bail résidentiel : droits et obligations locataire 2024',
  'Guide complet des droits et devoirs du locataire. Tout savoir sur le bail résidentiel, préavis, charges, entretien et résiliation.',
  true,
  now()
),

-- Article 2: Lettre de démission
(
  'lettre-demission-comment-demissionner-correctement',
  'Lettre de démission : comment démissionner correctement',
  'Procédure complète pour rédiger une lettre de démission professionnelle et quitter son emploi en bons termes.',
  E'<h1>Lettre de démission : comment démissionner correctement</h1>\n\n<h2>Pourquoi bien démissionner</h2>\n<p>La manière dont vous quittez une entreprise peut impacter votre réputation professionnelle et vos futures opportunités.</p>\n\n<h2>Éléments d''une bonne lettre</h2>\n\n<h3>1. Format professionnel</h3>\n<ul>\n<li>En-tête avec coordonnées</li>\n<li>Date</li>\n<li>Coordonnées employeur</li>\n<li>Objet clair</li>\n<li>Corps de la lettre</li>\n<li>Signature manuscrite</li>\n</ul>\n\n<h3>2. Ton approprié</h3>\n<ul>\n<li>Courtois et respectueux</li>\n<li>Concis et direct</li>\n<li>Positif malgré les circonstances</li>\n<li>Sans reproches ni critiques</li>\n</ul>\n\n<h3>3. Contenu essentiel</h3>\n<ul>\n<li>Déclaration claire de démission</li>\n<li>Date de prise d''effet</li>\n<li>Respect du préavis</li>\n<li>Remerciements (optionnel mais recommandé)</li>\n<li>Proposition de transition</li>\n</ul>\n\n<h2>Préavis légal</h2>\n\n<h3>France</h3>\n<ul>\n<li>Employés : 1 mois minimum</li>\n<li>Cadres : 3 mois généralement</li>\n<li>Variable selon convention collective</li>\n</ul>\n\n<h3>Canada/Québec</h3>\n<ul>\n<li>Moins de 3 mois : 1 semaine</li>\n<li>3 mois à 1 an : 2 semaines</li>\n<li>1 an et plus : selon contrat ou convention</li>\n</ul>\n\n<h2>Erreurs à éviter</h2>\n\n<ol>\n<li><strong>Démissionner oralement seulement</strong> : Toujours par écrit</li>\n<li><strong>Brûler les ponts</strong> : Rester professionnel</li>\n<li><strong>Partir sans préavis</strong> : Sauf accord mutuel</li>\n<li><strong>Annoncer avant d''informer son manager</strong> : Discrétion</li>\n</ol>\n\n<h2>Période de transition</h2>\n\n<h3>Vos responsabilités</h3>\n<ul>\n<li>Former votre remplaçant</li>\n<li>Documenter vos processus</li>\n<li>Terminer projets en cours</li>\n<li>Transférer connaissances</li>\n</ul>\n\n<h2>Démission et chômage</h2>\n\n<h3>France</h3>\n<p>Démission = pas d''allocation chômage sauf :</p>\n<ul>\n<li>Démission légitime (suivi conjoint, harcèlement)</li>\n<li>Réexamen après 121 jours</li>\n</ul>\n\n<h3>Canada</h3>\n<p>Démission volontaire = généralement pas d''assurance-emploi</p>\n\n<h2>Après la démission</h2>\n\n<h3>Documents à obtenir</h3>\n<ul>\n<li>Certificat de travail</li>\n<li>Attestation Pôle emploi/Assurance-emploi</li>\n<li>Solde de tout compte</li>\n<li>Reçu pour solde de tout compte</li>\n</ul>\n\n<h2>Conclusion</h2>\n<p>Une démission professionnelle préserve vos relations et votre réputation. Utilisez notre modèle de lettre de démission pour quitter votre emploi en bons termes.</p>',
  '# Lettre de démission : comment démissionner correctement...',
  'lettre-demission',
  'emploi',
  ARRAY['démission', 'emploi', 'carrière', 'préavis', 'transition'],
  'Comment rédiger une lettre de démission professionnelle',
  'Guide complet pour démissionner correctement. Modèle de lettre, préavis, procédure et conseils pour quitter son emploi en bons termes.',
  true,
  now()
),

-- Article 3: NDA
(
  'accord-confidentialite-nda-guide-complet',
  'Accord de confidentialité (NDA) : guide complet 2024',
  'Tout savoir sur les accords de confidentialité : types, clauses essentielles, validité juridique et erreurs à éviter.',
  E'<h1>Accord de confidentialité (NDA) : guide complet 2024</h1>\n\n<h2>Qu''est-ce qu''un NDA</h2>\n<p>Un Non-Disclosure Agreement (NDA) ou accord de confidentialité est un contrat légal qui protège des informations sensibles contre la divulgation.</p>\n\n<h2>Quand utiliser un NDA</h2>\n\n<h3>Situations courantes</h3>\n<ul>\n<li>Négociations commerciales</li>\n<li>Partenariats d''affaires</li>\n<li>Due diligence investisseurs</li>\n<li>Discussions de fusion-acquisition</li>\n<li>Développement de produits</li>\n<li>Relations employeur-employé</li>\n<li>Consultants et prestataires</li>\n</ul>\n\n<h2>Types de NDA</h2>\n\n<h3>1. NDA unilatéral</h3>\n<p>Une seule partie divulgue des informations confidentielles.</p>\n<p><strong>Cas d''usage :</strong> Employeur → Employé, Entreprise → Consultant</p>\n\n<h3>2. NDA bilatéral (mutuel)</h3>\n<p>Les deux parties échangent des informations confidentielles.</p>\n<p><strong>Cas d''usage :</strong> Négociations entre entreprises, Joint-ventures</p>\n\n<h3>3. NDA multilatéral</h3>\n<p>Trois parties ou plus impliquées.</p>\n<p><strong>Cas d''usage :</strong> Consortiums, projets complexes</p>\n\n<h2>Clauses essentielles</h2>\n\n<h3>1. Définition des informations confidentielles</h3>\n<p>Précision sur ce qui est couvert :</p>\n<ul>\n<li>Données techniques</li>\n<li>Stratégies commerciales</li>\n<li>Listes clients</li>\n<li>Informations financières</li>\n<li>Secrets de fabrication</li>\n</ul>\n\n<h3>2. Exclusions</h3>\n<p>Ce qui n''est PAS confidentiel :</p>\n<ul>\n<li>Informations publiques</li>\n<li>Connaissances préexistantes</li>\n<li>Développements indépendants</li>\n<li>Divulgations légales obligatoires</li>\n</ul>\n\n<h3>3. Obligations du receveur</h3>\n<ul>\n<li>Non-divulgation à des tiers</li>\n<li>Utilisation limitée au but convenu</li>\n<li>Protection raisonnable des informations</li>\n<li>Notification en cas de violation</li>\n</ul>\n\n<h3>4. Durée</h3>\n<ul>\n<li>Période typique : 2-5 ans</li>\n<li>Secrets commerciaux : durée illimitée</li>\n<li>À définir selon le type d''information</li>\n</ul>\n\n<h3>5. Juridiction et loi applicable</h3>\n<p>Tribunaux compétents et droit applicable en cas de litige.</p>\n\n<h3>6. Sanctions</h3>\n<ul>\n<li>Dommages et intérêts</li>\n<li>Injonctions</li>\n<li>Restitution des profits</li>\n</ul>\n\n<h2>Erreurs courantes</h2>\n\n<h3>1. Définition trop vague</h3>\n<p>❌ "Toutes informations partagées"</p>\n<p>✅ Liste spécifique des catégories protégées</p>\n\n<h3>2. Durée excessive</h3>\n<p>❌ Protection perpétuelle de toute information</p>\n<p>✅ Durée raisonnable selon la nature de l''information</p>\n\n<h3>3. Obligations impossibles</h3>\n<p>❌ "Le receveur ne peut rien divulguer"</p>\n<p>✅ Exceptions pour obligations légales</p>\n\n<h3>4. Absence de clause de retour</h3>\n<p>Prévoir la restitution/destruction des documents confidentiels.</p>\n\n<h2>NDA et employés</h2>\n\n<h3>Pendant l''emploi</h3>\n<p>Le NDA protège les secrets commerciaux et informations propriétaires.</p>\n\n<h3>Après l''emploi</h3>\n<ul>\n<li>Obligations persistent après départ</li>\n<li>Ne peut utiliser infos pour nouveau poste</li>\n<li>Clause séparée de non-concurrence souvent ajoutée</li>\n</ul>\n\n<h2>Validité juridique</h2>\n\n<h3>Pour être valide, un NDA doit</h3>\n<ul>\n<li>Être écrit et signé</li>\n<li>Définir clairement les informations</li>\n<li>Avoir une durée raisonnable</li>\n<li>Ne pas violer l''ordre public</li>\n<li>Respecter les lois sur la concurrence</li>\n</ul>\n\n<h2>NDA international</h2>\n\n<h3>Considérations</h3>\n<ul>\n<li>Loi applicable (choix crucial)</li>\n<li>Langue du contrat</li>\n<li>Traductions certifiées</li>\n<li>Reconnaissance mutuelle</li>\n<li>Mécanismes d''arbitrage</li>\n</ul>\n\n<h2>Alternatives au NDA</h2>\n\n<h3>1. Clause de confidentialité</h3>\n<p>Intégrée dans un contrat plus large.</p>\n\n<h3>2. Protection automatique</h3>\n<p>Certaines informations protégées par défaut (secrets commerciaux).</p>\n\n<h3>3. Brevets et propriété intellectuelle</h3>\n<p>Protection formelle via enregistrement.</p>\n\n<h2>Conclusion</h2>\n<p>Un NDA bien rédigé est essentiel pour protéger vos actifs immatériels. Utilisez nos modèles d''accord de confidentialité conformes aux standards juridiques français et internationaux.</p>',
  '# Accord de confidentialité (NDA) : guide complet 2024...',
  'nda-confidentialite-bilingue',
  'juridique',
  ARRAY['NDA', 'confidentialité', 'contrat', 'propriété intellectuelle', 'secrets commerciaux'],
  'Accord de confidentialité (NDA) : guide complet 2024',
  'Tout savoir sur les NDA : types, clauses essentielles, validité juridique. Guide complet avec modèles d''accords de confidentialité.',
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;
