/*
  # Fix RLS Policy Always True

  1. Security Improvements
    - Fixes policy on idoc_template_analytics that allows unrestricted INSERT
    - Adds validation to ensure required fields are present
    
  2. Changes
    - Replaces "always true" WITH CHECK with proper validation
    - Ensures template_code and event_type are provided
    - Validates event_type is from allowed list
    
  3. Notes
    - This table is for analytics tracking
    - We allow public to insert for anonymous tracking
    - But we validate the data structure for security
*/

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public can log idoc analytics" ON idoc_template_analytics;

-- Create a more restrictive policy that validates input
CREATE POLICY "Public can log valid idoc analytics"
  ON idoc_template_analytics FOR INSERT
  TO public
  WITH CHECK (
    -- Ensure required fields are present and non-empty
    template_code IS NOT NULL 
    AND template_code != ''
    AND event_type IS NOT NULL
    AND event_type != ''
    -- Validate event_type is from an allowed list
    AND event_type IN (
      'view',
      'start',
      'complete',
      'abandon',
      'download',
      'preview',
      'share',
      'error',
      'validation_fail',
      'step_complete',
      'field_edit'
    )
    -- If template_id is provided, it should be a valid UUID
    AND (template_id IS NULL OR template_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
  );

-- Add comment explaining the security consideration
COMMENT ON POLICY "Public can log valid idoc analytics" ON idoc_template_analytics IS 
  'Allows public analytics tracking but validates data structure to prevent malicious insertions.';