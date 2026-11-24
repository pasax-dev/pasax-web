"use client"

import * as React from "react"
import Link from "next/link"
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
  Lock,
  ShieldAlert,
  ArrowRight,
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

  const primaryKey = data.keys[0]
  const activeKey = primaryKey?.key || ""

  // Evaluasi Status Trial 14 Hari & Expired
  const nowMs = Date.now()
  const trialEndMs = primaryKey?.trialEndsAt
    ? typeof primaryKey.trialEndsAt === "number"
      ? primaryKey.trialEndsAt > 1e11
        ? primaryKey.trialEndsAt
        : primaryKey.trialEndsAt * 1000
      : new Date(primaryKey.trialEndsAt).getTime()
    : null

  const isTrial =
    primaryKey?.isTrial ??
    (data.user.plan === "pro" && primaryKey?.subscriptionStatus === "trialing")

  const isExpired = Boolean(
    primaryKey?.isExpired ||
    primaryKey?.subscriptionStatus === "expired" ||
    (trialEndMs && trialEndMs < nowMs && primaryKey?.subscriptionStatus !== "active")
  )

  const remainingDays =
    primaryKey?.remainingDays ??
    (trialEndMs
      ? Math.max(0, Math.ceil((trialEndMs - nowMs) / (1000 * 60 * 60 * 24)))
      : 14)

  const totalThreatsCount = data.threats.length

  const handleCopy = (text: string) => {
    if (isExpired || !text) return
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleCopyEnv = () => {
    if (isExpired || !activeKey) return
    const envSnippet = `APP_NAME=Laravel\nAPP_URL=http://localhost:8000\nPASAX_CLOUD_KEY=${activeKey}\nPASAX_CLOUD_URL=https://pasax-service.vercel.app`
    navigator.clipboard.writeText(envSnippet)
    setCopiedEnv(true)
    setTimeout(() => setCopiedEnv(false), 2000)
  }

  return (
    <div className="space-y-6 px-4 py-4 lg:px-6">
      {/* ------------------------------------------------------------- */}
      {/* KONDISI 1: JIKA TRIAL TELAH HABIS (> 14 HARI)                */}
      {/* ZERO-PROTECTION VIEW: HANYA TAMPIL TOTAL SERANGAN SAJA       */}
      {/* ------------------------------------------------------------- */}
      {isExpired && (
        <div className="space-y-6 rounded-base border-4 border-rose-600 bg-rose-500/10 p-6 shadow-[6px_6px_0px_0px_var(--border)] md:p-8">
          <div className="flex flex-col justify-between gap-4 border-b-2 border-rose-500/30 pb-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-base border-2 border-rose-600 bg-rose-600 font-black text-white shadow-[2px_2px_0px_0px_var(--border)]">
                <ShieldAlert className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-rose-600 bg-rose-600 font-mono text-xs font-black text-white uppercase"
                  >
                    MASA PERCOBAAN 14 HARI TELAH BERAKHIR
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-border bg-background font-mono text-xs font-bold text-rose-600"
                  >
                    PERLINDUNGAN PASAK DINONAKTIFKAN
                  </Badge>
                </div>
                <h2 className="mt-1 font-heading text-xl font-black text-foreground md:text-2xl">
                  Server Anda Tidak Terlindungi & Berjalan Tanpa Perisai
                  Keamanan
                </h2>
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center gap-2 rounded-base border-2 border-border bg-main px-4 font-bold text-main-foreground shadow-[3px_3px_0px_0px_var(--border)] hover:bg-main/90"
            >
              <span>Tingkatkan ke Pro (Aktifkan Kembali)</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* PASSIVE ATTACK COUNTER DISPLAY */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center rounded-base border-2 border-border bg-card p-6 text-center shadow-[4px_4px_0px_0px_var(--border)] md:col-span-1">
              <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Total Serangan Mengancam Server Anda:
              </span>
              <div className="my-2 font-mono text-5xl font-black text-rose-600 md:text-6xl">
                {totalThreatsCount.toLocaleString()}
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">
                Ancaman terdeteksi secara pasif.{" "}
                <strong className="text-rose-600">0 tindakan penanganan</strong>{" "}
                dilakukan karena akun kedaluwarsa.
              </p>
            </div>

            <div className="flex flex-col justify-between space-y-4 rounded-base border-2 border-border bg-background p-6 shadow-[4px_4px_0px_0px_var(--border)] md:col-span-2">
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 font-heading text-lg font-black text-foreground">
                  <AlertTriangle className="size-5 text-amber-500" />
                  <span>
                    Daftar Fitur Perlindungan yang Dikembalikan ke Default:
                  </span>
                </h3>
                <ul className="grid gap-2 font-mono text-xs text-muted-foreground sm:grid-cols-2">
                  <li className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <span className="size-1.5 rounded-full bg-rose-600" />
                    <span>
                      Kernel Packet Drop: <strong>Nonaktif</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <span className="size-1.5 rounded-full bg-rose-600" />
                    <span>
                      Inotify FIM (.env Lock): <strong>Nonaktif</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <span className="size-1.5 rounded-full bg-rose-600" />
                    <span>
                      Laravel WAF In-Memory: <strong>Mode Pasif</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <span className="size-1.5 rounded-full bg-rose-600" />
                    <span>
                      Crowd Defense Blocklist: <strong>Terputus</strong>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="rounded border border-rose-500/30 bg-rose-500/5 p-3 font-mono text-xs text-foreground">
                Semua tombol konfigurasi, unblock IP, dan scan server
                dinonaktifkan. Tingkatkan langganan Anda untuk mengembalikan
                perlindungan otomatis.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* KONDISI 2: TRIAL AKTIF (SISA HARI BERJALAN)                   */}
      {/* ------------------------------------------------------------- */}
      {!isExpired && isTrial && (
        <div className="flex flex-col justify-between gap-4 rounded-base border-2 border-amber-500 bg-amber-500/10 p-4 shadow-[3px_3px_0px_0px_var(--border)] sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded border border-amber-600 bg-amber-500 font-bold text-white">
              <Zap className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                <span>MASA PERCOBAAN PRO TRIAL AKTIF</span>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  Sisa {remainingDays} Hari Lagi
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Anda menikmati seluruh fitur Pro lengkap (Kernel Drop, WAF L7,
                dan FIM). Setelah 14 hari, perlindungan akan dinonaktifkan jika
                belum upgrade.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex h-8 items-center rounded-base border-2 border-border bg-main px-3 text-xs font-bold whitespace-nowrap text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90"
          >
            Tingkatkan ke Pro Penuh
          </Link>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. STATUS PROFIL SISTEM & KUOTA SERVER                        */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`rounded-base border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_var(--border)] ${isExpired ? "opacity-75" : ""}`}
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-2 border-border bg-main font-mono text-[11px] font-black text-main-foreground uppercase shadow-[2px_2px_0px_0px_var(--border)]"
              >
                PROFIL ARMADA: {data.plan.name} {isTrial ? "(TRIAL)" : ""}
              </Badge>
              <Badge
                variant="outline"
                className={
                  isExpired
                    ? "border-rose-500 bg-rose-500/10 font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400"
                    : "border-emerald-500 bg-emerald-500/10 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                }
              >
                STATUS: {isExpired ? "PERLINDUNGAN NONAKTIF" : "SISTEM AKTIF"}
              </Badge>
              <Badge
                variant="outline"
                className={
                  isExpired
                    ? "border-border bg-muted font-mono text-[11px] font-bold text-muted-foreground"
                    : "border-purple-500 bg-purple-500/10 font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400"
                }
              >
                FIM & KERNEL FIREWALL: {isExpired ? "PASIF" : "AKTIF"}
              </Badge>
            </div>
            <h1 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
              Portal Keamanan & Kesehatan Armada VPS
            </h1>
            <p className="max-w-2xl font-mono text-xs text-muted-foreground">
              Selamat datang, <strong>{data.user.name}</strong> (
              {data.user.email}). Pantau seluruh aplikasi web Laravel, daemon
              Sentinel, dan status kesehatan server Anda secara terpusat.
            </p>
          </div>

          {/* Kuota VPS Terpakai Widget */}
          <div className="min-w-[280px] rounded-base border-2 border-border bg-secondary-background/80 p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="mb-1.5 flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-muted-foreground">
                Kuota Server VPS:
              </span>
              <span className="font-bold text-foreground">
                {data.usage.nodesUsed} / {data.usage.nodesQuota} Node (
                {data.usage.nodesPercent}%)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full border border-border bg-background p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isExpired ? "bg-rose-500" : "bg-main"}`}
                style={{ width: `${Math.min(100, data.usage.nodesPercent)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
              <span>Aplikasi Web Terhubung: {data.apps.length}</span>
              <span
                className={
                  isExpired
                    ? "font-bold text-rose-600"
                    : "font-bold text-emerald-600 dark:text-emerald-400"
                }
              >
                {isExpired ? "Perlindungan Pasif" : "Semua Terlindungi"}
              </span>
            </div>
          </div>
        </div>

        {/* Token Lisensi & Petunjuk Cepat */}
        <div className="mt-6 grid gap-4 border-t-2 border-border/60 pt-5 md:grid-cols-2">
          {/* Box 1: Token Lisensi Pribadi */}
          <div className="space-y-2 rounded-base border-2 border-border bg-background p-4 shadow-[2px_2px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                <Zap className="size-3.5 text-amber-500" />
                Token Lisensi Universal Anda:
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {isExpired ? "KEDALUWARSA" : "Bisa untuk multi-app & VPS"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code
                className={`flex-1 overflow-x-auto rounded border border-border bg-muted px-2.5 py-1.5 font-mono text-xs font-bold ${isExpired ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {activeKey || "Belum ada token lisensi aktif"}
              </code>
              <Button
                size="sm"
                variant="outline"
                disabled={isExpired || !activeKey}
                onClick={() => handleCopy(activeKey)}
                className="h-8 border-2 border-border px-2.5 font-mono text-xs font-bold shadow-[1px_1px_0px_0px_var(--border)] disabled:cursor-not-allowed"
              >
                {copiedKey === activeKey ? (
                  <>
                    <Check className="mr-1 size-3 text-emerald-500" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 size-3" />
                    Salin
                  </>
                )}
              </Button>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {isExpired
                ? "Token ini kedaluwarsa. Perpanjang langganan untuk mengaktifkan kembali token."
                : "Gunakan key ini pada file .env di aplikasi Laravel atau instalasi Sentinel di VPS Anda."}
            </p>
          </div>

          {/* Box 2: Quick Connect Snippet */}
          <div className="space-y-2 rounded-base border-2 border-border bg-background p-4 shadow-[2px_2px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                <FileCode2 className="size-3.5 text-main" />
                Snippet Laravel .env (Cepat):
              </span>
              <Button
                size="sm"
                variant="ghost"
                disabled={isExpired || !activeKey}
                onClick={handleCopyEnv}
                className="h-6 px-1.5 font-mono text-[10px] font-bold text-main hover:bg-main hover:text-main-foreground disabled:cursor-not-allowed"
              >
                {copiedEnv ? "Tersalin!" : "Salin Konfigurasi .env"}
              </Button>
            </div>
            <div className="space-y-0.5 rounded border border-border bg-secondary-background/80 p-2 font-mono text-[11px] text-foreground">
              <div>
                PASAX_CLOUD_KEY=
                {isExpired ? "psk_expired_renew_required" : activeKey || "<BELUM_ADA_TOKEN>"}
              </div>
              <div className="text-muted-foreground">
                PASAX_CLOUD_URL=https://pasax-service.vercel.app
              </div>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {isExpired
                ? "Status lisensi: EXPIRED. Perlindungan di server host dinonaktifkan."
                : "Jalankan: php artisan pasax:cloud test untuk memverifikasi koneksi."}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SEMUA DATA TERHUBUNG (APLIKASI WEB & VPS NODES)            */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`grid gap-6 lg:grid-cols-2 ${isExpired ? "pointer-events-none opacity-60 select-none" : ""}`}
      >
        {/* Card: Aplikasi Web Laravel Terhubung */}
        <Card className="border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-heading text-lg font-black">
                <Globe className="size-4 text-emerald-500" />
                <span>Aplikasi Terhubung ({data.apps.length})</span>
              </CardTitle>
              <Badge
                variant="outline"
                className={`font-mono text-[10px] ${isExpired ? "border-rose-500 text-rose-600" : "border-emerald-500 text-emerald-600"}`}
              >
                {isExpired ? "PROTECTION DISABLED" : "WAF PROTECTED"}
              </Badge>
            </div>
            <CardDescription className="font-mono text-xs">
              Aplikasi web yang terhubung menggunakan PASAX_CLOUD_KEY Anda.
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
                <TableBody className="divide-y divide-border font-mono text-xs">
                  {data.apps.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                          <span
                            className={`size-2 rounded-full ${isExpired ? "bg-rose-500" : "bg-emerald-500"}`}
                          />
                          {app.appName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          WAF {app.wafVersion} • {app.environment}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={app.appUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline"
                        >
                          <span className="max-w-[140px] truncate">
                            {app.appUrl}
                          </span>
                          <ExternalLink className="size-3" />
                        </a>
                      </TableCell>
                      <TableCell>{app.ip}</TableCell>
                      <TableCell className="font-bold text-foreground">
                        {isExpired ? "0 (Pasif)" : app.threatsBlocked}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            isExpired
                              ? "border-rose-500 bg-rose-500/10 text-[10px] text-rose-600"
                              : "border-emerald-500 bg-emerald-500/10 text-[10px] text-emerald-600"
                          }
                        >
                          {isExpired ? "EXPIRED" : app.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Card: Server VPS Terhubung (Sentinel Host Nodes) */}
        <Card className="border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-heading text-lg font-black">
                <Server className="size-4 text-main" />
                <span>Server VPS Terhubung ({data.nodes.length})</span>
              </CardTitle>
              <Badge
                variant="outline"
                className={`font-mono text-[10px] ${isExpired ? "border-rose-500 text-rose-600" : "border-main bg-main text-main-foreground"}`}
              >
                {isExpired ? "NETFILTER DISABLED" : "SENTINEL ACTIVE"}
              </Badge>
            </div>
            <CardDescription className="font-mono text-xs">
              Node Linux yang diamankan langsung di level kernel oleh Pasax
              Sentinel.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-border bg-secondary-background/60 font-mono text-xs">
                    <TableHead>Hostname / Node</TableHead>
                    <TableHead>IP & OS</TableHead>
                    <TableHead>CPU / RAM</TableHead>
                    <TableHead>Webservers</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border font-mono text-xs">
                  {data.nodes.map((node) => (
                    <TableRow key={node.node_id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="font-bold text-foreground">
                          {node.hostname}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {node.node_id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{node.ip_v4}</div>
                        <div className="max-w-[120px] truncate text-[10px] text-muted-foreground">
                          {node.os}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5 text-[11px]">
                            <Cpu className="size-3 text-muted-foreground" />
                            {node.cpu_used_percent}%
                          </span>
                          <span className="flex items-center gap-0.5 text-[11px]">
                            <HardDrive className="size-3 text-muted-foreground" />
                            {node.memory_used_percent}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {node.webservers?.nginx?.installed && (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 font-mono text-[9px]"
                            >
                              Nginx
                            </Badge>
                          )}
                          {node.webservers?.apache2?.installed && (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 font-mono text-[9px]"
                            >
                              Apache
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            isExpired
                              ? "border-rose-500 bg-rose-500/10 text-[10px] text-rose-600"
                              : "border-emerald-500 bg-emerald-500/10 text-[10px] text-emerald-600"
                          }
                        >
                          {isExpired ? "BYPASSED" : node.status}
                        </Badge>
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
