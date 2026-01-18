/*
  # Consolidate Duplicate RLS Policies - Part 1

  1. Changes
    - Remove duplicate policies on multiple tables
    - Keep the most restrictive and well-named policy
    - Tables: ab_tests, abandoned_carts, achievements, affiliate_commissions, articles

  2. Security
    - All policies remain restrictive
    - No functionality lost
    - Cleaner policy structure
*/

-- ab_tests: Keep "Admins can manage ab tests", drop "Admin can manage ab tests"
DROP POLICY IF EXISTS "Admin can manage ab tests" ON ab_tests;

-- Also consolidate "Anyone can view active ab tests" with admin policy
DROP POLICY IF EXISTS "Admins can manage ab tests" ON ab_tests;
DROP POLICY IF EXISTS "Anyone can view active ab tests" ON ab_tests;

CREATE POLICY "Admins can manage ab tests"
  ON ab_tests FOR ALL
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

CREATE POLICY "Anyone can view active ab tests"
  ON ab_tests FOR SELECT
  TO authenticated
  USING (is_active = true);

-- abandoned_carts: Consolidate into single admin policy and user policy
DROP POLICY IF EXISTS "Admin manages all abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Users can delete own abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Users can create own abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Users can view own abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Users can update own abandoned carts" ON abandoned_carts;

CREATE POLICY "Admin manages all abandoned carts"
  ON abandoned_carts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can manage own abandoned carts"
  ON abandoned_carts FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- achievements: Keep both (different purposes)
-- "Admin can manage achievements" - for admin CRUD
-- "Users can view own achievements" - for user read

-- affiliate_commissions: Keep both (different purposes)
-- "Admin manages affiliate commissions" - for admin
-- "Affiliates can view own commissions" - for affiliates

-- articles: Keep all three (different roles and purposes)
-- These serve different purposes and are not duplicates
