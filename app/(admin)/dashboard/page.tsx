import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { PasaxOperationsPanel } from "@/components/pasax-operations-panel"
import { AdminUsersLicenses } from "@/components/admin-users-licenses"
import { UserTenantPortal } from "@/components/user-tenant-portal"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export default async function Page() {
  const session = await getServerSession(authOptions)

  // Determine current user and role
  const userRole = (session?.user as any)?.role || "Superadmin"
  const userEmail = session?.user?.email || "superadmin@pasax.id"
  const userName = session?.user?.name || "Roby Kartis (Chief SOC)"

  // Fetch all fleet telemetry in parallel
  const [nodes, threats, blocklist] = await Promise.all([
    pasaxCloud.fetchNodes(),
    pasaxCloud.fetchThreats(50),
    pasaxCloud.fetchBlocklist(),
  ])

  const users = pasaxStore.getUsers()
  const licenseKeys = pasaxStore.getLicenseKeys()
  const tenantOverview = pasaxStore.getUserTenantOverview(userEmail)

  // Calculate vhosts count across all nodes
  let vhostsCount = 0
  nodes.forEach((n) => {
    vhostsCount +=
      (n.webservers?.nginx?.vhosts?.length || 0) +
      (n.webservers?.apache2?.vhosts?.length || 0)
  })

  const isTenantOnly = userRole === "User"

  return (
    <SidebarProvider>
      <AppSidebar
        role={userRole}
        user={{
          name: userName,
          email: userEmail,
          role: userRole,
          avatar: "/avatars/admin.jpg",
        }}
      />
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

        <SiteHeader />
        <div className="relative z-10 flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="@container/main flex flex-1 flex-col gap-4">
            {isTenantOnly ? (
              // ---------------------------------------------------------
              // ROLE: USER (TENANT / CUSTOMER VIEW)
              // ---------------------------------------------------------
              <div className="py-2 md:py-4">
                <UserTenantPortal initialData={tenantOverview} />
              </div>
            ) : (
              // ---------------------------------------------------------
              // ROLE: SUPERADMIN & ADMIN (FULL SOC MASTER SUITE)
              // ---------------------------------------------------------
              <div className="flex flex-col gap-6 py-2 md:py-4">
                {/* 1. Global Stat Cards */}
                <div id="overview">
                  <SectionCards
                    stats={{
                      score: 98,
                      activeNodes: nodes.length,
                      vhostsCount: vhostsCount,
                      totalBlocks: 1420 + threats.length,
                    }}
                  />
                </div>

                {/* 2. Modul Pendaftaran User, Lisensi Multi-App & Model Bisnis */}
                <div id="auth-licenses">
                  <AdminUsersLicenses
                    initialUsers={users}
                    initialKeys={licenseKeys}
                    currentRole={userRole}
                  />
                </div>

                {/* 3. Threat Velocity Interactive Chart */}
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>

                {/* 4. Main Operations Matrix: Fleet, Threats, VHosts, Blocklist */}
                <div id="nodes">
                  <PasaxOperationsPanel
                    initialNodes={nodes}
                    initialThreats={threats}
                    initialBlocklist={blocklist}
                  />
                </div>

                {/* 5. Pratinjau Perspektif Pelanggan (Tenant Portal Preview) */}
                <div id="tenant-portal" className="border-t-2 border-border/80 pt-6">
                  <div className="px-4 lg:px-6 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-lg font-black tracking-tight text-foreground">
                        👁️ Pratinjau Portal Pelanggan (Tenant Customer View)
                      </span>
                      <span className="font-mono text-[10px] bg-secondary-background border border-border px-2 py-0.5 rounded font-bold text-muted-foreground">
                        MODE INSPEKSI ADMIN
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                      Tampilan berikut adalah persis yang dilihat oleh pelanggan/user saat mengakses dashboard.
                    </p>
                  </div>
                  <UserTenantPortal initialData={tenantOverview} />
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
