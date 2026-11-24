import { test, expect } from "@playwright/test"

test.describe("Landing Page - Comprehensive Sections & Interactions", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page and wait for DOM readiness
    await page.goto("/", { waitUntil: "domcontentloaded" })
  })

  test("1. Hero Section: Renders original anime moon canvas, headline, glitch, and CTAs", async ({
    page,
  }) => {
    const hero = page.locator("#pasax")
    await expect(hero).toBeVisible()

    // Heading with glitch effect
    const h1 = hero.locator("h1")
    await expect(h1).toContainText("Autonomous")
    await expect(h1).toContainText("fleet immunity")
    await expect(h1).toContainText("in microseconds.")

    // CTAs
    const getStartedBtn = hero.getByRole("link", { name: /get started/i })
    await expect(getStartedBtn).toBeVisible()
    await expect(getStartedBtn).toHaveAttribute("href", "/docs")

    const liveThreatMapBtn = hero.getByRole("link", {
      name: /live threat map/i,
    })
    await expect(liveThreatMapBtn).toBeVisible()
    await expect(liveThreatMapBtn).toHaveAttribute("href", "/threats-map")

    // Install command widget
    await expect(
      hero.getByText(/curl -sSL https:\/\/get\.pasax\.dev \| bash/i)
    ).toBeVisible()

    // Frameworks
    for (const name of ["Ubuntu", "Debian", "Docker", "Laravel"]) {
      await expect(hero.getByRole("link", { name, exact: true })).toBeVisible()
    }

    // Canvas Stage (Original mascot anime sitting on moon)
    const stageCanvas = hero.locator("canvas").first()
    await expect(stageCanvas).toBeVisible()
  })

  test("2. Style Section: Monitor tabs with interactive 360° Tactical Perimeter Radar", async ({
    page,
  }) => {
    const style = page.locator("#style")
    await style.scrollIntoViewIfNeeded()
    await expect(style).toBeVisible()

    // Headline & claims
    await expect(style).toContainText("Pasax is an")
    await expect(style).toContainText("fleet immunity framework")
    await expect(
      style.getByText(
        /Brings military-grade packet drop & FIM to your server workloads/i
      )
    ).toBeVisible()

    // Tab buttons
    const tabMesh = page.locator("#style-tab-layouts")
    const tabKernel = page.locator("#style-tab-story")
    const tabWaf = page.locator("#style-tab-openapi")
    const tabThreatRadar = page.locator("#style-tab-graphql")
    const tabFim = page.locator("#style-tab-asyncapi")

    await expect(tabMesh).toBeVisible()
    await expect(tabKernel).toBeVisible()
    await expect(tabWaf).toBeVisible()
    await expect(tabThreatRadar).toBeVisible()
    await expect(tabFim).toBeVisible()

    // Activate Threat Radar Tab with scroll & retry
    await tabThreatRadar.scrollIntoViewIfNeeded()
    await tabThreatRadar.click()
    if ((await tabThreatRadar.getAttribute("aria-selected")) !== "true") {
      await page.waitForTimeout(300)
      await tabThreatRadar.click()
    }
    await expect(tabThreatRadar).toHaveAttribute("aria-selected", "true", {
      timeout: 10000,
    })

    // Verify 360° Tactical Ship Radar Screen inside monitor
    await expect(style.getByText(/THREAT RADAR/i).first()).toBeVisible()
    await expect(style.getByText(/PERIMETER SWEEP/i).first()).toBeVisible()
    await expect(style.getByText(/DROPS/i).first()).toBeVisible()
    await expect(style.locator("canvas").first()).toBeVisible()

    // Verify Full Map link
    const viewFullMap = style.getByRole("link", { name: /Full Map/i })
    await expect(viewFullMap).toBeVisible()
    await expect(viewFullMap).toHaveAttribute("href", "/threats-map")

    // Switch to another tab (Kernel Drop)
    await tabKernel.scrollIntoViewIfNeeded()
    await tabKernel.click()
    if ((await tabKernel.getAttribute("aria-selected")) !== "true") {
      await page.waitForTimeout(300)
      await tabKernel.click()
    }
    await expect(tabKernel).toHaveAttribute("aria-selected", "true", {
      timeout: 10000,
    })
  })

  test("2.5 Defense Scope Section: Displays what Pasax defends across web, kernel & fleet", async ({
    page,
  }) => {
    const defenseScope = page.locator("#what-pasax-defends")
    await defenseScope.scrollIntoViewIfNeeded()
    await expect(defenseScope).toBeVisible()

    // Heading verification
    await expect(defenseScope).toContainText("Apa saja yang")
    await expect(defenseScope).toContainText("ditangani Pasak")
    await expect(defenseScope).toContainText("untuk Anda")

    // Threat vector cards
    await expect(
      defenseScope.getByText("SQL Injection & Data Extraction").first()
    ).toBeVisible()
    await expect(
      defenseScope.getByText("Volumetric DDoS & SYN Floods").first()
    ).toBeVisible()
    await expect(
      defenseScope
        .getByText(/Pencurian & Perubahan Berkas \.env Kritis/i)
        .first()
    ).toBeVisible()
    await expect(
      defenseScope.getByText(/Pertahanan Kolektif/i).first()
    ).toBeVisible()

    // Category filter tab interaction
    const kernelTab = defenseScope.getByRole("tab", {
      name: /Kernel & Jaringan/i,
    })
    await expect(kernelTab).toBeVisible()
    await kernelTab.click()
    await expect(
      defenseScope.getByText("Volumetric DDoS & SYN Floods").first()
    ).toBeVisible()

    // View mode switch to matrix
    const matrixBtn = defenseScope.getByRole("button", {
      name: "Matriks Komparasi",
    })
    await matrixBtn.click()
    await expect(defenseScope.locator("table")).toBeVisible()
  })

  test("3. Write Section: Declarative policy rules as code (pasax-rules.yml)", async ({
    page,
  }) => {
    const write = page.locator("#write")
    await write.scrollIntoViewIfNeeded()
    await expect(write).toBeVisible()

    // Heading
    await expect(write).toContainText("Microsecond threat interception")
    await expect(write).toContainText("zero dependencies")

    // Declarative YAML policy rules
    await expect(write.getByText(/pasax-rules\.yml/i).first()).toBeVisible()
    await expect(write.getByText(/BLOCK_AND_QUARANTINE/i).first()).toBeVisible()
  })

  test("4. Automate Section: Fleet defense rules synchronization", async ({
    page,
  }) => {
    const automate = page.locator("#automate")
    await automate.scrollIntoViewIfNeeded()
    await expect(automate).toBeVisible()

    // Lead & Title
    await expect(automate.getByText(/Always in sync\./i)).toBeVisible()
    await expect(automate).toContainText(
      "Synchronize defense rules across your"
    )
    await expect(automate).toContainText("fleet")
  })

  test("5. Parts Section: Composable 3-layer security architecture", async ({
    page,
  }) => {
    const parts = page.locator("#parts")
    await parts.scrollIntoViewIfNeeded()
    await expect(parts).toBeVisible()

    // Heading
    await expect(parts).toContainText("Multi-tiered")
    await expect(parts).toContainText("fleet security")
    await expect(parts).toContainText("separated into 3 defense layers.")
  })

  test("6. Integrations Section: Ecosystem modules & distributions", async ({
    page,
  }) => {
    const integrations = page.locator("#integrations")
    await integrations.scrollIntoViewIfNeeded()
    await expect(integrations).toBeVisible()

    // Heading
    await expect(integrations).toContainText("Extend your nodes with")
    await expect(integrations).toContainText("native integrations")

    // More expandable row
    await expect(integrations.getByText(/\+\d+ more/i)).toBeVisible()
  })

  test("7. CLI Section: Pasax Sentinel autonomous node hardening", async ({
    page,
  }) => {
    const cli = page.locator("#cli")
    await cli.scrollIntoViewIfNeeded()
    await expect(cli).toBeVisible()

    // Speech bubble & title
    await expect(cli.getByText(/Need autonomous protection\?/i)).toBeVisible()
    await expect(cli).toContainText("Use")
    await expect(cli).toContainText("Pasax Sentinel")
    await expect(cli).toContainText("to harden")

    // Terminal window titled sentinel-node-01
    await expect(cli.getByText("sentinel-node-01").first()).toBeVisible()
    await expect(cli.getByText("pasax-sentinel").first()).toBeVisible()

    // Command runner
    const cmdLine = cli.locator("[data-command]").first()
    await expect(cmdLine).toBeVisible()

    // Interactive action chips
    const chipButtons = cli.locator("button[data-play]")
    const chipCount = await chipButtons.count()
    expect(chipCount).toBeGreaterThanOrEqual(1)
  })

  test("8. Proof & Showcase Section: Production battle-tested metrics", async ({
    page,
  }) => {
    const proof = page.locator("#proof")
    await proof.scrollIntoViewIfNeeded()
    await expect(proof).toBeVisible()

    // Heading
    await expect(proof).toContainText("Battle-tested")
    await expect(proof).toContainText("shielding servers in production.")

    // Showcase link
    const showcaseLink = proof.locator("a[data-window='all']")
    await expect(showcaseLink).toBeVisible()
    await expect(showcaseLink).toHaveAttribute("href", "/showcase")
  })

  test("9. Feedback Section: DevOps & Security testimonials", async ({
    page,
  }) => {
    const feedback = page.locator("#feedback")
    await feedback.scrollIntoViewIfNeeded()
    await expect(feedback).toBeVisible()

    // Heading
    await expect(feedback).toContainText("Trusted by high-throughput")
    await expect(feedback).toContainText("DevOps")
    await expect(feedback).toContainText("security teams")

    // Quotes
    await expect(feedback.getByText("@pasax_core")).toBeVisible()
    await expect(feedback.getByText("@ssalbdivad")).toBeVisible()
  })

  test("10. Start Section: CTA, Sand physics Wordmark canvas, and Footer", async ({
    page,
  }) => {
    const start = page.locator("#start")
    await start.scrollIntoViewIfNeeded()
    await expect(start).toBeVisible()

    // Heading
    await expect(start).toContainText("Start with Pasax")
    await expect(start).toContainText("defend")
    await expect(start).toContainText("your servers now.")

    // Install command
    await expect(
      start.getByText(/curl -sSL https:\/\/get\.pasax\.dev \| bash/i)
    ).toBeVisible()

    // Action buttons
    await expect(start.getByRole("link", { name: "Get started" })).toBeVisible()
    await expect(
      start.getByRole("link", { name: "What is Pasax?" })
    ).toBeVisible()
    await expect(
      start.getByRole("link", { name: "Star on GitHub" })
    ).toBeVisible()

    // Wordmark Canvas (Filled particle sand simulation)
    const wordmarkCanvas = start.locator("canvas").first()
    await expect(wordmarkCanvas).toBeVisible()

    // Footer links
    const footer = start.locator("footer")
    await expect(footer).toBeVisible()
    await expect(footer.getByRole("link", { name: "Docs" })).toBeVisible()
    await expect(footer.getByRole("link", { name: "Threat Map" })).toBeVisible()
    await expect(
      footer.getByRole("link", { name: "Sentinel Daemon" })
    ).toBeVisible()
    await expect(footer.getByRole("link", { name: "Shield WAF" })).toBeVisible()
  })
})
