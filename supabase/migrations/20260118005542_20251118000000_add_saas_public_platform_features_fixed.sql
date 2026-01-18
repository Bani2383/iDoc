/*
  # Transformation iDoc en plateforme SaaS grand public internationale

  ## 1. Modèles multilingues
    - template_translations: traductions des modèles par langue
    - Chaque modèle peut avoir plusieurs traductions
    - Support de 30+ langues

  ## 2. Bundles/Packs
    - bundles: packs de documents (ex: Pack Étudiant)
    - bundle_items: documents inclus dans chaque bundle

  ## 3. Analytics & Tracking
    - analytics_events: événements de tracking (vues, clics, conversions)
    - ab_tests: tests A/B pour optimiser la conversion

  ## 4. Queue de génération
    - document_generation_queue: file d'attente pour génération asynchrone

  ## 5. Upsells
    - upsell_offers: offres d'upsell après achat
    - upsell_purchases: achats d'upsells

  ## Security
    - RLS activé sur toutes les tables
    - Clients voient leurs propres données
    - Admin a accès complet
*/

-- ================================================================
-- 0. EXTENSIONS DES TABLES EXISTANTES (À faire en premier)
-- ================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN is_public boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'default_language'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN default_language text DEFAULT 'fr';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'estimated_time_minutes'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN estimated_time_minutes int DEFAULT 5;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN difficulty_level text DEFAULT 'simple';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_templates' AND column_name = 'target_audience'
  ) THEN
    ALTER TABLE document_templates ADD COLUMN target_audience text[];
  END IF;
END $$;

-- ================================================================
-- 1. MODÈLES MULTILINGUES
-- ================================================================

CREATE TABLE IF NOT EXISTS template_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES document_templates(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  title text NOT NULL,
  description text,
  content_template text NOT NULL,
  fields_schema jsonb DEFAULT '[]',
  meta_tags jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(template_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_template_translations_template ON template_translations(template_id);
CREATE INDEX IF NOT EXISTS idx_template_translations_language ON template_translations(language_code);

ALTER TABLE template_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published template translations"
  ON template_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM document_templates
      WHERE document_templates.id = template_translations.template_id
      AND document_templates.is_public = true
    )
  );

CREATE POLICY "Admins can manage template translations"
  ON template_translations
  FOR ALL
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

-- ================================================================
-- 2. BUNDLES / PACKS
-- ================================================================

CREATE TABLE IF NOT EXISTS bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'CAD',
  discount_percentage numeric(5,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  category text,
  image_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundle_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid REFERENCES bundles(id) ON DELETE CASCADE NOT NULL,
  template_id uuid REFERENCES document_templates(id) ON DELETE CASCADE NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundle_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid REFERENCES bundles(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(bundle_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle ON bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_translations_bundle ON bundle_translations(bundle_id);

ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active bundles"
  ON bundles
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view bundle items"
  ON bundle_items
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view bundle translations"
  ON bundle_translations
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage bundles"
  ON bundles
  FOR ALL
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

CREATE POLICY "Admins can manage bundle items"
  ON bundle_items
  FOR ALL
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

CREATE POLICY "Admins can manage bundle translations"
  ON bundle_translations
  FOR ALL
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

-- ================================================================
-- 3. ANALYTICS & TRACKING
-- ================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  template_id uuid REFERENCES document_templates(id) ON DELETE SET NULL,
  bundle_id uuid REFERENCES bundles(id) ON DELETE SET NULL,
  page_url text,
  referrer text,
  device_type text,
  browser text,
  country text,
  language_code text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  variants jsonb NOT NULL,
  is_active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ab_test_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES ab_tests(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  variant_id text NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(test_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_template ON analytics_events(template_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_test ON ab_test_assignments(test_id);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can insert analytics events"
  ON analytics_events
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view active ab tests"
  ON ab_tests
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage ab tests"
  ON ab_tests
  FOR ALL
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

CREATE POLICY "System can manage ab test assignments"
  ON ab_test_assignments
  FOR ALL
  WITH CHECK (true);

-- ================================================================
-- 4. QUEUE DE GÉNÉRATION
-- ================================================================

CREATE TABLE IF NOT EXISTS document_generation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  template_id uuid REFERENCES document_templates(id) ON DELETE SET NULL,
  bundle_id uuid REFERENCES bundles(id) ON DELETE SET NULL,
  language_code text NOT NULL,
  form_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority int DEFAULT 0,
  attempts int DEFAULT 0,
  max_attempts int DEFAULT 3,
  error_message text,
  result_url text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generation_queue_status ON document_generation_queue(status);
CREATE INDEX IF NOT EXISTS idx_generation_queue_priority ON document_generation_queue(priority DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_generation_queue_user ON document_generation_queue(user_id);

ALTER TABLE document_generation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generation queue"
  ON document_generation_queue
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage generation queue"
  ON document_generation_queue
  FOR ALL
  WITH CHECK (true);

CREATE POLICY "Admins can view all generation queue"
  ON document_generation_queue
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- ================================================================
-- 5. UPSELLS
-- ================================================================

CREATE TABLE IF NOT EXISTS upsell_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'CAD',
  offer_type text NOT NULL,
  is_active boolean DEFAULT true,
  display_order int DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS upsell_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  purchase_id uuid REFERENCES purchases(id) ON DELETE SET NULL,
  upsell_offer_id uuid REFERENCES upsell_offers(id) ON DELETE SET NULL,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'CAD',
  status text NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_upsell_purchases_user ON upsell_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_purchase ON upsell_purchases(purchase_id);

ALTER TABLE upsell_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE upsell_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active upsell offers"
  ON upsell_offers
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage upsell offers"
  ON upsell_offers
  FOR ALL
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

CREATE POLICY "Users can view own upsell purchases"
  ON upsell_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert upsell purchases"
  ON upsell_purchases
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all upsell purchases"
  ON upsell_purchases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- ================================================================
-- 6. EXTENSION ADDITIONNELLE DE LA TABLE purchases
-- ================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'bundle_id'
  ) THEN
    ALTER TABLE purchases ADD COLUMN bundle_id uuid REFERENCES bundles(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'language_code'
  ) THEN
    ALTER TABLE purchases ADD COLUMN language_code text DEFAULT 'fr';
  END IF;
END $$;

-- ================================================================
-- 7. FONCTIONS UTILITAIRES
-- ================================================================

CREATE OR REPLACE FUNCTION increment_template_views(template_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE document_templates
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{views}',
    to_jsonb(COALESCE((metadata->>'views')::int, 0) + 1)
  )
  WHERE id = template_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_popular_templates(limit_count int DEFAULT 10, lang_code text DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  price numeric,
  views int,
  purchases int
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dt.id,
    COALESCE(tt.title, dt.title) as title,
    COALESCE(tt.description, dt.description) as description,
    dt.price,
    COALESCE((dt.metadata->>'views')::int, 0) as views,
    COUNT(p.id)::int as purchases
  FROM document_templates dt
  LEFT JOIN template_translations tt ON dt.id = tt.template_id AND tt.language_code = lang_code
  LEFT JOIN purchases p ON dt.id = p.template_id AND p.status = 'completed'
  WHERE dt.is_public = true
  GROUP BY dt.id, tt.title, tt.description, dt.title, dt.description, dt.price, dt.metadata
  ORDER BY purchases DESC, views DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;