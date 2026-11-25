"use client"

import * as React from "react"
import {
  Radar,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Bot,
  Cookie,
  MapPin,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Wifi,
  ExternalLink,
  Clock,
  UserCheck,
  Layers,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { cn } from "@/lib/utils"
import type { VisitorLogRecord, VisitorSummary } from "@/lib/pasax-cloud"

interface VisitorsClientProps {
  initialSummary: VisitorSummary
  initialVisitors: VisitorLogRecord[]
}

function countryFlagEmoji(code: string | null | undefined): string {
  if (!code || code.length !== 2 || !/^[A-Za-z]{2}$/.test(code)) return "🌐"
  const upper = code.toUpperCase()
  return String.fromCodePoint(
    upper.charCodeAt(0) + 127397,
    upper.charCodeAt(1) + 127397
  )
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-"
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function ConsentBadge({ status }: { status: string }) {
  switch (status) {
    case "accepted_all":
      return (
        <Badge className="border-emerald-500/40 bg-emerald-500/15 font-mono text-[10px] font-bold text-emerald-500">
          TERIMA SEMUA
        </Badge>
      )
    case "custom":
      return (
        <Badge className="border-sky-500/40 bg-sky-500/15 font-mono text-[10px] font-bold text-sky-500">
          KUSTOM
        </Badge>
      )
    case "essential_only":
      return (
        <Badge className="border-amber-500/40 bg-amber-500/15 font-mono text-[10px] font-bold text-amber-500">
          ESENSIAL SAJA
        </Badge>
      )
    default:
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] text-muted-foreground"
        >
          MENUNGGU
        </Badge>
      )
  }
}

function DeviceIcon({ type }: { type: string }) {
  switch (type) {
    case "mobile":
      return <Smartphone className="size-3.5 text-sky-500" />
    case "tablet":
      return <Tablet className="size-3.5 text-indigo-500" />
    case "bot":
      return <Bot className="size-3.5 text-amber-500" />
    default:
      return <Monitor className="size-3.5 text-emerald-500" />
  }
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/50 py-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3 last:border-b-0">
      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "text-left text-xs break-words text-foreground sm:max-w-[65%] sm:text-right",
          mono && "font-mono tabular-nums"
        )}
      >
        {value === null || value === undefined || value === "" ? (
          <span className="text-muted-foreground/50">—</span>
        ) : (
          value
        )}
      </span>
    </div>
  )
}

export function VisitorsClient({
  initialSummary,
  initialVisitors,
}: VisitorsClientProps) {
  const [summary, setSummary] = React.useState<VisitorSummary>(initialSummary)
  const [visitors, setVisitors] =
    React.useState<VisitorLogRecord[]>(initialVisitors)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [countryFilter, setCountryFilter] = React.useState("all")
  const [deviceFilter, setDeviceFilter] = React.useState("all")
  const [consentFilter, setConsentFilter] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedVisitor, setSelectedVisitor] =
    React.useState<VisitorLogRecord | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const refreshVisitors = async (overrides?: {
    q?: string
    country?: string
    deviceType?: string
    consentStatus?: string
  }) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      const q = overrides?.q ?? searchQuery
      const c = overrides?.country ?? countryFilter
      const d = overrides?.deviceType ?? deviceFilter
      const cs = overrides?.consentStatus ?? consentFilter
      if (q.trim()) params.set("q", q.trim())
      if (c !== "all") params.set("country", c)
      if (d !== "all") params.set("deviceType", d)
      if (cs !== "all") params.set("consentStatus", cs)
      params.set("limit", "200")

      const res = await fetch(`/api/admin/visitors?${params.toString()}`, {
        cache: "no-store",
      })
      if (res.ok) {
        const json = await res.json()
        if (json.summary) setSummary(json.summary)
        if (Array.isArray(json.data)) setVisitors(json.data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `/api/admin/visitors?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      )
      if (res.ok) {
        setVisitors((prev) => prev.filter((v) => v.id !== id))
        if (selectedVisitor?.id === id) setSelectedVisitor(null)
      }
    } catch {
      // ignore
    }
  }

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val)
    setCopiedId(key)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(visitors, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pasax-visitor-intelligence-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredVisitors = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return visitors.filter((v) => {
      if (
        countryFilter !== "all" &&
        v.country !== countryFilter &&
        v.countryCode !== countryFilter
      ) {
        return false
      }
      if (deviceFilter !== "all" && v.deviceType !== deviceFilter) {
        return false
      }
      if (consentFilter !== "all" && v.consentStatus !== consentFilter) {
        return false
      }
      if (!q) return true
      const haystack = [
        v.ipAddress,
        v.country,
        v.countryCode,
        v.region,
        v.city,
        v.district,
        v.streetAddress,
        v.fullAddress,
        v.postalCode,
        v.isp,
        v.asn,
        v.org,
        v.osName,
        v.osVersion,
        v.browserName,
        v.browserVersion,
        v.deviceVendor,
        v.deviceModel,
        v.pagePath,
        v.referrer,
        v.authenticatedEmail,
        v.visitorId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [visitors, searchQuery, countryFilter, deviceFilter, consentFilter])

  const uniqueCountryOptions = React.useMemo(() => {
    const set = new Set<string>()
    for (const v of visitors) {
      if (v.country) set.add(v.country)
    }
    return Array.from(set).sort()
  }, [visitors])

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-xl border-2 border-border bg-card p-5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-amber-500/40 bg-amber-500/15 font-mono text-[10px] font-bold tracking-wider text-amber-500">
              SUPERADMIN ONLY
            </Badge>
            <Badge
              variant="outline"
              className="font-mono text-[10px] tracking-wider"
            >
              COOKIE &amp; VISITOR INTELLIGENCE
            </Badge>
          </div>
          <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Intelijen Pengunjung &amp; Persetujuan Cookie
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Menampilkan seluruh telemetri kunjungan yang tersimpan di database
            Pasax Cloud: alamat IP, ISP/ASN, detail alamat &amp; koordinat
            geografis, negara, kota, OS, browser, perangkat keras, rujukan,
            hingga status persetujuan cookie.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refreshVisitors()}
            disabled={isLoading}
            className="gap-1.5 font-mono text-xs"
          >
            <RefreshCw
              className={cn("size-3.5", isLoading && "animate-spin")}
            />
            <span>Refresh Data</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            disabled={visitors.length === 0}
            className="gap-1.5 font-mono text-xs"
          >
            <Download className="size-3.5" />
            <span>Ekspor JSON</span>
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Card className="border-2 border-border">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <span>Total Kunjungan</span>
              <Radar className="size-3.5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-black tabular-nums">
              {summary.totalVisits.toLocaleString("id-ID")}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Rekam jejak tersimpan
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <span>Pengunjung Unik</span>
              <UserCheck className="size-3.5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-black tabular-nums">
              {summary.uniqueVisitors.toLocaleString("id-ID")}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Berdasarkan Cookie / IP
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <span>Alamat IP Unik</span>
              <Wifi className="size-3.5 text-sky-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-black tabular-nums">
              {summary.uniqueIps.toLocaleString("id-ID")}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Jaringan publik &amp; lokal
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <span>Cookie Disetujui</span>
              <Cookie className="size-3.5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-black tabular-nums">
              {summary.consentedCount.toLocaleString("id-ID")}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Terima Semua / Kustom
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <span>GPS Presisi</span>
              <MapPin className="size-3.5 text-rose-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-black tabular-nums">
              {summary.gpsPrecisionCount.toLocaleString("id-ID")}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Koordinat izin browser
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <span>Negara Asal</span>
              <Globe className="size-3.5 text-indigo-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-black tabular-nums">
              {summary.topCountries.length.toLocaleString("id-ID")}
            </div>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              Top: {summary.topCountries[0]?.name || "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Breakdown Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Top Negara", items: summary.topCountries.slice(0, 5) },
          { title: "Perangkat (Device)", items: summary.deviceBreakdown.slice(0, 5) },
          { title: "Sistem Operasi (OS)", items: summary.osBreakdown.slice(0, 5) },
          { title: "Browser Pengunjung", items: summary.browserBreakdown.slice(0, 5) },
        ].map((group) => (
          <Card key={group.title} className="border-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xs font-bold tracking-wider uppercase">
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {group.items.length === 0 ? (
                <p className="text-xs text-muted-foreground">Belum ada data</p>
              ) : (
                group.items.map((item) => {
                  const pct =
                    summary.totalVisits > 0
                      ? Math.round((item.count / summary.totalVisits) * 100)
                      : 0
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate font-medium text-foreground">
                          {item.name}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                          {item.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="border-2 border-border">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari IP, alamat lengkap, negara, kota, ISP, OS, browser, perangkat, path, atau email..."
                className="pl-9 font-mono text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                aria-label="Filter Negara"
                className="h-9 rounded-md border border-border bg-background px-2.5 font-mono text-xs text-foreground"
              >
                <option value="all">Semua Negara</option>
                {uniqueCountryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                aria-label="Filter Perangkat"
                className="h-9 rounded-md border border-border bg-background px-2.5 font-mono text-xs text-foreground"
              >
                <option value="all">Semua Device</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
                <option value="bot">Bot / CLI</option>
              </select>

              <select
                value={consentFilter}
                onChange={(e) => setConsentFilter(e.target.value)}
                aria-label="Filter Status Cookie"
                className="h-9 rounded-md border border-border bg-background px-2.5 font-mono text-xs text-foreground"
              >
                <option value="all">Semua Status Cookie</option>
                <option value="accepted_all">Terima Semua</option>
                <option value="custom">Kustom</option>
                <option value="essential_only">Esensial Saja</option>
                <option value="pending">Menunggu</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visitors Table */}
      <Card className="border-2 border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="font-heading text-base font-bold">
            Daftar Kunjungan Tercatat ({filteredVisitors.length})
          </CardTitle>
          <span className="font-mono text-[11px] text-muted-foreground">
            Klik &quot;Detail Lengkap&quot; untuk melihat seluruh atribut
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-mono text-[11px] uppercase">
                    Waktu
                  </TableHead>
                  <TableHead className="font-mono text-[11px] uppercase">
                    IP &amp; Jaringan
                  </TableHead>
                  <TableHead className="font-mono text-[11px] uppercase">
                    Negara &amp; Detail Alamat
                  </TableHead>
                  <TableHead className="font-mono text-[11px] uppercase">
                    OS, Browser &amp; Device
                  </TableHead>
                  <TableHead className="font-mono text-[11px] uppercase">
                    Halaman &amp; Akun
                  </TableHead>
                  <TableHead className="font-mono text-[11px] uppercase">
                    Cookie
                  </TableHead>
                  <TableHead className="text-right font-mono text-[11px] uppercase">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Belum ada log pengunjung yang cocok dengan filter Anda.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVisitors.map((v) => (
                    <TableRow key={v.id} className="align-top">
                      <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground tabular-nums">
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Clock className="size-3 text-muted-foreground" />
                          <span>{formatDateTime(v.visitedAt)}</span>
                        </div>
                        {v.timezone && (
                          <div className="mt-0.5 text-[10px] text-muted-foreground">
                            {v.timezone}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="min-w-[170px]">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground tabular-nums">
                          <span>{v.ipAddress}</span>
                          {v.isProxy && (
                            <Badge className="bg-rose-500/15 font-mono text-[9px] text-rose-500">
                              PROXY/VPN
                            </Badge>
                          )}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          {v.isp || v.org || "ISP Tidak Diketahui"}
                        </div>
                        {v.asn && (
                          <div className="font-mono text-[10px] text-muted-foreground/80">
                            {v.asn}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="max-w-[260px] min-w-[200px]">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <span>{countryFlagEmoji(v.countryCode)}</span>
                          <span>
                            {v.country || "Unknown"}
                            {v.countryCode ? ` (${v.countryCode})` : ""}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          {[v.city, v.region, v.postalCode]
                            .filter(Boolean)
                            .join(", ") || "Wilayah tidak tersedia"}
                        </div>
                        {v.fullAddress && (
                          <div className="mt-0.5 line-clamp-2 text-[11px] text-foreground/80">
                            {v.fullAddress}
                          </div>
                        )}
                        {v.latitude && v.longitude && (
                          <div className="mt-0.5 font-mono text-[10px] text-sky-500 tabular-nums">
                            {v.latitude}, {v.longitude} ({v.geoSource})
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="min-w-[190px]">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <DeviceIcon type={v.deviceType} />
                          <span className="capitalize">{v.deviceType}</span>
                          {(v.deviceVendor || v.deviceModel) && (
                            <span className="font-normal text-muted-foreground">
                              •{" "}
                              {[v.deviceVendor, v.deviceModel]
                                .filter(Boolean)
                                .join(" ")}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-[11px] text-foreground/85">
                          OS: {v.osName || "?"} {v.osVersion || ""}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Browser: {v.browserName || "?"} {v.browserVersion || ""}
                        </div>
                        {v.screenResolution && (
                          <div className="font-mono text-[10px] text-muted-foreground tabular-nums">
                            Layar {v.screenResolution} •{" "}
                            {v.cpuCores ? `${v.cpuCores}C` : ""}
                            {v.deviceMemoryGb ? ` / ${v.deviceMemoryGb}GB` : ""}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="max-w-[190px]">
                        <div className="truncate font-mono text-xs font-semibold text-foreground">
                          {v.pagePath}
                        </div>
                        {v.authenticatedEmail && (
                          <div className="mt-0.5 truncate font-mono text-[10px] text-emerald-500">
                            {v.authenticatedEmail} ({v.authenticatedRole || "User"})
                          </div>
                        )}
                        {v.referrer && (
                          <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
                            Ref: {v.referrer}
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <ConsentBadge status={v.consentStatus} />
                        {v.visitorId && (
                          <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                            {v.visitorId.slice(0, 12)}…
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedVisitor(v)}
                            className="h-7 gap-1 px-2 font-mono text-[11px]"
                          >
                            <Eye className="size-3" />
                            <span>Detail Lengkap</span>
                          </Button>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleDelete(v.id)}
                            title="Hapus Log Visitor"
                            className="size-7 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Complete Visitor Telemetry Inspector Modal */}
      <Dialog
        open={Boolean(selectedVisitor)}
        onOpenChange={(open) => {
          if (!open) setSelectedVisitor(null)
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-background">
          {selectedVisitor && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <ConsentBadge status={selectedVisitor.consentStatus} />
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {selectedVisitor.geoSource}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {selectedVisitor.deviceType.toUpperCase()}
                  </Badge>
                </div>
                <DialogTitle className="font-heading text-xl font-black">
                  {countryFlagEmoji(selectedVisitor.countryCode)}{" "}
                  {selectedVisitor.ipAddress} —{" "}
                  {selectedVisitor.city || selectedVisitor.country || "Detail Pengunjung"}
                </DialogTitle>
                <DialogDescription className="font-mono text-xs">
                  Visit ID: {selectedVisitor.id} • Tercatat:{" "}
                  {formatDateTime(selectedVisitor.visitedAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* 1. Alamat & Geolokasi */}
                <Card className="border border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-500 uppercase">
                      <MapPin className="size-3.5" />
                      <span>Detail Alamat &amp; Negara</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0.5">
                    <InfoRow
                      label="Alamat Lengkap"
                      value={selectedVisitor.fullAddress}
                    />
                    <InfoRow
                      label="Jalan / Street"
                      value={selectedVisitor.streetAddress}
                    />
                    <InfoRow
                      label="Kecamatan / District"
                      value={selectedVisitor.district}
                    />
                    <InfoRow
                      label="Kota / Kabupaten"
                      value={selectedVisitor.city}
                    />
                    <InfoRow
                      label="Provinsi / Region"
                      value={`${selectedVisitor.region || "—"} ${selectedVisitor.regionCode ? `(${selectedVisitor.regionCode})` : ""}`}
                    />
                    <InfoRow
                      label="Kode Pos"
                      value={selectedVisitor.postalCode}
                      mono
                    />
                    <InfoRow
                      label="Negara"
                      value={`${countryFlagEmoji(selectedVisitor.countryCode)} ${selectedVisitor.country || "—"} (${selectedVisitor.countryCode || "—"})`}
                    />
                    <InfoRow
                      label="Koordinat (Lat, Lon)"
                      value={
                        selectedVisitor.latitude && selectedVisitor.longitude ? (
                          <span className="inline-flex flex-wrap items-center justify-end gap-1.5">
                            <span className="whitespace-nowrap">
                              {selectedVisitor.latitude},{" "}
                              {selectedVisitor.longitude}
                            </span>
                            <a
                              href={`https://www.google.com/maps?q=${selectedVisitor.latitude},${selectedVisitor.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sky-500 underline"
                            >
                              Peta <ExternalLink className="size-3" />
                            </a>
                          </span>
                        ) : null
                      }
                      mono
                    />
                    <InfoRow
                      label="Sumber Lokasi"
                      value={selectedVisitor.geoSource}
                      mono
                    />
                    <InfoRow
                      label="Zona Waktu & Mata Uang"
                      value={[
                        selectedVisitor.timezone,
                        selectedVisitor.currency,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                      mono
                    />
                  </CardContent>
                </Card>

                {/* 2. Jaringan & IP */}
                <Card className="border border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-1.5 font-mono text-xs font-bold text-sky-500 uppercase">
                      <Wifi className="size-3.5" />
                      <span>Jaringan &amp; IP Intelligence</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0.5">
                    <InfoRow
                      label="IP Address"
                      value={
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(selectedVisitor.ipAddress, "ip")
                          }
                          className="inline-flex items-center gap-1 font-mono hover:text-amber-500"
                        >
                          <span>{selectedVisitor.ipAddress}</span>
                          {copiedId === "ip" ? (
                            <Check className="size-3 text-emerald-500" />
                          ) : (
                            <Copy className="size-3 text-muted-foreground" />
                          )}
                        </button>
                      }
                      mono
                    />
                    <InfoRow
                      label="X-Forwarded-For"
                      value={selectedVisitor.forwardedFor}
                      mono
                    />
                    <InfoRow label="ISP" value={selectedVisitor.isp} />
                    <InfoRow label="ASN" value={selectedVisitor.asn} mono />
                    <InfoRow label="Organisasi" value={selectedVisitor.org} />
                    <InfoRow
                      label="Proxy / VPN / Tor"
                      value={selectedVisitor.isProxy ? "Ya (Terdeteksi)" : "Tidak"}
                    />
                    <InfoRow
                      label="Hosting / Datacenter"
                      value={selectedVisitor.isHosting ? "Ya" : "Tidak"}
                    />
                    <InfoRow
                      label="Tipe Koneksi"
                      value={selectedVisitor.connectionType}
                      mono
                    />
                    <InfoRow
                      label="Downlink / RTT"
                      value={
                        selectedVisitor.downlinkMbps || selectedVisitor.rttMs
                          ? `${selectedVisitor.downlinkMbps || "?"} Mbps • ${selectedVisitor.rttMs ?? "?"} ms`
                          : null
                      }
                      mono
                    />
                  </CardContent>
                </Card>

                {/* 3. OS, Browser & Device */}
                <Card className="border border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-500 uppercase">
                      <Monitor className="size-3.5" />
                      <span>OS, Browser &amp; Perangkat</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0.5">
                    <InfoRow
                      label="Sistem Operasi"
                      value={`${selectedVisitor.osName || "—"} ${selectedVisitor.osVersion || ""}`}
                    />
                    <InfoRow
                      label="Browser &amp; Engine"
                      value={`${selectedVisitor.browserName || "—"} ${selectedVisitor.browserVersion || ""} (${selectedVisitor.browserEngine || "—"})`}
                    />
                    <InfoRow
                      label="Tipe Perangkat"
                      value={selectedVisitor.deviceType}
                      mono
                    />
                    <InfoRow
                      label="Vendor / Model"
                      value={[
                        selectedVisitor.deviceVendor,
                        selectedVisitor.deviceModel,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                    <InfoRow
                      label="Platform / Arsitektur"
                      value={[
                        selectedVisitor.platform,
                        selectedVisitor.architecture,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                      mono
                    />
                    <InfoRow
                      label="Mobile / Bot"
                      value={`Mobile: ${selectedVisitor.isMobile ? "Ya" : "Tidak"} • Bot: ${selectedVisitor.isBot ? "Ya" : "Tidak"}`}
                    />
                    <InfoRow
                      label="User-Agent"
                      value={selectedVisitor.userAgent}
                      mono
                    />
                  </CardContent>
                </Card>

                {/* 4. Hardware, Layar & Cookie Consent */}
                <Card className="border border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-1.5 font-mono text-xs font-bold text-purple-500 uppercase">
                      <Cpu className="size-3.5" />
                      <span>Hardware, Layar &amp; Cookie</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0.5">
                    <InfoRow
                      label="Resolusi Layar / Viewport"
                      value={`${selectedVisitor.screenResolution || "—"} / ${selectedVisitor.viewportSize || "—"} (DPR ${selectedVisitor.pixelRatio || "1"})`}
                      mono
                    />
                    <InfoRow
                      label="CPU Cores / RAM"
                      value={`${selectedVisitor.cpuCores ?? "—"} Cores • ${selectedVisitor.deviceMemoryGb || "—"} GB`}
                      mono
                    />
                    <InfoRow
                      label="GPU Renderer"
                      value={selectedVisitor.gpuRenderer}
                      mono
                    />
                    <InfoRow
                      label="Touch / Color Depth"
                      value={`${selectedVisitor.touchSupport ? `Ya (${selectedVisitor.maxTouchPoints} pts)` : "Tidak"} • ${selectedVisitor.colorDepth ?? "—"}-bit`}
                      mono
                    />
                    <InfoRow
                      label="Baterai"
                      value={
                        selectedVisitor.batteryInfo
                          ? `${selectedVisitor.batteryInfo.level ?? "?"}% (${selectedVisitor.batteryInfo.charging ? "Mengisi" : "Baterai"})`
                          : null
                      }
                      mono
                    />
                    <InfoRow
                      label="Bahasa"
                      value={
                        selectedVisitor.languages?.length
                          ? selectedVisitor.languages.join(", ")
                          : selectedVisitor.language
                      }
                      mono
                    />
                    <InfoRow
                      label="Visitor Cookie ID"
                      value={selectedVisitor.visitorId}
                      mono
                    />
                    <InfoRow
                      label="Session ID"
                      value={selectedVisitor.sessionId}
                      mono
                    />
                    <InfoRow
                      label="Preferensi Cookie"
                      value={`Essential: ${selectedVisitor.consentPreferences?.essential ? "✓" : "✗"} | Analytics: ${selectedVisitor.consentPreferences?.analytics ? "✓" : "✗"} | Telemetry: ${selectedVisitor.consentPreferences?.telemetry ? "✓" : "✗"} | GeoGPS: ${selectedVisitor.consentPreferences?.geolocation ? "✓" : "✗"}`}
                      mono
                    />
                  </CardContent>
                </Card>
              </div>

              {/* 5. Navigasi & Auth */}
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                    <span>Navigasi, UTM &amp; Akun Sesi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0.5">
                  <InfoRow
                    label="Path &amp; URL Penuh"
                    value={selectedVisitor.pageUrl || selectedVisitor.pagePath}
                    mono
                  />
                  <InfoRow
                    label="Judul Halaman"
                    value={selectedVisitor.pageTitle}
                  />
                  <InfoRow
                    label="Referrer"
                    value={selectedVisitor.referrer}
                    mono
                  />
                  <InfoRow
                    label="UTM (Source / Medium / Campaign)"
                    value={
                      [
                        selectedVisitor.utmSource,
                        selectedVisitor.utmMedium,
                        selectedVisitor.utmCampaign,
                      ].some(Boolean)
                        ? `${selectedVisitor.utmSource || "-"} / ${selectedVisitor.utmMedium || "-"} / ${selectedVisitor.utmCampaign || "-"}`
                        : null
                    }
                    mono
                  />
                  <InfoRow
                    label="Akun Login"
                    value={
                      selectedVisitor.authenticatedEmail
                        ? `${selectedVisitor.authenticatedEmail} (${selectedVisitor.authenticatedRole || "User"})`
                        : "Guest (Belum Login)"
                    }
                    mono
                  />
                  <InfoRow
                    label="Cookies Enabled / DNT"
                    value={`Cookies: ${selectedVisitor.cookiesEnabled ? "Ya" : "Tidak"} • DoNotTrack: ${selectedVisitor.doNotTrack ? "Ya" : "Tidak"}`}
                    mono
                  />
                </CardContent>
              </Card>

              {/* 6. Raw Headers & Extra Metadata */}
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                    <Layers className="size-3.5 text-muted-foreground" />
                    <span>Raw HTTP Headers &amp; Extra Metadata</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-56 overflow-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-[11px] text-foreground">
                    {JSON.stringify(
                      {
                        rawHeaders: selectedVisitor.rawHeaders,
                        extraMetadata: selectedVisitor.extraMetadata,
                      },
                      null,
                      2
                    )}
                  </pre>
                </CardContent>
              </Card>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
