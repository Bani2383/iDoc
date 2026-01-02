/*
  # Fix Security and Performance Issues - Part 3: Fix Function Search Paths

  ## Changes Made

  ### Fix Mutable Search Paths
    - Drop and recreate functions with SECURITY DEFINER and SET search_path = ''
    - This prevents search_path injection attacks
    - Fully qualify all table references with schema names

  ## Functions Updated
    - increment_article_views
    - log_fomo_event
    - log_user_activity
    - log_admin_action
    - track_page_visit
    - change_dossier_status
    - run_template_test
    - approve_template
    - reject_template
    - publish_template
    - update_page_visit_summary
    - update_seo_landing_pages_updated_at
    - update_country_disclaimers_updated_at
    - update_generators_updated_at
    - update_seo_scorecards_updated_at
    - update_seo_keywords_updated_at
    - initialize_user_monetization
    - update_user_credits_balance
    - update_country_detect_updated_at
    - increment_statistic
*/

-- Drop existing functions first
DROP FUNCTION IF EXISTS public.increment_article_views(uuid);
DROP FUNCTION IF EXISTS public.log_fomo_event(text, text, text, numeric);
DROP FUNCTION IF EXISTS public.log_user_activity(uuid, text, text, jsonb);
DROP FUNCTION IF EXISTS public.log_admin_action(uuid, text, text, uuid, jsonb);
DROP FUNCTION IF EXISTS public.track_page_visit(uuid, text, text, text);
DROP FUNCTION IF EXISTS public.change_dossier_status(uuid, text, uuid, text);
DROP FUNCTION IF EXISTS public.run_template_test(uuid, uuid, jsonb);
DROP FUNCTION IF EXISTS public.approve_template(uuid, uuid, text);
DROP FUNCTION IF EXISTS public.reject_template(uuid, uuid, text);
DROP FUNCTION IF EXISTS public.publish_template(uuid);
DROP FUNCTION IF EXISTS public.update_page_visit_summary();
DROP FUNCTION IF EXISTS public.update_seo_landing_pages_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_country_disclaimers_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_generators_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_seo_scorecards_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_seo_keywords_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.initialize_user_monetization() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_credits_balance() CASCADE;
DROP FUNCTION IF EXISTS public.update_country_detect_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.increment_statistic(text, integer);

-- Recreate with proper security settings

-- increment_article_views
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.articles
  SET views_count = views_count + 1
  WHERE id = article_id;
END;
$$;

-- log_fomo_event
CREATE OR REPLACE FUNCTION public.log_fomo_event(
  p_event_type text,
  p_user_location text DEFAULT NULL,
  p_template_name text DEFAULT NULL,
  p_amount numeric DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_event_id uuid;
BEGIN
  INSERT INTO public.fomo_events (event_type, user_location, template_name, amount)
  VALUES (p_event_type, p_user_location, p_template_name, p_amount)
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$;

-- log_user_activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id uuid,
  p_activity_type text,
  p_page_url text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_activity_id uuid;
BEGIN
  INSERT INTO public.user_activity (user_id, activity_type, page_url, metadata)
  VALUES (p_user_id, p_activity_type, p_page_url, p_metadata)
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$;

-- log_admin_action
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_admin_id uuid,
  p_action text,
  p_target_type text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.audit_log (admin_id, action, target_type, target_id, details)
  VALUES (p_admin_id, p_action, p_target_type, p_target_id, p_details)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- track_page_visit
CREATE OR REPLACE FUNCTION public.track_page_visit(
  p_user_id uuid,
  p_page_url text,
  p_referrer text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_activity_id uuid;
BEGIN
  INSERT INTO public.user_activity (user_id, activity_type, page_url, metadata)
  VALUES (
    p_user_id,
    'page_view',
    p_page_url,
    jsonb_build_object('referrer', p_referrer, 'user_agent', p_user_agent)
  )
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$;

-- change_dossier_status
CREATE OR REPLACE FUNCTION public.change_dossier_status(
  p_dossier_id uuid,
  p_new_status text,
  p_user_id uuid,
  p_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.dossiers
  SET status = p_new_status, updated_at = now()
  WHERE id = p_dossier_id;
  
  INSERT INTO public.dossier_activity (dossier_id, user_id, activity_type, notes)
  VALUES (p_dossier_id, p_user_id, 'status_change', p_notes);
END;
$$;

-- run_template_test
CREATE OR REPLACE FUNCTION public.run_template_test(
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
  v_test_id uuid;
BEGIN
  INSERT INTO public.template_test_runs (template_id, admin_id, test_data, status)
  VALUES (p_template_id, p_admin_id, p_test_data, 'running')
  RETURNING id INTO v_test_id;
  
  RETURN v_test_id;
END;
$$;

-- approve_template
CREATE OR REPLACE FUNCTION public.approve_template(
  p_template_id uuid,
  p_admin_id uuid,
  p_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.template_certificates (
    template_id,
    approved_by_user_id,
    status,
    notes
  )
  VALUES (p_template_id, p_admin_id, 'approved', p_notes);
  
  UPDATE public.document_templates
  SET updated_at = now()
  WHERE id = p_template_id;
END;
$$;

-- reject_template
CREATE OR REPLACE FUNCTION public.reject_template(
  p_template_id uuid,
  p_admin_id uuid,
  p_notes text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.template_certificates (
    template_id,
    approved_by_user_id,
    status,
    notes
  )
  VALUES (p_template_id, p_admin_id, 'rejected', p_notes);
  
  UPDATE public.document_templates
  SET updated_at = now()
  WHERE id = p_template_id;
END;
$$;

-- publish_template
CREATE OR REPLACE FUNCTION public.publish_template(
  p_template_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.document_templates
  SET is_active = true, updated_at = now()
  WHERE id = p_template_id;
END;
$$;

-- update_page_visit_summary
CREATE OR REPLACE FUNCTION public.update_page_visit_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.page_visit_summaries (url, date, visit_count, unique_users)
  SELECT
    page_url,
    CURRENT_DATE,
    COUNT(*),
    COUNT(DISTINCT user_id)
  FROM public.user_activity
  WHERE activity_type = 'page_view'
    AND DATE(timestamp) = CURRENT_DATE
  GROUP BY page_url
  ON CONFLICT (url, date)
  DO UPDATE SET
    visit_count = EXCLUDED.visit_count,
    unique_users = EXCLUDED.unique_users;
END;
$$;

-- Trigger functions
CREATE OR REPLACE FUNCTION public.update_seo_landing_pages_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_country_disclaimers_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_generators_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_seo_scorecards_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_seo_keywords_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.initialize_user_monetization()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, balance, total_earned, total_spent)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_credits_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.user_credits
  SET
    balance = balance + NEW.amount,
    total_earned = CASE WHEN NEW.amount > 0 THEN total_earned + NEW.amount ELSE total_earned END,
    total_spent = CASE WHEN NEW.amount < 0 THEN total_spent + ABS(NEW.amount) ELSE total_spent END
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_country_detect_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_statistic(stat_name text, increment_by integer DEFAULT 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.site_statistics (stat_key, stat_value)
  VALUES (stat_name, increment_by)
  ON CONFLICT (stat_key)
  DO UPDATE SET
    stat_value = public.site_statistics.stat_value + increment_by,
    updated_at = now();
END;
$$;

-- Recreate triggers that were dropped
CREATE TRIGGER update_seo_landing_pages_updated_at_trigger
  BEFORE UPDATE ON public.seo_landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seo_landing_pages_updated_at();

CREATE TRIGGER update_country_disclaimers_updated_at_trigger
  BEFORE UPDATE ON public.country_disclaimers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_country_disclaimers_updated_at();

CREATE TRIGGER update_generators_updated_at_trigger
  BEFORE UPDATE ON public.document_generators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_generators_updated_at();

CREATE TRIGGER update_seo_scorecards_updated_at_trigger
  BEFORE UPDATE ON public.seo_scorecards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seo_scorecards_updated_at();

CREATE TRIGGER update_seo_keywords_updated_at_trigger
  BEFORE UPDATE ON public.seo_priority_keywords
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seo_keywords_updated_at();

CREATE TRIGGER update_country_detect_updated_at_trigger
  BEFORE UPDATE ON public.country_auto_detect_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_country_detect_updated_at();
