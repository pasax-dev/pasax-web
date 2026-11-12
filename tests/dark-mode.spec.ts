import { test, expect } from '@playwright/test';

test.describe('Neobrutalism Dark Mode & SOC Navigation', () => {
  test('public landing page toggles dark mode via ThemeToggle and keyboard shortcut', async ({ page }) => {
    await page.goto('/');

    // Page title and branding should be visible
    await expect(page.locator('text=PASAK').first()).toBeVisible();

    // Initial state: html should not have dark class by default if light
    const html = page.locator('html');

    // Find and click ThemeToggle in header
    const themeBtn = page.getByRole('button', { name: /toggle color theme|switch to dark theme/i }).first();
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();

    // Verify dark class is applied to html element
    await expect(html).toHaveClass(/dark/);

    // Verify persistence across reload
    await page.reload();
    await expect(html).toHaveClass(/dark/);

    // Press keyboard shortcut "d" to toggle back to light mode
    await page.keyboard.press('d');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('SOC dashboard renders cards, operations matrix, and header theme toggle', async ({ page }) => {
    await page.goto('/dashboard');

    // Header brand and Sentinel Mesh status
    await expect(page.locator('text=PASAK').first()).toBeVisible();
    await expect(page.locator('text=Sentinel Mesh Online')).toBeVisible();

    // Section cards
    await expect(page.locator('text=Cluster Health Score')).toBeVisible();
    await expect(page.locator('text=Protected VPS Nodes')).toBeVisible();

    // Theme toggle in header
    const headerToggle = page.locator('header').getByRole('button', { name: /switch to/i }).first();
    await expect(headerToggle).toBeVisible();

    const html = page.locator('html');
    await headerToggle.click();
    await expect(html).toHaveClass(/dark/);

    // Operations panel tabs
    await expect(page.getByRole('tab', { name: /Server Fleet/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Threat Incidents/i })).toBeVisible();
  });
});

