"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
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
  Key,
  Users,
  CreditCard,
  Layers,
  DatabaseIcon,
} from "lucide-react"

const defaultAdminUser = {
  name: "Roby Kartis (Chief SOC)",
  email: "superadmin@pasak.id",
  avatar: "/avatars/admin.jpg",
  role: "Superadmin",
}

const adminNav = [
  {
    title: "Fleet Overview",
    url: "#overview",
    icon: <LayoutDashboardIcon />,
    badge: "LIVE",
  },
  {
    title: "Pengguna & Lisensi",
    url: "#auth-licenses",
    icon: <Users />,
    badge: "ADMIN",
  },
  {
    title: "Model Bisnis & Paket",
    url: "#business",
    icon: <CreditCard />,
    badge: "TIERS",
  },
  {
    title: "Server Nodes (VPS)",
    url: "#nodes",
    icon: <Server />,
    badge: "3",
  },
  {
    title: "Threat Incidents (FIM & WAF)",
    url: "#threats",
    icon: <ShieldAlert />,
    badge: "ALERT",
  },
  {
    title: "VHost & SSL Recon",
    url: "#vhosts",
    icon: <Globe />,
    badge: "4",
  },
  {
    title: "Crowd Defense Blocklist",
    url: "#blocklist",
    icon: <Flame />,
    badge: "ACTIVE",
  },
  {
    title: "Portal Pelanggan (Tenant)",
    url: "#tenant-portal",
    icon: <Globe />,
    badge: "VIEW",
  },
]

const userNav = [
  {
    title: "Paket & Kuota Saya",
    url: "#overview",
    icon: <CreditCard />,
    badge: "PRO",
  },
  {
    title: "Aplikasi Web Terhubung",
    url: "#connected-apps",
    icon: <Globe />,
    badge: "LIVE",
  },
  {
    title: "Server VPS Sentinel",
    url: "#nodes",
    icon: <Server />,
    badge: "ACTIVE",
  },
  {
    title: "Kesehatan VPS & Serangan",
    url: "#threats",
    icon: <ShieldCheck />,
    badge: "SECURE",
  },
]

const documents = [
  {
    name: "Commercial Blueprint",
    url: "#blueprint",
    icon: <BookOpen />,
  },
  {
    name: "Infra Architecture",
    url: "#infra",
    icon: <DatabaseIcon />,
  },
  {
    name: "Laravel WAF Core",
    url: "#waf-core",
    icon: <FileCode2 />,
  },
]

const navSecondary = [
  {
    title: "Agent Settings",
    url: "#settings",
    icon: <Settings2Icon />,
  },
  {
    title: "Documentation",
    url: "https://pasak.is-a.dev",
    icon: <CircleHelpIcon />,
  },
  {
    title: "CLI Installer",
    url: "https://get.pasak.is-a.dev",
    icon: <Terminal />,
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
  const navItems = isUserRole ? userNav : adminNav

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="rounded-base border-2 border-border bg-main text-main-foreground shadow-shadow data-[slot=sidebar-menu-button]:p-2!"
              render={<a href="/dashboard" />}
            >
              <div className="flex size-7 items-center justify-center rounded-base bg-black text-white">
                <ShieldCheck className="size-4 text-green-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading text-sm leading-none font-black tracking-tight">
                  PASAK CLOUD
                </span>
                <span className="font-mono text-[10px] leading-tight font-semibold text-black/80">
                  {isUserRole ? "Customer Defense Portal" : "SOC Sovereign Console"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: currentUser.name, email: currentUser.email, avatar: currentUser.avatar || "/avatars/admin.jpg" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
