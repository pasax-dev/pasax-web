"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

function renderIcon(
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
) {
  if (!icon) return null
  if (React.isValidElement(icon)) return icon
  const IconComp = icon as React.ElementType
  return <IconComp className="size-4 shrink-0" />
}

export function NavMain({ items, sections, label = "Platform" }: NavMainProps) {
  const pathname = usePathname()
  const [currentHash, setCurrentHash] = React.useState("")
  const navItems = React.useMemo(() => items || [], [items])

  // Controlled open state for collapsible sections if any exist
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {}
      navItems.forEach((item) => {
        if (item.isActive) {
          initial[item.title] = true
        }
      })
      return initial
    }
  )

  React.useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash || "")
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  // Auto-expand group when URL hash targets a nested item
  React.useEffect(() => {
    if (!currentHash) return
    navItems.forEach((item) => {
      if (
        item.items?.some((sub) => sub.url === currentHash) ||
        item.url === currentHash
      ) {
        setOpenItems((prev) =>
          prev[item.title] ? prev : { ...prev, [item.title]: true }
        )
      }
    })
  }, [currentHash, navItems])

  // If sections are provided, render each section group
  if (sections && sections.length > 0) {
    return (
      <>
        {sections.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive =
                    item.isActive ||
                    (item.url.startsWith("#")
                      ? currentHash === item.url
                      : pathname === item.url ||
                        (item.url !== "/" && pathname.startsWith(item.url)))

                  const isHash = item.url.startsWith("#")

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        className={cn(
                          "font-sans text-xs font-medium text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:text-sm",
                          isActive &&
                            "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-xs"
                        )}
                        render={
                          isHash ? (
                            <a
                              href={item.url}
                              onClick={() => {
                                const hash = item.url.replace("#", "")
                                window.location.hash = hash
                                const el = document.getElementById(hash)
                                el?.scrollIntoView({ behavior: "smooth" })
                              }}
                            />
                          ) : (
                            <Link href={item.url} prefetch={false} />
                          )
                        }
                      >
                        {renderIcon(item.icon)}
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase transition-colors group-data-[collapsible=icon]:hidden",
                              isActive
                                ? "border-main/50 bg-main/20 font-black text-foreground"
                                : item.badge === "ALERT"
                                  ? "animate-pulse border-rose-500/40 bg-rose-500/15 font-black text-rose-600 dark:text-rose-400"
                                  : item.badge === "LIVE" ||
                                      item.badge === "ACTIVE" ||
                                      item.badge === "SECURE" ||
                                      item.badge === "FLEET" ||
                                      item.badge === "KEYS" ||
                                      item.badge === "ADMIN" ||
                                      item.badge === "TLS"
                                    ? "border-emerald-500/30 bg-emerald-500/15 font-bold text-emerald-600 dark:text-emerald-400"
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
      <SidebarGroupLabel className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase group-data-[collapsible=icon]:hidden">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {navItems.map((item) => {
          const hasChildren = item.items && item.items.length > 0
          const isItemActive =
            item.isActive ||
            (item.url.startsWith("#")
              ? currentHash === item.url ||
                (hasChildren &&
                  item.items?.some((sub) => sub.url === currentHash))
              : pathname === item.url ||
                (item.url !== "/" && pathname.startsWith(item.url)))

          const isHash = item.url.startsWith("#")

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isItemActive}
                  className={cn(
                    "font-sans text-xs font-medium text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:text-sm",
                    isItemActive &&
                      "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-xs"
                  )}
                  render={
                    isHash ? (
                      <a
                        href={item.url}
                        onClick={() => {
                          const hash = item.url.replace("#", "")
                          window.location.hash = hash
                          const el = document.getElementById(hash)
                          el?.scrollIntoView({ behavior: "smooth" })
                        }}
                      />
                    ) : (
                      <Link href={item.url} prefetch={false} />
                    )
                  }
                >
                  {renderIcon(item.icon)}
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "ml-auto shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase transition-colors group-data-[collapsible=icon]:hidden",
                        isItemActive
                          ? "border-main/50 bg-main/20 font-black text-foreground"
                          : item.badge === "ALERT"
                            ? "animate-pulse border-rose-500/40 bg-rose-500/15 font-black text-rose-600 dark:text-rose-400"
                            : item.badge === "LIVE" ||
                                item.badge === "ACTIVE" ||
                                item.badge === "SECURE" ||
                                item.badge === "FLEET" ||
                                item.badge === "KEYS" ||
                                item.badge === "ADMIN" ||
                                item.badge === "TLS"
                              ? "border-emerald-500/30 bg-emerald-500/15 font-bold text-emerald-600 dark:text-emerald-400"
                              : "border-border/70 bg-muted/60 text-muted-foreground"
                      )}
                    >
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
                  className="font-sans text-xs font-medium text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:text-sm"
                >
                  {renderIcon(item.icon)}
                  <span className="truncate">{item.title}</span>
                  <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90 group-data-open/collapsible:rotate-90" />
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubActive = subItem.url.startsWith("#")
                        ? currentHash === subItem.url
                        : pathname === subItem.url ||
                          (subItem.url !== "/" &&
                            pathname.startsWith(subItem.url))
                      const isSubHash = subItem.url.startsWith("#")

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={isSubActive}
                            className={cn(
                              "font-sans text-xs text-sidebar-foreground/75 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isSubActive &&
                                "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                            )}
                            render={
                              isSubHash ? (
                                <a
                                  href={subItem.url}
                                  onClick={() => {
                                    const hash = subItem.url.replace("#", "")
                                    window.location.hash = hash
                                    const el = document.getElementById(hash)
                                    el?.scrollIntoView({ behavior: "smooth" })
                                  }}
                                />
                              ) : (
                                <Link href={subItem.url} prefetch={false} />
                              )
                            }
                          >
                            <span className="truncate">{subItem.title}</span>
                            {subItem.badge && (
                              <span
                                className={cn(
                                  "py-0.2 ml-auto rounded-full border px-1.5 font-mono text-[8px] font-bold uppercase",
                                  isSubActive
                                    ? "border-main/50 bg-main/20 font-black text-foreground"
                                    : "border-border/70 bg-muted/60 text-muted-foreground"
                                )}
                              >
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
