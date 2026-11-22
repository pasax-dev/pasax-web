"use client"

import * as React from "react"
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  Edit3,
  Trash2,
  Server,
  Shield,
  Layers,
  Sparkles,
  Building2,
  Users,
  Clock,
  RefreshCw,
  Eye,
  EyeOff,
  HelpCircle,
  FileCheck2,
  DollarSign,
  AlertTriangle,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface PricingPlan {
  id: string
  name: string
  slug: string
  category: "standard" | "agency" | "enterprise_gov" | string
  badge?: string
  description: string
  targetAudience?: string
  vpsQuota: number
  appsPerVps: string
  priceMonthlyIdr: number
  priceYearlyIdr: number
  priceMonthlyUsd: number
  priceYearlyUsd: number
  features: string[]
  highlightFeatures?: string[]
  logRetentionDays: number
  maxSeats: number
  crowdDefenseSync: string
  supportSla: string
  complianceCert?: string
  isCustomQuote: boolean
  isActive: boolean
  sortOrder: number
}

interface PricingManagementClientProps {
  initialPlans: PricingPlan[]
}

export function PricingManagementClient({ initialPlans }: PricingManagementClientProps) {
  const [plans, setPlans] = React.useState<PricingPlan[]>(initialPlans)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [currentPlan, setCurrentPlan] = React.useState<PricingPlan | null>(null)
  const [isNewPlan, setIsNewPlan] = React.useState(false)

  // Form state
  const [formData, setFormData] = React.useState<{
    id: string
    name: string
    slug: string
    category: string
    badge: string
    description: string
    targetAudience: string
    vpsQuota: number
    appsPerVps: string
    priceMonthlyIdr: number
    priceYearlyIdr: number
    priceMonthlyUsd: number
    priceYearlyUsd: number
    featuresInput: string
    highlightsInput: string
    logRetentionDays: number
    maxSeats: number
    crowdDefenseSync: string
    supportSla: string
    complianceCert: string
    isCustomQuote: boolean
    isActive: boolean
    sortOrder: number
  }>({
    id: "",
    name: "",
    slug: "",
    category: "standard",
    badge: "",
    description: "",
    targetAudience: "",
    vpsQuota: 1,
    appsPerVps: "Unlimited",
    priceMonthlyIdr: 0,
    priceYearlyIdr: 0,
    priceMonthlyUsd: 0,
    priceYearlyUsd: 0,
    featuresInput: "",
    highlightsInput: "",
    logRetentionDays: 14,
    maxSeats: 1,
    crowdDefenseSync: "1h",
    supportSla: "Standard",
    complianceCert: "",
    isCustomQuote: false,
    isActive: true,
    sortOrder: 1,
  })

  const [notification, setNotification] = React.useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  // Refresh plans from API
  const refreshPlans = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch("/api/admin/pricing?public=false")
      if (res.ok) {
        const json = await res.json()
        const raw = Array.isArray(json) ? json : json.data
        if (Array.isArray(raw)) {
          setPlans(raw)
        }
      }
    } catch {
      showNotification("error", "Gagal menyinkronkan paket dari cloud.")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Filtered plans
  const filteredPlans = React.useMemo(() => {
    return plans.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [plans, searchQuery, categoryFilter])

  // Open Create Modal
  const openCreateModal = () => {
    setIsNewPlan(true)
    setCurrentPlan(null)
    setFormData({
      id: "",
      name: "",
      slug: "",
      category: "standard",
      badge: "NEW",
      description: "",
      targetAudience: "Developer & Tim",
      vpsQuota: 1,
      appsPerVps: "Unlimited",
      priceMonthlyIdr: 99000,
      priceYearlyIdr: 950000,
      priceMonthlyUsd: 7,
      priceYearlyUsd: 70,
      featuresInput:
        "1 Server VPS Terkelola (Sentinel Agent)\nUnlimited Aplikasi Laravel di dalam VPS\nWAF Rule Realtime (SQLi, XSS, Path Traversal)\nKernel Firewall Auto-Drop (nftables)\nRetensi Log Forensik: 14 Hari\nSinkronisasi Crowd Defense: 1 Jam",
      highlightsInput:
        "1 VPS (Unlimited Apps)\nnftables Kernel Drop\nAlert Telegram Instan",
      logRetentionDays: 14,
      maxSeats: 1,
      crowdDefenseSync: "1h",
      supportSla: "Email 48 Jam",
      complianceCert: "Standard Security",
      isCustomQuote: false,
      isActive: true,
      sortOrder: plans.length + 1,
    })
    setIsEditModalOpen(true)
  }

  // Open Edit Modal
  const openEditModal = (plan: PricingPlan) => {
    setIsNewPlan(false)
    setCurrentPlan(plan)
    setFormData({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      category: plan.category,
      badge: plan.badge || "",
      description: plan.description,
      targetAudience: plan.targetAudience || "",
      vpsQuota: plan.vpsQuota,
      appsPerVps: plan.appsPerVps,
      priceMonthlyIdr: plan.priceMonthlyIdr,
      priceYearlyIdr: plan.priceYearlyIdr,
      priceMonthlyUsd: plan.priceMonthlyUsd,
      priceYearlyUsd: plan.priceYearlyUsd,
      featuresInput: plan.features.join("\n"),
      highlightsInput: (plan.highlightFeatures || []).join("\n"),
      logRetentionDays: plan.logRetentionDays,
      maxSeats: plan.maxSeats,
      crowdDefenseSync: plan.crowdDefenseSync,
      supportSla: plan.supportSla,
      complianceCert: plan.complianceCert || "",
      isCustomQuote: plan.isCustomQuote,
      isActive: plan.isActive,
      sortOrder: plan.sortOrder,
    })
    setIsEditModalOpen(true)
  }

  // Handle Save (Create or Update)
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.description.trim()) {
      showNotification("error", "Nama dan deskripsi paket wajib diisi.")
      return
    }

    const features = formData.featuresInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    const highlightFeatures = formData.highlightsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      id: isNewPlan ? undefined : formData.id,
      name: formData.name,
      slug:
        formData.slug ||
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      category: formData.category,
      badge: formData.badge || null,
      description: formData.description,
      targetAudience: formData.targetAudience || null,
      vpsQuota: Number(formData.vpsQuota),
      appsPerVps: formData.appsPerVps || "Unlimited",
      priceMonthlyIdr: Number(formData.priceMonthlyIdr),
      priceYearlyIdr: Number(formData.priceYearlyIdr),
      priceMonthlyUsd: Number(formData.priceMonthlyUsd),
      priceYearlyUsd: Number(formData.priceYearlyUsd),
      features,
      highlightFeatures,
      logRetentionDays: Number(formData.logRetentionDays),
      maxSeats: Number(formData.maxSeats),
      crowdDefenseSync: formData.crowdDefenseSync,
      supportSla: formData.supportSla,
      complianceCert: formData.complianceCert || null,
      isCustomQuote: formData.isCustomQuote,
      isActive: formData.isActive,
      sortOrder: Number(formData.sortOrder),
    }

    try {
      const url = "/api/admin/pricing"
      const method = isNewPlan ? "POST" : "PATCH"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        showNotification(
          "success",
          isNewPlan
            ? `Paket "${formData.name}" berhasil dibuat!`
            : `Paket "${formData.name}" berhasil diperbarui!`
        )
        setIsEditModalOpen(false)
        await refreshPlans()
      } else {
        const err = await res.json().catch(() => null)
        showNotification("error", err?.message || "Gagal menyimpan paket harga.")
      }
    } catch {
      showNotification("error", "Terjadi kesalahan jaringan saat menyimpan.")
    }
  }

  // Handle Delete
  const handleDeletePlan = async () => {
    if (!currentPlan) return
    try {
      const res = await fetch(`/api/admin/pricing?id=${currentPlan.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        showNotification("success", `Paket "${currentPlan.name}" berhasil dihapus.`)
        setIsDeleteModalOpen(false)
        setCurrentPlan(null)
        await refreshPlans()
      } else {
        showNotification("error", "Gagal menghapus paket harga.")
      }
    } catch {
      showNotification("error", "Terjadi kesalahan jaringan saat menghapus.")
    }
  }

  // Quick Toggle Active
  const togglePlanActive = async (plan: PricingPlan) => {
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: plan.id,
          isActive: !plan.isActive,
        }),
      })
      if (res.ok) {
        showNotification(
          "success",
          `Paket "${plan.name}" sekarang ${!plan.isActive ? "Aktif" : "Nonaktif"}.`
        )
        await refreshPlans()
      }
    } catch {
      showNotification("error", "Gagal mengubah status paket.")
    }
  }

  const formatRupiah = (val: number) => {
    if (val === 0) return "Rp 0 (Free)"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {notification && (
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border p-4 text-sm font-medium shadow-md transition-all animate-in fade-in-50",
            notification.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
          )}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertTriangle className="size-4 shrink-0 text-rose-500" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="absolute top-0 right-0 h-full w-96 bg-gradient-to-l from-main/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-main/30 bg-main/10 px-3 py-1 font-mono text-xs font-semibold text-main">
              <Sparkles className="size-3.5" />
              <span>Bundling Per-VPS (Unlimited Laravel Apps)</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground md:text-3xl">
              Model Bisnis &amp; Manajemen Paket Harga
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Konfigurasi paket langganan keamanan siber Laravel. Setiap paket mencakup kuota
              server VPS dengan kapasitas <span className="font-semibold text-foreground">Unlimited Aplikasi Laravel</span> di dalamnya,
              serta fitur kepatuhan khusus Korporasi &amp; Pemerintahan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={refreshPlans}
              disabled={isRefreshing}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-all hover:bg-muted"
            >
              <RefreshCw className={cn("size-3.5", isRefreshing && "animate-spin")} />
              <span>Sinkronisasi</span>
            </button>
            <button
              onClick={openCreateModal}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-main/40 bg-main px-4 font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Tambah Paket Baru</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase">
              Total Paket Terdaftar
            </span>
            <p className="mt-1 font-mono text-xl font-black text-foreground">
              {plans.length}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase">
              Paket Aktif di Web
            </span>
            <p className="mt-1 font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">
              {plans.filter((p) => p.isActive).length}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase">
              Paket Gov / Enterprise
            </span>
            <p className="mt-1 font-mono text-xl font-black text-main">
              {plans.filter((p) => p.category === "enterprise_gov").length}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase">
              Model Bundling
            </span>
            <p className="mt-1 font-mono text-xs font-black text-foreground">
              Per VPS Node (Unlimited Apps)
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari paket, fitur, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-main focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={cn(
              "h-8 rounded-lg px-3 text-xs font-medium transition-all",
              categoryFilter === "all"
                ? "bg-foreground font-semibold text-background shadow-xs"
                : "border border-border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            Semua ({plans.length})
          </button>
          <button
            onClick={() => setCategoryFilter("standard")}
            className={cn(
              "h-8 rounded-lg px-3 text-xs font-medium transition-all",
              categoryFilter === "standard"
                ? "bg-foreground font-semibold text-background shadow-xs"
                : "border border-border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            Developer &amp; Standar
          </button>
          <button
            onClick={() => setCategoryFilter("agency")}
            className={cn(
              "h-8 rounded-lg px-3 text-xs font-medium transition-all",
              categoryFilter === "agency"
                ? "bg-foreground font-semibold text-background shadow-xs"
                : "border border-border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            Agency &amp; Fleet
          </button>
          <button
            onClick={() => setCategoryFilter("enterprise_gov")}
            className={cn(
              "h-8 rounded-lg px-3 text-xs font-medium transition-all",
              categoryFilter === "enterprise_gov"
                ? "bg-foreground font-semibold text-background shadow-xs"
                : "border border-border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            Gov &amp; Enterprise
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-xs transition-all hover:border-main/50 hover:shadow-md",
              !plan.isActive && "opacity-60 bg-muted/20 border-dashed",
              plan.badge === "MOST POPULAR" && "border-main/60 ring-1 ring-main/30",
              plan.category === "enterprise_gov" && "border-blue-500/40"
            )}
          >
            {/* Badges Header */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase",
                      plan.category === "enterprise_gov"
                        ? "border-blue-500/40 bg-blue-500/15 text-blue-600 dark:text-blue-400"
                        : plan.category === "agency"
                        ? "border-purple-500/40 bg-purple-500/15 text-purple-600 dark:text-purple-400"
                        : "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {plan.category.replace("_", " ")}
                  </span>
                  {plan.badge && (
                    <span className="rounded-full border border-main/50 bg-main/20 px-2 py-0.5 font-mono text-[9px] font-black text-foreground uppercase">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => togglePlanActive(plan)}
                    title={plan.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors",
                      plan.isActive
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-muted bg-muted text-muted-foreground"
                    )}
                  >
                    {plan.isActive ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                    <span>{plan.isActive ? "Live di Web" : "Disembunyikan"}</span>
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              {/* Price Tag */}
              <div className="mt-4 rounded-lg border border-border/70 bg-muted/40 p-3.5">
                {plan.isCustomQuote ? (
                  <div>
                    <span className="font-mono text-xl font-black text-foreground">
                      Kontrak Kustom / Negosiasi
                    </span>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Mulai Rp 2.500.000 / bln • Pengadaan APBD/APBN/BUMN
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-2xl font-black text-foreground">
                        {formatRupiah(plan.priceMonthlyIdr)}
                      </span>
                      {plan.priceMonthlyIdr > 0 && (
                        <span className="text-xs text-muted-foreground">/ bulan</span>
                      )}
                    </div>
                    {plan.priceYearlyIdr > 0 && (
                      <p className="mt-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(plan.priceYearlyIdr)} / tahun (Diskon 20%) • ${plan.priceMonthlyUsd}/mo
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bundling Highlights */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/80 p-2">
                  <Server className="size-3.5 text-main" />
                  <div>
                    <p className="font-bold text-foreground">{plan.vpsQuota} VPS Node</p>
                    <p className="text-[10px] text-muted-foreground">Sentinel Daemon</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/80 p-2">
                  <Layers className="size-3.5 text-main" />
                  <div>
                    <p className="font-bold text-foreground">{plan.appsPerVps} Apps</p>
                    <p className="text-[10px] text-muted-foreground">Laravel per Node</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/80 p-2">
                  <Clock className="size-3.5 text-main" />
                  <div>
                    <p className="font-bold text-foreground">{plan.logRetentionDays} Hari</p>
                    <p className="text-[10px] text-muted-foreground">Retensi Forensik</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/80 p-2">
                  <Users className="size-3.5 text-main" />
                  <div>
                    <p className="font-bold text-foreground">{plan.maxSeats} Pengguna</p>
                    <p className="text-[10px] text-muted-foreground">Multi-Admin Seats</p>
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
                <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                  Daftar Fitur Perlindungan:
                </span>
                <ul className="space-y-1.5">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                      <CheckCircle2 className="size-3.5 shrink-0 text-main mt-0.5" />
                      <span className="line-clamp-2">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <span className="font-mono text-[10px] text-muted-foreground">
                Urutan: #{plan.sortOrder}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(plan)}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <Edit3 className="size-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPlan(plan)
                    setIsDeleteModalOpen(true)
                  }}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                >
                  <Trash2 className="size-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Tag className="size-5 text-main" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {isNewPlan ? "Tambah Paket Harga Baru" : `Edit Paket: ${formData.name}`}
                </h2>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-foreground">Nama Paket *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Fleet Mesh (5 VPS)"
                    className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:border-main focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground">Kategori Paket</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:border-main focus:outline-hidden"
                  >
                    <option value="standard">Developer &amp; Standar</option>
                    <option value="agency">Agency &amp; Software House</option>
                    <option value="enterprise_gov">Gov &amp; Korporasi (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-bold text-foreground">Badge Promo / Tanda</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: MOST POPULAR, HEMAT, GOV"
                    className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:border-main focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground">Kuota VPS Node *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.vpsQuota}
                    onChange={(e) => setFormData({ ...formData, vpsQuota: parseInt(e.target.value) || 1 })}
                    className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:border-main focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground">Batas App Laravel per VPS</label>
                  <input
                    type="text"
                    value={formData.appsPerVps}
                    onChange={(e) => setFormData({ ...formData, appsPerVps: e.target.value })}
                    placeholder="Unlimited"
                    className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:border-main focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Deskripsi Ringkas *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan untuk siapa paket ini dan nilai utamanya..."
                  className="mt-1 w-full rounded-md border border-border bg-background p-2 text-xs text-foreground focus:border-main focus:outline-hidden"
                />
              </div>

              {/* Pricing Grid */}
              <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                <span className="font-mono text-[11px] font-bold text-foreground uppercase">
                  Konfigurasi Harga (IDR &amp; USD)
                </span>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="text-[11px] text-muted-foreground">Bulanan IDR (Rp)</label>
                    <input
                      type="number"
                      value={formData.priceMonthlyIdr}
                      onChange={(e) => setFormData({ ...formData, priceMonthlyIdr: parseInt(e.target.value) || 0 })}
                      className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">Tahunan IDR (Rp)</label>
                    <input
                      type="number"
                      value={formData.priceYearlyIdr}
                      onChange={(e) => setFormData({ ...formData, priceYearlyIdr: parseInt(e.target.value) || 0 })}
                      className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">Bulanan USD ($)</label>
                    <input
                      type="number"
                      value={formData.priceMonthlyUsd}
                      onChange={(e) => setFormData({ ...formData, priceMonthlyUsd: parseInt(e.target.value) || 0 })}
                      className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">Tahunan USD ($)</label>
                    <input
                      type="number"
                      value={formData.priceYearlyUsd}
                      onChange={(e) => setFormData({ ...formData, priceYearlyUsd: parseInt(e.target.value) || 0 })}
                      className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCustomQuote"
                    checked={formData.isCustomQuote}
                    onChange={(e) => setFormData({ ...formData, isCustomQuote: e.target.checked })}
                    className="size-4 rounded-sm border-border accent-main"
                  />
                  <label htmlFor="isCustomQuote" className="text-xs text-foreground">
                    Ini adalah paket penawaran khusus / negosiasi (Gov / Enterprise Contract)
                  </label>
                </div>
              </div>

              {/* Technical Limits */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-bold text-foreground">Retensi Log (Hari)</label>
                  <input
                    type="number"
                    value={formData.logRetentionDays}
                    onChange={(e) => setFormData({ ...formData, logRetentionDays: parseInt(e.target.value) || 1 })}
                    className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Maksimal User (Seats)</label>
                  <input
                    type="number"
                    value={formData.maxSeats}
                    onChange={(e) => setFormData({ ...formData, maxSeats: parseInt(e.target.value) || 1 })}
                    className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Sync Blocklist</label>
                  <select
                    value={formData.crowdDefenseSync}
                    onChange={(e) => setFormData({ ...formData, crowdDefenseSync: e.target.value })}
                    className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground"
                  >
                    <option value="24h">Tiap 24 Jam</option>
                    <option value="1h">Tiap 1 Jam</option>
                    <option value="realtime">Real-time Stream</option>
                  </select>
                </div>
              </div>

              {/* Features Input (1 baris per fitur) */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    Daftar Fitur Perlindungan (Tulis 1 fitur per baris)
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    Gunakan baris baru untuk memisahkan fitur
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={formData.featuresInput}
                  onChange={(e) => setFormData({ ...formData, featuresInput: e.target.value })}
                  placeholder="1 Server VPS Terkelola (Sentinel)&#10;Unlimited Aplikasi Laravel di dalam VPS&#10;Kernel Firewall Drop (nftables)"
                  className="mt-1 font-mono w-full rounded-md border border-border bg-background p-2.5 text-xs text-foreground focus:border-main focus:outline-hidden"
                />
              </div>

              {/* Status and Order */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-foreground font-medium">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="size-4 rounded-sm border-border accent-main"
                    />
                    <span>Tampilkan / Aktif di Halaman Web</span>
                  </label>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Urutan:</span>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                      className="h-7 w-16 rounded-md border border-border bg-background px-2 text-center text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="h-9 rounded-md border border-border px-4 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-main bg-main px-4 font-mono text-xs font-bold text-black shadow-xs hover:opacity-90"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Simpan Paket</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-rose-500/30 bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="size-6 shrink-0" />
              <h3 className="font-heading text-lg font-bold">Hapus Paket Harga?</h3>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus paket{" "}
              <span className="font-bold text-foreground">"{currentPlan.name}"</span>?
              Paket ini tidak akan muncul lagi di tabel harga website publik.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="h-8 rounded-md border border-border px-3 text-xs font-medium text-foreground hover:bg-muted"
              >
                Batal
              </button>
              <button
                onClick={handleDeletePlan}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-rose-600 px-4 font-mono text-xs font-bold text-white shadow-xs hover:bg-rose-700"
              >
                <Trash2 className="size-3.5" />
                <span>Hapus Permanen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
