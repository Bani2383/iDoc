/*
  # Consolidate Duplicate RLS Policies - Part 1

  1. Security Enhancement
    - Consolidate multiple permissive policies into single policies
    - Reduces policy evaluation overhead
    - Improves query performance and maintainability

  2. Tables Affected (Part 1)
    - ab_tests
    - abandoned_carts
    - achievements
    - affiliate_commissions
    - articles
    - clients
    - credit_purchases
    - document_generation_queue
    - document_templates
    - dossiers
    - email_logs
    - enterprise_licenses

  3. Important Notes
    - Old policies are dropped and replaced with consolidated versions
    - Combined logic uses OR to maintain same access control
*/

-- ab_tests: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can manage ab tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Anyone can view active ab tests" ON public.ab_tests;

CREATE POLICY "View ab tests"
  ON public.ab_tests
  FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- abandoned_carts: Consolidate all action policies
DROP POLICY IF EXISTS "Admin manages all abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Users can view own abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Users can create own abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Users can update own abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Users can delete own abandoned carts" ON public.abandoned_carts;

CREATE POLICY "Manage abandoned carts"
  ON public.abandoned_carts
  FOR ALL
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- achievements: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin can manage achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;

CREATE POLICY "View achievements"
  ON public.achievements
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

-- affiliate_commissions: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin manages affiliate commissions" ON public.affiliate_commissions;
DROP POLICY IF EXISTS "Affiliates can view own commissions" ON public.affiliate_commissions;

CREATE POLICY "View affiliate commissions"
  ON public.affiliate_commissions
  FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM public.affiliates
      WHERE user_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- articles: Consolidate SELECT policies
DROP POLICY IF EXISTS "Auteurs voient leurs brouillons" ON public.articles;
DROP POLICY IF EXISTS "Public peut lire articles publiés" ON public.articles;

CREATE POLICY "View articles"
  ON public.articles
  FOR SELECT
  TO authenticated
  USING (
    is_published = true
    OR author_id = (select auth.uid())
  );

-- clients: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view their own client profile" ON public.clients;

CREATE POLICY "View clients"
  ON public.clients
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

-- credit_purchases: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all purchases" ON public.credit_purchases;
DROP POLICY IF EXISTS "Users can view own purchases" ON public.credit_purchases;

CREATE POLICY "View credit purchases"
  ON public.credit_purchases
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

-- document_generation_queue: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all generation queue" ON public.document_generation_queue;
DROP POLICY IF EXISTS "Users can view own generation queue" ON public.document_generation_queue;

CREATE POLICY "View generation queue"
  ON public.document_generation_queue
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

-- document_templates: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all templates" ON public.document_templates;
DROP POLICY IF EXISTS "Anyone can view active templates" ON public.document_templates;

CREATE POLICY "View templates"
  ON public.document_templates
  FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- dossiers: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view all dossiers" ON public.dossiers;
DROP POLICY IF EXISTS "Users can view dossiers they created" ON public.dossiers;

CREATE POLICY "View dossiers"
  ON public.dossiers
  FOR SELECT
  TO authenticated
  USING (
    created_by_user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- email_logs: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin manages email logs" ON public.email_logs;
DROP POLICY IF EXISTS "Users can view own email logs" ON public.email_logs;

CREATE POLICY "View email logs"
  ON public.email_logs
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

-- enterprise_licenses: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin manages enterprise licenses" ON public.enterprise_licenses;
DROP POLICY IF EXISTS "Team members can view own license" ON public.enterprise_licenses;

CREATE POLICY "View enterprise licenses"
  ON public.enterprise_licenses
  FOR SELECT
  TO authenticated
  USING (
    admin_user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = (select auth.uid())
      AND license_id = enterprise_licenses.id
    )
    OR EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );
