/*
  # Add Foreign Key Indexes - Part 4 (Tables T-W)

  1. Performance Optimization
    - Add indexes for all foreign keys in tables starting with T-W
    - Improves JOIN performance and referential integrity checks
    - Reduces query execution time for foreign key lookups

  2. Tables Affected
    - team_members
    - template_alerts
    - template_certificates
    - template_health_log
    - template_render_fallbacks
    - template_test_runs
    - transactions
    - upsell_conversions
    - upsell_purchases
    - upsell_rules
    - user_activity
    - user_badges
    - user_documents
    - user_referrals
    - user_subscriptions
    - workflow_signers

  3. Important Notes
    - Each index is created with IF NOT EXISTS to prevent errors
    - Indexes use conventional naming: idx_tablename_columnname
*/

-- team_members
CREATE INDEX IF NOT EXISTS idx_team_members_user_id 
  ON public.team_members(user_id);

-- template_alerts
CREATE INDEX IF NOT EXISTS idx_template_alerts_acknowledged_by 
  ON public.template_alerts(acknowledged_by);

-- template_certificates
CREATE INDEX IF NOT EXISTS idx_template_certificates_approved_by_user_id 
  ON public.template_certificates(approved_by_user_id);
CREATE INDEX IF NOT EXISTS idx_template_certificates_revoked_by 
  ON public.template_certificates(revoked_by);
CREATE INDEX IF NOT EXISTS idx_template_certificates_template_id 
  ON public.template_certificates(template_id);

-- template_health_log
CREATE INDEX IF NOT EXISTS idx_template_health_log_user_id 
  ON public.template_health_log(user_id);

-- template_render_fallbacks
CREATE INDEX IF NOT EXISTS idx_template_render_fallbacks_user_id 
  ON public.template_render_fallbacks(user_id);

-- template_test_runs
CREATE INDEX IF NOT EXISTS idx_template_test_runs_admin_id 
  ON public.template_test_runs(admin_id);
CREATE INDEX IF NOT EXISTS idx_template_test_runs_template_id 
  ON public.template_test_runs(template_id);

-- transactions
CREATE INDEX IF NOT EXISTS idx_transactions_document_id 
  ON public.transactions(document_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id 
  ON public.transactions(user_id);

-- upsell_conversions
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_original_template_id 
  ON public.upsell_conversions(original_template_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_rule_id 
  ON public.upsell_conversions(rule_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_upsold_template_id 
  ON public.upsell_conversions(upsold_template_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_user_id 
  ON public.upsell_conversions(user_id);

-- upsell_purchases
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_purchase_id 
  ON public.upsell_purchases(purchase_id);
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_upsell_offer_id 
  ON public.upsell_purchases(upsell_offer_id);
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_user_id 
  ON public.upsell_purchases(user_id);

-- upsell_rules
CREATE INDEX IF NOT EXISTS idx_upsell_rules_trigger_template_id 
  ON public.upsell_rules(trigger_template_id);

-- user_activity
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id 
  ON public.user_activity(user_id);

-- user_badges
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id 
  ON public.user_badges(badge_id);

-- user_documents
CREATE INDEX IF NOT EXISTS idx_user_documents_template_id 
  ON public.user_documents(template_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id 
  ON public.user_documents(user_id);

-- user_referrals
CREATE INDEX IF NOT EXISTS idx_user_referrals_referred_user_id 
  ON public.user_referrals(referred_user_id);

-- user_subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id 
  ON public.user_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
  ON public.user_subscriptions(user_id);

-- workflow_signers
CREATE INDEX IF NOT EXISTS idx_workflow_signers_workflow_id 
  ON public.workflow_signers(workflow_id);
