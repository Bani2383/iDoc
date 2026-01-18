/*
  # Fix Security Definer Views

  1. Security Fixes
    - Remove SECURITY DEFINER from views where not needed
    - Replace with SECURITY INVOKER (safer default)
    - Keep SECURITY DEFINER only where strictly necessary with comment

  2. Changes
    - Recreate `idoc_production_templates` view as SECURITY INVOKER
    - Recreate `page_visit_stats` view as SECURITY INVOKER
*/

-- Drop and recreate idoc_production_templates without SECURITY DEFINER
DROP VIEW IF EXISTS idoc_production_templates;

CREATE VIEW idoc_production_templates
WITH (security_invoker=true) AS
SELECT 
  id,
  title,
  slug,
  category,
  description,
  price_cad,
  estimated_time_minutes,
  difficulty_level,
  icon_name,
  is_active,
  is_verified,
  production_ready,
  shadow_mode_enabled,
  trust_level
FROM idoc_guided_templates
WHERE 
  is_active = true 
  AND is_verified = true 
  AND production_ready = true
  AND trust_level >= 80;

COMMENT ON VIEW idoc_production_templates IS 'Production-ready iDoc templates - uses SECURITY INVOKER for safety';

-- Drop and recreate page_visit_stats without SECURITY DEFINER
DROP VIEW IF EXISTS page_visit_stats;

CREATE VIEW page_visit_stats
WITH (security_invoker=true) AS
SELECT 
  page_path,
  COUNT(*) as visit_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions,
  DATE(visited_at) as visit_date
FROM page_visits
WHERE visited_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY page_path, DATE(visited_at);

COMMENT ON VIEW page_visit_stats IS 'Page visit statistics - uses SECURITY INVOKER for safety';
