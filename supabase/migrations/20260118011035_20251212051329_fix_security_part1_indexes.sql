/*
  # Security Fix Part 1: Indexes
  
  ## Add Missing Foreign Key Indexes (27 indexes)
  Improves query performance by indexing all foreign key columns
  
  ## Remove Unused Indexes (57 indexes)
  Reduces storage overhead and maintenance costs
*/

-- Add missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_accounting_log_created_by ON public.accounting_log(created_by);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id ON public.api_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_bulk_campaigns_user_id ON public.bulk_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_bulk_sends_campaign_id ON public.bulk_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_package_id ON public.credit_purchases(package_id);
CREATE INDEX IF NOT EXISTS idx_document_folders_parent_folder_id ON public.document_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_document_folders_user_id ON public.document_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_last_reviewed_by ON public.document_templates(last_reviewed_by);
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_views_template_id ON public.document_views(template_id);
CREATE INDEX IF NOT EXISTS idx_document_views_user_id ON public.document_views(user_id);
CREATE INDEX IF NOT EXISTS idx_dossier_activity_user_id ON public.dossier_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_dossier_documents_reviewed_by ON public.dossier_documents(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_generated_documents_folder_id ON public.generated_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_legal_rules_jurisdiction_id ON public.legal_rules(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_legal_rules_template_id ON public.legal_rules(template_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_template_id ON public.purchases(template_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_source_template_id ON public.recommendation_rules(source_template_id);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON public.referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_signature_workflows_created_by ON public.signature_workflows(created_by);
CREATE INDEX IF NOT EXISTS idx_signature_workflows_document_id ON public.signature_workflows(document_id);
CREATE INDEX IF NOT EXISTS idx_template_certificates_revoked_by ON public.template_certificates(revoked_by);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_signers_workflow_id ON public.workflow_signers(workflow_id);

-- Drop unused indexes
DROP INDEX IF EXISTS idx_clients_user_id;
DROP INDEX IF EXISTS idx_clients_email;
DROP INDEX IF EXISTS idx_dossiers_client_id;
DROP INDEX IF EXISTS idx_dossiers_created_by;
DROP INDEX IF EXISTS idx_dossiers_status;
DROP INDEX IF EXISTS idx_dossier_documents_dossier_id;
DROP INDEX IF EXISTS idx_dossier_documents_document_id;
DROP INDEX IF EXISTS idx_dossier_activity_dossier_id;
DROP INDEX IF EXISTS idx_dossier_activity_created_at;
DROP INDEX IF EXISTS idx_template_test_runs_admin_id;
DROP INDEX IF EXISTS idx_template_test_runs_result;
DROP INDEX IF EXISTS idx_template_test_runs_created_at;
DROP INDEX IF EXISTS idx_template_certificates_status;
DROP INDEX IF EXISTS idx_template_certificates_approved_by;
DROP INDEX IF EXISTS idx_document_templates_last_reviewed;
DROP INDEX IF EXISTS idx_credit_purchases_user_id;
DROP INDEX IF EXISTS idx_credit_purchases_created_at;
DROP INDEX IF EXISTS idx_credit_purchases_status;
DROP INDEX IF EXISTS idx_credit_transactions_user_id;
DROP INDEX IF EXISTS idx_credit_transactions_created_at;
DROP INDEX IF EXISTS idx_fomo_events_created_at;
DROP INDEX IF EXISTS idx_volume_analytics_date;
DROP INDEX IF EXISTS idx_user_profiles_referral_code;
DROP INDEX IF EXISTS idx_user_profiles_loyalty_tier;
DROP INDEX IF EXISTS idx_bulk_sends_document_id;
DROP INDEX IF EXISTS idx_document_versions_created_by;
DROP INDEX IF EXISTS idx_generated_documents_user_id;
DROP INDEX IF EXISTS idx_payments_document_id;
DROP INDEX IF EXISTS idx_payments_user_id;
DROP INDEX IF EXISTS idx_referrals_transaction_id;
DROP INDEX IF EXISTS idx_transactions_document_id;
DROP INDEX IF EXISTS idx_document_signatures_user_id;
DROP INDEX IF EXISTS idx_document_signatures_document_id;
DROP INDEX IF EXISTS idx_document_signatures_created_at;
DROP INDEX IF EXISTS idx_document_signatures_payment_status;
DROP INDEX IF EXISTS idx_user_documents_user_id;
DROP INDEX IF EXISTS idx_user_documents_created_at;
DROP INDEX IF EXISTS idx_purchases_stripe_session_id;
DROP INDEX IF EXISTS idx_purchases_stripe_payment_intent_id;
DROP INDEX IF EXISTS idx_subscriptions_stripe_customer_id;
DROP INDEX IF EXISTS idx_subscriptions_stripe_subscription_id;
DROP INDEX IF EXISTS idx_accounting_log_type;
DROP INDEX IF EXISTS idx_accounting_log_reference;
DROP INDEX IF EXISTS idx_audit_log_admin_id;
DROP INDEX IF EXISTS idx_audit_log_action_type;
DROP INDEX IF EXISTS idx_audit_log_target;
DROP INDEX IF EXISTS idx_audit_log_timestamp;
DROP INDEX IF EXISTS idx_user_activity_type;
DROP INDEX IF EXISTS idx_user_activity_timestamp;
DROP INDEX IF EXISTS idx_user_profiles_role;
DROP INDEX IF EXISTS idx_user_profiles_login_count;
DROP INDEX IF EXISTS idx_articles_tags;
DROP INDEX IF EXISTS idx_articles_author;