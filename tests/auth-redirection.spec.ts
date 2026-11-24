import { test, expect } from "@playwright/test"

test.describe("Auth Header & Redirection Ergonomics", () => {
  test("unauthenticated user sees Masuk/Daftar in header and can access /login & /register", async ({
    page,
  }) => {
    // 1. Visit public landing page as unauthenticated guest
    await page.goto("/")

    // Verify Masuk & Daftar buttons are visible in header
    const masukBtn = page
      .locator("header")
      .getByRole("link", { name: /Masuk/i })
    const daftarBtn = page
      .locator("header")
      .getByRole("link", { name: /^Daftar$/i })

    await expect(masukBtn).toBeVisible()
    await expect(daftarBtn).toBeVisible()
    await expect(masukBtn).toHaveAttribute("href", "/login")
    await expect(daftarBtn).toHaveAttribute("href", "/register")

    // 2. Click Masuk and verify navigation to /login
    await masukBtn.click()
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator("input#email")).toBeVisible()

    // 3. Navigate to /register and verify form is accessible
    await page.goto("/register")
    await expect(page).toHaveURL(/\/register/)
    await expect(page.locator("input#email")).toBeVisible()
  })

  test("authenticated user sees Dashboard in header and cannot access /login or /register", async ({
    page,
  }) => {
    // 1. Perform login with superadmin credentials
    await page.goto("/login")
    await page.fill("input#email", "pasak.dev@gmail.com")
    await page.fill("input#password", "Tiram@1993")
    await page.click('button[type="submit"]')

    // Wait until navigated to /dashboard
    await page.waitForURL("**/dashboard", { timeout: 15000 })
    await expect(page).toHaveURL(/\/dashboard/)

    // 2. Visit public landing page while authenticated and wait for session resolution
    await page.goto("/")
    await page
      .waitForResponse(
        (resp) =>
          resp.url().includes("/api/auth/session") && resp.status() === 200,
        { timeout: 15000 }
      )
      .catch(() => {})

    // Header button should now point to Dashboard
    const dashboardHeaderBtn = page
      .locator("header")
      .getByRole("link", { name: /Dashboard/i })
      .first()
    await expect(dashboardHeaderBtn).toBeVisible({ timeout: 10000 })
    await expect(dashboardHeaderBtn).toHaveAttribute("href", "/dashboard")

    // Masuk/Daftar buttons should NOT be visible in desktop header
    await expect(
      page.locator("header").getByRole("link", { name: /Masuk/i })
    ).toBeHidden()
    await expect(
      page.locator("header").getByRole("link", { name: /^Daftar$/i })
    ).toBeHidden()

    // 3. Try to access /login directly while authenticated -> should be redirected to /dashboard
    await page.goto("/login")
    await page.waitForURL("**/dashboard", { timeout: 10000 })
    await expect(page).toHaveURL(/\/dashboard/)

    // 4. Try to access /register directly while authenticated -> should be redirected to /dashboard
    await page.goto("/register")
    await page.waitForURL("**/dashboard", { timeout: 10000 })
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
