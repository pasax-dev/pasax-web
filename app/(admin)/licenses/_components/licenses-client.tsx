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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Key,
  Server,
  Plus,
  Search,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Power,
  Trash2,
  Globe,
  Code2,
  Terminal,
  Clock,
  Sparkles,
} from "lucide-react"
import { ManagedLicenseKey, ManagedUser } from "@/lib/store"

interface LicensesClientProps {
  initialKeys: ManagedLicenseKey[]
  initialUsers: ManagedUser[]
  currentRole?: string
}

const modalInputClass =
  "h-10 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-main focus-visible:ring-0"
const modalSelectClass =
  "h-10 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold text-foreground focus:border-main focus:outline-hidden"
const modalLabelClass = "block font-sans text-xs font-semibold text-foreground"

export function LicensesClient({
  initialKeys = [],
  initialUsers = [],
  currentRole = "Admin",
}: LicensesClientProps) {
  const isAdminOrSuperadmin =
    currentRole === "Superadmin" || currentRole === "Admin"
  const [keys, setKeys] = React.useState<ManagedLicenseKey[]>(initialKeys)
  const [users, setUsers] = React.useState<ManagedUser[]>(initialUsers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  // Dialogs
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isGuideOpen, setIsGuideOpen] = React.useState(false)
  const [selectedKey, setSelectedKey] =
    React.useState<ManagedLicenseKey | null>(null)
  const [selectedUserId, setSelectedUserId] = React.useState(users[0]?.id || "")
  const [keyName, setKeyName] = React.useState("")
  const [formError, setFormError] = React.useState<string | null>(null)
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const [resKeys, resUsers] = await Promise.all([
        fetch("/api/admin/licenses"),
        fetch("/api/admin/users"),
      ])
      if (resKeys.ok) {
        const d = await resKeys.json()
        if (d.data) setKeys(d.data)
      }
      if (resUsers.ok) {
        const u = await resUsers.json()
        if (u.data) setUsers(u.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    if (!selectedUserId) {
      setFormError("Pilih pengguna pemilik lisensi.")
      return
    }

    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          name: keyName || undefined,
        }),
      })
      const result = await res.json()
      if (!res.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal menerbitkan token.")
      }

      setFormSuccess("Token lisensi baru berhasil diterbitkan.")
      setTimeout(() => {
        setIsCreateOpen(false)
        refreshData()
      }, 1000)
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  const handleToggle = async (key: ManagedLicenseKey) => {
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: key.id }),
      })
      if (res.ok) {
        refreshData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpgradeToPro = async (id: string) => {
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "convert_pro" }),
      })
      if (res.ok) refreshData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleExtendTrial = async (id: string, days = 14) => {
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "extend_trial", days }),
      })
      if (res.ok) refreshData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus token lisensi ini?")) return
    try {
      const res = await fetch(`/api/admin/licenses?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        refreshData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredKeys = React.useMemo(() => {
    return keys.filter((k) => {
      const q = searchQuery.toLowerCase().trim()
      return (
        !q ||
        k.key.toLowerCase().includes(q) ||
        k.name.toLowerCase().includes(q) ||
        k.userName.toLowerCase().includes(q) ||
        k.userEmail.toLowerCase().includes(q)
      )
    })
  }, [keys, searchQuery])

  const totalKeys = keys.length
  const activeKeys = keys.filter((k) => k.isActive).length
  const totalConnectedApps = keys.reduce(
    (acc, k) => acc + (k.connectedAppsCount || 0),
    0
  )
  const totalConnectedNodes = keys.reduce(
    (acc, k) => acc + (k.connectedNodesCount || 0),
    0
  )

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-heading text-2xl font-black tracking-tight text-balance text-foreground sm:text-3xl">
              Kunci Lisensi &amp; API Token
            </h1>
            <Badge
              variant="outline"
              className="border-sky-500/50 bg-sky-500/10 font-mono text-[11px] font-bold tracking-wider text-sky-500"
            >
              TOKEN ARMADA
            </Badge>
          </div>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
            Kelola token autentikasi agen Sentinel daemon dan paket WAF Laravel
            multi-aplikasi.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="h-9 border-2 font-mono text-xs whitespace-nowrap"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Sinkronkan
          </Button>
          {isAdminOrSuperadmin && (
            <Button
              size="sm"
              onClick={() => {
                setKeyName("")
                setFormError(null)
                setFormSuccess(null)
                setIsCreateOpen(true)
              }}
              className="h-9 border-2 bg-main font-heading text-xs font-black whitespace-nowrap text-black shadow-[3px_3px_0px_0px_var(--border)] hover:bg-main/90"
            >
              <Plus className="mr-1.5 size-4 stroke-[3]" />
              Terbitkan Token Baru
            </Button>
          )}
        </div>
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                TOTAL KUNCI TERBIT
              </span>
              <Key className="size-4 shrink-0 text-main" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-foreground tabular-nums">
              {totalKeys}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground tabular-nums">
              {activeKeys} token status aktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                APLIKASI LARAVEL
              </span>
              <Globe className="size-4 shrink-0 text-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-500 tabular-nums">
              {totalConnectedApps}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Terproteksi WAF Layer 7
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                NODE SENTINEL
              </span>
              <Server className="size-4 shrink-0 text-sky-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-sky-500 tabular-nums">
              {totalConnectedNodes}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Terhubung ke konsol SOC
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                MULTI-APP SUPPORT
              </span>
              <Code2 className="size-4 shrink-0 text-amber-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-amber-500 tabular-nums">
              1 : N
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              1 Token untuk banyak apps
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search */}
      <Card className="border-2 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan token key, label nama, atau nama operator pemilik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 border-2 border-border bg-background pl-9 font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Table */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-5 py-4">
          <CardTitle className="flex items-center gap-2 font-heading text-lg font-black text-foreground tabular-nums">
            <Key className="size-5 text-main" />
            <span>Daftar Kunci Lisensi Terdaftar ({filteredKeys.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border bg-muted/30">
                  <TableHead className="px-2.5 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    TOKEN LISENSI
                  </TableHead>
                  <TableHead className="px-2.5 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    LABEL
                  </TableHead>
                  <TableHead className="px-2.5 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    PEMILIK
                  </TableHead>
                  <TableHead className="px-2 text-center font-mono text-[11px] font-bold tracking-wider text-foreground">
                    APPS
                  </TableHead>
                  <TableHead className="px-2 text-center font-mono text-[11px] font-bold tracking-wider text-foreground">
                    NODES
                  </TableHead>
                  <TableHead className="px-2 text-center font-mono text-[11px] font-bold tracking-wider text-foreground">
                    TIER
                  </TableHead>
                  <TableHead className="px-2 text-center font-mono text-[11px] font-bold tracking-wider text-foreground">
                    STATUS
                  </TableHead>
                  <TableHead className="px-2.5 text-right font-mono text-[11px] font-bold tracking-wider text-foreground">
                    AKSI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center font-mono text-xs text-muted-foreground"
                    >
                      Tidak ada kunci lisensi yang cocok.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKeys.map((k) => (
                    <TableRow
                      key={k.id}
                      className="border-b border-border/60 transition-colors hover:bg-muted/10"
                    >
                      <TableCell className="px-2 py-2.5 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <code className="rounded bg-muted px-1.5 py-1 text-[11px] font-bold text-foreground select-all">
                            {k.key.substring(0, 10)}...
                            {k.key.substring(k.key.length - 4)}
                          </code>
                          <button
                            onClick={() => handleCopy(k.key)}
                            title="Salin Kunci Lengkap"
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                          >
                            {copiedKey === k.key ? (
                              <Check className="size-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      <TableCell className="max-w-[125px] px-2 py-2.5 font-mono text-xs font-bold whitespace-normal text-foreground">
                        <span className="line-clamp-2 block" title={k.name}>
                          {k.name}
                        </span>
                      </TableCell>

                      <TableCell className="max-w-[145px] px-2 py-2.5 font-mono text-xs whitespace-normal">
                        <div className="flex flex-col">
                          <span
                            className="truncate font-semibold text-foreground"
                            title={k.userName}
                          >
                            {k.userName}
                          </span>
                          <span
                            className="truncate text-[11px] text-muted-foreground"
                            title={k.userEmail}
                          >
                            {k.userEmail}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-2 py-2.5 text-center font-mono text-xs font-bold tabular-nums">
                        <Badge
                          variant="outline"
                          className="border-border px-1.5"
                        >
                          {k.connectedAppsCount || 0}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-2 py-2.5 text-center font-mono text-xs font-bold tabular-nums">
                        <Badge
                          variant="outline"
                          className="border-border px-1.5"
                        >
                          {k.connectedNodesCount || 0}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-2 py-2.5 text-center font-mono text-xs font-bold">
                        {k.isTrial ? (
                          (() => {
                            const nowSec = Math.floor(Date.now() / 1000)
                            const remainingDays = k.trialEndsAt
                              ? Math.max(
                                  0,
                                  Math.ceil((k.trialEndsAt - nowSec) / 86400)
                                )
                              : 0
                            const isExpired =
                              remainingDays <= 0 ||
                              k.subscriptionStatus === "expired"
                            return (
                              <div className="flex flex-col items-center gap-0.5">
                                <Badge
                                  variant="outline"
                                  className={
                                    isExpired
                                      ? "border-rose-500 bg-rose-500/10 font-mono text-[10px] text-rose-600 dark:text-rose-400"
                                      : "border-amber-500 bg-amber-500/10 font-mono text-[10px] text-amber-600 tabular-nums dark:text-amber-400"
                                  }
                                >
                                  {isExpired
                                    ? "HABIS"
                                    : `TRIAL (${remainingDays}d)`}
                                </Badge>
                                {isExpired && (
                                  <span className="text-[9px] font-bold tracking-tight text-rose-500 uppercase">
                                    Pasif
                                  </span>
                                )}
                              </div>
                            )
                          })()
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-emerald-500 bg-emerald-500/10 font-mono text-[10px] text-emerald-600 dark:text-emerald-400"
                          >
                            PRO AKTIF
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="px-2 py-2.5 text-center">
                        {isAdminOrSuperadmin ? (
                          <button
                            onClick={() => handleToggle(k)}
                            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-bold transition-colors ${
                              k.isActive
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-rose-500/40 bg-rose-500/10 text-rose-500"
                            }`}
                          >
                            <Power className="size-2.5" />
                            <span>{k.isActive ? "AKTIF" : "OFF"}</span>
                          </button>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-bold ${
                              k.isActive
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-rose-500/40 bg-rose-500/10 text-rose-500"
                            }`}
                          >
                            <Power className="size-2.5" />
                            <span>{k.isActive ? "AKTIF" : "OFF"}</span>
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="px-2 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isAdminOrSuperadmin && k.isTrial && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpgradeToPro(k.id)}
                                title="Jadikan Lisensi Berbayar Penuh (Aktif)"
                                className="h-7 border-emerald-500 px-1.5 font-mono text-[10px] text-emerald-600 hover:bg-emerald-500/10"
                              >
                                <Sparkles className="mr-1 size-3 text-emerald-500" />
                                Pro
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtendTrial(k.id, 14)}
                                title="Perpanjang Masa Trial +14 Hari"
                                className="h-7 border-amber-500 px-1.5 font-mono text-[10px] text-amber-600 tabular-nums hover:bg-amber-500/10"
                              >
                                <Clock className="mr-1 size-3 text-amber-500" />
                                +14h
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedKey(k)
                              setIsGuideOpen(true)
                            }}
                            title="Panduan Integrasi"
                            className="h-7 border-2 px-2 font-mono text-[11px] text-sky-500 hover:text-sky-600"
                          >
                            <Terminal className="mr-1 size-3" />
                            Setup
                          </Button>
                          {isAdminOrSuperadmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(k.id)}
                              title="Hapus Token"
                              className="size-7 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          )}
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

      {/* 5. MODAL: TERBITKAN TOKEN BARU */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/15 text-main shadow-[2px_2px_0px_0px_var(--border)]">
                <Key className="size-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle>Terbitkan Token Lisensi Baru</DialogTitle>
                <DialogDescription className="mt-1">
                  Token dapat digunakan secara paralel pada banyak aplikasi
                  Laravel maupun daemon Sentinel Linux.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {formError && (
            <div className="flex items-center gap-2 rounded-base border-2 border-destructive bg-destructive/10 p-3 font-mono text-xs font-bold text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="flex items-center gap-2 rounded-base border-2 border-emerald-500 bg-emerald-500/10 p-3 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className={modalLabelClass}>
                Pilih Pengguna Pemilik <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className={modalSelectClass}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={modalLabelClass}>
                Nama / Label Kunci Lisensi
              </label>
              <Input
                placeholder="Misal: Token Produksi Multi-App Cluster"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className={modalInputClass}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="h-9 border-2 font-sans text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="h-9 border-2 border-border bg-main font-heading text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90"
              >
                Terbitkan Token
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. MODAL: PANDUAN INTEGRASI */}
      <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-sky-500/15 text-sky-500 shadow-[2px_2px_0px_0px_var(--border)]">
                <Terminal className="size-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle>
                  Panduan Integrasi Token: {selectedKey?.name}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Salin kredensial berikut ke file environment aplikasi Laravel
                  atau jalankan installer daemon pada VPS target.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedKey && (
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-foreground">
                    1. Integrasi Laravel WAF (.env):
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `PASAX_LICENSE_KEY=${selectedKey.key}\nPASAX_CLOUD_URL=https://pasax.web.id`
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-main hover:underline"
                  >
                    <Copy className="size-3" />
                    <span>Salin .env</span>
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-base border-2 border-border bg-black/95 p-3 text-emerald-400 select-all">
                  {`PASAX_LICENSE_KEY=${selectedKey.key}\nPASAX_CLOUD_URL=https://pasax.web.id`}
                </pre>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-foreground">
                    2. Pemasangan Sentinel Daemon VPS:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `curl -sSL https://pasax.web.id/install.sh | sudo bash -s -- --token ${selectedKey.key}`
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-main hover:underline"
                  >
                    <Copy className="size-3" />
                    <span>Salin Command</span>
                  </button>
                </div>
                <pre className="rounded-base border-2 border-border bg-black/95 p-3 break-all whitespace-pre-wrap text-emerald-400 select-all">
                  {`curl -sSL https://pasax.web.id/install.sh | sudo bash -s -- --token ${selectedKey.key}`}
                </pre>
              </div>

              <DialogFooter>
                <Button
                  size="sm"
                  onClick={() => setIsGuideOpen(false)}
                  className="h-9 border-2 border-border bg-main font-heading text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90"
                >
                  Tutup
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
