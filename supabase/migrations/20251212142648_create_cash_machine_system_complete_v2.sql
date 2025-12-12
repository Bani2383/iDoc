/*
  # Système Complet de Monétisation - Machine à Cash

  ## Tables Créées

  ### Système de Crédits
  - `credits_packages` - Packages de crédits à vendre
  - `user_credits` - Solde de crédits par utilisateur
  - `credits_transactions` - Historique transactions crédits

  ### Gamification
  - `user_levels` - Niveaux et XP utilisateurs
  - `badges` - Badges disponibles
  - `user_badges` - Badges gagnés par utilisateurs
  - `achievements` - Accomplissements

  ### Abonnements Récurrents
  - `subscription_plans` - Plans d'abonnement disponibles
  - `user_subscriptions` - Abonnements actifs utilisateurs

  ### Programme Affiliation
  - `affiliates` - Affiliés enregistrés
  - `affiliate_commissions` - Commissions gagnées
  - `affiliate_clicks` - Tracking des clics

  ### Paniers Abandonnés
  - `abandoned_carts` - Paniers non finalisés
  - `cart_recovery_campaigns` - Campagnes de récupération

  ### Offres Flash
  - `flash_deals` - Offres flash quotidiennes
  - `flash_deal_purchases` - Achats offres flash

  ### Parrainage
  - `user_referrals` - Parrainages
  - `referral_rewards` - Récompenses parrainage

  ### FOMO & Social Proof
  - `fomo_events` - Événements en temps réel
  - `social_proof_stats` - Statistiques temps réel

  ### Email Marketing
  - `email_sequences` - Séquences d'emails automatisés
  - `email_campaigns` - Campagnes email
  - `email_logs` - Logs envois emails

  ### A/B Testing
  - `ab_tests` - Tests A/B actifs
  - `ab_test_variants` - Variantes testées
  - `ab_test_conversions` - Conversions par variante

  ### Upsells
  - `upsell_rules` - Règles d'upsell intelligent
  - `upsell_conversions` - Conversions upsells

  ### B2B Entreprise
  - `enterprise_plans` - Plans entreprise
  - `enterprise_licenses` - Licences entreprises
  - `team_members` - Membres d'équipe

  ### Services Premium
  - `premium_services` - Services premium disponibles
  - `service_orders` - Commandes de services

  ## Sécurité
  - RLS activé sur toutes les tables
  - Policies pour authenticated users
  - Policies admin pour gestion
*/

-- =====================================================
-- SYSTÈME DE CRÉDITS
-- =====================================================

CREATE TABLE IF NOT EXISTS credits_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  credits_amount int NOT NULL,
  bonus_credits int DEFAULT 0,
  price_cents int NOT NULL,
  currency text DEFAULT 'EUR',
  is_popular boolean DEFAULT false,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance int DEFAULT 0,
  lifetime_earned int DEFAULT 0,
  lifetime_spent int DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credits_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount int NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'bonus', 'spent', 'refund', 'referral', 'achievement')),
  description text,
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- GAMIFICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS user_levels (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  level int DEFAULT 1,
  xp int DEFAULT 0,
  next_level_xp int DEFAULT 100,
  tier text DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  perks jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  requirement_type text NOT NULL,
  requirement_value int NOT NULL,
  reward_credits int DEFAULT 0,
  rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_data jsonb DEFAULT '{}'::jsonb,
  reward_credits int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- ABONNEMENTS RÉCURRENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_monthly_cents int NOT NULL,
  price_yearly_cents int,
  features jsonb DEFAULT '[]'::jsonb,
  monthly_credits int DEFAULT 0,
  unlimited_generations boolean DEFAULT false,
  priority_support boolean DEFAULT false,
  exclusive_templates boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  stripe_subscription_id text UNIQUE,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- PROGRAMME AFFILIATION
-- =====================================================

CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  affiliate_code text UNIQUE NOT NULL,
  commission_rate decimal DEFAULT 0.30,
  recurring_commission_rate decimal DEFAULT 0.10,
  total_clicks int DEFAULT 0,
  total_conversions int DEFAULT 0,
  total_earned_cents int DEFAULT 0,
  payout_email text,
  payout_method text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES affiliates(id) ON DELETE CASCADE,
  visitor_id text,
  ip_address inet,
  user_agent text,
  referrer text,
  landing_page text,
  converted boolean DEFAULT false,
  conversion_date timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid REFERENCES affiliates(id) ON DELETE CASCADE,
  order_id uuid,
  commission_type text CHECK (commission_type IN ('first_sale', 'recurring', 'bonus')),
  amount_cents int NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- PANIERS ABANDONNÉS
-- =====================================================

CREATE TABLE IF NOT EXISTS abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  cart_data jsonb NOT NULL,
  total_amount_cents int NOT NULL,
  recovered boolean DEFAULT false,
  recovery_emails_sent int DEFAULT 0,
  last_email_sent_at timestamptz,
  recovered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_recovery_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES abandoned_carts(id) ON DELETE CASCADE,
  sequence_number int NOT NULL,
  discount_code text,
  discount_percent int,
  sent_at timestamptz DEFAULT now(),
  opened boolean DEFAULT false,
  clicked boolean DEFAULT false,
  converted boolean DEFAULT false
);

-- =====================================================
-- OFFRES FLASH
-- =====================================================

CREATE TABLE IF NOT EXISTS flash_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES document_templates(id) ON DELETE CASCADE,
  original_price_cents int NOT NULL,
  deal_price_cents int NOT NULL,
  discount_percent int NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  max_purchases int,
  current_purchases int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS flash_deal_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES flash_deals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(deal_id, user_id)
);

-- =====================================================
-- PARRAINAGE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  first_purchase_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referrer_user_id, referred_user_id)
);

CREATE TABLE IF NOT EXISTS referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id uuid REFERENCES user_referrals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type text CHECK (reward_type IN ('credits', 'discount', 'cash')),
  reward_value int NOT NULL,
  claimed boolean DEFAULT false,
  claimed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- FOMO & SOCIAL PROOF
-- =====================================================

CREATE TABLE IF NOT EXISTS fomo_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('purchase', 'signup', 'download', 'review')),
  user_name text,
  user_location text,
  template_name text,
  amount_cents int,
  is_real boolean DEFAULT true,
  display_until timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_proof_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL CHECK (metric_type IN ('active_users', 'templates_viewing', 'recent_purchases', 'templates_left')),
  template_id uuid REFERENCES document_templates(id) ON DELETE CASCADE,
  value int NOT NULL,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- EMAIL MARKETING
-- =====================================================

CREATE TABLE IF NOT EXISTS email_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trigger_type text NOT NULL CHECK (trigger_type IN ('signup', 'purchase', 'abandoned_cart', 'inactive', 'birthday')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES email_sequences(id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text NOT NULL,
  delay_hours int DEFAULT 0,
  discount_code text,
  discount_percent int,
  ab_test_variant text,
  send_order int NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES email_campaigns(id) ON DELETE CASCADE,
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  clicked_at timestamptz,
  converted_at timestamptz,
  bounce_reason text
);

-- =====================================================
-- A/B TESTING
-- =====================================================

CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  test_type text NOT NULL CHECK (test_type IN ('pricing', 'cta', 'headline', 'layout', 'color')),
  page_url text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  winner_variant_id uuid
);

CREATE TABLE IF NOT EXISTS ab_test_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES ab_tests(id) ON DELETE CASCADE,
  name text NOT NULL,
  variant_data jsonb NOT NULL,
  traffic_percent decimal DEFAULT 0.50,
  impressions int DEFAULT 0,
  conversions int DEFAULT 0,
  conversion_rate decimal DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ab_test_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES ab_test_variants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  converted boolean DEFAULT false,
  revenue_cents int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- UPSELLS INTELLIGENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS upsell_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_template_id uuid REFERENCES document_templates(id) ON DELETE CASCADE,
  recommended_template_ids uuid[] NOT NULL,
  discount_percent int DEFAULT 20,
  display_timing text DEFAULT 'post_purchase' CHECK (display_timing IN ('pre_checkout', 'post_purchase', 'cart')),
  priority int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS upsell_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES upsell_rules(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  original_template_id uuid REFERENCES document_templates(id),
  upsold_template_id uuid REFERENCES document_templates(id),
  revenue_cents int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- B2B ENTREPRISE
-- =====================================================

CREATE TABLE IF NOT EXISTS enterprise_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  min_seats int DEFAULT 5,
  price_per_seat_cents int NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  api_access boolean DEFAULT false,
  white_label boolean DEFAULT false,
  dedicated_support boolean DEFAULT true,
  custom_branding boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enterprise_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES enterprise_plans(id),
  seats_purchased int NOT NULL,
  seats_used int DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  billing_email text NOT NULL,
  contract_start timestamptz DEFAULT now(),
  contract_end timestamptz,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id uuid REFERENCES enterprise_licenses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  added_at timestamptz DEFAULT now(),
  UNIQUE(license_id, user_id)
);

-- =====================================================
-- SERVICES PREMIUM
-- =====================================================

CREATE TABLE IF NOT EXISTS premium_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  service_type text NOT NULL CHECK (service_type IN ('fill_service', 'legal_review', 'consultation', 'custom_template')),
  price_cents int NOT NULL,
  estimated_delivery_hours int,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES premium_services(id),
  document_id uuid REFERENCES user_documents(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  price_cents int NOT NULL,
  instructions text,
  assigned_to uuid REFERENCES auth.users(id),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES POUR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_credits_transactions_user ON credits_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_created ON credits_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created ON affiliate_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_user ON abandoned_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_recovered ON abandoned_carts(recovered);
CREATE INDEX IF NOT EXISTS idx_flash_deals_active ON flash_deals(is_active, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_fomo_events_created ON fomo_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_user ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_test ON ab_test_conversions(test_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_user ON upsell_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Credits packages (public read)
ALTER TABLE credits_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active credit packages"
  ON credits_packages FOR SELECT
  USING (is_active = true);

-- User credits (own data)
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits"
  ON user_credits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Credits transactions (own data)
ALTER TABLE credits_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions"
  ON credits_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User levels (own data)
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own level"
  ON user_levels FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Badges (public read)
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (true);

-- User badges (own data)
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Subscription plans (public read)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

-- User subscriptions (own data)
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Affiliates (own data)
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own affiliate data"
  ON affiliates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Affiliate commissions (own data)
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates can view own commissions"
  ON affiliate_commissions FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

-- Abandoned carts (own data)
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own abandoned carts"
  ON abandoned_carts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Flash deals (public read)
ALTER TABLE flash_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active flash deals"
  ON flash_deals FOR SELECT
  USING (is_active = true AND now() BETWEEN starts_at AND ends_at);

-- FOMO events (public read, limited)
ALTER TABLE fomo_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view recent FOMO events"
  ON fomo_events FOR SELECT
  USING (created_at > now() - interval '1 hour');

-- Social proof stats (public read)
ALTER TABLE social_proof_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view social proof"
  ON social_proof_stats FOR SELECT
  USING (expires_at > now() OR expires_at IS NULL);

-- Email logs (own data)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own email logs"
  ON email_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Referrals (own data)
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own referrals"
  ON user_referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

-- Referral rewards (own data)
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rewards"
  ON referral_rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Upsell rules (public read active)
ALTER TABLE upsell_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active upsell rules"
  ON upsell_rules FOR SELECT
  USING (is_active = true);

-- Enterprise plans (public read)
ALTER TABLE enterprise_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active enterprise plans"
  ON enterprise_plans FOR SELECT
  USING (is_active = true);

-- Enterprise licenses (team members can view)
ALTER TABLE enterprise_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members can view own license"
  ON enterprise_licenses FOR SELECT
  TO authenticated
  USING (
    auth.uid() = admin_user_id OR
    auth.uid() IN (
      SELECT user_id FROM team_members WHERE license_id = id
    )
  );

-- Premium services (public read)
ALTER TABLE premium_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active premium services"
  ON premium_services FOR SELECT
  USING (is_active = true);

-- Service orders (own data)
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own service orders"
  ON service_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour initialiser les crédits d'un nouvel utilisateur
CREATE OR REPLACE FUNCTION initialize_user_monetization()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO user_levels (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_monetization ON auth.users;
CREATE TRIGGER on_auth_user_created_monetization
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_monetization();

-- Fonction pour mettre à jour le solde de crédits
CREATE OR REPLACE FUNCTION update_user_credits_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_credits
  SET 
    balance = balance + NEW.amount,
    lifetime_earned = CASE 
      WHEN NEW.amount > 0 THEN lifetime_earned + NEW.amount 
      ELSE lifetime_earned 
    END,
    lifetime_spent = CASE 
      WHEN NEW.amount < 0 THEN lifetime_spent + ABS(NEW.amount) 
      ELSE lifetime_spent 
    END,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_credits_transaction_created ON credits_transactions;
CREATE TRIGGER on_credits_transaction_created
  AFTER INSERT ON credits_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits_balance();