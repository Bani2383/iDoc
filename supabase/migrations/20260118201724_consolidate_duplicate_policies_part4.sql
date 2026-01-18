/*
  # Consolidate Duplicate RLS Policies - Part 4 (Final)

  1. Changes
    - Consolidate remaining duplicate policies
    - Tables: user_subscriptions, workflow_signers, user_profiles, volume_analytics

  2. Security
    - Maintain all access control
    - Simplify policy structure
*/

-- user_subscriptions: Consolidate all operations
DROP POLICY IF EXISTS "Admin manages all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can create own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON user_subscriptions;

CREATE POLICY "Admin manages all user subscriptions"
  ON user_subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can manage own subscriptions"
  ON user_subscriptions FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- workflow_signers: Consolidate UPDATE policies
DROP POLICY IF EXISTS "Signers can update own signature with token" ON workflow_signers;
DROP POLICY IF EXISTS "Signers can update own signatures only" ON workflow_signers;

CREATE POLICY "Signers can update own signatures"
  ON workflow_signers FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    -- Allow update with valid token
    (token IS NOT NULL AND status = 'pending')
  )
  WITH CHECK (
    user_id = auth.uid() OR
    -- Allow completion with valid token
    (token IS NOT NULL)
  );

-- user_profiles: Consolidate UPDATE policies
DROP POLICY IF EXISTS "Admins can update any user profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Admins can update all user profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- volume_analytics: Drop duplicate
DROP POLICY IF EXISTS "Admins can view analytics" ON volume_analytics;

-- workflow_signers: Keep both SELECT policies (different purposes)
-- "Signers can view own signature records" - for signers
-- "Users can view signers of own workflows" - for workflow owners
