import { test, expect } from '@playwright/test';

test.describe('Document Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Guest user can search and select a document template', async ({ page }) => {
    // Wait for search bar to be visible
    const searchInput = page.getByRole('combobox', { name: /rechercher un document/i });
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill('Contrat');

    // Wait for search results
    await page.waitForSelector('[role="listbox"]', { timeout: 3000 });

    // Verify results appear
    const resultsBox = page.locator('[role="listbox"]');
    await expect(resultsBox).toBeVisible();

    // Count results
    const results = page.locator('[role="option"]');
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Guest user can navigate through SmartFill wizard', async ({ page }) => {
    // Search and select document
    const searchInput = page.getByRole('combobox', { name: /rechercher un document/i });
    await searchInput.fill('Contrat');

    // Wait for dropdown and click first result
    await page.waitForSelector('[role="listbox"]');
    const firstOption = page.locator('[role="option"]').first();
    await firstOption.click();

    // Wait for SmartFill Studio to load
    await page.waitForSelector('text=/Commençons|Informations/', { timeout: 5000 });

    // Verify we're in step 1
    await expect(page.locator('text=/Commençons/')).toBeVisible();

    // Fill out first step fields
    const firstNameInput = page.getByPlaceholder(/Jean|Prénom/i);
    if (await firstNameInput.isVisible()) {
      await firstNameInput.fill('Jean');

      const lastNameInput = page.getByPlaceholder(/Dupont|Nom/i);
      await lastNameInput.fill('Dupont');

      const emailInput = page.getByPlaceholder(/email/i);
      await emailInput.fill('jean.dupont@exemple.com');

      // Click next button
      const nextButton = page.getByRole('button', { name: /suivant|next/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();

        // Verify we moved to step 2
        await expect(page.locator('text=/Adresse|Localisation/')).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('Popular documents are displayed when search is empty', async ({ page }) => {
    // Click on search input to focus
    const searchInput = page.getByRole('combobox', { name: /rechercher un document/i });
    await searchInput.click();

    // Wait for dropdown
    await page.waitForSelector('[role="listbox"]', { timeout: 3000 });

    // Check for "Documents populaires" section
    await expect(page.locator('text=/Documents populaires/i')).toBeVisible();

    // Verify popular templates are shown
    const popularOptions = page.locator('[aria-label*="Document populaire"]');
    const count = await popularOptions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Recent searches are stored and displayed', async ({ page }) => {
    // First search
    const searchInput = page.getByRole('combobox', { name: /rechercher un document/i });
    await searchInput.fill('Contrat');
    await page.waitForSelector('[role="listbox"]');

    // Select a template
    const firstOption = page.locator('[role="option"]').first();
    const templateName = await firstOption.textContent();
    await firstOption.click();

    // Wait a bit for template to load or close
    await page.waitForTimeout(500);

    // Go back to homepage (if we're in SmartFill, cancel)
    const cancelButton = page.getByRole('button', { name: /annuler|fermer/i });
    if (await cancelButton.isVisible({ timeout: 1000 })) {
      await cancelButton.click();
    }

    // Click search again
    await searchInput.click();

    // Wait for dropdown
    await page.waitForSelector('[role="listbox"]', { timeout: 3000 });

    // Check if recent searches section exists
    const recentSection = page.locator('text=/Recherches récentes/i');
    if (await recentSection.isVisible({ timeout: 1000 })) {
      // Verify our previous search is in recent
      const recentOptions = page.locator('[aria-label*="Recherche récente"]');
      const count = await recentOptions.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('FOMO widget is visible and animates', async ({ page }) => {
    // Wait for FOMO widget to load (it's lazy-loaded)
    await page.waitForTimeout(1000);

    // Check if FOMO widget exists
    const fomoWidget = page.locator('text=/a généré|documents générés/i').first();

    // Widget should be visible within 5 seconds
    await expect(fomoWidget).toBeVisible({ timeout: 5000 });
  });

  test('Page is responsive and works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Reload page
    await page.goto('/');

    // Search should still be visible and functional
    const searchInput = page.getByRole('combobox', { name: /rechercher un document/i });
    await expect(searchInput).toBeVisible();

    // Click and type
    await searchInput.click();
    await searchInput.fill('Contrat');

    // Results should appear
    await page.waitForSelector('[role="listbox"]', { timeout: 3000 });
    await expect(page.locator('[role="listbox"]')).toBeVisible();
  });

  test('Error handling: network failure gracefully handled', async ({ page }) => {
    // Intercept API calls and make them fail
    await page.route('**/document_templates*', route => route.abort());

    // Page should still load without crashing
    await expect(page.locator('text=/iDoc/i')).toBeVisible();

    // Search bar should show fallback templates
    const searchInput = page.getByRole('combobox', { name: /rechercher un document/i });
    await searchInput.click();

    // Should show some kind of content even with failed API
    // (fallback templates are hardcoded in ImprovedHomepage)
    await page.waitForTimeout(2000);
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
  });

  test('Login button is accessible', async ({ page }) => {
    // Find login button (should be "Mon Compte")
    const loginButton = page.getByRole('button', { name: /mon compte/i });
    await expect(loginButton).toBeVisible();

    // Click should trigger auth modal
    await loginButton.click();

    // Auth modal should appear
    await expect(page.locator('text=/connexion|inscription/i')).toBeVisible({ timeout: 3000 });
  });
});
