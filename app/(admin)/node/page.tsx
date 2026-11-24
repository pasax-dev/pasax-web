import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { NodesManagementClient } from "./_components/nodes-management-client"
import { pasaxCloud } from "@/lib/pasax-cloud"
import {
  ensureSessionUser,
  getScopedUsers,
  getScopedNodes,
} from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Daftar VPS & Node Sentinel | Pasax Defense Suite",
  description:
    "Manajemen dan pendaftaran server VPS Linux dalam armada pertahanan cyber Pasax",
}

export default async function NodePage() {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)

  if (!ctx) {
    redirect("/login")
  }

  const allNodes = await pasaxCloud.fetchNodes()
  const nodes = getScopedNodes(session, allNodes)
  const users = getScopedUsers(session)
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
        { title: "Daftar VPS & Node Sentinel" },
      ]}
    >
      <NodesManagementClient
        initialNodes={nodes}
        initialUsers={users}
        currentRole={ctx.role}
      />
    </AdminTemplate>
  )
}
