"use client"

import * as React from "react"
import Link from "next/link"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain, type NavMainSection } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  Server,
  ShieldAlert,
  Globe,
  Flame,
  ShieldCheck,
  FileCode2,
  BookOpen,
  Terminal,
  Settings2Icon,
  CircleHelpIcon,
  Users,
  CreditCard,
  Layers,
  DatabaseIcon,
} from "lucide-react"

const defaultAdminUser = {
  name: "Roby Kartis (Chief SOC)",
  email: "pasak.dev@gmail.com",
  avatar: "/avatars/admin.jpg",
  role: "Superadmin",
}

const adminSections: NavMainSection[] = [
  {
    label: "Security Operations",
    items: [
      {
        title: "Fleet Overview",
        url: "#overview",
        icon: <LayoutDashboardIcon className="size-4" />,
        badge: "LIVE",
      },
      {
        title: "Server Nodes (VPS)",
        url: "#nodes",
        icon: <Server className="size-4" />,
        badge: "3",
      },
      {
        title: "Threat Incidents",
        url: "#threats",
        icon: <ShieldAlert className="size-4" />,
        badge: "ALERT",
      },
      {
        title: "Crowd Defense Blocklist",
        url: "#blocklist",
        icon: <Flame className="size-4" />,
        badge: "ACTIVE",
      },
      {
        title: "VHost & SSL Recon",
        url: "#vhosts",
        icon: <Globe className="size-4" />,
        badge: "4",
      },
    ],
  },
  {
    label: "Fleet Management",
    items: [
      {
        title: "Pengguna & Lisensi",
        url: "#auth-licenses",
        icon: <Users className="size-4" />,
        badge: "ADMIN",
      },
      {
        title: "Model Bisnis & Paket",
        url: "#business",
        icon: <CreditCard className="size-4" />,
        badge: "TIERS",
      },
      {
        title: "Portal Pelanggan (Tenant)",
        url: "#tenant-portal",
        icon: <Layers className="size-4" />,
        badge: "VIEW",
      },
    ],
  },
]

const userSections: NavMainSection[] = [
  {
    label: "My Security Portal",
    items: [
      {
        title: "Paket & Kuota Saya",
        url: "#overview",
        icon: <CreditCard className="size-4" />,
        badge: "PRO",
      },
      {
        title: "Aplikasi Web Terhubung",
        url: "#connected-apps",
        icon: <Globe className="size-4" />,
        badge: "LIVE",
      },
      {
        title: "Server VPS Sentinel",
        url: "#nodes",
        icon: <Server className="size-4" />,
        badge: "ACTIVE",
      },
      {
        title: "Kesehatan VPS & Serangan",
        url: "#threats",
        icon: <ShieldCheck className="size-4" />,
        badge: "SECURE",
      },
    ],
  },
]

const documents = [
  {
    name: "Commercial Blueprint",
    url: "#blueprint",
    icon: <BookOpen className="size-4" />,
  },
  {
    name: "Infra Architecture",
    url: "#infra",
    icon: <DatabaseIcon className="size-4" />,
  },
  {
    name: "Laravel WAF Core",
    url: "#waf-core",
    icon: <FileCode2 className="size-4" />,
  },
]

const navSecondary = [
  {
    title: "Global 3D Threat Map",
    url: "/threats-map",
    icon: <Globe className="size-4" />,
    badge: "3D MAP",
  },
  {
    title: "Dokumentasi Resmi",
    url: "/docs",
    icon: <CircleHelpIcon className="size-4" />,
  },
  {
    title: "Agent CLI Hardening",
    url: "#settings",
    icon: <Settings2Icon className="size-4" />,
  },
]

export function AppSidebar({
  user,
  role = "Superadmin",
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: { name: string; email: string; avatar?: string; role?: string }
  role?: string
}) {
  const currentUser = user || defaultAdminUser
  const isUserRole = role === "User"
  const sections = isUserRole ? userSections : adminSections

  return (
    <Sidebar collapsible="icon" className="font-sans" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/80 pb-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-2 font-sans transition-colors hover:bg-sidebar-accent data-[slot=sidebar-menu-button]:h-12"
              render={<Link href="/dashboard" />}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-main text-black shadow-xs">
                <ShieldCheck className="size-4.5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
                  Pasax Defense Suite
                </span>
                <span className="truncate font-mono text-[10px] font-semibold text-muted-foreground">
                  {isUserRole ? "Customer Security Portal" : "Enterprise SOC Sovereign"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-1.5">
        <NavMain sections={sections} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/80 pt-2">
        <NavUser
          user={{
            name: currentUser.name,
            email: currentUser.email,
            avatar: currentUser.avatar || "/avatars/admin.jpg",
            role: currentUser.role || role,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
