import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Sidebar-07 Ergonomics', () => {
  test('sidebar expands, collapses into icon-only mode, and displays rich avatar dropdown', async ({ page }) => {
    // Hide Next.js dev overlay indicator in bottom-left corner so it doesn't intercept footer clicks
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = 'nextjs-portal, [data-nextjs-dev-overlay] { display: none !important; pointer-events: none !important; }';
      document.head?.appendChild(style);
    });

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

    // Remove any nextjs-portal if present
    await page.evaluate(() => {
      document.querySelectorAll('nextjs-portal').forEach((el) => el.remove());
    });

    // Wait for the sidebar to mount
    const sidebar = page.locator('[data-slot="sidebar"]');
    await expect(sidebar).toBeVisible({ timeout: 15000 });

    // In expanded state, team switcher and user details should be visible
    await expect(page.locator('text=Pasax Cyber Defense').first()).toBeVisible();
    await expect(page.locator('text=Roby Kartis (Chief SOC)').first()).toBeVisible();

    // Test TeamSwitcher dropdown in expanded mode with hydration safety
    const teamButton = page.locator('button').filter({ hasText: /Pasax Cyber Defense/i }).first();
    await expect(teamButton).toBeVisible();
    await expect(teamButton).toBeEnabled();
    await teamButton.click();

    const teamMenu = page.locator('text=Fleet Clusters & Meshes');
    try {
      await expect(teamMenu).toBeVisible({ timeout: 2000 });
    } catch {
      await teamButton.click();
      await expect(teamMenu).toBeVisible({ timeout: 5000 });
    }

    // Close team dropdown
    await page.keyboard.press('Escape');
    await expect(teamMenu).toBeHidden();

    // Toggle sidebar via data-sidebar="trigger"
    const trigger = page.locator('[data-sidebar="trigger"]');
    await expect(trigger).toBeVisible();
    await trigger.click();

    // Wait for collapsed state
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    // In collapsed mode:
    // 1. Fleet Workspaces group should be hidden
    await expect(page.locator('text=Fleet Workspaces')).toBeHidden();

    // 2. Avatar in footer should remain visible and accessible
    const userButton = page.locator('[data-slot="sidebar-footer"] button').first();
    await expect(userButton).toBeVisible();
    await expect(userButton).toBeEnabled();

    // Remove any nextjs-portal before clicking footer
    await page.evaluate(() => {
      document.querySelectorAll('nextjs-portal').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
        (el as HTMLElement).style.pointerEvents = 'none';
      });
    });

    // 3. Open user dropdown with force: true to avoid next.js devtools portal interception
    await userButton.click({ force: true });
    const dropdownMenu = page.locator('[data-slot="dropdown-menu-content"]');
    try {
      await expect(dropdownMenu).toBeVisible({ timeout: 2000 });
    } catch {
      await userButton.focus();
      await page.keyboard.press('Enter');
      await expect(dropdownMenu).toBeVisible({ timeout: 3000 });
    }

    // Verify rich dropdown content opens
    await expect(dropdownMenu.locator('text=Sovereign Air-Gapped')).toBeVisible();
    await expect(dropdownMenu.getByText('Superadmin', { exact: true })).toBeVisible();
    await expect(dropdownMenu.locator('text=Keluar dari Sesi SOC')).toBeVisible();

    // Click logout to test confirmation modal
    await dropdownMenu.locator('text=Keluar dari Sesi SOC').click();

    // Alert Dialog should be displayed
    await expect(page.locator('text=Konfirmasi Keluar Sesi SOC')).toBeVisible();
    const cancelBtn = page.locator('button', { hasText: 'Batal' });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // Modal closes cleanly
    await expect(page.locator('text=Konfirmasi Keluar Sesi SOC')).toBeHidden();

    // Expand sidebar back
    await trigger.click();
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
    await expect(page.locator('text=Fleet Workspaces')).toBeVisible();
  });
});
