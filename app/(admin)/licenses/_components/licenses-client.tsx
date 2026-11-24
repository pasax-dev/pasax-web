"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Key,
  Users,
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
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react"
import { ManagedLicenseKey, ManagedUser } from "@/lib/store"

interface LicensesClientProps {
  initialKeys: ManagedLicenseKey[]
  initialUsers: ManagedUser[]
  currentRole?: string
}

export function LicensesClient({
  initialKeys = [],
  initialUsers = [],
  currentRole = "Superadmin",
}: LicensesClientProps) {
  const [keys, setKeys] = React.useState<ManagedLicenseKey[]>(initialKeys)
  const [users, setUsers] = React.useState<ManagedUser[]>(initialUsers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  // Dialogs
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isGuideOpen, setIsGuideOpen] = React.useState(false)
  const [selectedKey, setSelectedKey] = React.useState<ManagedLicenseKey | null>(null)
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
  const totalConnectedApps = keys.reduce((acc, k) => acc + (k.connectedAppsCount || 0), 0)
  const totalConnectedNodes = keys.reduce((acc, k) => acc + (k.connectedNodesCount || 0), 0)

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Kunci Lisensi &amp; API Token
            </h1>
            <Badge variant="outline" className="border-sky-500/50 bg-sky-500/10 text-sky-500 font-mono text-xs">
              TOKEN ARMADA
            </Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Kelola token autentikasi agen Sentinel daemon dan paket WAF Laravel multi-aplikasi.
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
            onClick={() => {
              setKeyName("")
              setFormError(null)
              setFormSuccess(null)
              setIsCreateOpen(true)
            }}
            className="border-2 bg-main text-black hover:bg-main/90 font-heading text-xs font-black shadow-[3px_3px_0px_0px_var(--border)]"
          >
            <Plus className="mr-1.5 size-4 stroke-[3]" />
            Terbitkan Token Baru
          </Button>
        </div>
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">TOTAL KUNCI TERBIT</span>
              <Key className="size-4 text-main" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-foreground">{totalKeys}</div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{activeKeys} token status aktif</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">APLIKASI LARAVEL</span>
              <Globe className="size-4 text-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-500">{totalConnectedApps || 3}</div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">Terproteksi WAF Layer 7</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">NODE SENTINEL</span>
              <Server className="size-4 text-sky-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-sky-500">{totalConnectedNodes || 3}</div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">Terhubung ke konsol SOC</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">MULTI-APP SUPPORT</span>
              <Code2 className="size-4 text-amber-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-amber-500">1 : N</div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">1 Token untuk banyak apps</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search */}
      <Card className="border-2 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan token key, label nama, atau nama operator pemilik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Table */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-6 py-4">
          <CardTitle className="font-heading text-lg font-black text-foreground flex items-center gap-2">
            <Key className="size-5 text-main" />
            <span>Daftar Kunci Lisensi Terdaftar ({filteredKeys.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border bg-muted/30">
                  <TableHead className="font-mono text-xs font-bold text-foreground">TOKEN LISENSI</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground">LABEL TOKEN</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground">PEMILIK LISENSI</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground text-center">APPS</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground text-center">NODES</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground text-center">TIER / TRIAL</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground text-center">STATUS</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground text-right">AKSI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center font-mono text-xs text-muted-foreground">
                      Tidak ada kunci lisensi yang cocok.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKeys.map((k) => (
                    <TableRow key={k.id} className="border-b border-border/60 hover:bg-muted/10 transition-colors">
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <code className="bg-muted px-2 py-1 rounded font-bold text-foreground select-all">
                            {k.key.substring(0, 16)}...{k.key.substring(k.key.length - 6)}
                          </code>
                          <button
                            onClick={() => handleCopy(k.key)}
                            title="Salin Kunci Lengkap"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {copiedKey === k.key ? (
                              <Check className="size-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-xs font-bold text-foreground">
                        {k.name}
                      </TableCell>

                      <TableCell className="font-mono text-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{k.userName}</span>
                          <span className="text-[11px] text-muted-foreground">{k.userEmail}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-mono text-xs font-bold">
                        <Badge variant="outline" className="border-border">
                          {k.connectedAppsCount || 0} App
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center font-mono text-xs font-bold">
                        <Badge variant="outline" className="border-border">
                          {k.connectedNodesCount || 0} Node
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center font-mono text-xs font-bold">
                        {k.isTrial ? (
                          (() => {
                            const nowSec = Math.floor(Date.now() / 1000)
                            const remainingDays = k.trialEndsAt ? Math.max(0, Math.ceil((k.trialEndsAt - nowSec) / 86400)) : 0
                            const isExpired = remainingDays <= 0 || k.subscriptionStatus === "expired"
                            return (
                              <div className="flex flex-col items-center gap-0.5">
                                <Badge
                                  variant="outline"
                                  className={
                                    isExpired
                                      ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px]"
                                      : "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px]"
                                  }
                                >
                                  {isExpired ? "TRIAL HABIS" : `TRIAL (${remainingDays}d)`}
                                </Badge>
                                {isExpired && (
                                  <span className="text-[9px] text-rose-500 font-bold uppercase tracking-tight">Mode Pasif</span>
                                )}
                              </div>
                            )
                          })()
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]"
                          >
                            PRO BERBAYAR
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <button
                          onClick={() => handleToggle(k)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold border transition-colors ${
                            k.isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                              : "bg-rose-500/10 text-rose-500 border-rose-500/40"
                          }`}
                        >
                          <Power className="size-2.5" />
                          <span>{k.isActive ? "AKTIF" : "NONAKTIF"}</span>
                        </button>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {k.isTrial && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpgradeToPro(k.id)}
                                title="Jadikan Lisensi Berbayar Penuh (Aktif)"
                                className="font-mono text-[10px] border-emerald-500 text-emerald-600 hover:bg-emerald-500/10 h-7 px-1.5"
                              >
                                <Sparkles className="mr-1 size-3 text-emerald-500" />
                                Jadi Pro
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtendTrial(k.id, 14)}
                                title="Perpanjang Masa Trial +14 Hari"
                                className="font-mono text-[10px] border-amber-500 text-amber-600 hover:bg-amber-500/10 h-7 px-1.5"
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
                            className="font-mono text-xs border-2 text-sky-500 hover:text-sky-600 h-7 px-2"
                          >
                            <Terminal className="mr-1 size-3" />
                            Integrasi
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(k.id)}
                            className="size-7 text-destructive"
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

      {/* 5. MODAL: TERBITKAN TOKEN BARU */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-foreground flex items-center gap-2">
              <Plus className="size-5 text-main" />
              <span>Terbitkan Token Lisensi Baru</span>
            </DialogTitle>
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

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="font-heading text-xs font-bold">Pilih Pengguna Pemilik *</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full h-10 rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-heading text-xs font-bold">Nama / Label Kunci Lisensi</label>
              <Input
                placeholder="Misal: Token Produksi Multi-App Cluster"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-main text-black font-heading font-black">
                Terbitkan Token
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. MODAL: PANDUAN INTEGRASI */}
      <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <DialogContent className="max-w-lg border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-base font-black text-foreground flex items-center gap-2">
              <Terminal className="size-5 text-sky-500" />
              <span>Panduan Integrasi Token: {selectedKey?.name}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedKey && (
            <div className="space-y-4 py-2 font-mono text-xs">
              <div>
                <span className="font-bold text-foreground block mb-1">1. Integrasi Laravel WAF (.env):</span>
                <pre className="p-3 rounded-base bg-black/90 text-emerald-400 select-all border border-border">
                  {`PASAX_LICENSE_KEY=${selectedKey.key}
PASAX_CLOUD_URL=https://pasax-service.vercel.app`}
                </pre>
              </div>

              <div>
                <span className="font-bold text-foreground block mb-1">2. Pemasangan Sentinel Daemon VPS:</span>
                <pre className="p-3 rounded-base bg-black/90 text-emerald-400 select-all border border-border break-all">
                  {`curl -sSL https://pasax-service.vercel.app/install.sh | sudo bash -s -- --token ${selectedKey.key}`}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => setIsGuideOpen(false)} className="bg-main text-black font-heading font-black">
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
