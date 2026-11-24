"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { InstallAgentDialog } from "@/components/install-agent-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
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
import { ShieldCheck, LogOut, AlertTriangle } from "lucide-react"

export function SiteHeader({
  breadcrumbs,
}: {
  breadcrumbs?: { title: string; href?: string }[]
}) {
  const { data: session } = useSession()
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const user = session?.user
  const name = user?.name || "Operator SOC"
  const email = user?.email || "operator@pasax.id"
  const role = (user as any)?.role || "User"
  const avatar = (user as any)?.image || "/avatars/admin.jpg"

  const initials =
    name
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

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b-2 border-border bg-background/80 px-4 font-sans backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 border-2 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs && breadcrumbs.length > 0 ? (
                breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1
                  return (
                    <React.Fragment key={crumb.title}>
                      <BreadcrumbItem>
                        {isLast || !crumb.href ? (
                          <BreadcrumbPage className="font-semibold text-foreground">
                            {crumb.title}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href} className="font-medium hover:text-foreground">
                            {crumb.title}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                    </React.Fragment>
                  )
                })
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/dashboard"
                      className="flex items-center gap-1.5 font-bold tracking-tight text-foreground transition-colors hover:text-main"
                    >
                      <ShieldCheck className="size-4 text-main" />
                      <span>PASAX SOC</span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground/80">
                      <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span>Fleet Operations & Intelligence</span>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Link to 3D Live Threat Map */}
          <Link
            href="/threats-map"
            className="hidden items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background/80 px-2.5 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 sm:inline-flex"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-rose-600" />
            </span>
            <span className="text-rose-600 dark:text-rose-400">Live 3D Map</span>
          </Link>

          {/* Sentinel Mesh Status */}
          <div className="hidden items-center gap-2 rounded-base border-2 border-border bg-secondary-background/80 px-3 py-1 font-mono text-xs backdrop-blur-sm md:flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            <span className="font-bold">Sentinel Mesh</span>
            <span className="border-l border-border pl-2 font-mono text-[10px] text-muted-foreground">
              &lt; 0.2ms
            </span>
          </div>

          <ThemeToggle />
          <InstallAgentDialog />

          <Separator
            orientation="vertical"
            className="mx-0.5 hidden h-5 data-vertical:self-auto sm:inline-block"
          />

          {/* User Profile Avatar & Info */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background/70 py-0.5 pr-2.5 pl-1 shadow-[2px_2px_0px_0px_var(--border)]">
              <Avatar className="size-7 rounded-base border border-border">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="rounded-base bg-main font-mono text-[11px] font-black text-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col text-left leading-none sm:flex">
                <span className="max-w-[120px] truncate text-xs font-bold text-foreground">
                  {name.replace(" (SOC)", "").replace(" (Superadmin)", "").replace(" (Admin)", "")}
                </span>
                <span className="font-mono text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                  {role}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => setShowLogoutDialog(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-base border-2 border-border bg-destructive/10 px-2.5 py-1 font-mono text-xs font-bold text-destructive shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-destructive hover:text-destructive-foreground active:translate-x-1 active:translate-y-1 active:shadow-none"
              title="Keluar dari sesi SOC"
            >
              <LogOut className="size-3.5 stroke-[2.5]" />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

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
              Apakah Anda yakin ingin mengakhiri sesi operator untuk akun{" "}
              <span className="font-mono font-bold text-foreground">{email}</span>? Anda harus
              memasukkan kredensial otorisasi kembali untuk mengakses konsol fleet pertahanan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="border-2 border-border font-sans text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)] hover:bg-secondary"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="border-2 border-border bg-destructive font-sans text-xs font-bold text-destructive-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-destructive/90"
            >
              {isLoggingOut ? "Memproses Keluar..." : "Ya, Keluar Sesi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
