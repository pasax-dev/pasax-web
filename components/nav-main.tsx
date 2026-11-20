"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export interface NavMainSubItem {
  title: string
  url: string
  badge?: string
}

export interface NavMainItem {
  title: string
  url: string
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  isActive?: boolean
  badge?: string
  items?: NavMainSubItem[]
}

export interface NavMainSection {
  label: string
  items: NavMainItem[]
}

interface NavMainProps {
  items?: NavMainItem[]
  sections?: NavMainSection[]
  label?: string
}

function renderIcon(icon?: React.ComponentType<{ className?: string }> | React.ReactNode) {
  if (!icon) return null
  if (React.isValidElement(icon)) return icon
  if (typeof icon === "function") {
    const IconComp = icon
    return <IconComp className="size-4" />
  }
  return null
}

export function NavMain({ items, sections, label = "Platform" }: NavMainProps) {
  const [currentHash, setCurrentHash] = React.useState("")

  React.useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash || "#overview")
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  // If sections are provided, render each section group (legacy/multi-section mode)
  if (sections && sections.length > 0) {
    return (
      <>
        {sections.map((group) => (
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
                            {renderIcon(item.icon)}
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

  // Official sidebar-07 format: Single/Primary group with Collapsible sub-items
  const navItems = items || []

  return (
    <SidebarGroup className="py-1.5">
      <SidebarGroupLabel className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {navItems.map((item) => {
          const hasChildren = item.items && item.items.length > 0
          const isItemActive =
            item.isActive ||
            currentHash === item.url ||
            (hasChildren && item.items?.some((sub) => sub.url === currentHash))

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isItemActive}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2.5 py-2 font-sans text-xs sm:text-sm font-medium transition-all",
                    "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isItemActive &&
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
                    <span className="shrink-0 text-muted-foreground">
                      {renderIcon(item.icon)}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="ml-auto rounded-full border border-border/70 bg-muted/60 px-2 py-0.5 font-mono text-[9px] font-bold text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isItemActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<CollapsibleTrigger />}
                  className="flex items-center justify-between rounded-md px-2.5 py-2 font-sans text-xs sm:text-sm font-medium transition-all text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0 text-muted-foreground">
                      {renderIcon(item.icon)}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-data-open/collapsible:rotate-90 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubActive = currentHash === subItem.url
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={isSubActive}
                            className={cn(
                              "font-sans text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isSubActive && "font-semibold text-main"
                            )}
                            render={
                              <a
                                href={subItem.url}
                                onClick={(e) => {
                                  if (subItem.url.startsWith("#")) {
                                    const hash = subItem.url.replace("#", "")
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
                            <span className="truncate">{subItem.title}</span>
                            {subItem.badge && (
                              <span className="ml-auto rounded-full border border-border/60 bg-muted/60 px-1.5 py-0.2 font-mono text-[8px] font-bold text-muted-foreground">
                                {subItem.badge}
                              </span>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
