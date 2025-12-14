/*
  # Fix Function Search Path Mutability v2

  1. Security Improvement
    - Drop existing functions
    - Recreate with SECURITY DEFINER and fixed search_path
    - Prevents privilege escalation via search_path manipulation

  2. Functions Fixed
    - increment_login_count
    - increment_article_views
    - log_fomo_event
    - log_user_activity
    - log_admin_action
    - log_dossier_activity
    - change_dossier_status
    - run_template_test
    - approve_template, reject_template, publish_template
    - initialize_user_monetization
    - update_user_credits_balance
    - increment_statistic
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS public.increment_login_count(uuid);
DROP FUNCTION IF EXISTS public.increment_article_views(uuid);
DROP FUNCTION IF EXISTS public.log_fomo_event(uuid, text, text, text);
DROP FUNCTION IF EXISTS public.log_user_activity(uuid, text, jsonb);
DROP FUNCTION IF EXISTS public.log_admin_action(uuid, text, text, uuid, jsonb);
DROP FUNCTION IF EXISTS public.log_dossier_activity(uuid, uuid, text, jsonb);
DROP FUNCTION IF EXISTS public.change_dossier_status(uuid, text, uuid);
DROP FUNCTION IF EXISTS public.run_template_test(uuid, uuid, jsonb);
DROP FUNCTION IF EXISTS public.approve_template(uuid, uuid);
DROP FUNCTION IF EXISTS public.reject_template(uuid, uuid, text);
DROP FUNCTION IF EXISTS public.publish_template(uuid);
DROP FUNCTION IF EXISTS public.initialize_user_monetization(uuid);
DROP FUNCTION IF EXISTS public.update_user_credits_balance(uuid, integer, text);
DROP FUNCTION IF EXISTS public.increment_statistic(text, integer);

-- Recreate with fixed search_path

CREATE FUNCTION public.increment_login_count(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    login_count = COALESCE(login_count, 0) + 1,
    last_login_at = now(),
    updated_at = now()
  WHERE id = user_uuid;
END;
$$;

CREATE FUNCTION public.increment_article_views(article_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.articles
  SET 
    view_count = COALESCE(view_count, 0) + 1,
    updated_at = now()
  WHERE id = article_uuid;
END;
$$;

CREATE FUNCTION public.log_fomo_event(
  template_uuid uuid,
  event_type_param text,
  city_param text DEFAULT NULL,
  country_param text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.fomo_events (template_id, event_type, city, country)
  VALUES (template_uuid, event_type_param, city_param, country_param)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

CREATE FUNCTION public.log_user_activity(
  user_uuid uuid,
  activity_type_param text,
  metadata_param jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO public.user_activity (user_id, activity_type, metadata)
  VALUES (user_uuid, activity_type_param, metadata_param)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

CREATE FUNCTION public.log_admin_action(
  admin_uuid uuid,
  action_type_param text,
  target_table_param text DEFAULT NULL,
  target_uuid uuid DEFAULT NULL,
  changes_param jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.audit_log (admin_id, action_type, target_table, target_id, changes)
  VALUES (admin_uuid, action_type_param, target_table_param, target_uuid, changes_param)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

CREATE FUNCTION public.log_dossier_activity(
  dossier_uuid uuid,
  user_uuid uuid,
  action_param text,
  details_param jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO public.dossier_activity (dossier_id, user_id, action, details)
  VALUES (dossier_uuid, user_uuid, action_param, details_param)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

CREATE FUNCTION public.change_dossier_status(
  dossier_uuid uuid,
  new_status_param text,
  user_uuid uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  old_status text;
BEGIN
  SELECT status INTO old_status
  FROM public.dossiers
  WHERE id = dossier_uuid;
  
  UPDATE public.dossiers
  SET 
    status = new_status_param,
    updated_at = now()
  WHERE id = dossier_uuid;
  
  PERFORM public.log_dossier_activity(
    dossier_uuid,
    user_uuid,
    'status_change',
    jsonb_build_object('from', old_status, 'to', new_status_param)
  );
END;
$$;

CREATE FUNCTION public.run_template_test(
  template_uuid uuid,
  admin_uuid uuid,
  test_data_param jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  test_run_id uuid;
BEGIN
  INSERT INTO public.template_test_runs (template_id, admin_id, test_data, status)
  VALUES (template_uuid, admin_uuid, test_data_param, 'pending')
  RETURNING id INTO test_run_id;
  
  RETURN test_run_id;
END;
$$;

CREATE FUNCTION public.approve_template(
  template_uuid uuid,
  admin_uuid uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.template_certificates
  SET 
    status = 'approved',
    approved_by_user_id = admin_uuid,
    approved_at = now()
  WHERE template_id = template_uuid;
  
  UPDATE public.document_templates
  SET is_active = true
  WHERE id = template_uuid;
END;
$$;

CREATE FUNCTION public.reject_template(
  template_uuid uuid,
  admin_uuid uuid,
  reason_param text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.template_certificates
  SET 
    status = 'rejected',
    approved_by_user_id = admin_uuid,
    revoked_at = now(),
    notes = reason_param
  WHERE template_id = template_uuid;
  
  UPDATE public.document_templates
  SET is_active = false
  WHERE id = template_uuid;
END;
$$;

CREATE FUNCTION public.publish_template(template_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.document_templates
  SET 
    is_active = true,
    updated_at = now()
  WHERE id = template_uuid;
END;
$$;

CREATE FUNCTION public.initialize_user_monetization(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_balance, total_purchased, total_used)
  VALUES (user_uuid, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.user_levels (user_id, level, xp, tier)
  VALUES (user_uuid, 1, 0, 'bronze')
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

CREATE FUNCTION public.update_user_credits_balance(
  user_uuid uuid,
  amount_param integer,
  transaction_type_param text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF transaction_type_param = 'add' THEN
    UPDATE public.user_credits
    SET 
      credits_balance = credits_balance + amount_param,
      total_purchased = total_purchased + amount_param
    WHERE user_id = user_uuid;
  ELSIF transaction_type_param = 'deduct' THEN
    UPDATE public.user_credits
    SET 
      credits_balance = credits_balance - amount_param,
      total_used = total_used + amount_param
    WHERE user_id = user_uuid;
  END IF;
  
  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, balance_after)
  SELECT 
    user_uuid,
    amount_param,
    transaction_type_param,
    credits_balance
  FROM public.user_credits
  WHERE user_id = user_uuid;
END;
$$;

CREATE FUNCTION public.increment_statistic(
  stat_key_param text,
  increment_param integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.site_statistics (stat_key, stat_value, last_updated)
  VALUES (stat_key_param, increment_param, now())
  ON CONFLICT (stat_key) 
  DO UPDATE SET 
    stat_value = public.site_statistics.stat_value + increment_param,
    last_updated = now();
END;
$$;
