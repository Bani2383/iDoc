/**
 * Landing Page E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display header with navigation', async ({ page }) => {
    // Check logo
    await expect(page.locator('text=iDoc')).toBeVisible();

    // Check navigation links
    await expect(page.locator('text=Accueil')).toBeVisible();
    await expect(page.locator('text=Documents')).toBeVisible();
    await expect(page.locator('text=Signer un PDF')).toBeVisible();
    await expect(page.locator('text=FAQ & Démo')).toBeVisible();
    await expect(page.locator('text=Connexion')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Créez facilement tous vos documents');
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check ARIA labels
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();

    // Check keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeFocused();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=iDoc')).toBeVisible();

    // Check mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"]').first();
    await expect(mobileMenuButton).toBeVisible();
  });

  test('should show auth modal on login click', async ({ page }) => {
    await page.locator('text=Connexion').first().click();
    await page.waitForSelector('text=Connexion', { state: 'visible' });
  });
});
