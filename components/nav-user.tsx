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
  const userRole = user.role || (session?.user as any)?.role || "Superadmin"

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
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  tooltip={userName}
                  className="rounded-lg font-sans transition-colors hover:bg-sidebar-accent aria-expanded:bg-sidebar-accent data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center"
                />
              }
            >
              <Avatar className="size-8 rounded-base border border-border shrink-0">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="rounded-base bg-main font-mono text-xs font-black text-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-bold tracking-tight text-foreground">
                    {userName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground truncate">
                  <span className="truncate">{userEmail}</span>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 rounded-xl p-1.5 font-sans shadow-lg border border-border bg-popover"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={6}
            >
              {/* Header Profile Card */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-secondary-background/60 p-2 text-left text-sm">
                    <Avatar className="size-9 rounded-base border border-border shrink-0">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="rounded-base bg-main font-mono text-xs font-black text-black">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left leading-tight min-w-0">
                      <span className="truncate font-bold text-foreground">{userName}</span>
                      <span className="truncate font-mono text-[10px] text-muted-foreground">
                        {userEmail}
                      </span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center rounded-full bg-main/20 px-1.5 py-0.2 font-mono text-[9px] font-black uppercase tracking-wider text-foreground border border-main/40">
                          {userRole}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                          ONLINE
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              {/* License & Tier Status */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => scrollToHash("auth-licenses")}
                  className="gap-2.5 py-2 text-xs cursor-pointer font-medium"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-sidebar-accent text-sidebar-foreground">
                    <Sparkles className="size-3.5 text-main" />
                  </div>
                  <div className="grid flex-1 leading-tight">
                    <span className="font-semibold text-foreground">Sovereign Air-Gapped</span>
                    <span className="font-mono text-[10px] text-muted-foreground">Enterprise SOC Fleet</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              {/* Account, Management & Settings */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => scrollToHash("auth-licenses")}
                  className="gap-2 py-1.5 text-xs cursor-pointer font-medium"
                >
                  <BadgeCheck className="size-4 text-muted-foreground" />
                  <span>Profil & Kredensial SOC</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => scrollToHash("auth-licenses")}
                  className="gap-2 py-1.5 text-xs cursor-pointer font-medium"
                >
                  <Key className="size-4 text-muted-foreground" />
                  <span>Kunci Lisensi & API Keys</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => scrollToHash("business")}
                  className="gap-2 py-1.5 text-xs cursor-pointer font-medium"
                >
                  <CreditCard className="size-4 text-muted-foreground" />
                  <span>Model Bisnis & Kuota Server</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => scrollToHash("threats")}
                  className="gap-2 py-1.5 text-xs cursor-pointer font-medium flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="size-4 text-muted-foreground" />
                    <span>Notifikasi Insiden & Alert</span>
                  </div>
                  <span className="rounded-full bg-rose-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-rose-600 dark:text-rose-400">
                    LIVE
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              {/* Documentation & Manuals */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={<Link href="/docs" />}
                  className="gap-2 py-1.5 text-xs cursor-pointer font-medium"
                >
                  <BookOpen className="size-4 text-muted-foreground" />
                  <span>Dokumentasi Resmi Pasax</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link href="/threats-map" />}
                  className="gap-2 py-1.5 text-xs cursor-pointer font-medium"
                >
                  <Shield className="size-4 text-muted-foreground" />
                  <span>3D Perimeter Threat Radar</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              {/* Logout Action */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setShowLogoutDialog(true)}
                  className="gap-2 py-2 text-xs font-semibold text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer rounded-md"
                >
                  <LogOut className="size-4" />
                  <span>Keluar dari Sesi SOC</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="border-2 border-border bg-card p-6 font-sans shadow-[6px_6px_0px_0px_var(--border)] sm:max-w-md">
          <AlertDialogHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-base border-2 border-border bg-destructive/15 text-destructive shadow-[2px_2px_0px_0px_var(--border)]">
              <AlertTriangle className="size-5 stroke-[2.5]" />
            </div>
            <AlertDialogTitle className="text-base font-bold tracking-tight text-foreground">
              Konfirmasi Keluar Sesi SOC
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-normal leading-relaxed text-muted-foreground">
              Apakah Anda yakin ingin mengakhiri sesi untuk operator{" "}
              <span className="font-mono font-bold text-foreground">{userEmail}</span>? Anda harus
              memasukkan kredensial otorisasi kembali untuk mengakses konsol pertahanan armada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="border-2 border-border font-sans text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)] hover:bg-secondary cursor-pointer"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="border-2 border-border bg-destructive font-sans text-xs font-bold text-destructive-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-destructive/90 cursor-pointer"
            >
              {isLoggingOut ? "Memproses..." : "Ya, Keluar Akun"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
