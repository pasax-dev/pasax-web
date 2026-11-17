"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  useFetchSearch,
  type SearchResultRecord,
} from "fumadocs-core/search/client"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import {
  Search,
  Loader2,
  CornerDownLeft,
  X,
  Compass,
  Layers,
  Terminal,
  Shield,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { findDocBySlug } from "@/lib/docs-manifest"
import { cn } from "@/lib/utils"

interface FumadocsSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type CategoryFilter =
  "all" | "core" | "pasax-sentinel" | "pasax-secure-monitor" | "platform"

interface SuggestionItem {
  title: string
  category: string
  url: string
  badge: string
  badgeBg: string
  description: string
}

const DEFAULT_SUGGESTIONS: SuggestionItem[] = [
  {
    title: "Pengenalan Pasax Suite (Trinity Defense)",
    category: "Platform Inti",
    url: "/docs/core/overview",
    badge: "CORE",
    badgeBg: "bg-main text-black",
    description:
      "Arsitektur keamanan siber berlapis tiga: Laravel WAF, Go Sentinel, dan cloud SOC.",
  },
  {
    title: "Firewall Drivers (nftables & iptables)",
    category: "Host & Kernel Defense",
    url: "/docs/pasax-sentinel/04-firewall-drivers",
    badge: "SENTINEL",
    badgeBg: "bg-sky-300 text-black",
    description:
      "Penurunan paket langsung di level kernel Linux dan mitigasi atomik.",
  },
  {
    title: "Threat Detection Engine & WAF",
    category: "Core Engine",
    url: "/docs/pasax-secure-monitor/core-architecture/threat-detection-engine",
    badge: "WAF",
    badgeBg: "bg-emerald-300 text-black",
    description:
      "Deteksi ancaman zero-tolerance PHP murni untuk Laravel 10–13.",
  },
  {
    title: "Threat Map 3D Live — Radar Serangan Global",
    category: "Visualisasi 3D",
    url: "/threats-map",
    badge: "RADAR",
    badgeBg: "bg-rose-400 text-black",
    description:
      "Visualisasi Three.js serangan global real-time dan radar telemetry.",
  },
  {
    title: "SOC Operations Console & Fleet Control",
    category: "Dashboard",
    url: "/dashboard",
    badge: "CONSOLE",
    badgeBg: "bg-amber-300 text-black",
    description:
      "Monitoring armada VPS, telemetry kluster, dan kontrol daemon.",
  },
]

export function FumadocsSearchDialog({
  open,
  onOpenChange,
}: FumadocsSearchDialogProps) {
  const router = useRouter()
  const { search, onSearchChange, isLoading, data } = useFetchSearch({
    api: "/api/search",
  })

  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoryFilter>("all")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  // Focus input when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedIndex(0)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [open])

  // Extract raw search items from Fumadocs response
  const rawItems = React.useMemo(() => {
    if (!data?.items) return []
    return data.items.filter((item): item is SearchResultRecord => {
      return Boolean("url" in item && item.url && "content" in item)
    })
  }, [data])

  // Enrich items with metadata from docs manifest
  const enrichedItems = React.useMemo(() => {
    return rawItems.map((item) => {
      const doc = findDocBySlug(item.url)
      const url = item.url
      let tag: CategoryFilter = "platform"

      if (url.includes("/docs/core")) {
        tag = "core"
      } else if (url.includes("/docs/pasax-sentinel")) {
        tag = "pasax-sentinel"
      } else if (url.includes("/docs/pasax-secure-monitor")) {
        tag = "pasax-secure-monitor"
      }

      const breadcrumbs =
        "breadcrumbs" in item && Array.isArray(item.breadcrumbs)
          ? item.breadcrumbs.join(" / ")
          : "Platform"

      return {
        id: item.id || item.url,
        url: item.url,
        title: item.content || doc?.title || "Dokumentasi Pasax",
        description:
          doc?.description ||
          "Panduan teknis dan referensi arsitektur Pasax Suite.",
        category: doc?.category || breadcrumbs,
        tag,
      }
    })
  }, [rawItems])

  // Filter by selected category tag
  const filteredItems = React.useMemo(() => {
    if (selectedCategory === "all") return enrichedItems
    return enrichedItems.filter((item) => item.tag === selectedCategory)
  }, [enrichedItems, selectedCategory])

  // Reset selectedIndex when filter or query changes
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [search, selectedCategory])

  // Scroll active item into view
  React.useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector<HTMLElement>(
      "[data-active='true']"
    )
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  const handleSelect = (url: string) => {
    onOpenChange(false)
    router.push(url)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const total = search.trim()
      ? filteredItems.length
      : DEFAULT_SUGGESTIONS.length

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (total > 0 ? (prev + 1) % total : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (total > 0 ? (prev - 1 + total) % total : 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (search.trim()) {
        const item = filteredItems[selectedIndex]
        if (item) handleSelect(item.url)
      } else {
        const item = DEFAULT_SUGGESTIONS[selectedIndex]
        if (item) handleSelect(item.url)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      onOpenChange(false)
    }
  }

  const getTagBadge = (tag: string) => {
    switch (tag) {
      case "core":
        return { label: "CORE", bg: "bg-main text-black" }
      case "pasax-sentinel":
        return { label: "SENTINEL", bg: "bg-sky-300 text-black" }
      case "pasax-secure-monitor":
        return { label: "WAF", bg: "bg-emerald-300 text-black" }
      case "auth":
        return { label: "AUTH", bg: "bg-purple-300 text-black" }
      default:
        return { label: "PLATFORM", bg: "bg-amber-300 text-black" }
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          onKeyDown={handleKeyDown}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-base border-2 border-border bg-card shadow-[8px_8px_0px_0px_var(--border)] duration-150 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          {/* Top Search Bar */}
          <div className="relative flex items-center border-b-2 border-border bg-secondary-background px-4 py-3">
            <Search className="size-5 shrink-0 text-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari dokumentasi, fitur Trinity, IPC socket, nftables, atau konsol SOC..."
              className="h-9 w-full bg-transparent px-3 font-mono text-xs font-semibold text-foreground placeholder:text-foreground/50 focus:outline-none sm:text-sm"
            />
            {isLoading && (
              <Loader2 className="mr-2 size-4 shrink-0 animate-spin text-main" />
            )}
            {search && !isLoading && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="mr-2 flex size-6 items-center justify-center rounded-sm border border-border bg-card text-foreground hover:bg-main hover:text-black"
                title="Hapus pencarian"
              >
                <X className="size-3.5 stroke-[2.5]" />
              </button>
            )}
            <DialogPrimitive.Close
              className="rounded-base border border-border bg-card px-2 py-0.5 font-mono text-[10px] font-bold text-foreground shadow-[1px_1px_0px_0px_var(--border)] hover:bg-destructive/15 hover:text-destructive"
              title="Tutup dialog"
            >
              ESC
            </DialogPrimitive.Close>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 border-b-2 border-border bg-background p-2.5">
            <span className="mr-1 flex items-center gap-1 font-mono text-[10px] font-black tracking-wider text-foreground uppercase">
              <Compass className="size-3 text-main" />
              <span>Filter:</span>
            </span>
            {[
              { id: "all", label: "Semua", icon: Layers },
              { id: "core", label: "Core Suite", icon: Sparkles },
              {
                id: "pasax-sentinel",
                label: "Sentinel Daemon",
                icon: Terminal,
              },
              {
                id: "pasax-secure-monitor",
                label: "Laravel WAF",
                icon: Shield,
              },
              { id: "platform", label: "Platform & App", icon: Activity },
            ].map((cat) => {
              const Icon = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-[11px] font-black transition-all",
                    isSelected
                      ? "border-border bg-main text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]"
                      : "border-border/60 bg-secondary-background text-foreground hover:border-border hover:bg-card"
                  )}
                >
                  <Icon className="size-3" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Results Container */}
          <div
            ref={listRef}
            className="max-h-[50vh] flex-1 space-y-2 overflow-y-auto p-3 sm:p-4"
          >
            {search.trim() ? (
              filteredItems.length > 0 ? (
                <>
                  <div className="flex items-center justify-between pb-1 font-mono text-[11px] font-bold text-foreground">
                    <span>Hasil Pencarian Fumadocs:</span>
                    <span className="py-0.2 rounded-sm border border-border bg-secondary-background px-1.5 font-black text-foreground">
                      {filteredItems.length} ditemukan
                    </span>
                  </div>
                  {filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex
                    const badge = getTagBadge(item.tag)
                    return (
                      <div
                        key={item.id}
                        data-active={isSelected}
                        onClick={() => handleSelect(item.url)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "group flex cursor-pointer items-start justify-between gap-3 rounded-base border-2 p-3 transition-all",
                          isSelected
                            ? "border-border bg-main/15 shadow-[3px_3px_0px_0px_var(--border)] dark:bg-main/20"
                            : "border-border/60 bg-secondary-background/60 hover:border-border hover:bg-secondary-background"
                        )}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "py-0.2 rounded-sm border border-border px-1.5 font-mono text-[9px] font-black tracking-wider uppercase shadow-[1px_1px_0px_0px_var(--border)]",
                                badge.bg
                              )}
                            >
                              {badge.label}
                            </span>
                            <span className="truncate font-mono text-[10px] font-bold text-foreground">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="font-heading text-sm font-black text-foreground group-hover:text-main">
                            {item.title}
                          </h4>
                          <p className="line-clamp-2 text-xs font-medium text-foreground">
                            {item.description}
                          </p>
                        </div>
                        <div className="shrink-0 pt-1">
                          <div
                            className={cn(
                              "flex size-6 items-center justify-center rounded-sm border border-border shadow-[1px_1px_0px_0px_var(--border)]",
                              isSelected
                                ? "bg-main text-black"
                                : "bg-card text-foreground"
                            )}
                          >
                            <CornerDownLeft className="size-3.5" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </>
              ) : (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-base border-2 border-border bg-secondary-background font-mono text-2xl font-black shadow-[3px_3px_0px_0px_var(--border)]">
                    ✕
                  </div>
                  <h4 className="font-heading text-base font-black text-foreground">
                    Tidak Ditemukan Hasil
                  </h4>
                  <p className="mx-auto mt-1 max-w-sm text-xs font-medium text-foreground">
                    Tidak ada dokumen yang cocok dengan kata kunci &ldquo;
                    {search}&rdquo;. Coba gunakan kata kunci seperti{" "}
                    <em>trinity</em>, <em>nftables</em>, <em>waf</em>, atau{" "}
                    <em>telemetry</em>.
                  </p>
                </div>
              )
            ) : (
              /* Default Suggestions When Empty */
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 font-mono text-[11px] font-bold text-foreground">
                  <span>Rekomendasi Dokumen Cepat:</span>
                  <span className="font-mono text-[10px] text-foreground">
                    Pilih dengan panah atau klik
                  </span>
                </div>
                <div className="space-y-2">
                  {DEFAULT_SUGGESTIONS.map((item, index) => {
                    const isSelected = index === selectedIndex
                    return (
                      <div
                        key={item.url}
                        data-active={isSelected}
                        onClick={() => handleSelect(item.url)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "group flex cursor-pointer items-start justify-between gap-3 rounded-base border-2 p-3 transition-all",
                          isSelected
                            ? "border-border bg-main/15 shadow-[3px_3px_0px_0px_var(--border)] dark:bg-main/20"
                            : "border-border/60 bg-secondary-background/60 hover:border-border hover:bg-secondary-background"
                        )}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "py-0.2 rounded-sm border border-border px-1.5 font-mono text-[9px] font-black tracking-wider uppercase shadow-[1px_1px_0px_0px_var(--border)]",
                                item.badgeBg
                              )}
                            >
                              {item.badge}
                            </span>
                            <span className="truncate font-mono text-[10px] font-bold text-foreground">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="font-heading text-sm font-black text-foreground group-hover:text-main">
                            {item.title}
                          </h4>
                          <p className="line-clamp-1 text-xs font-medium text-foreground">
                            {item.description}
                          </p>
                        </div>
                        <div className="shrink-0 pt-1">
                          <div
                            className={cn(
                              "flex size-6 items-center justify-center rounded-sm border border-border shadow-[1px_1px_0px_0px_var(--border)]",
                              isSelected
                                ? "bg-main text-black"
                                : "bg-card text-foreground"
                            )}
                          >
                            <ArrowRight className="size-3.5" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Neobrutalist Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-border bg-secondary-background px-4 py-2.5 font-mono text-[10px] font-bold text-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-card px-1 py-0.5 text-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                  ↑
                </kbd>
                <kbd className="rounded border border-border bg-card px-1 py-0.5 text-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                  ↓
                </kbd>
                <span className="text-foreground">Navigasi</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                  ↵
                </kbd>
                <span className="text-foreground">Buka</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-card px-1 py-0.5 text-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                  ESC
                </kbd>
                <span className="text-foreground">Tutup</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-foreground">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              <span>Fumadocs Search Engine &bull; Pasax Suite</span>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
