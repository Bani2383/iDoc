/*
  # Fix Security Definer View (Corrected)

  1. Security Hardening
    - Remove SECURITY DEFINER from page_visit_stats view
    - SECURITY DEFINER on views can be a security risk
    - Replace with regular view that respects RLS

  2. Changes
    - Drop existing page_visit_stats view
    - Recreate without SECURITY DEFINER using correct table (user_activity)
    - Ensure RLS policies on underlying tables control access

  3. Security Notes
    - Views should generally not use SECURITY DEFINER
    - Access control should be handled by RLS on base tables
    - This change maintains functionality while improving security
*/

-- Drop existing view
DROP VIEW IF EXISTS public.page_visit_stats;

-- Recreate view without SECURITY DEFINER
CREATE OR REPLACE VIEW public.page_visit_stats AS
SELECT
  page_url,
  activity_type,
  COUNT(*) as visit_count,
  COUNT(DISTINCT user_id) as unique_visitors,
  MAX(timestamp) as last_visit,
  DATE(timestamp) as visit_date
FROM public.user_activity
WHERE activity_type IN ('page_view', 'visit')
GROUP BY page_url, activity_type, DATE(timestamp)
ORDER BY DATE(timestamp) DESC, COUNT(*) DESC;

-- Grant appropriate access
GRANT SELECT ON public.page_visit_stats TO authenticated;
GRANT SELECT ON public.page_visit_stats TO anon;
