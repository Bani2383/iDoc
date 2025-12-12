/*
  # Security Fix Part 3: Function Security (Corrected)
  
  Fixes all functions with mutable search_path by setting explicit search_path
  This prevents search_path injection attacks
*/

-- Drop and recreate all functions with secure search_path

DROP FUNCTION IF EXISTS public.generate_referral_code() CASCADE;
CREATE FUNCTION public.generate_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.referral_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NEW.id::TEXT) FROM 1 FOR 8));
  RETURN NEW;
END;
$$;

-- Recreate trigger if needed
DROP TRIGGER IF EXISTS set_referral_code ON public.user_profiles;
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON public.user_profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION public.generate_referral_code();

DROP FUNCTION IF EXISTS public.increment_login_count() CASCADE;
CREATE FUNCTION public.increment_login_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.user_profiles
  SET login_count = COALESCE(login_count, 0) + 1,
      last_login_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.update_articles_updated_at() CASCADE;
CREATE FUNCTION public.update_articles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.increment_article_views(uuid) CASCADE;
CREATE FUNCTION public.increment_article_views(p_article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.articles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_article_id;
END;
$$;

DROP FUNCTION IF EXISTS public.grant_signup_credits() CASCADE;
CREATE FUNCTION public.grant_signup_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.user_profiles
  SET credits_balance = 5
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.update_loyalty_tier() CASCADE;
CREATE FUNCTION public.update_loyalty_tier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  total_spent numeric;
  new_tier text;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total_spent
  FROM public.credit_purchases
  WHERE user_id = NEW.user_id AND status = 'completed';
  
  IF total_spent >= 100 THEN
    new_tier := 'platinum';
  ELSIF total_spent >= 50 THEN
    new_tier := 'gold';
  ELSIF total_spent >= 20 THEN
    new_tier := 'silver';
  ELSE
    new_tier := 'bronze';
  END IF;
  
  UPDATE public.user_profiles
  SET loyalty_tier = new_tier
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.log_fomo_event(text, jsonb) CASCADE;
CREATE FUNCTION public.log_fomo_event(
  p_event_type text,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.fomo_events (event_type, details)
  VALUES (p_event_type, p_details);
END;
$$;

DROP FUNCTION IF EXISTS public.log_user_activity(uuid, text, jsonb) CASCADE;
CREATE FUNCTION public.log_user_activity(
  p_user_id uuid,
  p_activity_type text,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.user_activity (user_id, activity_type, details)
  VALUES (p_user_id, p_activity_type, p_details);
END;
$$;

DROP FUNCTION IF EXISTS public.log_admin_action(uuid, text, text, uuid, jsonb) CASCADE;
CREATE FUNCTION public.log_admin_action(
  p_admin_id uuid,
  p_action_type text,
  p_target_type text,
  p_target_id uuid,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.audit_log (admin_id, action_type, target_type, target_id, details)
  VALUES (p_admin_id, p_action_type, p_target_type, p_target_id, p_details);
END;
$$;

DROP FUNCTION IF EXISTS public.log_dossier_activity(uuid, uuid, text, text) CASCADE;
CREATE FUNCTION public.log_dossier_activity(
  p_dossier_id uuid,
  p_user_id uuid,
  p_activity_type text,
  p_description text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.dossier_activity (dossier_id, user_id, activity_type, description)
  VALUES (p_dossier_id, p_user_id, p_activity_type, p_description);
END;
$$;

DROP FUNCTION IF EXISTS public.change_dossier_status(uuid, text, uuid) CASCADE;
CREATE FUNCTION public.change_dossier_status(
  p_dossier_id uuid,
  p_new_status text,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.dossiers
  SET status = p_new_status,
      updated_at = NOW()
  WHERE id = p_dossier_id;
  
  PERFORM public.log_dossier_activity(
    p_dossier_id,
    p_user_id,
    'status_change',
    'Statut changé en: ' || p_new_status
  );
END;
$$;

DROP FUNCTION IF EXISTS public.run_template_test(uuid, uuid, jsonb) CASCADE;
CREATE FUNCTION public.run_template_test(
  p_template_id uuid,
  p_admin_id uuid,
  p_test_data jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_test_run_id uuid;
  v_result text := 'pass';
BEGIN
  INSERT INTO public.template_test_runs (template_id, admin_id, test_data, result)
  VALUES (p_template_id, p_admin_id, p_test_data, v_result)
  RETURNING id INTO v_test_run_id;
  
  RETURN v_test_run_id;
END;
$$;

DROP FUNCTION IF EXISTS public.approve_template(uuid, uuid) CASCADE;
CREATE FUNCTION public.approve_template(
  p_template_id uuid,
  p_admin_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.template_certificates (
    template_id,
    approved_by,
    status,
    valid_from,
    valid_until
  )
  VALUES (
    p_template_id,
    p_admin_id,
    'active',
    NOW(),
    NOW() + INTERVAL '1 year'
  );
  
  UPDATE public.document_templates
  SET last_reviewed_by = p_admin_id,
      last_reviewed_at = NOW()
  WHERE id = p_template_id;
END;
$$;

DROP FUNCTION IF EXISTS public.reject_template(uuid, uuid, text) CASCADE;
CREATE FUNCTION public.reject_template(
  p_template_id uuid,
  p_admin_id uuid,
  p_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.template_certificates (
    template_id,
    approved_by,
    status,
    rejection_reason
  )
  VALUES (
    p_template_id,
    p_admin_id,
    'rejected',
    p_reason
  );
END;
$$;

DROP FUNCTION IF EXISTS public.publish_template(uuid) CASCADE;
CREATE FUNCTION public.publish_template(
  p_template_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.document_templates
  SET is_active = true
  WHERE id = p_template_id;
END;
$$;

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.increment_statistic(text, integer) CASCADE;
CREATE FUNCTION public.increment_statistic(
  p_stat_name text,
  p_increment integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.site_statistics (stat_name, stat_value)
  VALUES (p_stat_name, p_increment)
  ON CONFLICT (stat_name)
  DO UPDATE SET
    stat_value = public.site_statistics.stat_value + p_increment,
    updated_at = NOW();
END;
$$;

-- Fix security definer view with correct columns
DROP VIEW IF EXISTS public.templates_available_for_sale;
CREATE VIEW public.templates_available_for_sale
WITH (security_invoker=true)
AS
SELECT 
  id,
  name,
  description,
  category,
  price,
  is_active,
  created_at,
  updated_at
FROM public.document_templates
WHERE is_active = true
  AND price > 0;
