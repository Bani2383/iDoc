/*
  # Drop Unused Indexes - Batch 5 (Final)

  1. Performance Optimization
    - Removes final batch of unused indexes
    
  2. Indexes Removed (Batch 5/5)
    - Analytics events
    - Document generation queue
    - Generator steps and fields
    - Guided template submissions
    - iDoc system
    - Production safety system
    - Shadow testing
    - System settings
    - Template health and alerts
*/

-- Analytics
DROP INDEX IF EXISTS idx_analytics_events_type;
DROP INDEX IF EXISTS idx_analytics_events_template;
DROP INDEX IF EXISTS idx_analytics_events_created;
DROP INDEX IF EXISTS idx_analytics_events_bundle_id;
DROP INDEX IF EXISTS idx_analytics_events_user_id;

-- Document Generation Queue
DROP INDEX IF EXISTS idx_generation_queue_status;
DROP INDEX IF EXISTS idx_generation_queue_priority;
DROP INDEX IF EXISTS idx_generation_queue_user;
DROP INDEX IF EXISTS idx_document_generation_queue_bundle_id;
DROP INDEX IF EXISTS idx_document_generation_queue_template_id;

-- Generator System
DROP INDEX IF EXISTS idx_steps_order;
DROP INDEX IF EXISTS idx_fields_order;

-- Guided Templates
DROP INDEX IF EXISTS idx_guided_template_submissions_config_id;
DROP INDEX IF EXISTS idx_guided_template_submissions_user_id;

-- iDoc System
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

-- iDoc Sections
DROP INDEX IF EXISTS idx_idoc_sections_code;
DROP INDEX IF EXISTS idx_idoc_sections_active;
DROP INDEX IF EXISTS idx_idoc_mapping_template;
DROP INDEX IF EXISTS idx_idoc_mapping_section;

-- iDoc Documents
DROP INDEX IF EXISTS idx_idoc_docs_user;
DROP INDEX IF EXISTS idx_idoc_docs_template;
DROP INDEX IF EXISTS idx_idoc_docs_session;
DROP INDEX IF EXISTS idx_idoc_docs_created;

-- iDoc Analytics
DROP INDEX IF EXISTS idx_idoc_analytics_template;
DROP INDEX IF EXISTS idx_idoc_analytics_event;
DROP INDEX IF EXISTS idx_idoc_analytics_created;
DROP INDEX IF EXISTS idx_idoc_template_analytics_user_id;

-- iDoc Verification
DROP INDEX IF EXISTS idx_verification_audit_template;
DROP INDEX IF EXISTS idx_verification_audit_status;
DROP INDEX IF EXISTS idx_idoc_verification_audit_performed_by;

-- Production Safety
DROP INDEX IF EXISTS idx_doc_templates_pricing;
DROP INDEX IF EXISTS idx_doc_production_eligible;
DROP INDEX IF EXISTS idx_doc_trust_level;
DROP INDEX IF EXISTS idx_doc_shadow;

-- Template Health
DROP INDEX IF EXISTS idx_health_log_template;
DROP INDEX IF EXISTS idx_health_log_event;
DROP INDEX IF EXISTS idx_health_log_environment;
DROP INDEX IF EXISTS idx_template_health_log_user_id;

-- Template Alerts
DROP INDEX IF EXISTS idx_alerts_created;
DROP INDEX IF EXISTS idx_alerts_acknowledged;
DROP INDEX IF EXISTS idx_alerts_type;
DROP INDEX IF EXISTS idx_alerts_template;
DROP INDEX IF EXISTS idx_template_alerts_acknowledged_by;

-- Alert Settings
DROP INDEX IF EXISTS idx_alert_settings_user;

-- Render Fallbacks
DROP INDEX IF EXISTS idx_fallbacks_template;
DROP INDEX IF EXISTS idx_fallbacks_created;
DROP INDEX IF EXISTS idx_fallbacks_environment;
DROP INDEX IF EXISTS idx_template_render_fallbacks_user_id;

-- Shadow Testing
DROP INDEX IF EXISTS idx_shadow_template;
DROP INDEX IF EXISTS idx_shadow_success;
DROP INDEX IF EXISTS idx_shadow_differences;

-- System Settings
DROP INDEX IF EXISTS idx_system_settings_updated_by;