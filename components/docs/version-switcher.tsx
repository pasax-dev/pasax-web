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

const MODULES = [
  {
    id: "pasax-secure-monitor",
    name: "Pasax Secure Monitor",
    shortName: "PHP WAF Shield",
    href: "/docs/pasax-secure-monitor",
    icon: Shield,
  },
  {
    id: "pasax-sentinel",
    name: "Pasax Sentinel",
    shortName: "Kernel Daemon & FIM",
    href: "/docs/pasax-sentinel",
    icon: Terminal,
  },
  {
    id: "core",
    name: "Pasax Core Engine",
    shortName: "Mesh & Threat Ledger",
    href: "/docs/core",
    icon: Layers,
  },
]

export function VersionSwitcher({
  versions = ["1.4.0", "1.3.2", "1.2.0"],
  defaultVersion = "1.4.0",
}: {
  versions?: string[]
  defaultVersion?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

  // Detect current active module from path
  const currentModule = React.useMemo(() => {
    if (pathname.includes("/docs/pasax-sentinel")) return MODULES[1]
    if (pathname.includes("/docs/core")) return MODULES[2]
    return MODULES[0]
  }, [pathname])

  const ActiveIcon = currentModule.icon || GalleryVerticalEnd

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full border border-lp-line bg-lp-paper hover:bg-lp-paper-2 data-[state=open]:bg-lp-paper-2 transition-colors cursor-pointer"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-lp-ink text-lp-paper dark:bg-lp-yellow dark:text-lp-on-yellow">
                <ActiveIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none text-left">
                <span className="font-heading font-semibold text-xs text-lp-ink">
                  {currentModule.name}
                </span>
                <span className="font-mono text-[10px] text-lp-ink-2">
                  v{selectedVersion} &bull; {currentModule.shortName}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-lp-ink-2" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-64 border border-lp-line bg-lp-paper p-1.5 shadow-xl"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            {/* Documentation Modules Switcher */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-lp-ink-2 px-2 py-1">
                Pilih Modul Dokumentasi
              </DropdownMenuLabel>
              {MODULES.map((mod) => {
                const Icon = mod.icon
                const isSelected = mod.id === currentModule.id
                return (
                  <DropdownMenuItem
                    key={mod.id}
                    onSelect={() => router.push(mod.href)}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer hover:bg-lp-paper-2"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-lp-line bg-lp-paper text-lp-ink">
                      <Icon className="size-3.5 text-lp-orange" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-heading font-medium text-xs text-lp-ink">
                        {mod.name}
                      </span>
                      <span className="font-mono text-[10px] text-lp-ink-2">
                        {mod.shortName}
                      </span>
                    </div>
                    {isSelected && <Check className="ml-auto size-4 text-lp-orange" />}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5 bg-lp-line" />

            {/* Versions Switcher */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-lp-ink-2 px-2 py-1">
                Versi Rilis
              </DropdownMenuLabel>
              {versions.map((version) => (
                <DropdownMenuItem
                  key={version}
                  onSelect={() => setSelectedVersion(version)}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md font-mono text-xs text-lp-ink cursor-pointer hover:bg-lp-paper-2"
                >
                  <span>v{version}</span>
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
