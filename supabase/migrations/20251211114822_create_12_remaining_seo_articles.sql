/*
  # 12 derniers articles pour atteindre 20 articles SEO
  
  1. Finalisation des 20 articles
    - Immigration, juridique, business, personnel
    - Contenu long et optimisé SEO
*/

INSERT INTO articles (slug, title, excerpt, content_html, content_markdown, related_template, category, tags, meta_title, meta_description, is_published, published_at)
VALUES
-- Article 9: Contrat de colocation
(
  'contrat-colocation-guide-complet',
  'Contrat de colocation : guide complet pour colocataires',
  'Comment rédiger un contrat de colocation solide : droits, obligations, charges et gestion des conflits entre colocataires.',
  E'<h1>Contrat de colocation</h1>\n\n<h2>Pourquoi un contrat</h2>\n<p>Même entre amis, un contrat écrit évite malentendus et conflits</p>\n\n<h2>Types de colocation</h2>\n\n<h3>1. Bail unique</h3>\n<p>Tous colocataires sur même bail, solidairement responsables</p>\n\n<h3>2. Baux séparés</h3>\n<p>Chacun son bail avec propriétaire</p>\n\n<h2>Clauses essentielles</h2>\n\n<h3>Informations de base</h3>\n<ul>\n<li>Identité tous colocataires</li>\n<li>Adresse logement</li>\n<li>Durée</li>\n</ul>\n\n<h3>Répartition loyer et charges</h3>\n<ul>\n<li>Part de chacun</li>\n<li>Mode de paiement</li>\n<li>Charges incluses</li>\n</ul>\n\n<h3>Répartition espaces</h3>\n<ul>\n<li>Chambres privatives</li>\n<li>Espaces communs</li>\n<li>Stationnement</li>\n</ul>\n\n<h3>Règles de vie</h3>\n<ul>\n<li>Horaires calmes</li>\n<li>Invités</li>\n<li>Animaux</li>\n<li>Ménage</li>\n<li>Courses communes</li>\n</ul>\n\n<h3>Départ anticipé</h3>\n<ul>\n<li>Préavis entre colocataires</li>\n<li>Recherche remplaçant</li>\n<li>Répartition charges restantes</li>\n</ul>\n\n<h2>Gestion du quotidien</h2>\n\n<h3>Charges communes</h3>\n<p>Créer cagnotte commune pour :</p>\n<ul>\n<li>Produits ménage</li>\n<li>Internet</li>\n<li>Courses partagées</li>\n</ul>\n\n<h3>Planning ménage</h3>\n<p>Rotation équitable des tâches</p>\n\n<h2>Gestion conflits</h2>\n\n<ul>\n<li>Communication ouverte</li>\n<li>Réunions régulières</li>\n<li>Médiation si nécessaire</li>\n</ul>\n\n<h2>Conclusion</h2>\n<p>Un bon contrat de colocation = colocation sereine</p>',
  '# Contrat de colocation...',
  'contrat-colocation',
  'location',
  ARRAY['colocation', 'logement', 'bail', 'colocataires'],
  'Contrat de colocation : guide et modèle gratuit 2024',
  'Guide complet du contrat de colocation : clauses, charges, règles de vie. Modèle gratuit pour colocataires.',
  true,
  now()
),

-- Article 10: Plan d'affaires
(
  'plan-affaires-business-plan-guide',
  'Plan d''affaires (Business Plan) : guide complet 2024',
  'Comment créer un business plan solide : structure, contenu, projections financières et conseils pour convaincre investisseurs.',
  E'<h1>Plan d''affaires : guide complet</h1>\n\n<h2>Qu''est-ce qu''un business plan</h2>\n<p>Document stratégique décrivant projet entreprise, objectifs et moyens pour les atteindre</p>\n\n<h2>À quoi sert-il</h2>\n\n<ul>\n<li>Obtenir financement</li>\n<li>Convaincre investisseurs</li>\n<li>Clarifier vision</li>\n<li>Feuille de route</li>\n<li>Outil de pilotage</li>\n</ul>\n\n<h2>Structure type</h2>\n\n<h3>1. Résumé exécutif (1-2 pages)</h3>\n<ul>\n<li>Concept en quelques lignes</li>\n<li>Marché visé</li>\n<li>Avantages concurrentiels</li>\n<li>Besoins financiers</li>\n<li>Projections clés</li>\n</ul>\n\n<h3>2. Présentation projet</h3>\n<ul>\n<li>Genèse du projet</li>\n<li>Mission et vision</li>\n<li>Produits/services</li>\n<li>Proposition de valeur unique</li>\n</ul>\n\n<h3>3. Étude de marché</h3>\n<ul>\n<li>Taille du marché</li>\n<li>Tendances</li>\n<li>Cibles clients</li>\n<li>Besoins identifiés</li>\n<li>Analyse concurrence</li>\n</ul>\n\n<h3>4. Stratégie commerciale</h3>\n<ul>\n<li>Positionnement</li>\n<li>Prix</li>\n<li>Distribution</li>\n<li>Communication</li>\n<li>Objectifs vente</li>\n</ul>\n\n<h3>5. Plan opérationnel</h3>\n<ul>\n<li>Processus production</li>\n<li>Fournisseurs</li>\n<li>Locaux et équipements</li>\n<li>Ressources humaines</li>\n</ul>\n\n<h3>6. Équipe</h3>\n<ul>\n<li>Fondateurs</li>\n<li>Compétences clés</li>\n<li>Organigramme</li>\n<li>Conseillers</li>\n</ul>\n\n<h3>7. Projections financières</h3>\n\n<h4>Sur 3-5 ans</h4>\n<ul>\n<li>Compte de résultat prévisionnel</li>\n<li>Plan de trésorerie</li>\n<li>Bilan prévisionnel</li>\n<li>Seuil de rentabilité</li>\n<li>Retour sur investissement</li>\n</ul>\n\n<h3>8. Besoins financiers</h3>\n<ul>\n<li>Investissement initial</li>\n<li>Besoin en fonds de roulement</li>\n<li>Sources financement</li>\n<li>Utilisation des fonds</li>\n</ul>\n\n<h3>9. Analyse risques</h3>\n<ul>\n<li>Risques identifiés</li>\n<li>Plans d''atténuation</li>\n<li>Scénarios alternatifs</li>\n</ul>\n\n<h2>Conseils rédaction</h2>\n\n<h3>Forme</h3>\n<ul>\n<li>20-40 pages (hors annexes)</li>\n<li>Design professionnel</li>\n<li>Graphiques et visuels</li>\n<li>Langue claire</li>\n</ul>\n\n<h3>Fond</h3>\n<ul>\n<li>Réaliste et crédible</li>\n<li>Chiffres documentés</li>\n<li>Hypothèses justifiées</li>\n<li>Passion et conviction</li>\n</ul>\n\n<h2>Erreurs à éviter</h2>\n\n<ol>\n<li>Projections trop optimistes</li>\n<li>Sous-estimer concurrence</li>\n<li>Négliger étude marché</li>\n<li>Oublier analyse risques</li>\n<li>Équipe incomplète</li>\n</ol>\n\n<h2>Conclusion</h2>\n<p>Un business plan solide est votre meilleur allié pour réussir. Utilisez notre modèle structuré.</p>',
  '# Plan d''affaires...',
  'plan-affaires',
  'business',
  ARRAY['business plan', 'entrepreneuriat', 'startup', 'financement'],
  'Business Plan : guide complet et modèle 2024',
  'Comment créer un business plan solide : structure, projections financières, conseils. Modèle professionnel inclus.',
  true,
  now()
),

-- Article 11: Lettre de recommandation
(
  'lettre-recommandation-professionnelle-guide',
  'Lettre de recommandation professionnelle : guide complet',
  'Comment rédiger ou demander une lettre de recommandation : structure, contenu et exemples pour emploi ou études.',
  E'<h1>Lettre de recommandation professionnelle</h1>\n\n<h2>Qu''est-ce que c''est</h2>\n<p>Lettre rédigée par personne d''autorité attestant compétences et qualités d''un candidat</p>\n\n<h2>Quand en a-t-on besoin</h2>\n\n<ul>\n<li>Candidature emploi</li>\n<li>Admission université/école</li>\n<li>Demande bourse</li>\n<li>Visa (parfois)</li>\n<li>Prêt bancaire</li>\n</ul>\n\n<h2>Qui peut recommander</h2>\n\n<h3>Pour emploi</h3>\n<ul>\n<li>Ancien manager direct</li>\n<li>Collègue senior</li>\n<li>Client important</li>\n</ul>\n\n<h3>Pour études</h3>\n<ul>\n<li>Professeur</li>\n<li>Directeur stage</li>\n<li>Tuteur académique</li>\n</ul>\n\n<h2>Structure de la lettre</h2>\n\n<h3>En-tête</h3>\n<ul>\n<li>Coordonnées recommandeur</li>\n<li>Titre et fonction</li>\n<li>Date</li>\n</ul>\n\n<h3>Introduction</h3>\n<ul>\n<li>Relation avec candidat</li>\n<li>Durée collaboration</li>\n<li>Contexte</li>\n</ul>\n\n<h3>Corps (2-3 paragraphes)</h3>\n<ul>\n<li>Compétences techniques</li>\n<li>Qualités humaines</li>\n<li>Réalisations concrètes</li>\n<li>Exemples spécifiques</li>\n</ul>\n\n<h3>Conclusion</h3>\n<ul>\n<li>Recommandation explicite</li>\n<li>Disponibilité pour questions</li>\n<li>Formule de politesse</li>\n<li>Signature</li>\n</ul>\n\n<h2>Conseils pour recommandeur</h2>\n\n<h3>À faire</h3>\n<ul>\n<li>Être spécifique</li>\n<li>Donner exemples concrets</li>\n<li>Rester honnête</li>\n<li>Adapter au poste visé</li>\n<li>Relire attentivement</li>\n</ul>\n\n<h3>À éviter</h3>\n<ul>\n<li>Banalités et généralités</li>\n<li>Exagérations</li>\n<li>Mensonges</li>\n<li>Négatif même subtil</li>\n</ul>\n\n<h2>Conseils pour demandeur</h2>\n\n<h3>Comment demander</h3>\n<ol>\n<li>Choisir bonne personne</li>\n<li>Demander en avance (3-4 semaines)</li>\n<li>Expliquer contexte</li>\n<li>Fournir infos utiles</li>\n<li>Faciliter la tâche</li>\n</ol>\n\n<h3>Informations à fournir</h3>\n<ul>\n<li>Description poste/programme</li>\n<li>CV actualisé</li>\n<li>Points à mettre en avant</li>\n<li>Deadline</li>\n<li>Procédure envoi</li>\n</ul>\n\n<h2>Format</h2>\n\n<ul>\n<li>1 page maximum</li>\n<li>Papier à en-tête si possible</li>\n<li>Langue appropriée</li>\n<li>Ton professionnel</li>\n</ul>\n\n<h2>Conclusion</h2>\n<p>Une bonne lettre de recommandation peut faire la différence. Choisissez bien votre recommandeur et facilitez-lui la tâche.</p>',
  '# Lettre de recommandation...',
  'lettre-recommandation',
  'emploi',
  ARRAY['recommandation', 'emploi', 'candidature', 'références'],
  'Lettre de recommandation : guide et modèle 2024',
  'Comment rédiger une lettre de recommandation professionnelle : structure, conseils, exemples. Modèle gratuit.',
  true,
  now()
),

-- Article 12: Résiliation bail
(
  'resilier-bail-locatif-guide-complet',
  'Comment résilier un bail locatif : guide complet 2024',
  'Procédure complète pour résilier un bail : préavis, lettre type, état des lieux et récupération du dépôt de garantie.',
  E'<h1>Résilier un bail locatif</h1>\n\n<h2>Préavis légal</h2>\n\n<h3>Logement vide</h3>\n<ul>\n<li><strong>3 mois</strong> : Règle générale</li>\n<li><strong>1 mois</strong> : Zones tendues, mutation pro, perte emploi, +60 ans dépendance</li>\n</ul>\n\n<h3>Logement meublé</h3>\n<ul>\n<li><strong>1 mois</strong> : Dans tous les cas</li>\n</ul>\n\n<h2>Procédure</h2>\n\n<h3>1. Rédiger lettre résiliation</h3>\n<p>Mentions obligatoires :</p>\n<ul>\n<li>Identité locataire</li>\n<li>Adresse logement</li>\n<li>Date souhaitée départ</li>\n<li>Nouvelle adresse si connue</li>\n</ul>\n\n<h3>2. Envoyer en recommandé AR</h3>\n<p>Préavis démarre à réception par propriétaire</p>\n\n<h3>3. Continuer payer loyer</h3>\n<p>Jusqu''à fin du préavis</p>\n\n<h3>4. État des lieux sortie</h3>\n<p>Comparer avec état lieux entrée</p>\n\n<h3>5. Restitution clés</h3>\n<p>Marque la fin officielle de location</p>\n\n<h2>Dépôt de garantie</h2>\n\n<h3>Délais restitution</h3>\n<ul>\n<li>1 mois si état lieux conforme</li>\n<li>2 mois si dégradations</li>\n</ul>\n\n<h3>Retenues possibles</h3>\n<ul>\n<li>Réparations locatives</li>\n<li>Loyers impayés</li>\n<li>Charges</li>\n</ul>\n\n<h2>Cas particuliers</h2>\n\n<h3>Colocation</h3>\n<p>Un colocataire peut partir si clause prévue, préavis réduit possible</p>\n\n<h3>Bail avec clause de solidarité</h3>\n<p>Tous restent solidaires jusqu''à fin contrat</p>\n\n<h3>Congé du propriétaire</h3>\n<p>Motifs limités : vente, reprise, motif légitime</p>\n\n<h2>Conseils</h2>\n\n<ul>\n<li>Prévenir tôt</li>\n<li>Garder preuve envoi</li>\n<li>Photographier logement</li>\n<li>Nettoyer à fond</li>\n<li>Réparer petites dégradations</li>\n</ul>\n\n<h2>Conclusion</h2>\n<p>Respecter procédure évite conflits. Notre modèle de lettre résiliation est conforme.</p>',
  '# Résilier un bail...',
  'resiliation-bail',
  'location',
  ARRAY['résiliation', 'bail', 'préavis', 'location', 'logement'],
  'Résilier un bail : guide complet et lettre type 2024',
  'Comment résilier un bail locatif : préavis, procédure, lettre type. Guide complet pour quitter votre logement.',
  true,
  now()
),

-- Article 13: Conditions générales de vente
(
  'cgv-conditions-generales-vente-guide',
  'CGV : guide complet des conditions générales de vente',
  'Comment rédiger des CGV conformes : mentions obligatoires, clauses essentielles et protection juridique pour votre entreprise.',
  E'<h1>Conditions Générales de Vente (CGV)</h1>\n\n<h2>Définition</h2>\n<p>Document contractuel définissant modalités de vente entre professionnel et clients</p>\n\n<h2>Obligation légale</h2>\n\n<h3>B2B (entreprise à entreprise)</h3>\n<p>CGV obligatoires, doivent être communiquées sur demande</p>\n\n<h3>B2C (entreprise à consommateur)</h3>\n<p>CGV fortement recommandées, CGU obligatoires pour e-commerce</p>\n\n<h2>Clauses essentielles</h2>\n\n<h3>1. Identification vendeur</h3>\n<ul>\n<li>Dénomination sociale</li>\n<li>Forme juridique</li>\n<li>Siège social</li>\n<li>RCS/SIRET</li>\n<li>Capital social</li>\n<li>Contact</li>\n</ul>\n\n<h3>2. Produits/services</h3>\n<ul>\n<li>Description détaillée</li>\n<li>Caractéristiques</li>\n<li>Photos</li>\n<li>Disponibilité</li>\n</ul>\n\n<h3>3. Prix</h3>\n<ul>\n<li>Prix HT et TTC</li>\n<li>Frais livraison</li>\n<li>Modalités révision</li>\n<li>Promotions conditions</li>\n</ul>\n\n<h3>4. Commande</h3>\n<ul>\n<li>Processus commande</li>\n<li>Validation</li>\n<li>Confirmation</li>\n<li>Modifications/annulation</li>\n</ul>\n\n<h3>5. Paiement</h3>\n<ul>\n<li>Modes acceptés</li>\n<li>Échéances</li>\n<li>Sécurisation</li>\n<li>Pénalités retard B2B</li>\n</ul>\n\n<h3>6. Livraison</h3>\n<ul>\n<li>Zones</li>\n<li>Délais</li>\n<li>Modes</li>\n<li>Transfert risques</li>\n</ul>\n\n<h3>7. Droit de rétractation (B2C)</h3>\n<ul>\n<li>14 jours</li>\n<li>Procédure</li>\n<li>Exceptions</li>\n<li>Remboursement</li>\n</ul>\n\n<h3>8. Garanties</h3>\n<ul>\n<li>Garantie légale conformité</li>\n<li>Garantie vices cachés</li>\n<li>Garantie commerciale si applicable</li>\n</ul>\n\n<h3>9. Responsabilité</h3>\n<ul>\n<li>Limitations</li>\n<li>Exclusions</li>\n<li>Force majeure</li>\n</ul>\n\n<h3>10. Propriété intellectuelle</h3>\n<ul>\n<li>Droits sur contenus</li>\n<li>Utilisation autorisée</li>\n<li>Interdictions</li>\n</ul>\n\n<h3>11. Données personnelles</h3>\n<ul>\n<li>Conformité RGPD</li>\n<li>Traitement données</li>\n<li>Droits utilisateurs</li>\n</ul>\n\n<h3>12. Litiges</h3>\n<ul>\n<li>Droit applicable</li>\n<li>Juridiction compétente</li>\n<li>Médiation consommation</li>\n</ul>\n\n<h2>Spécificités e-commerce</h2>\n\n<h3>Mentions additionnelles</h3>\n<ul>\n<li>Hébergeur site</li>\n<li>Cookies</li>\n<li>Sécurité paiement</li>\n<li>Plateforme règlement litiges UE</li>\n</ul>\n\n<h2>Opposabilité</h2>\n\n<p>Pour être opposables, CGV doivent :</p>\n<ul>\n<li>Être portées à connaissance client</li>\n<li>Avant conclusion vente</li>\n<li>Client doit accepter explicitement</li>\n</ul>\n\n<h2>Mise à jour</h2>\n\n<ul>\n<li>Prévoir clause modification</li>\n<li>Information clients</li>\n<li>CGV applicables = celles au moment commande</li>\n</ul>\n\n<h2>Sanctions non-conformité</h2>\n\n<ul>\n<li>Amendes administratives</li>\n<li>Clauses abusives annulées</li>\n<li>Dommages-intérêts</li>\n</ul>\n\n<h2>Conclusion</h2>\n<p>CGV conformes protègent votre activité. Faites-les relire par juriste et mettez-les à jour régulièrement.</p>',
  '# CGV : guide complet...',
  'cgv',
  'juridique',
  ARRAY['CGV', 'conditions vente', 'e-commerce', 'juridique', 'RGPD'],
  'CGV : guide complet conditions générales de vente 2024',
  'Comment rédiger des CGV conformes : mentions obligatoires, clauses essentielles. Guide complet pour protéger votre entreprise.',
  true,
  now()
),

-- Articles 14-20: Formats plus courts mais SEO
(
  'demande-conge-comment-faire',
  'Demande de congé : procédure et modèle de lettre',
  'Comment formuler une demande de congé : délais, procédure et modèle de lettre pour congés payés, sans solde ou exceptionnel.',
  E'<h1>Demande de congé</h1>\n\n<h2>Types de congés</h2>\n<ul>\n<li>Congés payés annuels</li>\n<li>Congé sans solde</li>\n<li>Congé parental</li>\n<li>Congé maladie</li>\n<li>Congés exceptionnels</li>\n</ul>\n\n<h2>Procédure</h2>\n<ol>\n<li>Vérifier convention collective</li>\n<li>Respecter délais prévenance</li>\n<li>Rédiger demande écrite</li>\n<li>Obtenir accord employeur</li>\n</ol>\n\n<h2>Délais</h2>\n<ul>\n<li>Congés payés : 1-2 mois avant</li>\n<li>Congé exceptionnel : Dès connaissance événement</li>\n</ul>\n\n<h2>Refus possible</h2>\n<p>Employeur peut refuser congés payés pour nécessité service</p>',
  '# Demande de congé...',
  'demande-conge',
  'emploi',
  ARRAY['congé', 'vacances', 'emploi', 'RH'],
  'Demande de congé : procédure et modèle lettre 2024',
  'Guide pour demander un congé : types, délais, procédure et modèle de lettre de demande de congé professionnel.',
  true,
  now()
),

(
  'contrat-vente-vehicule-occasion',
  'Contrat de vente véhicule d''occasion : guide complet',
  'Comment vendre ou acheter un véhicule d''occasion en toute sécurité : documents obligatoires et contrat de vente.',
  E'<h1>Vente véhicule occasion</h1>\n\n<h2>Documents obligatoires</h2>\n\n<h3>Pour le vendeur</h3>\n<ul>\n<li>Carte grise barrée et signée</li>\n<li>Certificat de cession (Cerfa 15776)</li>\n<li>Contrôle technique <6 mois</li>\n<li>Certificat de non-gage</li>\n</ul>\n\n<h3>Pour l''acheteur</h3>\n<ul>\n<li>Pièce identité</li>\n<li>Justificatif domicile</li>\n<li>Demande carte grise</li>\n</ul>\n\n<h2>Contrat de vente</h2>\n<p>Doit mentionner :</p>\n<ul>\n<li>Identité vendeur/acheteur</li>\n<li>Caractéristiques véhicule</li>\n<li>Kilométrage</li>\n<li>Prix</li>\n<li>Vices apparents</li>\n<li>Date et signatures</li>\n</ul>\n\n<h2>Paiement</h2>\n<ul>\n<li>Espèces <1000€</li>\n<li>Chèque de banque recommandé</li>\n<li>Virement bancaire</li>\n</ul>',
  '# Vente véhicule...',
  'contrat-vente-vehicule',
  'personnel',
  ARRAY['voiture', 'véhicule', 'occasion', 'vente', 'auto'],
  'Vendre un véhicule d''occasion : documents et contrat 2024',
  'Guide complet pour vendre ou acheter un véhicule d''occasion : documents obligatoires, contrat de vente, démarches.',
  true,
  now()
),

(
  'autorisation-parentale-voyage-mineur',
  'Autorisation parentale pour voyage mineur : guide pratique',
  'Comment rédiger une autorisation parentale pour voyage d''un mineur : documents requis et modèle conforme.',
  E'<h1>Autorisation parentale voyage</h1>\n\n<h2>Quand nécessaire</h2>\n<ul>\n<li>Voyage sans parents</li>\n<li>Avec tiers (grands-parents, école)</li>\n<li>À l''étranger</li>\n</ul>\n\n<h2>Documents requis</h2>\n<ol>\n<li>Autorisation signée parent(s)</li>\n<li>Copie pièce identité parent signataire</li>\n<li>Copie pièce identité mineur</li>\n</ol>\n\n<h2>Contenu autorisation</h2>\n<ul>\n<li>Identité mineur</li>\n<li>Identité parent(s)</li>\n<li>Identité accompagnateur</li>\n<li>Destination</li>\n<li>Dates</li>\n<li>Signature(s)</li>\n</ul>\n\n<h2>Validité</h2>\n<p>Pour la durée du voyage mentionnée</p>',
  '# Autorisation parentale...',
  'autorisation-parentale',
  'personnel',
  ARRAY['autorisation', 'mineur', 'voyage', 'enfant', 'parental'],
  'Autorisation parentale voyage mineur : modèle 2024',
  'Guide pour autorisation parentale de voyage : documents requis, procédure et modèle gratuit conforme.',
  true,
  now()
),

(
  'mise-en-demeure-guide-redaction',
  'Mise en demeure : quand et comment la rédiger',
  'Guide pratique pour rédiger une mise en demeure efficace : contenu, forme et valeur juridique.',
  E'<h1>Mise en demeure</h1>\n\n<h2>Définition</h2>\n<p>Sommation formelle d''exécuter une obligation</p>\n\n<h2>Quand l''utiliser</h2>\n<ul>\n<li>Impayés</li>\n<li>Non-respect contrat</li>\n<li>Avant action justice</li>\n</ul>\n\n<h2>Forme</h2>\n<p>Lettre recommandée avec AR</p>\n\n<h2>Contenu</h2>\n<ul>\n<li>Identification parties</li>\n<li>Rappel obligations</li>\n<li>Manquements constatés</li>\n<li>Délai régularisation</li>\n<li>Conséquences défaut</li>\n<li>Base juridique</li>\n</ul>\n\n<h2>Effets juridiques</h2>\n<ul>\n<li>Preuve bonne foi</li>\n<li>Point départ délais</li>\n<li>Mise en demeure préalable action</li>\n</ul>\n\n<h2>Après mise en demeure</h2>\n<ul>\n<li>Attendre délai</li>\n<li>Saisir tribunal si pas résolu</li>\n<li>Demander dommages-intérêts</li>\n</ul>',
  '# Mise en demeure...',
  'mise-en-demeure',
  'juridique',
  ARRAY['mise en demeure', 'recouvrement', 'juridique', 'contentieux'],
  'Mise en demeure : guide et modèle de lettre 2024',
  'Comment rédiger une mise en demeure efficace : contenu obligatoire, procédure et modèle de lettre type.',
  true,
  now()
),

(
  'attestation-employeur-tout-savoir',
  'Attestation employeur : types et modèles',
  'Guide des différentes attestations employeur : attestation de travail, de salaire, pour la CAF et modèles gratuits.',
  E'<h1>Attestations employeur</h1>\n\n<h2>Types d''attestations</h2>\n\n<h3>1. Attestation de travail</h3>\n<p>Certifie que personne travaille dans entreprise</p>\n\n<h3>2. Attestation de salaire</h3>\n<p>Détaille rémunération pour organisme</p>\n\n<h3>3. Attestation pour CAF</h3>\n<p>Revenus et situation pour prestations</p>\n\n<h3>4. Attestation Pôle emploi</h3>\n<p>Fin de contrat, obligatoire</p>\n\n<h2>Mentions communes</h2>\n<ul>\n<li>Identification employeur</li>\n<li>Identification salarié</li>\n<li>Type contrat</li>\n<li>Dates</li>\n<li>Fonction</li>\n<li>Date et signature</li>\n</ul>\n\n<h2>Obligations employeur</h2>\n<p>Délivrer attestations demandées par salarié ou organismes</p>',
  '# Attestations employeur...',
  'attestation-employeur',
  'emploi',
  ARRAY['attestation', 'employeur', 'travail', 'salaire', 'RH'],
  'Attestation employeur : types et modèles gratuits 2024',
  'Guide complet des attestations employeur : travail, salaire, CAF. Modèles gratuits conformes pour toutes situations.',
  true,
  now()
),

(
  'devis-professionnel-redaction-conforme',
  'Devis professionnel : mentions obligatoires 2024',
  'Comment rédiger un devis conforme : mentions légales, validité et transformation en facture.',
  E'<h1>Devis professionnel</h1>\n\n<h2>Obligations</h2>\n\n<h3>Devis obligatoire si</h3>\n<ul>\n<li>Prestation >150€ TTC</li>\n<li>Secteurs réglementés (bâtiment, etc.)</li>\n<li>Demandé par client</li>\n</ul>\n\n<h2>Mentions obligatoires</h2>\n\n<ul>\n<li>Mot "Devis"</li>\n<li>Date établissement</li>\n<li>Identité pros</li>\n<li>Identité client</li>\n<li>Détail prestations</li>\n<li>Prix unitaires HT</li>\n<li>Total HT, TVA, TTC</li>\n<li>Durée validité</li>\n<li>Conditions paiement</li>\n</ul>\n\n<h2>Validité</h2>\n<p>Libre mais à préciser (généralement 1-3 mois)</p>\n\n<h2>Acceptation</h2>\n<ul>\n<li>Signature client + mention "Bon pour accord"</li>\n<li>Date signature</li>\n<li>Devient contrat</li>\n</ul>\n\n<h2>Modifications</h2>\n<p>Nouveau devis si changements substantiels</p>',
  '# Devis professionnel...',
  'devis',
  'professionnel',
  ARRAY['devis', 'facturation', 'entreprise', 'mentions légales'],
  'Devis professionnel : mentions obligatoires et modèle 2024',
  'Guide complet du devis professionnel : mentions légales, validité, acceptation. Modèle conforme gratuit.',
  true,
  now()
),

(
  'politique-teletravail-entreprise',
  'Politique télétravail : guide pour entreprises',
  'Comment mettre en place une politique de télétravail : règles, outils, sécurité et modèle de charte.',
  E'<h1>Politique télétravail</h1>\n\n<h2>Pourquoi une politique</h2>\n<ul>\n<li>Cadrer pratiques</li>\n<li>Protéger entreprise et salariés</li>\n<li>Assurer équité</li>\n<li>Maintenir productivité</li>\n</ul>\n\n<h2>Éléments à définir</h2>\n\n<h3>1. Éligibilité</h3>\n<ul>\n<li>Postes concernés</li>\n<li>Ancienneté requise</li>\n<li>Critères acceptation</li>\n</ul>\n\n<h3>2. Modalités</h3>\n<ul>\n<li>Fréquence (jours/semaine)</li>\n<li>Plages présence obligatoires</li>\n<li>Flexibilité</li>\n</ul>\n\n<h3>3. Équipement</h3>\n<ul>\n<li>Matériel fourni</li>\n<li>Connexion internet</li>\n<li>Logiciels</li>\n<li>Maintenance</li>\n</ul>\n\n<h3>4. Sécurité</h3>\n<ul>\n<li>VPN obligatoire</li>\n<li>Charte utilisation</li>\n<li>Protection données</li>\n<li>Confidentialité</li>\n</ul>\n\n<h3>5. Communication</h3>\n<ul>\n<li>Outils (Teams, Slack...)</li>\n<li>Disponibilité attendue</li>\n<li>Réunions régulières</li>\n</ul>\n\n<h2>Aspects juridiques</h2>\n<ul>\n<li>Avenant contrat ou accord collectif</li>\n<li>Assurance habitation employé</li>\n<li>Prise en charge frais</li>\n<li>Droit déconnexion</li>\n</ul>',
  '# Politique télétravail...',
  'politique-teletravail',
  'RH',
  ARRAY['télétravail', 'remote', 'politique', 'RH', 'entreprise'],
  'Politique télétravail entreprise : guide et modèle 2024',
  'Comment créer une politique de télétravail : règles, équipement, sécurité. Guide complet avec modèle de charte.',
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;
