/*
  # Fix Unindexed Foreign Keys - Part 2 (E-Z)

  1. Performance Optimization
    - Add indexes for foreign key columns in tables E-Z
    - Improves JOIN performance and referential integrity checks
    - Reduces query execution time for filtered and joined queries

  2. Tables Covered (50 indexes)
    - email_campaigns: 1 index (sequence_id)
    - email_logs: 2 indexes (campaign_id, user_id)
    - enterprise_licenses: 2 indexes (admin_user_id, plan_id)
    - flash_deal_purchases: 1 index (user_id)
    - flash_deals: 1 index (template_id)
    - generated_documents: 2 indexes (folder_id, user_id)
    - guided_template_configs: 1 index (created_by)
    - legal_rules: 2 indexes (jurisdiction_id, template_id)
    - login_logs: 1 index (user_id)
    - payments: 2 indexes (document_id, user_id)
    - purchases: 1 index (template_id)
    - recommendation_rules: 1 index (source_template_id)
    - referral_rewards: 2 indexes (referral_id, user_id)
    - referrals: 3 indexes (affiliate_id, referred_user_id, transaction_id)
    - seo_priority_keywords: 1 index (scorecard_id)
    - service_orders: 4 indexes (assigned_to, document_id, service_id, user_id)
    - signature_workflows: 2 indexes (created_by, document_id)
    - social_proof_stats: 1 index (template_id)
    - team_members: 1 index (user_id)
    - template_certificates: 2 indexes (approved_by_user_id, revoked_by)
    - template_test_runs: 1 index (admin_id)
    - transactions: 2 indexes (document_id, user_id)
    - upsell_conversions: 4 indexes (original_template_id, rule_id, upsold_template_id, user_id)
    - upsell_rules: 1 index (trigger_template_id)
    - user_badges: 1 index (badge_id)
    - user_documents: 1 index (user_id)
    - user_referrals: 1 index (referred_user_id)
    - user_subscriptions: 2 indexes (plan_id, user_id)
    - workflow_signers: 1 index (workflow_id)

  3. Security Notes
    - All indexes use IF NOT EXISTS to prevent errors on re-run
    - Indexes improve both query performance and RLS policy evaluation
*/

-- email_campaigns (1 index)
CREATE INDEX IF NOT EXISTS idx_email_campaigns_sequence_id ON public.email_campaigns(sequence_id);

-- email_logs (2 indexes)
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id ON public.email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs(user_id);

-- enterprise_licenses (2 indexes)
CREATE INDEX IF NOT EXISTS idx_enterprise_licenses_admin_user_id ON public.enterprise_licenses(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_licenses_plan_id ON public.enterprise_licenses(plan_id);

-- flash_deal_purchases (1 index)
CREATE INDEX IF NOT EXISTS idx_flash_deal_purchases_user_id ON public.flash_deal_purchases(user_id);

-- flash_deals (1 index)
CREATE INDEX IF NOT EXISTS idx_flash_deals_template_id ON public.flash_deals(template_id);

-- generated_documents (2 indexes)
CREATE INDEX IF NOT EXISTS idx_generated_documents_folder_id ON public.generated_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON public.generated_documents(user_id);

-- guided_template_configs (1 index)
CREATE INDEX IF NOT EXISTS idx_guided_template_configs_created_by ON public.guided_template_configs(created_by);

-- legal_rules (2 indexes)
CREATE INDEX IF NOT EXISTS idx_legal_rules_jurisdiction_id ON public.legal_rules(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_legal_rules_template_id ON public.legal_rules(template_id);

-- login_logs (1 index)
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs(user_id);

-- payments (2 indexes)
CREATE INDEX IF NOT EXISTS idx_payments_document_id ON public.payments(document_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);

-- purchases (1 index)
CREATE INDEX IF NOT EXISTS idx_purchases_template_id ON public.purchases(template_id);

-- recommendation_rules (1 index)
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_source_template_id ON public.recommendation_rules(source_template_id);

-- referral_rewards (2 indexes)
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referral_id ON public.referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON public.referral_rewards(user_id);

-- referrals (3 indexes)
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON public.referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_transaction_id ON public.referrals(transaction_id);

-- seo_priority_keywords (1 index)
CREATE INDEX IF NOT EXISTS idx_seo_priority_keywords_scorecard_id ON public.seo_priority_keywords(scorecard_id);

-- service_orders (4 indexes)
CREATE INDEX IF NOT EXISTS idx_service_orders_assigned_to ON public.service_orders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_service_orders_document_id ON public.service_orders(document_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_service_id ON public.service_orders(service_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_user_id ON public.service_orders(user_id);

-- signature_workflows (2 indexes)
CREATE INDEX IF NOT EXISTS idx_signature_workflows_created_by ON public.signature_workflows(created_by);
CREATE INDEX IF NOT EXISTS idx_signature_workflows_document_by ON public.signature_workflows(document_id);

-- social_proof_stats (1 index)
CREATE INDEX IF NOT EXISTS idx_social_proof_stats_template_id ON public.social_proof_stats(template_id);

-- team_members (1 index)
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

-- template_certificates (2 indexes)
CREATE INDEX IF NOT EXISTS idx_template_certificates_approved_by_user_id ON public.template_certificates(approved_by_user_id);
CREATE INDEX IF NOT EXISTS idx_template_certificates_revoked_by ON public.template_certificates(revoked_by);

-- template_test_runs (1 index)
CREATE INDEX IF NOT EXISTS idx_template_test_runs_admin_id ON public.template_test_runs(admin_id);

-- transactions (2 indexes)
CREATE INDEX IF NOT EXISTS idx_transactions_document_id ON public.transactions(document_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

-- upsell_conversions (4 indexes)
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_original_template_id ON public.upsell_conversions(original_template_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_rule_id ON public.upsell_conversions(rule_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_upsold_template_id ON public.upsell_conversions(upsold_template_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_user_id ON public.upsell_conversions(user_id);

-- upsell_rules (1 index)
CREATE INDEX IF NOT EXISTS idx_upsell_rules_trigger_template_id ON public.upsell_rules(trigger_template_id);

-- user_badges (1 index)
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);

-- user_documents (1 index)
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON public.user_documents(user_id);

-- user_referrals (1 index)
CREATE INDEX IF NOT EXISTS idx_user_referrals_referred_user_id ON public.user_referrals(referred_user_id);

-- user_subscriptions (2 indexes)
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON public.user_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);

-- workflow_signers (1 index)
CREATE INDEX IF NOT EXISTS idx_workflow_signers_workflow_id ON public.workflow_signers(workflow_id);
