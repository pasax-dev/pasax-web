"use client"

import Link from "next/link"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
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
  Server,
  Users,
  ShieldCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Terminal,
  TerminalSquare,
  Globe,
  Filter,
  Clock,
  LayoutGrid,
  List,
  Power,
  ShieldAlert,
} from "lucide-react"
import { ManagedUser, NodeTelemetry } from "@/lib/store"

interface NodesManagementClientProps {
  initialNodes: NodeTelemetry[]
  initialUsers: ManagedUser[]
  currentRole?: string
}

const modalInputClass =
  "h-10 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-main focus-visible:ring-0"
const modalSelectClass =
  "h-10 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold text-foreground focus:border-main focus:outline-hidden"
const modalLabelClass = "block font-sans text-xs font-semibold text-foreground"

export function NodesManagementClient({
  initialNodes = [],
  initialUsers = [],
  currentRole = "Admin",
}: NodesManagementClientProps) {
  const isAdminOrSuperadmin =
    currentRole === "Superadmin" || currentRole === "Admin"
  const [nodes, setNodes] = React.useState<NodeTelemetry[]>(initialNodes)
  const [users, setUsers] = React.useState<ManagedUser[]>(initialUsers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [userFilter, setUserFilter] = React.useState<string>("all")
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("table")
  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedText, setCopiedText] = React.useState<string | null>(null)

  // Dialog States
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isAssignUsersOpen, setIsAssignUsersOpen] = React.useState(false)
  const [isInstallGuideOpen, setIsInstallGuideOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedNode, setSelectedNode] = React.useState<NodeTelemetry | null>(
    null
  )

  // Form State
  const [formData, setFormData] = React.useState<{
    hostname: string
    ip_v4: string
    os: string
    ssh_port: number
    description: string
    tags: string[]
    assignedUserIds: string[]
    status: "ONLINE" | "TAMPERED" | "OFFLINE"
  }>({
    hostname: "",
    ip_v4: "",
    os: "Ubuntu 24.04 LTS (Noble)",
    ssh_port: 22,
    description: "",
    tags: ["Production"],
    assignedUserIds: [],
    status: "ONLINE",
  })

  const [rawTagInput, setRawTagInput] = React.useState("Production, Edge-WAF")
  const [formError, setFormError] = React.useState<string | null>(null)
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  // Refresh data from API
  const refreshData = async () => {
    setIsLoading(true)
    try {
      const [resNodes, resUsers] = await Promise.all([
        fetch("/api/admin/nodes"),
        fetch("/api/admin/users"),
      ])
      if (resNodes.ok) {
        const dataN = await resNodes.json()
        if (dataN.data) setNodes(dataN.data)
      }
      if (resUsers.ok) {
        const dataU = await resUsers.json()
        if (dataU.data) setUsers(dataU.data)
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data VPS:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Open Register Dialog
  const openRegisterDialog = () => {
    setFormData({
      hostname: "",
      ip_v4: "",
      os: "Ubuntu 24.04 LTS (Noble)",
      ssh_port: 22,
      description: "",
      tags: ["Production"],
      assignedUserIds: users.length > 0 ? [users[0].id] : [],
      status: "ONLINE",
    })
    setRawTagInput("Production, Edge-WAF")
    setFormError(null)
    setFormSuccess(null)
    setIsRegisterOpen(true)
  }

  // Open Edit Dialog
  const openEditDialog = (node: NodeTelemetry) => {
    setSelectedNode(node)
    setFormData({
      hostname: node.hostname,
      ip_v4: node.ip_v4,
      os: node.os,
      ssh_port: node.ssh_port || 22,
      description: node.description || "",
      tags: node.tags || ["Production"],
      assignedUserIds: node.assignedUserIds || [],
      status: node.status,
    })
    setRawTagInput((node.tags || ["Production"]).join(", "))
    setFormError(null)
    setFormSuccess(null)
    setIsEditOpen(true)
  }

  // Open Assign Users Dialog
  const openAssignUsersDialog = (node: NodeTelemetry) => {
    setSelectedNode(node)
    setFormData((prev) => ({
      ...prev,
      assignedUserIds: node.assignedUserIds || [],
    }))
    setIsAssignUsersOpen(true)
  }

  // Open Install Guide Dialog
  const openInstallGuide = (node: NodeTelemetry) => {
    setSelectedNode(node)
    setIsInstallGuideOpen(true)
  }

  // Open Delete Dialog
  const openDeleteDialog = (node: NodeTelemetry) => {
    setSelectedNode(node)
    setIsDeleteOpen(true)
  }

  // Toggle user selection in form
  const toggleUserSelection = (userId: string) => {
    setFormData((prev) => {
      const exists = prev.assignedUserIds.includes(userId)
      if (exists) {
        return {
          ...prev,
          assignedUserIds: prev.assignedUserIds.filter((id) => id !== userId),
        }
      } else {
        return {
          ...prev,
          assignedUserIds: [...prev.assignedUserIds, userId],
        }
      }
    })
  }

  // Submit Register Node
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    if (!formData.hostname.trim() || !formData.ip_v4.trim()) {
      setFormError("Hostname dan IP Address VPS wajib diisi.")
      return
    }

    const tagsArray = rawTagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      const res = await fetch("/api/admin/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      })
      const result = await res.json()
      if (!res.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal mendaftarkan VPS.")
      }

      setFormSuccess("VPS Node berhasil didaftarkan ke jaringan armada.")
      setTimeout(() => {
        setIsRegisterOpen(false)
        refreshData()
      }, 1000)
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  // Submit Edit Node
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNode) return
    setFormError(null)
    setFormSuccess(null)

    const tagsArray = rawTagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      const res = await fetch("/api/admin/nodes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: selectedNode.node_id,
          updates: {
            hostname: formData.hostname,
            ip_v4: formData.ip_v4,
            os: formData.os,
            ssh_port: formData.ssh_port,
            description: formData.description,
            tags: tagsArray,
            assignedUserIds: formData.assignedUserIds,
            status: formData.status,
          },
        }),
      })
      const result = await res.json()
      if (!res.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal memperbarui konfigurasi VPS.")
      }

      setFormSuccess("Konfigurasi VPS Node berhasil diperbarui.")
      setTimeout(() => {
        setIsEditOpen(false)
        refreshData()
      }, 1000)
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  // Submit Quick Assign Users
  const handleAssignUsersSubmit = async () => {
    if (!selectedNode) return
    try {
      const res = await fetch("/api/admin/nodes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: selectedNode.node_id,
          updates: {
            assignedUserIds: formData.assignedUserIds,
          },
        }),
      })
      if (res.ok) {
        setIsAssignUsersOpen(false)
        refreshData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Submit Delete Node
  const handleDeleteSubmit = async () => {
    if (!selectedNode) return
    try {
      const res = await fetch(`/api/admin/nodes?id=${selectedNode.node_id}`, {
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

  // Filtered Nodes
  const filteredNodes = React.useMemo(() => {
    return nodes.filter((n) => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        n.hostname.toLowerCase().includes(q) ||
        n.ip_v4.includes(q) ||
        n.node_id.toLowerCase().includes(q) ||
        n.os.toLowerCase().includes(q) ||
        (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))

      const matchStatus = statusFilter === "all" || n.status === statusFilter

      const assignedIds =
        n.assignedUserIds || (n.project_id ? [n.project_id] : [])
      const matchUser = userFilter === "all" || assignedIds.includes(userFilter)

      return matchSearch && matchStatus && matchUser
    })
  }, [nodes, searchQuery, statusFilter, userFilter])

  // Aggregate stats
  const totalNodes = nodes.length
  const onlineNodes = nodes.filter((n) => n.status === "ONLINE").length
  const tamperedNodes = nodes.filter((n) => n.status === "TAMPERED").length
  const offlineNodes = nodes.filter((n) => n.status === "OFFLINE").length

  const renderUserSelector = (labelText: string, hintText: string) => (
    <div className="space-y-2.5 border-t border-border/70 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={modalLabelClass}>
          {labelText} ({formData.assignedUserIds.length} user dipilih)
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {hintText}
        </span>
      </div>

      {users.length === 0 ? (
        <div className="rounded-base border-2 border-dashed border-border bg-muted/15 p-3 font-sans text-xs text-muted-foreground">
          Belum ada user terdaftar.
        </div>
      ) : (
        <div className="grid max-h-44 grid-cols-1 gap-2.5 overflow-y-auto rounded-base border-2 border-border bg-muted/15 p-2.5 sm:grid-cols-2">
          {users.map((user) => {
            const isSelected = formData.assignedUserIds.includes(user.id)
            return (
              <button
                type="button"
                key={user.id}
                onClick={() => toggleUserSelection(user.id)}
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
                      {user.name}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 text-[9px]">
                  {user.role}
                </Badge>
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
              Daftar VPS &amp; Node Sentinel
            </h1>
            <Badge
              variant="outline"
              className="border-emerald-500/50 bg-emerald-500/10 font-mono text-[11px] font-bold tracking-wider text-emerald-500"
            >
              FLEET CLUSTER
            </Badge>
          </div>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
            Daftarkan dan awasi server VPS Linux yang diproteksi oleh daemon
            Sentinel Pasax. Setiap VPS dapat dikelola oleh satu atau banyak
            user.
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
              onClick={openRegisterDialog}
              className="h-9 border-2 bg-main font-heading text-xs font-black whitespace-nowrap text-black shadow-[3px_3px_0px_0px_var(--border)] hover:bg-main/90"
            >
              <Plus className="mr-1.5 size-4 stroke-[3]" />
              Daftarkan VPS Baru
            </Button>
          )}
        </div>
      </div>

      {/* Otoritas Monitoring Admin Banner */}
      <div className="relative overflow-hidden rounded-base border-2 border-border bg-card p-4 shadow-[4px_4px_0px_0px_var(--border)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl space-y-1">
            <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
              <ShieldCheck className="size-4.5 shrink-0 text-main" />
              <span>
                {isAdminOrSuperadmin
                  ? `Monitoring Armada VPS Milik Anda (${currentRole} View)`
                  : `Monitoring Node VPS yang Ditugaskan (${currentRole} View)`}
              </span>
            </div>
            <p className="font-sans text-xs leading-relaxed text-pretty text-muted-foreground">
              {isAdminOrSuperadmin ? (
                <>
                  Anda memantau <strong>node VPS milik akun Anda</strong> serta
                  penugasan untuk tim <strong>Programmer Aplikasi</strong> dan{" "}
                  <strong>Server Maintainer (DevOps)</strong> yang Anda buat.
                </>
              ) : (
                <>
                  Anda memantau <strong>node VPS yang ditugaskan</strong> kepada
                  akun Anda oleh Admin armada.
                </>
              )}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link href="/users">
              <Button
                variant="outline"
                className="gap-1.5 border-2 font-heading text-xs font-bold whitespace-nowrap shadow-[2px_2px_0px_0px_var(--border)]"
              >
                <Users className="size-3.5" />
                <span>Kelola Tim VPS</span>
              </Button>
            </Link>
            <Link href="/permissions">
              <Button
                variant="outline"
                className="gap-1.5 border-2 font-heading text-xs font-bold whitespace-nowrap shadow-[2px_2px_0px_0px_var(--border)]"
              >
                <ShieldCheck className="size-3.5" />
                <span>Matriks Hak Akses Peran</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Tactical Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                TOTAL VPS TERDAFTAR
              </span>
              <Server className="size-4 shrink-0 text-main" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-foreground tabular-nums">
              {totalNodes}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Node Linux dalam armada
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                ONLINE &amp; TERLINDUNGI
              </span>
              <span className="size-2 shrink-0 animate-pulse rounded-full bg-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-500 tabular-nums">
              {onlineNodes}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Kernel firewall aktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                TAMPERED / PERINGATAN
              </span>
              <ShieldAlert className="size-4 shrink-0 text-rose-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-rose-500 tabular-nums">
              {tamperedNodes}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Deteksi integritas file (FIM)
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                OFFLINE / TIDAK AKTIF
              </span>
              <Power className="size-4 shrink-0 text-muted-foreground" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-muted-foreground tabular-nums">
              {offlineNodes}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Perlu inspeksi daemon
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
                placeholder="Cari berdasarkan hostname, IP publik, OS, ID node, atau tags..."
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

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                <option value="all">Semua Status</option>
                <option value="ONLINE">ONLINE</option>
                <option value="TAMPERED">TAMPERED</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>

              {/* Pemegang Filter */}
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="h-9 max-w-[180px] truncate rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
              >
                <option value="all">Semua Pemegang VPS</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center rounded-base border-2 border-border bg-muted/20 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`rounded p-1.5 ${viewMode === "table" ? "bg-main text-black" : "text-muted-foreground"}`}
                  title="Tampilan Tabel"
                >
                  <List className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded p-1.5 ${viewMode === "grid" ? "bg-main text-black" : "text-muted-foreground"}`}
                  title="Tampilan Grid Card"
                >
                  <LayoutGrid className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Display: Table View or Grid View */}
      {viewMode === "table" ? (
        <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
          <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Server className="size-5 text-main" />
                <CardTitle className="font-heading text-lg font-black text-foreground tabular-nums">
                  Armada Node VPS Terdaftar ({filteredNodes.length})
                </CardTitle>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                Satu VPS &harr; Banyak Pemegang
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-border bg-muted/30">
                    <TableHead className="px-2.5 font-mono text-[11px] font-bold tracking-wider text-foreground">
                      HOSTNAME &amp; IP
                    </TableHead>
                    <TableHead className="px-2 font-mono text-[11px] font-bold tracking-wider text-foreground">
                      STATUS
                    </TableHead>
                    <TableHead className="px-2.5 font-mono text-[11px] font-bold tracking-wider text-foreground">
                      PEMEGANG VPS
                    </TableHead>
                    <TableHead className="px-2.5 font-mono text-[11px] font-bold tracking-wider text-foreground">
                      OS &amp; WEB
                    </TableHead>
                    <TableHead className="px-2 text-center font-mono text-[11px] font-bold tracking-wider text-foreground">
                      TELEMETRI
                    </TableHead>
                    <TableHead className="px-2 font-mono text-[11px] font-bold tracking-wider text-foreground">
                      TAGS
                    </TableHead>
                    <TableHead className="px-2.5 text-right font-mono text-[11px] font-bold tracking-wider text-foreground">
                      AKSI
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNodes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center font-mono text-xs text-muted-foreground"
                      >
                        Tidak ada VPS yang cocok dengan kriteria pencarian.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNodes.map((node) => {
                      const assignedUserIds =
                        node.assignedUserIds ||
                        (node.project_id ? [node.project_id] : [])
                      const assignedUsers = users.filter(
                        (u) =>
                          assignedUserIds.includes(u.id) ||
                          u.assignedNodeIds?.includes(node.node_id)
                      )

                      const nginxVhosts =
                        node.webservers?.nginx?.vhosts?.length || 0
                      const apacheVhosts =
                        node.webservers?.apache2?.vhosts?.length || 0
                      const totalVhosts = nginxVhosts + apacheVhosts

                      return (
                        <TableRow
                          key={node.node_id}
                          className="border-b border-border/60 transition-colors hover:bg-muted/10"
                        >
                          {/* 1. Hostname & IP */}
                          <TableCell className="max-w-[155px] px-2.5 py-2.5 font-mono whitespace-normal">
                            <div className="flex flex-col">
                              <span className="truncate font-heading text-sm font-black text-foreground">
                                {node.hostname}
                              </span>
                              <div className="mt-0.5 flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-foreground tabular-nums">
                                  {node.ip_v4}
                                </span>
                                <button
                                  onClick={() => handleCopy(node.ip_v4)}
                                  title="Salin IP"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {copiedText === node.ip_v4 ? (
                                    <Check className="size-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="size-3" />
                                  )}
                                </button>
                                <span className="text-[10px] text-muted-foreground tabular-nums">
                                  :{node.ssh_port || 22}
                                </span>
                              </div>
                              <span className="mt-0.5 truncate text-[10px] text-muted-foreground/80">
                                ID:{" "}
                                <code className="rounded bg-muted px-1 py-0.5">
                                  {node.node_id}
                                </code>
                              </span>
                            </div>
                          </TableCell>

                          {/* 2. Status */}
                          <TableCell className="px-2 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`size-2 rounded-full ${
                                  node.status === "ONLINE"
                                    ? "animate-pulse bg-emerald-500"
                                    : node.status === "TAMPERED"
                                      ? "animate-pulse bg-rose-500"
                                      : "bg-muted-foreground"
                                }`}
                              />
                              <Badge
                                variant="outline"
                                className={`font-mono text-[10px] font-bold tracking-wider ${
                                  node.status === "ONLINE"
                                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : node.status === "TAMPERED"
                                      ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
                                      : "border-border bg-muted/40 text-muted-foreground"
                                }`}
                              >
                                {node.status}
                              </Badge>
                            </div>
                          </TableCell>

                          {/* 3. Pemegang VPS (Multi-user) */}
                          <TableCell className="max-w-[180px] px-2.5 py-2.5 whitespace-normal">
                            <div className="flex flex-col gap-1.5">
                              {assignedUsers.length === 0 ? (
                                <span className="font-mono text-[11px] text-muted-foreground italic">
                                  Belum ada pemegang
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {assignedUsers.map((user) => (
                                    <Badge
                                      key={user.id}
                                      variant="outline"
                                      className={`flex items-center gap-1 border-2 px-1.5 py-0.5 font-mono text-[10px] ${
                                        user.role === "Programmer"
                                          ? "border-purple-500/50 bg-purple-500/10 text-purple-700 dark:text-purple-300"
                                          : user.role === "DevOps"
                                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                            : "border-main/50 bg-main/10 text-foreground"
                                      }`}
                                    >
                                      <Users className="size-2.5" />
                                      <span>{user.name.split(" ")[0]}</span>
                                      <span className="text-[9px] font-bold">
                                        ({user.role})
                                      </span>
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {isAdminOrSuperadmin && (
                                <button
                                  onClick={() => openAssignUsersDialog(node)}
                                  className="flex w-fit items-center gap-1 font-mono text-[10px] font-bold text-main hover:underline"
                                >
                                  <Users className="size-3" />
                                  <span>
                                    {assignedUsers.length > 0
                                      ? "Atur Pemegang VPS"
                                      : "+ Tugaskan Pengguna"}
                                  </span>
                                </button>
                              )}
                            </div>
                          </TableCell>

                          {/* 4. OS & Webserver */}
                          <TableCell className="max-w-[140px] px-2.5 py-2.5 font-mono text-xs whitespace-normal">
                            <div className="flex flex-col gap-0.5">
                              <span className="truncate font-semibold text-foreground">
                                {node.os}
                              </span>
                              <span className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                                <Globe className="size-3 shrink-0" />
                                <span className="truncate">
                                  {totalVhosts > 0
                                    ? `${totalVhosts} VHost aktif`
                                    : "Webserver auto-recon"}
                                </span>
                              </span>
                            </div>
                          </TableCell>

                          {/* 5. Telemetri */}
                          <TableCell className="px-2 py-2.5 text-center font-mono text-xs">
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1.5 text-[11px] tabular-nums">
                                <span className="text-muted-foreground">
                                  CPU:
                                </span>
                                <span className="font-bold text-foreground">
                                  {node.cpu_used_percent}%
                                </span>
                                <span className="text-muted-foreground">
                                  RAM:
                                </span>
                                <span className="font-bold text-foreground">
                                  {node.memory_used_percent}%
                                </span>
                              </div>
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground tabular-nums">
                                <Clock className="size-2.5" />
                                Up: {Math.floor(
                                  node.uptime_seconds / 86400
                                )}h{" "}
                                {Math.floor(
                                  (node.uptime_seconds % 86400) / 3600
                                )}
                                j
                              </span>
                            </div>
                          </TableCell>

                          {/* 6. Tags */}
                          <TableCell className="max-w-[100px] px-2 py-2.5 whitespace-normal">
                            <div className="flex flex-wrap gap-1">
                              {(node.tags && node.tags.length > 0
                                ? node.tags
                                : ["Production"]
                              ).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="border-border px-1.5 py-0 font-mono text-[9px]"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>

                          {/* 7. Actions */}
                          <TableCell className="px-2.5 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              <Link
                                href={`/terminal?nodeId=${encodeURIComponent(node.node_id)}`}
                                title="Buka Web Terminal SSH (Xterm.js)"
                                className={buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                  className:
                                    "size-7 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600",
                                })}
                              >
                                <TerminalSquare className="size-3.5" />
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openInstallGuide(node)}
                                title="Script Pasang Agen Sentinel"
                                className="size-7 text-sky-500 hover:bg-sky-500/10 hover:text-sky-600"
                              >
                                <Terminal className="size-3.5" />
                              </Button>
                              {isAdminOrSuperadmin && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDialog(node)}
                                    title="Edit VPS"
                                    className="size-7"
                                  >
                                    <Edit className="size-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openDeleteDialog(node)}
                                    title="Hapus VPS"
                                    className="size-7 text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </>
                              )}
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
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNodes.map((node) => {
            const assignedUserIds =
              node.assignedUserIds || (node.project_id ? [node.project_id] : [])
            const assignedUsers = users.filter(
              (u) =>
                assignedUserIds.includes(u.id) ||
                u.assignedNodeIds?.includes(node.node_id)
            )

            return (
              <Card
                key={node.node_id}
                className="flex flex-col justify-between border-2 shadow-[3px_3px_0px_0px_var(--border)]"
              >
                <CardHeader className="border-b border-border/80 bg-muted/10 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2.5 shrink-0 rounded-full ${
                            node.status === "ONLINE"
                              ? "animate-pulse bg-emerald-500"
                              : node.status === "TAMPERED"
                                ? "animate-pulse bg-rose-500"
                                : "bg-muted-foreground"
                          }`}
                        />
                        <CardTitle className="truncate font-heading text-base font-black text-foreground">
                          {node.hostname}
                        </CardTitle>
                      </div>
                      <div className="mt-1 flex items-center gap-1 font-mono text-xs text-muted-foreground tabular-nums">
                        <span>
                          {node.ip_v4}:{node.ssh_port || 22}
                        </span>
                        <button
                          onClick={() => handleCopy(node.ip_v4)}
                          className="hover:text-foreground"
                        >
                          {copiedText === node.ip_v4 ? (
                            <Check className="size-3 text-emerald-500" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`shrink-0 font-mono text-[10px] font-bold ${
                        node.status === "ONLINE"
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {node.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3 p-4 font-mono text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">
                      Sistem Operasi:
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {node.os}
                    </p>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Pemegang VPS:
                      </span>
                      {isAdminOrSuperadmin && (
                        <button
                          onClick={() => openAssignUsersDialog(node)}
                          className="text-[10px] font-bold text-main hover:underline"
                        >
                          + Atur Pemegang
                        </button>
                      )}
                    </div>
                    {assignedUsers.length === 0 ? (
                      <span className="text-[11px] text-muted-foreground italic">
                        Belum ada pemegang
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {assignedUsers.map((u) => (
                          <Badge
                            key={u.id}
                            variant="outline"
                            className="border-main/50 bg-main/10 text-[10px] text-foreground"
                          >
                            {u.name.split(" ")[0]} ({u.role})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
                    <div className="rounded border border-border/60 bg-muted/20 p-2">
                      <span className="text-[10px] text-muted-foreground">
                        CPU Usage
                      </span>
                      <div className="text-sm font-bold text-foreground tabular-nums">
                        {node.cpu_used_percent}%
                      </div>
                    </div>
                    <div className="rounded border border-border/60 bg-muted/20 p-2">
                      <span className="text-[10px] text-muted-foreground">
                        RAM Usage
                      </span>
                      <div className="text-sm font-bold text-foreground tabular-nums">
                        {node.memory_used_percent}%
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(node.tags || ["Production"]).map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="border-border text-[9px]"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/20 p-3">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/terminal?nodeId=${encodeURIComponent(node.node_id)}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className:
                          "border-emerald-500/40 font-mono text-xs text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
                      })}
                    >
                      <TerminalSquare className="mr-1.5 size-3" />
                      Terminal
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openInstallGuide(node)}
                      className="border-sky-500/40 font-mono text-xs text-sky-500 hover:bg-sky-500/10"
                    >
                      <Terminal className="mr-1.5 size-3" />
                      Agen
                    </Button>
                  </div>

                  {isAdminOrSuperadmin && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(node)}
                        className="size-8"
                      >
                        <Edit className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(node)}
                        className="size-8 text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* 5. MODAL: DAFTARKAN VPS BARU */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/15 text-main shadow-[2px_2px_0px_0px_var(--border)]">
                <Plus className="size-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <DialogTitle>
                  Daftarkan Server VPS Baru ke Armada SOC
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Masukkan spesifikasi VPS Linux target dan tentukan operator
                  pemegang server ini. Satu VPS dapat ditugaskan ke beberapa
                  user sekaligus.
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

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  Hostname VPS Server <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Misal: prod-vps-sg01"
                  value={formData.hostname}
                  onChange={(e) =>
                    setFormData({ ...formData, hostname: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  IP Publik IPv4 <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Misal: 203.0.113.195"
                  value={formData.ip_v4}
                  onChange={(e) =>
                    setFormData({ ...formData, ip_v4: e.target.value })
                  }
                  className={`${modalInputClass} tabular-nums`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className={modalLabelClass}>Distro Linux / OS</label>
                <select
                  value={formData.os}
                  onChange={(e) =>
                    setFormData({ ...formData, os: e.target.value })
                  }
                  className={modalSelectClass}
                >
                  <option value="Ubuntu 24.04 LTS (Noble)">
                    Ubuntu 24.04 LTS (Noble)
                  </option>
                  <option value="Ubuntu 22.04 LTS (Jammy)">
                    Ubuntu 22.04 LTS (Jammy)
                  </option>
                  <option value="Debian 12 (Bookworm)">
                    Debian 12 (Bookworm)
                  </option>
                  <option value="Debian 11 (Bullseye)">
                    Debian 11 (Bullseye)
                  </option>
                  <option value="RHEL / Rocky Linux 9">
                    RHEL / Rocky Linux 9
                  </option>
                  <option value="Alpine Linux 3.19">Alpine Linux 3.19</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>SSH Port</label>
                <Input
                  type="number"
                  value={formData.ssh_port}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ssh_port: parseInt(e.target.value) || 22,
                    })
                  }
                  className={`${modalInputClass} tabular-nums`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  Tags / Kluster (pisahkan koma)
                </label>
                <Input
                  placeholder="Production, Singapore, Edge-WAF"
                  value={rawTagInput}
                  onChange={(e) => setRawTagInput(e.target.value)}
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Catatan / Deskripsi</label>
                <Input
                  placeholder="Misal: Kluster utama server aplikasi"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>
            </div>

            {renderUserSelector(
              "Pilih Pemegang VPS",
              "Centang semua user yang berhak mengelola"
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegisterOpen(false)}
                className="h-9 border-2 font-sans text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="h-9 border-2 border-border bg-main font-heading text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90"
              >
                Daftarkan VPS ke Armada
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. MODAL: EDIT VPS NODE */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/15 text-main shadow-[2px_2px_0px_0px_var(--border)]">
                <Edit className="size-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle>
                  Perbarui Konfigurasi VPS &amp; Pemegang
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Sesuaikan identitas jaringan, status operasional, tag kluster,
                  dan anggota tim yang berhak mengakses node ini.
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
                  Hostname <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={formData.hostname}
                  onChange={(e) =>
                    setFormData({ ...formData, hostname: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>
                  IP Publik IPv4 <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={formData.ip_v4}
                  onChange={(e) =>
                    setFormData({ ...formData, ip_v4: e.target.value })
                  }
                  className={`${modalInputClass} tabular-nums`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className={modalLabelClass}>Distro Linux / OS</label>
                <Input
                  value={formData.os}
                  onChange={(e) =>
                    setFormData({ ...formData, os: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Status Node</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className={modalSelectClass}
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="TAMPERED">TAMPERED</option>
                  <option value="OFFLINE">OFFLINE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={modalLabelClass}>Tags / Kluster</label>
                <Input
                  value={rawTagInput}
                  onChange={(e) => setRawTagInput(e.target.value)}
                  className={modalInputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={modalLabelClass}>Catatan / Deskripsi</label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={modalInputClass}
                />
              </div>
            </div>

            {renderUserSelector(
              "Pemegang VPS",
              "Centang user yang berhak mengelola"
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

      {/* 7. MODAL: ATUR PEMEGANG VPS CEPAT */}
      <Dialog open={isAssignUsersOpen} onOpenChange={setIsAssignUsersOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/15 text-main shadow-[2px_2px_0px_0px_var(--border)]">
                <Users className="size-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle>
                  Kelola Pemegang VPS {selectedNode?.hostname}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Pilih pengguna yang memiliki wewenang untuk memantau dan
                  mengelola VPS ini. Satu VPS bisa ditangani banyak pengguna.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {users.map((user) => {
              const isSelected = formData.assignedUserIds.includes(user.id)
              return (
                <button
                  type="button"
                  key={user.id}
                  onClick={() => toggleUserSelection(user.id)}
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
                        {user.name}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {user.email} &bull; {user.organization || "Personal"}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {user.role}
                  </Badge>
                </button>
              )
            })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAssignUsersOpen(false)}
              className="h-9 border-2 font-sans text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleAssignUsersSubmit}
              className="h-9 border-2 border-border bg-main font-heading text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90"
            >
              Terapkan Pemegang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. MODAL: PANDUAN INSTALASI AGEN SENTINEL */}
      <Dialog open={isInstallGuideOpen} onOpenChange={setIsInstallGuideOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-sky-500/15 text-sky-500 shadow-[2px_2px_0px_0px_var(--border)]">
                <Terminal className="size-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle>
                  Pasang Agen Sentinel di VPS {selectedNode?.hostname}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Jalankan perintah berikut di terminal root VPS (
                  <span className="font-mono text-foreground tabular-nums">
                    {selectedNode?.ip_v4}
                  </span>
                  ) untuk menghubungkan Sentinel Daemon ke sistem SOC Pasax.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 font-mono text-xs">
            <div className="rounded-base border-2 border-border bg-black/95 p-4 text-emerald-400 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="mb-2 flex items-center justify-between border-b border-border/40 pb-2 text-[11px] text-neutral-400">
                <span>BASH COMMAND</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `curl -sSL https://pasax.web.id/install.sh | sudo bash -s -- --node-id ${selectedNode?.node_id}`
                    )
                  }
                  className="flex items-center gap-1 font-bold text-white hover:text-emerald-300"
                >
                  {copiedText ? (
                    <>
                      <Check className="size-3 text-emerald-500" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <code className="font-mono text-xs leading-relaxed break-all select-all">
                curl -sSL https://pasax.web.id/install.sh | sudo bash -s --
                --node-id {selectedNode?.node_id}
              </code>
            </div>

            <div className="space-y-1.5 font-sans text-xs text-muted-foreground">
              <p className="font-bold text-foreground">
                Apa yang dilakukan script ini?
              </p>
              <ul className="list-disc space-y-1 pl-4 leading-relaxed">
                <li>
                  Menginstal service daemon lightweight Pasax Sentinel di{" "}
                  <code className="font-mono text-foreground">
                    /usr/local/bin/pasax-sentinel
                  </code>
                  .
                </li>
                <li>
                  Mengaktifkan proteksi firewall kernel Linux (nftables drop
                  rate &lt; 0.2ms).
                </li>
                <li>
                  Memindai otomatis virtual host Nginx &amp; Apache2 beserta
                  sertifikat SSL.
                </li>
                <li>Mengirim telemetri berkala ke konsol SOC Pasax.</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => setIsInstallGuideOpen(false)}
              className="h-9 border-2 border-border bg-main font-heading text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90"
            >
              Tutup Panduan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 9. MODAL: KONFIRMASI HAPUS VPS */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md border-destructive/60">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-base border-2 border-border bg-destructive/15 text-destructive shadow-[2px_2px_0px_0px_var(--border)]">
              <AlertCircle className="size-5 stroke-[2.5]" />
            </div>
            <DialogTitle className="text-destructive">
              Konfirmasi Hapus VPS
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus VPS{" "}
              <strong className="text-foreground">
                {selectedNode?.hostname}
              </strong>{" "}
              (
              <span className="font-mono text-foreground tabular-nums">
                {selectedNode?.ip_v4}
              </span>
              ) dari pengawasan armada? Semua telemetri dan asosiasi pemegang
              VPS akan diputuskan.
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
              Hapus VPS dari Armada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
