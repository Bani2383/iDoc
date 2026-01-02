/*
  # Fix Security and Performance Issues - Part 1: Indexes and RLS Policies

  ## Changes Made

  ### 1. Missing Indexes
    - Add index for `seo_landing_pages.created_by` foreign key

  ### 2. RLS Policy Performance Optimization
    - Update all policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation for each row, improving query performance at scale

  ## Tables Updated
    - dossier_activity
    - affiliate_clicks
    - workflow_signers
    - cart_recovery_campaigns
    - referrals
    - user_activity
    - email_sequences
    - email_campaigns
    - ab_tests
    - ab_test_variants
    - ab_test_conversions
    - upsell_conversions
    - affiliate_commissions
    - enterprise_plans
    - enterprise_licenses
    - premium_services
    - seo_landing_pages
    - page_visit_summaries
    - country_disclaimers
    - document_generators
    - generator_steps
    - generator_fields
    - seo_scorecards
    - seo_priority_keywords
    - country_auto_detect_configs
*/

-- ============================================================================
-- PART 1: ADD MISSING INDEX
-- ============================================================================

-- Add missing index for seo_landing_pages.created_by foreign key
CREATE INDEX IF NOT EXISTS idx_seo_landing_pages_created_by
ON seo_landing_pages(created_by);

-- ============================================================================
-- PART 2: FIX RLS POLICIES FOR OPTIMAL PERFORMANCE
-- ============================================================================

-- dossier_activity
DROP POLICY IF EXISTS "Users can insert activity for own dossiers" ON dossier_activity;
CREATE POLICY "Users can insert activity for own dossiers"
  ON dossier_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dossiers
      WHERE id = dossier_activity.dossier_id
      AND created_by_user_id = (select auth.uid())
    )
  );

-- affiliate_clicks
DROP POLICY IF EXISTS "Affiliates can view own clicks" ON affiliate_clicks;
CREATE POLICY "Affiliates can view own clicks"
  ON affiliate_clicks
  FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = (select auth.uid())
    )
  );

-- workflow_signers
DROP POLICY IF EXISTS "Signers can update own signatures only" ON workflow_signers;
CREATE POLICY "Signers can update own signatures only"
  ON workflow_signers
  FOR UPDATE
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = (select auth.uid())))
  WITH CHECK (email = (SELECT email FROM auth.users WHERE id = (select auth.uid())));

DROP POLICY IF EXISTS "Signers can view own signature records" ON workflow_signers;
CREATE POLICY "Signers can view own signature records"
  ON workflow_signers
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = (select auth.uid())));

-- cart_recovery_campaigns
DROP POLICY IF EXISTS "Admin can manage cart recovery campaigns" ON cart_recovery_campaigns;
CREATE POLICY "Admin can manage cart recovery campaigns"
  ON cart_recovery_campaigns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin can view cart recovery campaigns" ON cart_recovery_campaigns;
CREATE POLICY "Admin can view cart recovery campaigns"
  ON cart_recovery_campaigns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- referrals
DROP POLICY IF EXISTS "Affiliates can insert own referrals" ON referrals;
CREATE POLICY "Affiliates can insert own referrals"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = (select auth.uid())
    )
  );

-- user_activity
DROP POLICY IF EXISTS "Admins can view all activity" ON user_activity;
CREATE POLICY "Admins can view all activity"
  ON user_activity
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can insert own activity" ON user_activity;
CREATE POLICY "Users can insert own activity"
  ON user_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own activity" ON user_activity;
CREATE POLICY "Users can view own activity"
  ON user_activity
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- email_sequences
DROP POLICY IF EXISTS "Admin can manage email sequences" ON email_sequences;
CREATE POLICY "Admin can manage email sequences"
  ON email_sequences
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin can view email sequences" ON email_sequences;
CREATE POLICY "Admin can view email sequences"
  ON email_sequences
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- email_campaigns
DROP POLICY IF EXISTS "Admin can manage email campaigns" ON email_campaigns;
CREATE POLICY "Admin can manage email campaigns"
  ON email_campaigns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin can view email campaigns" ON email_campaigns;
CREATE POLICY "Admin can view email campaigns"
  ON email_campaigns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ab_tests
DROP POLICY IF EXISTS "Admin can manage ab tests" ON ab_tests;
CREATE POLICY "Admin can manage ab tests"
  ON ab_tests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ab_test_variants
DROP POLICY IF EXISTS "Admin can manage ab test variants" ON ab_test_variants;
CREATE POLICY "Admin can manage ab test variants"
  ON ab_test_variants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ab_test_conversions
DROP POLICY IF EXISTS "Admin can view ab test conversions" ON ab_test_conversions;
CREATE POLICY "Admin can view ab test conversions"
  ON ab_test_conversions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- upsell_conversions
DROP POLICY IF EXISTS "Admin can view upsell conversions" ON upsell_conversions;
CREATE POLICY "Admin can view upsell conversions"
  ON upsell_conversions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- affiliate_commissions
DROP POLICY IF EXISTS "Admin manages affiliate commissions" ON affiliate_commissions;
CREATE POLICY "Admin manages affiliate commissions"
  ON affiliate_commissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Affiliates can view own commissions" ON affiliate_commissions;
CREATE POLICY "Affiliates can view own commissions"
  ON affiliate_commissions
  FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = (select auth.uid())
    )
  );

-- enterprise_plans
DROP POLICY IF EXISTS "Admin manages enterprise plans" ON enterprise_plans;
CREATE POLICY "Admin manages enterprise plans"
  ON enterprise_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- enterprise_licenses
DROP POLICY IF EXISTS "Admin manages enterprise licenses" ON enterprise_licenses;
CREATE POLICY "Admin manages enterprise licenses"
  ON enterprise_licenses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Team members can view own license" ON enterprise_licenses;
CREATE POLICY "Team members can view own license"
  ON enterprise_licenses
  FOR SELECT
  TO authenticated
  USING (
    admin_user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE license_id = enterprise_licenses.id
      AND user_id = (select auth.uid())
    )
  );

-- premium_services
DROP POLICY IF EXISTS "Admin manages premium services" ON premium_services;
CREATE POLICY "Admin manages premium services"
  ON premium_services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- seo_landing_pages
DROP POLICY IF EXISTS "Admins can manage all landing pages" ON seo_landing_pages;
CREATE POLICY "Admins can manage all landing pages"
  ON seo_landing_pages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- page_visit_summaries
DROP POLICY IF EXISTS "Admins can view all summaries" ON page_visit_summaries;
CREATE POLICY "Admins can view all summaries"
  ON page_visit_summaries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- country_disclaimers
DROP POLICY IF EXISTS "Admins can manage country disclaimers" ON country_disclaimers;
CREATE POLICY "Admins can manage country disclaimers"
  ON country_disclaimers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- document_generators
DROP POLICY IF EXISTS "Admins can manage generators" ON document_generators;
CREATE POLICY "Admins can manage generators"
  ON document_generators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- generator_steps
DROP POLICY IF EXISTS "Admins can manage generator steps" ON generator_steps;
CREATE POLICY "Admins can manage generator steps"
  ON generator_steps
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- generator_fields
DROP POLICY IF EXISTS "Admins can manage generator fields" ON generator_fields;
CREATE POLICY "Admins can manage generator fields"
  ON generator_fields
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- seo_scorecards
DROP POLICY IF EXISTS "Admins can manage SEO scorecards" ON seo_scorecards;
CREATE POLICY "Admins can manage SEO scorecards"
  ON seo_scorecards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- seo_priority_keywords
DROP POLICY IF EXISTS "Admins can manage SEO keywords" ON seo_priority_keywords;
CREATE POLICY "Admins can manage SEO keywords"
  ON seo_priority_keywords
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- country_auto_detect_configs
DROP POLICY IF EXISTS "Admins can manage country detect configs" ON country_auto_detect_configs;
CREATE POLICY "Admins can manage country detect configs"
  ON country_auto_detect_configs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );
