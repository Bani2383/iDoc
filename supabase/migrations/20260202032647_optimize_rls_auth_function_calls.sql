/*
  # Optimize RLS Auth Function Calls

  1. Performance Optimization
    - Replace auth.<function>() with (select auth.<function>())
    - Prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale

  2. Policies Affected
    - user_subscriptions: "Manage user subscriptions"
    - service_orders: "Manage service orders"

  3. Important Notes
    - The subquery ensures the auth function is evaluated once per query
    - Not once per row, which can cause severe performance degradation
    - See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
*/

-- Drop and recreate user_subscriptions policies with optimized auth calls
DROP POLICY IF EXISTS "Manage user subscriptions" ON public.user_subscriptions;

CREATE POLICY "Manage user subscriptions"
  ON public.user_subscriptions
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

-- Drop and recreate service_orders policies with optimized auth calls
DROP POLICY IF EXISTS "Manage service orders" ON public.service_orders;

CREATE POLICY "Manage service orders"
  ON public.service_orders
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
