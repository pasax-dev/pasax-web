"use client"

import Link from "next/link"

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
import { Input } from "@/components/ui/input"
import {
  Users,
  Server,
  ShieldCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  Filter,
  RefreshCw,
  Key,
  Layers,
  Power,
  ChevronRight,
  HardDrive,
  Shield,
} from "lucide-react"
import { ManagedUser, NodeTelemetry } from "@/lib/store"

interface UsersManagementClientProps {
  initialUsers: ManagedUser[]
  initialNodes: NodeTelemetry[]
  currentRole?: string
}

export function UsersManagementClient({
  initialUsers = [],
  initialNodes = [],
  currentRole = "Superadmin",
}: UsersManagementClientProps) {
  const [users, setUsers] = React.useState<ManagedUser[]>(initialUsers)
  const [nodes, setNodes] = React.useState<NodeTelemetry[]>(initialNodes)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [planFilter, setPlanFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isAssignOpen, setIsAssignOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<ManagedUser | null>(null)

  // Form States for Create/Edit
  const [formData, setFormData] = React.useState<{
    name: string
    email: string
    role: "Superadmin" | "Admin" | "User" | "Support" | "Teknis" | "Programmer" | "DevOps"
    plan: "free" | "pro" | "enterprise"
    serverQuota: number
    organization: string
    phone: string
    assignedNodeIds: string[]
  }>({
    name: "",
    email: "",
    role: "Admin", // Default is Admin per requirement
    plan: "pro",
    serverQuota: 10,
    organization: "",
    phone: "",
    assignedNodeIds: [],
  })

  const [formError, setFormError] = React.useState<string | null>(null)
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

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
        body: JSON.stringify(formData),
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
        (u.phone && u.phone.includes(q))

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
  const totalAssignedNodes = users.reduce((acc, u) => acc + (u.assignedNodeIds?.length || 0), 0)
  const totalQuota = users.reduce((acc, u) => acc + (u.serverQuota || 0), 0)

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Manajemen Tim VPS &amp; Pengguna
            </h1>
            <Badge variant="outline" className="border-main/50 bg-main/10 text-main font-mono text-xs">
              FLEET &amp; TEAM ACCESS
            </Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Sebagai Admin, Anda dapat membuat akun untuk <strong>Programmer Aplikasi (L7)</strong> dan <strong>Server Maintainer (DevOps L3/L4)</strong> yang bertugas di VPS armada.
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
            onClick={openCreateDialog}
            className="border-2 bg-main text-black hover:bg-main/90 font-heading text-xs font-black shadow-[3px_3px_0px_0px_var(--border)]"
          >
            <Plus className="mr-1.5 size-4 stroke-[3]" />
            Tambah Anggota Tim / VPS
          </Button>
        </div>
      </div>

            {/* Otoritas Admin & Panduan Peran Banner */}
      <div className="relative overflow-hidden rounded-base border-2 border-border bg-card p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
              <ShieldCheck className="size-4.5 text-main" />
              <span>Otoritas Administrator: Manajemen Tim Programmer &amp; Server Maintainer</span>
            </div>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              Setiap user yang mendaftar mandiri otomatis berstatus <strong>Admin</strong> dengan wewenang mengawasi <strong>SEMUA node VPS</strong>.
              Admin dapat mendelegasikan tugas dengan membuatkan user khusus untuk tim programmer aplikasi atau teknisi maintainer VPS.
            </p>
          </div>
          <Link href="/permissions">
            <Button variant="outline" className="font-heading text-xs font-bold gap-1.5 border-2 shadow-[2px_2px_0px_0px_var(--border)] shrink-0">
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
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">TOTAL PENGGUNA</span>
              <Users className="size-4 text-main" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-foreground">
              {totalUsers}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              {activeUsers} akun operator aktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">PENUGASAN VPS</span>
              <Server className="size-4 text-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-500">
              {totalAssignedNodes}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Hubungan Node &harr; User terjalin
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">TOTAL KUOTA ARMADA</span>
              <HardDrive className="size-4 text-sky-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-sky-500">
              {totalQuota}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Maksimum slot VPS dialokasikan
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">DEFAULT ROLE</span>
              <ShieldCheck className="size-4 text-amber-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-amber-500">
              ADMIN
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
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
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, email, instansi, atau no telepon..."
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
                <option value="DevOps">DevOps (Server Maintainer L3/L4)</option>
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
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-main" />
              <CardTitle className="font-heading text-lg font-black text-foreground">
                Daftar Pemegang VPS &amp; Operator Armada ({filteredUsers.length})
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
                  <TableHead className="font-mono text-xs font-bold text-foreground">OPERATOR / PENGGUNA</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground">ROLE &amp; PAKET</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground">INSTANSI &amp; KONTAK</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground">VPS YANG DITANGANI</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground text-center">KUOTA</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground text-center">STATUS</TableHead>
                  <TableHead className="font-mono text-xs font-bold text-foreground text-right">AKSI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center font-mono text-xs text-muted-foreground">
                      Tidak ada pengguna yang cocok dengan kriteria pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => {
                    const assignedNodeList = nodes.filter(
                      (n) => u.assignedNodeIds?.includes(n.node_id) || n.assignedUserIds?.includes(u.id)
                    )

                    return (
                      <TableRow key={u.id} className="border-b border-border/60 hover:bg-muted/10 transition-colors">
                        {/* 1. Name & Email */}
                        <TableCell className="font-mono">
                          <div className="flex flex-col">
                            <span className="font-heading font-black text-foreground text-sm flex items-center gap-1.5">
                              {u.name}
                              {u.role === "Superadmin" && (
                                <span title="Superadministrator Utama" className="text-amber-500 text-xs">👑</span>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="size-3" />
                              {u.email}
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 mt-0.5">
                              ID: <code className="bg-muted px-1 py-0.5 rounded">{u.id}</code>
                            </span>
                          </div>
                        </TableCell>

                        {/* 2. Role & Plan */}
                        <TableCell>
                          <div className="flex flex-col gap-1 items-start">
                            <Badge
                              className={`font-mono text-[10px] font-bold ${
                                u.role === "Superadmin"
                                  ? "bg-amber-500 text-black border-amber-600"
                                  : u.role === "Admin"
                                  ? "bg-main text-black border-main"
                                  : u.role === "Programmer"
                                  ? "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500"
                                  : u.role === "DevOps"
                                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500"
                                  : "bg-muted text-foreground border-border"
                              }`}
                            >
                              {u.role === "DevOps" ? "SERVER MAINTAINER" : u.role === "Programmer" ? "PROGRAMMER L7" : u.role.toUpperCase()}
                            </Badge>

                            <Badge variant="outline" className="font-mono text-[10px] uppercase border-border">
                              {u.plan} TIER
                            </Badge>
                          </div>
                        </TableCell>

                        {/* 3. Organization & Phone */}
                        <TableCell className="font-mono text-xs">
                          <div className="flex flex-col gap-0.5">
                            {u.organization ? (
                              <span className="font-semibold text-foreground flex items-center gap-1">
                                <Building2 className="size-3 text-muted-foreground" />
                                {u.organization}
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic">Mandiri / Personal</span>
                            )}
                            {u.phone ? (
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Phone className="size-3" />
                                {u.phone}
                              </span>
                            ) : null}
                          </div>
                        </TableCell>

                        {/* 4. Assigned VPS Nodes */}
                        <TableCell>
                          <div className="flex flex-col gap-1.5 max-w-[280px]">
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
                                    className={`font-mono text-[10px] px-1.5 py-0.5 flex items-center gap-1 border-2 ${
                                      node.status === "ONLINE"
                                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "border-border bg-background text-muted-foreground"
                                    }`}
                                  >
                                    <span
                                      className={`size-1.5 rounded-full ${
                                        node.status === "ONLINE" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                                      }`}
                                    />
                                    <span>{node.hostname}</span>
                                    <span className="text-muted-foreground text-[9px]">({node.ip_v4})</span>
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <button
                              onClick={() => openAssignDialog(u)}
                              className="font-mono text-[10px] text-main hover:underline flex items-center gap-1 font-bold w-fit"
                            >
                              <Server className="size-3" />
                              <span>{assignedNodeList.length > 0 ? "Kelola Penugasan VPS" : "+ Tugaskan VPS"}</span>
                            </button>
                          </div>
                        </TableCell>

                        {/* 5. Quota */}
                        <TableCell className="text-center font-mono">
                          <span className="font-bold text-foreground text-xs">
                            {assignedNodeList.length} / {u.serverQuota}
                          </span>
                          <div className="w-16 h-1.5 bg-muted rounded-full mx-auto mt-1 overflow-hidden">
                            <div
                              className="h-full bg-main"
                              style={{
                                width: `${Math.min(100, (assignedNodeList.length / u.serverQuota) * 100)}%`,
                              }}
                            />
                          </div>
                        </TableCell>

                        {/* 6. Status Toggle */}
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            title={u.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold border transition-colors ${
                              u.isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/40 hover:bg-rose-500/20"
                            }`}
                          >
                            <Power className="size-2.5" />
                            <span>{u.isActive ? "AKTIF" : "SUSPENDED"}</span>
                          </button>
                        </TableCell>

                        {/* 7. Actions */}
                        <TableCell className="text-right">
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(u)}
                              title="Hapus Pengguna"
                              className="size-8 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="size-3.5" />
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

      {/* 5. MODAL: TAMBAH PEMEGANG VPS BARU */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-foreground flex items-center gap-2">
              <Plus className="size-5 text-main" />
              <span>Daftarkan Pengguna Pemegang VPS Baru</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Pengguna yang didaftarkan akan memiliki akses peran <strong>Admin</strong> secara default dan dapat ditugaskan untuk mengelola satu atau beberapa VPS armada.
            </DialogDescription>
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

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Nama Lengkap Operator *</label>
                <Input
                  required
                  placeholder="Misal: Indra Setiawan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Email Operator *</label>
                <Input
                  type="email"
                  required
                  placeholder="operator@instansi.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Instansi / Organisasi</label>
                <Input
                  placeholder="Misal: Diskominfo Daerah / Fintech"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Nomor Telepon / WA</label>
                <Input
                  placeholder="+62 812-xxxx-xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Peran (Default: Admin)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full h-10 rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
                >
                  <option value="Admin">Admin (Co-Admin / Fleet Owner)</option>
                  <option value="Programmer">Programmer (Web Developer L7 - Rute & Integrasi WAF)</option>
                  <option value="DevOps">DevOps (Server Maintainer - VPS & Kernel L3/L4)</option>
                  <option value="Teknis">Teknis (Operator Teknis SOC)</option>
                  <option value="Support">Support (Layanan Bantuan)</option>
                  <option value="User">User (Viewer / Observer)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Paket Berlangganan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => {
                    const plan = e.target.value as any
                    const quota = plan === "enterprise" ? 100 : plan === "pro" ? 10 : 1
                    setFormData({ ...formData, plan, serverQuota: quota })
                  }}
                  className="w-full h-10 rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
                >
                  <option value="free">Starter (1 Node)</option>
                  <option value="pro">Pro Fleet (10 Nodes)</option>
                  <option value="enterprise">Enterprise (100 Nodes)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Batas Kuota VPS</label>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.serverQuota}
                  onChange={(e) => setFormData({ ...formData, serverQuota: parseInt(e.target.value) || 1 })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Multi-select VPS Assignment */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="font-heading text-xs font-bold flex items-center justify-between">
                <span>Tugaskan VPS Langsung ({formData.assignedNodeIds.length} dipilih)</span>
                <span className="font-mono text-[10px] text-muted-foreground">1 VPS bisa dimiliki banyak user</span>
              </label>

              {nodes.length === 0 ? (
                <p className="font-mono text-xs text-muted-foreground italic">Belum ada VPS terdaftar di armada.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border-2 rounded-base bg-muted/10">
                  {nodes.map((node) => {
                    const isSelected = formData.assignedNodeIds.includes(node.node_id)
                    return (
                      <div
                        key={node.node_id}
                        onClick={() => toggleNodeSelection(node.node_id)}
                        className={`cursor-pointer flex items-center justify-between p-2 rounded border-2 transition-all font-mono text-xs ${
                          isSelected
                            ? "border-main bg-main/15 text-foreground font-bold"
                            : "border-border/60 hover:border-border text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="size-3.5 accent-main"
                          />
                          <div className="flex flex-col">
                            <span className="text-foreground">{node.hostname}</span>
                            <span className="text-[10px] text-muted-foreground">{node.ip_v4}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[9px]">
                          {node.os.split(" ")[0]}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-main text-black font-heading font-black">
                Simpan &amp; Terbitkan Kunci Lisensi
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. MODAL: EDIT PENGGUNA */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-foreground flex items-center gap-2">
              <Edit className="size-5 text-main" />
              <span>Perbarui Profil &amp; Penugasan VPS Operator</span>
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

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Nama Lengkap *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Email Operator *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Instansi / Organisasi</label>
                <Input
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Nomor Telepon</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Peran Akses</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full h-10 rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
                >
                  <option value="Admin">Admin (Co-Admin / Fleet Owner)</option>
                  <option value="Programmer">Programmer (Web Developer L7 - Rute & Integrasi WAF)</option>
                  <option value="DevOps">DevOps (Server Maintainer - VPS & Kernel L3/L4)</option>
                  <option value="Teknis">Teknis (Operator Teknis SOC)</option>
                  <option value="Support">Support (Layanan Bantuan)</option>
                  <option value="User">User (Viewer / Observer)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Paket Lisensi</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                  className="w-full h-10 rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
                >
                  <option value="free">Starter</option>
                  <option value="pro">Pro Fleet</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Batas Kuota VPS</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.serverQuota}
                  onChange={(e) => setFormData({ ...formData, serverQuota: parseInt(e.target.value) || 1 })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Multi-select VPS Assignment */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="font-heading text-xs font-bold flex items-center justify-between">
                <span>Daftar VPS yang Ditugaskan ({formData.assignedNodeIds.length} node)</span>
                <span className="font-mono text-[10px] text-muted-foreground">Pilih VPS yang dipegang pengguna ini</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border-2 rounded-base bg-muted/10">
                {nodes.map((node) => {
                  const isSelected = formData.assignedNodeIds.includes(node.node_id)
                  return (
                    <div
                      key={node.node_id}
                      onClick={() => toggleNodeSelection(node.node_id)}
                      className={`cursor-pointer flex items-center justify-between p-2 rounded border-2 transition-all font-mono text-xs ${
                        isSelected
                          ? "border-main bg-main/15 text-foreground font-bold"
                          : "border-border/60 hover:border-border text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="size-3.5 accent-main"
                        />
                        <div className="flex flex-col">
                          <span className="text-foreground">{node.hostname}</span>
                          <span className="text-[10px] text-muted-foreground">{node.ip_v4}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px]">
                        {node.status}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-main text-black font-heading font-black">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 7. MODAL: KELOLA PENUGASAN VPS CEPAT */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-md border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-base font-black text-foreground flex items-center gap-2">
              <Server className="size-4 text-main" />
              <span>Penugasan VPS untuk {selectedUser?.name}</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Centang VPS yang akan dikelola oleh operator ini. Satu VPS bisa ditangani oleh beberapa operator sekaligus.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2 max-h-60 overflow-y-auto">
            {nodes.map((node) => {
              const isSelected = formData.assignedNodeIds.includes(node.node_id)
              return (
                <div
                  key={node.node_id}
                  onClick={() => toggleNodeSelection(node.node_id)}
                  className={`cursor-pointer flex items-center justify-between p-2.5 rounded-base border-2 transition-all font-mono text-xs ${
                    isSelected
                      ? "border-main bg-main/15 text-foreground font-bold"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="size-4 accent-main"
                    />
                    <div>
                      <div className="font-heading font-black">{node.hostname}</div>
                      <div className="text-[11px] text-muted-foreground">{node.ip_v4} • {node.os}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {node.status}
                  </Badge>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setIsAssignOpen(false)}>
              Batal
            </Button>
            <Button size="sm" onClick={handleAssignSubmit} className="bg-main text-black font-heading font-black">
              Terapkan Penugasan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 8. MODAL: KONFIRMASI HAPUS PENGGUNA */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md border-2 border-destructive/40">
          <DialogHeader>
            <DialogTitle className="font-heading text-base font-black text-destructive flex items-center gap-2">
              <AlertCircle className="size-5" />
              <span>Konfirmasi Hapus Pengguna</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Apakah Anda yakin ingin menghapus akun <strong>{selectedUser?.name}</strong> ({selectedUser?.email})?
              Semua penugasan VPS dan token lisensi yang terkait akan dinonaktifkan. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteSubmit}
              className="font-heading font-black"
            >
              Hapus Akun Pengguna
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
