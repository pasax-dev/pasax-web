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
  last_seen: number
  status: "ONLINE" | "TAMPERED" | "OFFLINE"
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
  role: "Superadmin" | "Admin" | "User" | "Support" | "Teknis"
  plan: "free" | "pro" | "enterprise"
  serverQuota: number
  isActive: boolean
  createdAt: number
  phone?: string
  organization?: string
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
    id: "free",
    name: "Starter / Dev",
    tagline: "Proteksi WAF dasar untuk developer dan riset mandiri",
    priceIdr: 0,
    priceYearlyIdr: 0,
    serverQuota: 1,
    appQuota: 3,
    retentionDays: 7,
    fimEnabled: false,
    kernelFirewallEnabled: false,
    features: [
      "1 VPS Node Sentinel",
      "Maksimal 3 Aplikasi Web Laravel",
      "Pure PHP WAF (Zero NPM/Node.js)",
      "Layer 7 In-App Rate Limiting & Cooldown",
      "7 Hari Retensi Log Serangan",
      "Komunitas & Dokumentasi Publik",
    ],
  },
  {
    id: "pro",
    name: "Pro Fleet SOC",
    tagline: "Proteksi pertahanan militer Linux Kernel untuk armada production",
    priceIdr: 149000,
    priceYearlyIdr: 1490000,
    serverQuota: 10,
    appQuota: -1, // Unlimited
    recommended: true,
    retentionDays: 30,
    fimEnabled: true,
    kernelFirewallEnabled: true,
    features: [
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
  initialized: false,
}

if (!(globalThis as any).__PASAX_STORE__) {
  (globalThis as any).__PASAX_STORE__ = globalStore
}

// Initial seed data so the dashboard is immediately vivid and interactive
function ensureInitialized() {
  if (globalStore.initialized) return

  const now = Math.floor(Date.now() / 1000)

  // 1. Seed Users
  const user1: ManagedUser = {
    id: "usr_superadmin",
    name: "Roby Kartis (Chief SOC)",
    email: "superadmin@pasax.id",
    role: "Superadmin",
    plan: "enterprise",
    serverQuota: 100,
    isActive: true,
    createdAt: now - 90 * 86400,
    organization: "Pasax Cyber Defense Group",
  }
  const user2: ManagedUser = {
    id: "usr_admin",
    name: "Fleet SecOps Admin",
    email: "admin@pasax.id",
    role: "Admin",
    plan: "pro",
    serverQuota: 10,
    isActive: true,
    createdAt: now - 60 * 86400,
    organization: "Pasax SOC Operations",
  }
  const user3: ManagedUser = {
    id: "usr_client_kominfo",
    name: "Pengelola Layanan Publik",
    email: "user@pasax.id",
    role: "User",
    plan: "pro",
    serverQuota: 10,
    isActive: true,
    createdAt: now - 30 * 86400,
    organization: "Diskominfo / Tenant Layanan",
  }
  const user4: ManagedUser = {
    id: "usr_dev_startup",
    name: "Indra Developer",
    email: "indra@startup.id",
    role: "User",
    plan: "free",
    serverQuota: 1,
    isActive: true,
    createdAt: now - 10 * 86400,
    organization: "Fintech Sandbox",
  }

  globalStore.users.set(user1.id, user1)
  globalStore.users.set(user2.id, user2)
  globalStore.users.set(user3.id, user3)
  globalStore.users.set(user4.id, user4)

  // 2. Seed License Keys (Multi-App, Multi-Node Supported)
  const keyTenant: ManagedLicenseKey = {
    id: "lic_tenant_pro_01",
    userId: user3.id,
    userEmail: user3.email,
    userName: user3.name,
    key: "psk_live_f90c11e5c1125deebae571815a01384c",
    name: "Production Multi-App & Sentinel Token",
    isActive: true,
    createdAt: now - 28 * 86400,
    connectedNodesCount: 2,
    connectedAppsCount: 2,
    lastUsedAt: now - 120,
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
    appUrl: "https://pasax.is-a.dev",
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

  // 4. Seed default Sentinel nodes
  globalStore.nodes.set("nd_01HW8P9Y124XQW7V6B9R41ZX9A", {
    node_id: "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
    project_id: user3.id,
    hostname: "prod-vps-sg01",
    ip_v4: "203.0.113.195",
    os: "Ubuntu 24.04 LTS (Noble)",
    uptime_seconds: 1209600,
    memory_used_percent: 42.8,
    cpu_used_percent: 18.4,
    last_seen: now - 15,
    status: "ONLINE",
    webservers: {
      nginx: {
        installed: true,
        running: true,
        version: "1.24.0",
        vhosts: [
          {
            domain: "app.pasax.is-a.dev",
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
    last_seen: now - 30,
    status: "ONLINE",
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

  globalStore.nodes.set("nd_03LM0C2D345ZUS9E8F1T63AA1C", {
    node_id: "nd_03LM0C2D345ZUS9E8F1T63AA1C",
    project_id: user1.id,
    hostname: "backup-vps-id02",
    ip_v4: "103.147.33.12",
    os: "Ubuntu 22.04.4 LTS",
    uptime_seconds: 2840000,
    memory_used_percent: 29.1,
    cpu_used_percent: 8.9,
    last_seen: now - 45,
    status: "ONLINE",
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
  // --- NODES ---
  getNodes(): NodeTelemetry[] {
    ensureInitialized()
    return Array.from(globalStore.nodes.values())
  },

  getNode(nodeId: string): NodeTelemetry | undefined {
    ensureInitialized()
    return globalStore.nodes.get(nodeId)
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
    role?: "Superadmin" | "Admin" | "User" | "Support" | "Teknis"
    plan?: "free" | "pro" | "enterprise"
    serverQuota?: number
    organization?: string
    phone?: string
  }): { user: ManagedUser; defaultKey: ManagedLicenseKey } {
    ensureInitialized()
    const now = Math.floor(Date.now() / 1000)
    const id = "usr_" + Math.random().toString(36).substring(2, 10)
    const plan = payload.plan || "pro"
    const role = payload.role || "User"
    const serverQuota = payload.serverQuota ?? (plan === "enterprise" ? 100 : plan === "pro" ? 10 : 1)

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
    }
    globalStore.users.set(id, user)

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
    }
    globalStore.licenseKeys.set(defaultKey.id, defaultKey)

    return { user, defaultKey }
  },

  updateUser(id: string, updates: Partial<ManagedUser>): ManagedUser | null {
    ensureInitialized()
    const user = globalStore.users.get(id)
    if (!user) return null

    const updated = { ...user, ...updates }
    globalStore.users.set(id, updated)
    return updated
  },

  deleteUser(id: string): boolean {
    ensureInitialized()
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
    }

    globalStore.licenseKeys.set(newKey.id, newKey)
    return newKey
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
