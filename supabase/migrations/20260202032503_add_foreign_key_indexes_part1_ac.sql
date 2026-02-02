/*
  # Add Foreign Key Indexes - Part 1 (Tables A-C)

  1. Performance Optimization
    - Add indexes for all foreign keys in tables starting with A-C
    - Improves JOIN performance and referential integrity checks
    - Reduces query execution time for foreign key lookups

  2. Tables Affected
    - ab_test_assignments
    - ab_test_conversions
    - ab_test_variants
    - abandoned_carts
    - accounting_log
    - achievements
    - affiliate_clicks
    - affiliate_commissions
    - affiliates
    - alert_settings
    - analytics_events
    - api_keys
    - api_logs
    - articles
    - audit_log
    - bulk_campaigns
    - bulk_sends
    - bundle_items
    - cart_recovery_campaigns
    - clients
    - credit_purchases
    - credit_transactions
    - credits_transactions

  3. Important Notes
    - Each index is created with IF NOT EXISTS to prevent errors
    - Indexes use conventional naming: idx_tablename_columnname
*/

-- ab_test_assignments
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user_id 
  ON public.ab_test_assignments(user_id);

-- ab_test_conversions
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_test_id 
  ON public.ab_test_conversions(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_user_id 
  ON public.ab_test_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_variant_id 
  ON public.ab_test_conversions(variant_id);

-- ab_test_variants
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test_id 
  ON public.ab_test_variants(test_id);

-- abandoned_carts
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_user_id 
  ON public.abandoned_carts(user_id);

-- accounting_log
CREATE INDEX IF NOT EXISTS idx_accounting_log_created_by 
  ON public.accounting_log(created_by);

-- achievements
CREATE INDEX IF NOT EXISTS idx_achievements_user_id 
  ON public.achievements(user_id);

-- affiliate_clicks
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id 
  ON public.affiliate_clicks(affiliate_id);

-- affiliate_commissions
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id 
  ON public.affiliate_commissions(affiliate_id);

-- affiliates
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id 
  ON public.affiliates(user_id);

-- alert_settings
CREATE INDEX IF NOT EXISTS idx_alert_settings_user_id 
  ON public.alert_settings(user_id);

-- analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_events_bundle_id 
  ON public.analytics_events(bundle_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_template_id 
  ON public.analytics_events(template_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id 
  ON public.analytics_events(user_id);

-- api_keys
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id 
  ON public.api_keys(user_id);

-- api_logs
CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id 
  ON public.api_logs(api_key_id);

-- articles
CREATE INDEX IF NOT EXISTS idx_articles_author_id 
  ON public.articles(author_id);

-- audit_log
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id 
  ON public.audit_log(admin_id);

-- bulk_campaigns
CREATE INDEX IF NOT EXISTS idx_bulk_campaigns_template_id 
  ON public.bulk_campaigns(template_id);
CREATE INDEX IF NOT EXISTS idx_bulk_campaigns_user_id 
  ON public.bulk_campaigns(user_id);

-- bulk_sends
CREATE INDEX IF NOT EXISTS idx_bulk_sends_campaign_id 
  ON public.bulk_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_bulk_sends_document_id 
  ON public.bulk_sends(document_id);

-- bundle_items
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle_id 
  ON public.bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_template_id 
  ON public.bundle_items(template_id);

-- cart_recovery_campaigns
CREATE INDEX IF NOT EXISTS idx_cart_recovery_campaigns_cart_id 
  ON public.cart_recovery_campaigns(cart_id);

-- clients
CREATE INDEX IF NOT EXISTS idx_clients_user_id 
  ON public.clients(user_id);

-- credit_purchases
CREATE INDEX IF NOT EXISTS idx_credit_purchases_package_id 
  ON public.credit_purchases(package_id);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_user_id 
  ON public.credit_purchases(user_id);

-- credit_transactions
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id 
  ON public.credit_transactions(user_id);

-- credits_transactions
CREATE INDEX IF NOT EXISTS idx_credits_transactions_user_id 
  ON public.credits_transactions(user_id);
