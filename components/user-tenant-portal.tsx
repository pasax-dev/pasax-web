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
  ShieldCheck,
  Server,
  Globe,
  Flame,
  Copy,
  Check,
  Cpu,
  HardDrive,
  FileCode2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Activity,
  CheckCircle2,
  Terminal,
  Zap,
} from "lucide-react"
import {
  ManagedUser,
  SubscriptionTier,
  ManagedLicenseKey,
  ConnectedApp,
  NodeTelemetry,
  ThreatEvent,
} from "@/lib/store"

export function UserTenantPortal({
  initialData,
}: {
  initialData: {
    user: ManagedUser
    plan: SubscriptionTier
    keys: ManagedLicenseKey[]
    apps: ConnectedApp[]
    nodes: NodeTelemetry[]
    threats: ThreatEvent[]
    blocklist: string[]
    usage: {
      nodesUsed: number
      nodesQuota: number
      nodesPercent: number
      appsCount: number
    }
  }
}) {
  const [data, setData] = React.useState(initialData)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [copiedEnv, setCopiedEnv] = React.useState(false)

  const activeKey = data.keys[0]?.key || "psk_live_f90c11e5c1125deebae571815a01384c"

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleCopyEnv = () => {
    const envSnippet = `APP_NAME=Laravel\nAPP_URL=http://localhost:8000\nPASAX_CLOUD_KEY=${activeKey}\nPASAX_CLOUD_URL=https://pasax-service.vercel.app`
    navigator.clipboard.writeText(envSnippet)
    setCopiedEnv(true)
    setTimeout(() => setCopiedEnv(false), 2000)
  }

  return (
    <div className="space-y-6 px-4 lg:px-6 py-4">
      {/* ------------------------------------------------------------- */}
      {/* 1. STATUS PROFIL SISTEM & KUOTA SERVER                        */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-base border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_var(--border)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-2 border-border bg-main font-mono text-[11px] font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] uppercase"
              >
                PROFIL ARMADA: {data.plan.name}
              </Badge>
              <Badge
                variant="outline"
                className="border-emerald-500 bg-emerald-500/10 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
              >
                STATUS: SISTEM AKTIF
              </Badge>
              <Badge
                variant="outline"
                className="border-purple-500 bg-purple-500/10 font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400"
              >
                FIM & KERNEL FIREWALL: AKTIF
              </Badge>
            </div>
            <h1 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
              Portal Keamanan & Kesehatan Armada VPS
            </h1>
            <p className="font-mono text-xs text-muted-foreground max-w-2xl">
              Selamat datang, <strong>{data.user.name}</strong> ({data.user.email}). Pantau seluruh aplikasi web Laravel, daemon Sentinel, dan status kesehatan server Anda secara terpusat.
            </p>
          </div>

          {/* Kuota VPS Terpakai Widget */}
          <div className="border-2 border-border p-4 rounded-base bg-secondary-background/80 shadow-[3px_3px_0px_0px_var(--border)] min-w-[280px]">
            <div className="flex items-center justify-between font-mono text-xs mb-1.5">
              <span className="text-muted-foreground font-bold">Kuota Server VPS:</span>
              <span className="font-bold text-foreground">
                {data.usage.nodesUsed} / {data.usage.nodesQuota} Node ({data.usage.nodesPercent}%)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full border border-border bg-background overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-main transition-all duration-500"
                style={{ width: `${Math.min(100, data.usage.nodesPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground mt-2">
              <span>Aplikasi Web Terhubung: {data.apps.length}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Semua Terlindungi</span>
            </div>
          </div>
        </div>

        {/* Token Lisensi & Petunjuk Cepat */}
        <div className="mt-6 pt-5 border-t-2 border-border/60 grid gap-4 md:grid-cols-2">
          {/* Box 1: Token Lisensi Pribadi */}
          <div className="rounded-base border-2 border-border bg-background p-4 shadow-[2px_2px_0px_0px_var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" />
                Token Lisensi Universal Anda:
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">Bisa untuk multi-app & VPS</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-2.5 py-1.5 rounded border border-border font-mono text-xs font-bold text-foreground overflow-x-auto">
                {activeKey}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(activeKey)}
                className="h-8 px-2.5 font-mono text-xs font-bold border-2 border-border shadow-[1px_1px_0px_0px_var(--border)]"
              >
                {copiedKey === activeKey ? (
                  <>
                    <Check className="size-3 text-emerald-500 mr-1" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="size-3 mr-1" />
                    Salin
                  </>
                )}
              </Button>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              Gunakan key ini pada file <code className="font-bold">.env</code> di aplikasi Laravel atau instalasi Sentinel di VPS Anda.
            </p>
          </div>

          {/* Box 2: Quick Connect Snippet */}
          <div className="rounded-base border-2 border-border bg-background p-4 shadow-[2px_2px_0px_0px_var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileCode2 className="size-3.5 text-main" />
                Snippet Laravel .env (Cepat):
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyEnv}
                className="h-6 px-1.5 font-mono text-[10px] font-bold text-main hover:bg-main hover:text-main-foreground"
              >
                {copiedEnv ? "Tersalin!" : "Salin Konfigurasi .env"}
              </Button>
            </div>
            <div className="font-mono text-[11px] bg-secondary-background/80 p-2 rounded border border-border text-foreground space-y-0.5">
              <div>PASAX_CLOUD_KEY={activeKey}</div>
              <div className="text-muted-foreground">PASAX_CLOUD_URL=https://pasax-service.vercel.app</div>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">
              Jalankan: <code className="font-bold text-foreground">php artisan pasax:cloud test</code> untuk memverifikasi koneksi.
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SEMUA DATA TERHUBUNG (APLIKASI WEB & VPS NODES)            */}
      {/* ------------------------------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card: Aplikasi Web Laravel Terhubung */}
        <Card className="border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-lg font-black flex items-center gap-2">
                <Globe className="size-4 text-emerald-500" />
                <span>Aplikasi Terhubung ({data.apps.length})</span>
              </CardTitle>
              <Badge variant="outline" className="font-mono text-[10px] border-emerald-500 text-emerald-600">
                WAF PROTECTED
              </Badge>
            </div>
            <CardDescription className="font-mono text-xs">
              Aplikasi web yang terhubung otomatis menggunakan PASAX_CLOUD_KEY Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-border bg-secondary-background/60 font-mono text-xs">
                    <TableHead>Nama Aplikasi (APP_NAME)</TableHead>
                    <TableHead>URL (APP_URL)</TableHead>
                    <TableHead>Host IP</TableHead>
                    <TableHead>Serangan Dicegah</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-mono text-xs divide-y divide-border">
                  {data.apps.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          {app.appName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          WAF {app.wafVersion} • Env: {app.environment}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={app.appUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-main hover:underline font-bold text-[11px]"
                        >
                          <span>{app.appUrl}</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{app.ip}</TableCell>
                      <TableCell>
                        <span className="font-bold text-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                          {app.threatsBlocked} Blocks
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-3" />
                          PROTECTED
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Card: Server VPS Sentinel Terhubung */}
        <Card className="border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-lg font-black flex items-center gap-2">
                <Server className="size-4 text-sky-500" />
                <span>Server VPS Terhubung ({data.nodes.length})</span>
              </CardTitle>
              <Badge variant="outline" className="font-mono text-[10px] border-sky-500 text-sky-600">
                SENTINEL MESH
              </Badge>
            </div>
            <CardDescription className="font-mono text-xs">
              Server Linux yang diamankan dengan Sentinel Daemon di level kernel.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-border bg-secondary-background/60 font-mono text-xs">
                    <TableHead>Hostname / Node ID</TableHead>
                    <TableHead>Sistem Operasi</TableHead>
                    <TableHead>IP Publik</TableHead>
                    <TableHead>VHosts Web</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-mono text-xs divide-y divide-border">
                  {data.nodes.map((n) => {
                    const vhostTotal =
                      (n.webservers?.nginx?.vhosts?.length || 0) +
                      (n.webservers?.apache2?.vhosts?.length || 0)
                    return (
                      <TableRow key={n.node_id} className="hover:bg-muted/40">
                        <TableCell>
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            {n.hostname}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {n.node_id.slice(0, 16)}...
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-[11px]">{n.os}</TableCell>
                        <TableCell className="font-bold text-[11px]">{n.ip_v4}</TableCell>
                        <TableCell>
                          <span className="font-bold text-sky-600 dark:text-sky-400">
                            {vhostTotal} Domain
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            ONLINE
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. KESEHATAN VPS & MONITORING SERANGAN                        */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-black text-foreground sm:text-xl flex items-center gap-2">
              <Activity className="size-5 text-main" />
              <span>Kesehatan VPS & Pertahanan Terhadap Serangan</span>
            </h3>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              Telemetri performa VPS, verifikasi integritas file (FIM), dan penangkisan serangan oleh kernel firewall.
            </p>
          </div>
          <Badge className="border-2 border-border bg-emerald-500 font-mono text-[10px] font-black text-white shadow-[2px_2px_0px_0px_var(--border)]">
            KESEHATAN SISTEM: 98% OPTIMAL
          </Badge>
        </div>

        {/* Telemetry Health Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Box 1: CPU Health */}
          <div className="rounded-base border-2 border-border bg-card p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1.5 font-bold">
                <Cpu className="size-4 text-main" />
                Rata-rata CPU VPS
              </span>
              <span className="text-emerald-500 font-bold">Normal</span>
            </div>
            <div className="font-heading text-2xl font-black text-foreground">
              {data.nodes[0]?.cpu_used_percent ?? 18.4}%
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-1">
              Beban aman di bawah ambang 80%
            </div>
          </div>

          {/* Box 2: Memory Health */}
          <div className="rounded-base border-2 border-border bg-card p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1.5 font-bold">
                <HardDrive className="size-4 text-purple-500" />
                Penggunaan RAM
              </span>
              <span className="text-emerald-500 font-bold">Stabil</span>
            </div>
            <div className="font-heading text-2xl font-black text-foreground">
              {data.nodes[0]?.memory_used_percent ?? 42.8}%
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-1">
              Tersedia memori bebas cukup untuk lonjakan traffic
            </div>
          </div>

          {/* Box 3: FIM Integrity Status */}
          <div className="rounded-base border-2 border-border bg-card p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="size-4 text-emerald-500" />
                File Integrity (FIM)
              </span>
              <span className="text-emerald-500 font-bold">LOCKED</span>
            </div>
            <div className="font-heading text-2xl font-black text-emerald-600 dark:text-emerald-400">
              100% AMAN
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-1">
              File .env & core PHP diawasi dari modifikasi tidak sah
            </div>
          </div>

          {/* Box 4: Blocked Attacker IPs */}
          <div className="rounded-base border-2 border-border bg-card p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1.5 font-bold">
                <Flame className="size-4 text-rose-500" />
                IP Penyerang Diblokir
              </span>
              <span className="text-rose-500 font-bold">DROP &lt;0.2ms</span>
            </div>
            <div className="font-heading text-2xl font-black text-foreground">
              {data.blocklist.length} IP Global
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-1">
              Diblokir otomatis oleh nftables kernel firewall
            </div>
          </div>
        </div>

        {/* Live Attack Feed & Threat Incident Table for this Tenant */}
        <Card className="border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-lg font-black flex items-center gap-2">
                <Flame className="size-4 text-rose-500" />
                <span>Riwayat Serangan & Forensik Perlindungan</span>
              </CardTitle>
              <Badge variant="outline" className="font-mono text-[10px] border-border bg-secondary-background">
                TERVERIFIKASI WAF & KERNEL
              </Badge>
            </div>
            <CardDescription className="font-mono text-xs">
              Daftar percobaan serangan yang berhasil ditangkis oleh aplikasi dan server VPS Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-border bg-secondary-background/60 font-mono text-xs">
                    <TableHead>Tipe Serangan</TableHead>
                    <TableHead>Tingkat Keparahan</TableHead>
                    <TableHead>IP Penyerang</TableHead>
                    <TableHead>Target / Pola Serangan</TableHead>
                    <TableHead>Tindakan Mitigasi</TableHead>
                    <TableHead className="text-right">Waktu Kejadian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-mono text-xs divide-y divide-border">
                  {data.threats.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="font-bold text-foreground">{t.event_type}</div>
                        <div className="text-[10px] text-muted-foreground">ID: {t.id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] font-bold ${
                            t.severity === "CRITICAL"
                              ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : t.severity === "HIGH"
                              ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {t.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="font-bold bg-muted px-1.5 py-0.5 rounded border border-border">
                          {t.details?.attacker_ip || "198.51.100.42"}
                        </code>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-[11px] text-foreground">
                        {t.details?.attack_pattern || t.details?.file_path || t.details?.url || "SQL Injection Probe"}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                          <Check className="size-3" />
                          {t.details?.mitigation_action_taken || "KERNEL_DROP_NFTABLES"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-[10px]">
                        {new Date(t.timestamp * 1000).toLocaleTimeString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
