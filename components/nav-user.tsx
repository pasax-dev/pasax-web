"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
  AlertTriangle,
  Key,
  Shield,
  BookOpen,
} from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    role?: string
  }
}) {
  const { isMobile } = useSidebar()
  const { data: session } = useSession()
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  // Use session fallback if available
  const userName = user.name || session?.user?.name || "Operator SOC"
  const userEmail = user.email || session?.user?.email || "operator@pasax.id"
  const userAvatar = user.avatar || (session?.user as any)?.image || "/avatars/admin.jpg"
  const userRole = user.role || (session?.user as any)?.role || "User"

  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "OP"

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: "/login" })
  }

  const scrollToHash = (hash: string) => {
    window.location.hash = hash
    const el = document.getElementById(hash) || document.getElementById("operations-matrix")
    el?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground font-sans cursor-pointer"
              >
                <Avatar className="size-8 rounded-lg shrink-0">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="rounded-lg bg-main font-mono text-xs font-black text-black">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-bold tracking-tight text-foreground">
                    {userName}
                  </span>
                  <span className="truncate font-mono text-[11px] text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 rounded-xl p-1.5 font-sans shadow-lg border border-border bg-popover"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              {/* Header Profile Card */}
              <DropdownMenuGroup>
                <div className="flex items-center gap-2.5 p-2">
                  <Avatar className="size-9 rounded-lg border border-border">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="rounded-lg bg-main font-mono text-xs font-black text-black">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground truncate">{userName}</span>
                      <span className="rounded-md border border-main/50 bg-main/20 px-1 py-0.2 font-mono text-[9px] font-black uppercase text-foreground">
                        {userRole}
                      </span>
                    </div>
                    <span className="truncate font-mono text-[10px] text-muted-foreground">
                      {userEmail}
                    </span>
                  </div>
                </div>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Status & Subscription Quick View */}
              <DropdownMenuGroup>
                <div className="rounded-lg bg-sidebar-accent/60 p-2 text-xs">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-muted-foreground">Armada Pasax:</span>
                    <span className="font-bold text-emerald-500 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Sovereign Air-Gapped
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span>Cluster Sync:</span>
                    <span>100% Locked</span>
                  </div>
                </div>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Navigation & Management Actions */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Pusat Kendali SOC
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => scrollToHash("overview")}
                  className="gap-2 text-xs cursor-pointer"
                >
                  <Sparkles className="size-4 text-main" />
                  <span>Fleet Health & Skor SOC</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => scrollToHash("auth-licenses")}
                  className="gap-2 text-xs cursor-pointer"
                >
                  <Key className="size-4 text-sky-500" />
                  <span>Otoritas Pengguna & Kunci API</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => scrollToHash("business")}
                  className="gap-2 text-xs cursor-pointer"
                >
                  <CreditCard className="size-4 text-purple-500" />
                  <span>Model Bisnis & Tier Armada</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => scrollToHash("threats")}
                  className="gap-2 text-xs cursor-pointer"
                >
                  <Shield className="size-4 text-rose-500" />
                  <span>Insiden & Ancaman WAF</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* External / Resource Links */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={<Link href="/threats-map" />}
                  className="cursor-pointer gap-2 text-xs"
                >
                  <Sparkles className="size-4 text-emerald-500" />
                  <span>Live 3D Threat Radar</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link href="/docs" />}
                  className="cursor-pointer gap-2 text-xs"
                >
                  <BookOpen className="size-4 text-amber-500" />
                  <span>Dokumentasi Resmi Pasax</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Danger Zone: Log Out Trigger with Dialog */}
              <DropdownMenuItem
                onClick={() => setShowLogoutDialog(true)}
                className="gap-2 text-xs text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer"
              >
                <LogOut className="size-4" />
                <span className="font-bold">Keluar dari Sesi SOC</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Logout Confirmation Alert Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md font-sans">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-rose-500">
              <AlertTriangle className="size-5 shrink-0" />
              <AlertDialogTitle className="font-bold">Konfirmasi Keluar Sesi SOC</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Anda akan mengakhiri sesi aktif sebagai <strong className="text-foreground">{userName} ({userRole})</strong>.
              Sistem akan memutus token autentikasi lokal dan mengembalikan Anda ke gerbang masuk aman.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="font-sans text-xs"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-rose-600 font-sans text-xs font-bold text-white hover:bg-rose-700"
            >
              {isLoggingOut ? "Mengakhiri Sesi..." : "Ya, Akhiri Sesi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
