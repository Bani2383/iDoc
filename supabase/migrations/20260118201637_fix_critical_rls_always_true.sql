/*
  # Fix Critical RLS Policy - Always True Issue

  1. Security Fixes
    - Remove "always true" RLS policy on `idoc_template_analytics`
    - Replace with restrictive policy that requires authentication
    - Allow authenticated users to log their own analytics
    - Allow anonymous users to log analytics with session tracking

  2. Changes
    - Drop insecure policy `Public can log idoc analytics`
    - Create new restrictive policy for authenticated users
    - Create new policy for anonymous analytics with session validation
*/

-- Drop the insecure "always true" policy
DROP POLICY IF EXISTS "Public can log idoc analytics" ON idoc_template_analytics;

-- Create restrictive policy for authenticated users
CREATE POLICY "Authenticated users can log own analytics"
  ON idoc_template_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    user_id IS NULL -- Allow null user_id for session-based tracking
  );

-- Create policy for anonymous users with session validation
CREATE POLICY "Anonymous users can log analytics with session"
  ON idoc_template_analytics
  FOR INSERT
  TO anon
  WITH CHECK (
    user_id IS NULL AND
    session_id IS NOT NULL -- Require session tracking for anonymous
  );
