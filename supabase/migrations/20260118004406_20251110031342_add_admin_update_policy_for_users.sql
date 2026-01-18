/*
  # Add admin update policy for user profiles

  1. Changes
    - Add policy allowing admins to update any user profile
    - Keep existing policies intact

  2. Security
    - Only admins can update other users' profiles
    - Users can still update their own profiles
*/

DROP POLICY IF EXISTS "Admins can update any user profile" ON user_profiles;

CREATE POLICY "Admins can update any user profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );