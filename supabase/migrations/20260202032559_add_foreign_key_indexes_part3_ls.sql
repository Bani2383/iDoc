/*
  # Add Foreign Key Indexes - Part 3 (Tables L-S)

  1. Performance Optimization
    - Add indexes for all foreign keys in tables starting with L-S
    - Improves JOIN performance and referential integrity checks
    - Reduces query execution time for foreign key lookups

  2. Tables Affected
    - legal_rules
    - login_logs
    - payments
    - purchases
    - recommendation_rules
    - referral_rewards
    - referrals
    - seo_landing_pages
    - seo_priority_keywords
    - service_orders
    - signature_workflows
    - social_proof_stats
    - subscriptions
    - subscriptions_v2
    - system_settings

  3. Important Notes
    - Each index is created with IF NOT EXISTS to prevent errors
    - Indexes use conventional naming: idx_tablename_columnname
*/

-- legal_rules
CREATE INDEX IF NOT EXISTS idx_legal_rules_jurisdiction_id 
  ON public.legal_rules(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_legal_rules_template_id 
  ON public.legal_rules(template_id);

-- login_logs
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id 
  ON public.login_logs(user_id);

-- payments
CREATE INDEX IF NOT EXISTS idx_payments_document_id 
  ON public.payments(document_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id 
  ON public.payments(user_id);

-- purchases
CREATE INDEX IF NOT EXISTS idx_purchases_bundle_id 
  ON public.purchases(bundle_id);
CREATE INDEX IF NOT EXISTS idx_purchases_template_id 
  ON public.purchases(template_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id 
  ON public.purchases(user_id);

-- recommendation_rules
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_recommended_template_id 
  ON public.recommendation_rules(recommended_template_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_source_template_id 
  ON public.recommendation_rules(source_template_id);

-- referral_rewards
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referral_id 
  ON public.referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id 
  ON public.referral_rewards(user_id);

-- referrals
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id 
  ON public.referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id 
  ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_transaction_id 
  ON public.referrals(transaction_id);

-- seo_landing_pages
CREATE INDEX IF NOT EXISTS idx_seo_landing_pages_created_by 
  ON public.seo_landing_pages(created_by);

-- seo_priority_keywords
CREATE INDEX IF NOT EXISTS idx_seo_priority_keywords_scorecard_id 
  ON public.seo_priority_keywords(scorecard_id);

-- service_orders
CREATE INDEX IF NOT EXISTS idx_service_orders_assigned_to 
  ON public.service_orders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_service_orders_document_id 
  ON public.service_orders(document_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_service_id 
  ON public.service_orders(service_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_user_id 
  ON public.service_orders(user_id);

-- signature_workflows
CREATE INDEX IF NOT EXISTS idx_signature_workflows_created_by 
  ON public.signature_workflows(created_by);
CREATE INDEX IF NOT EXISTS idx_signature_workflows_document_id 
  ON public.signature_workflows(document_id);

-- social_proof_stats
CREATE INDEX IF NOT EXISTS idx_social_proof_stats_template_id 
  ON public.social_proof_stats(template_id);

-- subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
  ON public.subscriptions(user_id);

-- subscriptions_v2
CREATE INDEX IF NOT EXISTS idx_subscriptions_v2_user_id 
  ON public.subscriptions_v2(user_id);

-- system_settings
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by 
  ON public.system_settings(updated_by);
