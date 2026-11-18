import { test, expect } from "@playwright/test"

test.describe("Public Information & Legal Pages", () => {
  test("1. Changelog Page: Renders release chronicles, filter tags, and search", async ({
    page,
  }) => {
    await page.goto("/changelog")
    await page.waitForLoadState("domcontentloaded")

    // Check Header & Version Badge
    await expect(
      page.getByRole("heading", { name: /Changelog & Catatan Rilis/i })
    ).toBeVisible()
    await expect(page.getByText("v1.0.6").first()).toBeVisible()
    await expect(page.getByText("LATEST STABLE").first()).toBeVisible()

    // Check LegalNav tabs
    await expect(
      page.getByRole("link", { name: /Terms of Service/i }).first()
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: /Privacy Policy/i }).first()
    ).toBeVisible()
    await expect(page.getByRole("link", { name: /FAQ/i }).first()).toBeVisible()

    // Test filter tag
    const wafTag = page.getByRole("button", { name: /Threat Radar/i }).first()
    await expect(wafTag).toBeVisible()
    await wafTag.click()
    await expect(
      page.getByText(/360° Tactical Marine Sweep Radar Engine/i)
    ).toBeVisible()
  })

  test("2. FAQ Page: Renders categories, search input, and expandable accordion", async ({
    page,
  }) => {
    await page.goto("/faq")
    await page.waitForLoadState("domcontentloaded")

    // Check Header
    await expect(
      page.getByRole("heading", { name: /Pertanyaan yang Sering Diajukan/i })
    ).toBeVisible()

    // Check category buttons
    await expect(
      page.getByRole("button", { name: "Arsitektur & Konsep", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Performa (<0.2ms)", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Kompatibilitas", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("button", {
        name: "Privasi & Zero-Knowledge",
        exact: true,
      })
    ).toBeVisible()

    // Check initial open question
    await expect(
      page.getByText(/Pasax adalah ekosistem kekebalan server mandiri/i)
    ).toBeVisible()

    // Click on another question to expand
    const subMsBtn = page.getByRole("button", {
      name: /Bagaimana cara Pasax Sentinel mencapai pemblokiran paket jaringan di bawah 0\.2 milidetik\?/i,
    })
    await expect(subMsBtn).toBeVisible()
    await subMsBtn.click()
    await expect(
      page.getByText(/Ketika WAF aplikasi mendeteksi payload berbahaya/i)
    ).toBeVisible()
  })

  test("3. Terms of Service Page: Renders bilingual summary, pillars, and LegalNav", async ({
    page,
  }) => {
    await page.goto("/terms")
    await page.waitForLoadState("domcontentloaded")

    await expect(
      page.getByRole("heading", { name: "Terms of Service" })
    ).toBeVisible()
    await expect(page.getByText(/RINGKASAN EKSEKUTIF \(TL;DR\)/i)).toBeVisible()
    await expect(page.getByText(/Hanya Tujuan Defensif/i)).toBeVisible()
    await expect(page.getByText(/Kode Terbuka MIT/i)).toBeVisible()
    await expect(page.getByText(/Kedaulatan Root Linux/i)).toBeVisible()
  })

  test("4. Privacy Policy Page: Renders Zero-Knowledge commitment and data table", async ({
    page,
  }) => {
    await page.goto("/privacy")
    await page.waitForLoadState("domcontentloaded")

    await expect(
      page.getByRole("heading", {
        name: /Kebijakan Privasi \(Privacy Policy\)/i,
      })
    ).toBeVisible()
    await expect(
      page.getByText(/KOMITMEN PERLINDUNGAN PRIVASI DATA/i)
    ).toBeVisible()
    await expect(
      page.getByText(/Nol Inspeksi Payload \(Zero-Payload\)/i)
    ).toBeVisible()
    await expect(page.getByText(/Egress-Only mTLS 1\.3/i)).toBeVisible()
  })
})
