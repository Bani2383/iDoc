/*
  # Fix RLS Auth Performance - Simple User-owned Tables

  1. Performance Optimization
    - Replace auth.uid() with (select auth.uid()) in RLS policies
    - Only fixes simple user-owned resource policies
    - Admin policies use subquery on user_profiles

  2. Tables Fixed
    - achievements, credit_purchases, user_activity
    - purchases, transactions, subscriptions
    - flash_deal_purchases, user_credits
    - credits_transactions, user_levels, user_badges
    - user_subscriptions, affiliates, abandoned_carts
    - email_logs, user_referrals, referral_rewards
    - service_orders, team_members
*/

-- achievements
DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;
CREATE POLICY "Users can view own achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- credit_purchases  
DROP POLICY IF EXISTS "Users can insert own credit purchases" ON public.credit_purchases;
CREATE POLICY "Users can insert own credit purchases"
  ON public.credit_purchases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- subscriptions
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- flash_deal_purchases
DROP POLICY IF EXISTS "Users can create own flash deal purchases" ON public.flash_deal_purchases;
CREATE POLICY "Users can create own flash deal purchases"
  ON public.flash_deal_purchases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own flash deal purchases" ON public.flash_deal_purchases;
CREATE POLICY "Users can view own flash deal purchases"
  ON public.flash_deal_purchases FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- transactions
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- purchases
DROP POLICY IF EXISTS "Users can insert own purchases" ON public.purchases;
CREATE POLICY "Users can insert own purchases"
  ON public.purchases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- user_activity
DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity;
CREATE POLICY "Users can insert own activity"
  ON public.user_activity FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- team_members
DROP POLICY IF EXISTS "Team members can view own team" ON public.team_members;
CREATE POLICY "Team members can view own team"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_credits
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
CREATE POLICY "Users can update own credits"
  ON public.user_credits FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own credits" ON public.user_credits;
CREATE POLICY "Users can view own credits"
  ON public.user_credits FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- credits_transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON public.credits_transactions;
CREATE POLICY "Users can view own transactions"
  ON public.credits_transactions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_levels
DROP POLICY IF EXISTS "Users can view own level" ON public.user_levels;
CREATE POLICY "Users can view own level"
  ON public.user_levels FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_badges
DROP POLICY IF EXISTS "Users can view own badges" ON public.user_badges;
CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_subscriptions
DROP POLICY IF EXISTS "Users can create own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can create own subscriptions"
  ON public.user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can update own subscriptions"
  ON public.user_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.user_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- affiliates
DROP POLICY IF EXISTS "Users can view own affiliate data" ON public.affiliates;
CREATE POLICY "Users can view own affiliate data"
  ON public.affiliates FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- abandoned_carts
DROP POLICY IF EXISTS "Users can create own abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Users can create own abandoned carts"
  ON public.abandoned_carts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Users can delete own abandoned carts"
  ON public.abandoned_carts FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Users can update own abandoned carts"
  ON public.abandoned_carts FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Users can view own abandoned carts"
  ON public.abandoned_carts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- email_logs
DROP POLICY IF EXISTS "Users can view own email logs" ON public.email_logs;
CREATE POLICY "Users can view own email logs"
  ON public.email_logs FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_referrals
DROP POLICY IF EXISTS "Users can view own referrals" ON public.user_referrals;
CREATE POLICY "Users can view own referrals"
  ON public.user_referrals FOR SELECT
  TO authenticated
  USING (referrer_user_id = (select auth.uid()));

-- referral_rewards
DROP POLICY IF EXISTS "Users can view own rewards" ON public.referral_rewards;
CREATE POLICY "Users can view own rewards"
  ON public.referral_rewards FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- service_orders
DROP POLICY IF EXISTS "Users can create own service orders" ON public.service_orders;
CREATE POLICY "Users can create own service orders"
  ON public.service_orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own service orders" ON public.service_orders;
CREATE POLICY "Users can update own service orders"
  ON public.service_orders FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own service orders" ON public.service_orders;
CREATE POLICY "Users can view own service orders"
  ON public.service_orders FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Admin policies with user_profiles check
DROP POLICY IF EXISTS "Admin can manage achievements" ON public.achievements;
CREATE POLICY "Admin can manage achievements"
  ON public.achievements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin manages volume analytics" ON public.volume_analytics;
CREATE POLICY "Admin manages volume analytics"
  ON public.volume_analytics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin can manage all flash deal purchases" ON public.flash_deal_purchases;
CREATE POLICY "Admin can manage all flash deal purchases"
  ON public.flash_deal_purchases FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin manages all subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admin manages all subscriptions"
  ON public.user_subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin manages all abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Admin manages all abandoned carts"
  ON public.abandoned_carts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin manages flash deals" ON public.flash_deals;
CREATE POLICY "Admin manages flash deals"
  ON public.flash_deals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin manages email logs" ON public.email_logs;
CREATE POLICY "Admin manages email logs"
  ON public.email_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin manages referral rewards" ON public.referral_rewards;
CREATE POLICY "Admin manages referral rewards"
  ON public.referral_rewards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin manages all service orders" ON public.service_orders;
CREATE POLICY "Admin manages all service orders"
  ON public.service_orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin can manage team members" ON public.team_members;
CREATE POLICY "Admin can manage team members"
  ON public.team_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view all traffic events" ON public.traffic_events;
CREATE POLICY "Admins can view all traffic events"
  ON public.traffic_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view all conversions" ON public.conversions;
CREATE POLICY "Admins can view all conversions"
  ON public.conversions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );
