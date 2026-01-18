/*
  # Optimize RLS Auth Function Calls - Part 3
  
  1. Performance Improvements
    - Continue wrapping auth.uid() calls with (SELECT auth.uid())
  
  2. Tables Updated (Part 3 of 3)
    - recommendation_rules
    - site_settings
    - document_folders
    - signature_workflows
    - bulk_campaigns
    - bulk_sends
    - subscriptions
    - transactions
*/

-- recommendation_rules policies
DROP POLICY IF EXISTS "Admins can manage recommendation rules" ON public.recommendation_rules;
CREATE POLICY "Admins can manage recommendation rules"
  ON public.recommendation_rules
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

-- site_settings policies
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
CREATE POLICY "Admins can insert site settings"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings"
  ON public.site_settings
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

-- document_folders policies
DROP POLICY IF EXISTS "Users can delete own non-system folders" ON public.document_folders;
CREATE POLICY "Users can delete own non-system folders"
  ON public.document_folders
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()) AND is_system = false);

DROP POLICY IF EXISTS "Users can insert own folders" ON public.document_folders;
CREATE POLICY "Users can insert own folders"
  ON public.document_folders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own non-system folders" ON public.document_folders;
CREATE POLICY "Users can update own non-system folders"
  ON public.document_folders
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()) AND is_system = false)
  WITH CHECK (user_id = (SELECT auth.uid()) AND is_system = false);

DROP POLICY IF EXISTS "Users can view own folders" ON public.document_folders;
CREATE POLICY "Users can view own folders"
  ON public.document_folders
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- signature_workflows policies
DROP POLICY IF EXISTS "Users can insert own workflows" ON public.signature_workflows;
CREATE POLICY "Users can insert own workflows"
  ON public.signature_workflows
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own workflows" ON public.signature_workflows;
CREATE POLICY "Users can update own workflows"
  ON public.signature_workflows
  FOR UPDATE
  TO authenticated
  USING (created_by = (SELECT auth.uid()))
  WITH CHECK (created_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own workflows" ON public.signature_workflows;
CREATE POLICY "Users can view own workflows"
  ON public.signature_workflows
  FOR SELECT
  TO authenticated
  USING (created_by = (SELECT auth.uid()));

-- bulk_campaigns policies
DROP POLICY IF EXISTS "Users can insert own bulk campaigns" ON public.bulk_campaigns;
CREATE POLICY "Users can insert own bulk campaigns"
  ON public.bulk_campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own bulk campaigns" ON public.bulk_campaigns;
CREATE POLICY "Users can update own bulk campaigns"
  ON public.bulk_campaigns
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own bulk campaigns" ON public.bulk_campaigns;
CREATE POLICY "Users can view own bulk campaigns"
  ON public.bulk_campaigns
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- bulk_sends policies
DROP POLICY IF EXISTS "Users can insert sends to own campaigns" ON public.bulk_sends;
CREATE POLICY "Users can insert sends to own campaigns"
  ON public.bulk_sends
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bulk_campaigns
      WHERE id = campaign_id
      AND user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view sends of own campaigns" ON public.bulk_sends;
CREATE POLICY "Users can view sends of own campaigns"
  ON public.bulk_sends
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bulk_campaigns
      WHERE id = campaign_id
      AND user_id = (SELECT auth.uid())
    )
  );

-- subscriptions policies
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;
CREATE POLICY "Users can update own subscription"
  ON public.subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
