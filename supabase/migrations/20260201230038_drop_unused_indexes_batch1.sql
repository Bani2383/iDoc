/*
  # Drop Unused Indexes - Batch 1

  1. Performance Optimization
    - Removes 50 unused indexes to improve write performance
    - Reduces database maintenance overhead
    
  2. Indexes Removed (Batch 1/5)
    - Guided template configs
    - AB testing system
    - Abandoned carts
    - Accounting and audit logs
    - Achievements
    - Affiliate system
    - API keys and logs
    - Articles
    - Jurisdictions
    - Bulk campaigns
    - Cart recovery
    - Clients
    - Credit system
*/

-- Guided template configs
DROP INDEX IF EXISTS idx_guided_configs_active;
DROP INDEX IF EXISTS idx_guided_template_configs_created_by;

-- AB Testing
DROP INDEX IF EXISTS idx_ab_test_conversions_test_id;
DROP INDEX IF EXISTS idx_ab_test_conversions_user_id;
DROP INDEX IF EXISTS idx_ab_test_conversions_variant_id;
DROP INDEX IF EXISTS idx_ab_test_variants_test_id;
DROP INDEX IF EXISTS idx_ab_test_assignments_test;
DROP INDEX IF EXISTS idx_ab_test_assignments_user_id;

-- Abandoned Carts
DROP INDEX IF EXISTS idx_abandoned_carts_user_id;

-- Accounting
DROP INDEX IF EXISTS idx_accounting_log_created_by;
DROP INDEX IF EXISTS idx_accounting_log_created_at;

-- Achievements
DROP INDEX IF EXISTS idx_achievements_user_id;

-- Affiliate System
DROP INDEX IF EXISTS idx_affiliate_clicks_affiliate_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_affiliate_id;
DROP INDEX IF EXISTS idx_affiliates_user;
DROP INDEX IF EXISTS idx_affiliates_code;
DROP INDEX IF EXISTS idx_affiliates_active;

-- API System
DROP INDEX IF EXISTS idx_api_keys_user_id;
DROP INDEX IF EXISTS idx_api_keys_hash;
DROP INDEX IF EXISTS idx_api_keys_active;
DROP INDEX IF EXISTS idx_api_logs_api_key_id;
DROP INDEX IF EXISTS idx_api_logs_created;

-- Articles
DROP INDEX IF EXISTS idx_articles_author_id;
DROP INDEX IF EXISTS idx_articles_slug;
DROP INDEX IF EXISTS idx_articles_category;

-- Audit
DROP INDEX IF EXISTS idx_audit_log_admin_id;

-- Jurisdictions
DROP INDEX IF EXISTS idx_jurisdictions_active;
DROP INDEX IF EXISTS idx_jurisdictions_code;

-- Bulk Campaigns
DROP INDEX IF EXISTS idx_bulk_campaigns_user_id;
DROP INDEX IF EXISTS idx_bulk_campaigns_template_id;
DROP INDEX IF EXISTS idx_bulk_campaigns_status;
DROP INDEX IF EXISTS idx_bulk_sends_campaign_id;
DROP INDEX IF EXISTS idx_bulk_sends_document_id;
DROP INDEX IF EXISTS idx_bulk_sends_status;

-- Cart Recovery
DROP INDEX IF EXISTS idx_cart_recovery_campaigns_cart_id;

-- Clients
DROP INDEX IF EXISTS idx_clients_user_id;

-- Credit System
DROP INDEX IF EXISTS idx_credit_purchases_package_id;
DROP INDEX IF EXISTS idx_credit_purchases_user_id;
DROP INDEX IF EXISTS idx_credit_transactions_user_id;
DROP INDEX IF EXISTS idx_credits_transactions_user_id;

-- Site Statistics
DROP INDEX IF EXISTS idx_site_statistics_metric_name;