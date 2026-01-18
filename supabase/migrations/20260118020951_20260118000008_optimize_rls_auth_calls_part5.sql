/*
  # Optimize RLS Auth Function Calls - Part 5
  
  1. Performance Improvements
    - Final batch of auth.uid() optimizations
  
  2. Tables Updated (Part 5 - Final)
    - document_generation_queue
    - upsell_offers
    - upsell_purchases
    - user_profiles
    - idoc_template_sections
    - idoc_template_section_mapping
    - idoc_generated_documents
    - idoc_template_analytics
    - idoc_guided_templates
    - idoc_verification_audit
    - template_health_log
    - template_render_fallbacks
    - system_settings
    - template_alerts
    - shadow_test_results
    - alert_settings
*/

-- document_generation_queue policies
DROP POLICY IF EXISTS "Admins can view all generation queue" ON public.document_generation_queue;
CREATE POLICY "Admins can view all generation queue"
  ON public.document_generation_queue
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can view own generation queue" ON public.document_generation_queue;
CREATE POLICY "Users can view own generation queue"
  ON public.document_generation_queue
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- upsell_offers policies
DROP POLICY IF EXISTS "Admins can manage upsell offers" ON public.upsell_offers;
CREATE POLICY "Admins can manage upsell offers"
  ON public.upsell_offers
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

-- upsell_purchases policies
DROP POLICY IF EXISTS "Admins can view all upsell purchases" ON public.upsell_purchases;
CREATE POLICY "Admins can view all upsell purchases"
  ON public.upsell_purchases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can view own upsell purchases" ON public.upsell_purchases;
CREATE POLICY "Users can view own upsell purchases"
  ON public.upsell_purchases
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- user_profiles policies
DROP POLICY IF EXISTS "Admins can delete user profiles" ON public.user_profiles;
CREATE POLICY "Admins can delete user profiles"
  ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update any user profile" ON public.user_profiles;
CREATE POLICY "Admins can update any user profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
      AND up.role = 'admin'
    )
  );

-- idoc_template_sections policies
DROP POLICY IF EXISTS "Admins can manage idoc sections" ON public.idoc_template_sections;
CREATE POLICY "Admins can manage idoc sections"
  ON public.idoc_template_sections
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

-- idoc_template_section_mapping policies
DROP POLICY IF EXISTS "Admins can manage idoc section mappings" ON public.idoc_template_section_mapping;
CREATE POLICY "Admins can manage idoc section mappings"
  ON public.idoc_template_section_mapping
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

-- idoc_generated_documents policies
DROP POLICY IF EXISTS "Admins can view all idoc documents" ON public.idoc_generated_documents;
CREATE POLICY "Admins can view all idoc documents"
  ON public.idoc_generated_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create idoc documents" ON public.idoc_generated_documents;
CREATE POLICY "Authenticated users can create idoc documents"
  ON public.idoc_generated_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can view own idoc documents" ON public.idoc_generated_documents;
CREATE POLICY "Users can view own idoc documents"
  ON public.idoc_generated_documents
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- idoc_template_analytics policies
DROP POLICY IF EXISTS "Admins can view idoc analytics" ON public.idoc_template_analytics;
CREATE POLICY "Admins can view idoc analytics"
  ON public.idoc_template_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- idoc_guided_templates policies
DROP POLICY IF EXISTS "Admin can view all templates" ON public.idoc_guided_templates;
CREATE POLICY "Admin can view all templates"
  ON public.idoc_guided_templates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage idoc templates" ON public.idoc_guided_templates;
CREATE POLICY "Admins can manage idoc templates"
  ON public.idoc_guided_templates
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

-- idoc_verification_audit policies
DROP POLICY IF EXISTS "Admin can view verification audit" ON public.idoc_verification_audit;
CREATE POLICY "Admin can view verification audit"
  ON public.idoc_verification_audit
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- template_health_log policies
DROP POLICY IF EXISTS "Admins can read health logs" ON public.template_health_log;
CREATE POLICY "Admins can read health logs"
  ON public.template_health_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- template_render_fallbacks policies
DROP POLICY IF EXISTS "Admins can read fallback logs" ON public.template_render_fallbacks;
CREATE POLICY "Admins can read fallback logs"
  ON public.template_render_fallbacks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- system_settings policies
DROP POLICY IF EXISTS "Admins can read system settings" ON public.system_settings;
CREATE POLICY "Admins can read system settings"
  ON public.system_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update system settings" ON public.system_settings;
CREATE POLICY "Admins can update system settings"
  ON public.system_settings
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

-- template_alerts policies
DROP POLICY IF EXISTS "Admins can acknowledge alerts" ON public.template_alerts;
CREATE POLICY "Admins can acknowledge alerts"
  ON public.template_alerts
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

DROP POLICY IF EXISTS "Admins can read alerts" ON public.template_alerts;
CREATE POLICY "Admins can read alerts"
  ON public.template_alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- shadow_test_results policies
DROP POLICY IF EXISTS "Admins can read shadow results" ON public.shadow_test_results;
CREATE POLICY "Admins can read shadow results"
  ON public.shadow_test_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- alert_settings policies
DROP POLICY IF EXISTS "Users can manage own alert settings" ON public.alert_settings;
CREATE POLICY "Users can manage own alert settings"
  ON public.alert_settings
  FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
