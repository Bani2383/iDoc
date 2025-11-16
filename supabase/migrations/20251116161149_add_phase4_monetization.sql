/*
  # Phase 4: Monétisation (Abonnements et Affiliation)

  1. Nouvelles Tables
    - `subscriptions` : Abonnements utilisateurs (iDoc Pro)
    - `transactions` : Historique des paiements
    - `affiliates` : Programme d'affiliation
    - `referrals` : Parrainages et commissions

  2. Modifications
    - Mise à jour de la table `payments` existante

  3. Sécurité
    - RLS activé sur toutes les tables
    - Données financières protégées
*/

-- Table des abonnements
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'CAD',
  type TEXT NOT NULL CHECK (type IN ('document', 'subscription', 'api')),
  document_id UUID REFERENCES generated_documents(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe ON transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Table des affiliés
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL(3, 2) DEFAULT 0.30,
  total_earnings_cents INTEGER DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  payout_email TEXT,
  payout_method TEXT CHECK (payout_method IN ('paypal', 'stripe', 'bank_transfer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own affiliate account"
  ON affiliates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own affiliate account"
  ON affiliates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliate account"
  ON affiliates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_affiliates_user ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_active ON affiliates(is_active);

-- Table des parrainages
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  commission_cents INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'canceled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliates
      WHERE affiliates.id = referrals.affiliate_id
      AND affiliates.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_user ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- Fonction pour générer un code de parrainage unique
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM affiliates WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour les statistiques d'affiliation
CREATE OR REPLACE FUNCTION update_affiliate_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    UPDATE affiliates
    SET 
      total_earnings_cents = total_earnings_cents + NEW.commission_cents,
      total_referrals = total_referrals + 1
    WHERE id = NEW.affiliate_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_affiliate_stats ON referrals;
CREATE TRIGGER trigger_update_affiliate_stats
  AFTER UPDATE OF status ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliate_stats();

-- Fonction pour vérifier si un utilisateur a un abonnement actif
CREATE OR REPLACE FUNCTION has_active_subscription(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = check_user_id
    AND status IN ('active', 'trialing')
    AND (current_period_end IS NULL OR current_period_end > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;