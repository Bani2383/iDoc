/*
  # Drop Unused Indexes - Batch 3 (P-Z tables)

  1. Changes
    - Drop unused indexes on remaining tables P-Z
    - Complete performance optimization
    
  2. Tables affected
    - payments, purchases, recommendation_*, referral_*
    - seo_*, service_orders, shadow_*, signature_*
    - social_proof, subscriptions*, system_*, template_*
    - transactions, upsell_*, user_*, workflow_*
*/

-- Payments & Purchases
DROP INDEX IF EXISTS idx_payments_document_id;
DROP INDEX IF EXISTS idx_payments_user_id;
DROP INDEX IF EXISTS idx_purchases_template_id;
DROP INDEX IF EXISTS idx_purchases_user_id;
DROP INDEX IF EXISTS idx_purchases_bundle_id;
DROP INDEX IF EXISTS idx_purchases_status;
DROP INDEX IF EXISTS idx_purchases_created_at;

-- Recommendations
DROP INDEX IF EXISTS idx_recommendation_rules_active;
DROP INDEX IF EXISTS idx_recommendation_rules_source_template_id;
DROP INDEX IF EXISTS idx_recommendation_rules_recommended_template_id;

-- Referrals
DROP INDEX IF EXISTS idx_referral_rewards_referral_id;
DROP INDEX IF EXISTS idx_referral_rewards_user_id;
DROP INDEX IF EXISTS idx_referrals_affiliate_id;
DROP INDEX IF EXISTS idx_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_referrals_transaction_id;
DROP INDEX IF EXISTS idx_referrals_status;

-- SEO
DROP INDEX IF EXISTS idx_seo_priority_keywords_scorecard_id;
DROP INDEX IF EXISTS idx_seo_landing_pages_created_by;

-- Service orders
DROP INDEX IF EXISTS idx_service_orders_assigned_to;
DROP INDEX IF EXISTS idx_service_orders_document_id;
DROP INDEX IF EXISTS idx_service_orders_service_id;
DROP INDEX IF EXISTS idx_service_orders_user_id;

-- Shadow testing
DROP INDEX IF EXISTS idx_shadow_template;
DROP INDEX IF EXISTS idx_shadow_success;
DROP INDEX IF EXISTS idx_shadow_differences;

-- Signatures
DROP INDEX IF EXISTS idx_workflows_status;
DROP INDEX IF EXISTS idx_signature_workflows_created_by;
DROP INDEX IF EXISTS idx_signature_workflows_document_by;
DROP INDEX IF EXISTS idx_workflow_signers_workflow_id;
DROP INDEX IF EXISTS idx_signers_token;
DROP INDEX IF EXISTS idx_signers_email;
DROP INDEX IF EXISTS idx_signers_status;

-- Social proof
DROP INDEX IF EXISTS idx_social_proof_stats_template_id;

-- Subscriptions
DROP INDEX IF EXISTS idx_subscriptions_user;
DROP INDEX IF EXISTS idx_subscriptions_stripe_customer;
DROP INDEX IF EXISTS idx_subscriptions_status;
DROP INDEX IF EXISTS idx_subscriptions_v2_user_id;
DROP INDEX IF EXISTS idx_subscriptions_v2_stripe_customer_id;
DROP INDEX IF EXISTS idx_subscriptions_v2_stripe_subscription_id;
DROP INDEX IF EXISTS idx_subscriptions_v2_status;
DROP INDEX IF EXISTS idx_user_subscriptions_plan_id;
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;

-- System
DROP INDEX IF EXISTS idx_system_settings_updated_by;
DROP INDEX IF EXISTS idx_alert_settings_user;

-- Templates
DROP INDEX IF EXISTS idx_doc_templates_pricing;
DROP INDEX IF EXISTS idx_doc_production_eligible;
DROP INDEX IF EXISTS idx_doc_trust_level;
DROP INDEX IF EXISTS idx_doc_shadow;
DROP INDEX IF EXISTS idx_template_certificates_template_id;
DROP INDEX IF EXISTS idx_template_certificates_approved_by_user_id;
DROP INDEX IF EXISTS idx_template_certificates_revoked_by;
DROP INDEX IF EXISTS idx_template_test_runs_admin_id;
DROP INDEX IF EXISTS idx_template_test_runs_template_id;
DROP INDEX IF EXISTS idx_template_translations_template;
DROP INDEX IF EXISTS idx_template_translations_language;
DROP INDEX IF EXISTS idx_template_alerts_created;
DROP INDEX IF EXISTS idx_template_alerts_acknowledged;
DROP INDEX IF EXISTS idx_template_alerts_type;
DROP INDEX IF EXISTS idx_template_alerts_template;
DROP INDEX IF EXISTS idx_template_alerts_acknowledged_by;
DROP INDEX IF EXISTS idx_template_health_log_user_id;
DROP INDEX IF EXISTS idx_template_render_fallbacks_user_id;
DROP INDEX IF EXISTS idx_health_log_template;
DROP INDEX IF EXISTS idx_health_log_event;
DROP INDEX IF EXISTS idx_health_log_environment;
DROP INDEX IF EXISTS idx_fallbacks_template;
DROP INDEX IF EXISTS idx_fallbacks_created;
DROP INDEX IF EXISTS idx_fallbacks_environment;

-- Transactions
DROP INDEX IF EXISTS idx_transactions_stripe;
DROP INDEX IF EXISTS idx_transactions_type;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_document_id;
DROP INDEX IF EXISTS idx_transactions_user_id;

-- Upsell
DROP INDEX IF EXISTS idx_upsell_conversions_original_template_id;
DROP INDEX IF EXISTS idx_upsell_conversions_rule_id;
DROP INDEX IF EXISTS idx_upsell_conversions_upsold_template_id;
DROP INDEX IF EXISTS idx_upsell_conversions_user_id;
DROP INDEX IF EXISTS idx_upsell_rules_trigger_template_id;
DROP INDEX IF EXISTS idx_upsell_purchases_user;
DROP INDEX IF EXISTS idx_upsell_purchases_purchase;
DROP INDEX IF EXISTS idx_upsell_purchases_upsell_offer_id;

-- Users
DROP INDEX IF EXISTS idx_user_badges_badge_id;
DROP INDEX IF EXISTS idx_user_documents_template_id;
DROP INDEX IF EXISTS idx_user_documents_user_id;
DROP INDEX IF EXISTS idx_user_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_user_activity_user_id;
DROP INDEX IF EXISTS idx_user_profiles_created_at;
DROP INDEX IF EXISTS idx_team_members_user_id;

-- Analytics
DROP INDEX IF EXISTS idx_analytics_events_type;
DROP INDEX IF EXISTS idx_analytics_events_template;
DROP INDEX IF EXISTS idx_analytics_events_created;
DROP INDEX IF EXISTS idx_analytics_events_bundle_id;
DROP INDEX IF EXISTS idx_analytics_events_user_id;
