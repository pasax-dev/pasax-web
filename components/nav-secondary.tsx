"use client"

import * as React from "react"
import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavSecondary({
  items,
  className,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    badge?: string
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup className={cn("py-1.5", className)} {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item) => {
            const isInternal = item.url.startsWith("/")
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  size="sm"
                  className="font-sans text-xs text-sidebar-foreground/75 transition-colors hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  render={
                    isInternal ? (
                      <Link href={item.url} />
                    ) : (
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
                    )
                  }
                >
                  <span className="shrink-0 text-muted-foreground">{item.icon}</span>
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full border border-border/60 bg-muted/60 px-1.5 py-0.2 font-mono text-[9px] font-bold text-muted-foreground">
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
