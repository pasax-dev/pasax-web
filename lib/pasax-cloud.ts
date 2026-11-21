import { NodeTelemetry, ThreatEvent, pasaxStore, VHostInfo } from "./store"

const DEFAULT_API_URL = "https://pasax-service.vercel.app"

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
}
