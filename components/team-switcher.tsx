"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDown, Plus } from "lucide-react"

export interface FleetTeam {
  name: string
  logo: React.ComponentType<{ className?: string }> | React.ReactNode
  plan: string
}

function renderTeamLogo(logo: React.ComponentType<{ className?: string }> | React.ReactNode) {
  if (!logo) return null
  if (React.isValidElement(logo)) {
    return logo
  }
  const Component = logo as React.ElementType
  return <Component className="size-4 stroke-[2.5]" />
}

export function TeamSwitcher({
  teams,
}: {
  teams: FleetTeam[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground font-sans cursor-pointer"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-main text-black shrink-0 font-bold shadow-xs">
                {renderTeamLogo(activeTeam.logo)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-bold tracking-tight text-sidebar-foreground">
                  {activeTeam.name}
                </span>
                <span className="truncate font-mono text-[10px] font-semibold text-muted-foreground">
                  {activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg font-sans"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Fleet Clusters & Meshes
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2.5 p-2 font-sans text-xs cursor-pointer"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-sidebar-accent text-sidebar-foreground">
                    {renderTeamLogo(team.logo)}
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="font-semibold text-foreground">{team.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{team.plan}</span>
                  </div>
                  <DropdownMenuShortcut className="font-mono text-[10px]">
                    ⌘{index + 1}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  const el = document.getElementById("install-node") || document.getElementById("nodes")
                  el?.scrollIntoView({ behavior: "smooth" })
                }}
                className="gap-2 p-2 font-sans text-xs cursor-pointer"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-background">
                  <Plus className="size-3.5 text-muted-foreground" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Hubungkan Node Baru...
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
