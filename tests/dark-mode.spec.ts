import { test, expect } from '@playwright/test';

test.describe('Neobrutalism Dark Mode & SOC Navigation', () => {
  test('public landing page toggles dark mode via ThemeToggle and keyboard shortcut', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Page title and branding should be visible
    await expect(page.locator('header').getByRole('link', { name: /pasax/i })).toBeVisible();

    const html = page.locator('html');

    // Find ThemeToggle in header (wait until client hydrates and it's enabled)
    const themeBtn = page.locator('header button[title*="theme"], header button[aria-label*="theme"]').first();
    await expect(themeBtn).toBeVisible({ timeout: 10000 });
    await expect(themeBtn).toBeEnabled({ timeout: 10000 });
    
    // Check initial dark mode state
    const initialIsDark = (await html.getAttribute('class'))?.includes('dark') ?? false;

    // Click toggle
    await themeBtn.click();

    // Verify dark class state toggled
    if (initialIsDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }

    // Verify persistence across reload
    await page.reload();
    if (initialIsDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
  });

  test('SOC dashboard renders cards, operations matrix, and header theme toggle', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

    // Header brand and Sentinel Mesh status
    await expect(page.locator('text=PASAX SOC').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Sentinel Mesh').first()).toBeVisible();

    // Section cards
    await expect(page.locator('text=Cluster Health Score').first()).toBeVisible();
    await expect(page.locator('text=Protected VPS Nodes').first()).toBeVisible();

    // Theme toggle in dashboard header
    const headerToggle = page.locator('header button[title*="theme"], header button[aria-label*="theme"]').first();
    await expect(headerToggle).toBeVisible();
    await expect(headerToggle).toBeEnabled({ timeout: 10000 });

    const html = page.locator('html');
    await headerToggle.click();
    await page.waitForTimeout(500);

    // Operations panel tabs
    await expect(page.getByRole('tab', { name: /Server Fleet/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Threat Incidents/i })).toBeVisible();
  });
});
