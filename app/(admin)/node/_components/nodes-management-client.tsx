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
  Activity,
  Globe,
  Filter,
  Layers,
  Cpu,
  HardDrive,
  Clock,
  LayoutGrid,
  List,
  Power,
  ShieldAlert,
  Tag,
} from "lucide-react"
import { ManagedUser, NodeTelemetry } from "@/lib/store"

interface NodesManagementClientProps {
  initialNodes: NodeTelemetry[]
  initialUsers: ManagedUser[]
  currentRole?: string
}

export function NodesManagementClient({
  initialNodes = [],
  initialUsers = [],
  currentRole = "Superadmin",
}: NodesManagementClientProps) {
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
  const [selectedNode, setSelectedNode] = React.useState<NodeTelemetry | null>(null)

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

      const assignedIds = n.assignedUserIds || (n.project_id ? [n.project_id] : [])
      const matchUser = userFilter === "all" || assignedIds.includes(userFilter)

      return matchSearch && matchStatus && matchUser
    })
  }, [nodes, searchQuery, statusFilter, userFilter])

  // Aggregate stats
  const totalNodes = nodes.length
  const onlineNodes = nodes.filter((n) => n.status === "ONLINE").length
  const tamperedNodes = nodes.filter((n) => n.status === "TAMPERED").length
  const offlineNodes = nodes.filter((n) => n.status === "OFFLINE").length

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Daftar VPS &amp; Node Sentinel
            </h1>
            <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-500 font-mono text-xs">
              FLEET CLUSTER
            </Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Daftarkan dan awasi server VPS Linux yang diproteksi oleh daemon Sentinel Pasax. Setiap VPS dapat dikelola oleh satu atau banyak user.
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
            onClick={openRegisterDialog}
            className="border-2 bg-main text-black hover:bg-main/90 font-heading text-xs font-black shadow-[3px_3px_0px_0px_var(--border)]"
          >
            <Plus className="mr-1.5 size-4 stroke-[3]" />
            Daftarkan VPS Baru
          </Button>
        </div>
      </div>

      {/* 2. Tactical Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">TOTAL VPS TERDAFTAR</span>
              <Server className="size-4 text-main" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-foreground">
              {totalNodes}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Node Linux dalam armada
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">ONLINE &amp; TERLINDUNGI</span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-500">
              {onlineNodes}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Kernel firewall aktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">TAMPERED / PERINGATAN</span>
              <ShieldAlert className="size-4 text-rose-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-rose-500">
              {tamperedNodes}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Deteksi integritas file (FIM)
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">OFFLINE / TIDAK AKTIF</span>
              <Power className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-muted-foreground">
              {offlineNodes}
            </div>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
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
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan hostname, IP publik, OS, ID node, atau tags..."
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
                className="h-9 rounded-base border-2 border-border bg-background px-2.5 font-mono text-xs font-semibold focus:border-main focus:outline-hidden max-w-[180px] truncate"
              >
                <option value="all">Semua Pemegang VPS</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center rounded-base border-2 border-border p-0.5 bg-muted/20">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded ${viewMode === "table" ? "bg-main text-black" : "text-muted-foreground"}`}
                  title="Tampilan Tabel"
                >
                  <List className="size-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded ${viewMode === "grid" ? "bg-main text-black" : "text-muted-foreground"}`}
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
          <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="size-5 text-main" />
                <CardTitle className="font-heading text-lg font-black text-foreground">
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
                    <TableHead className="font-mono text-xs font-bold text-foreground">HOSTNAME &amp; IP</TableHead>
                    <TableHead className="font-mono text-xs font-bold text-foreground">STATUS</TableHead>
                    <TableHead className="font-mono text-xs font-bold text-foreground">PEMEGANG VPS (USERS)</TableHead>
                    <TableHead className="font-mono text-xs font-bold text-foreground">OS &amp; WEBSERVER</TableHead>
                    <TableHead className="font-mono text-xs font-bold text-foreground text-center">TELEMETRI</TableHead>
                    <TableHead className="font-mono text-xs font-bold text-foreground">KLUSTER / TAGS</TableHead>
                    <TableHead className="font-mono text-xs font-bold text-foreground text-right">AKSI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNodes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center font-mono text-xs text-muted-foreground">
                        Tidak ada VPS yang cocok dengan kriteria pencarian.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNodes.map((node) => {
                      const assignedUserIds = node.assignedUserIds || (node.project_id ? [node.project_id] : [])
                      const assignedUsers = users.filter(
                        (u) => assignedUserIds.includes(u.id) || u.assignedNodeIds?.includes(node.node_id)
                      )

                      const nginxVhosts = node.webservers?.nginx?.vhosts?.length || 0
                      const apacheVhosts = node.webservers?.apache2?.vhosts?.length || 0
                      const totalVhosts = nginxVhosts + apacheVhosts

                      return (
                        <TableRow key={node.node_id} className="border-b border-border/60 hover:bg-muted/10 transition-colors">
                          {/* 1. Hostname & IP */}
                          <TableCell className="font-mono">
                            <div className="flex flex-col">
                              <span className="font-heading font-black text-foreground text-sm flex items-center gap-1.5">
                                {node.hostname}
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-foreground font-semibold">{node.ip_v4}</span>
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
                                <span className="text-[10px] text-muted-foreground">
                                  :{node.ssh_port || 22}
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground/80 mt-0.5">
                                ID: <code className="bg-muted px-1 py-0.5 rounded">{node.node_id}</code>
                              </span>
                            </div>
                          </TableCell>

                          {/* 2. Status */}
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`size-2 rounded-full ${
                                  node.status === "ONLINE"
                                    ? "bg-emerald-500 animate-pulse"
                                    : node.status === "TAMPERED"
                                    ? "bg-rose-500 animate-pulse"
                                    : "bg-muted-foreground"
                                }`}
                              />
                              <Badge
                                variant="outline"
                                className={`font-mono text-[10px] font-bold ${
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
                          <TableCell>
                            <div className="flex flex-col gap-1.5 max-w-[240px]">
                              {assignedUsers.length === 0 ? (
                                <span className="font-mono text-[11px] text-muted-foreground italic">
                                  Belum ada pemegang ditugaskan
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {assignedUsers.map((user) => (
                                    <Badge
                                      key={user.id}
                                      variant="outline"
                                      className="font-mono text-[10px] px-2 py-0.5 flex items-center gap-1 border-main/50 bg-main/10 text-foreground"
                                    >
                                      <Users className="size-2.5 text-main" />
                                      <span>{user.name.split(" ")[0]}</span>
                                      <span className="text-[9px] text-muted-foreground">({user.role})</span>
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <button
                                onClick={() => openAssignUsersDialog(node)}
                                className="font-mono text-[10px] text-main hover:underline flex items-center gap-1 font-bold w-fit"
                              >
                                <Users className="size-3" />
                                <span>{assignedUsers.length > 0 ? "Atur Pemegang VPS" : "+ Tugaskan Pengguna"}</span>
                              </button>
                            </div>
                          </TableCell>

                          {/* 4. OS & Webserver */}
                          <TableCell className="font-mono text-xs">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-foreground">{node.os}</span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Globe className="size-3" />
                                {totalVhosts > 0 ? `${totalVhosts} VHost aktif (Nginx/Apache)` : "Webserver auto-recon"}
                              </span>
                            </div>
                          </TableCell>

                          {/* 5. Telemetri */}
                          <TableCell className="text-center font-mono text-xs">
                            <div className="flex flex-col gap-1 items-center">
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="text-muted-foreground">CPU:</span>
                                <span className="font-bold text-foreground">{node.cpu_used_percent}%</span>
                                <span className="text-muted-foreground">RAM:</span>
                                <span className="font-bold text-foreground">{node.memory_used_percent}%</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="size-2.5" />
                                Up: {Math.floor(node.uptime_seconds / 86400)}h {Math.floor((node.uptime_seconds % 86400) / 3600)}j
                              </span>
                            </div>
                          </TableCell>

                          {/* 6. Tags */}
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {(node.tags && node.tags.length > 0 ? node.tags : ["Production"]).map((tag) => (
                                <Badge key={tag} variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-border">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>

                          {/* 7. Actions */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openInstallGuide(node)}
                                title="Script Pasang Agen Sentinel"
                                className="size-8 text-sky-500 hover:text-sky-600 hover:bg-sky-500/10"
                              >
                                <Terminal className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(node)}
                                title="Edit VPS"
                                className="size-8"
                              >
                                <Edit className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(node)}
                                title="Hapus VPS"
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
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => {
            const assignedUserIds = node.assignedUserIds || (node.project_id ? [node.project_id] : [])
            const assignedUsers = users.filter(
              (u) => assignedUserIds.includes(u.id) || u.assignedNodeIds?.includes(node.node_id)
            )

            return (
              <Card key={node.node_id} className="border-2 shadow-[3px_3px_0px_0px_var(--border)] flex flex-col justify-between">
                <CardHeader className="pb-3 border-b border-border/80 bg-muted/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2.5 rounded-full ${
                            node.status === "ONLINE"
                              ? "bg-emerald-500 animate-pulse"
                              : node.status === "TAMPERED"
                              ? "bg-rose-500 animate-pulse"
                              : "bg-muted-foreground"
                          }`}
                        />
                        <CardTitle className="font-heading text-base font-black text-foreground">
                          {node.hostname}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1 mt-1 font-mono text-xs text-muted-foreground">
                        <span>{node.ip_v4}:{node.ssh_port || 22}</span>
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
                      className={`font-mono text-[10px] font-bold ${
                        node.status === "ONLINE"
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {node.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3 flex-1 font-mono text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">Sistem Operasi:</span>
                    <p className="font-semibold text-foreground text-xs">{node.os}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-muted-foreground">Pemegang VPS:</span>
                      <button
                        onClick={() => openAssignUsersDialog(node)}
                        className="text-[10px] text-main hover:underline font-bold"
                      >
                        + Atur Pemegang
                      </button>
                    </div>
                    {assignedUsers.length === 0 ? (
                      <span className="text-muted-foreground italic text-[11px]">Belum ada pemegang</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {assignedUsers.map((u) => (
                          <Badge key={u.id} variant="outline" className="text-[10px] border-main/50 bg-main/10 text-foreground">
                            {u.name.split(" ")[0]} ({u.role})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div className="p-2 rounded bg-muted/20 border border-border/60">
                      <span className="text-[10px] text-muted-foreground">CPU Usage</span>
                      <div className="font-bold text-foreground text-sm">{node.cpu_used_percent}%</div>
                    </div>
                    <div className="p-2 rounded bg-muted/20 border border-border/60">
                      <span className="text-[10px] text-muted-foreground">RAM Usage</span>
                      <div className="font-bold text-foreground text-sm">{node.memory_used_percent}%</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(node.tags || ["Production"]).map((t) => (
                      <Badge key={t} variant="outline" className="text-[9px] border-border">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInstallGuide(node)}
                    className="font-mono text-xs text-sky-500 border-sky-500/40 hover:bg-sky-500/10"
                  >
                    <Terminal className="mr-1.5 size-3" />
                    Pasang Agen
                  </Button>

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
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* 5. MODAL: DAFTARKAN VPS BARU */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-xl border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-foreground flex items-center gap-2">
              <Plus className="size-5 text-main" />
              <span>Daftarkan Server VPS Baru ke Armada SOC</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Masukkan spesifikasi VPS Linux target dan tentukan operator pemegang server ini. Satu VPS dapat ditugaskan ke beberapa user sekaligus.
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

          <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Hostname VPS Server *</label>
                <Input
                  required
                  placeholder="Misal: prod-vps-sg01"
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">IP Publik IPv4 *</label>
                <Input
                  required
                  placeholder="Misal: 203.0.113.195"
                  value={formData.ip_v4}
                  onChange={(e) => setFormData({ ...formData, ip_v4: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-heading text-xs font-bold">Distro Linux / OS</label>
                <select
                  value={formData.os}
                  onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                  className="w-full h-10 rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
                >
                  <option value="Ubuntu 24.04 LTS (Noble)">Ubuntu 24.04 LTS (Noble)</option>
                  <option value="Ubuntu 22.04 LTS (Jammy)">Ubuntu 22.04 LTS (Jammy)</option>
                  <option value="Debian 12 (Bookworm)">Debian 12 (Bookworm)</option>
                  <option value="Debian 11 (Bullseye)">Debian 11 (Bullseye)</option>
                  <option value="RHEL / Rocky Linux 9">RHEL / Rocky Linux 9</option>
                  <option value="Alpine Linux 3.19">Alpine Linux 3.19</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">SSH Port</label>
                <Input
                  type="number"
                  value={formData.ssh_port}
                  onChange={(e) => setFormData({ ...formData, ssh_port: parseInt(e.target.value) || 22 })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-heading text-xs font-bold">Tags / Kluster Lingkungan (pisahkan dengan koma)</label>
              <Input
                placeholder="Production, Singapore, Edge-WAF"
                value={rawTagInput}
                onChange={(e) => setRawTagInput(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-heading text-xs font-bold">Catatan / Deskripsi Node</label>
              <Input
                placeholder="Misal: Kluster utama server aplikasi pembayaran"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="font-mono text-xs"
              />
            </div>

            {/* Multi-select Users Assignment */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="font-heading text-xs font-bold flex items-center justify-between">
                <span>Pilih Pemegang VPS ({formData.assignedUserIds.length} user dipilih)</span>
                <span className="font-mono text-[10px] text-muted-foreground">Centang semua user yang berhak mengelola</span>
              </label>

              {users.length === 0 ? (
                <p className="font-mono text-xs text-muted-foreground italic">Belum ada user terdaftar.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border-2 rounded-base bg-muted/10">
                  {users.map((user) => {
                    const isSelected = formData.assignedUserIds.includes(user.id)
                    return (
                      <div
                        key={user.id}
                        onClick={() => toggleUserSelection(user.id)}
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
                            <span className="text-foreground">{user.name}</span>
                            <span className="text-[10px] text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[9px]">
                          {user.role}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-main text-black font-heading font-black">
                Daftarkan VPS ke Armada
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. MODAL: EDIT VPS NODE */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-foreground flex items-center gap-2">
              <Edit className="size-5 text-main" />
              <span>Perbarui Konfigurasi VPS &amp; Pemegang</span>
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
                <label className="font-heading text-xs font-bold">Hostname *</label>
                <Input
                  required
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">IP Publik IPv4 *</label>
                <Input
                  required
                  value={formData.ip_v4}
                  onChange={(e) => setFormData({ ...formData, ip_v4: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-heading text-xs font-bold">Distro Linux / OS</label>
                <Input
                  value={formData.os}
                  onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-heading text-xs font-bold">Status Node</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-10 rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold focus:border-main focus:outline-hidden"
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="TAMPERED">TAMPERED</option>
                  <option value="OFFLINE">OFFLINE</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-heading text-xs font-bold">Tags / Kluster</label>
              <Input
                value={rawTagInput}
                onChange={(e) => setRawTagInput(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-heading text-xs font-bold">Catatan / Deskripsi</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="font-mono text-xs"
              />
            </div>

            {/* Multi-select Users Assignment */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="font-heading text-xs font-bold flex items-center justify-between">
                <span>Pemegang VPS ({formData.assignedUserIds.length} user dipilih)</span>
                <span className="font-mono text-[10px] text-muted-foreground">Centang user yang berhak</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border-2 rounded-base bg-muted/10">
                {users.map((user) => {
                  const isSelected = formData.assignedUserIds.includes(user.id)
                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleUserSelection(user.id)}
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
                          <span className="text-foreground">{user.name}</span>
                          <span className="text-[10px] text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px]">
                        {user.role}
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

      {/* 7. MODAL: ATUR PEMEGANG VPS CEPAT */}
      <Dialog open={isAssignUsersOpen} onOpenChange={setIsAssignUsersOpen}>
        <DialogContent className="max-w-md border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-base font-black text-foreground flex items-center gap-2">
              <Users className="size-4 text-main" />
              <span>Kelola Pemegang VPS {selectedNode?.hostname}</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Pilih pengguna yang memiliki wewenang untuk memantau dan mengelola VPS ini. Satu VPS bisa ditangani banyak pengguna.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2 max-h-60 overflow-y-auto">
            {users.map((user) => {
              const isSelected = formData.assignedUserIds.includes(user.id)
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUserSelection(user.id)}
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
                      <div className="font-heading font-black">{user.name}</div>
                      <div className="text-[11px] text-muted-foreground">{user.email} • {user.organization || "Personal"}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {user.role}
                  </Badge>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setIsAssignUsersOpen(false)}>
              Batal
            </Button>
            <Button size="sm" onClick={handleAssignUsersSubmit} className="bg-main text-black font-heading font-black">
              Terapkan Pemegang
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 8. MODAL: PANDUAN INSTALASI AGEN SENTINEL */}
      <Dialog open={isInstallGuideOpen} onOpenChange={setIsInstallGuideOpen}>
        <DialogContent className="max-w-lg border-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-base font-black text-foreground flex items-center gap-2">
              <Terminal className="size-5 text-sky-500" />
              <span>Pasang Agen Sentinel di VPS {selectedNode?.hostname}</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Jalankan perintah berikut di terminal root VPS ({selectedNode?.ip_v4}) untuk menghubungkan Sentinel Daemon ke sistem SOC Pasax.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 font-mono text-xs">
            <div className="rounded-base border-2 border-border bg-black/90 p-4 text-emerald-400">
              <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-2 text-muted-foreground text-[11px]">
                <span>BASH COMMAND</span>
                <button
                  onClick={() =>
                    handleCopy(
                      `curl -sSL https://pasax-service.vercel.app/install.sh | sudo bash -s -- --node-id ${selectedNode?.node_id}`
                    )
                  }
                  className="flex items-center gap-1 hover:text-foreground font-bold"
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
              <code className="break-all select-all text-xs font-mono">
                curl -sSL https://pasax-service.vercel.app/install.sh | sudo bash -s -- --node-id {selectedNode?.node_id}
              </code>
            </div>

            <div className="space-y-1.5 text-muted-foreground text-[11px]">
              <p className="font-bold text-foreground">Apa yang dilakukan script ini?</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Menginstal service daemon lightweight Pasax Sentinel di <code>/usr/local/bin/pasax-sentinel</code>.</li>
                <li>Mengaktifkan proteksi firewall kernel Linux (nftables drop rate &lt; 0.2ms).</li>
                <li>Memindai otomatis virtual host Nginx &amp; Apache2 beserta sertifikat SSL.</li>
                <li>Mengirim telemetri berkala ke konsol SOC Pasax.</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setIsInstallGuideOpen(false)} className="bg-main text-black font-heading font-black">
              Tutup Panduan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 9. MODAL: KONFIRMASI HAPUS VPS */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md border-2 border-destructive/40">
          <DialogHeader>
            <DialogTitle className="font-heading text-base font-black text-destructive flex items-center gap-2">
              <AlertCircle className="size-5" />
              <span>Konfirmasi Hapus VPS</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Apakah Anda yakin ingin menghapus VPS <strong>{selectedNode?.hostname}</strong> ({selectedNode?.ip_v4}) dari pengawasan armada?
              Semua telemetri dan asosiasi pemegang VPS akan diputuskan.
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
              Hapus VPS dari Armada
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
