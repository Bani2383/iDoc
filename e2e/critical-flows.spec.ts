import { test, expect } from '@playwright/test';

test.describe('Critical Business Flows', () => {
  test.describe('Signup Flow', () => {
    test('Guest can sign up with email and password', async ({ page }) => {
      await page.goto('/');

      // Click on login button
      const loginButton = page.getByRole('button', { name: /mon compte|connexion/i });
      await loginButton.click();

      // Wait for auth modal
      await expect(page.locator('text=/connexion|inscription/i')).toBeVisible({ timeout: 3000 });

      // Switch to signup tab
      const signupTab = page.getByRole('tab', { name: /inscription|créer un compte/i });
      if (await signupTab.isVisible()) {
        await signupTab.click();
      }

      // Generate unique email
      const timestamp = Date.now();
      const email = `test-${timestamp}@example.com`;

      // Fill signup form
      const emailInput = page.getByPlaceholder(/email/i).first();
      await emailInput.fill(email);

      const passwordInput = page.getByPlaceholder(/mot de passe|password/i).first();
      await passwordInput.fill('TestPassword123!');

      // Submit form
      const submitButton = page.getByRole('button', { name: /s'inscrire|créer/i });
      await submitButton.click();

      // Wait for success (redirect to dashboard or modal closes)
      await page.waitForTimeout(3000);

      // Verify we're logged in (user menu should be visible)
      const userMenu = page.locator('text=/mon compte|tableau de bord/i');
      await expect(userMenu).toBeVisible({ timeout: 5000 });
    });

    test('Signup validation: requires valid email format', async ({ page }) => {
      await page.goto('/');

      const loginButton = page.getByRole('button', { name: /mon compte|connexion/i });
      await loginButton.click();

      await expect(page.locator('text=/connexion|inscription/i')).toBeVisible({ timeout: 3000 });

      const signupTab = page.getByRole('tab', { name: /inscription|créer un compte/i });
      if (await signupTab.isVisible()) {
        await signupTab.click();
      }

      // Try invalid email
      const emailInput = page.getByPlaceholder(/email/i).first();
      await emailInput.fill('invalid-email');

      const passwordInput = page.getByPlaceholder(/mot de passe|password/i).first();
      await passwordInput.fill('TestPassword123!');

      const submitButton = page.getByRole('button', { name: /s'inscrire|créer/i });
      await submitButton.click();

      // Should show error (HTML5 validation or custom error)
      await page.waitForTimeout(1000);
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBe(true);
    });
  });

  test.describe('Document Purchase Flow', () => {
    test('Guest can complete document generation and see payment prompt', async ({ page }) => {
      await page.goto('/');

      // Search for a document
      const searchInput = page.getByRole('combobox', { name: /rechercher un document/i });
      await searchInput.fill('Contrat');
      await page.waitForSelector('[role="listbox"]');

      // Select first template
      const firstOption = page.locator('[role="option"]').first();
      await firstOption.click();

      // Wait for SmartFill
      await page.waitForSelector('text=/Commençons|Informations/', { timeout: 5000 });

      // Fill required fields (simplified - just try to get to payment)
      const inputs = page.locator('input[type="text"], input[type="email"]');
      const count = await inputs.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const input = inputs.nth(i);
        if (await input.isVisible()) {
          await input.fill('Test Value');
        }
      }

      // Try to proceed to generation (look for generate/download button)
      const generateButton = page.getByRole('button', { name: /générer|télécharger|finaliser/i });
      if (await generateButton.isVisible({ timeout: 3000 })) {
        await generateButton.click();

        // Should show payment modal or upsell
        await page.waitForTimeout(2000);
        const paymentModal = page.locator('text=/paiement|acheter|stripe/i');
        const isVisible = await paymentModal.isVisible({ timeout: 3000 }).catch(() => false);

        // Payment prompt should appear for guest users
        expect(isVisible).toBeTruthy();
      }
    });

    test('Credits system is accessible from dashboard', async ({ page }) => {
      // This test assumes user is logged in
      // In real scenario, we'd login first or use storageState

      await page.goto('/');

      // Check if credits indicator is visible
      const creditsIndicator = page.locator('text=/crédits|credits/i');
      const hasCredits = await creditsIndicator.isVisible({ timeout: 5000 }).catch(() => false);

      // If visible, verify it's clickable and opens purchase modal
      if (hasCredits) {
        await creditsIndicator.click();
        await page.waitForTimeout(1000);

        // Should show credits purchase options
        const purchaseModal = page.locator('text=/acheter|pack/i');
        await expect(purchaseModal).toBeVisible({ timeout: 3000 });
      }
    });
  });

  test.describe('PDF Signature Flow', () => {
    test('Signature feature page is accessible', async ({ page }) => {
      await page.goto('/');

      // Look for signature link in navigation
      const signatureLink = page.locator('text=/signer un pdf|signature/i');
      await expect(signatureLink.first()).toBeVisible({ timeout: 5000 });

      // Click to go to signature page
      await signatureLink.first().click();

      // Wait for signature page to load
      await page.waitForTimeout(2000);

      // Verify signature page elements
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain(/signer|signature/i);
    });

    test('Signature page shows upload zone', async ({ page }) => {
      // Navigate directly to signature page
      await page.goto('/signature');

      // Wait for page to load
      await page.waitForTimeout(2000);

      // Look for upload zone or file input
      const uploadZone = page.locator('text=/télécharger|upload|glisser/i');
      const fileInput = page.locator('input[type="file"]');

      const hasUploadZone = await uploadZone.isVisible({ timeout: 5000 }).catch(() => false);
      const hasFileInput = await fileInput.isVisible({ timeout: 5000 }).catch(() => false);

      // At least one should be visible
      expect(hasUploadZone || hasFileInput).toBeTruthy();
    });
  });

  test.describe('Security & RLS', () => {
    test('Unauthenticated users cannot access protected routes', async ({ page }) => {
      // Try to access admin dashboard directly
      await page.goto('/admin');

      await page.waitForTimeout(2000);

      // Should either redirect to login or show error
      const url = page.url();
      const isOnAdmin = url.includes('/admin');
      const hasLoginPrompt = await page.locator('text=/connexion|login/i').isVisible({ timeout: 3000 }).catch(() => false);

      // Either we're redirected away from admin, or there's a login prompt
      expect(!isOnAdmin || hasLoginPrompt).toBeTruthy();
    });

    test('API endpoints require authentication', async ({ page }) => {
      // Make direct API call without auth
      const response = await page.request.get('https://jnrsaefyxnpxylrauonh.supabase.co/rest/v1/user_documents', {
        headers: {
          'apikey': 'test-invalid-key',
          'Authorization': 'Bearer test-invalid-token'
        }
      }).catch(() => null);

      if (response) {
        // Should return 401 or 403
        expect([401, 403, 400]).toContain(response.status());
      }
    });
  });

  test.describe('Performance & UX', () => {
    test('Page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');

      // Wait for main content
      await page.waitForSelector('text=/iDoc/i');
      const loadTime = Date.now() - startTime;

      // Should load in under 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('Images are lazy loaded', async ({ page }) => {
      await page.goto('/');

      // Check for loading="lazy" attribute on images
      const images = page.locator('img');
      const count = await images.count();

      let hasLazyLoading = false;
      for (let i = 0; i < Math.min(count, 10); i++) {
        const loading = await images.nth(i).getAttribute('loading');
        if (loading === 'lazy') {
          hasLazyLoading = true;
          break;
        }
      }

      // At least some images should be lazy loaded
      expect(hasLazyLoading).toBeTruthy();
    });

    test('FOMO notifications appear dynamically', async ({ page }) => {
      await page.goto('/');

      // Wait for FOMO widget
      await page.waitForTimeout(3000);

      // Check if FOMO notifications are present
      const fomo = page.locator('text=/a généré|documents générés|vient de/i').first();
      const isVisible = await fomo.isVisible({ timeout: 5000 }).catch(() => false);

      // FOMO should be visible
      expect(isVisible).toBeTruthy();
    });
  });

  test.describe('SEO & Metadata', () => {
    test('Homepage has proper meta tags', async ({ page }) => {
      await page.goto('/');

      // Check title
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      // Check meta description
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);

      // Check Open Graph tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toBeTruthy();
    });

    test('Sitemap is accessible', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');
      expect(response?.status()).toBe(200);

      const content = await page.textContent('body');
      expect(content).toContain('<?xml');
      expect(content).toContain('urlset');
    });

    test('Robots.txt is accessible', async ({ page }) => {
      const response = await page.goto('/robots.txt');
      expect(response?.status()).toBe(200);

      const content = await page.textContent('body');
      expect(content).toContain('User-agent');
    });
  });
});
