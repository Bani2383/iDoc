/*
  # Création de 20 articles SEO supplémentaires
  
  1. Objectif
    - Ajouter 20 articles SEO pour atteindre un total élevé
    - Couvrir plus de niches et mots-clés longue traîne
    - Diversifier les thématiques pour maximiser le trafic
  
  2. Thématiques
    - Documents immobiliers
    - Documents juridiques
    - Documents entreprise
    - Documents personnels
    - Démarches administratives
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

(
  'Etat des Lieux : Modele Gratuit et Guide Complet 2025',
  'etat-des-lieux-modele-gratuit-guide-2025',
  'Modele gratuit etat des lieux entree sortie. Checklist complete, conseils locataire proprietaire, photos obligatoires.',
  '<h1>Etat des Lieux : Modele Gratuit et Guide Complet 2025</h1><p>L''etat des lieux est le document crucial qui protege locataire et proprietaire. Decouvrez comment le realiser correctement.</p><h2>Importance de l''Etat des Lieux</h2><p>L''etat des lieux contradictoire etablit l''etat du logement au debut et fin de location. Il determine la restitution du depot de garantie.</p>',
  'Etat des Lieux 2025 : Modele Gratuit + Checklist Complete',
  'Realisez votre etat des lieux avec notre modele gratuit 2025. Checklist piece par piece, conseils experts, photos obligatoires. PDF telechargeab le.',
  ARRAY['etat lieux', 'modele etat lieux', 'etat lieux entree', 'etat lieux sortie', 'etat lieux gratuit'],
  'Immobilier',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Devis Gratuit : Modele Professionnel pour Artisans et Services',
  'devis-gratuit-modele-professionnel-artisans',
  'Modele de devis professionnel gratuit. Mentions obligatoires, validite, TVA, conseils pour artisans et prestataires.',
  '<h1>Devis Gratuit : Modele Professionnel pour Artisans et Services</h1><p>Un devis bien redige est essentiel pour votre activite. Il engage juridiquement et protege vos interets.</p><h2>Mentions Obligatoires sur un Devis</h2><p>Date emission, duree validite, identification entreprise, detail prestations, prix unitaires, montant total HT et TTC, conditions paiement.</p>',
  'Devis Professionnel : Modele Gratuit + Mentions Obligatoires',
  'Creez vos devis professionnels avec notre modele gratuit. Mentions obligatoires, TVA, validite, conseils juridiques. Generateur automatique.',
  ARRAY['devis gratuit', 'modele devis', 'devis professionnel', 'devis artisan', 'faire un devis'],
  'Entreprise',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Rupture Conventionnelle : Procedure Complete et Montants 2025',
  'rupture-conventionnelle-procedure-montants-2025',
  'Guide complet rupture conventionnelle 2025. Procedure etapes, calcul indemnites, delai retractation, droits chomage.',
  '<h1>Rupture Conventionnelle : Procedure Complete et Montants 2025</h1><p>La rupture conventionnelle permet de mettre fin au CDI d''un commun accord. Decouvrez la procedure complete et vos droits.</p><h2>Qu''est-ce que la Rupture Conventionnelle</h2><p>Mode de rupture du CDI negocie entre employeur et salarie. Permet de beneficier du chomage contrairement a la demission.</p>',
  'Rupture Conventionnelle 2025 : Guide + Calcul Indemnites',
  'Guide complet rupture conventionnelle 2025. Procedure, calcul indemnites, delai retractation, droits chomage. Simulateur gratuit inclus.',
  ARRAY['rupture conventionnelle', 'indemnite rupture', 'procedure rupture conventionnelle', 'rupture conventionnelle 2025'],
  'Emploi',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Certificat de Cession Vehicule : Modele Gratuit Cerfa 2025',
  'certificat-cession-vehicule-modele-cerfa-2025',
  'Modele gratuit certificat cession vehicule Cerfa 15776. Remplissage guide complet, delais declaration, obligations vendeur acheteur.',
  '<h1>Certificat de Cession Vehicule : Modele Gratuit Cerfa 2025</h1><p>Le certificat de cession (Cerfa 15776) est obligatoire pour toute vente de vehicule. Decouvrez comment le remplir correctement.</p><h2>Qu''est-ce que le Certificat de Cession</h2><p>Document officiel qui acte la vente d''un vehicule entre un vendeur et un acheteur. Obligatoire sous peine d''amende.</p>',
  'Certificat Cession Vehicule 2025 : Cerfa 15776 + Guide',
  'Telechargez le certificat cession vehicule Cerfa 15776 gratuit. Guide remplissage complet, delais, obligations. Declaration en ligne possible.',
  ARRAY['certificat cession', 'cerfa 15776', 'vente vehicule', 'declaration cession', 'certificat cession gratuit'],
  'Automobile',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Certificat de Travail : Modele Gratuit et Mentions Obligatoires',
  'certificat-travail-modele-gratuit-mentions',
  'Modele gratuit certificat travail conforme. Mentions obligatoires, delai remise, sanctions employeur, modele type.',
  '<h1>Certificat de Travail : Modele Gratuit et Mentions Obligatoires</h1><p>Le certificat de travail est un document obligatoire que l''employeur doit remettre au salarie a la fin du contrat.</p><h2>Obligations de l''Employeur</h2><p>Remise obligatoire au salarie le dernier jour de travail ou envoi par courrier. Gratuit pour le salarie. Sanctions si refus.</p>',
  'Certificat Travail : Modele Gratuit + Mentions Obligatoires',
  'Obtenez votre certificat travail avec notre modele gratuit. Mentions obligatoires, delai remise, recours si refus. Conforme Code du Travail.',
  ARRAY['certificat travail', 'modele certificat travail', 'certificat travail gratuit', 'fin contrat', 'document fin contrat'],
  'Emploi',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Mandat de Vente Immobilier : Exclusif ou Simple ? Guide 2025',
  'mandat-vente-immobilier-exclusif-simple-2025',
  'Mandat vente exclusif ou simple : quel choisir ? Duree, commission, clauses, droits vendeur, modeles gratuits.',
  '<h1>Mandat de Vente Immobilier : Exclusif ou Simple ? Guide 2025</h1><p>Le mandat de vente est le contrat qui lie le vendeur a l''agent immobilier. Choisir le bon type est crucial.</p><h2>Types de Mandats</h2><p>Mandat simple (plusieurs agences), mandat exclusif (une seule agence), mandat semi-exclusif. Avantages et inconvenients de chaque.</p>',
  'Mandat Vente Immobilier 2025 : Guide Complet + Modeles',
  'Choisissez le bon mandat vente avec notre guide 2025. Exclusif vs simple, duree, commission, clauses. Modeles gratuits telechargeables.',
  ARRAY['mandat vente', 'mandat exclusif', 'mandat simple', 'vente immobilier', 'mandat immobilier'],
  'Immobilier',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Preavis Location : Delais Legaux et Modele Lettre 2025',
  'preavis-location-delais-legaux-modele-2025',
  'Delais preavis location selon situation : 1 ou 3 mois. Modele lettre preavis gratuit, cas reduction, calcul dates.',
  '<h1>Preavis Location : Delais Legaux et Modele Lettre 2025</h1><p>Le delai de preavis pour quitter un logement varie selon votre situation. Decouvrez vos droits et obligations.</p><h2>Delais de Preavis Legaux</h2><p>Location vide : 3 mois (reduit a 1 mois dans certains cas). Location meublee : 1 mois. Zone tendue : 1 mois.</p>',
  'Preavis Location 2025 : Delais + Modele Lettre Gratuit',
  'Calculez votre preavis location avec notre guide 2025. Delais legaux, cas reduction, modele lettre gratuit, date effet. Conforme loi.',
  ARRAY['preavis location', 'delai preavis', 'lettre preavis', 'preavis 1 mois', 'preavis 3 mois', 'quitter logement'],
  'Immobilier',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Statuts SARL : Modele Gratuit et Clauses Essentielles 2025',
  'statuts-sarl-modele-gratuit-clauses-2025',
  'Modele statuts SARL gratuit et conforme. Clauses obligatoires, redaction, cout, depot greffe, conseils juridiques.',
  '<h1>Statuts SARL : Modele Gratuit et Clauses Essentielles 2025</h1><p>Les statuts sont l''acte fondateur de votre SARL. Ils doivent contenir des mentions obligatoires et etre deposes au greffe.</p><h2>Clauses Obligatoires Statuts SARL</h2><p>Forme juridique, denomination sociale, siege social, objet social, duree, capital social, apports associes, gerance, repartition parts.</p>',
  'Statuts SARL 2025 : Modele Gratuit + Guide Redaction',
  'Creez vos statuts SARL avec notre modele gratuit 2025. Clauses obligatoires, conseil juridique, depot greffe. Conforme Code Commerce.',
  ARRAY['statuts sarl', 'modele statuts sarl', 'statuts sarl gratuit', 'creation sarl', 'statuts entreprise'],
  'Entreprise',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Contrat Prestation de Services : Modele Gratuit Freelance',
  'contrat-prestation-services-modele-freelance',
  'Modele contrat prestation services gratuit. Clauses essentielles, propriete intellectuelle, tarification, resiliation.',
  '<h1>Contrat Prestation de Services : Modele Gratuit Freelance</h1><p>Le contrat de prestation de services protege le freelance et le client. Decouvrez les clauses indispensables.</p><h2>Pourquoi un Contrat Ecrit</h2><p>Securise la relation commerciale, definit le perimetre mission, fixe la remuneration, protege la propriete intellectuelle.</p>',
  'Contrat Prestation Services : Modele Gratuit Freelance 2025',
  'Creez votre contrat prestation services avec notre modele gratuit. Clauses essentielles, PI, tarifs, resiliation. Protegez votre activite.',
  ARRAY['contrat prestation services', 'contrat freelance', 'modele contrat', 'prestation services', 'contrat consultant'],
  'Entreprise',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Procuration Vote : Modele Gratuit Elections 2025',
  'procuration-vote-modele-gratuit-elections-2025',
  'Modele procuration vote gratuit. Demarches en ligne ou commissariat, delais, pieces justificatives, validite.',
  '<h1>Procuration Vote : Modele Gratuit Elections 2025</h1><p>La procuration de vote permet de voter par l''intermediaire d''une personne de confiance si vous etes absent.</p><h2>Comment Faire une Procuration</h2><p>Demande en ligne sur maprocuration.gouv.fr ou en commissariat/gendarmerie. Pieces identite requises. Delais respecter.</p>',
  'Procuration Vote 2025 : Demarches + Modele Gratuit',
  'Faites votre procuration vote facilement avec notre guide 2025. Demarches en ligne, commissariat, delais, pieces necessaires. Rapide et simple.',
  ARRAY['procuration vote', 'procuration elections', 'voter par procuration', 'procuration en ligne', 'maprocuration'],
  'Administratif',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Conge Parental : Duree Droits et Demarches 2025',
  'conge-parental-duree-droits-demarches-2025',
  'Guide complet conge parental 2025. Duree, indemnisation CAF, demarches employeur, temps partiel, droits salarie.',
  '<h1>Conge Parental : Duree Droits et Demarches 2025</h1><p>Le conge parental permet de cesser ou reduire son activite pour s''occuper de son enfant. Decouvrez vos droits.</p><h2>Duree du Conge Parental</h2><p>Jusqu''aux 3 ans de l''enfant. Renouvelable chaque annee. Possible temps partiel. Protection licenciement pendant conge.</p>',
  'Conge Parental 2025 : Duree, CAF, Demarches Completes',
  'Guide complet conge parental 2025. Duree, indemnisation CAF PreParE, demarches employeur, temps partiel. Calculez vos droits maintenant.',
  ARRAY['conge parental', 'conge parental 2025', 'CAF conge parental', 'PreParE', 'droit conge parental'],
  'Famille',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Autorisation Parentale : Modeles Gratuits Toutes Situations',
  'autorisation-parentale-modeles-gratuits-situations',
  'Modeles autorisation parentale gratuits. Voyage, sortie scolaire, soins medicaux, tatouage, toutes situations.',
  '<h1>Autorisation Parentale : Modeles Gratuits Toutes Situations</h1><p>L''autorisation parentale est necessaire pour de nombreuses situations impliquant un mineur. Telechargez vos modeles gratuits.</p><h2>Situations Necessitant Autorisation</h2><p>Voyage sans parents, sortie scolaire, soins medicaux, tatouage piercing, mariage mineur, ouverture compte bancaire.</p>',
  'Autorisation Parentale : Modeles Gratuits + Guide Complet',
  'Telechargez vos autorisations parentales gratuites. Voyage, sorties, soins, tatouage : tous modeles conformes. Generation instantanee.',
  ARRAY['autorisation parentale', 'autorisation voyage', 'autorisation sortie', 'autorisation mineu r', 'modele autorisation'],
  'Famille',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Mise en Demeure : Modele Gratuit et Conseils Juridiques',
  'mise-en-demeure-modele-gratuit-conseils',
  'Modele mise en demeure gratuit. Redaction efficace, delai raisonnable, envoi recommande, consequences juridiques.',
  '<h1>Mise en Demeure : Modele Gratuit et Conseils Juridiques</h1><p>La mise en demeure est un courrier formel qui exige l''execution d''une obligation. Etape prealable avant action justice.</p><h2>Qu''est-ce qu''une Mise en Demeure</h2><p>Courrier formel exigeant execution obligation. Prealable obligatoire avant action judiciaire. Valeur juridique importante.</p>',
  'Mise en Demeure : Modele Gratuit + Guide Redaction 2025',
  'Redigez votre mise en demeure avec notre modele gratuit. Conseils juridiques, delai raisonnable, envoi AR. Efficace et conforme.',
  ARRAY['mise en demeure', 'modele mise en demeure', 'lettre mise en demeure', 'mise en demeure gratuite', 'courrier juridique'],
  'Juridique',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Bail Commercial : Modele Gratuit et Clauses 3-6-9',
  'bail-commercial-modele-gratuit-clauses-369',
  'Modele bail commercial gratuit. Duree 3-6-9, loyer, charges, renouvellement, resiliation, droits locataire.',
  '<h1>Bail Commercial : Modele Gratuit et Clauses 3-6-9</h1><p>Le bail commercial est le contrat de location d''un local pour activite commerciale, artisanale ou industrielle.</p><h2>Caracteristiques Bail Commercial</h2><p>Duree minimale 9 ans avec depart possible 3-6-9 ans. Loyer indexe. Droit renouvellement. Protection locataire.</p>',
  'Bail Commercial 2025 : Modele Gratuit + Guide Complet',
  'Creez votre bail commercial avec notre modele gratuit. Clauses 3-6-9, loyer, charges, renouvellement. Conforme Code Commerce 2025.',
  ARRAY['bail commercial', 'modele bail commercial', 'bail 3-6-9', 'location commerciale', 'bail commercial gratuit'],
  'Entreprise',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Contrat de Pret Entre Particuliers : Modele Gratuit Legal',
  'contrat-pret-particuliers-modele-gratuit',
  'Modele contrat pret entre particuliers gratuit. Reconnaissance dette, taux interet, remboursement, garanties, fiscalite.',
  '<h1>Contrat de Pret Entre Particuliers : Modele Gratuit Legal</h1><p>Le contrat de pret entre particuliers securise le preteur et emprunteur. Decouvrez comment le rediger correctement.</p><h2>Obligation de Declaration</h2><p>Prets superieurs 5000 euros doivent etre declares aux impots. Formulaire 2062. Sanctions en cas non declaration.</p>',
  'Contrat Pret Particuliers : Modele Gratuit + Guide Fiscal',
  'Creez votre contrat pret particuliers avec notre modele gratuit. Reconnaissance dette, interets, remboursement, declaration fiscale.',
  ARRAY['contrat pret', 'pret particuliers', 'reconnaissance dette', 'pret familial', 'contrat pret gratuit'],
  'Juridique',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Compromis de Vente Immobilier : Modele et Clauses 2025',
  'compromis-vente-immobilier-modele-clauses-2025',
  'Modele compromis vente immobilier gratuit. Clauses suspensives, conditions, delai retractation, depot garantie.',
  '<h1>Compromis de Vente Immobilier : Modele et Clauses 2025</h1><p>Le compromis de vente est l''avant-contrat qui engage vendeur et acheteur. Clauses essentielles a connaitre.</p><h2>Clauses Suspensives Essentielles</h2><p>Obtention pret bancaire, absence servitudes, droit preemption, diagnostics conformes. Protection acheteur et vendeur.</p>',
  'Compromis Vente Immobilier 2025 : Modele + Guide Complet',
  'Redigez votre compromis vente avec notre modele gratuit. Clauses suspensives, retractation, depot garantie. Protegez vos interets.',
  ARRAY['compromis vente', 'promesse vente', 'avant contrat', 'compromis immobilier', 'vente immobilier'],
  'Immobilier',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Demande de Conges : Modele Email et Lettre Professionnelle',
  'demande-conges-modele-email-lettre',
  'Modeles demande conges professionnels. Email, lettre formelle, conges payes, conge parental, conge sans solde.',
  '<h1>Demande de Conges : Modele Email et Lettre Professionnelle</h1><p>La demande de conges doit respecter certaines regles. Decouvrez comment formuler votre demande correctement.</p><h2>Delais de Demande</h2><p>Convention collective fixe delais. Generalement 1 mois avant pour conges ete. Employeur peut refuser si non respect ou raison valable.</p>',
  'Demande Conges : Modeles Email + Lettre Professionnelle',
  'Formulez votre demande conges avec nos modeles gratuits. Email, lettre, tous types conges. Ton professionnel, efficace, conforme.',
  ARRAY['demande conges', 'modele demande conges', 'email conges', 'lettre conges', 'demande conges payes'],
  'Emploi',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Reglement Interieur Entreprise : Modele Gratuit Conforme',
  'reglement-interieur-entreprise-modele-conforme',
  'Modele reglement interieur gratuit. Obligations entreprises +50 salaries, contenu obligatoire, affichage, sanctions.',
  '<h1>Reglement Interieur Entreprise : Modele Gratuit Conforme</h1><p>Le reglement interieur fixe les regles de discipline et securite dans l''entreprise. Obligatoire au-dela 50 salaries.</p><h2>Contenu Obligatoire</h2><p>Regles hygiene securite, sanctions disciplinaires, droits defense salarie, protection harcelement. Respect Code Travail imperatif.</p>',
  'Reglement Interieur : Modele Gratuit Conforme Code Travail',
  'Creez votre reglement interieur avec notre modele gratuit. Conforme Code Travail, clauses obligatoires, affichage. Pour entreprises +50 salaries.',
  ARRAY['reglement interieur', 'modele reglement interieur', 'reglement entreprise', 'reglement interieur gratuit'],
  'Entreprise',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'Contrat Alternance : Apprentissage vs Professionnalisation 2025',
  'contrat-alternance-apprentissage-professionnalisation-2025',
  'Guide contrats alternance 2025. Apprentissage vs professionnalisation, remuneration, duree, avantages, aides employeur.',
  '<h1>Contrat Alternance : Apprentissage vs Professionnalisation 2025</h1><p>Les contrats alternance combinent formation et travail. Decouvrez les differences entre apprentissage et professionnalisation.</p><h2>Contrat Apprentissage</h2><p>16-29 ans, diplome vise, remuneration selon age et annee, aides employeurs importantes, exoneration charges sociales.</p>',
  'Contrat Alternance 2025 : Guide Complet + Remunerations',
  'Choisissez votre contrat alternance avec notre guide 2025. Apprentissage vs pro, remunerations, aides, avantages. Simulateur salaire inclus.',
  ARRAY['contrat alternance', 'contrat apprentissage', 'contrat professionnalisation', 'alternance 2025', 'salaire alternance'],
  'Formation',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
),

(
  'PV Assemblee Generale : Modeles Gratuits SARL SAS Association',
  'pv-assemblee-generale-modeles-sarl-sas',
  'Modeles PV assemblee generale gratuits. AG ordinaire extraordinaire, SARL SAS association, mentions obligatoires.',
  '<h1>PV Assemblee Generale : Modeles Gratuits SARL SAS Association</h1><p>Le proces-verbal AG acte les decisions prises en assemblee. Formalisme strict et mentions obligatoires a respecter.</p><h2>Types Assemblees Generales</h2><p>AG ordinaire (decisions courantes annuelles), AG extraordinaire (modifications statuts), AG mixte (combinaison deux).</p>',
  'PV Assemblee Generale : Modeles Gratuits + Guide Redaction',
  'Redigez votre PV AG avec nos modeles gratuits. SARL, SAS, association : tous types. Mentions obligatoires, formalisme conforme.',
  ARRAY['pv assemblee generale', 'pv ag', 'proces verbal', 'modele pv', 'assemblee generale'],
  'Entreprise',
  true,
  NOW(),
  (SELECT id FROM auth.users LIMIT 1)
);