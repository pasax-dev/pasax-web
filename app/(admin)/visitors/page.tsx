import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { ForbiddenView } from "@/components/errors/forbidden-view"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { ensureSessionUser, getScopedNodes } from "@/lib/tenant-scope"
import { VisitorsClient } from "./_components/visitors-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Visitor Intelligence & Cookie Telemetry | Pasax Superadmin",
  description:
    "Pemantauan pengunjung menyeluruh untuk Superadmin: IP, ISP/ASN, detail alamat geografis, negara, OS, browser, hardware perangkat, dan status persetujuan cookie.",
}

export default async function VisitorsPage() {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)

  if (!ctx) {
    redirect("/login")
  }

  // Strict Superadmin-only gate
  if (ctx.role !== "Superadmin") {
    return <ForbiddenView />
  }

  const [visitorsResult, allNodes] = await Promise.all([
    pasaxCloud.fetchVisitors({ limit: 200 }),
    pasaxCloud.fetchNodes(),
  ])

  const nodes = getScopedNodes(session, allNodes)
  const workspaces = nodes.slice(0, 3).map((n) => ({
    name: n.hostname,
    url: "/node",
    badge: n.status,
  }))

  return (
    <AdminTemplate
      role={ctx.role}
      workspaces={workspaces}
      user={{
        name: ctx.user.name,
        email: ctx.email,
        role: ctx.role,
        avatar: "",
      }}
      breadcrumbs={[
        { title: "Fleet Operations", href: "/dashboard" },
        { title: "Visitor Intelligence" },
      ]}
    >
      <VisitorsClient
        initialSummary={visitorsResult.summary}
        initialVisitors={visitorsResult.data}
      />
    </AdminTemplate>
  )
}
