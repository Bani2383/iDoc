/*
  # Consolidate Duplicate RLS Policies - Part 3 (idoc_guided_templates)

  1. Changes
    - Fix idoc_guided_templates which has 4 duplicate SELECT policies
    - Consolidate into clear, role-based policies
    - Remove redundant policies

  2. Security
    - Public (anon): Only verified templates
    - Authenticated: Verified templates
    - Admin: All templates
*/

-- Drop all existing SELECT policies on idoc_guided_templates
DROP POLICY IF EXISTS "Public can only view VERIFIED templates" ON idoc_guided_templates;
DROP POLICY IF EXISTS "Public can view published idoc templates" ON idoc_guided_templates;
DROP POLICY IF EXISTS "Admin can view all templates" ON idoc_guided_templates;
DROP POLICY IF EXISTS "Admins can manage idoc templates" ON idoc_guided_templates;

-- Create clear, consolidated policies

-- Policy 1: Public (anon/unauthenticated) can view verified templates only
CREATE POLICY "Public can view verified idoc templates"
  ON idoc_guided_templates FOR SELECT
  TO anon, authenticator, dashboard_user
  USING (
    is_active = true 
    AND is_verified = true
    AND production_ready = true
  );

-- Policy 2: Authenticated non-admin users see verified templates
CREATE POLICY "Authenticated users can view verified idoc templates"
  ON idoc_guided_templates FOR SELECT
  TO authenticated
  USING (
    (is_active = true AND is_verified = true AND production_ready = true)
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy 3: Admins can manage all templates
CREATE POLICY "Admins can manage all idoc templates"
  ON idoc_guided_templates FOR ALL
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

-- Similar consolidation for other tables with multiple policies

-- idoc_template_section_mapping: Keep both (admin manages, public views)

-- service_orders: Consolidate
DROP POLICY IF EXISTS "Admin manages all service orders" ON service_orders;
DROP POLICY IF EXISTS "Users can create own service orders" ON service_orders;
DROP POLICY IF EXISTS "Users can view own service orders" ON service_orders;
DROP POLICY IF EXISTS "Users can update own service orders" ON service_orders;

CREATE POLICY "Admin manages all service orders"
  ON service_orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can manage own service orders"
  ON service_orders FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- subscriptions: Consolidate UPDATE policies
DROP POLICY IF EXISTS "Admins can update subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;

CREATE POLICY "Admins can update all subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
