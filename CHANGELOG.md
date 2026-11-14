# Changelog — `pasak-dashboard`

All notable changes to the **Pasak Cloud Central Monitoring Console** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.8.1] - 2026-11-13

### Changed

- **Penyelarasan Dokumentasi Ekosistem Pasak (`pasak-dev/secure-monitor` & `Pasak\SecureMonitor`)**:
  - Memperbarui `README.md` dan `docs/01-architecture.md` untuk menyelaraskan referensi paket WAF Laravel ke `pasak-dev/secure-monitor` dengan namespace kanonikal `Pasak\SecureMonitor`.
  - Memperbarui `docs/03-api-reference.md` dengan skema payload telemetri dan pelaporan insiden ancaman WAF dari modul aplikasi Laravel.
  - Memperbarui panduan operasional AI Agent di `AGENTS.md` (6-chapter docs suite).

### Added

- **Bab Baru Dokumentasi Ekosistem**:
  - Menambahkan Bab 06: `docs/06-ecosystem-integration.md` yang merinci integrasi terpadu tiga pilar pertahanan Pasak (`pasak-sentinel`, `pasak-dev/secure-monitor`, dan `pasak-dashboard`).
  - Memperbarui indeks suite dokumentasi pada `docs/README.md`.

---

## [0.8.0] - 2026-11-09

### Added

- **Rute Dokumentasi Khusus Mandiri per Produk (Product-Scoped Dedicated Docs Hub)**:
  - Menyediakan halaman beranda mandiri khusus untuk tiap produk:
    - `/docs/pasak-secure-monitor`: Pusat dokumentasi WAF mandiri murni PHP untuk Laravel 10–13.
    - `/docs/pasak-sentinel`: Pusat dokumentasi kernel daemon Linux Go 1.24 dengan nftables & inotify FIM.
    - `/docs/core`: Pusat arsitektur platform terpadu Pasak Trinity Defense.
  - Struktur rute dokumen dengan prefix produk: `/docs/:product/:slug` (misal `/docs/pasak-secure-monitor/getting-started/introduction`), serta tetap mendukung fallback slug kompatibilitas.
  - Komponen ikhtisar `ProductDocsOverview` (`components/docs/product-docs-overview.tsx`) dengan perintah instalasi instan dan katalog artikel interaktif.
  - Sidebar dokumentasi yang secara otomatis mendeteksi produk aktif berdasarkan URL dan memungkinkan navigasi instan antar-tab produk.

- **Halaman Autentikasi & Integrasi NextAuth (`pnpm add next-auth`)**:
  - Konfigurasi `NextAuth` App Router pada `app/api/auth/[...nextauth]/route.ts` dan `lib/auth.ts`.
  - Mendukung penyedia autentikasi **Google OAuth**, **GitHub OAuth**, dan **SOC Credentials** dengan dukungan role (`Superadmin`, `Admin`, `Support`, `Teknis`, `User`).
  - Halaman `/login` (`app/(auth)/login/page.tsx`) dan `/register` (`app/(auth)/register/page.tsx`) bertema Neobrutalism lengkap dengan tombol OAuth Google & GitHub, serta tombol pintas pengisian peran demo SOC (_Superadmin_, _Admin_, _Support_, _Teknis_, _User_).
  - Pembungkus `SessionProvider` (`components/auth/session-provider.tsx`) di `app/layout.tsx`.

- **Halaman Error Terpadu Neobrutalism (404, 403, 500)**:
  - `app/not-found.tsx`: Halaman 404 kustom bertema SOC dengan diagnosis edge router dan tombol pemulihan.
  - `app/error.tsx`: Error boundary 500 kustom dengan tombol coba muat ulang dan fault digest.
  - `app/forbidden.tsx` & `app/(public)/403/page.tsx`: Halaman 403 Akses Ditolak kustom dengan telemetri insiden WAF, karantina perangkat NAT, dan simulasi formulir pengajuan tiket banding.

---

## [0.7.0] - 2026-11-09

### Removed

- **Penghapusan Total Direktori `content/` (100% Pure Headless Client)**:
  - Menghapus folder `content/` seutuhnya dari repositori `pasak-dashboard` karena seluruh 44 dokumen teknis telah disimpan permanen di database Neon PostgreSQL.
  - Menghapus dependensi modul `fs` dan `path` dari `lib/docs-service.ts`. Dashboard kini 100% bebas dari tracing filesystem lokal dan sepenuhnya mengonsumsi API `https://pasak-api.vercel.app/api/v1/docs/:product/:slug`.
  - Sumber berkas markdown untuk seeder telah dipindahkan ke `pasak-api/src/database/data/docs/`.

### Changed

- **Pemisahan Total Arsitektur: Dashboard Sebagai Display Consumer Murni**:
  - Menghapus route handler `/api/v1/docs` dari `pasak-dashboard`. Seluruh operasi CRUD dan penyimpanan dokumentasi dialihkan seutuhnya ke `pasak-api` yang terhubung langsung ke database Neon Serverless PostgreSQL (`docs` table).
  - Memperbarui `lib/docs-service.ts` untuk mengonsumsi data dokumentasi secara dinamis via API `https://pasak-api.vercel.app/api/v1/docs/:product/:slug`.
  - Memperbarui `app/(public)/docs/[...slug]/page.tsx` menjadi asinkron penuh saat mengambil konten dari database Neon.

### Added

- **Agent Skill `docs-sync` Tersinkronisasi ke Neon DB**:
  - Memperbarui skill `.agents/skills/docs-sync/` di seluruh ekosistem repositori agar AI Agent berinteraksi langsung dengan backend `pasak-api` (`https://pasak-api.vercel.app/api/v1/docs`).

---

## [0.6.0] - 2026-11-09

### Added

- **Pemisahan Pohon Dokumentasi Khusus Produk (Multi-Product Tree)**:
  - `content/docs/`: Dokumentasi platform suite inti (`overview.md`, `architecture.md`, `quickstart.md`, `soc-console.md`, `cloud-api.md`).
  - `content/pasak-secure-monitor/docs/`: 29 panduan lengkap WAF murni PHP untuk Laravel (`pasak-dev/secure-monitor`).
  - `content/pasak-sentinel/docs/`: 8 panduan lengkap host & kernel daemon Linux Go 1.24 (`01-architecture` sampai `07-cloud-telemetry`).
