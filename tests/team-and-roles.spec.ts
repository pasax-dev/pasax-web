import { test, expect } from '@playwright/test';

test.describe('Role Otoritas Admin, Delegasi Tim Programmer & Maintainer, serta Monitoring Node', () => {

  test('1. Endpoint registrasi otomatis menetapkan role Admin dan Pro Trial 14 Hari', async ({ request }) => {
    const randomHex = Math.random().toString(36).substring(2, 8);
    const email = `admin_${randomHex}@startup.io`;

    const res = await request.post('/api/auth/register', {
      data: {
        name: `Founder ${randomHex}`,
        email: email,
        organization: `Startup Mesh ${randomHex}`,
        password: 'Password123!',
      },
    });

    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('success');
    expect(json.data.user.role).toBe('Admin');
    expect(json.data.user.plan).toBe('pro');
    expect(json.data.licenseKey).toContain('psk_live_');
  });

  test('2. Halaman Matriks Hak Akses Peran (/permissions) menampilkan perbandingan wewenang Admin vs Tim', async ({ page }) => {
    await page.goto('/permissions');

    // Header & Title
    await expect(page.locator('h1')).toContainText('Matriks Hak Akses & Kemampuan Peran');
    await expect(page.getByText('ARSITEKTUR OTORITAS BERJENJANG PASAX')).toBeVisible();

    // Verify role explorer switcher tabs exist
    await expect(page.getByRole('button', { name: /Admin \(Pemilik Armada\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Programmer Aplikasi \(L7\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Server Maintainer \/ DevOps/i })).toBeVisible();

    // Click on Programmer tab
    await page.getByRole('button', { name: /Programmer Aplikasi \(L7\)/i }).click();
    await expect(page.getByText('AKSES LAYER APLIKASI')).toBeVisible();
    await expect(page.getByText('Inspeksi Log Serangan Web L7 Seketika')).toBeVisible();
    await expect(page.getByText('Menghapus Node Server atau Lisensi Induk')).toBeVisible();

    // Click on DevOps tab
    await page.getByRole('button', { name: /Server Maintainer \/ DevOps/i }).click();
    await expect(page.getByText('AKSES INFRASTRUKTUR & KERNEL')).toBeVisible();
    await expect(page.getByText('Monitoring Kesehatan Performa Hardware VPS')).toBeVisible();
    await expect(page.getByText('Pemantauan Status Daemon Sentinel & Firewall Kernel')).toBeVisible();

    // Table Comparison
    await expect(page.getByText('Matriks Perbandingan Wewenang Lengkap')).toBeVisible();
    await expect(page.getByText('Monitoring SEMUA Node VPS Armada')).toBeVisible();
  });

  test('3. Halaman Tim VPS & Pengguna (/users) memfasilitasi delegasi tim dan penugasan node', async ({ page }) => {
    await page.goto('/users');

    // Verify Title & Advisory Banner
    await expect(page.locator('h1')).toContainText('Manajemen Tim VPS & Pengguna');
    await expect(page.getByText('Otoritas Administrator: Manajemen Tim Programmer & Server Maintainer')).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: /Lihat Matriks Hak Akses Peran/i })).toBeVisible();

    // Verify Team Members appear in the list or can be filtered
    await expect(page.getByText('Budi Pratama')).toBeVisible();
    await expect(page.getByText('Ahmad Fauzi')).toBeVisible();

    // Verify role badges render distinctly
    await expect(page.getByText('PROGRAMMER L7').first()).toBeVisible();
    await expect(page.getByText('SERVER MAINTAINER').first()).toBeVisible();

    // Verify button to create team member exists
    await expect(page.getByRole('button', { name: /Tambah Anggota Tim \/ VPS/i })).toBeVisible();
  });

  test('4. Halaman Monitoring Node (/node) memungkinkan Admin memantau SEMUA server dan tim yang ditugaskan', async ({ page }) => {
    await page.goto('/node');

    // Verify Title & Monitoring Banner
    await expect(page.locator('h1')).toContainText('Daftar VPS & Node Sentinel');
    await expect(page.getByText('Monitoring Terpusat Seluruh Armada VPS (Admin View)')).toBeVisible();

    // Verify nodes are listed
    await expect(page.getByText('TOTAL VPS TERDAFTAR')).toBeVisible();
    await expect(page.getByText('ONLINE & TERLINDUNGI')).toBeVisible();

    // Verify link to permissions and team exists
    await expect(page.locator('main').getByRole('link', { name: /Matriks Hak Akses Peran/i })).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: /Kelola Tim VPS/i })).toBeVisible();
  });

});
