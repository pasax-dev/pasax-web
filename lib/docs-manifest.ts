export interface DocItem {
  slug: string
  title: string
  description: string
  category: string
  filePath: string
  product: "core" | "pasak-security-monitor" | "pasak-sentinel"
  order?: number
}

export interface DocCategory {
  title: string
  icon: string
  slug: string
  items: DocItem[]
}

export interface ProductConfig {
  id: "core" | "pasak-security-monitor" | "pasak-sentinel"
  name: string
  badge: string
  description: string
  subDir: string
  categories: DocCategory[]
}

export const PRODUCTS_CONFIG: Record<string, ProductConfig> = {
  core: {
    id: "core",
    name: "Pasak Suite Core",
    badge: "PLATFORM SUITE",
    description:
      "Arsitektur pertahanan terpadu berlapis tiga (Trinity Defense), konsol SOC, dan cloud control plane.",
    subDir: "docs",
    categories: [
      {
        title: "Platform Inti",
        icon: "Layers",
        slug: "platform",
        items: [
          {
            slug: "overview",
            title: "Pengenalan Pasak Suite (Trinity Defense)",
            description:
              "Arsitektur keamanan siber berlapis tiga menggabungkan Laravel, daemon Go, dan cloud monitoring console.",
            category: "Platform Inti",
            filePath: "overview.md",
            product: "core",
            order: 1,
          },
          {
            slug: "architecture",
            title: "Arsitektur Trinity & Alur Komunikasi",
            description:
              "Alur data IPC antar-proses lokal (0.04ms) dan sinkronisasi awan telemetri aman mTLS.",
            category: "Platform Inti",
            filePath: "architecture.md",
            product: "core",
            order: 2,
          },
          {
            slug: "quickstart",
            title: "Panduan Memulai Cepat (Suite Quickstart)",
            description:
              "Langkah-langkah cepat menghubungkan pasak-security-monitor, pasak-sentinel, dan pasak-dashboard.",
            category: "Platform Inti",
            filePath: "quickstart.md",
            product: "core",
            order: 3,
          },
          {
            slug: "soc-console",
            title: "Konsol Monitoring SOC & Peta Ancaman 3D",
            description:
              "Panduan navigasi SOC dashboard, inspeksi armada server VPS, dan simulasi penyerangan.",
            category: "Platform Inti",
            filePath: "soc-console.md",
            product: "core",
            order: 4,
          },
          {
            slug: "cloud-api",
            title: "Arsitektur Control Plane API & Neon DB",
            description:
              "Pusat koordinasi telemetri terdistribusi berbasis Hono dan basis data Neon Serverless PostgreSQL.",
            category: "Platform Inti",
            filePath: "cloud-api.md",
            product: "core",
            order: 5,
          },
        ],
      },
    ],
  },
  "pasak-security-monitor": {
    id: "pasak-security-monitor",
    name: "pasak-security-monitor",
    badge: "LARAVEL PACKAGE",
    description:
      "Web Application Firewall (WAF) 100% murni PHP untuk Laravel 10–13, karantina perangkat, dan stepped login.",
    subDir: "pasak-security-monitor/docs",
    categories: [
      {
        title: "Memulai",
        icon: "Rocket",
        slug: "getting-started",
        items: [
          {
            slug: "getting-started/introduction",
            title: "Pengenalan & Filosofi Arsitektur",
            description:
              "Latar belakang, standar desain Spatie 100% Pure PHP tanpa dependensi NPM, dan integrasi core Laravel.",
            category: "Memulai",
            filePath: "getting-started/introduction.md",
            product: "pasak-security-monitor",
            order: 1,
          },
          {
            slug: "getting-started/installation",
            title: "Panduan Instalasi & Migrasi",
            description:
              "Instalasi Composer, wizard pasak:install, migrasi tabel database, dan pendaftaran middleware otomatis.",
            category: "Memulai",
            filePath: "getting-started/installation.md",
            product: "pasak-security-monitor",
            order: 2,
          },
          {
            slug: "getting-started/configuration",
            title: "Konfigurasi Lengkap & Environment",
            description:
              "Daftar lengkap variabel konfigurasi .env dan opsi config/pasak.php untuk lingkungan staging dan produksi.",
            category: "Memulai",
            filePath: "getting-started/configuration.md",
            product: "pasak-security-monitor",
            order: 3,
          },
        ],
      },
      {
        title: "Arsitektur Inti",
        icon: "Cpu",
        slug: "core-architecture",
        items: [
          {
            slug: "core-architecture/threat-detection-engine",
            title: "Threat Detection Engine & Zero-Tolerance WAF",
            description:
              "Mekanisme inspeksi payload, regex ReDoS-safe, mitigasi serangan null-byte, traversal, SSTI, dan auto-lockdown.",
            category: "Arsitektur Inti",
            filePath: "core-architecture/threat-detection-engine.md",
            product: "pasak-security-monitor",
            order: 1,
          },
          {
            slug: "core-architecture/reverse-proxy-resolution",
            title: "Resolusi Reverse Proxy & Deteksi IP Klien",
            description:
              "Penetapan IP nyata klien di balik Cloudflare, AWS ALB, Nginx, HAProxy, dan perlindungan IP header spoofing.",
            category: "Arsitektur Inti",
            filePath: "core-architecture/reverse-proxy-resolution.md",
            product: "pasak-security-monitor",
            order: 2,
          },
          {
            slug: "core-architecture/device-quarantine",
            title: "Karantina Berbasis Perangkat (Device-Level)",
            description:
              "Isolasi perangkat penyerang pada jaringan Wi-Fi publik / NAT bersama tanpa merugikan pengguna lain di kantor.",
            category: "Arsitektur Inti",
            filePath: "core-architecture/device-quarantine.md",
            product: "pasak-security-monitor",
            order: 3,
          },
          {
            slug: "core-architecture/models-and-database",
            title: "Model Database & Dynamic Decoupling",
            description:
              "Skema relasi database, decoupling model User, penanganan UUID/BigInt, dan koneksi database dedicated.",
            category: "Arsitektur Inti",
            filePath: "core-architecture/models-and-database.md",
            product: "pasak-security-monitor",
            order: 4,
          },
        ],
      },
      {
        title: "Modul Keamanan",
        icon: "Shield",
        slug: "security-modules",
        items: [
          {
            slug: "security-modules/stepped-login-throttling",
            title: "Stepped Login Lockout & Anti Brute-Force",
            description:
              "Pembatasan percobaan login bertingkat eksponensial (1m, 5m, 15m, 1j, 24j) untuk menghadang botnet credential stuffing.",
            category: "Modul Keamanan",
            filePath: "security-modules/stepped-login-throttling.md",
            product: "pasak-security-monitor",
            order: 1,
          },
          {
            slug: "security-modules/server-security-and-webshells",
            title: "Server Integrity & Webshell Scanner",
            description:
              "Pemindaian integritas berkas PHP, baseline SHA-256, deteksi webshell polyglot, dan karantina payload otomatis.",
            category: "Modul Keamanan",
            filePath: "security-modules/server-security-and-webshells.md",
            product: "pasak-security-monitor",
            order: 2,
          },
          {
            slug: "security-modules/appeal-tickets-system",
            title: "Sistem Tiket Banding Pembukaan Blokir",
            description:
              "Alur pengajuan banding terisolasi bagi pengunjung yang terkena blokir otomatis untuk meminta pemulihan akses.",
            category: "Modul Keamanan",
            filePath: "security-modules/appeal-tickets-system.md",
            product: "pasak-security-monitor",
            order: 3,
          },
          {
            slug: "security-modules/session-and-activity-tracking",
            title: "Pelacakan Sesi & Pengguna Realtime",
            description:
              "Audit jejak login aktif, pencatatan IP, browser fingerprinting, dan penghentian sesi mencurigakan seketika.",
            category: "Modul Keamanan",
            filePath: "security-modules/session-and-activity-tracking.md",
            product: "pasak-security-monitor",
            order: 4,
          },
          {
            slug: "security-modules/access-log-streaming",
            title: "Streaming Access Log Scanner",
            description:
              "Pemantauan log akses web server secara live streaming untuk identifikasi dini pemindaian kerentanan massal.",
            category: "Modul Keamanan",
            filePath: "security-modules/access-log-streaming.md",
            product: "pasak-security-monitor",
            order: 5,
          },
        ],
      },
      {
        title: "Referensi REST API",
        icon: "Terminal",
        slug: "api-reference",
        items: [
          {
            slug: "api-reference/api-overview",
            title: "Konvensi & Spesifikasi Headless REST API",
            description:
              "Standar respons JSON, autentikasi Bearer token, rate limiting, penanganan error, dan struktur payload.",
            category: "Referensi REST API",
            filePath: "api-reference/api-overview.md",
            product: "pasak-security-monitor",
            order: 1,
          },
          {
            slug: "api-reference/public-endpoints",
            title: "Endpoint REST API Publik",
            description:
              "API pendaftaran tiket banding, pengecekan status karantina perangkat, dan verifikasi tantangan captcha.",
            category: "Referensi REST API",
            filePath: "api-reference/public-endpoints.md",
            product: "pasak-security-monitor",
            order: 2,
          },
          {
            slug: "api-reference/user-endpoints",
            title: "Endpoint Pengguna Terautentikasi",
            description:
              "Pemeriksaan riwayat login akun, manajemen perangkat terpercaya, dan terminasi sesi aktif mandiri.",
            category: "Referensi REST API",
            filePath: "api-reference/user-endpoints.md",
            product: "pasak-security-monitor",
            order: 3,
          },
          {
            slug: "api-reference/admin-endpoints",
            title: "Endpoint Administrator REST API",
            description:
              "Manajemen daftar blokir IP, inspeksi log ancaman, persetujuan tiket banding, dan pemicu pemindaian server.",
            category: "Referensi REST API",
            filePath: "api-reference/admin-endpoints.md",
            product: "pasak-security-monitor",
            order: 4,
          },
        ],
      },
      {
        title: "CLI & Otomasi",
        icon: "Command",
        slug: "cli-automation",
        items: [
          {
            slug: "cli-automation/artisan-commands",
            title: "Referensi Perintah Artisan CLI",
            description:
              "Katalog perintah php artisan pasak:* untuk pemindaian manual, unblock IP, rotasi kunci, dan status keamanan.",
            category: "CLI & Otomasi",
            filePath: "cli-automation/artisan-commands.md",
            product: "pasak-security-monitor",
            order: 1,
          },
          {
            slug: "cli-automation/scheduled-tasks",
            title: "Tugas Terjadwal (Cron & Scheduler)",
            description:
              "Penjadwalan otomatis pembersihan log usang, rotasi tiket banding kedaluwarsa, dan pemindaian berkas berkala.",
            category: "CLI & Otomasi",
            filePath: "cli-automation/scheduled-tasks.md",
            product: "pasak-security-monitor",
            order: 2,
          },
          {
            slug: "cli-automation/upgrade-and-uninstall",
            title: "Panduan Upgrade & Uninstall",
            description:
              "Prosedur pembaruan versi minor/major, migrasi skema database baru, dan penghapusan bersih paket.",
            category: "CLI & Otomasi",
            filePath: "cli-automation/upgrade-and-uninstall.md",
            product: "pasak-security-monitor",
            order: 3,
          },
        ],
      },
      {
        title: "Hardening Web Server",
        icon: "Server",
        slug: "webserver-hardening",
        items: [
          {
            slug: "webserver-hardening/nginx-hardened-waf",
            title: "Konfigurasi Nginx Hardened WAF",
            description:
              "Snippet konfigurasi nginx.conf siap pakai untuk memblokir bot buruk, eksploitasi URL tersembunyi, dan header jahat.",
            category: "Hardening Web Server",
            filePath: "webserver-hardening/nginx-hardened-waf.md",
            product: "pasak-security-monitor",
            order: 1,
          },
          {
            slug: "webserver-hardening/apache-htaccess-hardening",
            title: "Hardening Apache Web Server (.htaccess)",
            description:
              "Aturan RewriteRule dan proteksi direktori sensitif Apache (.env, .git, vendor, uploads PHP execution).",
            category: "Hardening Web Server",
            filePath: "webserver-hardening/apache-htaccess-hardening.md",
            product: "pasak-security-monitor",
            order: 2,
          },
          {
            slug: "webserver-hardening/production-checklist",
            title: "Checklist Keamanan Produksi",
            description:
              "Daftar periksa komprehensif sebelum meluncurkan aplikasi ke lingkungan produksi publik enterprise.",
            category: "Hardening Web Server",
            filePath: "webserver-hardening/production-checklist.md",
            product: "pasak-security-monitor",
            order: 3,
          },
        ],
      },
      {
        title: "Panduan Integrasi",
        icon: "Puzzle",
        slug: "integration-guides",
        items: [
          {
            slug: "integration-guides/custom-rules-and-whitelist",
            title: "Pembuatan Aturan Kustom & Whitelist Subnet",
            description:
              "Cara menambahkan rule regex WAF spesifik aplikasi Anda dan mendaftarkan IP kantor / VPN internal.",
            category: "Panduan Integrasi",
            filePath: "integration-guides/custom-rules-and-whitelist.md",
            product: "pasak-security-monitor",
            order: 1,
          },
          {
            slug: "integration-guides/frontend-blade-livewire",
            title: "Integrasi Frontend Blade & Livewire",
            description:
              "Pemasangan komponen Blade bawaan, notifikasi peringatan lockout, dan penanganan status 403 kustom.",
            category: "Panduan Integrasi",
            filePath: "integration-guides/frontend-blade-livewire.md",
            product: "pasak-security-monitor",
            order: 2,
          },
          {
            slug: "integration-guides/frontend-react-inertia",
            title: "Integrasi Frontend React / Inertia",
            description:
              "Mengonsumsi error response pasak pada aplikasi SPA Inertia.js dan rendering modal banding interaktif.",
            category: "Panduan Integrasi",
            filePath: "integration-guides/frontend-react-inertia.md",
            product: "pasak-security-monitor",
            order: 3,
          },
          {
            slug: "integration-guides/custom-dashboard-dan-api-tanpa-ubah-vendor",
            title: "Kustomisasi Penuh Tanpa Mengubah Vendor",
            description:
              "Ekstensi controller, override route, dan kustomisasi dashboard keamanan tanpa menyentuh direktori vendor.",
            category: "Panduan Integrasi",
            filePath:
              "integration-guides/custom-dashboard-dan-api-tanpa-ubah-vendor.md",
            product: "pasak-security-monitor",
            order: 4,
          },
        ],
      },
      {
        title: "Informasi Tambahan",
        icon: "HelpCircle",
        slug: "resources",
        items: [
          {
            slug: "faq",
            title: "Pertanyaan Umum (FAQ)",
            description:
              "Jawaban atas pertanyaan seputar kompatibilitas PHP 8.2-8.5, overhead performa, dan troubleshooting.",
            category: "Informasi Tambahan",
            filePath: "faq.md",
            product: "pasak-security-monitor",
            order: 1,
          },
          {
            slug: "changelog",
            title: "Changelog Rilis",
            description:
              "Catatan riwayat rilis, pembaruan keamanan, fitur baru, dan perbaikan bug dari versi ke versi.",
            category: "Informasi Tambahan",
            filePath: "changelog.md",
            product: "pasak-security-monitor",
            order: 2,
          },
          {
            slug: "keywords",
            title: "Indeks Topik & Kata Kunci",
            description:
              "Daftar istilah keamanan siber, terminologi arsitektur, dan referensi cepat fitur pasak-security-monitor.",
            category: "Informasi Tambahan",
            filePath: "keywords.md",
            product: "pasak-security-monitor",
            order: 3,
          },
        ],
      },
    ],
  },
  "pasak-sentinel": {
    id: "pasak-sentinel",
    name: "pasak-sentinel",
    badge: "GO DAEMON",
    description:
      "Daemon Linux Host & Kernel Go 1.24, eBPF/nftables packet drops, inotify FIM, dan local socket IPC.",
    subDir: "pasak-sentinel/docs",
    categories: [
      {
        title: "Host & Kernel Defense",
        icon: "Terminal",
        slug: "sentinel-core",
        items: [
          {
            slug: "sentinel-overview",
            title: "Ringkasan & Panduan Pasak Sentinel",
            description:
              "Panduan lengkap instalasi, opsi CLI, konfigurasi sentinel.yaml, dan troubleshooting daemon.",
            category: "Host & Kernel Defense",
            filePath: "README.md",
            product: "pasak-sentinel",
            order: 0,
          },
          {
            slug: "01-architecture",
            title: "Arsitektur & Desain Runtime Daemon",
            description:
              "Arsitektur single-binary Go 1.24, footprint RAM <25MB, komunikasi egress-only, dan systemd service.",
            category: "Host & Kernel Defense",
            filePath: "01-architecture.md",
            product: "pasak-sentinel",
            order: 1,
          },
          {
            slug: "02-fim-controller",
            title: "File Integrity Monitoring (FIM) & Inotify",
            description:
              "Pemantauan integritas berkas otonom, deteksi webshell instan, dan auto-lockdown chmod 0600.",
            category: "Host & Kernel Defense",
            filePath: "02-fim-controller.md",
            product: "pasak-sentinel",
            order: 2,
          },
          {
            slug: "03-ipc-socket",
            title: "IPC Unix Domain Socket Protocol",
            description:
              "Protokol komunikasi IPC lokal antara Laravel WAF dan kernel daemon via /run/pasak/agent.sock.",
            category: "Host & Kernel Defense",
            filePath: "03-ipc-socket.md",
            product: "pasak-sentinel",
            order: 3,
          },
          {
            slug: "04-firewall-drivers",
            title: "Firewall Drivers (nftables & iptables)",
            description:
              "Penurunan paket langsung di level kernel Linux, tabel pasak_filter, dan driver nftables atomik.",
            category: "Host & Kernel Defense",
            filePath: "04-firewall-drivers.md",
            product: "pasak-sentinel",
            order: 4,
          },
          {
            slug: "05-log-watcher",
            title: "Log Watcher & Stream Parsing",
            description:
              "Pemantauan log akses Nginx dan Apache secara streaming tanpa membaca seluruh berkas ke RAM.",
            category: "Host & Kernel Defense",
            filePath: "05-log-watcher.md",
            product: "pasak-sentinel",
            order: 5,
          },
          {
            slug: "06-vhost-recon",
            title: "VHost & SSL Reconnaissance",
            description:
              "Deteksi otomatis virtual host Nginx/Apache, konfigurasi root direktori, dan pelacak kedaluwarsa SSL.",
            category: "Host & Kernel Defense",
            filePath: "06-vhost-recon.md",
            product: "pasak-sentinel",
            order: 6,
          },
          {
            slug: "07-cloud-telemetry",
            title: "Sinkronisasi Telemetri & Cloud Control Plane",
            description:
              "Heartbeat berkala ke pasak-api, mTLS TLS 1.3, dan pengunduhan daftar blokir global.",
            category: "Host & Kernel Defense",
            filePath: "07-cloud-telemetry.md",
            product: "pasak-sentinel",
            order: 7,
          },
          {
            slug: "08-ai-agent-vps-runbook",
            title: "AI Agent VPS Runbook & Prompting Guide",
            description:
              "Panduan instruksi prompt mandiri bagi AI Agent di VPS Linux untuk audit, instalasi, dan penghubungan otomatis Pasak Suite.",
            category: "Host & Kernel Defense",
            filePath: "08-ai-agent-vps-runbook.md",
            product: "pasak-sentinel",
            order: 8,
          },
          {
            slug: "09-installation-guide",
            title: "Panduan Lengkap Instalasi & Deployment",
            description:
              "Langkah-langkah instalasi cepat satu baris (one-line installer), manual systemd, konfigurasi sentinel.yaml, dan integrasi Laravel WAF.",
            category: "Host & Kernel Defense",
            filePath: "09-installation-guide.md",
            product: "pasak-sentinel",
            order: 9,
          },
        ],
      },
    ],
  },
}

export const ALL_DOCS: DocItem[] = Object.values(PRODUCTS_CONFIG).flatMap((p) =>
  p.categories.flatMap((c) => c.items)
)

export const DOCS_MANIFEST: DocCategory[] =
  PRODUCTS_CONFIG["pasak-security-monitor"].categories

export function getProductConfig(productId?: string): ProductConfig {
  if (productId && PRODUCTS_CONFIG[productId]) {
    return PRODUCTS_CONFIG[productId]
  }
  return PRODUCTS_CONFIG["pasak-security-monitor"]
}

export function findDocBySlug(slug: string): DocItem | undefined {
  const normalized = slug.replace(/^\/docs\/?/, "").replace(/\/$/, "")

  // Check direct match
  const directMatch = ALL_DOCS.find((d) => d.slug === normalized)
  if (directMatch) return directMatch

  // Check product-prefixed slug e.g. pasak-security-monitor/getting-started/introduction
  for (const [prodKey, prod] of Object.entries(PRODUCTS_CONFIG)) {
    if (normalized.startsWith(prodKey + "/")) {
      const subSlug = normalized.slice(prodKey.length + 1)
      const subMatch = prod.categories
        .flatMap((c) => c.items)
        .find((d) => d.slug === subSlug)
      if (subMatch) return subMatch
    }
  }

  // Fallback match by last path segment
  const lastPart = normalized.split("/").pop()
  if (lastPart) {
    const endMatch = ALL_DOCS.find((d) => d.slug.endsWith(lastPart))
    if (endMatch) return endMatch
  }

  return undefined
}

export function getDocNavigation(currentSlug: string): {
  prev: DocItem | null
  next: DocItem | null
} {
  const doc = findDocBySlug(currentSlug)
  if (!doc) return { prev: null, next: null }

  const product = PRODUCTS_CONFIG[doc.product]
  const productDocs = product.categories.flatMap((c) => c.items)
  const index = productDocs.findIndex((d) => d.slug === doc.slug)

  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? productDocs[index - 1] : null,
    next: index < productDocs.length - 1 ? productDocs[index + 1] : null,
  }
}

export function isProductSlug(slug: string): boolean {
  const normalized = slug.replace(/^\/docs\/?/, '').replace(/\/$/, '')
  return !!PRODUCTS_CONFIG[normalized]
}

export function getDocSectionsForProduct(productKey: string): DocCategory[] {
  if (PRODUCTS_CONFIG[productKey]) {
    return PRODUCTS_CONFIG[productKey].categories
  }
  return []
}
