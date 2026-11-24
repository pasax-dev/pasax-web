// Pasax In-Memory and Local File Store for Telemetry, Threats, License Keys & Business Tiers
import fs from "fs"
import path from "path"

export interface VHostInfo {
  domain: string
  ssl_status: "valid" | "expiring_soon" | "expired" | "none"
  ssl_expires_at?: number
  upstream?: string
  root?: string
}

export interface WebserverStatus {
  installed: boolean
  running: boolean
  version: string | null
  vhosts: VHostInfo[]
}

export interface NodeTelemetry {
  node_id: string
  project_id?: string
  hostname: string
  ip_v4: string
  os: string
  uptime_seconds: number
  memory_used_percent: number
  cpu_used_percent: number
  disk_used_percent?: number
  last_seen: number
  status: "ONLINE" | "TAMPERED" | "OFFLINE"
  assignedUserIds?: string[]
  ssh_port?: number
  description?: string
  tags?: string[]
  createdAt?: number
  webservers: {
    nginx?: WebserverStatus
    apache2?: WebserverStatus
  }
}

export interface ThreatEvent {
  id: string
  node_id: string
  project_id?: string
  event_type: "FIM_MODIFICATION" | "WAF_INSTANT_BLOCK" | "LOG_VIOLATION" | "HONEYPOT_TRIGGER" | "PORT_SCAN" | string
  severity: "CRITICAL" | "HIGH" | "WARNING" | "INFO"
  details: {
    file_path?: string
    action?: string
    hash_before?: string
    hash_after?: string
    trigger_user?: string
    mitigation_action_taken?: string
    attacker_ip?: string
    attack_pattern?: string
    url?: string
    [key: string]: any
  }
  timestamp: number
}

// -------------------------------------------------------------
// BUSINESS MODEL & MULTI-TENANT TYPES
// -------------------------------------------------------------


export interface PricingPlan {
  id: string
  name: string
  slug: string
  category: "standard" | "agency" | "enterprise_gov" | string
  badge?: string
  description: string
  targetAudience?: string
  vpsQuota: number
  appsPerVps: string
  priceMonthlyIdr: number
  priceYearlyIdr: number
  priceMonthlyUsd: number
  priceYearlyUsd: number
  discountMonthlyPercent?: number
  discountYearlyPercent?: number
  isFirstPurchaseOnly?: boolean
  promoTag?: string
  features: string[]
  highlightFeatures?: string[]
  logRetentionDays: number
  maxSeats: number
  crowdDefenseSync: string
  supportSla: string
  complianceCert?: string
  isCustomQuote: boolean
  isActive: boolean
  sortOrder: number
}

export interface SubscriptionTier {
  id: "free" | "pro" | "enterprise"
  name: string
  tagline: string
  priceIdr: number
  priceYearlyIdr: number
  serverQuota: number
  appQuota: number // -1 = unlimited
  features: string[]
  recommended?: boolean
  retentionDays: number
  fimEnabled: boolean
  kernelFirewallEnabled: boolean
}

export interface ManagedUser {
  id: string
  name: string
  email: string
  role: "Superadmin" | "Admin" | "User" | "Support" | "Teknis" | "Programmer" | "DevOps"
  plan: "free" | "pro" | "enterprise"
  serverQuota: number
  isActive: boolean
  createdAt: number
  phone?: string
  organization?: string
  assignedNodeIds?: string[]
  createdBy?: string
}

export interface ManagedLicenseKey {
  id: string
  userId: string
  userEmail: string
  userName: string
  key: string // Format: psk_live_...
  name: string
  isActive: boolean
  createdAt: number
  connectedNodesCount: number
  connectedAppsCount: number
  lastUsedAt?: number
  isTrial?: boolean
  trialEndsAt?: number
  subscriptionStatus?: "trialing" | "active" | "expired" | "cancelled"
  isExpired?: boolean
  remainingDays?: number
}

export interface ConnectedApp {
  id: string
  userId: string
  licenseKey: string
  appName: string // e.g. "Laravel"
  appUrl: string // e.g. "http://localhost:8000"
  nodeId?: string
  ip: string
  environment: "production" | "staging" | "local"
  wafVersion: string
  status: "PROTECTED" | "WARNING" | "OFFLINE"
  threatsBlocked: number
  lastHeartbeat: number
}

export const SUBSCRIPTION_PLANS: SubscriptionTier[] = [
  {
    id: "pro",
    name: "Pro Fleet SOC",
    tagline: "Proteksi pertahanan militer Linux Kernel untuk armada production (Trial 14 Hari Gratis)",
    priceIdr: 149000,
    priceYearlyIdr: 1490000,
    serverQuota: 10,
    appQuota: -1, // Unlimited
    recommended: true,
    retentionDays: 30,
    fimEnabled: true,
    kernelFirewallEnabled: true,
    features: [
      "Masa Percobaan Pro 14 Hari Penuh (Free Trial)",
      "Hingga 10 VPS Nodes (Sentinel Daemon)",
      "Unlimited Aplikasi Web (1 License Key Multi-App)",
      "Linux Kernel Firewall (nftables drop < 0.2ms)",
      "Real-time FIM (File Integrity Monitoring)",
      "Auto Recon Nginx & Apache2 Virtual Hosts",
      "Sinkronisasi Crowd Defense Global Blocklist",
      "30 Hari Retensi Log & Forensik Lengkap",
      "Dukungan Teknis Prioritas via Telegram/Email",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Sovereign",
    tagline: "Solusi kedaulatan data & pertahanan cyber instansi pemerintah & perbankan",
    priceIdr: 990000,
    priceYearlyIdr: 9900000,
    serverQuota: 100,
    appQuota: -1,
    retentionDays: 365,
    fimEnabled: true,
    kernelFirewallEnabled: true,
    features: [
      "100+ VPS Nodes (Custom Enterprise Cluster)",
      "Unlimited Aplikasi Web & Multi-Cluster Support",
      "Kernel Firewall + Custom Signatures Injection",
      "FIM Otomatis Auto-Revert File Sensitif (.env / php)",
      "Dedicated SOC Analyst & On-Call Emergency",
      "365 Hari Retensi Log Compliance & Audit Trail",
      "SLA Garansi Uptime 99.99%",
      "Private On-Premise Cloud Controller Ready",
    ],
  },
]

// Global in-memory cache shared across API routes in Next.js server instance
interface GlobalPasaxStore {
  nodes: Map<string, NodeTelemetry>
  threats: ThreatEvent[]
  globalBlocklist: Set<string>
  users: Map<string, ManagedUser>
  licenseKeys: Map<string, ManagedLicenseKey>
  connectedApps: Map<string, ConnectedApp>
  pricingPlans: Map<string, PricingPlan>
  initialized: boolean
}

const globalStore: GlobalPasaxStore = (globalThis as any).__PASAX_STORE__ || {
  nodes: new Map(),
  threats: [],
  globalBlocklist: new Set([
    "198.51.100.42",
    "203.0.113.88",
    "45.134.20.19",
    "185.196.220.14",
    "194.26.29.112",
  ]),
  users: new Map(),
  licenseKeys: new Map(),
  connectedApps: new Map(),
  pricingPlans: new Map(),
  initialized: false,
}

if (!(globalThis as any).__PASAX_STORE__) {
  (globalThis as any).__PASAX_STORE__ = globalStore
}

// Initial seed data so the dashboard is immediately vivid and interactive
function ensureInitialized() {
  if (globalStore.initialized) return

  const now = Math.floor(Date.now() / 1000)

  
  // 0. Seed Pricing Plans (2 Tiers Only: Pro with 14-Day Free Trial, and Enterprise)
  if (globalStore.pricingPlans.size === 0) {
    const defaultPlans: PricingPlan[] = [
      {
        id: "pro",
        name: "Pro Fleet SOC",
        slug: "pro",
        category: "agency",
        badge: "14 HARI TRIAL PRO GRATIS",
        description: "Solusi lengkap armada server produksi. Mulai dengan 14 hari masa percobaan Pro penuh gratis tanpa kartu kredit.",
        targetAudience: "Developer, Agency & Startup",
        vpsQuota: 5,
        appsPerVps: "Unlimited",
        priceMonthlyIdr: 149000,
        priceYearlyIdr: 1490000,
        priceMonthlyUsd: 12,
        priceYearlyUsd: 119,
        features: [
          "Termasuk 14 Hari Masa Percobaan Pro Penuh (Free Trial)",
          "Hingga 5 Server VPS Terhubung (Sentinel Mesh)",
          "Unlimited Aplikasi Laravel di SELURUH 5 VPS",
          "Cross-VPS Defense: 1 server diserang, seluruh server kebal!",
          "Real-time WAF & Forensic Attack Payload Stream",
          "Kernel Firewall Drop Instan (< 0.2ms via nftables)",
          "Proteksi Spesifik Laravel (RCE, .env probe, Debug Mode)",
          "Multi-User Team (Hingga 5 Anggota Tim)",
          "Notifikasi Instan Telegram, Discord, Slack, & Webhook",
          "Retensi Log Forensik: 30 Hari",
          "Sinkronisasi Crowd Defense Real-time",
          "Dukungan Prioritas Email & Chat (SLA 12 Jam)",
        ],
        highlightFeatures: ["14 Hari Trial Pro Gratis", "5 VPS (Unlimited Laravel Apps)", "Cross-VPS Auto Immunity"],
        logRetentionDays: 30,
        maxSeats: 5,
        crowdDefenseSync: "realtime",
        supportSla: "Priority Chat 12 Jam",
        complianceCert: "Security Hardened",
        isCustomQuote: false,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "enterprise",
        name: "Enterprise & Gov",
        slug: "enterprise",
        category: "enterprise_gov",
        badge: "GOVERNMENT READY",
        description: "Kepatuhan penuh BSSN, UU PDP, kedaulatan data, dan opsi On-Premise / Air-Gapped di Data Center Instansi.",
        targetAudience: "Kementerian, BUMN, Pemda & Korporasi",
        vpsQuota: 50,
        appsPerVps: "Unlimited",
        priceMonthlyIdr: 2500000,
        priceYearlyIdr: 27000000,
        priceMonthlyUsd: 189,
        priceYearlyUsd: 1999,
        features: [
          "Kapasitas 25 - 50+ Node Server / VM Instansi",
          "Unlimited Aplikasi Laravel di Seluruh Infrastruktur",
          "Anti-Deface & Proteksi Injeksi Judi Online (Webshell/Storage FIM)",
          "Sesuai Standar CSIRT BSSN & ISO 27001",
          "Kepatuhan UU PDP (Lokasi Penyimpanan Data di Indonesia)",
          "Opsi On-Premise / Air-Gapped (Pusat Data Nasional / Private Cloud)",
          "Retensi Log Forensik 1 Tahun Penuh (365 Hari - Audit Trail)",
          "Dokumen Pengadaan Resmi: SPK, BAST, Faktur Pajak PPN 11%",
          "SLA Respons Darurat 1 Jam & Dedicated Security Engineer",
        ],
        highlightFeatures: ["Kepatuhan BSSN & UU PDP", "Anti-Deface & Judi Online", "Opsi On-Premise / Air-Gapped"],
        logRetentionDays: 365,
        maxSeats: 100,
        crowdDefenseSync: "realtime",
        supportSla: "Dedicated SLA 1 Jam",
        complianceCert: "CSIRT BSSN & ISO 27001 Ready",
        isCustomQuote: true,
        isActive: true,
        sortOrder: 2,
      },
    ]
    for (const p of defaultPlans) {
      globalStore.pricingPlans.set(p.id, p)
    }
  }

  // 1. Seed Users
  const user1: ManagedUser = {
    id: "usr_superadmin",
    name: "Roby Kartis (Chief SOC)",
    email: "pasak.dev@gmail.com",
    role: "Superadmin",
    plan: "enterprise",
    serverQuota: 100,
    isActive: true,
    createdAt: now - 90 * 86400,
    organization: "Pasax Cyber Defense Group",
    phone: "+62 812-3456-7890",
    assignedNodeIds: ["nd_01HW8P9Y124XQW7V6B9R41ZX9A", "nd_03LM0C2D345ZUS9E8F1T63AA1C"],
  }
  const user2: ManagedUser = {
    id: "usr_admin",
    name: "Fleet SecOps Admin",
    email: "robyfull.dev@gmail.com",
    role: "Admin",
    plan: "pro",
    serverQuota: 10,
    isActive: true,
    createdAt: now - 60 * 86400,
    organization: "Pasax SOC Operations",
    phone: "+62 821-9876-5432",
    assignedNodeIds: ["nd_01HW8P9Y124XQW7V6B9R41ZX9A", "nd_02JK9A1B234YTR8C7D0S52ZY0B", "nd_03LM0C2D345ZUS9E8F1T63AA1C"],
  }
  const user3: ManagedUser = {
    id: "usr_client_kominfo",
    name: "Pengelola Layanan Publik",
    email: "user@pasax.id",
    role: "Admin",
    plan: "pro",
    serverQuota: 10,
    isActive: true,
    createdAt: now - 30 * 86400,
    organization: "Diskominfo / Tenant Layanan",
    phone: "+62 856-1122-3344",
    assignedNodeIds: ["nd_01HW8P9Y124XQW7V6B9R41ZX9A", "nd_02JK9A1B234YTR8C7D0S52ZY0B"],
  }
  const user4: ManagedUser = {
    id: "usr_dev_startup",
    name: "Indra Developer",
    email: "indra@startup.id",
    role: "Admin",
    plan: "pro",
    serverQuota: 5,
    isActive: true,
    createdAt: now - 18 * 86400,
    organization: "Fintech Sandbox",
    phone: "+62 878-5566-7788",
    assignedNodeIds: ["nd_02JK9A1B234YTR8C7D0S52ZY0B"],
  }

  const userProgrammer: ManagedUser = {
    id: "usr_prog_team",
    name: "Budi Pratama (Programmer L7)",
    email: "programmer@pasax.id",
    role: "Programmer",
    plan: "pro",
    serverQuota: 5,
    isActive: true,
    createdAt: now - 12 * 86400,
    organization: "Dev App Team",
    phone: "+62 813-2233-4455",
    assignedNodeIds: ["nd_01HW8P9Y124XQW7V6B9R41ZX9A"],
  }
  const userDevOps: ManagedUser = {
    id: "usr_devops_team",
    name: "Ahmad Fauzi (Server Maintainer / DevOps)",
    email: "devops@pasax.id",
    role: "DevOps",
    plan: "pro",
    serverQuota: 5,
    isActive: true,
    createdAt: now - 10 * 86400,
    organization: "Infrastructure & Cloud Ops",
    phone: "+62 818-7788-9900",
    assignedNodeIds: ["nd_01HW8P9Y124XQW7V6B9R41ZX9A", "nd_02JK9A1B234YTR8C7D0S52ZY0B"],
  }

  globalStore.users.set(user1.id, user1)
  globalStore.users.set(user2.id, user2)
  globalStore.users.set(user3.id, user3)
  globalStore.users.set(user4.id, user4)
  globalStore.users.set(userProgrammer.id, userProgrammer)
  globalStore.users.set(userDevOps.id, userDevOps)

  // Dedicated VirtualBox VPS Environment Accounts
  const userVBoxAdmin: ManagedUser = {
    id: "usr_vbox_admin",
    name: "VirtualBox VPS Admin (Armada)",
    email: "admin@virtualbox.com",
    role: "Admin",
    plan: "pro",
    serverQuota: 5,
    isActive: true,
    createdAt: now - 5 * 86400,
    organization: "VirtualBox Lab Infrastructure",
    phone: "+62 811-2233-4455",
    assignedNodeIds: ["nod_69be496c5f1b"],
  }
  const userVBoxProgrammer: ManagedUser = {
    id: "usr_vbox_programmer",
    name: "Budi Pratama (Programmer L7)",
    email: "programmer@virtualbox.com",
    role: "Programmer",
    plan: "pro",
    serverQuota: 2,
    isActive: true,
    createdAt: now - 3 * 86400,
    organization: "VirtualBox Lab - Dev Team",
    phone: "+62 812-9988-7766",
    assignedNodeIds: ["nod_69be496c5f1b"],
    createdBy: "admin@virtualbox.com",
  }
  const userVBoxMaintainer: ManagedUser = {
    id: "usr_vbox_maintainer",
    name: "Ahmad Fauzi (Server Maintainer / DevOps)",
    email: "maintainer@virtualbox.com",
    role: "DevOps",
    plan: "pro",
    serverQuota: 2,
    isActive: true,
    createdAt: now - 3 * 86400,
    organization: "VirtualBox Lab - Infra Team",
    phone: "+62 813-5544-3322",
    assignedNodeIds: ["nod_69be496c5f1b"],
    createdBy: "admin@virtualbox.com",
  }

  globalStore.users.set(userVBoxAdmin.id, userVBoxAdmin)
  globalStore.users.set(userVBoxProgrammer.id, userVBoxProgrammer)
  globalStore.users.set(userVBoxMaintainer.id, userVBoxMaintainer)

  // 2. Seed License Keys (Multi-App, Multi-Node Supported)
  const keyTenant: ManagedLicenseKey = {
    id: "lic_tenant_pro_01",
    userId: user3.id,
    userEmail: user3.email,
    userName: user3.name,
    key: "psk_live_f90c11e5c1125deebae571815a01384c",
    name: "Production Multi-App & Sentinel Token",
    isActive: true,
    createdAt: now - 3 * 86400,
    connectedNodesCount: 2,
    connectedAppsCount: 2,
    lastUsedAt: now - 120,
    isTrial: true,
    trialEndsAt: now + 11 * 86400,
    subscriptionStatus: "trialing",
  }

  const keyAdmin: ManagedLicenseKey = {
    id: "lic_admin_ent_01",
    userId: user1.id,
    userEmail: user1.email,
    userName: user1.name,
    key: "psk_live_a1b2c3d4e5f6789012345678abcdef01",
    name: "Global Master Fleet Key",
    isActive: true,
    createdAt: now - 85 * 86400,
    connectedNodesCount: 1,
    connectedAppsCount: 3,
    lastUsedAt: now - 45,
    isTrial: false,
    subscriptionStatus: "active",
  }

  globalStore.licenseKeys.set(keyTenant.id, keyTenant)
  globalStore.licenseKeys.set(keyAdmin.id, keyAdmin)

  // 3. Seed Connected Web Apps (e.g. Laravel with APP_NAME & APP_URL)
  const app1: ConnectedApp = {
    id: "app_laravel_local",
    userId: user3.id,
    licenseKey: keyTenant.key,
    appName: "Laravel",
    appUrl: "http://localhost:8000",
    nodeId: "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
    ip: "127.0.0.1",
    environment: "local",
    wafVersion: "v1.2.0",
    status: "PROTECTED",
    threatsBlocked: 42,
    lastHeartbeat: now - 35,
  }

  const app2: ConnectedApp = {
    id: "app_layanan_publik",
    userId: user3.id,
    licenseKey: keyTenant.key,
    appName: "Layanan Publik Daerah",
    appUrl: "https://layanan.kominfo.go.id",
    nodeId: "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
    ip: "203.0.113.195",
    environment: "production",
    wafVersion: "v1.2.0",
    status: "PROTECTED",
    threatsBlocked: 318,
    lastHeartbeat: now - 18,
  }

  const app3: ConnectedApp = {
    id: "app_master_portal",
    userId: user1.id,
    licenseKey: keyAdmin.key,
    appName: "Pasax SOC Master Portal",
    appUrl: "https://pasax.web.id",
    nodeId: "nd_02JK9A1B234YTR8C7D0S52ZY0B",
    ip: "198.51.100.77",
    environment: "production",
    wafVersion: "v1.2.0",
    status: "PROTECTED",
    threatsBlocked: 1042,
    lastHeartbeat: now - 10,
  }

  globalStore.connectedApps.set(app1.id, app1)
  globalStore.connectedApps.set(app2.id, app2)
  globalStore.connectedApps.set(app3.id, app3)

  // 4. Seed default Sentinel nodes (Multi-User assigned per VPS)
  globalStore.nodes.set("nd_01HW8P9Y124XQW7V6B9R41ZX9A", {
    node_id: "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
    project_id: user3.id,
    hostname: "prod-vps-sg01",
    ip_v4: "203.0.113.195",
    os: "Ubuntu 24.04 LTS (Noble)",
    uptime_seconds: 1209600,
    memory_used_percent: 42.8,
    cpu_used_percent: 18.4,
    disk_used_percent: 54.2,
    last_seen: now - 15,
    status: "ONLINE",
    assignedUserIds: [user1.id, user2.id, user3.id],
    ssh_port: 22,
    description: "Kluster Utama Edge-WAF SG-01 Singapore",
    tags: ["Production", "Singapore", "Edge-WAF"],
    createdAt: now - 45 * 86400,
    webservers: {
      nginx: {
        installed: true,
        running: true,
        version: "1.24.0",
        vhosts: [
          {
            domain: "app.pasax.web.id",
            ssl_status: "valid",
            ssl_expires_at: now + 72 * 86400,
            upstream: "127.0.0.1:9000",
            root: "/var/www/pasax-app/public",
          },
          {
            domain: "layanan.kominfo.go.id",
            ssl_status: "valid",
            ssl_expires_at: now + 45 * 86400,
            upstream: "127.0.0.1:8000",
            root: "/var/www/layanan/public",
          },
        ],
      },
      apache2: {
        installed: false,
        running: false,
        version: null,
        vhosts: [],
      },
    },
  })

  globalStore.nodes.set("nd_02JK9A1B234YTR8C7D0S52ZY0B", {
    node_id: "nd_02JK9A1B234YTR8C7D0S52ZY0B",
    project_id: user3.id,
    hostname: "staging-app-us01",
    ip_v4: "198.51.100.77",
    os: "Debian 12 (Bookworm)",
    uptime_seconds: 432000,
    memory_used_percent: 68.2,
    cpu_used_percent: 34.7,
    disk_used_percent: 62.1,
    last_seen: now - 30,
    status: "ONLINE",
    assignedUserIds: [user2.id, user3.id, user4.id],
    ssh_port: 2222,
    description: "Kluster Pengujian & Staging Mesh US-East",
    tags: ["Staging", "US-East", "Testing"],
    createdAt: now - 25 * 86400,
    webservers: {
      nginx: {
        installed: true,
        running: true,
        version: "1.22.1",
        vhosts: [
          {
            domain: "staging.clientportal.id",
            ssl_status: "expiring_soon",
            ssl_expires_at: now + 4 * 86400,
            upstream: "127.0.0.1:8000",
            root: "/var/www/portal/public",
          },
        ],
      },
    },
  })

  globalStore.nodes.set("nod_69be496c5f1b", {
    node_id: "nod_69be496c5f1b",
    project_id: "usr_vbox_admin",
    hostname: "vbox-ubuntu-vps",
    ip_v4: "10.0.2.15",
    os: "Ubuntu 26.04.1 LTS (x86_64)",
    uptime_seconds: 86400,
    memory_used_percent: 36.4,
    cpu_used_percent: 12.8,
    disk_used_percent: 45.0,
    last_seen: now - 10,
    status: "ONLINE",
    assignedUserIds: ["usr_superadmin", "usr_admin", "usr_vbox_admin", "usr_vbox_programmer", "usr_vbox_maintainer"],
    ssh_port: 2222,
    description: "VirtualBox Lab VM Target - Ubuntu 26.04 LTS (Laravel 13 CRUD & Sentinel)",
    tags: ["VirtualBox", "Lab-VPS", "Ubuntu-26.04", "Production-Test"],
    createdAt: now - 2 * 86400,
    webservers: {
      nginx: {
        installed: true,
        running: true,
        version: "1.28.3",
        vhosts: [
          {
            domain: "127.0.0.1:8088 / products",
            ssl_status: "valid",
            ssl_expires_at: now + 90 * 86400,
            upstream: "unix:/run/php/php8.5-fpm.sock",
            root: "/var/www/pasax-app/public",
          },
        ],
      },
      apache2: {
        installed: false,
        running: false,
        version: null,
        vhosts: [],
      },
    },
  })

  globalStore.nodes.set("nd_03LM0C2D345ZUS9E8F1T63AA1C", {
    node_id: "nd_03LM0C2D345ZUS9E8F1T63AA1C",
    project_id: user1.id,
    hostname: "backup-vps-id02",
    ip_v4: "103.147.33.12",
    os: "Ubuntu 22.04.4 LTS",
    uptime_seconds: 2840000,
    memory_used_percent: 29.1,
    cpu_used_percent: 8.9,
    disk_used_percent: 35.8,
    last_seen: now - 45,
    status: "ONLINE",
    assignedUserIds: [user1.id, user2.id],
    ssh_port: 22,
    description: "Node Cadangan & Disaster Recovery Jakarta",
    tags: ["Disaster-Recovery", "Jakarta", "Backup"],
    createdAt: now - 15 * 86400,
    webservers: {
      nginx: {
        installed: true,
        running: true,
        version: "1.18.0",
        vhosts: [
          {
            domain: "internal.kominfo.gov.id.sandbox",
            ssl_status: "valid",
            ssl_expires_at: now + 120 * 86400,
            upstream: "unix:/run/php/php8.3-fpm.sock",
            root: "/var/www/html",
          },
        ],
      },
    },
  })

  // 5. Seed default threat events
  globalStore.threats.push(
    {
      id: "thr_901a1c",
      node_id: "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
      project_id: user3.id,
      event_type: "FIM_MODIFICATION",
      severity: "CRITICAL",
      details: {
        file_path: "/var/www/pasax-app/.env",
        action: "FILE_MODIFIED",
        hash_before: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        hash_after: "c983a453fb082163b8d5a1b3beab3d27443198031d279e8c0e66b447881c668b",
        trigger_user: "www-data (PID 4821)",
        mitigation_action_taken: "PERMISSIONS_LOCKED_0600 & CIPHER_ALERT_SENT",
      },
      timestamp: now - 180,
    },
    {
      id: "thr_802b2d",
      node_id: "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
      project_id: user3.id,
      event_type: "WAF_INSTANT_BLOCK",
      severity: "HIGH",
      details: {
        attacker_ip: "198.51.100.42",
        attack_pattern: "SQL Injection Probe (' UNION SELECT schema_name FROM information_schema...)",
        url: "/api/v1/users?search=%27+UNION+SELECT...",
        mitigation_action_taken: "KERNEL_FIREWALL_NFTABLES_DROP_ADDED",
      },
      timestamp: now - 720,
    },
    {
      id: "thr_703c3e",
      node_id: "nd_02JK9A1B234YTR8C7D0S52ZY0B",
      project_id: user3.id,
      event_type: "LOG_VIOLATION",
      severity: "HIGH",
      details: {
        attacker_ip: "45.134.20.19",
        attack_pattern: "Path Traversal & Shell Upload Probe (GET /wp-includes/wlwmanifest.xml / ../../../etc/passwd)",
        url: "/../../etc/passwd",
        mitigation_action_taken: "IP_BANNED_24_HOURS",
      },
      timestamp: now - 1440,
    },
    {
      id: "thr_604d4f",
      node_id: "nd_03LM0C2D345ZUS9E8F1T63AA1C",
      project_id: user1.id,
      event_type: "HONEYPOT_TRIGGER",
      severity: "WARNING",
      details: {
        attacker_ip: "185.196.220.14",
        attack_pattern: "Decoy Admin Login Probe (/pasax-secret-admin)",
        url: "/pasax-secret-admin/login.php",
        mitigation_action_taken: "DECOY_CAPTURED_IP_FLAGGED",
      },
      timestamp: now - 3600,
    }
  )

  globalStore.initialized = true
}

export const pasaxStore = {
  // --- NODES (VPS FLEET CRUD & MULTI-USER ASSIGNMENT) ---
  getNodes(): NodeTelemetry[] {
    ensureInitialized()
    return Array.from(globalStore.nodes.values()).sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    )
  },

  getNode(nodeId: string): NodeTelemetry | undefined {
    ensureInitialized()
    return globalStore.nodes.get(nodeId)
  },

  createNode(payload: {
    hostname: string
    ip_v4: string
    os?: string
    ssh_port?: number
    description?: string
    tags?: string[]
    assignedUserIds?: string[]
    status?: "ONLINE" | "TAMPERED" | "OFFLINE"
  }): NodeTelemetry {
    ensureInitialized()
    const now = Math.floor(Date.now() / 1000)
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
    const nodeId = "nd_" + Date.now().toString(36).toUpperCase() + rand
    const userIds = payload.assignedUserIds || []

    const newNode: NodeTelemetry = {
      node_id: nodeId,
      project_id: userIds[0] || "prj_default",
      hostname: payload.hostname.trim(),
      ip_v4: payload.ip_v4.trim(),
      os: payload.os || "Ubuntu 24.04 LTS (Noble)",
      uptime_seconds: 3600,
      memory_used_percent: 24.5,
      cpu_used_percent: 5.2,
      disk_used_percent: 20.0,
      last_seen: now,
      status: payload.status || "ONLINE",
      assignedUserIds: userIds,
      ssh_port: payload.ssh_port || 22,
      description: payload.description || "",
      tags: payload.tags || ["Production"],
      createdAt: now,
      webservers: {
        nginx: { installed: true, running: true, version: "1.24.0", vhosts: [] },
        apache2: { installed: false, running: false, version: null, vhosts: [] },
      },
    }

    globalStore.nodes.set(nodeId, newNode)

    // Sync to assigned users
    for (const uid of userIds) {
      const u = globalStore.users.get(uid)
      if (u) {
        if (!u.assignedNodeIds) u.assignedNodeIds = []
        if (!u.assignedNodeIds.includes(nodeId)) {
          u.assignedNodeIds.push(nodeId)
        }
      }
    }

    return newNode
  },

  updateNode(nodeId: string, updates: Partial<NodeTelemetry>): NodeTelemetry | null {
    ensureInitialized()
    const node = globalStore.nodes.get(nodeId)
    if (!node) return null

    if (updates.assignedUserIds !== undefined) {
      const newUserIds = updates.assignedUserIds
      const oldUserIds = node.assignedUserIds || []

      // Unassign from users removed
      for (const oldUid of oldUserIds) {
        if (!newUserIds.includes(oldUid)) {
          const u = globalStore.users.get(oldUid)
          if (u && u.assignedNodeIds) {
            u.assignedNodeIds = u.assignedNodeIds.filter((id) => id !== nodeId)
          }
        }
      }

      // Assign to users added
      for (const newUid of newUserIds) {
        const u = globalStore.users.get(newUid)
        if (u) {
          if (!u.assignedNodeIds) u.assignedNodeIds = []
          if (!u.assignedNodeIds.includes(nodeId)) {
            u.assignedNodeIds.push(nodeId)
          }
        }
      }
    }

    const updated = { ...node, ...updates }
    globalStore.nodes.set(nodeId, updated)
    return updated
  },

  deleteNode(nodeId: string): boolean {
    ensureInitialized()
    const node = globalStore.nodes.get(nodeId)
    if (!node) return false

    // Unassign node from all users
    for (const u of globalStore.users.values()) {
      if (u.assignedNodeIds) {
        u.assignedNodeIds = u.assignedNodeIds.filter((id) => id !== nodeId)
      }
    }

    return globalStore.nodes.delete(nodeId)
  },

  assignUsersToNode(nodeId: string, userIds: string[]): NodeTelemetry | null {
    return this.updateNode(nodeId, { assignedUserIds: userIds })
  },

  assignNodesToUser(userId: string, nodeIds: string[]): ManagedUser | null {
    return this.updateUser(userId, { assignedNodeIds: nodeIds })
  },

  upsertTelemetry(payload: {
    node_id: string
    project_id?: string
    timestamp?: number
    system?: any
    webservers?: any
  }): NodeTelemetry {
    ensureInitialized()
    const nodeId = payload.node_id || "nd_" + Math.random().toString(36).substring(2, 10)
    const existing = globalStore.nodes.get(nodeId)

    const sys = payload.system || {}
    const webservers = payload.webservers || {}

    const updated: NodeTelemetry = {
      node_id: nodeId,
      project_id: payload.project_id || existing?.project_id || "prj_default",
      hostname: sys.hostname || existing?.hostname || "vps-host-" + nodeId.slice(-4),
      ip_v4: sys.ip_v4 || existing?.ip_v4 || "127.0.0.1",
      os: sys.os || existing?.os || "Linux",
      uptime_seconds: sys.uptime_seconds ?? existing?.uptime_seconds ?? 3600,
      memory_used_percent: sys.memory_used_percent ?? existing?.memory_used_percent ?? 50,
      cpu_used_percent: sys.cpu_used_percent ?? existing?.cpu_used_percent ?? 10,
      last_seen: payload.timestamp || Math.floor(Date.now() / 1000),
      status: "ONLINE",
      webservers: {
        nginx: webservers.nginx || existing?.webservers?.nginx,
        apache2: webservers.apache2 || existing?.webservers?.apache2,
      },
    }

    globalStore.nodes.set(nodeId, updated)
    return updated
  },

  // --- THREATS ---
  getThreats(limit = 50): ThreatEvent[] {
    ensureInitialized()
    return [...globalStore.threats].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
  },

  addThreat(event: Omit<ThreatEvent, "id">): ThreatEvent {
    ensureInitialized()
    const newEvent: ThreatEvent = {
      ...event,
      id: "thr_" + Math.random().toString(36).substring(2, 9),
      timestamp: event.timestamp || Math.floor(Date.now() / 1000),
    }
    globalStore.threats.unshift(newEvent)
    if (globalStore.threats.length > 500) {
      globalStore.threats.pop()
    }

    // Auto-add attacker IP to blocklist if critical or high
    if (newEvent.details?.attacker_ip && (newEvent.severity === "CRITICAL" || newEvent.severity === "HIGH")) {
      globalStore.globalBlocklist.add(newEvent.details.attacker_ip)
    }

    return newEvent
  },

  // --- BLOCKLIST ---
  getBlocklist(): string[] {
    ensureInitialized()
    return Array.from(globalStore.globalBlocklist)
  },

  addToBlocklist(ip: string): void {
    ensureInitialized()
    if (ip && ip.trim()) {
      globalStore.globalBlocklist.add(ip.trim())
    }
  },

  removeFromBlocklist(ip: string): void {
    ensureInitialized()
    globalStore.globalBlocklist.delete(ip)
  },

  // --- BUSINESS PLANS ---
  getPlans(): SubscriptionTier[] {
    return SUBSCRIPTION_PLANS
  },

  // --- USERS MANAGEMENT ---
  getUsers(): ManagedUser[] {
    ensureInitialized()
    return Array.from(globalStore.users.values()).sort((a, b) => b.createdAt - a.createdAt)
  },

  getUser(idOrEmail: string): ManagedUser | undefined {
    ensureInitialized()
    const byId = globalStore.users.get(idOrEmail)
    if (byId) return byId
    return Array.from(globalStore.users.values()).find(
      (u) => u.email.toLowerCase() === idOrEmail.toLowerCase()
    )
  },

  createUser(payload: {
    name: string
    email: string
    role?: "Superadmin" | "Admin" | "User" | "Support" | "Teknis" | "Programmer" | "DevOps"
    plan?: "free" | "pro" | "enterprise"
    serverQuota?: number
    organization?: string
    phone?: string
    assignedNodeIds?: string[]
    createdBy?: string
  }): { user: ManagedUser; defaultKey: ManagedLicenseKey } {
    ensureInitialized()
    const now = Math.floor(Date.now() / 1000)
    const id = "usr_" + Math.random().toString(36).substring(2, 10)
    const plan = payload.plan || "pro"
    // Default role is Admin as specified in requirement
    const role = payload.role || "Admin"
    const serverQuota = payload.serverQuota ?? (plan === "enterprise" ? 100 : plan === "pro" ? 10 : 1)
    const nodeIds = payload.assignedNodeIds || []

    const user: ManagedUser = {
      id,
      name: payload.name,
      email: payload.email.toLowerCase().trim(),
      role,
      plan,
      serverQuota,
      isActive: true,
      createdAt: now,
      organization: payload.organization,
      phone: payload.phone,
      assignedNodeIds: nodeIds,
      createdBy: payload.createdBy,
    }
    globalStore.users.set(id, user)

    // Sync newly created user to assigned nodes
    for (const nid of nodeIds) {
      const n = globalStore.nodes.get(nid)
      if (n) {
        if (!n.assignedUserIds) n.assignedUserIds = []
        if (!n.assignedUserIds.includes(id)) {
          n.assignedUserIds.push(id)
        }
      }
    }

    // Automatically generate first production license key for this user
    const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    const keyString = `psk_live_${hex}`
    const defaultKey: ManagedLicenseKey = {
      id: "lic_" + Math.random().toString(36).substring(2, 10),
      userId: id,
      userEmail: user.email,
      userName: user.name,
      key: keyString,
      name: "Default Sentinel & Multi-App Token",
      isActive: true,
      createdAt: now,
      connectedNodesCount: 0,
      connectedAppsCount: 0,
      isTrial: true,
      trialEndsAt: now + 14 * 86400,
      subscriptionStatus: "trialing",
    }
    globalStore.licenseKeys.set(defaultKey.id, defaultKey)

    return { user, defaultKey }
  },

  updateUser(id: string, updates: Partial<ManagedUser>): ManagedUser | null {
    ensureInitialized()
    const user = globalStore.users.get(id)
    if (!user) return null

    if (updates.assignedNodeIds !== undefined) {
      const newNodeIds = updates.assignedNodeIds
      const oldNodeIds = user.assignedNodeIds || []

      // Unassign user from nodes that were removed
      for (const oldNid of oldNodeIds) {
        if (!newNodeIds.includes(oldNid)) {
          const n = globalStore.nodes.get(oldNid)
          if (n && n.assignedUserIds) {
            n.assignedUserIds = n.assignedUserIds.filter((uid) => uid !== id)
          }
        }
      }

      // Assign user to nodes that were added
      for (const newNid of newNodeIds) {
        const n = globalStore.nodes.get(newNid)
        if (n) {
          if (!n.assignedUserIds) n.assignedUserIds = []
          if (!n.assignedUserIds.includes(id)) {
            n.assignedUserIds.push(id)
          }
        }
      }
    }

    const updated = { ...user, ...updates }
    globalStore.users.set(id, updated)
    return updated
  },

  deleteUser(id: string): boolean {
    ensureInitialized()
    // Unassign user from all nodes
    for (const n of globalStore.nodes.values()) {
      if (n.assignedUserIds) {
        n.assignedUserIds = n.assignedUserIds.filter((uid) => uid !== id)
      }
    }
    return globalStore.users.delete(id)
  },

  // --- LICENSE KEYS (Multi-App, Multi-Node) ---
  getLicenseKeys(userId?: string): ManagedLicenseKey[] {
    ensureInitialized()
    const all = Array.from(globalStore.licenseKeys.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    )
    if (!userId) return all
    return all.filter((k) => k.userId === userId)
  },

  getLicenseKeyByToken(token: string): ManagedLicenseKey | undefined {
    ensureInitialized()
    return Array.from(globalStore.licenseKeys.values()).find((k) => k.key === token.trim())
  },

  createLicenseKey(userId: string, name?: string): ManagedLicenseKey | null {
    ensureInitialized()
    const user = globalStore.users.get(userId)
    if (!user) return null

    const now = Math.floor(Date.now() / 1000)
    const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    const keyString = `psk_live_${hex}`

    const newKey: ManagedLicenseKey = {
      id: "lic_" + Math.random().toString(36).substring(2, 10),
      userId,
      userEmail: user.email,
      userName: user.name,
      key: keyString,
      name: name || `Token Armada ${user.name.split(" ")[0]}`,
      isActive: true,
      createdAt: now,
      connectedNodesCount: 0,
      connectedAppsCount: 0,
      isTrial: true,
      trialEndsAt: now + 14 * 86400,
      subscriptionStatus: "trialing",
    }

    globalStore.licenseKeys.set(newKey.id, newKey)
    return newKey
  },

  updateLicenseKey(id: string, updates: Partial<ManagedLicenseKey>): ManagedLicenseKey | null {
    ensureInitialized()
    const key = globalStore.licenseKeys.get(id)
    if (!key) return null

    const updated = { ...key, ...updates }
    globalStore.licenseKeys.set(id, updated)
    return updated
  },

  toggleLicenseKey(id: string): ManagedLicenseKey | null {
    ensureInitialized()
    const key = globalStore.licenseKeys.get(id)
    if (!key) return null

    key.isActive = !key.isActive
    globalStore.licenseKeys.set(id, key)
    return key
  },

  deleteLicenseKey(id: string): boolean {
    ensureInitialized()
    return globalStore.licenseKeys.delete(id)
  },

  // --- CONNECTED APPS (Laravel APP_NAME & APP_URL) ---
  getConnectedApps(userId?: string): ConnectedApp[] {
    ensureInitialized()
    const all = Array.from(globalStore.connectedApps.values()).sort(
      (a, b) => b.lastHeartbeat - a.lastHeartbeat
    )
    if (!userId) return all
    return all.filter((a) => a.userId === userId)
  },

  registerConnectedApp(payload: {
    licenseKey: string
    appName: string
    appUrl: string
    ip?: string
    environment?: "production" | "staging" | "local"
    wafVersion?: string
    threatsBlocked?: number
  }): ConnectedApp | null {
    ensureInitialized()
    const keyRecord = this.getLicenseKeyByToken(payload.licenseKey)
    if (!keyRecord || !keyRecord.isActive) {
      return null
    }

    const now = Math.floor(Date.now() / 1000)
    const existing = Array.from(globalStore.connectedApps.values()).find(
      (a) =>
        a.licenseKey === payload.licenseKey &&
        (a.appUrl === payload.appUrl || a.appName === payload.appName)
    )

    if (existing) {
      existing.lastHeartbeat = now
      existing.status = "PROTECTED"
      if (payload.ip) existing.ip = payload.ip
      if (payload.wafVersion) existing.wafVersion = payload.wafVersion
      if (payload.threatsBlocked !== undefined) {
        existing.threatsBlocked += payload.threatsBlocked
      }
      globalStore.connectedApps.set(existing.id, existing)
      return existing
    }

    const id = "app_" + Math.random().toString(36).substring(2, 10)
    const newApp: ConnectedApp = {
      id,
      userId: keyRecord.userId,
      licenseKey: keyRecord.key,
      appName: payload.appName || "Laravel",
      appUrl: payload.appUrl || "http://localhost:8000",
      ip: payload.ip || "127.0.0.1",
      environment: payload.environment || (payload.appUrl.includes("localhost") ? "local" : "production"),
      wafVersion: payload.wafVersion || "v1.2.0",
      status: "PROTECTED",
      threatsBlocked: payload.threatsBlocked || 0,
      lastHeartbeat: now,
    }

    globalStore.connectedApps.set(id, newApp)
    keyRecord.connectedAppsCount = Array.from(globalStore.connectedApps.values()).filter(
      (a) => a.licenseKey === keyRecord.key
    ).length
    keyRecord.lastUsedAt = now

    return newApp
  },


  // --- PRICING PLANS CRUD ---
  getPricingPlans(): PricingPlan[] {
    ensureInitialized()
    return Array.from(globalStore.pricingPlans.values()).sort((a, b) => a.sortOrder - b.sortOrder)
  },

  getPricingPlan(id: string): PricingPlan | undefined {
    ensureInitialized()
    return globalStore.pricingPlans.get(id)
  },

  upsertPricingPlan(plan: Partial<PricingPlan> & { id?: string; name: string }): PricingPlan {
    ensureInitialized()
    const id = plan.id || plan.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    const existing = globalStore.pricingPlans.get(id)
    const updated: PricingPlan = {
      id,
      name: plan.name,
      slug: plan.slug || existing?.slug || id,
      category: plan.category || existing?.category || "standard",
      badge: plan.badge !== undefined ? plan.badge : existing?.badge,
      description: plan.description || existing?.description || "",
      targetAudience: plan.targetAudience !== undefined ? plan.targetAudience : existing?.targetAudience,
      vpsQuota: plan.vpsQuota !== undefined ? Number(plan.vpsQuota) : existing?.vpsQuota ?? 1,
      appsPerVps: plan.appsPerVps || existing?.appsPerVps || "Unlimited",
      priceMonthlyIdr: plan.priceMonthlyIdr !== undefined ? Number(plan.priceMonthlyIdr) : existing?.priceMonthlyIdr ?? 0,
      priceYearlyIdr: plan.priceYearlyIdr !== undefined ? Number(plan.priceYearlyIdr) : existing?.priceYearlyIdr ?? 0,
      priceMonthlyUsd: plan.priceMonthlyUsd !== undefined ? Number(plan.priceMonthlyUsd) : existing?.priceMonthlyUsd ?? 0,
      priceYearlyUsd: plan.priceYearlyUsd !== undefined ? Number(plan.priceYearlyUsd) : existing?.priceYearlyUsd ?? 0,
      discountMonthlyPercent: plan.discountMonthlyPercent !== undefined ? Number(plan.discountMonthlyPercent) : existing?.discountMonthlyPercent ?? 0,
      discountYearlyPercent: plan.discountYearlyPercent !== undefined ? Number(plan.discountYearlyPercent) : existing?.discountYearlyPercent ?? 0,
      isFirstPurchaseOnly: plan.isFirstPurchaseOnly !== undefined ? Boolean(plan.isFirstPurchaseOnly) : existing?.isFirstPurchaseOnly ?? false,
      promoTag: plan.promoTag !== undefined ? plan.promoTag : existing?.promoTag,
      features: Array.isArray(plan.features) ? plan.features : existing?.features ?? [],
      highlightFeatures: Array.isArray(plan.highlightFeatures) ? plan.highlightFeatures : existing?.highlightFeatures ?? [],
      logRetentionDays: plan.logRetentionDays !== undefined ? Number(plan.logRetentionDays) : existing?.logRetentionDays ?? 14,
      maxSeats: plan.maxSeats !== undefined ? Number(plan.maxSeats) : existing?.maxSeats ?? 1,
      crowdDefenseSync: plan.crowdDefenseSync || existing?.crowdDefenseSync || "1h",
      supportSla: plan.supportSla || existing?.supportSla || "Standard",
      complianceCert: plan.complianceCert !== undefined ? plan.complianceCert : existing?.complianceCert,
      isCustomQuote: plan.isCustomQuote !== undefined ? Boolean(plan.isCustomQuote) : existing?.isCustomQuote ?? false,
      isActive: plan.isActive !== undefined ? Boolean(plan.isActive) : existing?.isActive ?? true,
      sortOrder: plan.sortOrder !== undefined ? Number(plan.sortOrder) : existing?.sortOrder ?? 99,
    }
    globalStore.pricingPlans.set(id, updated)
    return updated
  },

  deletePricingPlan(id: string): boolean {
    ensureInitialized()
    return globalStore.pricingPlans.delete(id)
  },

  // --- TENANT SPECIFIC OVERVIEW ---
  getUserTenantOverview(userEmailOrId: string) {
    ensureInitialized()
    let user = this.getUser(userEmailOrId)
    if (!user) {
      user = Array.from(globalStore.users.values()).find((u) => u.role === "User") || {
        id: "usr_guest",
        name: "Pengguna Layanan",
        email: userEmailOrId,
        role: "User",
        plan: "pro",
        serverQuota: 10,
        isActive: true,
        createdAt: Math.floor(Date.now() / 1000),
      }
    }

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === user.plan) || SUBSCRIPTION_PLANS[1]
    const keys = this.getLicenseKeys(user.id)
    const apps = this.getConnectedApps(user.id)
    const allNodes = this.getNodes()
    const userNodes = allNodes.filter((n) => n.project_id === user.id || n.project_id === "usr_client_kominfo")
    const allThreats = this.getThreats(100)
    const userThreats = allThreats.filter((t) => t.project_id === user.id || userNodes.some((n) => n.node_id === t.node_id))
    const blocklist = this.getBlocklist()

    return {
      user,
      plan,
      keys,
      apps,
      nodes: userNodes.length > 0 ? userNodes : allNodes.slice(0, 2),
      threats: userThreats.length > 0 ? userThreats : allThreats.slice(0, 5),
      blocklist,
      usage: {
        nodesUsed: userNodes.length > 0 ? userNodes.length : 2,
        nodesQuota: user.serverQuota,
        nodesPercent: Math.round(((userNodes.length > 0 ? userNodes.length : 2) / user.serverQuota) * 100),
        appsCount: apps.length,
      },
    }
  },
}
