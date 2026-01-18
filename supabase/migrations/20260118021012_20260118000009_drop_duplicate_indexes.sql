/*
  # Drop Duplicate Indexes
  
  1. Performance Improvements
    - Remove duplicate indexes that waste storage and slow down writes
    - Keep the more descriptive index names
  
  2. Tables Updated
    - api_keys
    - api_logs
    - bulk_campaigns
    - bulk_sends
    - document_folders
    - document_versions
    - document_views
    - generated_documents
    - legal_rules
    - recommendation_rules
    - referrals
    - signature_workflows
    - transactions
    - workflow_signers
*/

-- Drop duplicate indexes, keeping the more descriptive ones

-- api_keys: Keep idx_api_keys_user_id
DROP INDEX IF EXISTS public.idx_api_keys_user;

-- api_logs: Keep idx_api_logs_api_key_id
DROP INDEX IF EXISTS public.idx_api_logs_key;

-- bulk_campaigns: Keep idx_bulk_campaigns_user_id
DROP INDEX IF EXISTS public.idx_bulk_campaigns_user;

-- bulk_sends: Keep idx_bulk_sends_campaign_id
DROP INDEX IF EXISTS public.idx_bulk_sends_campaign;

-- document_folders: Keep the more descriptive names
DROP INDEX IF EXISTS public.idx_folders_parent;
DROP INDEX IF EXISTS public.idx_folders_user;

-- document_versions: Keep idx_document_versions_document_id
DROP INDEX IF EXISTS public.idx_versions_document;

-- document_views: Keep the more descriptive names
DROP INDEX IF EXISTS public.idx_document_views_template;
DROP INDEX IF EXISTS public.idx_document_views_user;

-- generated_documents: Keep idx_generated_documents_folder_id
DROP INDEX IF EXISTS public.idx_documents_folder;

-- legal_rules: Keep the more descriptive names
DROP INDEX IF EXISTS public.idx_legal_rules_jurisdiction;
DROP INDEX IF EXISTS public.idx_legal_rules_template;

-- recommendation_rules: Keep idx_recommendation_rules_source_template_id
DROP INDEX IF EXISTS public.idx_recommendation_rules_source;

-- referrals: Keep the more descriptive names
DROP INDEX IF EXISTS public.idx_referrals_affiliate;
DROP INDEX IF EXISTS public.idx_referrals_user;

-- signature_workflows: Keep the more descriptive names
DROP INDEX IF EXISTS public.idx_workflows_creator;
DROP INDEX IF EXISTS public.idx_workflows_document;

-- transactions: Keep idx_transactions_user_id
DROP INDEX IF EXISTS public.idx_transactions_user;

-- workflow_signers: Keep idx_workflow_signers_workflow_id
DROP INDEX IF EXISTS public.idx_signers_workflow;
