/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Changes
    - Drop the problematic "Admins can view all profiles" policy that causes recursion
    - Drop the admin policies for documents and payments that cause the same issue
    - Create a simpler approach: Store admin status in auth metadata or use a function
    - For now, simplify to basic user-only access (admins can be handled differently later)

  2. Security
    - Users can view and update their own profiles
    - Users can manage their own documents and payments
*/

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all documents" ON generated_documents;
DROP POLICY IF EXISTS "Admins can update all documents" ON generated_documents;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Admins can update all payments" ON payments;

-- Create new admin policies using a function to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin policies using the function
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can view all documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update all documents"
  ON generated_documents FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update all payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (public.is_admin());
