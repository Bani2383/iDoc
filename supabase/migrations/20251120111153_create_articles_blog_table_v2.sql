/*
  # Module Articles / Blog iDoc

  1. Nouvelle table
    - `articles` avec tous les champs nécessaires
    - Relation avec auth.users pour auteur
    - Support SEO, tags, catégories

  2. Sécurité
    - Enable RLS
    - Public peut lire articles publiés
    - Admin peut tout gérer
    - Auteur voit ses brouillons

  3. Performance
    - Indexes sur slug, published, category, tags
*/

-- Créer table articles
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content_html text NOT NULL,
  content_markdown text,
  related_template text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  meta_title text,
  meta_description text,
  featured_image_url text,
  view_count integer DEFAULT 0,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: articles publiés sont publics
CREATE POLICY "Public peut lire articles publiés"
  ON articles FOR SELECT
  USING (is_published = true);

-- Policy: admins peuvent tout faire
CREATE POLICY "Admins gèrent tous les articles"
  ON articles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: auteurs voient leurs brouillons
CREATE POLICY "Auteurs voient leurs brouillons"
  ON articles FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published, published_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();

-- Fonction incrémenter vues (accessible sans auth)
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET view_count = view_count + 1
  WHERE slug = article_slug AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Articles de démonstration
INSERT INTO articles (slug, title, excerpt, content_html, content_markdown, related_template, category, tags, meta_title, meta_description, is_published, published_at)
VALUES
(
  'comment-rediger-cv-professionnel-2024',
  'Comment rédiger un CV professionnel en 2024',
  'Découvrez les meilleures pratiques pour créer un CV qui attire l''attention des recruteurs en 2024.',
  '<h2>Introduction</h2><p>Le CV reste votre outil principal pour décrocher un entretien. Voici comment le rendre irrésistible.</p><h2>Structure optimale</h2><p>1. En-tête clair avec coordonnées</p><p>2. Résumé professionnel percutant</p><p>3. Expériences en ordre antichronologique</p><h2>Erreurs à éviter</h2><p>- Photo non professionnelle</p><p>- Fautes d''orthographe</p><p>- CV trop long (>2 pages)</p><h2>Conclusion</h2><p>Utilisez notre modèle professionnel pour créer votre CV en 5 minutes.</p>',
  '## Introduction\n\nLe CV reste votre outil principal...',
  'cv-professionnel',
  'emploi',
  ARRAY['CV', 'Emploi', 'Carrière', 'Recrutement'],
  'Comment rédiger un CV professionnel en 2024 | iDoc',
  'Guide complet pour créer un CV professionnel qui se démarque. Conseils, exemples et modèle prêt à l''emploi.',
  true,
  now()
),
(
  'lettre-motivation-visa-etudiant-conseils',
  'Lettre de motivation visa étudiant : 7 conseils essentiels',
  'Les 7 éléments indispensables d''une lettre de motivation pour visa étudiant réussie.',
  '<h2>Pourquoi la lettre est cruciale</h2><p>Votre lettre de motivation peut faire la différence entre acceptation et refus.</p><h2>Les 7 éléments clés</h2><ol><li>Projet d''études clair et cohérent</li><li>Preuves financières solides</li><li>Engagement de retour</li><li>Liens avec pays d''origine</li><li>Choix de l''établissement justifié</li><li>Plan de carrière post-études</li><li>Ton professionnel et sincère</li></ol><h2>Erreurs fatales</h2><p>- Copier-coller un modèle générique</p><p>- Oublier les preuves financières</p><p>- Négliger l''engagement de retour</p>',
  '## Pourquoi la lettre est cruciale...',
  'lettre-motivation-visa-etudiant',
  'immigration',
  ARRAY['Visa étudiant', 'Immigration', 'Études à l''étranger'],
  'Lettre motivation visa étudiant : 7 conseils | iDoc',
  'Comment rédiger une lettre de motivation convaincante pour votre demande de visa étudiant. Guide complet avec exemples.',
  true,
  now()
),
(
  'facture-freelance-mentions-obligatoires',
  'Facture freelance : mentions obligatoires et bonnes pratiques',
  'Tout ce que vous devez savoir sur les mentions obligatoires d''une facture pour éviter les problèmes.',
  '<h2>Mentions obligatoires</h2><p>Une facture professionnelle doit contenir :</p><ul><li>Numéro de facture unique</li><li>Date d''émission et date d''échéance</li><li>Coordonnées complètes (émetteur et client)</li><li>Numéro SIRET / TVA</li><li>Description détaillée des prestations</li><li>Montants HT, TVA, TTC</li><li>Conditions de paiement</li><li>Pénalités de retard</li></ul><h2>Bonnes pratiques</h2><p>1. Numérotation chronologique</p><p>2. Émission immédiate après prestation</p><p>3. Conservation 10 ans minimum</p><h2>Outils</h2><p>Notre modèle de facture professionnel inclut automatiquement toutes les mentions légales.</p>',
  '## Mentions obligatoires...',
  'facture-professionnelle',
  'freelance',
  ARRAY['Facture', 'Freelance', 'Auto-entrepreneur', 'Comptabilité'],
  'Facture freelance : mentions obligatoires 2024 | iDoc',
  'Guide complet des mentions obligatoires sur une facture freelance. Évitez les erreurs et restez en conformité.',
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;