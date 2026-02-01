/*
  # Drop Unused Indexes - Batch 3

  1. Performance Optimization
    - Removes additional unused indexes
    
  2. Indexes Removed (Batch 3/5)
    - Login logs
    - Payments and transactions
    - Purchases
    - Recommendations
    - Referrals
    - SEO system
    - Service orders
    - Subscriptions
*/

-- Login Logs
DROP INDEX IF EXISTS idx_login_logs_user_id;
DROP INDEX IF EXISTS idx_login_logs_login_at;
DROP INDEX IF EXISTS idx_login_logs_logged_in_at;
DROP INDEX IF EXISTS idx_login_logs_user_timeline;

-- Payments
DROP INDEX IF EXISTS idx_payments_document_id;
DROP INDEX IF EXISTS idx_payments_user_id;

-- Purchases
DROP INDEX IF EXISTS idx_purchases_template_id;
DROP INDEX IF EXISTS idx_purchases_user_id;
DROP INDEX IF EXISTS idx_purchases_status;
DROP INDEX IF EXISTS idx_purchases_created_at;
DROP INDEX IF EXISTS idx_purchases_bundle_id;

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

-- Service Orders
DROP INDEX IF EXISTS idx_service_orders_assigned_to;
DROP INDEX IF EXISTS idx_service_orders_document_id;
DROP INDEX IF EXISTS idx_service_orders_service_id;
DROP INDEX IF EXISTS idx_service_orders_user_id;

-- Subscriptions
DROP INDEX IF EXISTS idx_subscriptions_user;
DROP INDEX IF EXISTS idx_subscriptions_stripe_customer;
DROP INDEX IF EXISTS idx_subscriptions_status;
DROP INDEX IF EXISTS idx_subscriptions_v2_user_id;
DROP INDEX IF EXISTS idx_subscriptions_v2_stripe_customer_id;
DROP INDEX IF EXISTS idx_subscriptions_v2_stripe_subscription_id;
DROP INDEX IF EXISTS idx_subscriptions_v2_status;

-- Transactions
DROP INDEX IF EXISTS idx_transactions_stripe;
DROP INDEX IF EXISTS idx_transactions_type;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_document_id;
DROP INDEX IF EXISTS idx_transactions_user_id;