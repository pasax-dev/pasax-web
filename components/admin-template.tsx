import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
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
  children?: React.ReactNode
  headerExtra?: React.ReactNode
}

/**
 * AdminTemplate - Template dasar halaman admin dengan arsitektur resmi shadcn UI (sidebar-07).
 *
 * Contoh penggunaan:
 * ```tsx
 * export default function Page() {
 *   return (
 *     <AdminTemplate
 *       breadcrumbs={[
 *         { title: "Fleet Management", href: "/dashboard#business" },
 *         { title: "Data Fetching" },
 *       ]}
 *     >
 *       <div className="grid auto-rows-min gap-4 md:grid-cols-3">
 *         <div className="aspect-video rounded-xl bg-muted/50" />
 *         <div className="aspect-video rounded-xl bg-muted/50" />
 *         <div className="aspect-video rounded-xl bg-muted/50" />
 *       </div>
 *       <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
 *     </AdminTemplate>
 *   )
 * }
 * ```
 */
export function AdminTemplate({
  breadcrumbs,
  user,
  role = "Superadmin",
  children,
  headerExtra,
}: AdminTemplateProps) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} role={role} />
      <SidebarInset className="relative min-h-screen overflow-x-hidden font-sans">
        {/* Subtle Cyber Tactical Grid Pattern & Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#0099ff1f_1.2px,transparent_1.2px)] [background-size:24px_24px] dark:bg-[radial-gradient(#38bdf826_1.2px,transparent_1.2px)] opacity-90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 z-0 h-[520px] w-full max-w-full -translate-x-1/2 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(0,153,255,0.14),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(56,189,248,0.20),transparent_70%)]"
        />

        {headerExtra ? (
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b-2 border-border bg-background/80 px-4 font-sans backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 lg:px-6">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs?.map((crumb, idx) => {
                    const isLast = idx === breadcrumbs.length - 1
                    return (
                      <React.Fragment key={crumb.title}>
                        <BreadcrumbItem className={!isLast ? "hidden md:block" : ""}>
                          {isLast || !crumb.href ? (
                            <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={crumb.href}>{crumb.title}</BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                      </React.Fragment>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {headerExtra}
          </header>
        ) : (
          <SiteHeader breadcrumbs={breadcrumbs} />
        )}

        <div className="relative z-10 flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
