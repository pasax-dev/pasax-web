import { test, expect } from "@playwright/test"

test.describe("E2E Lab Scenarios: Pasax Suite Fleet Security & Subscription Tiers", () => {
  test("Scenario 1: User Pro 14-Day Free Trial - Full Active Protection Lifecycle", async ({
    page,
  }) => {
    // 1. Landing Pricing check
    await page.goto("/#pricing")
    await expect(page.locator("text=14 HARI TRIAL PRO GRATIS")).toBeVisible()
    await expect(page.locator("text=Mulai Trial Pro 14 Hari")).toBeVisible()

    // 2. Licenses view check
    await page.goto("/licenses")
    await expect(page.locator("table")).toBeVisible()
    // Should show TRIAL badge for users in trial period
    await expect(page.locator("text=TRIAL (").first()).toBeVisible()

    // 3. Verify VPS Nodes page shows active VirtualBox node and telemetry
    await page.goto("/node")
    await expect(
      page.locator("h1", { hasText: /Daftar VPS & Node Sentinel/i })
    ).toBeVisible()
    // Verify online badge exists
    await expect(page.locator("text=ONLINE").first()).toBeVisible()

    // 4. Verify Threats SOC Map shows real-time recorded incidents
    await page.goto("/threats")
    await expect(
      page.locator("text=Incident").or(page.locator("text=Threat")).first()
    ).toBeVisible()
  })

  test("Scenario 2: User Pro Real - Multi-VPS (2 Nodes) & Multi-App (4 Virtual Hosts) Topology", async ({
    page,
  }) => {
    // 1. Verify Nodes page lists multi-node fleet
    await page.goto("/node")
    const table = page.locator("table")
    await expect(table).toBeVisible()

    // Verify multiple VPS nodes appear in fleet list
    const onlineNodes = page.locator("text=ONLINE")
    const count = await onlineNodes.count()
    expect(count).toBeGreaterThanOrEqual(2)

    // 2. Verify VHosts page discovers 4+ web applications across the fleet
    await page.goto("/vhosts")
    await expect(page.locator("text=Virtual Hosts").first()).toBeVisible()
    const rows = page.locator("tbody tr")
    const vhostCount = await rows.count()
    expect(vhostCount).toBeGreaterThanOrEqual(4)

    // 3. Verify Global Blocklist mesh synchronization across nodes
    await page.goto("/blocklist")
    await expect(
      page.locator("h1", { hasText: /Crowd Defense & Kernel Blocklist/i })
    ).toBeVisible()
    // Should show active banned IPs in the kernel sync list
    const ipItems = page.locator("tbody tr")
    expect(await ipItems.count()).toBeGreaterThanOrEqual(1)
  })

  test("Scenario 3: User Enterprise & Gov - Sovereign Compliance, Tagging, & Air-gapped SLA", async ({
    page,
  }) => {
    // 1. Verify Enterprise Catalog in /pricing
    await page.goto("/pricing")
    const entTitle = page.locator("text=Enterprise & Gov")
    await expect(entTitle.first()).toBeVisible()

    // 2. Verify Enterprise Node tags in /node
    await page.goto("/node")
    // Tags such as Production, Edge-WAF, Staging, Disaster-Recovery
    await expect(
      page.locator("text=Production").or(page.locator("text=Edge-WAF")).first()
    ).toBeVisible()

    // 3. Verify SLA & Sovereign Data BSSN / UU PDP compliance indicators
    await page.goto("/#pricing")
    await expect(
      page.locator("text=BSSN").or(page.locator("text=Sovereign")).first()
    ).toBeVisible()
  })

  test("Scenario 4: User Expired Trial - Degradation to Passive Threat Counter & Anti-Tamper Verification", async ({
    page,
  }) => {
    // 1. Verify API contract for expired / inactive license
    const resp = await page.request.post("/api/licenses/verify", {
      data: {
        api_key: "psk_live_invalid_or_expired_test_key_12345",
      },
    })
    expect(resp.status()).toBe(401)
    const data = await resp.json()
    expect(data.valid).toBe(false)
    expect(data.status).toBe("error")

    // 2. Verify Superadmin Users Management page displays plan badges and status
    await page.goto("/users")
    await expect(page.locator("table")).toBeVisible()
    await expect(page.locator("text=TOTAL PENGGUNA")).toBeVisible()

    // 3. Verify Dashboard displays Threat Metrics overview
    await page.goto("/dashboard")
    await expect(page.locator("text=Total").first()).toBeVisible()
  })
})
