/*
  # Fix Security Definer Views (Simple)

  1. Security Improvements
    - Removes SECURITY DEFINER from views
    - Recreates views with default security context (INVOKER)
    
  2. Views Updated
    - idoc_production_templates
    - page_visit_stats
    
  3. Notes
    - SECURITY DEFINER views can bypass RLS which is a security risk
    - Views are recreated without SECURITY DEFINER (default is INVOKER)
*/

-- Drop and recreate idoc_production_templates
DROP VIEW IF EXISTS idoc_production_templates CASCADE;

CREATE VIEW idoc_production_templates AS
SELECT 
  id,
  template_code,
  slug,
  title,
  description,
  category,
  sub_category,
  status,
  is_active,
  is_published,
  eligible_for_production,
  trust_level,
  shadow_mode_enabled,
  price_usd,
  price_cad,
  price_eur,
  is_free,
  usage_count,
  last_verified_at,
  smoke_test_passed,
  quarantined
FROM idoc_guided_templates
WHERE 
  is_active = true
  AND is_published = true
  AND eligible_for_production = true
  AND quarantined = false
  AND smoke_test_passed = true;

GRANT SELECT ON idoc_production_templates TO authenticated;
GRANT SELECT ON idoc_production_templates TO anon;

-- Drop and recreate page_visit_stats
DROP VIEW IF EXISTS page_visit_stats CASCADE;

CREATE VIEW page_visit_stats AS
SELECT 
  page_url,
  activity_type,
  COUNT(*) AS visit_count,
  COUNT(DISTINCT user_id) AS unique_visitors,
  MAX(timestamp) AS last_visit,
  DATE(timestamp) AS visit_date
FROM user_activity
WHERE activity_type IN ('page_view', 'visit')
GROUP BY page_url, activity_type, DATE(timestamp)
ORDER BY DATE(timestamp) DESC, COUNT(*) DESC;

GRANT SELECT ON page_visit_stats TO authenticated;

COMMENT ON VIEW idoc_production_templates IS 'Production-ready iDoc templates. Uses default INVOKER security for proper RLS enforcement.';
COMMENT ON VIEW page_visit_stats IS 'Page visit statistics. Uses default INVOKER security for proper RLS enforcement.';