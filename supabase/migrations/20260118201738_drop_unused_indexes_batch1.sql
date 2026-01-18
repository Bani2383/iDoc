/*
  # Drop Unused Indexes - Batch 1 (A-C tables)

  1. Changes
    - Drop unused indexes on tables starting with A-C
    - Improves write performance
    - Reduces storage overhead
    
  2. Tables affected
    - ab_test_*, abandoned_carts, accounting_log, achievements
    - affiliate_*, api_*, articles, audit_log, bundle_*
    - bulk_*, cart_recovery_campaigns, clients, credit_*
*/

-- AB Test tables
DROP INDEX IF EXISTS idx_ab_test_conversions_test_id;
DROP INDEX IF EXISTS idx_ab_test_conversions_user_id;
DROP INDEX IF EXISTS idx_ab_test_conversions_variant_id;
DROP INDEX IF EXISTS idx_ab_test_variants_test_id;
DROP INDEX IF EXISTS idx_ab_test_assignments_test;
DROP INDEX IF EXISTS idx_ab_test_assignments_user_id;

-- Abandoned carts
DROP INDEX IF EXISTS idx_abandoned_carts_user_id;

-- Accounting
DROP INDEX IF EXISTS idx_accounting_log_created_by;
DROP INDEX IF EXISTS idx_accounting_log_created_at;

-- Achievements
DROP INDEX IF EXISTS idx_achievements_user_id;

-- Affiliates
DROP INDEX IF EXISTS idx_affiliate_clicks_affiliate_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_affiliate_id;
DROP INDEX IF EXISTS idx_affiliates_user;
DROP INDEX IF EXISTS idx_affiliates_code;
DROP INDEX IF EXISTS idx_affiliates_active;

-- API
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

-- Bundles
DROP INDEX IF EXISTS idx_bundle_items_bundle;
DROP INDEX IF EXISTS idx_bundle_items_template_id;
DROP INDEX IF EXISTS idx_bundle_translations_bundle;

-- Bulk operations
DROP INDEX IF EXISTS idx_bulk_campaigns_user_id;
DROP INDEX IF EXISTS idx_bulk_campaigns_template_id;
DROP INDEX IF EXISTS idx_bulk_campaigns_status;
DROP INDEX IF EXISTS idx_bulk_sends_campaign_id;
DROP INDEX IF EXISTS idx_bulk_sends_document_id;
DROP INDEX IF EXISTS idx_bulk_sends_status;

-- Cart recovery
DROP INDEX IF EXISTS idx_cart_recovery_campaigns_cart_id;

-- Clients
DROP INDEX IF EXISTS idx_clients_user_id;

-- Credits
DROP INDEX IF EXISTS idx_credit_purchases_package_id;
DROP INDEX IF EXISTS idx_credit_purchases_user_id;
DROP INDEX IF EXISTS idx_credit_transactions_user_id;
DROP INDEX IF EXISTS idx_credits_transactions_user_id;
