/*
  # Fix template deletion policy

  1. Changes
    - Drop and recreate the DELETE policy for document_templates
    - Remove explicit schema reference that may cause issues
    - Ensure the policy properly checks admin role

  2. Security
    - Only admins can delete templates
    - Policy works correctly with current user context
*/

DROP POLICY IF EXISTS "Admins can delete templates" ON document_templates;

CREATE POLICY "Admins can delete templates"
  ON document_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );