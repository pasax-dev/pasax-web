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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Users,
  Key,
  ShieldCheck,
  Plus,
  Copy,
  Check,
  Power,
  Server,
  Globe,
} from "lucide-react"
import { ManagedUser, ManagedLicenseKey } from "@/lib/store"

const modalInputClass =
  "h-10 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-main focus-visible:ring-0"
const modalSelectClass =
  "h-10 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold text-foreground focus:border-main focus:outline-hidden"
const modalLabelClass = "block font-sans text-xs font-semibold text-foreground"

export function AdminUsersLicenses({
  initialUsers = [],
  initialKeys = [],
  currentRole = "Admin",
  currentEmail = "",
}: {
  initialUsers?: ManagedUser[]
  initialKeys?: ManagedLicenseKey[]
  currentRole?: string
  currentEmail?: string
}) {
  const isAdminOrSuperadmin =
    currentRole === "Superadmin" || currentRole === "Admin"
  const [users, setUsers] = React.useState<ManagedUser[]>(initialUsers)
  const [keys, setKeys] = React.useState<ManagedLicenseKey[]>(initialKeys)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [activeSubTab, setActiveSubTab] = React.useState<"users" | "keys">(
    "users"
  )

  // Modal State: Create User
  const [isCreateUserOpen, setIsCreateUserOpen] = React.useState(false)
  const [userName, setUserName] = React.useState("")
  const [userEmail, setUserEmail] = React.useState("")
  const [userRole, setUserRole] = React.useState<
    | "Superadmin"
    | "Admin"
    | "Programmer"
    | "DevOps"
    | "Teknis"
    | "Support"
    | "User"
  >("Programmer")
  const [userPlan, setUserPlan] = React.useState<"free" | "pro" | "enterprise">(
    "pro"
  )
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
          serverQuota:
            parseInt(customQuota) ||
            (userPlan === "enterprise" ? 100 : userPlan === "pro" ? 10 : 1),
          organization: userOrg,
          createdBy: currentRole === "Admin" ? currentEmail : undefined,
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-xl font-black tracking-tight text-balance sm:text-2xl">
              Otoritas &amp; Lisensi Multi-App Armada
            </h2>
            <Badge
              variant="outline"
              className="border-2 border-border bg-main font-mono text-[10px] font-black tracking-wider text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
            >
              HAK AKSES: {currentRole.toUpperCase()}
            </Badge>
          </div>
          <p className="max-w-2xl font-sans text-xs leading-relaxed text-pretty text-muted-foreground sm:text-sm">
            Daftarkan user baru, kelola lisensi multi-node / multi-app (1 key
            untuk Laravel WAF &amp; Sentinel VPS), dan model tier bisnis.
          </p>
        </div>

        {/* Action Buttons */}
        {isAdminOrSuperadmin && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsCreateUserOpen(true)}
              className="h-9 gap-1.5 border-2 border-border bg-main font-mono text-xs font-bold whitespace-nowrap text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <Plus className="size-4" />
              <span>Daftarkan Pengguna</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsGenerateKeyOpen(true)}
              className="h-9 gap-1.5 border-2 border-border bg-background font-mono text-xs font-bold whitespace-nowrap shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <Key className="size-4 text-amber-500" />
              <span>Generate Token Baru</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <Tabs
        value={activeSubTab}
        onValueChange={(v) => setActiveSubTab(v as any)}
        className="w-full space-y-4"
      >
        <TabsList className="grid w-full max-w-sm grid-cols-2 border-2 border-border bg-background p-1 shadow-[3px_3px_0px_0px_var(--border)]">
          <TabsTrigger
            value="users"
            className="gap-1.5 font-mono text-xs font-bold tabular-nums data-[state=active]:bg-main data-[state=active]:text-main-foreground"
          >
            <Users className="size-3.5" />
            <span>Pengguna ({users.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="keys"
            className="gap-1.5 font-mono text-xs font-bold tabular-nums data-[state=active]:bg-main data-[state=active]:text-main-foreground"
          >
            <Key className="size-3.5" />
            <span>Lisensi Token ({keys.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: USERS LIST & MANAGEMENT */}
        <TabsContent value="users" className="space-y-4">
          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-wrap items-center justify-between gap-2 font-heading text-lg font-black">
                <span>Daftar Pengguna &amp; Tenant Armada</span>
                <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
                  Total: {users.length} Akun Terdaftar
                </span>
              </CardTitle>
              <CardDescription className="font-sans text-xs">
                Hanya Superadmin &amp; Admin yang dapat mengelola pendaftaran
                akun, perubahan peran (Role), dan kuota VPS.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-border bg-secondary-background/60 font-mono text-[11px]">
                      <TableHead className="px-3">
                        Nama &amp; Identitas
                      </TableHead>
                      <TableHead className="px-3">Peran</TableHead>
                      <TableHead className="px-3">Paket</TableHead>
                      <TableHead className="px-3">Kuota</TableHead>
                      <TableHead className="px-3">Organisasi</TableHead>
                      <TableHead className="px-3">Status</TableHead>
                      <TableHead className="px-3 text-right">
                        Tindakan
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border font-mono text-xs">
                    {users.map((u) => (
                      <TableRow key={u.id} className="hover:bg-muted/40">
                        <TableCell className="max-w-[210px] px-3 py-2.5 whitespace-normal">
                          <div className="truncate font-bold text-foreground">
                            {u.name}
                          </div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            {u.email}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <span
                            className={`inline-flex items-center rounded-sm border border-border px-2 py-0.5 text-[10px] font-bold shadow-[1px_1px_0px_0px_var(--border)] ${
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
                        <TableCell className="px-3 py-2.5">
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
                        <TableCell className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5 tabular-nums">
                            <Server className="size-3 shrink-0 text-muted-foreground" />
                            <span className="font-bold">
                              {u.serverQuota} Node
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[150px] px-3 py-2.5 whitespace-normal">
                          <span className="block truncate text-muted-foreground">
                            {u.organization || "Personal Tenant"}
                          </span>
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
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
                        <TableCell className="px-3 py-2.5 text-right">
                          {isAdminOrSuperadmin ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUserId(u.id)
                                setIsGenerateKeyOpen(true)
                              }}
                              className="h-7 border border-border px-2 font-mono text-[10px] font-bold whitespace-nowrap shadow-[1px_1px_0px_0px_var(--border)]"
                            >
                              <Key className="mr-1 size-3 text-amber-500" />
                              Beri Token
                            </Button>
                          ) : (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              Akun Anda
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: LICENSE TOKENS (MULTI-APP & MULTI-NODE) */}
        <TabsContent value="keys" className="space-y-4">
          {/* Multi-App Feature Highlights Box */}
          <div className="rounded-base border-2 border-border bg-emerald-500/10 p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="space-y-1 font-sans text-xs">
                <div className="font-heading text-sm font-black text-emerald-900 dark:text-emerald-200">
                  Fitur Lisensi Universal (Multi-Node &amp; Multi-App per Key)
                </div>
                <p className="max-w-3xl leading-relaxed text-emerald-800/80 dark:text-emerald-300/80">
                  Satu License Key Pasax (
                  <code className="rounded bg-emerald-900/20 px-1 py-0.5 font-mono font-bold">
                    psk_live_...
                  </code>
                  ) dapat dipasang secara bersamaan pada{" "}
                  <strong>berbagai daemon Sentinel di VPS</strong> dan{" "}
                  <strong>banyak aplikasi web Laravel berbeda</strong> (
                  <code className="rounded bg-emerald-900/20 px-1 py-0.5 font-mono font-bold">
                    PASAX_CLOUD_KEY
                  </code>{" "}
                  di .env).
                </p>
              </div>
            </div>
          </div>

          <Card className="border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-wrap items-center justify-between gap-2 font-heading text-lg font-black">
                <span>Daftar Token Lisensi Aktif</span>
                <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
                  Total: {keys.length} Token
                </span>
              </CardTitle>
              <CardDescription className="font-sans text-xs">
                Kelola status aktivasi, rotasi token, dan lihat statistik VPS
                dan Web Apps yang terhubung pada setiap token.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-border bg-secondary-background/60 font-mono text-[11px]">
                      <TableHead className="px-3">
                        Nama Token &amp; Pemilik
                      </TableHead>
                      <TableHead className="px-3">License Key</TableHead>
                      <TableHead className="px-3">Apps</TableHead>
                      <TableHead className="px-3">Nodes</TableHead>
                      <TableHead className="px-3">Status</TableHead>
                      <TableHead className="px-3 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border font-mono text-xs">
                    {keys.map((k) => (
                      <TableRow key={k.id} className="hover:bg-muted/40">
                        <TableCell className="max-w-[200px] px-3 py-2.5 whitespace-normal">
                          <div className="truncate font-bold text-foreground">
                            {k.name}
                          </div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            {k.userName} ({k.userEmail})
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <code className="rounded border border-border bg-muted px-2 py-0.5 text-[11px] font-bold text-foreground">
                              {k.key.substring(0, 14)}••••
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
                        <TableCell className="px-3 py-2.5">
                          <div className="flex items-center gap-1 font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                            <Globe className="size-3 shrink-0" />
                            <span>{k.connectedAppsCount} Apps</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <div className="flex items-center gap-1 font-bold text-sky-600 tabular-nums dark:text-sky-400">
                            <Server className="size-3 shrink-0" />
                            <span>{k.connectedNodesCount} Nodes</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          {k.isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                              AKTIF
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-sm border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                              <span className="size-1.5 rounded-full bg-rose-500" />
                              NONAKTIF
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="px-3 py-2.5 text-right">
                          {isAdminOrSuperadmin ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleKey(k.id)}
                              className={`h-7 border border-border px-2 font-mono text-[10px] font-bold whitespace-nowrap shadow-[1px_1px_0px_0px_var(--border)] ${
                                k.isActive
                                  ? "hover:bg-rose-500/10 hover:text-rose-600"
                                  : "hover:bg-emerald-500/10 hover:text-emerald-600"
                              }`}
                            >
                              <Power className="mr-1 size-3" />
                              {k.isActive ? "Revoke" : "Aktifkan"}
                            </Button>
                          ) : (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              Hanya baca
                            </span>
                          )}
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

      {/* MODAL: DAFTARKAN PENGGUNA BARU */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/15 text-main shadow-[2px_2px_0px_0px_var(--border)]">
                <Plus className="size-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <DialogTitle>Daftarkan Pengguna &amp; Tenant Baru</DialogTitle>
                <DialogDescription className="mt-1">
                  Sistem akan otomatis membuat akun serta meng-generate 1
                  License Key awal multi-node.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  Nama Lengkap / Instansi{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Contoh: Diskominfo / PT Mandiri"
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  Alamat Email Operator <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="admin-tenant@instansi.go.id"
                  className={modalInputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>Peran (Role)</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className={modalSelectClass}
                >
                  <option value="Programmer">Programmer (App L7)</option>
                  <option value="DevOps">DevOps (Server Maintainer)</option>
                  <option value="Admin">Admin (Co-Admin / SecOps)</option>
                  <option value="Teknis">Teknis</option>
                  <option value="Support">Support</option>
                  <option value="User">User (Tenant)</option>
                  {currentRole === "Superadmin" && (
                    <option value="Superadmin">Superadmin (Chief SOC)</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Profil Armada</label>
                <select
                  value={userPlan}
                  onChange={(e) => {
                    const p = e.target.value as any
                    setUserPlan(p)
                    setCustomQuota(
                      p === "enterprise" ? "100" : p === "pro" ? "10" : "1"
                    )
                  }}
                  className={modalSelectClass}
                >
                  <option value="free">Starter Node (1 VPS)</option>
                  <option value="pro">Pro Fleet (10 VPS)</option>
                  <option value="enterprise">Enterprise (100 VPS)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>Kuota Server VPS</label>
                <Input
                  type="number"
                  min="1"
                  value={customQuota}
                  onChange={(e) => setCustomQuota(e.target.value)}
                  className={`${modalInputClass} tabular-nums`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Nama Organisasi</label>
                <Input
                  value={userOrg}
                  onChange={(e) => setUserOrg(e.target.value)}
                  placeholder="Opsional"
                  className={modalInputClass}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateUserOpen(false)}
                className="h-9 border-2 border-border font-sans text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 border-2 border-border bg-main font-heading text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
              >
                {isSubmitting ? "Menyimpan..." : "Daftarkan Akun & Token"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: GENERATE LICENSE KEY */}
      <Dialog open={isGenerateKeyOpen} onOpenChange={setIsGenerateKeyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-amber-500/15 text-amber-500 shadow-[2px_2px_0px_0px_var(--border)]">
                <Key className="size-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle>
                  Generate Token Lisensi Baru (Multi-App)
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Satu token dapat dipakai di semua aplikasi Laravel dan node
                  VPS milik user ini.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleGenerateKey} className="space-y-4">
            <div className="space-y-1.5">
              <label className={modalLabelClass}>
                Pilih Pengguna Target <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className={modalSelectClass}
              >
                <option value="">-- Pilih User --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email}) — Tier {u.plan.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={modalLabelClass}>Label / Nama Token</label>
              <Input
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Contoh: Production Multi-Cluster Key"
                className={modalInputClass}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGenerateKeyOpen(false)}
                className="h-9 border-2 border-border font-sans text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedUserId}
                className="h-9 border-2 border-border bg-main font-heading text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
              >
                {isSubmitting ? "Membuat..." : "Generate Token psk_live_..."}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
