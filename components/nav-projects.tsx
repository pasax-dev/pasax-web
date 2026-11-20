"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { MoreHorizontalIcon, Terminal, Copy, Check } from "lucide-react"

export interface NavProjectItem {
  name: string
  url: string
  icon: React.ReactNode
  badge?: string
}

export function NavProjects({
  projects,
  label = "Fleet Workspaces",
}: {
  projects: NavProjectItem[]
  label?: string
}) {
  const { isMobile } = useSidebar()
  const [copiedName, setCopiedName] = React.useState<string | null>(null)

  const copyHostname = (name: string) => {
    navigator.clipboard.writeText(name)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 1500)
  }

  return (
    <SidebarGroup className="py-1.5">
      <SidebarGroupLabel className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              size="sm"
              tooltip={item.name}
              className="font-sans text-xs text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! group-data-[collapsible=icon]:justify-center"
              render={
                <a
                  href={item.url}
                  onClick={(e) => {
                    if (item.url.startsWith("#")) {
                      const hash = item.url.replace("#", "")
                      window.location.hash = hash
                      const el =
                        document.getElementById(hash) ||
                        document.getElementById("operations-matrix")
                      el?.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                />
              }
            >
              <span className="shrink-0 text-muted-foreground">{item.icon}</span>
              <span className="truncate font-mono text-[11px] font-medium group-data-[collapsible=icon]:hidden">
                {item.name}
              </span>
              {item.badge && (
                <span className="ml-auto rounded-full border border-border/60 bg-muted/60 px-1.5 py-0.2 font-mono text-[9px] font-bold text-muted-foreground group-data-[collapsible=icon]:hidden">
                  {item.badge}
                </span>
              )}
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted group-data-[collapsible=icon]:hidden"
                  />
                }
              >
                <MoreHorizontalIcon className="size-3.5 text-muted-foreground" />
                <span className="sr-only">Aksi {item.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 font-sans"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={() => {
                    if (item.url.startsWith("#")) {
                      const hash = item.url.replace("#", "")
                      window.location.hash = hash
                      const el = document.getElementById(hash)
                      el?.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                  className="gap-2 text-xs cursor-pointer"
                >
                  <Terminal className="size-3.5 text-muted-foreground" />
                  <span>Inspeksi Telemetri</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => copyHostname(item.name)}
                  className="gap-2 text-xs cursor-pointer"
                >
                  {copiedName === item.name ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5 text-muted-foreground" />
                      <span>Salin Hostname</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
