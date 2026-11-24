import { test, expect } from "@playwright/test"

test.describe("Pricing & 14-Day Pro Trial Lifecycle Scenarios", () => {
  test("1. Landing page /#pricing displays exactly 2 tiers (Pro with 14-day trial & Enterprise), no Free tier", async ({
    page,
  }) => {
    await page.goto("/#pricing")
    await expect(page).toHaveTitle(/Pasax/i)

    // Verify Pro Fleet SOC exists with 14-Day Free Trial badge
    const proHeading = page.locator("h3", { hasText: /Pro Fleet SOC/i })
    await expect(proHeading).toBeVisible()

    // Verify Enterprise & Gov exists
    const entHeading = page.locator("h3", { hasText: /Enterprise & Gov/i })
    await expect(entHeading).toBeVisible()

    // Verify Free tier is NOT in the cards
    const freePlanCard = page.locator("h3", { hasText: /^Free Community$/i })
    await expect(freePlanCard).toHaveCount(0)

    // Verify 14-Day Trial badge on Pro
    const trialBadge = page.locator("text=14 HARI TRIAL PRO GRATIS")
    await expect(trialBadge).toBeVisible()

    // Verify CTA on Pro card links to register with 14-day trial text
    const proCta = page.locator("a", { hasText: /Mulai Trial Pro 14 Hari/i })
    await expect(proCta).toBeVisible()
    await expect(proCta).toHaveAttribute("href", "/register?plan=pro")
  })

  test("2. Landing page /#pricing currency & billing toggle works interactively", async ({
    page,
  }) => {
    await page.goto("/#pricing")

    // Default is IDR Bulanan -> Rp 149.000
    await expect(page.locator("text=Rp 149.000")).toBeVisible()

    // Switch to USD
    const usdBtn = page.locator("button", { hasText: "USD ($)" })
    await usdBtn.click()
    // Should render USD currency symbol
    await expect(page.locator("text=/\\$\\d+/").first()).toBeVisible()

    // Switch to Tahunan (Yearly)
    const yearlyBtn = page.locator("button", { hasText: "Tahunan" })
    await yearlyBtn.click()
    await expect(page.locator("text=/\\/ yr/").first()).toBeVisible()
  })

  test("3. /licenses admin view shows tier badge and management actions", async ({
    page,
  }) => {
    await page.goto("/licenses")

    // Verify license table renders
    const table = page.locator("table")
    await expect(table).toBeVisible()

    // Verify column TIER / TRIAL is present
    await expect(
      page.locator("th", { hasText: /TIER \/ TRIAL/i })
    ).toBeVisible()

    // Verify TRIAL or PRO BERBAYAR badges exist in rows
    const trialBadges = page.locator("text=TRIAL (")
    const proBadges = page.locator("text=PRO BERBAYAR")
    const totalBadges = (await trialBadges.count()) + (await proBadges.count())
    expect(totalBadges).toBeGreaterThan(0)
  })

  test("4. /pricing admin view shows 2 plans catalog", async ({ page }) => {
    await page.goto("/pricing")
    await expect(page).toHaveTitle(/Model Bisnis/i)

    // Table or list should show Pro Fleet SOC and Enterprise & Gov
    await expect(page.locator("text=Pro Fleet SOC").first()).toBeVisible()
    await expect(page.locator("text=Enterprise & Gov").first()).toBeVisible()
  })
})
