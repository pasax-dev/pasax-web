export interface VisitorConsentPreferences {
  essential: boolean
  analytics: boolean
  telemetry: boolean
  geolocation: boolean
}

export interface VisitorLogRecord {
  id: string
  visitorId: string | null
  sessionId: string | null
  consentStatus: "pending" | "accepted_all" | "essential_only" | "custom" | "declined" | string
  consentPreferences: VisitorConsentPreferences
  ipAddress: string
  forwardedFor: string | null
  isp: string | null
  asn: string | null
  org: string | null
  isProxy: boolean
  isHosting: boolean
  country: string | null
  countryCode: string | null
  region: string | null
  regionCode: string | null
  city: string | null
  district: string | null
  streetAddress: string | null
  fullAddress: string | null
  postalCode: string | null
  latitude: string | null
  longitude: string | null
  geoSource: string
  timezone: string | null
  currency: string | null
  userAgent: string
  osName: string | null
  osVersion: string | null
  browserName: string | null
  browserVersion: string | null
  browserEngine: string | null
  deviceType: string
  deviceVendor: string | null
  deviceModel: string | null
  platform: string | null
  architecture: string | null
  isMobile: boolean
  isBot: boolean
  screenResolution: string | null
  viewportSize: string | null
  pixelRatio: string | null
  colorDepth: number | null
  cpuCores: number | null
  deviceMemoryGb: string | null
  touchSupport: boolean
  maxTouchPoints: number
  gpuRenderer: string | null
  batteryInfo: { level?: number; charging?: boolean } | null
  language: string | null
  languages: string[]
  connectionType: string | null
  downlinkMbps: string | null
  rttMs: number | null
  pagePath: string
  pageUrl: string | null
  pageTitle: string | null
  referrer: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  cookiesEnabled: boolean
  doNotTrack: boolean
  authenticatedEmail: string | null
  authenticatedRole: string | null
  rawHeaders: Record<string, string>
  extraMetadata: Record<string, unknown>
  visitedAt: string
  updatedAt: string
}

export interface VisitorBreakdownItem {
  name: string
  count: number
}

export interface VisitorSummary {
  totalVisits: number
  uniqueVisitors: number
  uniqueIps: number
  consentedCount: number
  gpsPrecisionCount: number
  topCountries: VisitorBreakdownItem[]
  topCities: VisitorBreakdownItem[]
  deviceBreakdown: VisitorBreakdownItem[]
  osBreakdown: VisitorBreakdownItem[]
  browserBreakdown: VisitorBreakdownItem[]
  consentBreakdown: VisitorBreakdownItem[]
}

export interface SavedSshProfile {
  id: string
  ownerEmail: string
  nodeId: string | null
  label: string
  host: string
  port: number
  username: string
  authMethod: "password" | "key"
  transportMode: "pty" | "command"
  hasSecret: boolean
  verifiedAt?: string | null
  lastConnectedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

import { NodeTelemetry, ThreatEvent, pasaxStore, VHostInfo } from "./store"

const DEFAULT_API_URL = "https://service.pasax.web.id"

export function getPasaxApiUrl(): string {
  if (typeof process !== "undefined" && (process.env.PASAX_API_URL || process.env.PASAK_API_URL)) {
    return (process.env.PASAX_API_URL || process.env.PASAK_API_URL)!.replace(/\/$/, "")
  }
  if (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_PASAX_API_URL || process.env.NEXT_PUBLIC_PASAK_API_URL)) {
    return (process.env.NEXT_PUBLIC_PASAX_API_URL || process.env.NEXT_PUBLIC_PASAK_API_URL)!.replace(/\/$/, "")
  }
  return DEFAULT_API_URL
}

export const pasaxCloud = {
  /**
   * Fetch all registered Sentinel nodes from Pasax Cloud API (backed by Neon PostgreSQL),
   * falling back to local memory store if the remote cloud is unreachable.
   */
  async fetchNodes(): Promise<NodeTelemetry[]> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/nodes`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      })

      if (res.ok) {
        const json = await res.json()
        const rawNodes = Array.isArray(json) ? json : json.data

        if (Array.isArray(rawNodes) && rawNodes.length > 0) {
          const nowSeconds = Math.floor(Date.now() / 1000)

          const mapped: NodeTelemetry[] = rawNodes.map((n: any) => {
            const nginxVhosts: VHostInfo[] = []
            const apacheVhosts: VHostInfo[] = []

            if (Array.isArray(n.discoveredSites)) {
              for (const site of n.discoveredSites) {
                const vhost: VHostInfo = {
                  domain: site.domain,
                  ssl_status: site.ssl_active ? "valid" : "none",
                  ssl_expires_at: site.ssl_days_remaining
                    ? nowSeconds + site.ssl_days_remaining * 86400
                    : undefined,
                  upstream: site.upstream,
                }
                if (site.engine === "apache2") {
                  apacheVhosts.push(vhost)
                } else {
                  nginxVhosts.push(vhost)
                }
              }
            }

            const lastSeen = n.lastSeenAt
              ? Math.floor(new Date(n.lastSeenAt).getTime() / 1000)
              : nowSeconds

            const localNode = pasaxStore.getNode(n.id)
            return {
              node_id: n.id,
              project_id: n.userId || localNode?.project_id || "prj_cloud",
              hostname: n.hostname,
              ip_v4: n.publicIp,
              os: n.osInfo,
              uptime_seconds: 86400,
              memory_used_percent: 36.4,
              cpu_used_percent: 12.8,
              disk_used_percent: localNode?.disk_used_percent || 45.0,
              last_seen: lastSeen,
              status: n.status === "healthy" ? "ONLINE" : "OFFLINE",
              assignedUserIds: localNode?.assignedUserIds || (n.userId ? [n.userId] : []),
              tags: localNode?.tags || ["Production"],
              description: localNode?.description || "",
              ssh_port: localNode?.ssh_port || 22,
              createdAt: localNode?.createdAt || nowSeconds,
              webservers: {
                nginx: {
                  installed: true,
                  running: true,
                  version: "1.24.0",
                  vhosts: nginxVhosts,
                },
                apache2: {
                  installed: apacheVhosts.length > 0,
                  running: apacheVhosts.length > 0,
                  version: apacheVhosts.length > 0 ? "2.4.58" : null,
                  vhosts: apacheVhosts,
                },
              },
            }
          })

          // Also merge any local seed nodes not present in Cloud
          const localNodes = pasaxStore.getNodes()
          const cloudIds = new Set(mapped.map((m) => m.node_id))
          for (const loc of localNodes) {
            if (!cloudIds.has(loc.node_id)) {
              mapped.push(loc)
            }
          }

          return mapped
        }
      }
    } catch (err) {
      console.warn("[PasaxCloud] Could not connect to remote API, falling back to local store:", err)
    }

    return pasaxStore.getNodes()
  },

  /**
   * Fetch latest threat audit events from Pasax Cloud API.
   */
  async fetchThreats(limit = 50): Promise<ThreatEvent[]> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/events/threat?limit=${limit}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      })

      if (res.ok) {
        const json = await res.json()
        const rawEvents = Array.isArray(json) ? json : json.data

        if (Array.isArray(rawEvents) && rawEvents.length > 0) {
          const mapped: ThreatEvent[] = rawEvents.map((e: any) => ({
            id: e.id,
            node_id: e.nodeId || "nd_sentinel_01",
            project_id: "prj_production",
            event_type: e.threatType || "SECURITY_VIOLATION",
            severity: e.blockedAtKernel ? "CRITICAL" : "HIGH",
            details: {
              attacker_ip: e.attackerIp,
              attack_pattern: `${e.threatType} probe on ${e.targetHost || "server interface"}`,
              url: e.targetHost || undefined,
              mitigation_action_taken: e.blockedAtKernel
                ? "KERNEL_FIREWALL_NFTABLES_DROP_ADDED"
                : "AUDIT_LOGGED",
              ...(e.details || {}),
            },
            timestamp: e.createdAt
              ? Math.floor(new Date(e.createdAt).getTime() / 1000)
              : Math.floor(Date.now() / 1000),
          }))

          // Merge local in-memory threats
          const localThreats = pasaxStore.getThreats(limit)
          const cloudIds = new Set(mapped.map((m) => m.id))
          for (const loc of localThreats) {
            if (!cloudIds.has(loc.id)) {
              mapped.push(loc)
            }
          }

          return mapped.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
        }
      }
    } catch (err) {
      console.warn("[PasaxCloud] Could not fetch threats from remote API:", err)
    }

    return pasaxStore.getThreats(limit)
  },

  /**
   * Fetch active global blocklist from Pasax Cloud API.
   */
  async fetchBlocklist(): Promise<string[]> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/threats/global-blocklist`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      })

      if (res.ok) {
        const json = await res.json()
        if (Array.isArray(json.ips) && json.ips.length > 0) {
          const merged = new Set([...json.ips, ...pasaxStore.getBlocklist()])
          return Array.from(merged)
        }
      }
    } catch (err) {
      console.warn("[PasaxCloud] Could not fetch blocklist from remote API:", err)
    }

    return pasaxStore.getBlocklist()
  },

  /**
   * Relay a threat event to the Pasax Cloud API and record locally.
   */
  async reportThreat(event: Omit<ThreatEvent, "id">): Promise<ThreatEvent> {
    const localEvent = pasaxStore.addThreat(event)

    const apiUrl = getPasaxApiUrl()
    try {
      await fetch(`${apiUrl}/api/v1/events/threat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: event.node_id,
          project_id: event.project_id,
          event_type: event.event_type,
          threat_type: event.event_type,
          attacker_ip: event.details?.attacker_ip || "198.51.100.42",
          target_host: event.details?.url || undefined,
          details: event.details,
          blocked_at_kernel: true,
        }),
      })
    } catch (err) {
      console.warn("[PasaxCloud] Failed to forward threat to remote API:", err)
    }

    return localEvent
  },

  /**
   * Relay Sentinel node telemetry to Pasax Cloud API and update locally.
   */
  async ingestTelemetry(payload: any): Promise<NodeTelemetry> {
    const updated = pasaxStore.upsertTelemetry(payload)

    const apiUrl = getPasaxApiUrl()
    try {
      await fetch(`${apiUrl}/api/v1/nodes/telemetry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.warn("[PasaxCloud] Failed to forward telemetry to remote API:", err)
    }

    return updated
  },

  /**
   * Fetch all users from Pasax Cloud API or local store fallback.
   */

  /**
   * Fetch all active pricing plans from Pasax Cloud API or local fallback.
   */
  async fetchPricingPlans(includeInactive = false): Promise<any[]> {
    const apiUrl = getPasaxApiUrl()
    try {
      const endpoint = includeInactive ? "/api/v1/pricing/all" : "/api/v1/pricing"
      const res = await fetch(`${apiUrl}${endpoint}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      })
      if (res.ok) {
        const json = await res.json()
        const rawPlans = Array.isArray(json) ? json : json.data
        if (Array.isArray(rawPlans) && rawPlans.length > 0) {
          return rawPlans
        }
      }
    } catch (err) {
      console.warn("[PasaxCloud] Failed to fetch pricing plans from remote API:", err)
    }
    const plans = pasaxStore.getPricingPlans()
    return includeInactive ? plans : plans.filter((p) => p.isActive)
  },

  async fetchUsers(): Promise<any[]> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/users`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      })
      if (res.ok) {
        const json = await res.json()
        const rawUsers = Array.isArray(json) ? json : json.data
        if (Array.isArray(rawUsers) && rawUsers.length > 0) {
          return rawUsers
        }
      }
    } catch (err) {
      console.warn("[PasaxCloud] Failed to fetch users from remote API:", err)
    }
    return pasaxStore.getUsers()
  },
  /**
   * Fetch live mid-market exchange rate via Wise
   */
  async fetchWiseRate(source = "USD", target = "IDR"): Promise<{ rate: number; timestamp: string }> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/currency/rate?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`, {
        next: { revalidate: 600 },
      })
      if (res.ok) {
        const json = await res.json()
        if (json && typeof json.rate === "number" && json.rate > 0) {
          return { rate: json.rate, timestamp: json.timestamp || new Date().toISOString() }
        }
      }
    } catch (err) {
      console.warn("[PasaxCloud] Failed to fetch Wise rate:", err)
    }
    return {
      rate: source === "USD" && target === "IDR" ? 18290.0 : 1 / 18290.0,
      timestamp: new Date().toISOString(),
    }
  },


  async fetchSshProfiles(ownerEmail: string): Promise<SavedSshProfile[]> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/ssh-profiles?ownerEmail=${encodeURIComponent(ownerEmail.toLowerCase().trim())}`,
        {
          cache: "no-store",
          headers: { Accept: "application/json" },
          next: { revalidate: 0 },
        }
      )
      if (res.ok) {
        const json = await res.json()
        if (Array.isArray(json.data)) {
          return json.data
        }
      }
    } catch (err) {
      console.warn("[PasaxCloud] Failed to fetch SSH profiles:", err)
    }
    return []
  },

  async createSshProfile(payload: {
    ownerEmail: string
    nodeId?: string | null
    label: string
    host: string
    port: number
    username: string
    authMethod: "password" | "key"
    transportMode: "pty" | "command"
    encryptedSecret?: string | null
    verifiedAt?: string | null
  }): Promise<{ ok: boolean; data?: SavedSshProfile; message?: string }> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/ssh-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => null)
      if (res.ok && json?.data) {
        return { ok: true, data: json.data }
      }
      return { ok: false, message: json?.message || "Gagal menyimpan profil SSH ke database." }
    } catch (err: any) {
      return { ok: false, message: err?.message || "Cloud API unreachable." }
    }
  },

  async updateSshProfile(
    id: string,
    payload: {
      ownerEmail: string
      nodeId?: string | null
      label?: string
      host?: string
      port?: number
      username?: string
      authMethod?: "password" | "key"
      transportMode?: "pty" | "command"
      encryptedSecret?: string | null
      clearSecret?: boolean
      verifiedAt?: string | null
      lastConnectedAt?: string | null
    }
  ): Promise<{ ok: boolean; data?: SavedSshProfile; message?: string }> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/ssh-profiles/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => null)
      if (res.ok && json?.data) {
        return { ok: true, data: json.data }
      }
      return { ok: false, message: json?.message || "Gagal memperbarui profil SSH." }
    } catch (err: any) {
      return { ok: false, message: err?.message || "Cloud API unreachable." }
    }
  },

  async resolveSshProfile(
    id: string,
    ownerEmail: string
  ): Promise<(SavedSshProfile & { encryptedSecret?: string | null }) | null> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/ssh-profiles/${encodeURIComponent(id)}/resolve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ownerEmail: ownerEmail.toLowerCase().trim() }),
        }
      )
      if (res.ok) {
        const json = await res.json()
        return json?.data || null
      }
    } catch (err) {
      console.warn("[PasaxCloud] Failed to resolve SSH profile:", err)
    }
    return null
  },

  async deleteSshProfile(id: string, ownerEmail: string): Promise<boolean> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/ssh-profiles/${encodeURIComponent(id)}?ownerEmail=${encodeURIComponent(ownerEmail.toLowerCase().trim())}`,
        {
          method: "DELETE",
          headers: { Accept: "application/json" },
        }
      )
      return res.ok
    } catch (err) {
      console.warn("[PasaxCloud] Failed to delete SSH profile:", err)
      return false
    }
  },

  async recordVisitor(payload: Record<string, unknown>): Promise<VisitorLogRecord | null> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/visitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const json = await res.json()
        return json?.data || null
      }
    } catch (err) {
      console.warn("[PasaxCloud] Failed to record visitor:", err)
    }
    return null
  },

  async updateVisitor(id: string, payload: Record<string, unknown>): Promise<VisitorLogRecord | null> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/visitors/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const json = await res.json()
        return json?.data || null
      }
    } catch (err) {
      console.warn("[PasaxCloud] Failed to update visitor:", err)
    }
    return null
  },

  async fetchVisitors(params?: {
    q?: string
    country?: string
    deviceType?: string
    consentStatus?: string
    limit?: number
    offset?: number
  }): Promise<{ summary: VisitorSummary; data: VisitorLogRecord[]; count: number }> {
    const apiUrl = getPasaxApiUrl()
    const qs = new URLSearchParams()
    if (params?.q) qs.set("q", params.q)
    if (params?.country && params.country !== "all") qs.set("country", params.country)
    if (params?.deviceType && params.deviceType !== "all") qs.set("deviceType", params.deviceType)
    if (params?.consentStatus && params.consentStatus !== "all") qs.set("consentStatus", params.consentStatus)
    if (params?.limit) qs.set("limit", String(params.limit))
    if (params?.offset) qs.set("offset", String(params.offset))

    const emptySummary: VisitorSummary = {
      totalVisits: 0,
      uniqueVisitors: 0,
      uniqueIps: 0,
      consentedCount: 0,
      gpsPrecisionCount: 0,
      topCountries: [],
      topCities: [],
      deviceBreakdown: [],
      osBreakdown: [],
      browserBreakdown: [],
      consentBreakdown: [],
    }

    try {
      const res = await fetch(`${apiUrl}/api/v1/visitors?${qs.toString()}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      })
      if (res.ok) {
        const json = await res.json()
        return {
          summary: json.summary || emptySummary,
          data: Array.isArray(json.data) ? json.data : [],
          count: Number(json.count || 0),
        }
      }
    } catch (err) {
      console.warn("[PasaxCloud] Failed to fetch visitors:", err)
    }
    return { summary: emptySummary, data: [], count: 0 }
  },

  async deleteVisitor(id: string): Promise<boolean> {
    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/visitors/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      })
      return res.ok
    } catch (err) {
      console.warn("[PasaxCloud] Failed to delete visitor:", err)
      return false
    }
  },
};
