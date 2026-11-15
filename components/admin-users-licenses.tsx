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
  Users,
  Key,
  ShieldCheck,
  CreditCard,
  Plus,
  Copy,
  Check,
  Power,
  Server,
  Globe,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react"
import {
  ManagedUser,
  ManagedLicenseKey,
  SubscriptionTier,
  SUBSCRIPTION_PLANS,
} from "@/lib/store"

export function AdminUsersLicenses({
  initialUsers = [],
  initialKeys = [],
  currentRole = "Superadmin",
}: {
  initialUsers?: ManagedUser[]
  initialKeys?: ManagedLicenseKey[]
  currentRole?: string
}) {
  const [users, setUsers] = React.useState<ManagedUser[]>(initialUsers)
  const [keys, setKeys] = React.useState<ManagedLicenseKey[]>(initialKeys)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [activeSubTab, setActiveSubTab] = React.useState<"users" | "keys">("users")

  // Modal State: Create User
  const [isCreateUserOpen, setIsCreateUserOpen] = React.useState(false)
  const [userName, setUserName] = React.useState("")
  const [userEmail, setUserEmail] = React.useState("")
  const [userRole, setUserRole] = React.useState<"Superadmin" | "Admin" | "User">("User")
  const [userPlan, setUserPlan] = React.useState<"free" | "pro" | "enterprise">("pro")
  const [userOrg, setUserOrg] = React.useState("")
  const [customQuota, setCustomQuota] = React.useState("10")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Modal State: Generate Token
  const [isGenerateKeyOpen, setIsGenerateKeyOpen] = React.useState(false)
  const [selectedUserId, setSelectedUserId] = React.useState("")
  const [keyName, setKeyName] = React.useState("")

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName || !userEmail) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          role: userRole,
          plan: userPlan,
          serverQuota: parseInt(customQuota) || (userPlan === "enterprise" ? 100 : userPlan === "pro" ? 10 : 1),
          organization: userOrg,
        }),
      })

      const json = await res.json()
      if (json.status === "success" && json.data) {
        setUsers([json.data.user, ...users])
        if (json.data.defaultKey) {
          setKeys([json.data.defaultKey, ...keys])
        }
        setIsCreateUserOpen(false)
        setUserName("")
        setUserEmail("")
        setUserOrg("")
      }
    } catch (err) {
      console.error("Gagal mendaftarkan pengguna:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate Key Handler
  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          name: keyName || "Production Multi-App & Sentinel Token",
        }),
      })

      const json = await res.json()
      if (json.status === "success" && json.data) {
        setKeys([json.data, ...keys])
        setIsGenerateKeyOpen(false)
        setKeyName("")
        setSelectedUserId("")
      }
    } catch (err) {
      console.error("Gagal membuat token lisensi:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle Key Status
  const handleToggleKey = async (keyId: string) => {
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: keyId }),
      })
      const json = await res.json()
      if (json.status === "success" && json.data) {
        setKeys(keys.map((k) => (k.id === keyId ? json.data : k)))
      }
    } catch (err) {
      console.error("Gagal mengubah status lisensi:", err)
    }
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Sub-Header & Mode Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-black tracking-tight sm:text-2xl">
              Otoritas & Lisensi Multi-App Armada
            </h2>
            <Badge
              variant="outline"
              className="border-2 border-border bg-main font-mono text-[10px] font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
            >
              HAK AKSES: {currentRole.toUpperCase()}
            </Badge>
          </div>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            Daftarkan user baru, kelola lisensi multi-node / multi-app (1 key untuk Laravel WAF & Sentinel VPS), dan model tier bisnis.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateUserOpen(true)}
            className="gap-2 font-mono text-xs font-bold border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-main text-main-foreground hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <Plus className="size-4" />
            <span>Daftarkan Pengguna</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsGenerateKeyOpen(true)}
            className="gap-2 font-mono text-xs font-bold border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-background hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <Key className="size-4 text-amber-500" />
            <span>Generate Token Baru</span>
          </Button>
        </div>
      </div>

      {/* Tabs Menu */}
      <Tabs
        value={activeSubTab}
        onValueChange={(v) => setActiveSubTab(v as any)}
        className="w-full space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-sm border-2 border-border bg-background p-1 shadow-[3px_3px_0px_0px_var(--border)]">
          <TabsTrigger
            value="users"
            className="gap-1.5 font-mono text-xs font-bold data-[state=active]:bg-main data-[state=active]:text-main-foreground"
          >
            <Users className="size-3.5" />
            <span>Pengguna ({users.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="keys"
            className="gap-1.5 font-mono text-xs font-bold data-[state=active]:bg-main data-[state=active]:text-main-foreground"
          >
            <Key className="size-3.5" />
            <span>Lisensi Token ({keys.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: USERS LIST & MANAGEMENT                                */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="users" className="space-y-4">
          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg font-black flex items-center justify-between">
                <span>Daftar Pengguna & Tenant Armada</span>
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  Total: {users.length} Akun Terdaftar
                </span>
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                Hanya Superadmin & Admin yang dapat mengelola pendaftaran akun, perubahan peran (Role), dan kuota VPS.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-border bg-secondary-background/60 font-mono text-xs">
                      <TableHead>Nama & Identitas</TableHead>
                      <TableHead>Peran (Role)</TableHead>
                      <TableHead>Profil Armada</TableHead>
                      <TableHead>Kuota VPS</TableHead>
                      <TableHead>Organisasi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="font-mono text-xs divide-y divide-border">
                    {users.map((u) => (
                      <TableRow key={u.id} className="hover:bg-muted/40">
                        <TableCell>
                          <div className="font-bold text-foreground">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground">{u.email}</div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold border border-border shadow-[1px_1px_0px_0px_var(--border)] ${
                              u.role === "Superadmin"
                                ? "bg-red-500 text-white"
                                : u.role === "Admin"
                                ? "bg-main text-main-foreground"
                                : "bg-secondary-background text-foreground"
                            }`}
                          >
                            {u.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`font-mono text-[10px] font-bold uppercase ${
                              u.plan === "enterprise"
                                ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                : u.plan === "pro"
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-muted-foreground/40 bg-muted/20 text-muted-foreground"
                            }`}
                          >
                            {u.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Server className="size-3 text-muted-foreground" />
                            <span className="font-bold">{u.serverQuota} Node</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {u.organization || "Personal Tenant"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {u.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500">
                              <span className="size-1.5 rounded-full bg-rose-500" />
                              Ditangguhkan
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUserId(u.id)
                              setIsGenerateKeyOpen(true)
                            }}
                            className="h-7 px-2 font-mono text-[10px] font-bold border border-border shadow-[1px_1px_0px_0px_var(--border)]"
                          >
                            <Key className="mr-1 size-3 text-amber-500" />
                            Beri Token
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: LICENSE TOKENS (MULTI-APP & MULTI-NODE)                */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="keys" className="space-y-4">
          {/* Multi-App Feature Highlights Box */}
          <div className="rounded-base border-2 border-border bg-emerald-500/10 p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1 font-mono text-xs">
                <div className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                  Fitur Lisensi Universal (Multi-Node & Multi-App per Key)
                </div>
                <p className="text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                  Satu License Key Pasax (<code className="bg-emerald-900/20 px-1 py-0.5 rounded font-bold">psk_live_...</code>) dapat dipasang secara bersamaan pada <strong>berbagai daemon Sentinel di VPS</strong> dan <strong>banyak aplikasi web Laravel berbeda</strong> (<code className="bg-emerald-900/20 px-1 py-0.5 rounded font-bold">PASAX_CLOUD_KEY</code> di .env). Semua aplikasi dan node akan otomatis melaporkan status kesehatan, heartbeat, dan ancaman ke dashboard ini.
                </p>
              </div>
            </div>
          </div>

          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg font-black flex items-center justify-between">
                <span>Daftar Token Lisensi Aktif</span>
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  Total: {keys.length} Token
                </span>
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                Kelola status aktivasi, rotasi token, dan lihat statistik VPS dan Web Apps yang terhubung pada setiap token.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-border bg-secondary-background/60 font-mono text-xs">
                      <TableHead>Nama Token & Pemilik</TableHead>
                      <TableHead>License Key (psk_live_...)</TableHead>
                      <TableHead>Aplikasi Terhubung</TableHead>
                      <TableHead>Node VPS Terhubung</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="font-mono text-xs divide-y divide-border">
                    {keys.map((k) => (
                      <TableRow key={k.id} className="hover:bg-muted/40">
                        <TableCell>
                          <div className="font-bold text-foreground">{k.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {k.userName} ({k.userEmail})
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <code className="bg-muted px-2 py-0.5 rounded border border-border text-[11px] font-bold text-foreground">
                              {k.key.substring(0, 16)}••••••••••••••••
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(k.key)}
                              className="size-6 p-0 hover:bg-main hover:text-main-foreground"
                              title="Salin Full Token"
                            >
                              {copiedKey === k.key ? (
                                <Check className="size-3 text-emerald-500" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Globe className="size-3" />
                            <span>{k.connectedAppsCount} Web Apps</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold">
                            <Server className="size-3" />
                            <span>{k.connectedNodesCount} VPS Nodes</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {k.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              AKTIF
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold border border-rose-500/40 bg-rose-500/10 text-rose-500">
                              <span className="size-1.5 rounded-full bg-rose-500" />
                              NONAKTIF
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleKey(k.id)}
                            className={`h-7 px-2 font-mono text-[10px] font-bold border border-border shadow-[1px_1px_0px_0px_var(--border)] ${
                              k.isActive ? "hover:bg-rose-500/10 hover:text-rose-600" : "hover:bg-emerald-500/10 hover:text-emerald-600"
                            }`}
                          >
                            <Power className="mr-1 size-3" />
                            {k.isActive ? "Revoke" : "Aktifkan"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DAFTARKAN PENGGUNA BARU                                */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent className="max-w-md border-2 border-border bg-background p-6 shadow-[6px_6px_0px_0px_var(--border)]">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black">
              Daftarkan Pengguna & Tenant Baru
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Sistem akan otomatis membuat akun serta meng-generate 1 License Key awal multi-node.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-3.5 font-mono text-xs mt-3">
            <div>
              <label className="font-bold uppercase">Nama Lengkap / Instansi</label>
              <Input
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Contoh: Diskominfo Provinsi / PT Mandiri Sekuritas"
                className="mt-1 font-mono text-xs border-2 border-border"
              />
            </div>

            <div>
              <label className="font-bold uppercase">Alamat Email Operator</label>
              <Input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="admin-tenant@instansi.go.id"
                className="mt-1 font-mono text-xs border-2 border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold uppercase">Peran (Role)</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="mt-1 w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
                >
                  <option value="User">User (Tenant)</option>
                  <option value="Admin">Admin (SecOps)</option>
                  <option value="Superadmin">Superadmin (Chief SOC)</option>
                </select>
              </div>

              <div>
                <label className="font-bold uppercase">Profil Armada</label>
                <select
                  value={userPlan}
                  onChange={(e) => {
                    const p = e.target.value as any
                    setUserPlan(p)
                    setCustomQuota(p === "enterprise" ? "100" : p === "pro" ? "10" : "1")
                  }}
                  className="mt-1 w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
                >
                  <option value="free">Starter Node (1 VPS)</option>
                  <option value="pro">Pro Fleet (10 VPS)</option>
                  <option value="enterprise">Enterprise (100 VPS)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold uppercase">Kuota Server VPS</label>
                <Input
                  type="number"
                  min="1"
                  value={customQuota}
                  onChange={(e) => setCustomQuota(e.target.value)}
                  className="mt-1 font-mono text-xs border-2 border-border"
                />
              </div>

              <div>
                <label className="font-bold uppercase">Nama Organisasi</label>
                <Input
                  value={userOrg}
                  onChange={(e) => setUserOrg(e.target.value)}
                  placeholder="Opsional"
                  className="mt-1 font-mono text-xs border-2 border-border"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateUserOpen(false)}
                className="border-2 border-border font-mono text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-main text-main-foreground font-mono text-xs font-bold border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
              >
                {isSubmitting ? "Menyimpan..." : "Daftarkan Akun & Token"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: GENERATE LICENSE KEY                                   */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={isGenerateKeyOpen} onOpenChange={setIsGenerateKeyOpen}>
        <DialogContent className="max-w-md border-2 border-border bg-background p-6 shadow-[6px_6px_0px_0px_var(--border)]">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black">
              Generate Token Lisensi Baru (Multi-App)
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Satu token dapat dipakai di semua aplikasi Laravel dan node VPS milik user ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGenerateKey} className="space-y-3.5 font-mono text-xs mt-3">
            <div>
              <label className="font-bold uppercase">Pilih Pengguna Target</label>
              <select
                required
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="mt-1 w-full rounded-base border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
              >
                <option value="">-- Pilih User --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email}) — Tier {u.plan.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold uppercase">Label / Nama Token</label>
              <Input
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Contoh: Production Multi-Cluster Key"
                className="mt-1 font-mono text-xs border-2 border-border"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGenerateKeyOpen(false)}
                className="border-2 border-border font-mono text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedUserId}
                className="bg-main text-main-foreground font-mono text-xs font-bold border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
              >
                {isSubmitting ? "Membuat..." : "Generate Token psk_live_..."}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
