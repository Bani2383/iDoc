/*
  # Optimize RLS Auth Function Calls - Part 1
  
  1. Performance Improvements
    - Wrap auth.uid() calls with (SELECT auth.uid())
    - Prevents re-evaluation for each row
    - Significantly improves query performance at scale
  
  2. Tables Updated (Part 1 of 3)
    - site_statistics
    - workflow_signers
    - document_versions
    - jurisdictions
    - legal_rules
*/

-- site_statistics policies
DROP POLICY IF EXISTS "Admins can insert statistics" ON public.site_statistics;
CREATE POLICY "Admins can insert statistics"
  ON public.site_statistics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update statistics" ON public.site_statistics;
CREATE POLICY "Admins can update statistics"
  ON public.site_statistics
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

-- workflow_signers policies
DROP POLICY IF EXISTS "Users can insert signers to own workflows" ON public.workflow_signers;
CREATE POLICY "Users can insert signers to own workflows"
  ON public.workflow_signers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.signature_workflows
      WHERE id = workflow_id
      AND created_by = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view signers of own workflows" ON public.workflow_signers;
CREATE POLICY "Users can view signers of own workflows"
  ON public.workflow_signers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.signature_workflows
      WHERE id = workflow_id
      AND created_by = (SELECT auth.uid())
    )
  );

-- document_versions policies
DROP POLICY IF EXISTS "Users can insert versions to own documents" ON public.document_versions;
CREATE POLICY "Users can insert versions to own documents"
  ON public.document_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.generated_documents
      WHERE id = document_id
      AND user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view versions of own documents" ON public.document_versions;
CREATE POLICY "Users can view versions of own documents"
  ON public.document_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.generated_documents
      WHERE id = document_id
      AND user_id = (SELECT auth.uid())
    )
  );

-- jurisdictions policies
DROP POLICY IF EXISTS "Admins can manage jurisdictions" ON public.jurisdictions;
CREATE POLICY "Admins can manage jurisdictions"
  ON public.jurisdictions
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

-- legal_rules policies
DROP POLICY IF EXISTS "Admins can manage legal rules" ON public.legal_rules;
CREATE POLICY "Admins can manage legal rules"
  ON public.legal_rules
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
