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

export function NavMain({
  items,
}: {
  items: NavMainItem[]
}) {
  const [currentHash, setCurrentHash] = React.useState("")

  React.useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash || "#overview")
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-heading text-[11px] font-black uppercase tracking-wider text-muted-foreground">
        Security Operations
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive = currentHash === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    "flex items-center justify-between font-heading text-sm font-semibold transition-all hover:bg-main/20 hover:border-border",
                    isActive &&
                      "border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main hover:text-main-foreground"
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
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase",
                        isActive
                          ? "bg-black text-white"
                          : "border border-border bg-secondary-background text-foreground/80"
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
  )
}

