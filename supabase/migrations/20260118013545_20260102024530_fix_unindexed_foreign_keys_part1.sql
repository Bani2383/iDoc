/*
  # Fix Unindexed Foreign Keys - Part 1 (A-D)

  1. Performance Optimization
    - Add indexes for foreign key columns in tables A-D
    - Improves JOIN performance and referential integrity checks
    - Reduces query execution time for filtered and joined queries

  2. Tables Covered (38 indexes)
    - ab_test_conversions: 3 indexes (test_id, user_id, variant_id)
    - ab_test_variants: 1 index (test_id)
    - abandoned_carts: 1 index (user_id)
    - accounting_log: 1 index (created_by)
    - achievements: 1 index (user_id)
    - affiliate_clicks: 1 index (affiliate_id)
    - affiliate_commissions: 1 index (affiliate_id)
    - api_keys: 1 index (user_id)
    - api_logs: 1 index (api_key_id)
    - articles: 1 index (author_id)
    - audit_log: 1 index (admin_id)
    - bulk_campaigns: 1 index (user_id)
    - bulk_sends: 2 indexes (campaign_id, document_id)
    - cart_recovery_campaigns: 1 index (cart_id)
    - clients: 1 index (user_id)
    - credit_purchases: 2 indexes (package_id, user_id)
    - credit_transactions: 1 index (user_id)
    - credits_transactions: 1 index (user_id)
    - document_folders: 2 indexes (parent_folder_id, user_id)
    - document_signatures: 2 indexes (document_id, user_id)
    - document_versions: 2 indexes (created_by, document_id)
    - document_views: 2 indexes (template_id, user_id)
    - dossier_activity: 2 indexes (dossier_id, user_id)
    - dossier_documents: 2 indexes (dossier_id, reviewed_by)
    - dossiers: 2 indexes (client_id, created_by_user_id)

  3. Security Notes
    - All indexes use IF NOT EXISTS to prevent errors on re-run
    - Indexes improve both query performance and RLS policy evaluation
*/

-- ab_test_conversions (3 indexes)
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_test_id ON public.ab_test_conversions(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_user_id ON public.ab_test_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_variant_id ON public.ab_test_conversions(variant_id);

-- ab_test_variants (1 index)
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test_id ON public.ab_test_variants(test_id);

-- abandoned_carts (1 index)
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_user_id ON public.abandoned_carts(user_id);

-- accounting_log (1 index)
CREATE INDEX IF NOT EXISTS idx_accounting_log_created_by ON public.accounting_log(created_by);

-- achievements (1 index)
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);

-- affiliate_clicks (1 index)
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON public.affiliate_clicks(affiliate_id);

-- affiliate_commissions (1 index)
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id ON public.affiliate_commissions(affiliate_id);

-- api_keys (1 index)
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);

-- api_logs (1 index)
CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id ON public.api_logs(api_key_id);

-- articles (1 index)
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);

-- audit_log (1 index)
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON public.audit_log(admin_id);

-- bulk_campaigns (1 index)
CREATE INDEX IF NOT EXISTS idx_bulk_campaigns_user_id ON public.bulk_campaigns(user_id);

-- bulk_sends (2 indexes)
CREATE INDEX IF NOT EXISTS idx_bulk_sends_campaign_id ON public.bulk_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_bulk_sends_document_id ON public.bulk_sends(document_id);

-- cart_recovery_campaigns (1 index)
CREATE INDEX IF NOT EXISTS idx_cart_recovery_campaigns_cart_id ON public.cart_recovery_campaigns(cart_id);

-- clients (1 index)
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- credit_purchases (2 indexes)
CREATE INDEX IF NOT EXISTS idx_credit_purchases_package_id ON public.credit_purchases(package_id);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_user_id ON public.credit_purchases(user_id);

-- credit_transactions (1 index)
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);

-- credits_transactions (1 index)
CREATE INDEX IF NOT EXISTS idx_credits_transactions_user_id ON public.credits_transactions(user_id);

-- document_folders (2 indexes)
CREATE INDEX IF NOT EXISTS idx_document_folders_parent_folder_id ON public.document_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_document_folders_user_id ON public.document_folders(user_id);

-- document_signatures (2 indexes)
CREATE INDEX IF NOT EXISTS idx_document_signatures_document_id ON public.document_signatures(document_id);
CREATE INDEX IF NOT EXISTS idx_document_signatures_user_id ON public.document_signatures(user_id);

-- document_versions (2 indexes)
CREATE INDEX IF NOT EXISTS idx_document_versions_created_by ON public.document_versions(created_by);
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON public.document_versions(document_id);

-- document_views (2 indexes)
CREATE INDEX IF NOT EXISTS idx_document_views_template_id ON public.document_views(template_id);
CREATE INDEX IF NOT EXISTS idx_document_views_user_id ON public.document_views(user_id);

-- dossier_activity (2 indexes)
CREATE INDEX IF NOT EXISTS idx_dossier_activity_dossier_id ON public.dossier_activity(dossier_id);
CREATE INDEX IF NOT EXISTS idx_dossier_activity_user_id ON public.dossier_activity(user_id);

-- dossier_documents (2 indexes)
CREATE INDEX IF NOT EXISTS idx_dossier_documents_dossier_id ON public.dossier_documents(dossier_id);
CREATE INDEX IF NOT EXISTS idx_dossier_documents_reviewed_by ON public.dossier_documents(reviewed_by);

-- dossiers (2 indexes)
CREATE INDEX IF NOT EXISTS idx_dossiers_client_id ON public.dossiers(client_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_created_by_user_id ON public.dossiers(created_by_user_id);
