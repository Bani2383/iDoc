/*
  # Add Missing Foreign Key Indexes

  1. Performance Improvements
    - Add indexes on all foreign keys that were missing covering indexes
    - Improves JOIN performance and query optimization
    - Critical for production scale

  2. Tables Affected
    - ab_test_conversions (user_id, variant_id)
    - ab_test_variants (test_id)
    - achievements (user_id)
    - affiliate_commissions (affiliate_id)
    - articles (author_id)
    - audit_log (admin_id)
    - bulk_sends (document_id)
    - cart_recovery_campaigns (cart_id)
    - clients (user_id)
    - credit_purchases (user_id)
    - credit_transactions (user_id)
    - document_signatures (document_id, user_id)
    - document_versions (created_by)
    - dossier_activity (dossier_id)
    - dossier_documents (dossier_id)
    - dossiers (client_id, created_by_user_id)
    - email_campaigns (sequence_id)
    - email_logs (campaign_id)
    - enterprise_licenses (admin_user_id, plan_id)
    - flash_deal_purchases (user_id)
    - flash_deals (template_id)
    - generated_documents (user_id)
    - payments (document_id, user_id)
    - referral_rewards (referral_id, user_id)
    - referrals (transaction_id)
    - service_orders (assigned_to, document_id, service_id, user_id)
    - social_proof_stats (template_id)
    - team_members (user_id)
    - template_certificates (approved_by_user_id)
    - template_test_runs (admin_id)
    - transactions (document_id)
    - upsell_conversions (original_template_id, rule_id, upsold_template_id)
    - upsell_rules (trigger_template_id)
    - user_badges (badge_id)
    - user_documents (user_id)
    - user_referrals (referred_user_id)
    - user_subscriptions (plan_id)
*/

-- ab_test_conversions indexes
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_user_id ON public.ab_test_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_variant_id ON public.ab_test_conversions(variant_id);

-- ab_test_variants indexes
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test_id ON public.ab_test_variants(test_id);

-- achievements indexes
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);

-- affiliate_commissions indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id ON public.affiliate_commissions(affiliate_id);

-- articles indexes
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);

-- audit_log indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON public.audit_log(admin_id);

-- bulk_sends indexes
CREATE INDEX IF NOT EXISTS idx_bulk_sends_document_id ON public.bulk_sends(document_id);

-- cart_recovery_campaigns indexes
CREATE INDEX IF NOT EXISTS idx_cart_recovery_campaigns_cart_id ON public.cart_recovery_campaigns(cart_id);

-- clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- credit_purchases indexes
CREATE INDEX IF NOT EXISTS idx_credit_purchases_user_id ON public.credit_purchases(user_id);

-- credit_transactions indexes
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);

-- document_signatures indexes
CREATE INDEX IF NOT EXISTS idx_document_signatures_document_id ON public.document_signatures(document_id);
CREATE INDEX IF NOT EXISTS idx_document_signatures_user_id ON public.document_signatures(user_id);

-- document_versions indexes
CREATE INDEX IF NOT EXISTS idx_document_versions_created_by ON public.document_versions(created_by);

-- dossier_activity indexes
CREATE INDEX IF NOT EXISTS idx_dossier_activity_dossier_id ON public.dossier_activity(dossier_id);

-- dossier_documents indexes
CREATE INDEX IF NOT EXISTS idx_dossier_documents_dossier_id ON public.dossier_documents(dossier_id);

-- dossiers indexes
CREATE INDEX IF NOT EXISTS idx_dossiers_client_id ON public.dossiers(client_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_created_by_user_id ON public.dossiers(created_by_user_id);

-- email_campaigns indexes
CREATE INDEX IF NOT EXISTS idx_email_campaigns_sequence_id ON public.email_campaigns(sequence_id);

-- email_logs indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id ON public.email_logs(campaign_id);

-- enterprise_licenses indexes
CREATE INDEX IF NOT EXISTS idx_enterprise_licenses_admin_user_id ON public.enterprise_licenses(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_licenses_plan_id ON public.enterprise_licenses(plan_id);

-- flash_deal_purchases indexes
CREATE INDEX IF NOT EXISTS idx_flash_deal_purchases_user_id ON public.flash_deal_purchases(user_id);

-- flash_deals indexes
CREATE INDEX IF NOT EXISTS idx_flash_deals_template_id ON public.flash_deals(template_id);

-- generated_documents indexes
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON public.generated_documents(user_id);

-- payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_document_id ON public.payments(document_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);

-- referral_rewards indexes
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referral_id ON public.referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON public.referral_rewards(user_id);

-- referrals indexes
CREATE INDEX IF NOT EXISTS idx_referrals_transaction_id ON public.referrals(transaction_id);

-- service_orders indexes
CREATE INDEX IF NOT EXISTS idx_service_orders_assigned_to ON public.service_orders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_service_orders_document_id ON public.service_orders(document_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_service_id ON public.service_orders(service_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_user_id ON public.service_orders(user_id);

-- social_proof_stats indexes
CREATE INDEX IF NOT EXISTS idx_social_proof_stats_template_id ON public.social_proof_stats(template_id);

-- team_members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

-- template_certificates indexes
CREATE INDEX IF NOT EXISTS idx_template_certificates_approved_by_user_id ON public.template_certificates(approved_by_user_id);

-- template_test_runs indexes
CREATE INDEX IF NOT EXISTS idx_template_test_runs_admin_id ON public.template_test_runs(admin_id);

-- transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_document_id ON public.transactions(document_id);

-- upsell_conversions indexes
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_original_template_id ON public.upsell_conversions(original_template_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_rule_id ON public.upsell_conversions(rule_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_upsold_template_id ON public.upsell_conversions(upsold_template_id);

-- upsell_rules indexes
CREATE INDEX IF NOT EXISTS idx_upsell_rules_trigger_template_id ON public.upsell_rules(trigger_template_id);

-- user_badges indexes
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);

-- user_documents indexes
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON public.user_documents(user_id);

-- user_referrals indexes
CREATE INDEX IF NOT EXISTS idx_user_referrals_referred_user_id ON public.user_referrals(referred_user_id);

-- user_subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON public.user_subscriptions(plan_id);