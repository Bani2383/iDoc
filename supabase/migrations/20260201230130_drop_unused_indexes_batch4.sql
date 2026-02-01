/*
  # Drop Unused Indexes - Batch 4

  1. Performance Optimization
    - Removes additional unused indexes
    
  2. Indexes Removed (Batch 4/5)
    - Bundle system
    - Social proof
    - Team members
    - Template certificates
    - Template tests
    - Upsells
    - User documents
    - User profiles
    - User subscriptions
    - Workflow signers
*/

-- Bundles
DROP INDEX IF EXISTS idx_bundle_items_bundle;
DROP INDEX IF EXISTS idx_bundle_items_template_id;
DROP INDEX IF EXISTS idx_bundle_translations_bundle;

-- Social Proof
DROP INDEX IF EXISTS idx_social_proof_stats_template_id;

-- Team Members
DROP INDEX IF EXISTS idx_team_members_user_id;

-- Template Certificates
DROP INDEX IF EXISTS idx_template_certificates_approved_by_user_id;
DROP INDEX IF EXISTS idx_template_certificates_revoked_by;
DROP INDEX IF EXISTS idx_template_certificates_template_id;

-- Template Tests
DROP INDEX IF EXISTS idx_template_test_runs_admin_id;
DROP INDEX IF EXISTS idx_template_test_runs_template_id;

-- Template Translations
DROP INDEX IF EXISTS idx_template_translations_template;
DROP INDEX IF EXISTS idx_template_translations_language;

-- Upsells
DROP INDEX IF EXISTS idx_upsell_conversions_original_template_id;
DROP INDEX IF EXISTS idx_upsell_conversions_rule_id;
DROP INDEX IF EXISTS idx_upsell_conversions_upsold_template_id;
DROP INDEX IF EXISTS idx_upsell_conversions_user_id;
DROP INDEX IF EXISTS idx_upsell_rules_trigger_template_id;
DROP INDEX IF EXISTS idx_upsell_purchases_user;
DROP INDEX IF EXISTS idx_upsell_purchases_purchase;
DROP INDEX IF EXISTS idx_upsell_purchases_upsell_offer_id;

-- User Badges
DROP INDEX IF EXISTS idx_user_badges_badge_id;

-- User Documents
DROP INDEX IF EXISTS idx_user_documents_template_id;
DROP INDEX IF EXISTS idx_user_documents_user_id;

-- User Profiles
DROP INDEX IF EXISTS idx_user_profiles_created_at;

-- User Referrals
DROP INDEX IF EXISTS idx_user_referrals_referred_user_id;

-- User Subscriptions
DROP INDEX IF EXISTS idx_user_subscriptions_plan_id;
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;

-- User Activity
DROP INDEX IF EXISTS idx_user_activity_user_id;

-- Workflow Signers
DROP INDEX IF EXISTS idx_signers_token;
DROP INDEX IF EXISTS idx_signers_email;
DROP INDEX IF EXISTS idx_signers_status;
DROP INDEX IF EXISTS idx_workflow_signers_workflow_id;

-- Signature Workflows
DROP INDEX IF EXISTS idx_workflows_status;
DROP INDEX IF EXISTS idx_signature_workflows_created_by;
DROP INDEX IF EXISTS idx_signature_workflows_document_by;