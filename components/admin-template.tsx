import * as React from "react"
import { AppSidebar, type SidebarWorkspaceItem } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

export interface AdminBreadcrumb {
  title: string
  href?: string
}

export interface AdminTemplateProps {
  breadcrumbs?: AdminBreadcrumb[]
  user?: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
  role?: string
  workspaces?: SidebarWorkspaceItem[]
  children?: React.ReactNode
  headerExtra?: React.ReactNode
}

export function AdminTemplate({
  breadcrumbs,
  user,
  role = "Superadmin",
  workspaces,
  children,
  headerExtra,
}: AdminTemplateProps) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} role={role} workspaces={workspaces} />
      <SidebarInset className="relative min-h-screen overflow-x-hidden font-sans">
        {/* Subtle Cyber Tactical Grid Pattern & Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#0099ff1f_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-90 dark:bg-[radial-gradient(#38bdf826_1.2px,transparent_1.2px)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 z-0 h-[520px] w-full max-w-full -translate-x-1/2 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(0,153,255,0.14),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(56,189,248,0.20),transparent_70%)]"
        />

        {headerExtra ? (
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b-2 border-border bg-background/85 px-4 font-sans backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 lg:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <SidebarTrigger className="-ml-1 shrink-0" />
              <Separator
                orientation="vertical"
                className="mr-1 shrink-0 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb className="min-w-0 flex-1 overflow-hidden">
                <BreadcrumbList className="flex-nowrap items-center overflow-hidden whitespace-nowrap">
                  {breadcrumbs?.map((crumb, idx) => {
                    const isLast = idx === breadcrumbs.length - 1
                    return (
                      <React.Fragment key={crumb.title}>
                        <BreadcrumbItem
                          className={
                            !isLast
                              ? "hidden min-w-0 sm:inline-flex"
                              : "min-w-0"
                          }
                        >
                          {isLast || !crumb.href ? (
                            <BreadcrumbPage className="max-w-[200px] truncate font-semibold">
                              {crumb.title}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              href={crumb.href}
                              className="max-w-[160px] truncate font-medium"
                            >
                              {crumb.title}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && (
                          <BreadcrumbSeparator className="hidden shrink-0 sm:block" />
                        )}
                      </React.Fragment>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="shrink-0">{headerExtra}</div>
          </header>
        ) : (
          <SiteHeader breadcrumbs={breadcrumbs} />
        )}

        <div className="relative flex flex-1 flex-col gap-5 p-4 sm:p-5 lg:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
