import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { ThreatsClient } from "./_components/threats-client"
import { pasaxCloud } from "@/lib/pasax-cloud"
import {
  ensureSessionUser,
  getScopedNodes,
  getScopedThreats,
} from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Insiden Serangan & Forensik | Pasax Defense Suite",
  description:
    "Audit telemetri forensik dan mitigasi serangan cyber waktu-nyata",
}

export default async function ThreatsPage() {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)

  if (!ctx) {
    redirect("/login")
  }

  const [allThreats, allNodes] = await Promise.all([
    pasaxCloud.fetchThreats(100),
    pasaxCloud.fetchNodes(),
  ])

  const nodes = getScopedNodes(session, allNodes)
  const threats = getScopedThreats(session, allThreats, nodes)
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
        avatar: "/avatars/admin.jpg",
      }}
      breadcrumbs={[
        { title: "Security Operations", href: "/dashboard" },
        { title: "Insiden Serangan" },
      ]}
    >
      <ThreatsClient
        initialThreats={threats}
        initialNodes={nodes}
        currentRole={ctx.role}
      />
    </AdminTemplate>
  )
}
