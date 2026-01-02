/*
  # Fix Security and Performance Issues - Part 2: Drop Unused Indexes

  ## Changes Made

  ### Drop Unused Indexes
    - Remove all indexes that are not being used by queries
    - This reduces database overhead and improves write performance
    - Indexes can always be recreated if needed in the future

  ## Impact
    - Reduced storage usage
    - Improved INSERT/UPDATE/DELETE performance
    - No impact on query performance (indexes were not being used)
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_login_logs_user_id;
DROP INDEX IF EXISTS idx_purchases_template_id;
DROP INDEX IF EXISTS idx_document_views_user_id;
DROP INDEX IF EXISTS idx_dossier_activity_user_id;
DROP INDEX IF EXISTS idx_dossier_documents_reviewed_by;
DROP INDEX IF EXISTS idx_generated_documents_folder_id;
DROP INDEX IF EXISTS idx_legal_rules_jurisdiction_id;
DROP INDEX IF EXISTS idx_legal_rules_template_id;
DROP INDEX IF EXISTS idx_recommendation_rules_source_template_id;
DROP INDEX IF EXISTS idx_referrals_affiliate_id;
DROP INDEX IF EXISTS idx_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_signature_workflows_created_by;
DROP INDEX IF EXISTS idx_signature_workflows_document_id;
DROP INDEX IF EXISTS idx_template_certificates_revoked_by;
DROP INDEX IF EXISTS idx_transactions_user_id;
DROP INDEX IF EXISTS idx_workflow_signers_workflow_id;
DROP INDEX IF EXISTS idx_accounting_log_created_by;
DROP INDEX IF EXISTS idx_api_keys_user_id;
DROP INDEX IF EXISTS idx_api_logs_api_key_id;
DROP INDEX IF EXISTS idx_bulk_campaigns_user_id;
DROP INDEX IF EXISTS idx_bulk_sends_campaign_id;
DROP INDEX IF EXISTS idx_credit_purchases_package_id;
DROP INDEX IF EXISTS idx_document_folders_parent_folder_id;
DROP INDEX IF EXISTS idx_document_folders_user_id;
DROP INDEX IF EXISTS idx_document_versions_document_id;
DROP INDEX IF EXISTS idx_document_views_template_id;
DROP INDEX IF EXISTS idx_credits_transactions_user;
DROP INDEX IF EXISTS idx_credits_transactions_created;
DROP INDEX IF EXISTS idx_user_subscriptions_user;
DROP INDEX IF EXISTS idx_user_subscriptions_status;
DROP INDEX IF EXISTS idx_affiliate_clicks_affiliate;
DROP INDEX IF EXISTS idx_affiliate_clicks_created;
DROP INDEX IF EXISTS idx_abandoned_carts_user;
DROP INDEX IF EXISTS idx_abandoned_carts_recovered;
DROP INDEX IF EXISTS idx_flash_deals_active;
DROP INDEX IF EXISTS idx_email_logs_user;
DROP INDEX IF EXISTS idx_ab_test_conversions_test;
DROP INDEX IF EXISTS idx_upsell_conversions_user;
DROP INDEX IF EXISTS idx_service_orders_status;
DROP INDEX IF EXISTS idx_traffic_events_session;
DROP INDEX IF EXISTS idx_traffic_events_created;
DROP INDEX IF EXISTS idx_traffic_events_source;
DROP INDEX IF EXISTS idx_traffic_events_type;
DROP INDEX IF EXISTS idx_traffic_events_page;
DROP INDEX IF EXISTS idx_conversions_session;
DROP INDEX IF EXISTS idx_conversions_created;
DROP INDEX IF EXISTS idx_conversions_type;
DROP INDEX IF EXISTS idx_referral_rewards_user_id;
DROP INDEX IF EXISTS idx_referrals_transaction_id;
DROP INDEX IF EXISTS idx_service_orders_assigned_to;
DROP INDEX IF EXISTS idx_service_orders_document_id;
DROP INDEX IF EXISTS idx_ab_test_conversions_user_id;
DROP INDEX IF EXISTS idx_ab_test_conversions_variant_id;
DROP INDEX IF EXISTS idx_ab_test_variants_test_id;
DROP INDEX IF EXISTS idx_achievements_user_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_affiliate_id;
DROP INDEX IF EXISTS idx_articles_author_id;
DROP INDEX IF EXISTS idx_audit_log_admin_id;
DROP INDEX IF EXISTS idx_bulk_sends_document_id;
DROP INDEX IF EXISTS idx_cart_recovery_campaigns_cart_id;
DROP INDEX IF EXISTS idx_clients_user_id;
DROP INDEX IF EXISTS idx_credit_purchases_user_id;
DROP INDEX IF EXISTS idx_credit_transactions_user_id;
DROP INDEX IF EXISTS idx_document_signatures_document_id;
DROP INDEX IF EXISTS idx_document_signatures_user_id;
DROP INDEX IF EXISTS idx_document_versions_created_by;
DROP INDEX IF EXISTS idx_dossier_activity_dossier_id;
DROP INDEX IF EXISTS idx_dossier_documents_dossier_id;
DROP INDEX IF EXISTS idx_dossiers_client_id;
DROP INDEX IF EXISTS idx_dossiers_created_by_user_id;
DROP INDEX IF EXISTS idx_email_campaigns_sequence_id;
DROP INDEX IF EXISTS idx_email_logs_campaign_id;
DROP INDEX IF EXISTS idx_enterprise_licenses_admin_user_id;
DROP INDEX IF EXISTS idx_enterprise_licenses_plan_id;
DROP INDEX IF EXISTS idx_flash_deal_purchases_user_id;
DROP INDEX IF EXISTS idx_flash_deals_template_id;
DROP INDEX IF EXISTS idx_generated_documents_user_id;
DROP INDEX IF EXISTS idx_payments_document_id;
DROP INDEX IF EXISTS idx_payments_user_id;
DROP INDEX IF EXISTS idx_referral_rewards_referral_id;
DROP INDEX IF EXISTS idx_service_orders_service_id;
DROP INDEX IF EXISTS idx_service_orders_user_id;
DROP INDEX IF EXISTS idx_social_proof_stats_template_id;
DROP INDEX IF EXISTS idx_team_members_user_id;
DROP INDEX IF EXISTS idx_template_certificates_approved_by_user_id;
DROP INDEX IF EXISTS idx_template_test_runs_admin_id;
DROP INDEX IF EXISTS idx_transactions_document_id;
DROP INDEX IF EXISTS idx_upsell_conversions_original_template_id;
DROP INDEX IF EXISTS idx_upsell_conversions_rule_id;
DROP INDEX IF EXISTS idx_upsell_conversions_upsold_template_id;
DROP INDEX IF EXISTS idx_upsell_rules_trigger_template_id;
DROP INDEX IF EXISTS idx_user_badges_badge_id;
DROP INDEX IF EXISTS idx_user_documents_user_id;
DROP INDEX IF EXISTS idx_user_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_user_subscriptions_plan_id;
DROP INDEX IF EXISTS idx_seo_landing_pages_slug;
DROP INDEX IF EXISTS idx_seo_landing_pages_published;
DROP INDEX IF EXISTS idx_user_activity_timestamp;
DROP INDEX IF EXISTS idx_user_activity_page_url;
DROP INDEX IF EXISTS idx_user_activity_activity_type;
DROP INDEX IF EXISTS idx_page_visit_summaries_date;
DROP INDEX IF EXISTS idx_page_visit_summaries_url;
DROP INDEX IF EXISTS idx_country_disclaimers_code;
DROP INDEX IF EXISTS idx_country_disclaimers_active;
DROP INDEX IF EXISTS idx_generators_country;
DROP INDEX IF EXISTS idx_generators_locale;
DROP INDEX IF EXISTS idx_generators_slug;
DROP INDEX IF EXISTS idx_generators_active;
DROP INDEX IF EXISTS idx_steps_generator;
DROP INDEX IF EXISTS idx_fields_step;
DROP INDEX IF EXISTS idx_seo_scorecards_country;
DROP INDEX IF EXISTS idx_seo_scorecards_locale;
DROP INDEX IF EXISTS idx_seo_scorecards_active;
DROP INDEX IF EXISTS idx_seo_keywords_scorecard;
DROP INDEX IF EXISTS idx_seo_keywords_intent;
DROP INDEX IF EXISTS idx_seo_keywords_keyword;
DROP INDEX IF EXISTS idx_seo_keywords_target_page;
DROP INDEX IF EXISTS idx_seo_keywords_active;
DROP INDEX IF EXISTS idx_country_detect_active;
DROP INDEX IF EXISTS idx_country_detect_enabled;
DROP INDEX IF EXISTS idx_country_detect_locale;
