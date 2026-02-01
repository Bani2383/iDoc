/*
  # Consolidate Duplicate RLS Policies - Part 2 (Simplified)

  1. Security Improvements
    - Removes duplicate permissive policies
    
  2. Tables Updated
    - enterprise_licenses
    - enterprise_plans
    - flash_deal_purchases
    - flash_deals
    - generator fields and steps
    - guided_template_configs
    - guided_template_submissions
    - idoc_generated_documents
    - idoc_guided_templates (complex case with multiple roles)
*/

-- Enterprise Licenses: Remove duplicate
-- Keep both (admin vs members)

-- Enterprise Plans: Remove admin manage
DROP POLICY IF EXISTS "Admin manages enterprise plans" ON enterprise_plans;

-- Flash Deal Purchases: Remove admin policy
DROP POLICY IF EXISTS "Admin can manage all flash deal purchases" ON flash_deal_purchases;

-- Flash Deals: Remove admin manage
DROP POLICY IF EXISTS "Admin manages flash deals" ON flash_deals;

-- Generator Fields: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage generator fields" ON generator_fields;

-- Generator Steps: Remove admin manage  
DROP POLICY IF EXISTS "Admins can manage generator steps" ON generator_steps;

-- Guided Template Configs: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage guided configs" ON guided_template_configs;

-- Guided Template Submissions: Remove duplicate
-- Keep both (admin vs user)

-- iDoc Generated Documents: Remove duplicate
-- Keep both (admin vs user)

-- iDoc Guided Templates: This is complex with multiple roles
-- We have duplicates for anon, authenticated, authenticator, dashboard_user
-- Let's remove the older "Public can view published" and keep "Public can only view VERIFIED"
DROP POLICY IF EXISTS "Public can view published idoc templates" ON idoc_guided_templates;
DROP POLICY IF EXISTS "Admin can view all templates" ON idoc_guided_templates;

-- iDoc Template Section Mapping: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage idoc section mappings" ON idoc_template_section_mapping;

-- iDoc Template Sections: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage idoc sections" ON idoc_template_sections;

-- Jurisdictions: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage jurisdictions" ON jurisdictions;

-- Legal Rules: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage legal rules" ON legal_rules;

-- Login Logs: Remove duplicate
-- Keep both (admin vs user)

-- Premium Services: Remove admin manage  
DROP POLICY IF EXISTS "Admin manages premium services" ON premium_services;

-- Purchases: Remove duplicate
-- Keep both (admin vs user)

-- Recommendation Rules: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage recommendation rules" ON recommendation_rules;

-- Referral Rewards: Remove admin manage
DROP POLICY IF EXISTS "Admin manages referral rewards" ON referral_rewards;