"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Rocket,
  Cpu,
  Shield,
  Terminal,
  Command,
  Server,
  Puzzle,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Menu,
  X,
  ShieldAlert,
  Layers,
} from "lucide-react"
import {
  PRODUCTS_CONFIG,
  ProductConfig,
  findDocBySlug,
  DocCategory,
  DocItem,
} from "@/lib/docs-manifest"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, React.ElementType> = {
  Rocket,
  Cpu,
  Shield,
  Terminal,
  Command,
  Server,
  Puzzle,
  HelpCircle,
  Layers,
}

export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [collapsedCategories, setCollapsedCategories] = React.useState<
    Record<string, boolean>
  >({})
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Detect current product from pathname
  const detectedProduct = React.useMemo(() => {
    if (pathname.includes("/docs/pasax-sentinel")) return "pasax-sentinel"
    if (pathname.includes("/docs/core")) return "core"
    if (pathname.includes("/docs/pasax-secure-monitor"))
      return "pasax-secure-monitor"
    const doc = findDocBySlug(pathname)
    return doc?.product || "pasax-secure-monitor"
  }, [pathname])

  const [activeProduct, setActiveProduct] =
    React.useState<string>(detectedProduct)

  React.useEffect(() => {
    setActiveProduct(detectedProduct)
  }, [detectedProduct])

  const toggleCategory = (slug: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }))
  }

  const activeConfig =
    PRODUCTS_CONFIG[activeProduct] || PRODUCTS_CONFIG["pasax-secure-monitor"]

  // Filter items if search is active
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return activeConfig.categories

    const q = searchQuery.toLowerCase()
    return activeConfig.categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.slug.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0)
  }, [searchQuery, activeConfig])

  const content = (
    <div className="flex h-full flex-col">
      {/* Product & Docs Header */}
      <div className="space-y-3 border-b-2 border-border bg-secondary-background p-4">
        {/* Product Selector Tabs */}
        <div>
          <span className="mb-1.5 block font-mono text-[10px] font-bold tracking-wider text-foreground/60 uppercase">
            Pilih Modul Dokumentasi
          </span>
          <div className="grid grid-cols-3 gap-1 rounded-base border-2 border-border bg-background p-1 shadow-[2px_2px_0px_0px_var(--border)]">
            <Link
              href="/docs/pasax-secure-monitor"
              onClick={() => {
                setActiveProduct("pasax-secure-monitor")
                setMobileOpen(false)
              }}
              className={cn(
                "rounded-sm px-1.5 py-1 text-center font-heading text-[11px] font-black transition-all",
                activeProduct === "pasax-secure-monitor"
                  ? "bg-main text-main-foreground shadow-sm"
                  : "text-foreground/70 hover:bg-secondary-background hover:text-foreground"
              )}
            >
              Monitor
            </Link>
            <Link
              href="/docs/pasax-sentinel"
              onClick={() => {
                setActiveProduct("pasax-sentinel")
                setMobileOpen(false)
              }}
              className={cn(
                "rounded-sm px-1.5 py-1 text-center font-heading text-[11px] font-black transition-all",
                activeProduct === "pasax-sentinel"
                  ? "bg-main text-main-foreground shadow-sm"
                  : "text-foreground/70 hover:bg-secondary-background hover:text-foreground"
              )}
            >
              Sentinel
            </Link>
            <Link
              href="/docs/core"
              onClick={() => {
                setActiveProduct("core")
                setMobileOpen(false)
              }}
              className={cn(
                "rounded-sm px-1.5 py-1 text-center font-heading text-[11px] font-black transition-all",
                activeProduct === "core"
                  ? "bg-main text-main-foreground shadow-sm"
                  : "text-foreground/70 hover:bg-secondary-background hover:text-foreground"
              )}
            >
              Core Suite
            </Link>
          </div>
        </div>

        {/* Active Product Meta */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-heading text-sm font-black text-foreground">
              {activeConfig.name}
            </span>
            <Badge
              variant="outline"
              className="border-2 border-border bg-main font-mono text-[10px] font-bold text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]"
            >
              {activeConfig.badge}
            </Badge>
          </div>
          <p className="line-clamp-2 text-[11px] leading-tight text-foreground/70">
            {activeConfig.description}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-foreground/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari dokumen ${activeConfig.name}...`}
            className="h-8 pl-8 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-xs font-bold text-foreground/50 hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {filteredCategories.map((cat) => {
          const Icon = iconMap[cat.icon] || BookOpen
          const isCollapsed = collapsedCategories[cat.slug] && !searchQuery

          return (
            <div key={cat.slug} className="space-y-1.5">
              <button
                onClick={() => toggleCategory(cat.slug)}
                className="group flex w-full items-center justify-between py-1 text-left font-heading text-xs font-black tracking-wider text-foreground/80 uppercase transition-colors hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-3.5 text-main" />
                  <span>{cat.title}</span>
                </span>
                <span className="text-foreground/50 group-hover:text-foreground">
                  {isCollapsed ? (
                    <ChevronRight className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </span>
              </button>

              {!isCollapsed && (
                <div className="ml-2 space-y-1 border-l-2 border-border/40 pl-3">
                  {cat.items.map((item) => {
                    const href = `/docs/${item.product}/${item.slug}`
                    const isActive =
                      pathname === href || pathname === `/docs/${item.slug}`

                    return (
                      <Link
                        key={item.slug}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded-base px-2.5 py-1.5 text-xs transition-all",
                          isActive
                            ? "translate-x-1 border-2 border-border bg-main font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
                            : "font-medium text-foreground/80 hover:border-2 hover:border-border hover:bg-secondary-background hover:text-foreground hover:shadow-[2px_2px_0px_0px_var(--border)]"
                        )}
                      >
                        {item.title}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {filteredCategories.length === 0 && (
          <div className="py-8 text-center text-xs text-foreground/60">
            <p>Tidak ada hasil untuk &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t-2 border-border bg-secondary-background/60 p-3 text-[11px] text-foreground/70">
        <div className="flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 font-bold">
            <Image src="/icon.png" alt="Pasax Suite" width={16} height={16} className="size-4 rounded-sm object-contain" />
            <span>Pasax Suite</span>
          </div>
          <Link
            href="/docs"
            className="flex items-center gap-1 font-bold text-main hover:underline"
          >
            Semua Produk &rarr;
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden w-72 shrink-0 border-r-2 border-border bg-background lg:block",
          className
        )}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)]">{content}</div>
      </aside>

      {/* Mobile Drawer Trigger Button */}
      <div className="fixed right-4 bottom-4 z-40 lg:hidden">
        <Button
          onClick={() => setMobileOpen(true)}
          size="icon-lg"
          className="rounded-full shadow-[4px_4px_0px_0px_var(--border)]"
        >
          <Menu className="size-5" />
          <span className="sr-only">Buka Navigasi Dokumen</span>
        </Button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-80 max-w-[85vw] flex-1 flex-col border-r-2 border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-border bg-secondary-background p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-main" />
                <span className="font-heading text-sm font-black text-foreground">
                  Daftar Isi Dokumentasi
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">{content}</div>
          </div>
        </div>
      )}
    </>
  )
}
