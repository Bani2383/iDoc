/*
  # Fix RLS policies for site_settings and user deletion

  1. Changes to site_settings
    - Add INSERT policy for admins
    - Fix UPDATE policy

  2. Changes to user_profiles
    - Add policy for admins to delete users
    - Ensure proper cascade deletion

  3. Security
    - Only admins can insert/update site settings
    - Only admins can delete user profiles
*/

DROP POLICY IF EXISTS "Only admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can insert site settings" ON site_settings;

CREATE POLICY "Admins can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete user profiles" ON user_profiles;

CREATE POLICY "Admins can delete user profiles"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );