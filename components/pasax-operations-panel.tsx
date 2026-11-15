"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Server,
  ShieldAlert,
  Globe,
  Flame,
  Terminal,
  RefreshCw,
  Cpu,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Plus,
  Trash2,
  ExternalLink,
  Search,
} from "lucide-react"
import { NodeTelemetry, ThreatEvent, VHostInfo } from "@/lib/store"

export function PasaxOperationsPanel({
  initialNodes = [],
  initialThreats = [],
  initialBlocklist = [],
}: {
  initialNodes?: NodeTelemetry[]
  initialThreats?: ThreatEvent[]
  initialBlocklist?: string[]
}) {
  const [nodes, setNodes] = React.useState<NodeTelemetry[]>(initialNodes)
  const [threats, setThreats] = React.useState<ThreatEvent[]>(initialThreats)
  const [blocklist, setBlocklist] = React.useState<string[]>(initialBlocklist)
  const [selectedThreat, setSelectedThreat] = React.useState<ThreatEvent | null>(null)
  const [newIp, setNewIp] = React.useState("")
  const [threatSearch, setThreatSearch] = React.useState("")
  const [refreshing, setRefreshing] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("nodes")

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "")
      if (["nodes", "threats", "vhosts", "blocklist"].includes(hash)) {
        setActiveTab(hash)
      }
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  // Fetch live state from API
  const refreshAll = async () => {
    setRefreshing(true)
    try {
      const [resNodes, resThreats, resBlocklist] = await Promise.all([
        fetch("/api/v1/nodes").then((r) => r.json()),
        fetch("/api/v1/events/threat?limit=50").then((r) => r.json()),
        fetch("/api/v1/threats/global-blocklist").then((r) => r.json()),
      ])
      if (Array.isArray(resNodes)) setNodes(resNodes)
      if (Array.isArray(resThreats)) setThreats(resThreats)
      if (Array.isArray(resBlocklist)) setBlocklist(resBlocklist)
    } catch (err) {
      console.error("Failed to refresh Pasax telemetry:", err)
    } finally {
      setRefreshing(false)
    }
  }

  // Simulate an incident to demonstrate live ingestion
  const simulateIncident = async () => {
    try {
      const types = [
        {
          event_type: "FIM_MODIFICATION",
          severity: "CRITICAL",
          details: {
            file_path: "/var/www/pasax-app/.env",
            action: "TAMPER_DETECTED",
            trigger_user: "www-data",
            mitigation_action_taken: "PERMS_RESET_0600_AND_ALERTED",
            hash_before: "e3b0...855",
            hash_after: "c983...68b",
          },
        },
        {
          event_type: "WAF_INSTANT_BLOCK",
          severity: "HIGH",
          details: {
            attacker_ip: `198.51.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}`,
            attack_pattern: "Webshell Injection Probe (/eval-stdin.php)",
            url: "/upload/avatar.jpg",
            mitigation_action_taken: "NFTABLES_FIREWALL_DROP_ADDED",
          },
        },
        {
          event_type: "LOG_VIOLATION",
          severity: "HIGH",
          details: {
            attacker_ip: `45.134.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 255)}`,
            attack_pattern: "Directory Traversal (../../../../etc/shadow)",
            url: "/../../../../etc/shadow",
            mitigation_action_taken: "IP_BANNED_AUTOMATICALLY",
          },
        },
      ]
      const chosen = types[Math.floor(Math.random() * types.length)]
      const targetNode = nodes[0]?.node_id || "nd_01HW8P9Y124XQW7V6B9R41ZX9A"

      await fetch("/api/v1/events/threat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: targetNode,
          project_id: "prj_prod_ecommerce",
          event_type: chosen.event_type,
          severity: chosen.severity,
          details: chosen.details,
          timestamp: Math.floor(Date.now() / 1000),
        }),
      })

      await refreshAll()
    } catch (e) {
      console.error(e)
    }
  }

  // Add IP to blocklist
  const handleAddIp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIp.trim()) return
    try {
      const res = await fetch("/api/v1/threats/global-blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: newIp.trim() }),
      })
      const data = await res.json()
      if (data.blocklist) setBlocklist(data.blocklist)
      setNewIp("")
    } catch (err) {
      console.error(err)
    }
  }

  // Remove IP from blocklist
  const handleRemoveIp = async (ip: string) => {
    try {
      const res = await fetch(`/api/v1/threats/global-blocklist?ip=${encodeURIComponent(ip)}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.blocklist) setBlocklist(data.blocklist)
    } catch (err) {
      console.error(err)
    }
  }

  // Collect all discovered vhosts across nodes
  const allVhosts: { nodeName: string; vhost: VHostInfo; webserver: string }[] = []
  nodes.forEach((n) => {
    n.webservers?.nginx?.vhosts?.forEach((vh) => {
      allVhosts.push({ nodeName: n.hostname, vhost: vh, webserver: `Nginx ${n.webservers.nginx?.version || ""}` })
    })
    n.webservers?.apache2?.vhosts?.forEach((vh) => {
      allVhosts.push({ nodeName: n.hostname, vhost: vh, webserver: `Apache2 ${n.webservers.apache2?.version || ""}` })
    })
  })

  const filteredThreats = threats.filter((t) => {
    if (!threatSearch) return true
    const q = threatSearch.toLowerCase()
    return (
      t.event_type.toLowerCase().includes(q) ||
      t.severity.toLowerCase().includes(q) ||
      t.node_id.toLowerCase().includes(q) ||
      JSON.stringify(t.details).toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-base border-2 border-border bg-main text-main-foreground shadow-shadow">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-base border-2 border-border bg-black text-white">
            <Server className="size-5 text-green-400" />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg tracking-tight">Security Operations Matrix</h2>
            <p className="text-xs font-semibold text-main-foreground/80">
              Live bi-directional synchronization between Host Daemons & Cloud Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="neutral"
            size="sm"
            onClick={simulateIncident}
            className="font-bold border-2 border-border shadow-shadow"
          >
            ⚡ Test Incident Tripwire
          </Button>
          <Button
            variant="neutral"
            size="sm"
            onClick={refreshAll}
            disabled={refreshing}
            className="font-bold border-2 border-border shadow-shadow"
          >
            <RefreshCw className={`size-3.5 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            Sync Telemetry
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs
        id="operations-matrix"
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val)
          window.location.hash = val
        }}
        className="w-full"
      >
        <TabsList className="w-full justify-start overflow-x-auto border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md p-1.5 rounded-base shadow-shadow mb-6">
          <TabsTrigger value="nodes" className="font-bold gap-1.5 data-[state=active]:bg-main data-[state=active]:text-main-foreground">
            <Server className="size-4" />
            Server Fleet ({nodes.length})
          </TabsTrigger>
          <TabsTrigger value="threats" className="font-bold gap-1.5 data-[state=active]:bg-main data-[state=active]:text-main-foreground">
            <ShieldAlert className="size-4" />
            Threat Incidents ({threats.length})
          </TabsTrigger>
          <TabsTrigger value="vhosts" className="font-bold gap-1.5 data-[state=active]:bg-main data-[state=active]:text-main-foreground">
            <Globe className="size-4" />
            VHost & SSL Recon ({allVhosts.length})
          </TabsTrigger>
          <TabsTrigger value="blocklist" className="font-bold gap-1.5 data-[state=active]:bg-main data-[state=active]:text-main-foreground">
            <Flame className="size-4" />
            Crowd Defense IP Ban ({blocklist.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: FLEET & NODES */}
        <TabsContent value="nodes" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => {
              const vhostCount =
                (node.webservers?.nginx?.vhosts?.length || 0) +
                (node.webservers?.apache2?.vhosts?.length || 0)

              return (
                <Card
                  key={node.node_id}
                  className="rounded-base border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md shadow-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:border-main/70"
                >
                  <CardHeader className="pb-3 border-b-2 border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex size-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex size-2.5 rounded-full bg-green-500"></span>
                        </span>
                        <CardTitle className="text-base font-bold font-mono">
                          {node.hostname}
                        </CardTitle>
                      </div>
                      <Badge variant="success" className="font-mono text-[10px]">
                        ONLINE
                      </Badge>
                    </div>
                    <CardDescription className="font-mono text-xs text-muted-foreground flex items-center justify-between mt-1">
                      <span>{node.ip_v4}</span>
                      <span className="text-[11px] font-bold text-foreground">{node.os}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-4 flex flex-col gap-3 text-xs">
                    {/* CPU & Memory bars */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between font-mono text-[11px] font-semibold">
                        <span className="flex items-center gap-1">
                          <Cpu className="size-3.5 text-main" /> CPU Usage
                        </span>
                        <span>{node.cpu_used_percent}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full border border-border overflow-hidden">
                        <div
                          className="bg-main h-full"
                          style={{ width: `${Math.min(node.cpu_used_percent, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between font-mono text-[11px] font-semibold">
                        <span className="flex items-center gap-1">
                          <HardDrive className="size-3.5 text-yellow-600 dark:text-yellow-400" /> RAM Usage
                        </span>
                        <span>{node.memory_used_percent}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full border border-border overflow-hidden">
                        <div
                          className="bg-yellow-400 h-full"
                          style={{ width: `${Math.min(node.memory_used_percent, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> Uptime: {Math.floor(node.uptime_seconds / 86400)}d{" "}
                        {Math.floor((node.uptime_seconds % 86400) / 3600)}h
                      </span>
                      <Badge variant="neutral" className="text-[10px] font-mono">
                        {vhostCount} VHosts
                      </Badge>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                        ID: {node.node_id}
                      </span>
                      <span className="font-bold text-[11px] text-green-700 dark:text-green-400">FIM Active</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* TAB 2: THREAT INCIDENTS */}
        <TabsContent value="threats" className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search threats by path, IP, or type..."
                value={threatSearch}
                onChange={(e) => setThreatSearch(e.target.value)}
                className="pl-9 bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md border-2 border-border shadow-shadow"
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Showing {filteredThreats.length} security alerts
            </span>
          </div>

          <div className="rounded-base border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md shadow-shadow overflow-hidden">
            <Table>
              <TableHeader className="bg-main text-main-foreground font-heading">
                <TableRow className="border-b-2 border-border hover:bg-main">
                  <TableHead className="text-main-foreground font-black w-24">Severity</TableHead>
                  <TableHead className="text-main-foreground font-black">Event Type</TableHead>
                  <TableHead className="text-main-foreground font-black">Target / Offender</TableHead>
                  <TableHead className="text-main-foreground font-black">Enforcement Action</TableHead>
                  <TableHead className="text-main-foreground font-black text-right">Time</TableHead>
                  <TableHead className="text-main-foreground font-black text-right w-20">Inspect</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredThreats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-mono">
                      No security incidents found matching filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredThreats.map((threat) => {
                    const sevVariant =
                      threat.severity === "CRITICAL"
                        ? "destructive"
                        : threat.severity === "HIGH"
                        ? "warning"
                        : "neutral"

                    const target =
                      threat.details?.file_path ||
                      threat.details?.attacker_ip ||
                      threat.details?.url ||
                      "Node System"

                    const action = threat.details?.mitigation_action_taken || "FLAGGED_IN_MEMORY"
                    const timeAgo = new Date(threat.timestamp * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })

                    return (
                      <TableRow key={threat.id} className="border-b border-border hover:bg-muted/40 dark:hover:bg-white/5 transition-colors">
                        <TableCell>
                          <Badge variant={sevVariant} className="font-bold text-[10px]">
                            {threat.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold">
                          {threat.event_type}
                        </TableCell>
                        <TableCell className="font-mono text-xs max-w-xs truncate" title={target}>
                          {target}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {action}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">
                          {timeAgo}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="xs"
                            variant="default"
                            onClick={() => setSelectedThreat(threat)}
                            className="font-bold"
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 3: VHOST & SSL RECON */}
        <TabsContent value="vhosts" className="flex flex-col gap-4">
          <div className="rounded-base border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md shadow-shadow overflow-hidden">
            <Table>
              <TableHeader className="bg-main text-main-foreground font-heading">
                <TableRow className="border-b-2 border-border hover:bg-main">
                  <TableHead className="text-main-foreground font-black">Discovered Domain</TableHead>
                  <TableHead className="text-main-foreground font-black">Server Node</TableHead>
                  <TableHead className="text-main-foreground font-black">Web Server Engine</TableHead>
                  <TableHead className="text-main-foreground font-black">Upstream / PHP-FPM</TableHead>
                  <TableHead className="text-main-foreground font-black">SSL Certificate</TableHead>
                  <TableHead className="text-main-foreground font-black text-right">Valid Until</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allVhosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-mono">
                      No webserver domains auto-discovered yet. Install Sentinel on a host with Nginx or Apache.
                    </TableCell>
                  </TableRow>
                ) : (
                  allVhosts.map((item, idx) => {
                    const daysLeft = item.vhost.ssl_expires_at
                        ? Math.max(0, Math.floor((item.vhost.ssl_expires_at - Date.now() / 1000) / 86400))
                      : null

                    const sslBadge =
                      item.vhost.ssl_status === "valid" ? (
                        <Badge variant="success" className="font-mono text-[10px]">
                          VALID ({daysLeft}d left)
                        </Badge>
                      ) : item.vhost.ssl_status === "expiring_soon" ? (
                        <Badge variant="warning" className="font-mono text-[10px]">
                          EXPIRING SOON ({daysLeft}d)
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="font-mono text-[10px]">
                          NO SSL
                        </Badge>
                      )

                    return (
                      <TableRow key={idx} className="border-b border-border hover:bg-muted/40 dark:hover:bg-white/5 transition-colors">
                        <TableCell className="font-mono text-xs font-bold text-foreground">
                          {item.vhost.domain}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.nodeName}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.webserver}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.vhost.upstream || "127.0.0.1:80"}
                        </TableCell>
                        <TableCell>{sslBadge}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">
                          {item.vhost.ssl_expires_at
                            ? new Date(item.vhost.ssl_expires_at * 1000).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 4: CROWD DEFENSE BLOCKLIST */}
        <TabsContent value="blocklist" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-base border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md shadow-shadow">
            <div>
              <h3 className="font-heading font-bold text-base">Global Threat Sharing Blocklist</h3>
              <p className="text-xs text-muted-foreground">
                Malicious IPs added here are automatically propagated to all connected Sentinel nodes and dropped via kernel <code className="font-mono font-bold">nftables</code>.
              </p>
            </div>
            <form onSubmit={handleAddIp} className="flex items-center gap-2">
              <Input
                placeholder="e.g. 198.51.100.99"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                className="w-48 bg-background border-2 border-border"
              />
              <Button type="submit" size="sm" variant="default" className="font-bold">
                <Plus className="size-4 mr-1" />
                Add & Ban IP
              </Button>
            </form>
          </div>

          <div className="rounded-base border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md shadow-shadow overflow-hidden">
            <Table>
              <TableHeader className="bg-main text-main-foreground font-heading">
                <TableRow className="border-b-2 border-border hover:bg-main">
                  <TableHead className="text-main-foreground font-black">Malicious IPv4 / Network</TableHead>
                  <TableHead className="text-main-foreground font-black">Enforcement Layer</TableHead>
                  <TableHead className="text-main-foreground font-black">Network Propagation</TableHead>
                  <TableHead className="text-main-foreground font-black text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocklist.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground font-mono">
                      No banned IPs in blocklist.
                    </TableCell>
                  </TableRow>
                ) : (
                  blocklist.map((ip) => (
                    <TableRow key={ip} className="border-b border-border hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <TableCell className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                        {ip}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-foreground">
                        Linux Kernel Packet Filter (nftables / iptables)
                      </TableCell>
                      <TableCell>
                        <Badge variant="success" className="font-mono text-[10px]">
                          SYNCED TO {nodes.length} NODES
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => handleRemoveIp(ip)}
                          className="font-bold"
                        >
                          <Trash2 className="size-3 mr-1" />
                          Unban
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Incident Detail Dialog */}
      <Dialog open={!!selectedThreat} onOpenChange={(open) => !open && setSelectedThreat(null)}>
        <DialogContent className="max-w-xl border-2 border-border shadow-shadow">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={
                  selectedThreat?.severity === "CRITICAL"
                    ? "destructive"
                    : selectedThreat?.severity === "HIGH"
                    ? "warning"
                    : "neutral"
                }
                className="font-bold font-mono"
              >
                {selectedThreat?.severity}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">{selectedThreat?.id}</span>
            </div>
            <DialogTitle className="text-lg font-heading">
              {selectedThreat?.event_type}
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Recorded on Node: {selectedThreat?.node_id} at{" "}
              {selectedThreat?.timestamp ? new Date(selectedThreat.timestamp * 1000).toLocaleString() : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 my-2 text-xs">
            <div className="rounded-base border-2 border-border bg-neutral-100 dark:bg-neutral-900 p-3 flex flex-col gap-2">
              <div className="font-bold text-foreground">Threat Incident Details:</div>
              <pre className="font-mono text-[11px] bg-black text-green-400 p-3 rounded border border-border overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(selectedThreat?.details || {}, null, 2)}
              </pre>
            </div>

            <div className="p-3 rounded-base border-2 border-border bg-secondary-background flex items-center justify-between">
              <div>
                <span className="font-bold block">Mitigation Status:</span>
                <span className="font-mono text-muted-foreground text-[11px]">
                  {selectedThreat?.details?.mitigation_action_taken || "Enforced at kernel/runtime"}
                </span>
              </div>
              <Badge variant="success" className="font-mono">RESOLVED</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
