import { test, expect } from "@playwright/test"

test.describe("Threats Map & Real-Time Radar", () => {
  test("Navbar contains Threat Map link with live indicator", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const threatMapLink = page.locator("header nav").getByRole("link", { name: /threat map/i })
    await expect(threatMapLink).toBeVisible()
    await expect(threatMapLink).toHaveAttribute("href", "/threats-map")
  })

  test("Landing page Style section mounts 360° Tactical Perimeter Radar inside monitor", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })

    const style = page.locator("#style")
    await style.scrollIntoViewIfNeeded()
    await expect(style).toBeVisible()

    // Click on Threat Radar tab
    const tabThreatRadar = page.locator("#style-tab-graphql")
    await tabThreatRadar.scrollIntoViewIfNeeded()
    await expect(tabThreatRadar).toBeVisible()
    await tabThreatRadar.click()

    // Verify 360° Tactical Ship Radar inside monitor
    await expect(page.locator("#style").getByText(/THREAT RADAR/i).first()).toBeVisible()
    await expect(page.locator("#style").getByText(/PERIMETER SWEEP/i).first()).toBeVisible()
    await expect(page.locator("#style").getByText(/DROPS/i).first()).toBeVisible()
    await expect(page.locator("#style canvas").first()).toBeVisible()

    // Verify CTA link to full map
    const mapLink = page.locator("#style").getByRole("link", { name: /Full Map/i })
    await expect(mapLink).toBeVisible()
    await expect(mapLink).toHaveAttribute("href", "/threats-map")
  })

  test("Threats Map Page renders 3D globe, HUD controls, and Live Feeds", async ({ page }) => {
    await page.goto("/threats-map")
    await page.waitForLoadState("domcontentloaded")

    // Check HUD title & badge
    await expect(page.getByText(/live threat map/i)).toBeVisible()
    await expect(page.getByText(/attacks intercepted today/i)).toBeVisible()

    // Check 2D / 3D toggle
    const btn2D = page.getByRole("button", { name: "2D" })
    const btn3D = page.getByRole("button", { name: "3D" })
    await expect(btn2D).toBeVisible()
    await expect(btn3D).toBeVisible()

    // Check Rotation toggle
    const rotationBtn = page.getByRole("button", { name: /rotation/i })
    await expect(rotationBtn).toBeVisible()
    await expect(rotationBtn).toBeEnabled()
    await rotationBtn.click()

    const resumeBtn = page.getByRole("button", { name: /resume rotation/i })
    try {
      await expect(resumeBtn).toBeVisible({ timeout: 2000 })
    } catch {
      await rotationBtn.click()
      await expect(resumeBtn).toBeVisible()
    }
    await resumeBtn.click()

    // Check Continent Dock buttons
    for (const region of ["N. AMERICA", "EUROPE", "ASIA"]) {
      const btn = page.getByRole("button", { name: region })
      await expect(btn).toBeVisible()
    }

    // Check Live Attack Feeds Sidebar (Desktop)
    await expect(page.getByText(/Cyber Threat Feeds/i)).toBeVisible()
    await expect(page.getByText(/RECENT ATTACK STREAMS/i)).toBeVisible()

    // Check 3D Canvas Mount
    const canvas = page.locator("main canvas")
    await expect(canvas).toBeVisible()
  })
})
