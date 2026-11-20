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

export interface NavMainProps {
  items?: NavMainItem[]
  sections?: NavMainSection[]
  label?: string
}

function renderIcon(icon?: React.ComponentType<{ className?: string }> | React.ReactNode) {
  if (!icon) return null
  if (React.isValidElement(icon)) return icon
  if (typeof icon === "function") {
    const IconComp = icon
    return <IconComp className="size-4 shrink-0" />
  }
  return null
}

export function NavMain({ items, sections, label = "Platform" }: NavMainProps) {
  const [currentHash, setCurrentHash] = React.useState("")
  const navItems = React.useMemo(() => items || [], [items])

  // Controlled open state for sidebar-07 collapsible sections
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navItems.forEach((item) => {
      if (item.isActive) {
        initial[item.title] = true
      }
    })
    return initial
  })

  React.useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash || "#overview")
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  // Auto-expand group when URL hash targets a nested item
  React.useEffect(() => {
    if (!currentHash) return
    navItems.forEach((item) => {
      if (item.items?.some((sub) => sub.url === currentHash) || item.url === currentHash) {
        setOpenItems((prev) => (prev[item.title] ? prev : { ...prev, [item.title]: true }))
      }
    })
  }, [currentHash, navItems])

  // If sections are provided, render each section group (legacy/multi-section mode)
  if (sections && sections.length > 0) {
    return (
      <>
        {sections.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
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
                          "font-sans text-xs sm:text-sm font-medium transition-all text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive &&
                            "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
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
                        {renderIcon(item.icon)}
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase border transition-colors",
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

  return (
    <SidebarGroup className="py-1.5">
      <SidebarGroupLabel className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
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
                    "font-sans text-xs sm:text-sm font-medium transition-all text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isItemActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
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
                  {renderIcon(item.icon)}
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full border border-border/70 bg-muted/60 px-2 py-0.5 font-mono text-[9px] font-bold text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          const isOpen = Boolean(openItems[item.title])

          return (
            <Collapsible
              key={item.title}
              open={isOpen}
              onOpenChange={(open) =>
                setOpenItems((prev) => ({ ...prev, [item.title]: open }))
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<CollapsibleTrigger />}
                  className="font-sans text-xs sm:text-sm font-medium transition-all text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  {renderIcon(item.icon)}
                  <span className="truncate">{item.title}</span>
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
