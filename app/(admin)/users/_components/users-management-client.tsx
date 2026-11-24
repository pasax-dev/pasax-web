"use client"

import Link from "next/link"

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
  Users,
  Server,
  ShieldCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  Filter,
  RefreshCw,
  HardDrive,
  Shield,
  Power,
} from "lucide-react"
import { ManagedUser, NodeTelemetry } from "@/lib/store"

interface UsersManagementClientProps {
  initialUsers: ManagedUser[]
  initialNodes: NodeTelemetry[]
  currentRole?: string
  currentEmail?: string
}

const modalInputClass =
  "h-10 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-main focus-visible:ring-0"
const modalSelectClass =
  "h-10 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold text-foreground focus:border-main focus:outline-hidden"
const modalLabelClass = "block font-sans text-xs font-semibold text-foreground"

export function UsersManagementClient({
  initialUsers = [],
  initialNodes = [],
  currentRole = "Admin",
  currentEmail = "",
}: UsersManagementClientProps) {
  const isAdminOrSuperadmin =
    currentRole === "Superadmin" || currentRole === "Admin"
  const [users, setUsers] = React.useState<ManagedUser[]>(initialUsers)
  const [nodes, setNodes] = React.useState<NodeTelemetry[]>(initialNodes)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [planFilter, setPlanFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isLoading, setIsLoading] = React.useState(false)

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isAssignOpen, setIsAssignOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<ManagedUser | null>(
    null
  )

  // Form States for Create/Edit
  const [formData, setFormData] = React.useState<{
    name: string
    email: string
    role:
      | "Superadmin"
      | "Admin"
      | "User"
      | "Support"
      | "Teknis"
      | "Programmer"
      | "DevOps"
    plan: "free" | "pro" | "enterprise"
    serverQuota: number
    organization: string
    phone: string
    assignedNodeIds: string[]
  }>({
    name: "",
    email: "",
    role: "Admin",
    plan: "pro",
    serverQuota: 10,
    organization: "",
    phone: "",
    assignedNodeIds: [],
  })

  const [formError, setFormError] = React.useState<string | null>(null)
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null)

  // Refresh data from API
  const refreshData = async () => {
    setIsLoading(true)
    try {
      const [resUsers, resNodes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/nodes"),
      ])
      if (resUsers.ok) {
        const dataU = await resUsers.json()
        if (dataU.data) setUsers(dataU.data)
      }
      if (resNodes.ok) {
        const dataN = await resNodes.json()
        if (dataN.data) setNodes(dataN.data)
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Open Create Dialog
  const openCreateDialog = () => {
    setFormData({
      name: "",
      email: "",
      role: "Admin",
      plan: "pro",
      serverQuota: 10,
      organization: "",
      phone: "",
      assignedNodeIds: [],
    })
    setFormError(null)
    setFormSuccess(null)
    setIsCreateOpen(true)
  }

  // Open Edit Dialog
  const openEditDialog = (user: ManagedUser) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      serverQuota: user.serverQuota,
      organization: user.organization || "",
      phone: user.phone || "",
      assignedNodeIds: user.assignedNodeIds || [],
    })
    setFormError(null)
    setFormSuccess(null)
    setIsEditOpen(true)
  }

  // Open Assign VPS Dialog
  const openAssignDialog = (user: ManagedUser) => {
    setSelectedUser(user)
    setFormData((prev) => ({
      ...prev,
      assignedNodeIds: user.assignedNodeIds || [],
    }))
    setIsAssignOpen(true)
  }

  // Open Delete Dialog
  const openDeleteDialog = (user: ManagedUser) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  // Toggle assigned node selection in form
  const toggleNodeSelection = (nodeId: string) => {
    setFormData((prev) => {
      const exists = prev.assignedNodeIds.includes(nodeId)
      if (exists) {
        return {
          ...prev,
          assignedNodeIds: prev.assignedNodeIds.filter((id) => id !== nodeId),
        }
      } else {
        return {
          ...prev,
          assignedNodeIds: [...prev.assignedNodeIds, nodeId],
        }
      }
    })
  }

  // Submit Create User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Nama lengkap dan email wajib diisi.")
      return
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          createdBy: currentRole === "Admin" ? currentEmail : undefined,
        }),
      })
      const result = await res.json()
      if (!res.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal membuat pengguna.")
      }

      setFormSuccess("Pengguna pemegang VPS baru berhasil didaftarkan.")
      setTimeout(() => {
        setIsCreateOpen(false)
        refreshData()
      }, 1000)
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  // Submit Edit User
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setFormError(null)
    setFormSuccess(null)

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          updates: {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            plan: formData.plan,
            serverQuota: formData.serverQuota,
            organization: formData.organization,
            phone: formData.phone,
            assignedNodeIds: formData.assignedNodeIds,
          },
        }),
      })
      const result = await res.json()
      if (!res.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal memperbarui pengguna.")
      }

      setFormSuccess("Data pemegang VPS berhasil diperbarui.")
      setTimeout(() => {
        setIsEditOpen(false)
        refreshData()
      }, 1000)
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  // Submit Quick Assign VPS
  const handleAssignSubmit = async () => {
    if (!selectedUser) return
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          updates: {
            assignedNodeIds: formData.assignedNodeIds,
          },
        }),
      })
      if (res.ok) {
        setIsAssignOpen(false)
        refreshData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Submit Delete User
  const handleDeleteSubmit = async () => {
    if (!selectedUser) return
    try {
      const res = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setIsDeleteOpen(false)
        refreshData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Toggle User Active Status
  const handleToggleStatus = async (user: ManagedUser) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          updates: {
            isActive: !user.isActive,
          },
        }),
      })
      if (res.ok) {
        refreshData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Filtered Users
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.organization && u.organization.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.createdBy && u.createdBy.toLowerCase().includes(q))

      const matchRole = roleFilter === "all" || u.role === roleFilter
      const matchPlan = planFilter === "all" || u.plan === planFilter
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive)

      return matchSearch && matchRole && matchPlan && matchStatus
    })
  }, [users, searchQuery, roleFilter, planFilter, statusFilter])

  // Aggregate stats
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.isActive).length
  const totalAssignedNodes = users.reduce(
    (acc, u) => acc + (u.assignedNodeIds?.length || 0),
    0
  )
  const totalQuota = users.reduce((acc, u) => acc + (u.serverQuota || 0), 0)

  const renderNodeSelector = (helperText: string, labelPrefix: string) => (
    <div className="space-y-2.5 border-t border-border/70 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={modalLabelClass}>
          {labelPrefix} ({formData.assignedNodeIds.length} dipilih)
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {helperText}
        </span>
      </div>

      {nodes.length === 0 ? (
        <div className="rounded-base border-2 border-dashed border-border bg-muted/15 p-3 font-sans text-xs text-muted-foreground">
          Belum ada VPS terdaftar di armada.
        </div>
      ) : (
        <div className="grid max-h-44 grid-cols-1 gap-2.5 overflow-y-auto rounded-base border-2 border-border bg-muted/15 p-2.5 sm:grid-cols-2">
          {nodes.map((node) => {
            const isSelected = formData.assignedNodeIds.includes(node.node_id)
            return (
              <button
                type="button"
                key={node.node_id}
                onClick={() => toggleNodeSelection(node.node_id)}
                className={`flex w-full items-center justify-between gap-2 rounded-base border-2 p-2.5 text-left font-mono text-xs transition-all ${
                  isSelected
                    ? "border-main bg-main/15 text-foreground shadow-[2px_2px_0px_0px_var(--border)]"
                    : "border-border/60 bg-background/70 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded-sm border-2 text-[10px] font-black ${
                      isSelected
                        ? "border-border bg-main text-black"
                        : "border-border bg-background"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-bold text-foreground">
                      {node.hostname}
                    </span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {node.ip_v4}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span
                    className={`size-2 rounded-full ${
                      node.status === "ONLINE"
                        ? "bg-emerald-500"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                    {node.os.split(" ")[0]}
                  </Badge>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-heading text-2xl font-black tracking-tight text-balance text-foreground sm:text-3xl">
              Manajemen Tim VPS &amp; Pengguna
            </h1>
            <Badge
              variant="outline"
              className="border-main/50 bg-main/10 font-mono text-[11px] font-bold tracking-wider text-main"
            >
              FLEET &amp; TEAM ACCESS
            </Badge>
          </div>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
            {isAdminOrSuperadmin ? (
              <>
                Sebagai{" "}
                <strong className="text-foreground">{currentRole}</strong>, Anda
                melihat akun Anda sendiri serta tim (
                <strong className="text-foreground">Programmer L7</strong> &amp;{" "}
                <strong className="text-foreground">Server Maintainer</strong>)
                yang Anda delegasikan.
              </>
            ) : (
              <>
                Menampilkan informasi akun Anda serta penugasan node VPS yang
                diberikan oleh Admin armada.
              </>
            )}
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
              onClick={openCreateDialog}
              className="h-9 border-2 bg-main font-heading text-xs font-black whitespace-nowrap text-black shadow-[3px_3px_0px_0px_var(--border)] hover:bg-main/90"
            >
              <Plus className="mr-1.5 size-4 stroke-[3]" />
              Tambah Anggota Tim / VPS
            </Button>
          )}
        </div>
      </div>

      {/* Otoritas Admin & Panduan Peran Banner */}
      <div className="relative overflow-hidden rounded-base border-2 border-border bg-card p-4 shadow-[4px_4px_0px_0px_var(--border)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl space-y-1">
            <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
              <ShieldCheck className="size-4.5 shrink-0 text-main" />
              <span>
                Otoritas Administrator: Manajemen Tim Programmer &amp; Server
                Maintainer
              </span>
            </div>
            <p className="font-sans text-xs leading-relaxed text-pretty text-muted-foreground">
              Setiap user yang mendaftar mandiri otomatis berstatus{" "}
              <strong>Admin</strong> dengan wewenang mengawasi{" "}
              <strong>SEMUA node VPS</strong>. Admin dapat mendelegasikan tugas
              dengan membuatkan user khusus untuk tim programmer aplikasi atau
              teknisi maintainer VPS.
            </p>
          </div>
          <Link href="/permissions" className="shrink-0">
            <Button
              variant="outline"
              className="gap-1.5 border-2 font-heading text-xs font-bold whitespace-nowrap shadow-[2px_2px_0px_0px_var(--border)]"
            >
              <Shield className="size-3.5" />
              <span>Lihat Matriks Hak Akses Peran</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Tactical Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                TOTAL PENGGUNA
              </span>
              <Users className="size-4 shrink-0 text-main" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-foreground tabular-nums">
              {totalUsers}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground tabular-nums">
              {activeUsers} akun operator aktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                PENUGASAN VPS
              </span>
              <Server className="size-4 shrink-0 text-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-500 tabular-nums">
              {totalAssignedNodes}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Hubungan Node &harr; User terjalin
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                TOTAL KUOTA ARMADA
              </span>
              <HardDrive className="size-4 shrink-0 text-sky-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-sky-500 tabular-nums">
              {totalQuota}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Maksimum slot VPS dialokasikan
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                DEFAULT ROLE
              </span>
              <ShieldCheck className="size-4 shrink-0 text-amber-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-amber-500">
              ADMIN
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Otomatis diberikan ke registran baru
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
                placeholder="Cari berdasarkan nama, email, instansi, atau no telepon..."
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

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-9 rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                <option value="all">Semua Role</option>
                <option value="Superadmin">Superadmin</option>
                <option value="Admin">Admin (Fleet Owner)</option>
                <option value="Programmer">Programmer (App L7)</option>
                <option value="DevOps">DevOps (Maintainer L3/L4)</option>
                <option value="Teknis">Teknis</option>
                <option value="Support">Support</option>
                <option value="User">User (Viewer)</option>
              </select>

              {/* Plan Filter */}
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="h-9 rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                <option value="all">Semua Paket</option>
                <option value="free">Starter (Free)</option>
                <option value="pro">Pro Fleet</option>
                <option value="enterprise">Enterprise</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Table of Users */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-main" />
              <CardTitle className="font-heading text-lg font-black text-foreground tabular-nums">
                Daftar Pemegang VPS &amp; Operator Armada (
                {filteredUsers.length})
              </CardTitle>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Multi-User per VPS Didukung
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border bg-muted/30">
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    OPERATOR / PENGGUNA
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    ROLE &amp; PAKET
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    INSTANSI &amp; KONTAK
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    VPS YANG DITANGANI
                  </TableHead>
                  <TableHead className="px-3 text-center font-mono text-[11px] font-bold tracking-wider text-foreground">
                    KUOTA
                  </TableHead>
                  <TableHead className="px-3 text-center font-mono text-[11px] font-bold tracking-wider text-foreground">
                    STATUS
                  </TableHead>
                  <TableHead className="px-3 text-right font-mono text-[11px] font-bold tracking-wider text-foreground">
                    AKSI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center font-mono text-xs text-muted-foreground"
                    >
                      Tidak ada pengguna yang cocok dengan kriteria pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => {
                    const assignedNodeList = nodes.filter(
                      (n) =>
                        u.assignedNodeIds?.includes(n.node_id) ||
                        n.assignedUserIds?.includes(u.id)
                    )

                    return (
                      <TableRow
                        key={u.id}
                        className="border-b border-border/60 transition-colors hover:bg-muted/10"
                      >
                        {/* 1. Name & Email */}
                        <TableCell className="max-w-[240px] px-3 py-3 font-mono whitespace-normal">
                          <div className="flex flex-col">
                            <span className="flex flex-wrap items-center gap-1.5 font-heading text-sm font-black text-foreground">
                              <span className="truncate">{u.name}</span>
                              {u.role === "Superadmin" && (
                                <span
                                  title="Superadministrator Utama"
                                  className="text-xs text-amber-500"
                                >
                                  👑
                                </span>
                              )}
                              {u.email === "admin@virtualbox.com" && (
                                <Badge className="border border-amber-500 bg-amber-500/20 px-1.5 py-0 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                                  👑 Admin VPS
                                </Badge>
                              )}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                              <Mail className="size-3 shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </span>
                            {u.createdBy && (
                              <span className="mt-0.5 flex items-center gap-1 truncate text-[10px] font-medium text-sky-600 dark:text-sky-400">
                                <span className="shrink-0">Oleh:</span>
                                <code className="truncate">{u.createdBy}</code>
                              </span>
                            )}
                            <span className="mt-0.5 text-[10px] text-muted-foreground/80">
                              ID:{" "}
                              <code className="rounded bg-muted px-1 py-0.5">
                                {u.id}
                              </code>
                            </span>
                          </div>
                        </TableCell>

                        {/* 2. Role & Plan */}
                        <TableCell className="px-3 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <Badge
                              className={`font-mono text-[10px] font-bold tracking-wider ${
                                u.role === "Superadmin"
                                  ? "border-amber-600 bg-amber-500 text-black"
                                  : u.role === "Admin"
                                    ? "border-main bg-main text-black"
                                    : u.role === "Programmer"
                                      ? "border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                      : u.role === "DevOps"
                                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                        : "border-border bg-muted text-foreground"
                              }`}
                            >
                              {u.role === "DevOps"
                                ? "MAINTAINER"
                                : u.role === "Programmer"
                                  ? "PROGRAMMER L7"
                                  : u.role.toUpperCase()}
                            </Badge>

                            <Badge
                              variant="outline"
                              className="border-border font-mono text-[10px] tracking-wider uppercase"
                            >
                              {u.plan} TIER
                            </Badge>
                          </div>
                        </TableCell>

                        {/* 3. Organization & Phone */}
                        <TableCell className="max-w-[165px] px-3 py-3 font-mono text-xs whitespace-normal">
                          <div className="flex flex-col gap-0.5">
                            {u.organization ? (
                              <span className="flex items-center gap-1 truncate font-semibold text-foreground">
                                <Building2 className="size-3 shrink-0 text-muted-foreground" />
                                <span className="truncate">
                                  {u.organization}
                                </span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic">
                                Mandiri / Personal
                              </span>
                            )}
                            {u.phone ? (
                              <span className="flex items-center gap-1 text-[11px] text-muted-foreground tabular-nums">
                                <Phone className="size-3 shrink-0" />
                                <span>{u.phone}</span>
                              </span>
                            ) : null}
                          </div>
                        </TableCell>

                        {/* 4. Assigned VPS Nodes */}
                        <TableCell className="max-w-[220px] px-3 py-3 whitespace-normal">
                          <div className="flex flex-col gap-1.5">
                            {assignedNodeList.length === 0 ? (
                              <span className="font-mono text-[11px] text-muted-foreground italic">
                                Belum ada VPS ditugaskan
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {assignedNodeList.map((node) => (
                                  <Badge
                                    key={node.node_id}
                                    variant="outline"
                                    className={`flex items-center gap-1 border-2 px-1.5 py-0.5 font-mono text-[10px] ${
                                      node.status === "ONLINE"
                                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "border-border bg-background text-muted-foreground"
                                    }`}
                                  >
                                    <span
                                      className={`size-1.5 rounded-full ${
                                        node.status === "ONLINE"
                                          ? "animate-pulse bg-emerald-500"
                                          : "bg-muted-foreground"
                                      }`}
                                    />
                                    <span>{node.hostname}</span>
                                    <span className="text-[9px] text-muted-foreground tabular-nums">
                                      ({node.ip_v4})
                                    </span>
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {isAdminOrSuperadmin && (
                              <button
                                onClick={() => openAssignDialog(u)}
                                className="flex w-fit items-center gap-1 font-mono text-[10px] font-bold text-main hover:underline"
                              >
                                <Server className="size-3" />
                                <span>
                                  {assignedNodeList.length > 0
                                    ? "Kelola Penugasan VPS"
                                    : "+ Tugaskan VPS"}
                                </span>
                              </button>
                            )}
                          </div>
                        </TableCell>

                        {/* 5. Quota */}
                        <TableCell className="px-3 py-3 text-center font-mono">
                          <span className="text-xs font-bold text-foreground tabular-nums">
                            {assignedNodeList.length} / {u.serverQuota}
                          </span>
                          <div className="mx-auto mt-1 h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-main"
                              style={{
                                width: `${Math.min(100, (assignedNodeList.length / u.serverQuota) * 100)}%`,
                              }}
                            />
                          </div>
                        </TableCell>

                        {/* 6. Status Toggle */}
                        <TableCell className="px-3 py-3 text-center">
                          {isAdminOrSuperadmin ? (
                            <button
                              onClick={() => handleToggleStatus(u)}
                              title={
                                u.isActive
                                  ? "Klik untuk nonaktifkan"
                                  : "Klik untuk aktifkan"
                              }
                              className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-bold transition-colors ${
                                u.isActive
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                                  : "border-rose-500/40 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                              }`}
                            >
                              <Power className="size-2.5" />
                              <span>{u.isActive ? "AKTIF" : "SUSPENDED"}</span>
                            </button>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-bold ${
                                u.isActive
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "border-rose-500/40 bg-rose-500/10 text-rose-500"
                              }`}
                            >
                              <Power className="size-2.5" />
                              <span>{u.isActive ? "AKTIF" : "SUSPENDED"}</span>
                            </span>
                          )}
                        </TableCell>

                        {/* 7. Actions */}
                        <TableCell className="px-3 py-3 text-right">
                          {isAdminOrSuperadmin ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(u)}
                                title="Edit Pengguna"
                                className="size-8"
                              >
                                <Edit className="size-3.5" />
                              </Button>
                              {u.email.toLowerCase() !==
                                currentEmail.toLowerCase() && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(u)}
                                  title="Hapus Pengguna"
                                  className="size-8 text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              )}
                            </div>
                          ) : (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              Hanya baca
                            </span>
                          )}
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

      {/* 5. MODAL: TAMBAH PEMEGANG VPS BARU */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/15 text-main shadow-[2px_2px_0px_0px_var(--border)]">
                <Plus className="size-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <DialogTitle>Daftarkan Pengguna Pemegang VPS Baru</DialogTitle>
                <DialogDescription className="mt-1">
                  Pengguna baru otomatis berstatus <strong>Admin</strong> secara
                  default (atau sesuaikan peran tim) dan dapat langsung
                  ditugaskan ke node VPS armada.
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

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  Nama Lengkap Operator <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Misal: Indra Setiawan"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  Email Operator <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  placeholder="operator@instansi.id"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>Instansi / Organisasi</label>
                <Input
                  placeholder="Misal: Diskominfo Daerah / Fintech"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Nomor Telepon / WA</label>
                <Input
                  placeholder="+62 812-xxxx-xxxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>Peran Akses</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as any })
                  }
                  className={modalSelectClass}
                >
                  <option value="Admin">Admin — Fleet Owner</option>
                  <option value="Programmer">Programmer — App L7</option>
                  <option value="DevOps">DevOps — Maintainer L3/L4</option>
                  <option value="Teknis">Teknis — Operator SOC</option>
                  <option value="Support">Support — Layanan Bantuan</option>
                  <option value="User">User — Observer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Paket Lisensi</label>
                <select
                  value={formData.plan}
                  onChange={(e) => {
                    const plan = e.target.value as any
                    const quota =
                      plan === "enterprise" ? 100 : plan === "pro" ? 10 : 1
                    setFormData({ ...formData, plan, serverQuota: quota })
                  }}
                  className={modalSelectClass}
                >
                  <option value="free">Starter (1 Node)</option>
                  <option value="pro">Pro Fleet (10 Nodes)</option>
                  <option value="enterprise">Enterprise (100 Nodes)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Kuota VPS</label>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.serverQuota}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serverQuota: parseInt(e.target.value) || 1,
                    })
                  }
                  className={`${modalInputClass} tabular-nums`}
                />
              </div>
            </div>

            {renderNodeSelector(
              "1 VPS bisa ditugaskan ke banyak user",
              "Tugaskan VPS Langsung"
            )}

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
                Simpan &amp; Terbitkan Kunci Lisensi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. MODAL: EDIT PENGGUNA */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/15 text-main shadow-[2px_2px_0px_0px_var(--border)]">
                <Edit className="size-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle>
                  Perbarui Profil &amp; Penugasan VPS Operator
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Sesuaikan peran akses, paket lisensi, batas kuota, serta node
                  VPS yang dikelola oleh operator.
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

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  Email Operator <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>Instansi / Organisasi</label>
                <Input
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Nomor Telepon</label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>Peran Akses</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as any })
                  }
                  className={modalSelectClass}
                >
                  <option value="Admin">Admin — Fleet Owner</option>
                  <option value="Programmer">Programmer — App L7</option>
                  <option value="DevOps">DevOps — Maintainer L3/L4</option>
                  <option value="Teknis">Teknis — Operator SOC</option>
                  <option value="Support">Support — Layanan Bantuan</option>
                  <option value="User">User — Observer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Paket Lisensi</label>
                <select
                  value={formData.plan}
                  onChange={(e) =>
                    setFormData({ ...formData, plan: e.target.value as any })
                  }
                  className={modalSelectClass}
                >
                  <option value="free">Starter</option>
                  <option value="pro">Pro Fleet</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Kuota VPS</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.serverQuota}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serverQuota: parseInt(e.target.value) || 1,
                    })
                  }
                  className={`${modalInputClass} tabular-nums`}
                />
              </div>
            </div>

            {renderNodeSelector(
              "Pilih VPS yang dipegang pengguna ini",
              "Daftar VPS yang Ditugaskan"
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="h-9 border-2 font-sans text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="h-9 border-2 border-border bg-main font-heading text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90"
              >
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. MODAL: KELOLA PENUGASAN VPS CEPAT */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/15 text-main shadow-[2px_2px_0px_0px_var(--border)]">
                <Server className="size-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle>
                  Penugasan VPS untuk {selectedUser?.name}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Centang VPS yang akan dikelola oleh operator ini. Satu VPS
                  dapat ditangani oleh beberapa operator sekaligus.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {nodes.map((node) => {
              const isSelected = formData.assignedNodeIds.includes(node.node_id)
              return (
                <button
                  type="button"
                  key={node.node_id}
                  onClick={() => toggleNodeSelection(node.node_id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-base border-2 p-3 text-left font-mono text-xs transition-all ${
                    isSelected
                      ? "border-main bg-main/15 text-foreground shadow-[2px_2px_0px_0px_var(--border)]"
                      : "border-border bg-background hover:border-border/80"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded-sm border-2 text-[10px] font-black ${
                        isSelected
                          ? "border-border bg-main text-black"
                          : "border-border bg-background"
                      }`}
                    >
                      {isSelected ? "✓" : ""}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-heading font-black">
                        {node.hostname}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground tabular-nums">
                        {node.ip_v4} &bull; {node.os}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {node.status}
                  </Badge>
                </button>
              )
            })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAssignOpen(false)}
              className="h-9 border-2 font-sans text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleAssignSubmit}
              className="h-9 border-2 border-border bg-main font-heading text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90"
            >
              Terapkan Penugasan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. MODAL: KONFIRMASI HAPUS PENGGUNA */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md border-destructive/60">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-base border-2 border-border bg-destructive/15 text-destructive shadow-[2px_2px_0px_0px_var(--border)]">
              <AlertCircle className="size-5 stroke-[2.5]" />
            </div>
            <DialogTitle className="text-destructive">
              Konfirmasi Hapus Pengguna
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus akun{" "}
              <strong className="text-foreground">{selectedUser?.name}</strong>{" "}
              (
              <span className="font-mono text-foreground">
                {selectedUser?.email}
              </span>
              )? Semua penugasan VPS dan token lisensi yang terkait akan
              dinonaktifkan. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              className="h-9 border-2 font-sans text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteSubmit}
              className="h-9 border-2 border-border font-heading text-xs font-black shadow-[2px_2px_0px_0px_var(--border)]"
            >
              Hapus Akun Pengguna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
