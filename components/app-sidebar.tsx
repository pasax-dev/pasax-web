"use client"

import * as React from "react"
import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavProjects, type NavProjectItem } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher, type FleetTeam } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  ShieldCheck,
  Server,
  ShieldAlert,
  Users,
  BookOpen,
  Settings2,
  Terminal,
  Globe,
  Layers,
} from "lucide-react"

const defaultAdminUser = {
  name: "Roby Kartis (Chief SOC)",
  email: "pasak.dev@gmail.com",
  avatar: "/avatars/admin.jpg",
  role: "Superadmin",
}

const adminTeams: FleetTeam[] = [
  {
    name: "Pasax Cyber Defense",
    plan: "Enterprise Fleet • SG-01",
    logo: ShieldCheck,
  },
  {
    name: "Staging US-East Cluster",
    plan: "Pro Fleet Mesh • US-02",
    logo: Server,
  },
  {
    name: "Gov & Air-Gapped SOC",
    plan: "Sovereign Air-Gapped",
    logo: ShieldAlert,
  },
]

const userTeams: FleetTeam[] = [
  {
    name: "Pasax Personal Defense",
    plan: "Pro Subscriber • SG-01",
    logo: ShieldCheck,
  },
  {
    name: "Staging App Mesh",
    plan: "Connected Tenant App",
    logo: Server,
  },
]

const adminNavMain: NavMainItem[] = [
  {
    title: "Security Operations",
    url: "#overview",
    icon: ShieldCheck,
    isActive: true,
    items: [
      {
        title: "Fleet Overview",
        url: "#overview",
      },
      {
        title: "Server Nodes (VPS)",
        url: "#nodes",
        badge: "3",
      },
      {
        title: "Threat Incidents",
        url: "#threats",
        badge: "ALERT",
      },
      {
        title: "Crowd Defense Blocklist",
        url: "#blocklist",
        badge: "ACTIVE",
      },
      {
        title: "VHost & SSL Recon",
        url: "#vhosts",
        badge: "4",
      },
    ],
  },
  {
    title: "Fleet Management",
    url: "#auth-licenses",
    icon: Users,
    items: [
      {
        title: "Pengguna & Lisensi",
        url: "#auth-licenses",
        badge: "ADMIN",
      },
      {
        title: "Model Bisnis & Paket",
        url: "#business",
        badge: "TIERS",
      },
      {
        title: "Portal Pelanggan (Tenant)",
        url: "#tenant-portal",
        badge: "VIEW",
      },
    ],
  },
  {
    title: "Blueprints & Specs",
    url: "#blueprint",
    icon: BookOpen,
    items: [
      {
        title: "Commercial Blueprint",
        url: "#blueprint",
      },
      {
        title: "Infra Architecture",
        url: "#infra",
      },
      {
        title: "Laravel WAF Core",
        url: "#waf-core",
      },
    ],
  },
  {
    title: "Platform & Tools",
    url: "/threats-map",
    icon: Settings2,
    items: [
      {
        title: "Global 3D Threat Map",
        url: "/threats-map",
        badge: "3D MAP",
      },
      {
        title: "Dokumentasi Resmi",
        url: "/docs",
      },
      {
        title: "Agent CLI Hardening",
        url: "#settings",
      },
    ],
  },
]

const userNavMain: NavMainItem[] = [
  {
    title: "My Security Portal",
    url: "#overview",
    icon: ShieldCheck,
    isActive: true,
    items: [
      {
        title: "Paket & Kuota Saya",
        url: "#overview",
        badge: "PRO",
      },
      {
        title: "Aplikasi Web Terhubung",
        url: "#connected-apps",
        badge: "LIVE",
      },
      {
        title: "Server VPS Sentinel",
        url: "#nodes",
        badge: "ACTIVE",
      },
      {
        title: "Kesehatan VPS & Serangan",
        url: "#threats",
        badge: "SECURE",
      },
    ],
  },
  {
    title: "Resources & Map",
    url: "/threats-map",
    icon: BookOpen,
    items: [
      {
        title: "Global 3D Threat Map",
        url: "/threats-map",
      },
      {
        title: "Dokumentasi Pasax",
        url: "/docs",
      },
    ],
  },
]

const adminProjects: NavProjectItem[] = [
  {
    name: "sentinel-sgp-01.mesh",
    url: "#nodes",
    icon: <Server className="size-3.5" />,
    badge: "ONLINE",
  },
  {
    name: "staging-app-us01.mesh",
    url: "#nodes",
    icon: <Globe className="size-3.5" />,
    badge: "HEALTHY",
  },
  {
    name: "api.pasax.is-a.dev",
    url: "#vhosts",
    icon: <Terminal className="size-3.5" />,
    badge: "WAF LIVE",
  },
  {
    name: "clientportal.id",
    url: "#vhosts",
    icon: <Layers className="size-3.5" />,
    badge: "TLS 1.3",
  },
]

const userProjects: NavProjectItem[] = [
  {
    name: "my-laravel-vps.com",
    url: "#connected-apps",
    icon: <Globe className="size-3.5" />,
    badge: "ACTIVE",
  },
  {
    name: "node-production-01",
    url: "#nodes",
    icon: <Server className="size-3.5" />,
    badge: "HEALTHY",
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
  const teams = isUserRole ? userTeams : adminTeams
  const navMain = isUserRole ? userNavMain : adminNavMain
  const projects = isUserRole ? userProjects : adminProjects

  return (
    <Sidebar collapsible="icon" className="font-sans" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/80 group-data-[collapsible=icon]:p-1.5">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent className="gap-1 px-1.5 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:gap-1">
        <NavMain items={navMain} label={isUserRole ? "Tenant Portal" : "Fleet Operations"} />
        <NavProjects
          projects={projects}
          label={isUserRole ? "Connected Workspaces" : "Fleet Workspaces"}
        />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/80 group-data-[collapsible=icon]:p-1.5">
        <NavUser
          user={{
            name: currentUser.name,
            email: currentUser.email,
            avatar: currentUser.avatar || "/avatars/admin.jpg",
            role: currentUser.role || role,
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
