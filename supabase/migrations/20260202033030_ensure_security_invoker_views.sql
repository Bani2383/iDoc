/*
  # Ensure Security Invoker Views

  1. Security Enhancement
    - Recreate views with SECURITY INVOKER if they still have SECURITY DEFINER
    - Prevents privilege escalation vulnerabilities
    - Ensures views respect caller's permissions and RLS policies

  2. Views Affected
    - idoc_production_templates
    - page_visit_stats

  3. Important Notes
    - This migration ensures views use SECURITY INVOKER
    - Based on existing table structures from previous migrations
    - Views are dropped and recreated to ensure correct security settings
*/

-- Drop and recreate idoc_production_templates view with SECURITY INVOKER
DROP VIEW IF EXISTS public.idoc_production_templates CASCADE;

CREATE OR REPLACE VIEW public.idoc_production_templates
WITH (security_invoker = true)
AS
SELECT 
  id,
  template_code,
  slug,
  title,
  description,
  category,
  sub_category,
  template_content,
  routing_conditions,
  required_variables,
  optional_variables,
  meta_title,
  meta_description,
  keywords,
  is_active,
  is_published,
  created_at,
  updated_at
FROM public.idoc_guided_templates
WHERE 
  is_active = true 
  AND is_published = true;

-- Drop and recreate page_visit_stats view with SECURITY INVOKER
DROP VIEW IF EXISTS public.page_visit_stats CASCADE;

CREATE OR REPLACE VIEW public.page_visit_stats
WITH (security_invoker = true)
AS
SELECT 
  page_url,
  activity_type,
  COUNT(*) AS visit_count,
  COUNT(DISTINCT user_id) AS unique_visitors,
  MAX(timestamp) AS last_visit,
  DATE(timestamp) AS visit_date
FROM public.user_activity
WHERE activity_type IN ('page_view', 'visit')
GROUP BY page_url, activity_type, DATE(timestamp);

-- Add helpful comments
COMMENT ON VIEW public.idoc_production_templates IS 
  'View of active and published iDoc templates. Uses SECURITY INVOKER to respect caller permissions.';

COMMENT ON VIEW public.page_visit_stats IS 
  'Aggregated statistics of page visits from user activity. Uses SECURITY INVOKER to respect caller permissions and RLS policies.';
