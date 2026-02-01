/*
  # Consolidate Duplicate RLS Policies - Part 3 (Simplified)

  1. Security Improvements
    - Removes duplicate permissive policies
    
  2. Tables Updated
    - seo_landing_pages
    - seo_priority_keywords
    - seo_scorecards
    - service_orders
    - subscriptions
    - subscriptions_v2
    - team_members
    - template_translations
    - upsell_offers
    - upsell_purchases
*/

-- SEO Landing Pages: Remove duplicate
-- Keep both (admin vs public)

-- SEO Priority Keywords: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage SEO keywords" ON seo_priority_keywords;

-- SEO Scorecards: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage SEO scorecards" ON seo_scorecards;

-- Service Orders: Remove admin policy for INSERT
DROP POLICY IF EXISTS "Admin manages all service orders" ON service_orders;

-- Recreate single comprehensive policy for service orders
CREATE POLICY "Manage service orders"
  ON service_orders FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
    OR user_id = auth.uid()
  )
  WITH CHECK (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
    OR user_id = auth.uid()
  );

-- Subscriptions: Remove duplicate admin policy
DROP POLICY IF EXISTS "Admins can update subscriptions" ON subscriptions;

-- Subscriptions V2: Remove duplicate
-- Keep both (admin vs user)

-- Team Members: Remove admin manage
DROP POLICY IF EXISTS "Admin can manage team members" ON team_members;

-- Template Translations: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage template translations" ON template_translations;

-- Upsell Offers: Remove admin manage
DROP POLICY IF EXISTS "Admins can manage upsell offers" ON upsell_offers;

-- Upsell Purchases: Remove duplicate
-- Keep both (admin vs user)

-- User Activity: Remove duplicate
-- Keep both (admin vs user)

-- User Profiles: Remove duplicate update policy
DROP POLICY IF EXISTS "Admins can update any user profile" ON user_profiles;

-- User Subscriptions: Remove admin manage policy
DROP POLICY IF EXISTS "Admin manages all subscriptions" ON user_subscriptions;

-- Recreate single comprehensive policy
CREATE POLICY "Manage user subscriptions"
  ON user_subscriptions FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
    OR user_id = auth.uid()
  )
  WITH CHECK (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
    OR user_id = auth.uid()
  );

-- Volume Analytics: Remove duplicate
DROP POLICY IF EXISTS "Admin manages volume analytics" ON volume_analytics;

-- Workflow Signers: Keep distinct policies as they serve different purposes
-- "Users can view signers of own workflows" vs "Signers can view own signature records"
-- "Signers can update own signature with token" vs "Signers can update own signatures only"
-- These are not duplicates, they check different conditions