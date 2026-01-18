/*
  # Système de Tracking Volume & Transactions

  1. Nouvelles Tables
    - `credit_packages` - Packs de crédits disponibles
    - `credit_purchases` - Historique achats crédits
    - `credit_transactions` - Utilisation des crédits
    - `volume_analytics` - Analytics temps réel
    - `fomo_events` - Événements pour FOMO notifications

  2. Sécurité
    - RLS activé sur toutes les tables
    - Policies pour utilisateurs authentifiés
    - Admin-only pour analytics

  3. Fonctionnalités
    - Tracking achats en temps réel
    - Historique complet transactions
    - Analytics pour dashboard
    - Système de référencement
*/

-- Table des packs de crédits disponibles
CREATE TABLE IF NOT EXISTS credit_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credits integer NOT NULL,
  price decimal(10,2) NOT NULL,
  bonus_credits integer DEFAULT 0,
  savings_percentage integer DEFAULT 0,
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
  ON credit_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage packages"
  ON credit_packages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Table des achats de crédits
CREATE TABLE IF NOT EXISTS credit_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid REFERENCES credit_packages(id),
  credits_purchased integer NOT NULL,
  bonus_credits integer DEFAULT 0,
  amount_paid decimal(10,2) NOT NULL,
  payment_method text,
  stripe_payment_id text,
  stripe_session_id text,
  referral_code text,
  is_guest boolean DEFAULT false,
  guest_email text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON credit_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert purchases"
  ON credit_purchases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all purchases"
  ON credit_purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Table des transactions de crédits (utilisation)
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_used integer NOT NULL,
  credits_balance_after integer NOT NULL,
  transaction_type text NOT NULL,
  document_id uuid,
  template_id uuid,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON credit_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions"
  ON credit_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Table des événements FOMO
CREATE TABLE IF NOT EXISTS fomo_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_name text,
  location text,
  document_name text,
  credits_amount integer,
  is_real boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fomo_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recent fomo events"
  ON fomo_events FOR SELECT
  USING (created_at > now() - interval '1 hour');

CREATE POLICY "System can insert fomo events"
  ON fomo_events FOR INSERT
  WITH CHECK (true);

-- Table analytics volume
CREATE TABLE IF NOT EXISTS volume_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  metric_type text NOT NULL,
  metric_value integer NOT NULL DEFAULT 0,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, metric_type)
);

ALTER TABLE volume_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics"
  ON volume_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Ajout de colonnes crédits au profil utilisateur
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'credits_balance'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN credits_balance integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'total_credits_purchased'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN total_credits_purchased integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'total_credits_used'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN total_credits_used integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN referral_code text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'referred_by'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN referred_by text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'loyalty_tier'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN loyalty_tier text DEFAULT 'bronze';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'daily_streak'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN daily_streak integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_login_date'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_login_date date;
  END IF;
END $$;

-- Insertion des packs de crédits par défaut
INSERT INTO credit_packages (credits, price, bonus_credits, savings_percentage, is_popular, display_order, is_active)
VALUES
  (1, 0.49, 0, 0, false, 1, true),
  (5, 1.99, 0, 20, false, 2, true),
  (10, 2.99, 1, 40, true, 3, true),
  (25, 5.99, 3, 50, false, 4, true),
  (50, 8.99, 10, 60, false, 5, true),
  (100, 14.99, 20, 70, false, 6, true)
ON CONFLICT DO NOTHING;

-- Function pour créer code référencement unique
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function pour attribuer crédits gratuits signup
CREATE OR REPLACE FUNCTION grant_signup_credits()
RETURNS TRIGGER AS $$
BEGIN
  NEW.credits_balance := 3;
  NEW.referral_code := generate_referral_code();
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE user_profiles SET credits_balance = credits_balance + 3 WHERE referral_code = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour crédits signup
DROP TRIGGER IF EXISTS on_user_signup_grant_credits ON user_profiles;
CREATE TRIGGER on_user_signup_grant_credits
  BEFORE INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION grant_signup_credits();

-- Function pour update loyalty tier
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
DECLARE
  total_transactions integer;
BEGIN
  SELECT COUNT(*) INTO total_transactions FROM credit_transactions WHERE user_id = NEW.user_id;
  UPDATE user_profiles SET loyalty_tier = CASE
    WHEN total_transactions >= 100 THEN 'platinum'
    WHEN total_transactions >= 50 THEN 'gold'
    WHEN total_transactions >= 20 THEN 'silver'
    ELSE 'bronze'
  END WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour loyalty tier
DROP TRIGGER IF EXISTS update_tier_on_transaction ON credit_transactions;
CREATE TRIGGER update_tier_on_transaction AFTER INSERT ON credit_transactions FOR EACH ROW EXECUTE FUNCTION update_loyalty_tier();

-- Function pour logger événement FOMO
CREATE OR REPLACE FUNCTION log_fomo_event()
RETURNS TRIGGER AS $$
DECLARE
  user_name_val text;
  location_val text;
BEGIN
  SELECT full_name, country INTO user_name_val, location_val FROM user_profiles WHERE id = NEW.user_id;
  IF user_name_val IS NOT NULL THEN
    INSERT INTO fomo_events (event_type, user_name, location, credits_amount, is_real)
    VALUES ('purchase', LEFT(user_name_val, position(' ' in user_name_val || ' ')) || LEFT(SPLIT_PART(user_name_val, ' ', 2), 1) || '.', COALESCE(location_val, 'France'), NEW.credits_purchased + NEW.bonus_credits, true);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour FOMO
DROP TRIGGER IF EXISTS create_fomo_on_purchase ON credit_purchases;
CREATE TRIGGER create_fomo_on_purchase AFTER INSERT ON credit_purchases FOR EACH ROW WHEN (NEW.status = 'completed') EXECUTE FUNCTION log_fomo_event();

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_credit_purchases_user_id ON credit_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_created_at ON credit_purchases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_status ON credit_purchases(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fomo_events_created_at ON fomo_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_volume_analytics_date ON volume_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_profiles_loyalty_tier ON user_profiles(loyalty_tier);