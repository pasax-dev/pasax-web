"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Check,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Shield,
  Terminal,
  Layers,
  ExternalLink,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  ECOSYSTEM_PRODUCTS,
  getEcosystemProduct,
  PACKAGIST_URL,
} from "@/lib/packagist"

const MODULES = [
  {
    id: "pasax-secure-monitor",
    name: "Pasax Secure Monitor",
    shortName: "PHP WAF Shield",
    href: "/docs/pasax-secure-monitor",
    icon: Shield,
    source: "Packagist",
  },
  {
    id: "pasax-sentinel",
    name: "Pasax Sentinel",
    shortName: "Kernel Daemon & FIM",
    href: "/docs/pasax-sentinel",
    icon: Terminal,
    source: "Go Daemon",
  },
  {
    id: "core",
    name: "Pasax Core Engine",
    shortName: "Mesh & Threat Ledger",
    href: "/docs/core",
    icon: Layers,
    source: "Platform",
  },
]

export function VersionSwitcher({
  activeProduct: propProduct,
}: {
  activeProduct?: string
  versions?: string[]
  defaultVersion?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  // Detect current active product from pathname or prop
  const currentModuleId = React.useMemo(() => {
    if (propProduct) return propProduct
    if (pathname.includes("/docs/pasax-sentinel")) return "pasax-sentinel"
    if (pathname.includes("/docs/core")) return "core"
    if (pathname.includes("/docs/pasax-secure-monitor"))
      return "pasax-secure-monitor"
    return "pasax-secure-monitor"
  }, [pathname, propProduct])

  const productMeta = getEcosystemProduct(currentModuleId)
  const [selectedVersion, setSelectedVersion] = React.useState(
    productMeta.latestVersion
  )

  // Keep selected version in sync when switching between modules
  React.useEffect(() => {
    setSelectedVersion(productMeta.latestVersion)
  }, [productMeta.id, productMeta.latestVersion])

  const currentModule =
    MODULES.find((m) => m.id === currentModuleId) || MODULES[0]
  const ActiveIcon = currentModule.icon || GalleryVerticalEnd

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full cursor-pointer border border-lp-line bg-lp-paper transition-colors hover:bg-lp-paper-2 data-[state=open]:bg-lp-paper-2"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-lp-ink text-lp-paper dark:bg-lp-yellow dark:text-lp-on-yellow">
                <ActiveIcon className="size-4" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left leading-none">
                <span className="truncate font-heading text-xs font-semibold text-lp-ink">
                  {currentModule.name}
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-lp-ink-2">
                  <span>v{selectedVersion}</span>
                  <span>&bull;</span>
                  <span className="truncate text-lp-orange dark:text-lp-yellow">
                    {productMeta.source}
                  </span>
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 text-lp-ink-2" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-68 border border-lp-line bg-lp-paper p-1.5 shadow-xl"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            {/* Documentation Modules Switcher */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1 font-mono text-[10px] tracking-wider text-lp-ink-2 uppercase">
                Modul Ekosistem Pasax
              </DropdownMenuLabel>
              {MODULES.map((mod) => {
                const Icon = mod.icon
                const isSelected = mod.id === currentModule.id
                const modMeta = getEcosystemProduct(mod.id)
                return (
                  <DropdownMenuItem
                    key={mod.id}
                    onSelect={() => router.push(mod.href)}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 hover:bg-lp-paper-2"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-lp-line bg-lp-paper text-lp-ink">
                      <Icon className="size-3.5 text-lp-orange" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading text-xs font-medium text-lp-ink">
                          {mod.name}
                        </span>
                        <span className="py-0.2 rounded border border-lp-line bg-lp-paper-2 px-1 font-mono text-[9px] text-lp-ink-2">
                          v{modMeta.latestVersion}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-lp-ink-2">
                        {mod.shortName}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="ml-auto size-4 text-lp-orange" />
                    )}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5 bg-lp-line" />

            {/* Product-Specific Version Switcher */}
            <DropdownMenuGroup>
              <div className="flex items-center justify-between px-2 py-1">
                <DropdownMenuLabel className="p-0 font-mono text-[10px] tracking-wider text-lp-ink-2 uppercase">
                  {productMeta.id === "pasax-secure-monitor"
                    ? "Versi Packagist"
                    : "Versi Rilis"}
                </DropdownMenuLabel>
                {productMeta.id === "pasax-secure-monitor" && (
                  <a
                    href={PACKAGIST_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-lp-orange hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>packagist.org</span>
                    <ExternalLink className="size-2.5" />
                  </a>
                )}
              </div>
              {productMeta.versions.map((version, idx) => (
                <DropdownMenuItem
                  key={version}
                  onSelect={() => setSelectedVersion(version)}
                  className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 font-mono text-xs text-lp-ink hover:bg-lp-paper-2"
                >
                  <div className="flex items-center gap-2">
                    <span>v{version}</span>
                    {idx === 0 && (
                      <span className="py-0.2 rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {productMeta.id === "pasax-secure-monitor"
                          ? "PACKAGIST STABLE"
                          : "LATEST"}
                      </span>
                    )}
                  </div>
                  {version === selectedVersion && (
                    <Check className="size-3.5 text-lp-orange" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
