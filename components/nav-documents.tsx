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

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: React.ReactNode
  }[]
}) {
  return (
    <SidebarGroup className="py-1.5 group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
        Blueprints & Specs
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                size="sm"
                className="font-sans text-xs text-sidebar-foreground/75 transition-colors hover:text-sidebar-foreground hover:bg-sidebar-accent"
                render={
                  <a
                    href={item.url}
                    onClick={(e) => {
                      if (item.url.startsWith("#")) {
                        const hash = item.url.replace("#", "")
                        window.location.hash = hash
                        const el = document.getElementById(hash)
                        el?.scrollIntoView({ behavior: "smooth" })
                      }
                    }}
                  />
                }
              >
                <span className="shrink-0 text-muted-foreground">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
