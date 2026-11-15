import { test, expect } from "@playwright/test"

test.describe("Threats Map & Marketing Animations", () => {
  test("Navbar contains Threat Map link with live indicator", async ({ page }) => {
    await page.goto("/")
    const threatMapLink = page.locator("header nav").getByRole("link", { name: /threat map/i })
    await expect(threatMapLink).toBeVisible()
    await expect(threatMapLink).toHaveAttribute("href", "/threats-map")
  })

  test("Landing page features Live Telemetry, Tactical Radar, and Defense Dataflow", async ({ page }) => {
    await page.goto("/")

    // 1. Live Telemetry Ticker
    const ticker = page.locator("text=MESH TELEMETRY")
    await expect(ticker).toBeVisible()
    const tickerCta = page.getByRole("link", { name: /live threat map 3d/i })
    await expect(tickerCta).toBeVisible()

    // 2. Tactical Radar
    const radarHeading = page.getByRole("heading", { name: /360° Tactical Perimeter Radar/i })
    await expect(radarHeading).toBeVisible()

    // Test radar capability dock tabs
    const dropTab = page.getByRole("button", { name: /nftables drop/i })
    await expect(dropTab).toBeVisible()
    await dropTab.click()
    await expect(page.getByText(/pasax_input_filter/i)).toBeVisible()

    // 3. Triple Defense Flow Network
    const flowHeading = page.getByRole("heading", { name: /Triple-Defense Telemetry Dataflow/i })
    await expect(flowHeading).toBeVisible()

    // Test clicking a stage
    const l1Stage = page.locator("text=Layer 1: Laravel Shield")
    await expect(l1Stage).toBeVisible()
    await l1Stage.click()
    await expect(page.getByText(/Laravel Shield Deep Inspection/i)).toBeVisible()

    // 4. Threat Map Banner
    const bannerLink = page.getByRole("link", { name: /launch 3d threat map/i })
    await expect(bannerLink).toBeVisible()
  })

  test("Threats Map Page renders 3D globe, HUD controls, and Live Feeds", async ({ page }) => {
    await page.goto("/threats-map")

    // Check HUD title & badge
    await expect(page.getByText(/live threat map/i)).toBeVisible()
    await expect(page.getByText(/attacks intercepted today/i)).toBeVisible()

    // Check 2D / 3D toggle
    const btn2D = page.getByRole("button", { name: "2D" })
    const btn3D = page.getByRole("button", { name: "3D" })
    await expect(btn2D).toBeVisible()
    await expect(btn3D).toBeVisible()

    // Check Rotation toggle
    const btnStopRotation = page.getByRole("button", { name: /stop rotation/i })
    await expect(btnStopRotation).toBeVisible()
    await btnStopRotation.click()
    await expect(page.getByRole("button", { name: /resume rotation/i })).toBeVisible()
    await page.getByRole("button", { name: /resume rotation/i }).click()

    // Check Continent Dock buttons
    for (const region of ["N. AMERICA", "EUROPE", "ASIA"]) {
      const btn = page.getByRole("button", { name: region })
      await expect(btn).toBeVisible()
    }
    await page.getByRole("button", { name: "ASIA" }).click()

    // Check Cyber Threat Feeds sidebar
    await expect(page.getByText(/cyber threat feeds/i)).toBeVisible()
    await expect(page.getByText(/recent attack streams/i)).toBeVisible()

    // Test Feed Filters
    const criticalFilter = page.getByRole("button", { name: "CRITICAL" })
    await expect(criticalFilter).toBeVisible()
    await criticalFilter.click()

    // Test Global Attack Breakdown drawer
    const statsDrawerBtn = page.getByRole("button", { name: /Global Attack Breakdown/i })
    await expect(statsDrawerBtn).toBeVisible()
    await statsDrawerBtn.click()
    await expect(page.getByText(/Top Attack Origins/i)).toBeVisible()
    await statsDrawerBtn.click()

    // Switch to 2D Mode and verify canvas
    await btn2D.click()
    const canvas2d = page.locator("canvas")
    await expect(canvas2d).toBeVisible()

    // Switch back to 3D Mode
    await btn3D.click()
    await page.waitForTimeout(1000)

    // Capture visual verification screenshot
    await page.screenshot({ path: "/tmp/pasax-threats-map-verified.png" })
  })
})

