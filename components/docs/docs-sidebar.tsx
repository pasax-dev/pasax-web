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
  ChevronDown,
  ChevronRight,
  BookOpen,
  Menu,
  X,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { PRODUCTS_CONFIG, findDocBySlug } from "@/lib/docs-manifest"
import { cn } from "@/lib/utils"
import { SearchTrigger } from "@/components/search/search-trigger"
import { ThemeToggle } from "@/components/theme-toggle"
import { VersionSwitcher } from "@/components/docs/version-switcher"
import { type PackagistData, getEcosystemProduct } from "@/lib/packagist"
import { usePackagistData } from "@/lib/use-packagist"

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

export function DocsSidebar({
  className,
  initialPackagist,
}: {
  className?: string
  initialPackagist?: PackagistData
}) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [collapsedCategories, setCollapsedCategories] = React.useState<
    Record<string, boolean>
  >({})
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { data: livePackagist } = usePackagistData(initialPackagist)

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
  const activeEcosystem = getEcosystemProduct(activeProduct, livePackagist)

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

  const sidebarContent = (
    <div className="flex h-full flex-col bg-lp-paper">
      {/* 1. Sidebar Brand Header (matches Fumadocs NavTitle in desktop sidebar) */}
      <div className="hidden h-12 shrink-0 items-center justify-between border-b border-lp-line px-4 lg:flex">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-heading text-sm font-semibold text-lp-ink transition-opacity hover:opacity-90"
        >
          <Image
            src="/icon.png"
            alt="Pasax Suite"
            width={22}
            height={22}
            className="size-5.5 rounded-sm object-contain"
          />
          <span className="font-heading text-base font-semibold tracking-tight text-lp-ink">
            Pasax
          </span>
        </Link>
      </div>

      {/* 2. Module & Version Switcher, and Search */}
      <div className="shrink-0 space-y-2.5 border-b border-lp-line p-3">
        <VersionSwitcher
          activeProduct={activeProduct}
          packagistData={livePackagist}
        />

        {/* Fumadocs Search Box with ⌘K */}
        <SearchTrigger
          variant="sidebar"
          placeholder={`Cari di ${activeConfig.name}...`}
        />
      </div>

      {/* 3. Navigation Tree Viewport */}
      <div className="flex-1 space-y-4 overflow-y-auto p-3.5">
        {filteredCategories.map((cat) => {
          const Icon = iconMap[cat.icon] || BookOpen
          const isCollapsed = collapsedCategories[cat.slug] && !searchQuery

          return (
            <div key={cat.slug} className="space-y-1">
              <button
                onClick={() => toggleCategory(cat.slug)}
                className="group flex w-full cursor-pointer items-center justify-between px-2 py-1.5 text-left font-mono text-[11px] font-semibold tracking-wider text-lp-ink/60 uppercase transition-colors hover:text-lp-ink"
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-3.5 text-lp-orange" />
                  <span>{cat.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-lp-ink/40">
                    {cat.items.length}
                  </span>
                  {isCollapsed ? (
                    <ChevronRight className="size-3 text-lp-ink/40 transition-transform group-hover:text-lp-ink" />
                  ) : (
                    <ChevronDown className="size-3 text-lp-ink/40 transition-transform group-hover:text-lp-ink" />
                  )}
                </div>
              </button>

              {!isCollapsed && (
                <div className="ml-2 space-y-0.5 border-l border-lp-line pl-2">
                  {cat.items.map((item) => {
                    const fullHref = `/docs/${item.product}/${item.slug}`
                    const isActive =
                      pathname === fullHref ||
                      (item.slug === "getting-started" &&
                        pathname === `/docs/${item.product}`)

                    return (
                      <Link
                        key={item.slug}
                        href={fullHref}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors",
                          isActive
                            ? "bg-lp-ink font-medium text-lp-paper dark:bg-lp-yellow dark:text-lp-on-yellow"
                            : "text-lp-ink/80 hover:bg-lp-paper-2 hover:text-lp-ink"
                        )}
                      >
                        <span className="line-clamp-1">{item.title}</span>

                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {filteredCategories.length === 0 && (
          <div className="p-4 text-center font-mono text-xs text-lp-ink/50">
            Tidak ada dokumen yang cocok dengan &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* 4. Footer Ecosystem Links (matching Fumadocs Sidebar footer) */}
      <div className="shrink-0 space-y-2 border-t border-lp-line p-3 font-mono text-xs">
        <div className="flex items-center justify-between text-lp-ink/60">
          <span className="text-[11px]">Modul Aktif</span>
          <span className="font-semibold text-lp-ink">{activeConfig.name}</span>
        </div>
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <Link
            href="/changelog"
            className="flex items-center gap-1 text-lp-orange hover:underline dark:text-lp-yellow"
          >
            <span>Changelog Rilis</span>
            <ExternalLink className="size-2.5" />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1 text-lp-ink/70 hover:text-lp-ink hover:underline"
          >
            <span>Beranda</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Spans full height 100vh with sticky positioning) */}
      <aside
        className={cn(
          "sticky top-0 z-30 hidden h-screen w-72 shrink-0 border-r border-lp-line bg-lp-paper lg:block",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Top Navbar (shown only on small screens) */}
      <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-lp-line bg-lp-paper/95 px-4 backdrop-blur-md lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Pasax"
            width={20}
            height={20}
            className="size-5 rounded-xs"
          />
          <span className="font-heading text-sm font-semibold text-lp-ink">
            Pasax Docs
          </span>
          <span className="py-0.2 rounded-full border border-lp-line bg-lp-paper-2 px-1.5 font-mono text-[10px] text-lp-ink/70">
            v{activeEcosystem.latestVersion}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <SearchTrigger variant="icon" className="size-8" />
          <ThemeToggle className="size-8" />
          <button
            onClick={() => setMobileOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/80 px-2.5 py-1.5 font-mono text-xs text-lp-ink hover:bg-lp-paper-2"
          >
            <Menu className="size-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-80 max-w-[85vw] flex-1 flex-col border-r border-lp-line bg-lp-paper shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-lp-line bg-lp-paper-2/40 px-3.5 py-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon.png"
                  alt="Pasax"
                  width={20}
                  height={20}
                  className="size-5 rounded-xs"
                />
                <span className="font-heading text-sm font-semibold text-lp-ink">
                  Dokumentasi Pasax
                </span>
                <span className="py-0.2 rounded-full border border-lp-line bg-lp-paper px-1.5 font-mono text-[10px] text-lp-ink/70">
                  v{activeEcosystem.latestVersion}
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex size-8 cursor-pointer items-center justify-center rounded-md text-lp-ink/70 transition-colors hover:bg-lp-paper-2 hover:text-lp-ink"
                aria-label="Tutup Navigasi"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  )
}
