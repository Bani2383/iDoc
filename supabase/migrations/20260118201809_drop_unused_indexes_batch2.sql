/*
  # Drop Unused Indexes - Batch 2 (D-L tables)

  1. Changes
    - Drop unused indexes on tables D-L
    - Continue performance optimization
    
  2. Tables affected
    - document_*, dossier_*, email_*, enterprise_*
    - flash_*, generated_documents, generator_*, guided_template_*
    - idoc_*, jurisdictions, legal_rules, login_logs
*/

-- Document tables
DROP INDEX IF EXISTS idx_document_folders_parent_folder_id;
DROP INDEX IF EXISTS idx_document_folders_user_id;
DROP INDEX IF EXISTS idx_document_templates_keywords;
DROP INDEX IF EXISTS idx_document_templates_language;
DROP INDEX IF EXISTS idx_document_templates_active_category;
DROP INDEX IF EXISTS idx_document_templates_review_status;
DROP INDEX IF EXISTS idx_document_templates_last_reviewed_by;
DROP INDEX IF EXISTS idx_document_signatures_document_id;
DROP INDEX IF EXISTS idx_document_signatures_user_id;
DROP INDEX IF EXISTS idx_document_versions_created_by;
DROP INDEX IF EXISTS idx_document_versions_document_id;
DROP INDEX IF EXISTS idx_document_views_template_id;
DROP INDEX IF EXISTS idx_document_views_user_id;
DROP INDEX IF EXISTS idx_document_views_session;
DROP INDEX IF EXISTS idx_versions_created;
DROP INDEX IF EXISTS idx_documents_favorite;
DROP INDEX IF EXISTS idx_document_generation_queue_bundle_id;
DROP INDEX IF EXISTS idx_document_generation_queue_template_id;

-- Dossiers
DROP INDEX IF EXISTS idx_dossier_activity_dossier_id;
DROP INDEX IF EXISTS idx_dossier_activity_user_id;
DROP INDEX IF EXISTS idx_dossier_documents_dossier_id;
DROP INDEX IF EXISTS idx_dossier_documents_reviewed_by;
DROP INDEX IF EXISTS idx_dossiers_client_id;
DROP INDEX IF EXISTS idx_dossiers_created_by_user_id;
DROP INDEX IF EXISTS idx_dossiers_created_at;

-- Email
DROP INDEX IF EXISTS idx_email_campaigns_sequence_id;
DROP INDEX IF EXISTS idx_email_logs_campaign_id;
DROP INDEX IF EXISTS idx_email_logs_user_id;

-- Enterprise
DROP INDEX IF EXISTS idx_enterprise_licenses_admin_user_id;
DROP INDEX IF EXISTS idx_enterprise_licenses_plan_id;

-- Flash deals
DROP INDEX IF EXISTS idx_flash_deal_purchases_user_id;
DROP INDEX IF EXISTS idx_flash_deals_template_id;

-- Generated documents
DROP INDEX IF EXISTS idx_generated_documents_folder_id;
DROP INDEX IF EXISTS idx_generated_documents_user_id;
DROP INDEX IF EXISTS idx_generated_documents_template_id;
DROP INDEX IF EXISTS idx_generated_documents_created_at;
DROP INDEX IF EXISTS idx_generated_documents_user_timeline;

-- Generator
DROP INDEX IF EXISTS idx_generation_queue_status;
DROP INDEX IF EXISTS idx_generation_queue_priority;
DROP INDEX IF EXISTS idx_generation_queue_user;
DROP INDEX IF EXISTS idx_steps_order;
DROP INDEX IF EXISTS idx_fields_order;

-- Guided templates
DROP INDEX IF EXISTS idx_guided_template_configs_created_by;
DROP INDEX IF EXISTS idx_guided_configs_active;
DROP INDEX IF EXISTS idx_guided_template_submissions_config_id;
DROP INDEX IF EXISTS idx_guided_template_submissions_user_id;

-- iDoc tables
DROP INDEX IF EXISTS idx_idoc_templates_category;
DROP INDEX IF EXISTS idx_idoc_templates_slug;
DROP INDEX IF EXISTS idx_idoc_templates_active;
DROP INDEX IF EXISTS idx_idoc_templates_status;
DROP INDEX IF EXISTS idx_idoc_templates_verified;
DROP INDEX IF EXISTS idx_idoc_templates_needs_verification;
DROP INDEX IF EXISTS idx_idoc_templates_pricing;
DROP INDEX IF EXISTS idx_idoc_production_eligible;
DROP INDEX IF EXISTS idx_idoc_trust_level;
DROP INDEX IF EXISTS idx_idoc_shadow;
DROP INDEX IF EXISTS idx_idoc_sections_code;
DROP INDEX IF EXISTS idx_idoc_sections_active;
DROP INDEX IF EXISTS idx_idoc_mapping_template;
DROP INDEX IF EXISTS idx_idoc_mapping_section;
DROP INDEX IF EXISTS idx_idoc_docs_user;
DROP INDEX IF EXISTS idx_idoc_docs_template;
DROP INDEX IF EXISTS idx_idoc_docs_session;
DROP INDEX IF EXISTS idx_idoc_docs_created;
DROP INDEX IF EXISTS idx_idoc_analytics_template;
DROP INDEX IF EXISTS idx_idoc_analytics_event;
DROP INDEX IF EXISTS idx_idoc_analytics_created;
DROP INDEX IF EXISTS idx_idoc_template_analytics_user_id;
DROP INDEX IF EXISTS idx_idoc_verification_audit_template;
DROP INDEX IF EXISTS idx_idoc_verification_audit_status;
DROP INDEX IF EXISTS idx_idoc_verification_audit_performed_by;

-- Jurisdictions
DROP INDEX IF EXISTS idx_jurisdictions_active;
DROP INDEX IF EXISTS idx_jurisdictions_code;

-- Legal rules
DROP INDEX IF EXISTS idx_legal_rules_key;
DROP INDEX IF EXISTS idx_legal_rules_jurisdiction_id;
DROP INDEX IF EXISTS idx_legal_rules_template_id;

-- Login logs
DROP INDEX IF EXISTS idx_login_logs_user_id;
DROP INDEX IF EXISTS idx_login_logs_login_at;
DROP INDEX IF EXISTS idx_login_logs_logged_in_at;
DROP INDEX IF EXISTS idx_login_logs_user_timeline;
