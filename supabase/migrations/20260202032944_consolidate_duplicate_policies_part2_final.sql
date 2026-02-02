/*
  # Consolidate Duplicate RLS Policies - Part 2 (Final)

  1. Security Enhancement
    - Consolidate remaining multiple permissive policies into single policies
    - Reduces policy evaluation overhead
    - Improves query performance and maintainability

  2. Tables Affected (Part 2)
    - guided_template_submissions
    - idoc_generated_documents
    - login_logs
    - purchases
    - seo_landing_pages
    - service_orders
    - subscriptions
    - subscriptions_v2
    - upsell_purchases
    - user_activity
    - user_subscriptions
    - workflow_signers

  3. Important Notes
    - Old policies are dropped and replaced with consolidated versions
    - Combined logic uses OR to maintain same access control
*/

-- guided_template_submissions: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all guided submissions" ON public.guided_template_submissions;
DROP POLICY IF EXISTS "Users can view own guided submissions" ON public.guided_template_submissions;

CREATE POLICY "View guided submissions"
  ON public.guided_template_submissions
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- idoc_generated_documents: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all idoc documents" ON public.idoc_generated_documents;
DROP POLICY IF EXISTS "Users can view own idoc documents" ON public.idoc_generated_documents;

CREATE POLICY "View idoc documents"
  ON public.idoc_generated_documents
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- login_logs: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all login logs" ON public.login_logs;
DROP POLICY IF EXISTS "Users can view own login history" ON public.login_logs;

CREATE POLICY "View login logs"
  ON public.login_logs
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- purchases: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;

CREATE POLICY "View purchases"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- seo_landing_pages: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can manage all landing pages" ON public.seo_landing_pages;
DROP POLICY IF EXISTS "Anyone can view published landing pages" ON public.seo_landing_pages;

CREATE POLICY "View landing pages"
  ON public.seo_landing_pages
  FOR SELECT
  TO authenticated
  USING (
    is_published = true
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- service_orders: Consolidate remaining action-specific policies with main policy
DROP POLICY IF EXISTS "Users can create own service orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can view own service orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can update own service orders" ON public.service_orders;

-- The main "Manage service orders" policy already handles all actions

-- subscriptions: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;

CREATE POLICY "View subscriptions"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- subscriptions_v2: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all subscriptions v2" ON public.subscriptions_v2;
DROP POLICY IF EXISTS "Users can view own subscriptions v2" ON public.subscriptions_v2;

CREATE POLICY "View subscriptions v2"
  ON public.subscriptions_v2
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- upsell_purchases: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all upsell purchases" ON public.upsell_purchases;
DROP POLICY IF EXISTS "Users can view own upsell purchases" ON public.upsell_purchases;

CREATE POLICY "View upsell purchases"
  ON public.upsell_purchases
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- user_activity: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;

CREATE POLICY "View user activity"
  ON public.user_activity
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- user_subscriptions: Drop action-specific policies (main policy handles all)
DROP POLICY IF EXISTS "Users can create own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.user_subscriptions;

-- workflow_signers: Consolidate SELECT and UPDATE policies
DROP POLICY IF EXISTS "Signers can view own signature records" ON public.workflow_signers;
DROP POLICY IF EXISTS "Users can view signers of own workflows" ON public.workflow_signers;

CREATE POLICY "View workflow signers"
  ON public.workflow_signers
  FOR SELECT
  TO authenticated
  USING (
    email = (
      SELECT email FROM auth.users
      WHERE id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.signature_workflows
      WHERE id = workflow_signers.workflow_id
      AND created_by = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Signers can update own signature with token" ON public.workflow_signers;
DROP POLICY IF EXISTS "Signers can update own signatures only" ON public.workflow_signers;

CREATE POLICY "Update workflow signers"
  ON public.workflow_signers
  FOR UPDATE
  TO authenticated
  USING (
    email = (
      SELECT email FROM auth.users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    email = (
      SELECT email FROM auth.users
      WHERE id = (select auth.uid())
    )
  );
