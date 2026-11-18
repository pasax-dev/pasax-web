import { test, expect } from "@playwright/test"

test.describe("Docs Sidebar - Version & Module Switcher", () => {
  test("Renders VersionSwitcher dropdown and allows switching versions & modules", async ({
    page,
  }) => {
    await page.goto("/docs/pasax-secure-monitor")
    await page.waitForLoadState("domcontentloaded")

    // Find the VersionSwitcher button
    const switcherButton = page
      .locator("button")
      .filter({ hasText: /Pasax Secure Monitor/i })
      .first()
    await expect(switcherButton).toBeVisible()
    await expect(switcherButton).toContainText(/v1\.0\.\d+/)

    // Wait until interactive & click
    await expect(switcherButton).toBeEnabled()
    await switcherButton.click()

    // If parallel load causes a hydration lag, ensure dropdown is triggered
    const dropdownMenu = page.getByText("Modul Ekosistem Pasax")
    try {
      await expect(dropdownMenu).toBeVisible({ timeout: 2000 })
    } catch {
      await switcherButton.click()
      await expect(dropdownMenu).toBeVisible()
    }

    // Verify module switcher items
    await expect(page.getByText("Pasax Sentinel")).toBeVisible()
    await expect(page.getByText("Pasax Core Engine")).toBeVisible()
    await expect(page.getByText("Versi Packagist (Live)")).toBeVisible()
    await expect(page.getByRole("menuitem").getByText("v1.0.1")).toBeVisible()

    // Select version v1.0.1
    await page.getByRole("menuitem").getByText("v1.0.1").click()

    // Dropdown closes and button shows updated version
    await expect(switcherButton).toContainText("v1.0.1")
  })
})
