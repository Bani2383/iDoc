/*
  # Consolidate Duplicate RLS Policies - Part 2

  1. Changes
    - Continue removing duplicate policies
    - Tables: bundles, cart_recovery, clients, credit_packages, etc.

  2. Security
    - Maintain restrictive access
    - Consolidate admin + user patterns
*/

-- bundles and related tables: Keep both (different purposes)
-- bundle_items, bundle_translations, bundles all have admin + public view pattern

-- cart_recovery_campaigns: Drop duplicate
DROP POLICY IF EXISTS "Admin can view cart recovery campaigns" ON cart_recovery_campaigns;

-- clients: Keep both (admin sees all, users see own)

-- country tables: Keep both (admin manages, public views)

-- credit_packages: Keep both (admin manages, public views active)

-- credit_purchases: Keep both (admin sees all, users see own)

-- document_generation_queue: Keep both (admin sees all, users see own)

-- document_generators: Keep both (admin manages, public views active)

-- document_templates: Keep both (admin sees all, public sees active)

-- dossiers: Keep all three (different access patterns)

-- email tables: Drop duplicate policies
DROP POLICY IF EXISTS "Admin can view email campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Admin can view email sequences" ON email_sequences;

-- enterprise tables: Keep both (admin manages, users view own)

-- flash_deal_purchases: Consolidate
DROP POLICY IF EXISTS "Admin can manage all flash deal purchases" ON flash_deal_purchases;
DROP POLICY IF EXISTS "Users can create own flash deal purchases" ON flash_deal_purchases;
DROP POLICY IF EXISTS "Users can view own flash deal purchases" ON flash_deal_purchases;

CREATE POLICY "Admin manages all flash deal purchases"
  ON flash_deal_purchases FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can manage own flash deal purchases"
  ON flash_deal_purchases FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- flash_deals: Keep both (admin manages, public views active)

-- generator tables: Keep both (admin manages, public views)

-- guided_template tables: Keep both (admin sees all, users see own)
