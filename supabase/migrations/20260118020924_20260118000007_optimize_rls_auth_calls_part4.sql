/*
  # Optimize RLS Auth Function Calls - Part 4
  
  1. Performance Improvements
    - Continue wrapping auth.uid() calls with (SELECT auth.uid())
  
  2. Tables Updated (Part 4)
    - bundles
    - bundle_items
    - affiliates
    - referrals
    - document_templates
    - template_translations
    - bundle_translations
    - analytics_events
    - ab_tests
*/

-- bundles policies
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;
CREATE POLICY "Admins can manage bundles"
  ON public.bundles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- bundle_items policies
DROP POLICY IF EXISTS "Admins can manage bundle items" ON public.bundle_items;
CREATE POLICY "Admins can manage bundle items"
  ON public.bundle_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- affiliates policies
DROP POLICY IF EXISTS "Users can insert own affiliate account" ON public.affiliates;
CREATE POLICY "Users can insert own affiliate account"
  ON public.affiliates
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own affiliate account" ON public.affiliates;
CREATE POLICY "Users can update own affiliate account"
  ON public.affiliates
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- referrals policies
DROP POLICY IF EXISTS "Affiliates can view own referrals" ON public.referrals;
CREATE POLICY "Affiliates can view own referrals"
  ON public.referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliates
      WHERE id = affiliate_id
      AND user_id = (SELECT auth.uid())
    )
  );

-- document_templates policies
DROP POLICY IF EXISTS "Admins can delete templates" ON public.document_templates;
CREATE POLICY "Admins can delete templates"
  ON public.document_templates
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can insert templates" ON public.document_templates;
CREATE POLICY "Admins can insert templates"
  ON public.document_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update templates" ON public.document_templates;
CREATE POLICY "Admins can update templates"
  ON public.document_templates
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view all templates" ON public.document_templates;
CREATE POLICY "Admins can view all templates"
  ON public.document_templates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- template_translations policies
DROP POLICY IF EXISTS "Admins can manage template translations" ON public.template_translations;
CREATE POLICY "Admins can manage template translations"
  ON public.template_translations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- bundle_translations policies
DROP POLICY IF EXISTS "Admins can manage bundle translations" ON public.bundle_translations;
CREATE POLICY "Admins can manage bundle translations"
  ON public.bundle_translations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- analytics_events policies
DROP POLICY IF EXISTS "Admins can view analytics" ON public.analytics_events;
CREATE POLICY "Admins can view analytics"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- ab_tests policies
DROP POLICY IF EXISTS "Admins can manage ab tests" ON public.ab_tests;
CREATE POLICY "Admins can manage ab tests"
  ON public.ab_tests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );
