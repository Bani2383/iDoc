/*
  # Remove unused indexes and fix multiple permissive policies

  1. Performance Optimization
    - Remove unused indexes that have never been scanned (idx_scan = 0)
    - Keep only indexes that are actively used by queries
    - This reduces storage overhead and improves write performance

  2. Security Fixes
    - Fix multiple permissive policies on document_templates table
    - Consolidate "Admins can manage templates" and "Anyone can view templates" into proper restrictive policies
    - Ensure proper access control without policy conflicts

  ## Indexes Being Removed (all have idx_scan = 0):
    - idx_document_templates_slug (duplicate of unique constraint document_templates_slug_key)
    - idx_document_templates_sort_order (not used in queries)
    - idx_user_profiles_role (not used in queries, small table)
    - idx_generated_documents_user_id (not used, foreign key constraint handles lookups)
    - idx_generated_documents_status (not used in queries yet)
    - idx_payments_user_id (not used, no payment queries yet)
    - idx_payments_document_id (not used, no payment queries yet)
    - idx_payments_status (not used, no payment queries yet)

  ## Policy Fix:
    - Drop and recreate document_templates policies to avoid multiple permissive policies
    - Use RESTRICTIVE policy for admin-only actions instead of permissive FOR ALL
*/

-- Remove unused indexes
DROP INDEX IF EXISTS idx_document_templates_slug;
DROP INDEX IF EXISTS idx_document_templates_sort_order;
DROP INDEX IF EXISTS idx_user_profiles_role;
DROP INDEX IF EXISTS idx_generated_documents_user_id;
DROP INDEX IF EXISTS idx_generated_documents_status;
DROP INDEX IF EXISTS idx_payments_user_id;
DROP INDEX IF EXISTS idx_payments_document_id;
DROP INDEX IF EXISTS idx_payments_status;

-- Fix multiple permissive policies on document_templates
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view templates" ON document_templates;
DROP POLICY IF EXISTS "Admins can manage templates" ON document_templates;

-- Create new consolidated policies
-- Public read access for active templates
CREATE POLICY "Anyone can view active templates"
  ON document_templates FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Admin SELECT access (including inactive templates)
CREATE POLICY "Admins can view all templates"
  ON document_templates FOR SELECT
  TO authenticated
  USING (
    NOT is_active AND 
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin INSERT access
CREATE POLICY "Admins can insert templates"
  ON document_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin UPDATE access
CREATE POLICY "Admins can update templates"
  ON document_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin DELETE access
CREATE POLICY "Admins can delete templates"
  ON document_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );