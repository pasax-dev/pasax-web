"use client"

import * as React from "react"
import { NavMain, type NavMainSection } from "@/components/nav-main"
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
  Tag,
  Server,
  ShieldAlert,
  Users,
  BookOpen,
  Key,
  Shield,
  Globe,
  Layers,
  LayoutDashboard,
  Activity,
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

// 1. Flat Administrator Navigation (No Dropdowns - Simple & Direct)
const adminNavSections: NavMainSection[] = [
  {
    label: "Fleet Operations",
    items: [
      {
        title: "Executive Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Server Nodes (VPS)",
        url: "/node",
        icon: Server,
        badge: "FLEET",
      },
      {
        title: "Tim VPS & Pengguna",
        url: "/users",
        icon: Users,
        badge: "TEAM",
      },
      {
        title: "Matriks Hak Akses Peran",
        url: "/permissions",
        icon: ShieldCheck,
        badge: "ROLES",
      },
      {
        title: "Insiden Serangan",
        url: "/threats",
        icon: ShieldAlert,
        badge: "ALERT",
      },
      {
        title: "Paket Harga & Bundling",
        url: "/pricing",
        icon: Tag,
        badge: "TIERS",
      },
      {
        title: "Kunci Lisensi & API",
        url: "/licenses",
        icon: Key,
        badge: "KEYS",
      },
      {
        title: "Crowd Defense Blocklist",
        url: "/blocklist",
        icon: Shield,
        badge: "ACTIVE",
      },
      {
        title: "VHost & SSL Recon",
        url: "/vhosts",
        icon: Globe,
        badge: "TLS",
      },
    ],
  },
  {
    label: "Platform & Resources",
    items: [
      {
        title: "Global 3D Threat Map",
        url: "/threats-map",
        icon: Activity,
        badge: "3D",
      },
      {
        title: "Dokumentasi Resmi",
        url: "/docs",
        icon: BookOpen,
      },
      {
        title: "Changelog & Releases",
        url: "/changelog",
        icon: Layers,
      },
    ],
  },
]

// 2. Flat User / Tenant Navigation
const userNavSections: NavMainSection[] = [
  {
    label: "Tenant Portal",
    items: [
      {
        title: "Dashboard Pelanggan",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Server VPS Saya",
        url: "/node",
        icon: Server,
        badge: "ACTIVE",
      },
      {
        title: "Insiden & Serangan",
        url: "/threats",
        icon: ShieldAlert,
        badge: "SECURE",
      },
      {
        title: "Kunci Lisensi Saya",
        url: "/licenses",
        icon: Key,
        badge: "KEYS",
      },
      {
        title: "Panduan Hak Akses Peran",
        url: "/permissions",
        icon: ShieldCheck,
        badge: "ROLES",
      },
    ],
  },
  {
    label: "Platform & Resources",
    items: [
      {
        title: "Global 3D Threat Map",
        url: "/threats-map",
        icon: Activity,
        badge: "3D",
      },
      {
        title: "Dokumentasi Resmi",
        url: "/docs",
        icon: BookOpen,
      },
      {
        title: "Changelog & Releases",
        url: "/changelog",
        icon: Layers,
      },
    ],
  },
]

const adminProjects: NavProjectItem[] = [
  {
    name: "sentinel-sgp-01.mesh",
    url: "/node",
    icon: <Server className="size-3.5" />,
    badge: "ONLINE",
  },
  {
    name: "staging-app-us01.mesh",
    url: "/node",
    icon: <Globe className="size-3.5" />,
    badge: "HEALTHY",
  },
  {
    name: "app.pasax.is-a.dev",
    url: "/vhosts",
    icon: <ShieldCheck className="size-3.5" />,
    badge: "TLS 1.3",
  },
]

const userProjects: NavProjectItem[] = [
  {
    name: "prod-vps-sg01",
    url: "/node",
    icon: <Server className="size-3.5" />,
    badge: "HEALTHY",
  },
  {
    name: "layanan.kominfo.go.id",
    url: "/vhosts",
    icon: <Globe className="size-3.5" />,
    badge: "ACTIVE",
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
  const sections = isUserRole ? userNavSections : adminNavSections
  const projects = isUserRole ? userProjects : adminProjects

  return (
    <Sidebar collapsible="icon" className="font-sans" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/80">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <NavMain
          sections={sections}
          label={isUserRole ? "Tenant Portal" : "Fleet Operations"}
        />
        <NavProjects
          projects={projects}
          label={isUserRole ? "Connected Workspaces" : "Fleet Workspaces"}
        />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/80">
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
