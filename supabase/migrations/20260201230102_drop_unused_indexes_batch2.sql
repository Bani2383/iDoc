/*
  # Drop Unused Indexes - Batch 2

  1. Performance Optimization
    - Removes additional unused indexes
    
  2. Indexes Removed (Batch 2/5)
    - Document folders and templates
    - Document signatures and versions
    - Document views
    - Dossiers system
    - Email system
    - Enterprise licenses
    - Flash deals
    - Generated documents
*/

-- Document Folders
DROP INDEX IF EXISTS idx_document_folders_parent_folder_id;
DROP INDEX IF EXISTS idx_document_folders_user_id;

-- Document Templates
DROP INDEX IF EXISTS idx_document_templates_keywords;
DROP INDEX IF EXISTS idx_document_templates_language;
DROP INDEX IF EXISTS idx_document_templates_category;
DROP INDEX IF EXISTS idx_document_templates_active_category;
DROP INDEX IF EXISTS idx_document_templates_review_status;
DROP INDEX IF EXISTS idx_document_templates_last_reviewed_by;

-- Document Signatures
DROP INDEX IF EXISTS idx_document_signatures_document_id;
DROP INDEX IF EXISTS idx_document_signatures_user_id;

-- Document Versions
DROP INDEX IF EXISTS idx_document_versions_created_by;
DROP INDEX IF EXISTS idx_document_versions_document_id;
DROP INDEX IF EXISTS idx_versions_created;

-- Document Views
DROP INDEX IF EXISTS idx_document_views_template_id;
DROP INDEX IF EXISTS idx_document_views_user_id;
DROP INDEX IF EXISTS idx_document_views_session;

-- Dossiers
DROP INDEX IF EXISTS idx_dossier_activity_dossier_id;
DROP INDEX IF EXISTS idx_dossier_activity_user_id;
DROP INDEX IF EXISTS idx_dossier_documents_dossier_id;
DROP INDEX IF EXISTS idx_dossier_documents_reviewed_by;
DROP INDEX IF EXISTS idx_dossiers_client_id;
DROP INDEX IF EXISTS idx_dossiers_created_by_user_id;
DROP INDEX IF EXISTS idx_dossiers_created_at;

-- Email System
DROP INDEX IF EXISTS idx_email_campaigns_sequence_id;
DROP INDEX IF EXISTS idx_email_logs_campaign_id;
DROP INDEX IF EXISTS idx_email_logs_user_id;

-- Enterprise
DROP INDEX IF EXISTS idx_enterprise_licenses_admin_user_id;
DROP INDEX IF EXISTS idx_enterprise_licenses_plan_id;

-- Flash Deals
DROP INDEX IF EXISTS idx_flash_deal_purchases_user_id;
DROP INDEX IF EXISTS idx_flash_deals_template_id;

-- Generated Documents
DROP INDEX IF EXISTS idx_generated_documents_template_id;
DROP INDEX IF EXISTS idx_generated_documents_folder_id;
DROP INDEX IF EXISTS idx_generated_documents_user_id;
DROP INDEX IF EXISTS idx_generated_documents_created_at;
DROP INDEX IF EXISTS idx_generated_documents_user_timeline;
DROP INDEX IF EXISTS idx_documents_favorite;

-- Legal Rules
DROP INDEX IF EXISTS idx_legal_rules_key;
DROP INDEX IF EXISTS idx_legal_rules_jurisdiction_id;
DROP INDEX IF EXISTS idx_legal_rules_template_id;