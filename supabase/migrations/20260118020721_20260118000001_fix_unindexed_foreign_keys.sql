/*
  # Fix Unindexed Foreign Keys - Part 1
  
  1. Performance Improvements
    - Add indexes for 14 unindexed foreign keys
    - Improves query performance on joins and lookups
  
  2. Tables Updated
    - ab_test_assignments (user_id)
    - analytics_events (bundle_id, user_id)
    - bundle_items (template_id)
    - document_generation_queue (bundle_id, template_id)
    - idoc_template_analytics (user_id)
    - idoc_verification_audit (performed_by)
    - purchases (bundle_id)
    - system_settings (updated_by)
    - template_alerts (acknowledged_by)
    - template_health_log (user_id)
    - template_render_fallbacks (user_id)
    - upsell_purchases (upsell_offer_id)
*/

-- Add missing foreign key indexes for performance
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user_id ON public.ab_test_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_bundle_id ON public.analytics_events(bundle_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_template_id ON public.bundle_items(template_id);
CREATE INDEX IF NOT EXISTS idx_document_generation_queue_bundle_id ON public.document_generation_queue(bundle_id);
CREATE INDEX IF NOT EXISTS idx_document_generation_queue_template_id ON public.document_generation_queue(template_id);
CREATE INDEX IF NOT EXISTS idx_idoc_template_analytics_user_id ON public.idoc_template_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_idoc_verification_audit_performed_by ON public.idoc_verification_audit(performed_by);
CREATE INDEX IF NOT EXISTS idx_purchases_bundle_id ON public.purchases(bundle_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by ON public.system_settings(updated_by);
CREATE INDEX IF NOT EXISTS idx_template_alerts_acknowledged_by ON public.template_alerts(acknowledged_by);
CREATE INDEX IF NOT EXISTS idx_template_health_log_user_id ON public.template_health_log(user_id);
CREATE INDEX IF NOT EXISTS idx_template_render_fallbacks_user_id ON public.template_render_fallbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_upsell_offer_id ON public.upsell_purchases(upsell_offer_id);
