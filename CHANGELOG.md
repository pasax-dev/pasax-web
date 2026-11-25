# Changelog — `pasax-web`

All notable changes to the **Pasax Cloud Central Monitoring Console** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-25

### Added

- **Team Role Delegation & Permissions Matrix (`app/(admin)/permissions/`, `app/(admin)/users/`)**:
  - Enforced `Admin` role default upon new account registration and added `Programmer` and `DevOps` team child-user delegation (`parentUserId`) with delegation badges and role permissions matrix documentation.
- **Browser SSH Web Terminal & Multi-Profile Persistence (`app/(admin)/terminal/`, `components/terminal/`)**:
  - Implemented interactive Xterm.js Web Terminal backed by `ssh2` for verified VPS connections, with Neon-persisted multi-profile SSH connection storage, verification gate, and true viewport fullscreen toggle.
- **Interactive Step-by-Step Onboarding Guide (`app/(public)/tutorial/`)**:
  - Launched `/tutorial` onboarding walkthrough covering 14-day Pro trial signup, Sentinel Linux agent provisioning, `pasax/secure-monitor` WAF setup, multi-profile Web Terminal access, team delegation, and safe live attack simulations.
- **Cookie Consent Banner & Superadmin Visitor Intelligence Console (`components/cookie-consent.tsx`, `app/(admin)/visitors/`)**:
  - Added granular Cookie Consent controls (`Accept All`, `Essential Only`, custom analytics/location preferences) with footer reset, visitor telemetry tracking (`POST /api/visitors`), and a Superadmin-only Visitor Intelligence console & export view.

### Security

- **Strict Multi-Tenant & Child-User Data Isolation**:
  - Enforced tenant-scoped authorization across servers, users, license keys, threat logs, and SSH profiles so users access only their own/delegated resources while visitor intelligence stays gated to `Superadmin`.

### Changed

- **Canonical Production Domain Migration (`https://service.pasax.web.id` & `https://pasax.web.id`)**:
  - Migrated backend API defaults (`PASAX_API_URL`, `lib/pasax-cloud.ts`, `lib/docs-service.ts`, `.env.example`), portal links (`components/user-tenant-portal.tsx`), ecosystem documentation (`docs/`), and `docs-sync` skills from `pasax-service.vercel.app` and `pasax.is-a.dev` to `https://service.pasax.web.id` and `https://pasax.web.id`.
- **Vercel Performance & UX Refinements**:
  - Optimized ISR revalidation intervals, GeoIP lookup caching, static asset footprints, function tracing, modal layouts, header breadcrumbs, and responsive admin tables.

### Fixed

- **React 19 `ThemeProvider`, Hotkey Guard & Console Cleanup**:
  - Fixed `ThemeProvider` hydration/compatibility in React 19, guarded `ThemeHotkey` against undefined `event.key`, resolved button nesting/semantics, and fixed missing avatar fallbacks.

---

## [1.0.3] - 2026-11-25

### Added

- **12-Vector Threat Defense Catalog & Comparison Matrix (`app/(public)/_landing/`)**:
  - Added an interactive 12-vector threat defense catalog (SQLi, XSS, RCE, DDoS, Shodan recon, honeypot decoys, sensitive file leaks, OOM protection) with category filtering and feature comparison matrix.
- **2-Tier Pricing & 14-Day Pro Trial Lifecycle (`package.json` `1.0.3`)**:
  - Updated pricing catalogue to 2 core paid tiers featuring an automatic 14-day Pro trial, zero-protection grace period fallback upon expiration, `/api/auth/verify` alias route, and end-to-end Playwright verification scenarios.

---

## [1.0.2] - 2026-11-24

### Added

- **Centralized License Key Verification Endpoint (`app/api/licenses/verify/route.ts`)**:
  - Added `/api/licenses/verify` endpoint enabling `php artisan pasax:install` to verify active customer API/license keys against the central Pasax Cloud backend.

---

## [1.0.1] - 2026-11-22

### Added

- **Landing Pricing Table & Superadmin `/pricing` CRUD Console (`app/(admin)/pricing/`)**:
  - Integrated public pricing comparison section on the landing page, dedicated Superadmin `/pricing` CRUD interface using `AdminTemplate`, promo discount percentages, automatic annual calculation, strikethrough pricing, and promo badges.
- **Live Wise IDR/USD Exchange Rate Conversion**:
  - Integrated live Wise mid-market exchange rate API for dynamic IDR/USD currency switching across pricing tables.

### Fixed

- **Static Landing Prerendering**:
  - Restored static prerendering for the root `/` route using client-side pricing hydration.

---

## [1.0.0] - 2026-11-21

### Added

- **Sentinel Binary Distribution & Public Installer Script (`public/downloads/`, `public/install.sh`)**:
  - Hosted multi-architecture `pasax-sentinel` Linux binaries (`amd64`/`arm64`) and one-line `https://pasax.web.id/install.sh` provisioning script.
- **Neobrutalist SOC Auth & shadcn `sidebar-07` Admin Console (`components/app-sidebar.tsx`, `components/admin-template.tsx`, `proxy.ts`)**:
  - Overhauled `/login` and `/register` UI, added OAuth (`GITHUB_ID`/`GITHUB_CLIENT_ID`, Google OAuth) env flexibility, configured fleet Superadmin/Admin roles, standardized admin layout on `sidebar-07` with collapsible icon-only navigation, `AdminTemplate`, breadcrumbs, avatar logout `AlertDialog`, and migrated `middleware.ts` to Next.js 16 `proxy.ts`.
- **Users & VPS Nodes CRUD Pages (`app/(admin)/users/`, `app/(admin)/nodes/`)**:
  - Added dedicated management pages for user accounts and monitored VPS nodes with flat sidebar navigation.

---

## [0.10.0] - 2026-11-18

### Added

- **Official Domain Setup & Dynamic Packagist Versioning (`lib/packagist.ts`)**:
  - Configured `pasax.web.id` domain records, integrated live dynamic version syncing from Packagist (`pasax/secure-monitor`), and added a 5-version switcher dropdown with release archive link.

### Changed

- **Fumadocs UI Overhaul & Threat Radar Modernization**:
  - Redesigned landing page, hero, auth, help/legal pages, and automate section layout with Fumadocs visual system and interactive illustrations; transitioned global Threat Radar to Server Components with smooth looping animations.

---

## [0.9.0] - 2026-11-15

### Added

- **Pasax Sentinel Documentation Suite (`docs/pasax-sentinel/`) & Production Telemetry**:
  - Added full Sentinel documentation suite and AI Agent VPS operational runbook; added `.env.example` and compliance refinements.

### Changed

- **Official Ecosystem Rebrand to `pasax` & Official PASAX Logo Wordmark**:
  - Migrated identity from `pasak` to `pasax` (`pasax/secure-monitor`), updated installation guides to `composer require pasax/secure-monitor` & `php artisan pasax`, and introduced the official PASAX wordmark.

---

## [0.8.1] - 2026-11-13

### Changed

- **Penyelarasan Dokumentasi Ekosistem Pasax (`pasax/secure-monitor` & `Pasax\SecureMonitor`)**:
  - Memperbarui `README.md` dan `docs/01-architecture.md` untuk menyelaraskan referensi paket WAF Laravel ke `pasax/secure-monitor` dengan namespace kanonikal `Pasax\SecureMonitor`.
  - Memperbarui `docs/03-api-reference.md` dengan skema payload telemetri dan pelaporan insiden ancaman WAF dari modul aplikasi Laravel.
  - Memperbarui panduan operasional AI Agent di `AGENTS.md` (6-chapter docs suite).

### Added

- **Bab Baru Dokumentasi Ekosistem**:
  - Menambahkan Bab 06: `docs/06-ecosystem-integration.md` yang merinci integrasi terpadu tiga pilar pertahanan Pasax (`pasax-sentinel`, `pasax/secure-monitor`, dan `pasax-web`).
  - Memperbarui indeks suite dokumentasi pada `docs/README.md`.

---

## [0.8.0] - 2026-11-09

### Added

- **Rute Dokumentasi Khusus Mandiri per Produk (Product-Scoped Dedicated Docs Hub)**:
  - Menyediakan halaman beranda mandiri khusus untuk tiap produk:
    - `/docs/pasax-secure-monitor`: Pusat dokumentasi WAF mandiri murni PHP untuk Laravel 10–13.
    - `/docs/pasax-sentinel`: Pusat dokumentasi kernel daemon Linux Go 1.24 dengan nftables & inotify FIM.
    - `/docs/core`: Pusat arsitektur platform terpadu Pasax Trinity Defense.
  - Struktur rute dokumen dengan prefix produk: `/docs/:product/:slug` (misal `/docs/pasax-secure-monitor/getting-started/introduction`), serta tetap mendukung fallback slug kompatibilitas.
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
  - Menghapus folder `content/` seutuhnya dari repositori `pasax-web` karena seluruh 44 dokumen teknis telah disimpan permanen di database Neon PostgreSQL.
  - Menghapus dependensi modul `fs` dan `path` dari `lib/docs-service.ts`. Dashboard kini 100% bebas dari tracing filesystem lokal dan sepenuhnya mengonsumsi API `https://service.pasax.web.id/api/v1/docs/:product/:slug`.
  - Sumber berkas markdown untuk seeder telah dipindahkan ke `pasax-api/src/database/data/docs/`.

### Changed

- **Pemisahan Total Arsitektur: Dashboard Sebagai Display Consumer Murni**:
  - Menghapus route handler `/api/v1/docs` dari `pasax-web`. Seluruh operasi CRUD dan penyimpanan dokumentasi dialihkan seutuhnya ke `pasax-api` yang terhubung langsung ke database Neon Serverless PostgreSQL (`docs` table).
  - Memperbarui `lib/docs-service.ts` untuk mengonsumsi data dokumentasi secara dinamis via API `https://service.pasax.web.id/api/v1/docs/:product/:slug`.
  - Memperbarui `app/(public)/docs/[...slug]/page.tsx` menjadi asinkron penuh saat mengambil konten dari database Neon.

### Added

- **Agent Skill `docs-sync` Tersinkronisasi ke Neon DB**:
  - Memperbarui skill `.agents/skills/docs-sync/` di seluruh ekosistem repositori agar AI Agent berinteraksi langsung dengan backend `pasax-api` (`https://service.pasax.web.id/api/v1/docs`).

---

## [0.6.0] - 2026-11-09

### Added

- **Pemisahan Pohon Dokumentasi Khusus Produk (Multi-Product Tree)**:
  - `content/docs/`: Dokumentasi platform suite inti (`overview.md`, `architecture.md`, `quickstart.md`, `soc-console.md`, `cloud-api.md`).
  - `content/pasax-secure-monitor/docs/`: 29 panduan lengkap WAF murni PHP untuk Laravel (`pasax/secure-monitor`).
  - `content/pasax-sentinel/docs/`: 8 panduan lengkap host & kernel daemon Linux Go 1.24 (`01-architecture` sampai `07-cloud-telemetry`).
