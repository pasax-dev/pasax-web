"use client"

import * as React from "react"
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
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  SparklesIcon,
  EllipsisVerticalIcon,
  AlertTriangle,
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

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: "/login" })
  }

  // Derive initials from name
  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "OP"

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  tooltip={user.name}
                  className="aria-expanded:bg-muted font-sans group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center"
                />
              }
            >
              <Avatar className="size-8 rounded-base border border-border shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-base bg-main font-mono text-xs font-black text-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold text-foreground">{user.name}</span>
                <span className="truncate font-mono text-xs text-foreground/70">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 font-sans"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-base border border-border">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded-base bg-main font-mono text-xs font-black text-black">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-bold text-foreground">{user.name}</span>
                      <span className="truncate font-mono text-xs text-muted-foreground">
                        {user.email}
                      </span>
                      {user.role && (
                        <span className="font-mono text-[9px] font-black uppercase tracking-wider text-main">
                          {user.role}
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-2 text-xs">
                  <SparklesIcon className="size-4 text-muted-foreground" />
                  <span>Sovereign License</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-2 text-xs">
                  <BadgeCheckIcon className="size-4 text-muted-foreground" />
                  <span>Pengaturan Akun</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-xs">
                  <CreditCardIcon className="size-4 text-muted-foreground" />
                  <span>Paket & Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-xs">
                  <BellIcon className="size-4 text-muted-foreground" />
                  <span>Notifikasi Insiden</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowLogoutDialog(true)}
                className="gap-2 text-xs font-semibold text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
              >
                <LogOutIcon className="size-4" />
                <span>Keluar Akun</span>
              </DropdownMenuItem>
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
              Apakah Anda yakin ingin mengakhiri sesi untuk akun{" "}
              <span className="font-mono font-bold text-foreground">{user.email}</span>? Anda harus
              memasukkan kredensial kembali untuk mengakses konsol pertahanan.
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
              {isLoggingOut ? "Memproses..." : "Ya, Keluar Akun"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
