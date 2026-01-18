/*
  # Optimize RLS Auth Function Calls - Part 2
  
  1. Performance Improvements
    - Continue wrapping auth.uid() calls with (SELECT auth.uid())
  
  2. Tables Updated (Part 2 of 3)
    - subscriptions_v2
    - api_keys
    - login_logs
    - document_views
    - api_logs
*/

-- subscriptions_v2 policies
DROP POLICY IF EXISTS "Admins can update subscriptions v2" ON public.subscriptions_v2;
CREATE POLICY "Admins can update subscriptions v2"
  ON public.subscriptions_v2
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

DROP POLICY IF EXISTS "Admins can view all subscriptions v2" ON public.subscriptions_v2;
CREATE POLICY "Admins can view all subscriptions v2"
  ON public.subscriptions_v2
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can view own subscriptions v2" ON public.subscriptions_v2;
CREATE POLICY "Users can view own subscriptions v2"
  ON public.subscriptions_v2
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- api_keys policies
DROP POLICY IF EXISTS "Users can delete own API keys" ON public.api_keys;
CREATE POLICY "Users can delete own API keys"
  ON public.api_keys
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own API keys" ON public.api_keys;
CREATE POLICY "Users can insert own API keys"
  ON public.api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own API keys" ON public.api_keys;
CREATE POLICY "Users can update own API keys"
  ON public.api_keys
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own API keys" ON public.api_keys;
CREATE POLICY "Users can view own API keys"
  ON public.api_keys
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- login_logs policies
DROP POLICY IF EXISTS "Admins can view all login logs" ON public.login_logs;
CREATE POLICY "Admins can view all login logs"
  ON public.login_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "System can insert login logs" ON public.login_logs;
-- This is kept as-is since it's for system operations

DROP POLICY IF EXISTS "Users can view own login history" ON public.login_logs;
CREATE POLICY "Users can view own login history"
  ON public.login_logs
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- document_views policies
DROP POLICY IF EXISTS "Users can insert own document views" ON public.document_views;
CREATE POLICY "Users can insert own document views"
  ON public.document_views
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can view own document views" ON public.document_views;
CREATE POLICY "Users can view own document views"
  ON public.document_views
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- api_logs policies
DROP POLICY IF EXISTS "Users can view logs of own API keys" ON public.api_logs;
CREATE POLICY "Users can view logs of own API keys"
  ON public.api_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.api_keys
      WHERE api_keys.id = api_logs.api_key_id
      AND api_keys.user_id = (SELECT auth.uid())
    )
  );
