"use client"

import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export interface NavMainItem {
  title: string
  url: string
  icon?: React.ReactNode
  badge?: string
}

export interface NavMainSection {
  label: string
  items: NavMainItem[]
}

interface NavMainProps {
  items?: NavMainItem[]
  sections?: NavMainSection[]
}

export function NavMain({ items, sections }: NavMainProps) {
  const [currentHash, setCurrentHash] = React.useState("")

  React.useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash || "#overview")
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  // If sections are provided, render each section group; otherwise single group
  const groups: NavMainSection[] = sections
    ? sections
    : [{ label: "Security Operations", items: items || [] }]

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label} className="py-1.5">
          <SidebarGroupLabel className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {group.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {group.items.map((item) => {
                const isActive = currentHash === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "flex items-center justify-between rounded-md px-2.5 py-2 font-sans text-xs sm:text-sm font-medium transition-all",
                        "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs border-l-2 border-main pl-2"
                      )}
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
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={cn(
                            "shrink-0 transition-colors",
                            isActive
                              ? "text-main"
                              : "text-muted-foreground group-hover/menu-button:text-sidebar-foreground"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase border transition-colors",
                            isActive
                              ? "border-main/50 bg-main/20 text-foreground font-black"
                              : item.badge === "ALERT"
                              ? "border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-400 font-black animate-pulse"
                              : item.badge === "LIVE" || item.badge === "ACTIVE" || item.badge === "SECURE"
                              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "border-border/70 bg-muted/60 text-muted-foreground"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
