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

  const sidebarContent = (
    <div className="flex h-full flex-col bg-lp-paper">
      {/* 1. Sidebar Brand Header (matches Fumadocs NavTitle in desktop sidebar) */}
      <div className="hidden lg:flex items-center justify-between h-14 px-4 border-b border-lp-line shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-heading font-semibold text-sm text-lp-ink hover:opacity-90 transition-opacity"
        >
          <Image
            src="/icon.png"
            alt="Pasax Suite"
            width={22}
            height={22}
            className="size-5.5 rounded-sm object-contain"
          />
          <span className="font-heading font-semibold text-base tracking-tight text-lp-ink">
            Pasax
          </span>
          <span className="rounded-full border border-lp-line bg-lp-paper-2 px-1.5 py-0.2 font-mono text-[10px] text-lp-ink/70">
            v1.4
          </span>
        </Link>
        <ThemeToggle className="size-7" />
      </div>

      {/* 2. Module & Version Switcher, and Search */}
      <div className="space-y-2.5 border-b border-lp-line p-3 shrink-0">
        <VersionSwitcher
          versions={["1.4.0", "1.3.2", "1.2.0"]}
          defaultVersion="1.4.0"
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
                className="group flex w-full items-center justify-between py-1.5 px-2 text-left font-mono text-[11px] font-semibold tracking-wider text-lp-ink/60 uppercase transition-colors hover:text-lp-ink cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-3.5 text-lp-ink/50 group-hover:text-lp-ink/80" />
                  <span>{cat.title}</span>
                </span>
                <span className="text-lp-ink/40 group-hover:text-lp-ink/80">
                  {isCollapsed ? (
                    <ChevronRight className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </span>
              </button>

              {!isCollapsed && (
                <div className="ms-2.5 space-y-0.5 border-s border-lp-line ps-2">
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
                          "block rounded-md px-2.5 py-1.5 text-xs transition-colors",
                          isActive
                            ? "border-s-2 border-lp-orange dark:border-lp-yellow bg-lp-orange/10 dark:bg-lp-yellow/10 font-medium text-lp-orange dark:text-lp-yellow -ms-[9px] ps-[7px]"
                            : "text-lp-ink/75 hover:bg-lp-paper-2/60 hover:text-lp-ink"
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
          <div className="py-8 text-center font-mono text-xs text-lp-ink/60">
            <p>Tidak ada hasil untuk &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>

      {/* 4. Sidebar Bottom Footer */}
      <div className="border-t border-lp-line bg-lp-paper-2/40 p-3 text-xs text-lp-ink/70 shrink-0">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <Link
            href="/docs"
            className="flex items-center gap-1 text-lp-ink/70 hover:text-lp-ink hover:underline"
          >
            <BookOpen className="size-3.5" />
            <span>Katalog Dokumen</span>
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
          "hidden w-72 shrink-0 border-r border-lp-line bg-lp-paper sticky top-0 h-screen lg:block z-30",
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
          <span className="rounded-full border border-lp-line bg-lp-paper-2 px-1.5 py-0.2 font-mono text-[10px] text-lp-ink/70">
            v1.4
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <SearchTrigger variant="icon" className="size-8" />
          <ThemeToggle className="size-8" />
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/80 px-2.5 py-1.5 font-mono text-xs text-lp-ink hover:bg-lp-paper-2 cursor-pointer"
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
            <div className="flex items-center justify-between border-b border-lp-line bg-lp-paper-2/40 px-3.5 py-3 shrink-0">
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
                <span className="rounded-full border border-lp-line bg-lp-paper px-1.5 py-0.2 font-mono text-[10px] text-lp-ink/70">
                  v1.4
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex size-8 items-center justify-center rounded-md text-lp-ink/70 hover:bg-lp-paper-2 hover:text-lp-ink transition-colors cursor-pointer"
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
