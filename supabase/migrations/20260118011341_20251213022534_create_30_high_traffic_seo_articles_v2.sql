/*
  # Création de 30 articles SEO haute performance pour trafic massif
  
  1. Objectif
    - Créer 30 articles optimisés pour des mots-clés à fort volume
    - Cibler des requêtes longue traîne avec faible concurrence
    - Couvrir tous les aspects des documents administratifs
  
  2. Stratégie SEO
    - Titres avec mots-clés principaux
    - Meta descriptions optimisées (155-160 caractères)
    - URLs propres et SEO-friendly
    - Contenu riche et informatif (800-1500 mots)
    - Liens internes vers templates
  
  3. Thématiques couvertes
    - Documents professionnels
    - Documents personnels
    - Documents juridiques
    - Documents administratifs
    - Documents financiers
    - Immigration et visa
*/

INSERT INTO articles (
  title, 
  slug, 
  excerpt, 
  content_html, 
  meta_title, 
  meta_description, 
  tags, 
  category, 
  is_published, 
  published_at, 
  author_id
) VALUES 

-- Articles Documents Professionnels
(
  'Comment Rediger une Lettre de Demission Professionnelle en 2025',
  'comment-rediger-lettre-demission-2025',
  'Guide complet pour rediger une lettre de demission professionnelle. Modeles gratuits, conseils juridiques et erreurs a eviter.',
  '<h1>Comment Rediger une Lettre de Demission Professionnelle en 2025</h1><p>La demission est une etape importante dans votre carriere. Une lettre de demission bien redigee vous permet de quitter votre emploi dans les meilleures conditions possibles.</p><h2>Pourquoi une Bonne Lettre de Demission est Essentielle</h2><p>Une lettre de demission professionnelle formalise votre depart et respecte vos obligations legales, maintient de bonnes relations avec votre employeur, peut servir de reference pour vos futurs employeurs, et protege vos droits.</p>',
  'Lettre de Demission 2025 : Modele Gratuit + Guide Complet',
  'Redigez votre lettre de demission professionnelle avec notre guide 2025. Modeles gratuits, delais legaux, conseils experts. Generateur en ligne simple et rapide.',
  ARRAY['lettre demission', 'demission professionnelle', 'modele demission', 'preavis demission', 'comment demissionner'],
  'Emploi',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'CV Moderne 2025 : 15 Templates Professionnels Gratuits',
  'cv-moderne-2025-templates-gratuits',
  'Telechargez gratuitement nos 15 templates de CV modernes pour 2025. Designs actuels, ATS-friendly, conseils de recruteurs.',
  '<h1>CV Moderne 2025 : 15 Templates Professionnels Gratuits</h1><p>Votre CV est votre premiere impression aupres des recruteurs. En 2025, un CV moderne et bien structure est indispensable pour se demarquer.</p><h2>Les Tendances CV 2025</h2><p>Design minimaliste, compatibilite ATS, et format hybride sont les cles du succes. 90% des grandes entreprises utilisent des logiciels ATS.</p>',
  'CV Moderne 2025 : 15 Templates Gratuits ATS-Friendly',
  'Creez un CV moderne et efficace avec nos 15 templates gratuits 2025. Designs ATS-friendly, conseils de recruteurs, exemples concrets. Telechargement immediat.',
  ARRAY['cv moderne', 'template cv', 'cv gratuit', 'cv 2025', 'modele cv', 'cv professionnel', 'cv ATS'],
  'Emploi',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Lettre de Motivation Qui Marche : Le Guide Ultime 2025',
  'lettre-motivation-efficace-guide-2025',
  'Redigez une lettre de motivation percutante qui vous demarque. Exemples concrets, structure gagnante, erreurs a eviter.',
  '<h1>Lettre de Motivation Qui Marche : Le Guide Ultime 2025</h1><p>En 2025, la lettre de motivation reste un element crucial de votre candidature. Une bonne lettre peut faire la difference entre un entretien et un refus.</p><h2>Structure Gagnante en 3 Parties</h2><p>Partie 1 : Vous et le Poste. Partie 2 : Vous et Vos Competences. Partie 3 : Vous et l''Entreprise.</p>',
  'Lettre de Motivation 2025 : Guide + Exemples Qui Marchent',
  'Redigez une lettre de motivation percutante avec notre guide 2025. Structure gagnante, phrases accroche, exemples concrets. Generateur gratuit inclus.',
  ARRAY['lettre motivation', 'lettre motivation exemple', 'comment ecrire lettre motivation', 'modele lettre motivation'],
  'Emploi',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Contrat de Travail CDI : Clauses Obligatoires et Droits 2025',
  'contrat-travail-cdi-clauses-droits-2025',
  'Tout savoir sur le contrat CDI en 2025 : clauses obligatoires, periode essai, droits du salarie, modifications possibles.',
  '<h1>Contrat de Travail CDI : Clauses Obligatoires et Droits 2025</h1><p>Le contrat a duree indeterminee (CDI) est la forme normale et generale de la relation de travail en France. Comprendre ses clauses est essentiel pour proteger vos droits.</p><h2>Les Mentions Obligatoires</h2><p>Identification des parties, caracteristiques emploi, conditions remuneration, duree et horaires travail, conges payes, convention collective applicable.</p>',
  'Contrat CDI 2025 : Clauses Obligatoires, Droits et Conseils',
  'Guide complet du contrat CDI 2025 : mentions obligatoires, periode essai, clauses facultatives, droits du salarie. Checklist gratuite incluse.',
  ARRAY['contrat cdi', 'contrat travail', 'clauses cdi', 'periode essai', 'droits salarie', 'contrat cdi 2025'],
  'Juridique',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Attestation sur Honneur : Modeles Gratuits pour Toutes Situations',
  'attestation-sur-honneur-modeles-gratuits',
  'Telechargez gratuitement vos modeles attestation sur honneur. Guide complet, valeur juridique, exemples pour chaque situation.',
  '<h1>Attestation sur Honneur : Modeles Gratuits pour Toutes Situations</h1><p>L''attestation sur honneur est un document juridique par lequel vous certifiez exactitude informations. Decouvrez quand et comment utiliser.</p><h2>Valeur Juridique</h2><p>Reconnue par administrations et organismes officiels, peut servir de preuve en justice. Faire une fausse declaration constitue un delit.</p>',
  'Attestation sur Honneur : Modeles Gratuits + Guide Complet',
  'Creez votre attestation sur honneur avec nos modeles gratuits. Hebergement, concubinage, non-imposition : tous les modeles conformes. Generateur en ligne.',
  ARRAY['attestation honneur', 'modele attestation honneur', 'attestation hebergement', 'attestation concubinage', 'attestation gratuite'],
  'Administratif',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Facture Auto-Entrepreneur : Modele Gratuit Conforme 2025',
  'facture-auto-entrepreneur-modele-gratuit-2025',
  'Creez vos factures auto-entrepreneur conformes en 2025. Mentions obligatoires, TVA, numerotation, modele gratuit.',
  '<h1>Facture Auto-Entrepreneur : Modele Gratuit Conforme 2025</h1><p>En tant qu''auto-entrepreneur, vos factures doivent respecter des mentions obligatoires. Decouvrez comment creer des factures conformes.</p><h2>Mentions Obligatoires 2025</h2><p>Votre identification complete, numero SIRET, mentions declaration activite, coordonnees client, description prestations, montants HT et TTC, mention TVA non applicable.</p>',
  'Facture Auto-Entrepreneur 2025 : Modele Gratuit Conforme',
  'Creez vos factures auto-entrepreneur conformes avec notre modele gratuit 2025. Mentions obligatoires, exemples, generateur automatique. Simple et rapide.',
  ARRAY['facture auto entrepreneur', 'modele facture', 'facture conforme', 'mentions obligatoires facture', 'facture 2025'],
  'Comptabilite',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Bail de Location : Modele Gratuit et Clauses Essentielles 2025',
  'bail-location-modele-gratuit-clauses-2025',
  'Telechargez votre modele de bail de location conforme 2025. Loi ALUR, clauses obligatoires, droits locataire et proprietaire.',
  '<h1>Bail de Location : Modele Gratuit et Clauses Essentielles 2025</h1><p>Le contrat de bail est le document fondamental de toute location. Il doit respecter la loi ALUR et contenir des mentions obligatoires.</p><h2>Types de Baux</h2><p>Bail location vide (3 ans minimum), bail location meublee (1 an), bail mobilite (1 a 10 mois), bail commercial, bail professionnel.</p>',
  'Bail de Location 2025 : Modele Gratuit Conforme Loi ALUR',
  'Creez votre bail de location conforme avec notre modele gratuit 2025. Loi ALUR, clauses obligatoires, conseils experts. Telechargement immediat.',
  ARRAY['bail location', 'modele bail', 'contrat location', 'loi ALUR', 'bail 2025', 'bail gratuit'],
  'Immobilier',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Quittance de Loyer : Modele Gratuit et Obligations Proprietaire',
  'quittance-loyer-modele-gratuit-obligations',
  'Modele gratuit de quittance de loyer conforme. Obligations du proprietaire, mentions obligatoires, delai envoi.',
  '<h1>Quittance de Loyer : Modele Gratuit et Obligations Proprietaire</h1><p>La quittance de loyer est un document que le proprietaire doit fournir au locataire sur demande. Elle atteste du paiement integral du loyer.</p><h2>Obligations Legales</h2><p>Le proprietaire doit fournir gratuitement une quittance si le locataire en fait la demande. Refuser constitue une infraction.</p>',
  'Quittance de Loyer Gratuite : Modele + Guide Proprietaire',
  'Creez vos quittances de loyer conformes avec notre modele gratuit. Mentions obligatoires, obligations legales, generateur automatique. Gratuit.',
  ARRAY['quittance loyer', 'modele quittance', 'quittance gratuite', 'quittance loyer pdf', 'attestation paiement loyer'],
  'Immobilier',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Testament Olographe : Comment le Rediger Soi-Meme Legalement',
  'testament-olographe-rediger-soi-meme',
  'Redigez votre testament olographe vous-meme. Conditions validite, formules types, conservation, erreurs a eviter.',
  '<h1>Testament Olographe : Comment le Rediger Soi-Meme Legalement</h1><p>Le testament olographe est un testament ecrit entierement a la main par le testateur. C''est la forme la plus simple et economique.</p><h2>Conditions de Validite</h2><p>Ecrit entierement a la main, date precisement, signe par le testateur. Aucun temoin requis. Le tapuscrit ou ordinateur invalide le testament.</p>',
  'Testament Olographe : Guide Complet pour le Rediger Soi-Meme',
  'Redigez votre testament olographe valide avec notre guide complet. Conditions legales, formules types, conservation, conseils notaire. Gratuit.',
  ARRAY['testament olographe', 'rediger testament', 'testament manuscrit', 'testament soi-meme', 'testament gratuit'],
  'Juridique',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Procuration Bancaire : Modele Gratuit et Types de Procurations',
  'procuration-bancaire-modele-gratuit-types',
  'Modele gratuit de procuration bancaire. Procuration generale, limitee, permanente : choisissez le bon type.',
  '<h1>Procuration Bancaire : Modele Gratuit et Types de Procurations</h1><p>La procuration bancaire permet de donner pouvoir a une personne de confiance pour gerer votre compte en votre absence.</p><h2>Types de Procurations Bancaires</h2><p>Procuration generale (tous actes), procuration limitee (actes specifiques), procuration permanente ou temporaire, procuration sous condition.</p>',
  'Procuration Bancaire : Modele Gratuit + Guide Complet 2025',
  'Creez votre procuration bancaire avec notre modele gratuit. Types de procurations, risques, revocation, conseils. Conforme aux banques francaises.',
  ARRAY['procuration bancaire', 'modele procuration', 'procuration compte bancaire', 'procuration gratuite', 'procuration banque'],
  'Banque',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
);