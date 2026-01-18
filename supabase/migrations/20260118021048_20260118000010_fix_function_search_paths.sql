/*
  # Fix Function Search Paths
  
  1. Security Improvements
    - Set immutable search_path on all functions
    - Prevents search_path hijacking attacks
  
  2. Functions Updated
    - update_affiliate_stats
    - has_active_subscription
    - increment_template_views
    - get_popular_templates
    - handle_new_user
    - create_default_folders
    - limit_document_versions
    - update_workflow_status
    - update_idoc_templates_updated_at
    - cleanup_old_api_logs
    - update_campaign_counts
    - invalidate_template_verification
    - calculate_template_version_hash
    - is_template_production_ready
    - should_send_alert_notification
    - handle_new_alert_notification
*/

-- Set search_path on all functions to prevent hijacking

ALTER FUNCTION public.update_affiliate_stats() SET search_path = public, pg_temp;
ALTER FUNCTION public.has_active_subscription(check_user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_template_views(template_uuid uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_popular_templates(limit_count integer, lang_code text) SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.create_default_folders() SET search_path = public, pg_temp;
ALTER FUNCTION public.limit_document_versions() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_workflow_status() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_idoc_templates_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.cleanup_old_api_logs() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_campaign_counts() SET search_path = public, pg_temp;
ALTER FUNCTION public.invalidate_template_verification() SET search_path = public, pg_temp;
ALTER FUNCTION public.calculate_template_version_hash(content jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_template_production_ready(template_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.should_send_alert_notification(alert_severity text, min_severity text) SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_alert_notification() SET search_path = public, pg_temp;
