/*
  # Ajout 20 templates SEO optimisés + Traductions EN
  
  Utilise la structure existante:
  - slug (au lieu de code)
  - name / name_en
  - meta_title_fr / meta_title_en
  - meta_description_fr / meta_description_en
*/

-- TEMPLATE 1: Attestation de résidence
INSERT INTO document_templates (
  slug, name, name_en, category, description, description_en,
  meta_title_fr, meta_title_en, meta_description_fr, meta_description_en,
  keywords, is_active, language, review_status,
  template_content, template_variables
) VALUES (
  'attestation-residence',
  'Attestation de résidence',
  'Proof of Residence',
  'personal',
  'Document certifiant votre adresse de résidence actuelle. Idéal pour démarches administratives, bancaires ou scolaires.',
  'Official document certifying your current residential address. Perfect for administrative, banking, or school procedures.',
  'Attestation de résidence - Modèle gratuit PDF | iDoc',
  'Proof of Residence - Free PDF Template | iDoc',
  'Créez votre attestation de résidence en 2 minutes pour 1,99$. Modèle professionnel, PDF instantané. Plus de 10,000 documents générés.',
  'Create your proof of residence in 2 minutes for $1.99. Professional template, instant PDF. Over 10,000 documents generated.',
  ARRAY['attestation résidence', 'preuve domicile', 'certificat résidence', 'proof of residence', 'address certificate'],
  true,
  'both',
  'published',
  'Je soussigné(e) {{full_name}}, né(e) le {{birth_date}}, atteste sur l''honneur résider à l''adresse suivante : {{address}}, {{postal_code}} {{city}}, depuis le {{residence_since}}. Fait à {{city}}, le {{date}}.',
  '[{"name": "full_name", "type": "text", "label": "Nom complet", "required": true}, {"name": "birth_date", "type": "date", "label": "Date de naissance", "required": true}, {"name": "address", "type": "text", "label": "Adresse", "required": true}, {"name": "postal_code", "type": "text", "label": "Code postal", "required": true}, {"name": "city", "type": "text", "label": "Ville", "required": true}, {"name": "residence_since", "type": "date", "label": "Résident depuis", "required": true}]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active,
  review_status = EXCLUDED.review_status;

-- TEMPLATE 2-20: Batch insert
INSERT INTO document_templates (slug, name, name_en, category, description, description_en, meta_title_fr, meta_title_en, meta_description_fr, meta_description_en, keywords, is_active, language, review_status, template_content) VALUES
  ('lettre-motivation', 'Lettre de motivation', 'Cover Letter', 'professional', 'Lettre professionnelle pour candidature emploi', 'Professional letter for job application', 'Lettre de motivation - Modèle professionnel | iDoc', 'Cover Letter - Professional Template | iDoc', 'Créez une lettre de motivation convaincante en 3 minutes pour 1,99$. Modèle personnalisable, format professionnel.', 'Create a convincing cover letter in 3 minutes for $1.99. Customizable template, professional format.', ARRAY['lettre motivation', 'cover letter', 'candidature emploi'], true, 'both', 'published', 'Madame, Monsieur, C''est avec un vif intérêt que je vous soumets ma candidature...'),
  
  ('resiliation-abonnement', 'Résiliation d''abonnement', 'Subscription Cancellation', 'personal', 'Lettre pour résilier tout type d''abonnement', 'Letter to cancel any subscription', 'Résiliation abonnement - Modèle officiel | iDoc', 'Subscription Cancellation - Official Template | iDoc', 'Résiliez votre abonnement en 2 minutes pour 1,99$. Modèle légal pour internet, mobile, salle de sport.', 'Cancel your subscription in 2 minutes for $1.99. Legal template for internet, mobile, gym.', ARRAY['résiliation', 'annulation abonnement', 'cancel subscription'], true, 'both', 'published', 'Objet : Résiliation de mon abonnement. Je vous informe de ma décision de résilier...'),
  
  ('lettre-plainte', 'Lettre de plainte', 'Complaint Letter', 'personal', 'Lettre formelle de plainte ou réclamation', 'Formal complaint or claim letter', 'Lettre de plainte - Modèle formel | iDoc', 'Complaint Letter - Formal Template | iDoc', 'Rédigez une lettre de plainte efficace pour 1,99$. Modèle professionnel pour toute réclamation.', 'Write an effective complaint letter for $1.99. Professional template for any claim.', ARRAY['lettre plainte', 'réclamation', 'complaint letter'], true, 'both', 'published', 'Objet : Réclamation concernant... Je me permets de vous écrire afin de...'),
  
  ('attestation-travail', 'Attestation de travail', 'Employment Certificate', 'professional', 'Certificat d''emploi officiel', 'Official employment certificate', 'Attestation de travail - Certificat employeur | iDoc', 'Employment Certificate - Employer Document | iDoc', 'Attestation de travail professionnelle pour 1,99$. Certificat d''emploi conforme et personnalisable.', 'Professional employment certificate for $1.99. Compliant and customizable employer document.', ARRAY['attestation travail', 'certificat emploi', 'employment certificate'], true, 'both', 'published', 'Je soussigné atteste que M./Mme {{name}} est employé(e) dans notre entreprise...'),
  
  ('demande-conge', 'Demande de congé', 'Leave Request', 'professional', 'Demande officielle de congé ou vacances', 'Official leave or vacation request', 'Demande de congé - Modèle employé | iDoc', 'Leave Request - Employee Template | iDoc', 'Demande de congé formelle pour 1,99$. Modèle conforme pour toute demande de vacances.', 'Formal leave request for $1.99. Compliant template for any vacation request.', ARRAY['demande congé', 'vacances', 'leave request'], true, 'both', 'published', 'Objet : Demande de congés. Je sollicite par la présente l''autorisation de...'),
  
  ('cv-professionnel', 'CV Professionnel', 'Professional Resume', 'professional', 'Curriculum vitae moderne et professionnel', 'Modern and professional resume', 'CV Professionnel - Modèle moderne | iDoc', 'Professional Resume - Modern Template | iDoc', 'CV professionnel moderne pour 1,99$. Format ATS-compatible, design épuré.', 'Modern professional resume for $1.99. ATS-compatible format, clean design.', ARRAY['cv', 'curriculum vitae', 'resume', 'professional cv'], true, 'both', 'published', '{{name}}\n{{email}} | {{phone}}\n\nEXPÉRIENCE PROFESSIONNELLE\n{{experience}}'),
  
  ('facture-professionnelle', 'Facture professionnelle', 'Professional Invoice', 'professional', 'Facture pour prestations de services', 'Invoice for service provision', 'Facture professionnelle - Modèle comptable | iDoc', 'Professional Invoice - Accounting Template | iDoc', 'Facture professionnelle conforme pour 1,99$. Modèle comptable avec tous les éléments obligatoires.', 'Compliant professional invoice for $1.99. Accounting template with all required elements.', ARRAY['facture', 'invoice', 'facturation'], true, 'both', 'published', 'FACTURE N° {{invoice_number}}\nDate : {{date}}\nClient : {{client_name}}'),
  
  ('devis', 'Devis', 'Quote', 'professional', 'Devis détaillé pour services ou produits', 'Detailed quote for services or products', 'Devis professionnel - Modèle détaillé | iDoc', 'Professional Quote - Detailed Template | iDoc', 'Devis professionnel pour 1,99$. Modèle détaillé avec conditions et validité.', 'Professional quote for $1.99. Detailed template with terms and validity.', ARRAY['devis', 'quote', 'estimation'], true, 'both', 'published', 'DEVIS N° {{quote_number}}\nValidité : {{validity}}\nDésignation : {{description}}'),
  
  ('contrat-prestation', 'Contrat de prestation', 'Service Agreement', 'professional', 'Contrat simple de prestation de services', 'Simple service provision contract', 'Contrat de prestation - Modèle légal | iDoc', 'Service Agreement - Legal Template | iDoc', 'Contrat de prestation simple pour 1,99$. Modèle juridique pour freelances et prestataires.', 'Simple service contract for $1.99. Legal template for freelancers and service providers.', ARRAY['contrat prestation', 'service agreement', 'freelance contract'], true, 'both', 'published', 'CONTRAT DE PRESTATION DE SERVICES\nEntre : {{client}}\nEt : {{provider}}'),
  
  ('attestation-hebergement', 'Attestation d''hébergement', 'Hosting Certificate', 'personal', 'Document certifiant l''hébergement', 'Document certifying accommodation', 'Attestation hébergement - Certificat officiel | iDoc', 'Hosting Certificate - Official Document | iDoc', 'Attestation d''hébergement pour 1,99$. Document officiel pour démarches administratives.', 'Hosting certificate for $1.99. Official document for administrative procedures.', ARRAY['attestation hébergement', 'hosting certificate', 'hébergement'], true, 'both', 'published', 'Je soussigné(e) {{host_name}} certifie héberger {{guest_name}} à mon domicile...'),
  
  ('lettre-recommandation', 'Lettre de recommandation', 'Recommendation Letter', 'professional', 'Recommandation professionnelle ou académique', 'Professional or academic recommendation', 'Lettre de recommandation - Modèle professionnel | iDoc', 'Recommendation Letter - Professional Template | iDoc', 'Lettre de recommandation pour 1,99$. Modèle convaincant pour employeurs et universités.', 'Recommendation letter for $1.99. Convincing template for employers and universities.', ARRAY['recommandation', 'recommendation letter', 'référence'], true, 'both', 'published', 'C''est avec plaisir que je recommande {{name}} pour {{position}}...'),
  
  ('demande-stage', 'Demande de stage', 'Internship Request', 'academic', 'Lettre de demande de stage en entreprise', 'Internship request letter', 'Demande de stage - Lettre étudiante | iDoc', 'Internship Request - Student Letter | iDoc', 'Demande de stage professionnelle pour 1,99$. Lettre convaincante pour décrocher votre stage.', 'Professional internship request for $1.99. Convincing letter to get your internship.', ARRAY['demande stage', 'internship request', 'stage étudiant'], true, 'both', 'published', 'Objet : Demande de stage. Actuellement étudiant(e) en {{program}}...'),
  
  ('autorisation-parentale', 'Autorisation parentale', 'Parental Consent', 'personal', 'Autorisation des parents pour mineur', 'Parental authorization for minor', 'Autorisation parentale - Document officiel | iDoc', 'Parental Consent - Official Document | iDoc', 'Autorisation parentale pour 1,99$. Document officiel pour sorties et activités.', 'Parental consent for $1.99. Official document for outings and activities.', ARRAY['autorisation parentale', 'parental consent', 'mineur'], true, 'both', 'published', 'Je soussigné(e) {{parent_name}} autorise mon enfant {{child_name}} à...'),
  
  ('declaration-honneur', 'Déclaration sur l''honneur', 'Sworn Statement', 'personal', 'Déclaration sous serment générique', 'Generic sworn statement', 'Déclaration sur l''honneur - Attestation officielle | iDoc', 'Sworn Statement - Official Attestation | iDoc', 'Déclaration sur l''honneur pour 1,99$. Attestation formelle pour toute situation.', 'Sworn statement for $1.99. Formal attestation for any situation.', ARRAY['déclaration honneur', 'sworn statement', 'attestation'], true, 'both', 'published', 'Je soussigné(e) {{name}} déclare sur l''honneur que...'),
  
  ('bon-commande', 'Bon de commande', 'Purchase Order', 'professional', 'Bon de commande professionnel', 'Professional purchase order', 'Bon de commande - Document commercial | iDoc', 'Purchase Order - Commercial Document | iDoc', 'Bon de commande pour 1,99$. Document commercial conforme et traçable.', 'Purchase order for $1.99. Compliant and traceable commercial document.', ARRAY['bon commande', 'purchase order', 'commande'], true, 'both', 'published', 'BON DE COMMANDE N° {{order_number}}\nFournisseur : {{supplier}}'),
  
  ('note-service', 'Note de service', 'Memo', 'professional', 'Communication interne professionnelle', 'Professional internal communication', 'Note de service - Communication interne | iDoc', 'Memo - Internal Communication | iDoc', 'Note de service pour 1,99$. Communication interne formelle et claire.', 'Service memo for $1.99. Formal and clear internal communication.', ARRAY['note service', 'memo', 'communication interne'], true, 'both', 'published', 'NOTE DE SERVICE\nDe : {{sender}}\nObjet : {{subject}}'),
  
  ('lettre-proprietaire', 'Lettre au propriétaire', 'Letter to Landlord', 'personal', 'Communication locataire-propriétaire', 'Tenant-landlord communication', 'Lettre au propriétaire - Modèle locataire | iDoc', 'Letter to Landlord - Tenant Template | iDoc', 'Lettre au propriétaire pour 1,99$. Communication formelle pour toute demande.', 'Letter to landlord for $1.99. Formal communication for any request.', ARRAY['lettre propriétaire', 'landlord letter', 'locataire'], true, 'both', 'published', 'Objet : {{subject}}\nMonsieur/Madame le propriétaire, Je vous écris concernant...'),
  
  ('plan-voyage', 'Plan de voyage', 'Travel Itinerary', 'personal', 'Itinéraire de voyage détaillé', 'Detailed travel itinerary', 'Plan de voyage - Itinéraire détaillé | iDoc', 'Travel Itinerary - Detailed Plan | iDoc', 'Plan de voyage pour 1,99$. Itinéraire détaillé pour visas et démarches.', 'Travel itinerary for $1.99. Detailed plan for visas and procedures.', ARRAY['plan voyage', 'travel itinerary', 'itinéraire'], true, 'both', 'published', 'ITINÉRAIRE DE VOYAGE\nVoyageur : {{traveler_name}}\nDestination : {{destination}}'),
  
  ('attestation-presence', 'Attestation de présence', 'Attendance Certificate', 'professional', 'Certificat de présence à un événement', 'Certificate of attendance at event', 'Attestation de présence - Certificat officiel | iDoc', 'Attendance Certificate - Official Document | iDoc', 'Attestation de présence pour 1,99$. Certificat officiel pour formations et événements.', 'Attendance certificate for $1.99. Official certificate for training and events.', ARRAY['attestation présence', 'attendance certificate', 'présence'], true, 'both', 'published', 'Je soussigné(e) certifie la présence de {{name}} à {{event}}...'),
  
  ('demande-remboursement', 'Demande de remboursement', 'Refund Request', 'personal', 'Lettre de demande de remboursement', 'Refund request letter', 'Demande de remboursement - Lettre formelle | iDoc', 'Refund Request - Formal Letter | iDoc', 'Demande de remboursement pour 1,99$. Lettre formelle pour toute réclamation financière.', 'Refund request for $1.99. Formal letter for any financial claim.', ARRAY['remboursement', 'refund request', 'réclamation'], true, 'both', 'published', 'Objet : Demande de remboursement. Suite à {{reason}}, je sollicite le remboursement...')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active;
