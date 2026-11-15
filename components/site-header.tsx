"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { InstallAgentDialog } from "@/components/install-agent-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShieldCheck, Radio, Activity, Globe } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b-2 border-border bg-background/80 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) lg:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger className="-ml-1 border-2 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5" />
        <Separator
          orientation="vertical"
          className="mx-1 h-4 data-vertical:self-auto sm:mx-2"
        />
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 font-heading font-black tracking-tight text-foreground transition-colors hover:text-main"
          >
            <ShieldCheck className="size-4 text-main" />
            <span>PASAX SOC</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="hidden font-mono text-xs font-semibold text-foreground/80 sm:inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
            Fleet Operations & Intelligence
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Link to 3D Live Threat Map */}
        <Link
          href="/threats-map"
          className="hidden items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background/80 px-2.5 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 sm:inline-flex"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-rose-600" />
          </span>
          <span className="text-rose-600 dark:text-rose-400">Live 3D Map</span>
        </Link>

        {/* Sentinel Mesh Status */}
        <div className="hidden items-center gap-2 rounded-base border-2 border-border bg-secondary-background/80 px-3 py-1 font-mono text-xs backdrop-blur-sm md:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
          <span className="font-bold">Sentinel Mesh</span>
          <span className="text-[10px] text-muted-foreground border-l border-border pl-2 font-mono">
            &lt; 0.2ms
          </span>
        </div>

        <ThemeToggle />
        <InstallAgentDialog />
      </div>
    </header>
  )
}
