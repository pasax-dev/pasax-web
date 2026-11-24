"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Globe,
  Server,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"
import { NodeTelemetry, VHostInfo } from "@/lib/store"

interface EnrichedVHost extends VHostInfo {
  nodeId: string
  nodeHostname: string
  nodeIp: string
  engine: "nginx" | "apache2"
  engineVersion: string | null
}

interface VHostsClientProps {
  initialNodes: NodeTelemetry[]
  currentRole?: string
}

export function VHostsClient({
  initialNodes = [],
  currentRole = "Superadmin",
}: VHostsClientProps) {
  const [nodes, setNodes] = React.useState<NodeTelemetry[]>(initialNodes)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sslFilter, setSslFilter] = React.useState("all")
  const [engineFilter, setEngineFilter] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedText, setCopiedText] = React.useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/nodes")
      if (res.ok) {
        const data = await res.json()
        if (data.data) setNodes(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Flatten all vhosts across all nodes
  const allVHosts: EnrichedVHost[] = React.useMemo(() => {
    const list: EnrichedVHost[] = []

    for (const node of nodes) {
      if (node.webservers?.nginx?.vhosts) {
        for (const vhost of node.webservers.nginx.vhosts) {
          list.push({
            ...vhost,
            nodeId: node.node_id,
            nodeHostname: node.hostname,
            nodeIp: node.ip_v4,
            engine: "nginx",
            engineVersion: node.webservers.nginx.version,
          })
        }
      }

      if (node.webservers?.apache2?.vhosts) {
        for (const vhost of node.webservers.apache2.vhosts) {
          list.push({
            ...vhost,
            nodeId: node.node_id,
            nodeHostname: node.hostname,
            nodeIp: node.ip_v4,
            engine: "apache2",
            engineVersion: node.webservers.apache2.version,
          })
        }
      }
    }

    return list
  }, [nodes])

  // Filtered vhosts
  const filteredVHosts = React.useMemo(() => {
    return allVHosts.filter((v) => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        v.domain.toLowerCase().includes(q) ||
        v.nodeHostname.toLowerCase().includes(q) ||
        v.nodeIp.includes(q) ||
        (v.upstream && v.upstream.toLowerCase().includes(q)) ||
        (v.root && v.root.toLowerCase().includes(q))

      const matchSsl = sslFilter === "all" || v.ssl_status === sslFilter
      const matchEngine = engineFilter === "all" || v.engine === engineFilter

      return matchSearch && matchSsl && matchEngine
    })
  }, [allVHosts, searchQuery, sslFilter, engineFilter])

  const totalVHosts = allVHosts.length
  const validSslCount = allVHosts.filter((v) => v.ssl_status === "valid").length
  const expiringSslCount = allVHosts.filter(
    (v) => v.ssl_status === "expiring_soon"
  ).length

  return (
    <div className="flex flex-col gap-6" data-role={currentRole}>
      {/* 1. Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-heading text-2xl font-black tracking-tight text-balance text-foreground sm:text-3xl">
              Virtual Hosts &amp; SSL Reconnaissance
            </h1>
            <Badge
              variant="outline"
              className="border-sky-500/50 bg-sky-500/10 font-mono text-[11px] font-bold tracking-wider text-sky-500"
            >
              TLS / HTTP DISCOVERY
            </Badge>
          </div>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
            Pemindaian otomatis domain, konfigurasi reverse proxy upstream, dan
            masa aktif sertifikat SSL pada armada VPS.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isLoading}
          className="h-9 shrink-0 border-2 font-mono text-xs whitespace-nowrap"
        >
          <RefreshCw
            className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Sinkronkan
        </Button>
      </div>

      {/* 2. Tactical Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                TOTAL VHOST / DOMAIN
              </span>
              <Globe className="size-4 shrink-0 text-main" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-foreground tabular-nums">
              {totalVHosts}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Terdeteksi di Nginx &amp; Apache
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                SSL AKTIF &amp; VALID
              </span>
              <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-500 tabular-nums">
              {validSslCount}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Enkripsi TLS 1.3 Terjamin
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                SEGERA KEDALUWARSA
              </span>
              <ShieldAlert className="size-4 shrink-0 text-amber-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-amber-500 tabular-nums">
              {expiringSslCount}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              &lt; 30 hari tersisa
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                AUTO RECON
              </span>
              <Server className="size-4 shrink-0 text-sky-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-sky-500">
              LIVE
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Sentinel Daemon Scanner
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search & Filters Bar */}
      <Card className="border-2 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama domain, hostname VPS, IP, upstream, atau path root..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 border-2 border-border bg-background pl-9 font-mono text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Filter className="size-3.5" />
                <span>Filter:</span>
              </div>

              <select
                value={sslFilter}
                onChange={(e) => setSslFilter(e.target.value)}
                className="h-9 rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                <option value="all">Semua Status SSL</option>
                <option value="valid">Valid &amp; Aktif</option>
                <option value="expiring_soon">Segera Habis (&lt; 30h)</option>
                <option value="expired">Kedaluwarsa / None</option>
              </select>

              <select
                value={engineFilter}
                onChange={(e) => setEngineFilter(e.target.value)}
                className="h-9 rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                <option value="all">Semua Web Server</option>
                <option value="nginx">Nginx</option>
                <option value="apache2">Apache2</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Table */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-5 py-4">
          <CardTitle className="flex items-center gap-2 font-heading text-lg font-black text-foreground tabular-nums">
            <Globe className="size-5 text-main" />
            <span>
              Virtual Hosts &amp; Domain Terdeteksi ({filteredVHosts.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border bg-muted/30">
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    DOMAIN HOST
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    VPS SERVER
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    WEB ENGINE
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    STATUS SSL
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    UPSTREAM PROXY
                  </TableHead>
                  <TableHead className="px-3 text-right font-mono text-[11px] font-bold tracking-wider text-foreground">
                    AKSI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVHosts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center font-mono text-xs text-muted-foreground"
                    >
                      Tidak ada virtual host yang cocok dengan kriteria
                      pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVHosts.map((vhost, idx) => {
                    const daysRemaining = vhost.ssl_expires_at
                      ? Math.floor(
                          (vhost.ssl_expires_at -
                            Math.floor(Date.now() / 1000)) /
                            86400
                        )
                      : null

                    return (
                      <TableRow
                        key={`${vhost.nodeId}-${vhost.domain}-${idx}`}
                        className="border-b border-border/60 transition-colors hover:bg-muted/10"
                      >
                        <TableCell className="max-w-[240px] px-3 py-3 font-mono text-xs whitespace-normal">
                          <div className="flex flex-col">
                            <a
                              href={`https://${vhost.domain}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 font-heading font-black text-foreground hover:text-main"
                            >
                              <span className="truncate">{vhost.domain}</span>
                              <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                            </a>
                            {vhost.root && (
                              <span className="mt-0.5 truncate text-[10px] text-muted-foreground/80">
                                Root: {vhost.root}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-3 font-mono text-xs">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                              {vhost.nodeHostname}
                            </span>
                            <span className="text-[11px] text-muted-foreground tabular-nums">
                              {vhost.nodeIp}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-3 font-mono text-xs">
                          <Badge
                            variant="outline"
                            className="border-border text-[10px] font-bold uppercase"
                          >
                            {vhost.engine} {vhost.engineVersion || ""}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-3 py-3 font-mono text-xs">
                          <div className="flex flex-col gap-0.5">
                            <Badge
                              className={`w-fit font-mono text-[9px] font-bold ${
                                vhost.ssl_status === "valid"
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : vhost.ssl_status === "expiring_soon"
                                    ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                                    : "border-border bg-muted text-muted-foreground"
                              }`}
                            >
                              {vhost.ssl_status === "valid"
                                ? "SSL AKTIF"
                                : vhost.ssl_status === "expiring_soon"
                                  ? "SEGERA HABIS"
                                  : "TIDAK ADA"}
                            </Badge>
                            {daysRemaining !== null && (
                              <span className="text-[10px] text-muted-foreground tabular-nums">
                                {daysRemaining > 0
                                  ? `${daysRemaining} hari tersisa`
                                  : "Kedaluwarsa"}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-3 font-mono text-xs">
                          {vhost.upstream ? (
                            <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
                              {vhost.upstream}
                            </code>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">
                              Direct Static Root
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="px-3 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopy(vhost.domain)}
                              title="Salin Domain"
                              className="size-8"
                            >
                              {copiedText === vhost.domain ? (
                                <Check className="size-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="size-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              nativeButton={false}
                              render={
                                <a
                                  href={`https://${vhost.domain}`}
                                  target="_blank"
                                  rel="noreferrer"
                                />
                              }
                              title="Buka Website"
                              className="size-8 text-sky-500"
                            >
                              <ExternalLink className="size-3.5" />
                            </Button>
                          </div>
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
    </div>
  )
}
