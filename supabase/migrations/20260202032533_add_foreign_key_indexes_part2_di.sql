/*
  # Add Foreign Key Indexes - Part 2 (Tables D-I)

  1. Performance Optimization
    - Add indexes for all foreign keys in tables starting with D-I
    - Improves JOIN performance and referential integrity checks
    - Reduces query execution time for foreign key lookups

  2. Tables Affected
    - document_folders
    - document_generation_queue
    - document_signatures
    - document_templates
    - document_versions
    - document_views
    - dossier_activity
    - dossier_documents
    - dossiers
    - email_campaigns
    - email_logs
    - enterprise_licenses
    - flash_deal_purchases
    - flash_deals
    - generated_documents
    - guided_template_configs
    - guided_template_submissions
    - idoc_generated_documents
    - idoc_template_analytics
    - idoc_template_section_mapping
    - idoc_verification_audit

  3. Important Notes
    - Each index is created with IF NOT EXISTS to prevent errors
    - Indexes use conventional naming: idx_tablename_columnname
*/

-- document_folders
CREATE INDEX IF NOT EXISTS idx_document_folders_parent_folder_id 
  ON public.document_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_document_folders_user_id 
  ON public.document_folders(user_id);

-- document_generation_queue
CREATE INDEX IF NOT EXISTS idx_document_generation_queue_bundle_id 
  ON public.document_generation_queue(bundle_id);
CREATE INDEX IF NOT EXISTS idx_document_generation_queue_template_id 
  ON public.document_generation_queue(template_id);
CREATE INDEX IF NOT EXISTS idx_document_generation_queue_user_id 
  ON public.document_generation_queue(user_id);

-- document_signatures
CREATE INDEX IF NOT EXISTS idx_document_signatures_document_id 
  ON public.document_signatures(document_id);
CREATE INDEX IF NOT EXISTS idx_document_signatures_user_id 
  ON public.document_signatures(user_id);

-- document_templates
CREATE INDEX IF NOT EXISTS idx_document_templates_last_reviewed_by 
  ON public.document_templates(last_reviewed_by);

-- document_versions
CREATE INDEX IF NOT EXISTS idx_document_versions_created_by 
  ON public.document_versions(created_by);
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id 
  ON public.document_versions(document_id);

-- document_views
CREATE INDEX IF NOT EXISTS idx_document_views_template_id 
  ON public.document_views(template_id);
CREATE INDEX IF NOT EXISTS idx_document_views_user_id 
  ON public.document_views(user_id);

-- dossier_activity
CREATE INDEX IF NOT EXISTS idx_dossier_activity_dossier_id 
  ON public.dossier_activity(dossier_id);
CREATE INDEX IF NOT EXISTS idx_dossier_activity_user_id 
  ON public.dossier_activity(user_id);

-- dossier_documents
CREATE INDEX IF NOT EXISTS idx_dossier_documents_dossier_id 
  ON public.dossier_documents(dossier_id);
CREATE INDEX IF NOT EXISTS idx_dossier_documents_reviewed_by 
  ON public.dossier_documents(reviewed_by);

-- dossiers
CREATE INDEX IF NOT EXISTS idx_dossiers_client_id 
  ON public.dossiers(client_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_created_by_user_id 
  ON public.dossiers(created_by_user_id);

-- email_campaigns
CREATE INDEX IF NOT EXISTS idx_email_campaigns_sequence_id 
  ON public.email_campaigns(sequence_id);

-- email_logs
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id 
  ON public.email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id 
  ON public.email_logs(user_id);

-- enterprise_licenses
CREATE INDEX IF NOT EXISTS idx_enterprise_licenses_admin_user_id 
  ON public.enterprise_licenses(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_licenses_plan_id 
  ON public.enterprise_licenses(plan_id);

-- flash_deal_purchases
CREATE INDEX IF NOT EXISTS idx_flash_deal_purchases_user_id 
  ON public.flash_deal_purchases(user_id);

-- flash_deals
CREATE INDEX IF NOT EXISTS idx_flash_deals_template_id 
  ON public.flash_deals(template_id);

-- generated_documents
CREATE INDEX IF NOT EXISTS idx_generated_documents_folder_id 
  ON public.generated_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_template_id 
  ON public.generated_documents(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id 
  ON public.generated_documents(user_id);

-- guided_template_configs
CREATE INDEX IF NOT EXISTS idx_guided_template_configs_created_by 
  ON public.guided_template_configs(created_by);

-- guided_template_submissions
CREATE INDEX IF NOT EXISTS idx_guided_template_submissions_config_id 
  ON public.guided_template_submissions(config_id);
CREATE INDEX IF NOT EXISTS idx_guided_template_submissions_user_id 
  ON public.guided_template_submissions(user_id);

-- idoc_generated_documents
CREATE INDEX IF NOT EXISTS idx_idoc_generated_documents_template_id 
  ON public.idoc_generated_documents(template_id);
CREATE INDEX IF NOT EXISTS idx_idoc_generated_documents_user_id 
  ON public.idoc_generated_documents(user_id);

-- idoc_template_analytics
CREATE INDEX IF NOT EXISTS idx_idoc_template_analytics_template_id 
  ON public.idoc_template_analytics(template_id);
CREATE INDEX IF NOT EXISTS idx_idoc_template_analytics_user_id 
  ON public.idoc_template_analytics(user_id);

-- idoc_template_section_mapping
CREATE INDEX IF NOT EXISTS idx_idoc_template_section_mapping_section_id 
  ON public.idoc_template_section_mapping(section_id);

-- idoc_verification_audit
CREATE INDEX IF NOT EXISTS idx_idoc_verification_audit_performed_by 
  ON public.idoc_verification_audit(performed_by);
CREATE INDEX IF NOT EXISTS idx_idoc_verification_audit_template_id 
  ON public.idoc_verification_audit(template_id);
