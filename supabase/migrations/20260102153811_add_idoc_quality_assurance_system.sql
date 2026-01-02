/*
  # iDoc Quality Assurance System - Zero Defect Guarantee

  ## Purpose
  Implements a comprehensive quality gate system to ensure NO user can:
  - View unverified templates
  - Generate documents from defective templates
  - Pay for broken templates
  - Access templates that haven't passed validation

  ## Changes

  1. New Fields on idoc_guided_templates
    - `status` enum: DRAFT | VERIFIED | BLOCKED
    - `last_verified_at` timestamp: when template last passed validation
    - `last_verification_report` jsonb: detailed lint results
    - `version_hash` text: hash of template_content for change detection
    - `verification_required` boolean: flags templates needing re-verification

  2. Quality Gates
    - Templates must be VERIFIED to be visible
    - Templates must pass updated_at <= last_verified_at check
    - Version hash must match current content
    - All API endpoints check status before allowing access

  3. Security
    - Automatic status reset to DRAFT on template modification
    - Trigger to invalidate verification on content change
    - Hard blocks in RLS policies
    - Backend validation in Edge Functions

  4. Business Rules
    - Only VERIFIED templates can be:
      - Listed in catalog
      - Previewed
      - Generated
      - Purchased
    - Payment blocked for non-VERIFIED templates
    - Automatic refund if generation fails after payment
*/

-- ============================================================================
-- CREATE STATUS ENUM TYPE
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'idoc_template_status') THEN
    CREATE TYPE idoc_template_status AS ENUM ('DRAFT', 'VERIFIED', 'BLOCKED');
  END IF;
END $$;

-- ============================================================================
-- ADD QUALITY ASSURANCE FIELDS
-- ============================================================================

DO $$
BEGIN
  -- Status field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'status'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN status idoc_template_status DEFAULT 'DRAFT';
  END IF;

  -- Last verification timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'last_verified_at'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN last_verified_at timestamptz;
  END IF;

  -- Verification report
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'last_verification_report'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN last_verification_report jsonb;
  END IF;

  -- Version hash for change detection
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'version_hash'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN version_hash text;
  END IF;

  -- Flag for requiring re-verification
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'idoc_guided_templates' AND column_name = 'verification_required'
  ) THEN
    ALTER TABLE idoc_guided_templates 
    ADD COLUMN verification_required boolean DEFAULT true;
  END IF;
END $$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_idoc_templates_status 
  ON idoc_guided_templates(status) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_idoc_templates_verified 
  ON idoc_guided_templates(status, last_verified_at) 
  WHERE status = 'VERIFIED' AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_idoc_templates_needs_verification 
  ON idoc_guided_templates(verification_required) 
  WHERE verification_required = true AND is_active = true;

-- ============================================================================
-- AUTOMATIC INVALIDATION TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION invalidate_template_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- If template_content, required_variables, or optional_variables changed
  IF (OLD.template_content IS DISTINCT FROM NEW.template_content OR
      OLD.required_variables IS DISTINCT FROM NEW.required_variables OR
      OLD.optional_variables IS DISTINCT FROM NEW.optional_variables) THEN
    
    -- Reset to DRAFT status
    NEW.status = 'DRAFT';
    
    -- Clear verification data
    NEW.last_verified_at = NULL;
    NEW.last_verification_report = NULL;
    NEW.version_hash = NULL;
    NEW.verification_required = true;
    
    -- Unpublish template
    NEW.published = false;
    NEW.is_published = false;
    
    -- Update timestamp
    NEW.updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trigger_invalidate_verification ON idoc_guided_templates;

-- Create trigger
CREATE TRIGGER trigger_invalidate_verification
  BEFORE UPDATE ON idoc_guided_templates
  FOR EACH ROW
  EXECUTE FUNCTION invalidate_template_verification();

-- ============================================================================
-- HELPER FUNCTION: Calculate Version Hash
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_template_version_hash(content jsonb)
RETURNS text AS $$
BEGIN
  RETURN md5(content::text);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- HELPER FUNCTION: Check Template is Production Ready
-- ============================================================================

CREATE OR REPLACE FUNCTION is_template_production_ready(template_id uuid)
RETURNS boolean AS $$
DECLARE
  template_record RECORD;
BEGIN
  SELECT 
    status,
    last_verified_at,
    updated_at,
    version_hash,
    template_content,
    is_active
  INTO template_record
  FROM idoc_guided_templates
  WHERE id = template_id;

  -- Template must exist and be active
  IF NOT FOUND OR NOT template_record.is_active THEN
    RETURN false;
  END IF;

  -- Status must be VERIFIED
  IF template_record.status != 'VERIFIED' THEN
    RETURN false;
  END IF;

  -- Must have been verified
  IF template_record.last_verified_at IS NULL THEN
    RETURN false;
  END IF;

  -- Verification must be more recent than last update
  IF template_record.last_verified_at < template_record.updated_at THEN
    RETURN false;
  END IF;

  -- Version hash must match current content
  IF template_record.version_hash IS NULL THEN
    RETURN false;
  END IF;

  IF template_record.version_hash != calculate_template_version_hash(template_record.template_content) THEN
    RETURN false;
  END IF;

  -- All checks passed
  RETURN true;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- UPDATE EXISTING RLS POLICIES - ADD VERIFIED STATUS CHECK
-- ============================================================================

-- Drop existing public view policies if they exist
DROP POLICY IF EXISTS "Public can view published templates" ON idoc_guided_templates;
DROP POLICY IF EXISTS "Anyone can view active published templates" ON idoc_guided_templates;

-- Create new restrictive policy for public access
CREATE POLICY "Public can only view VERIFIED templates"
  ON idoc_guided_templates FOR SELECT
  USING (
    is_active = true 
    AND status = 'VERIFIED'
    AND last_verified_at IS NOT NULL
    AND last_verified_at >= updated_at
    AND version_hash = calculate_template_version_hash(template_content)
  );

-- Admin can still see everything
CREATE POLICY "Admin can view all templates"
  ON idoc_guided_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- ============================================================================
-- HARD GATE VIEW - Only Production-Ready Templates
-- ============================================================================

CREATE OR REPLACE VIEW idoc_production_templates AS
SELECT 
  t.*,
  is_template_production_ready(t.id) as is_production_ready
FROM idoc_guided_templates t
WHERE 
  t.is_active = true 
  AND t.status = 'VERIFIED'
  AND t.last_verified_at IS NOT NULL
  AND t.last_verified_at >= t.updated_at
  AND t.version_hash IS NOT NULL
  AND t.version_hash = calculate_template_version_hash(t.template_content);

COMMENT ON VIEW idoc_production_templates IS 'HARD GATE: Only templates that have passed all quality checks and are safe for production use';

-- Grant access to view
GRANT SELECT ON idoc_production_templates TO authenticated, anon;

-- ============================================================================
-- VERIFICATION AUDIT LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS idoc_verification_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES idoc_guided_templates(id) ON DELETE CASCADE,
  
  verification_type text NOT NULL, -- 'LINT' | 'PUBLISH' | 'AUTO'
  old_status idoc_template_status,
  new_status idoc_template_status,
  
  verification_report jsonb,
  blockers jsonb DEFAULT '[]'::jsonb,
  warnings jsonb DEFAULT '[]'::jsonb,
  
  performed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  performed_at timestamptz DEFAULT now(),
  
  success boolean NOT NULL,
  error_message text
);

CREATE INDEX IF NOT EXISTS idx_verification_audit_template 
  ON idoc_verification_audit(template_id, performed_at DESC);

CREATE INDEX IF NOT EXISTS idx_verification_audit_status 
  ON idoc_verification_audit(new_status, performed_at DESC);

ALTER TABLE idoc_verification_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view verification audit"
  ON idoc_verification_audit FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON COLUMN idoc_guided_templates.status IS 'CRITICAL: Template verification status. Only VERIFIED templates are visible to users.';
COMMENT ON COLUMN idoc_guided_templates.last_verified_at IS 'When template last passed all quality checks. Must be >= updated_at.';
COMMENT ON COLUMN idoc_guided_templates.last_verification_report IS 'Detailed lint report from last verification including unknownVars, placeholders, etc.';
COMMENT ON COLUMN idoc_guided_templates.version_hash IS 'MD5 hash of template_content. Used to detect unauthorized changes.';
COMMENT ON COLUMN idoc_guided_templates.verification_required IS 'Flag indicating template needs re-verification before production use.';

COMMENT ON FUNCTION is_template_production_ready(uuid) IS 'CRITICAL FUNCTION: Returns true only if template is safe for production use. Used by all client-facing APIs.';
COMMENT ON FUNCTION invalidate_template_verification() IS 'TRIGGER: Automatically resets status to DRAFT when template content changes. Prevents use of modified but unverified templates.';
COMMENT ON TABLE idoc_verification_audit IS 'Audit log of all verification attempts and status changes for compliance tracking.';
