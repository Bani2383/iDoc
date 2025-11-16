/*
  # Comprehensive security and performance fixes

  1. Performance Improvements
    - Add missing index for generated_documents.template_id foreign key
    - Optimize all RLS policies to use (select auth.uid()) instead of auth.uid()
    - This prevents re-evaluation for each row and improves query performance

  2. Security Improvements
    - Fix function search paths to prevent SQL injection vulnerabilities
    - Remove duplicate permissive policies by consolidating them
    - Set proper search paths for all security definer functions

  3. Policy Consolidation
    - Combine user and admin policies into single policies with OR conditions
    - This eliminates the "multiple permissive policies" warning
*/

-- Add missing index for foreign key
CREATE INDEX IF NOT EXISTS idx_generated_documents_template_id 
  ON generated_documents(template_id);

-- Drop all existing policies to recreate them optimized
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own documents" ON generated_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON generated_documents;
DROP POLICY IF EXISTS "Users can update own documents" ON generated_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON generated_documents;
DROP POLICY IF EXISTS "Admins can update all documents" ON generated_documents;

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can create own payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Admins can update all payments" ON payments;

DROP POLICY IF EXISTS "Anyone can view active templates" ON document_templates;
DROP POLICY IF EXISTS "Authenticated users can view all templates" ON document_templates;

-- Fix function search paths for security
DROP FUNCTION IF EXISTS public.is_admin();
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Recreate triggers after function changes
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_generated_documents_updated_at ON generated_documents;
CREATE TRIGGER update_generated_documents_updated_at
  BEFORE UPDATE ON generated_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create optimized consolidated policies for user_profiles
CREATE POLICY "Users and admins can view profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = id OR public.is_admin()
  );

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Create optimized consolidated policies for generated_documents
CREATE POLICY "Users and admins can view documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id OR public.is_admin()
  );

CREATE POLICY "Users can insert own documents"
  ON generated_documents FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users and admins can update documents"
  ON generated_documents FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = user_id OR public.is_admin()
  )
  WITH CHECK (
    (select auth.uid()) = user_id OR public.is_admin()
  );

-- Create optimized consolidated policies for payments
CREATE POLICY "Users and admins can view payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id OR public.is_admin()
  );

CREATE POLICY "Users can create own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Create consolidated policy for document_templates (allow public read access)
CREATE POLICY "Anyone can view templates"
  ON document_templates FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON document_templates FOR ALL
  TO authenticated
  USING (public.is_admin());
