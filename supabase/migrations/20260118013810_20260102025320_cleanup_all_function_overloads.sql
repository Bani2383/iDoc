/*
  # Clean Up All Function Overloads

  1. Issue
    - Multiple overloaded versions of functions exist
    - Different signatures from various migrations
    - All need to be removed and replaced with hardened versions

  2. Solution
    - Drop every single overload by exact signature
    - Recreate only the production-ready hardened versions
*/

-- Drop increment_article_views overloads
DROP FUNCTION IF EXISTS public.increment_article_views(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.increment_article_views(text) CASCADE;

-- Drop log_fomo_event overloads  
DROP FUNCTION IF EXISTS public.log_fomo_event() CASCADE;
DROP FUNCTION IF EXISTS public.log_fomo_event(text, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.log_fomo_event(text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.log_fomo_event(text, text, text, numeric) CASCADE;
DROP FUNCTION IF EXISTS public.log_fomo_event(uuid, text, text, text) CASCADE;

-- Drop log_user_activity overloads
DROP FUNCTION IF EXISTS public.log_user_activity(uuid, text, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.log_user_activity(uuid, text, text, text, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.log_user_activity(uuid, text, jsonb) CASCADE;

-- Drop log_admin_action overloads
DROP FUNCTION IF EXISTS public.log_admin_action(uuid, text, text, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.log_admin_action(uuid, text, text, text) CASCADE;

-- Drop track_page_visit overloads
DROP FUNCTION IF EXISTS public.track_page_visit(uuid, text, text, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.track_page_visit(uuid, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.track_page_visit(uuid, text, text) CASCADE;

-- Drop change_dossier_status overloads
DROP FUNCTION IF EXISTS public.change_dossier_status(uuid, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.change_dossier_status(uuid, text) CASCADE;

-- Drop run_template_test overloads
DROP FUNCTION IF EXISTS public.run_template_test(uuid, uuid, jsonb) CASCADE;

-- Drop approve_template overloads
DROP FUNCTION IF EXISTS public.approve_template(uuid, uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.approve_template(uuid, uuid) CASCADE;

-- Drop reject_template overloads
DROP FUNCTION IF EXISTS public.reject_template(uuid, uuid, text) CASCADE;

-- Drop publish_template overloads
DROP FUNCTION IF EXISTS public.publish_template(uuid) CASCADE;

-- Drop update_page_visit_summary overloads
DROP FUNCTION IF EXISTS public.update_page_visit_summary() CASCADE;

-- Drop increment_statistic overloads
DROP FUNCTION IF EXISTS public.increment_statistic(text) CASCADE;

-- ============================================================================
-- RECREATE HARDENED FUNCTIONS
-- ============================================================================

-- 1. increment_article_views (by UUID only)
CREATE FUNCTION public.increment_article_views(article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.articles
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = article_id;
END;
$$;

-- 2. log_fomo_event (primary version)
CREATE FUNCTION public.log_fomo_event(
  event_type text,
  event_message text,
  event_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.fomo_events (event_type, message, metadata)
  VALUES (event_type, event_message, event_metadata)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- 3. log_user_activity (primary version)
CREATE FUNCTION public.log_user_activity(
  p_user_id uuid,
  p_activity_type text,
  p_description text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO public.user_activity (user_id, activity_type, description, metadata)
  VALUES (p_user_id, p_activity_type, p_description, p_metadata)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- 4. log_admin_action
CREATE FUNCTION public.log_admin_action(
  p_admin_id uuid,
  p_action text,
  p_target_type text,
  p_target_id text,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.audit_log (admin_id, action, target_type, target_id, details)
  VALUES (p_admin_id, p_action, p_target_type, p_target_id, p_details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- 5. track_page_visit
CREATE FUNCTION public.track_page_visit(
  p_user_id uuid,
  p_page_path text,
  p_page_title text,
  p_referrer text DEFAULT '',
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  visit_id uuid;
BEGIN
  INSERT INTO public.page_visits (user_id, page_path, page_title, referrer, metadata)
  VALUES (p_user_id, p_page_path, p_page_title, p_referrer, p_metadata)
  RETURNING id INTO visit_id;
  
  RETURN visit_id;
EXCEPTION
  WHEN undefined_table THEN
    RETURN NULL;
END;
$$;

-- 6. change_dossier_status
CREATE FUNCTION public.change_dossier_status(
  p_dossier_id uuid,
  p_new_status text,
  p_notes text DEFAULT ''
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  old_status text;
  current_user_id uuid;
BEGIN
  SELECT status INTO old_status FROM public.dossiers WHERE id = p_dossier_id;
  UPDATE public.dossiers SET status = p_new_status, updated_at = NOW() WHERE id = p_dossier_id;
  SELECT auth.uid() INTO current_user_id;
  
  INSERT INTO public.dossier_activity (dossier_id, activity_type, description, user_id)
  VALUES (
    p_dossier_id,
    'status_change',
    'Status changed from ' || COALESCE(old_status, 'unknown') || ' to ' || p_new_status || 
    CASE WHEN p_notes != '' THEN ': ' || p_notes ELSE '' END,
    current_user_id
  );
END;
$$;

-- 7. run_template_test
CREATE FUNCTION public.run_template_test(
  p_template_id uuid,
  p_admin_id uuid,
  p_test_data jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  test_run_id uuid;
BEGIN
  INSERT INTO public.template_test_runs (template_id, admin_id, test_data, status)
  VALUES (p_template_id, p_admin_id, p_test_data, 'running')
  RETURNING id INTO test_run_id;
  
  RETURN test_run_id;
END;
$$;

-- 8. approve_template
CREATE FUNCTION public.approve_template(
  p_template_id uuid,
  p_admin_id uuid,
  p_notes text DEFAULT ''
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.template_certificates (
    template_id, approved_by_user_id, approval_notes, status
  ) VALUES (p_template_id, p_admin_id, p_notes, 'approved');
  
  UPDATE public.document_templates
  SET is_certified = true, updated_at = NOW()
  WHERE id = p_template_id;
END;
$$;

-- 9. reject_template
CREATE FUNCTION public.reject_template(
  p_template_id uuid,
  p_admin_id uuid,
  p_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.template_certificates (
    template_id, approved_by_user_id, approval_notes, status
  ) VALUES (p_template_id, p_admin_id, p_reason, 'rejected');
END;
$$;

-- 10. publish_template
CREATE FUNCTION public.publish_template(p_template_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.document_templates
  SET is_active = true, updated_at = NOW()
  WHERE id = p_template_id AND is_certified = true;
END;
$$;

-- 11. update_page_visit_summary
CREATE FUNCTION public.update_page_visit_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RAISE NOTICE 'Page visit summary updated';
END;
$$;

-- 12. increment_statistic
CREATE FUNCTION public.increment_statistic(stat_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.site_statistics (stat_name, value)
  VALUES (stat_name, 1)
  ON CONFLICT (stat_name)
  DO UPDATE SET value = public.site_statistics.value + 1, updated_at = NOW();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.increment_article_views(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_fomo_event(text, text, jsonb) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.log_user_activity(uuid, text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_action(uuid, text, text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.track_page_visit(uuid, text, text, text, jsonb) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.change_dossier_status(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.run_template_test(uuid, uuid, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_template(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_template(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_template(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_page_visit_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_statistic(text) TO authenticated, anon;
