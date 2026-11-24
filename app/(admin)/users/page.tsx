import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { UsersManagementClient } from "./_components/users-management-client"
import { pasaxCloud } from "@/lib/pasax-cloud"
import {
  ensureSessionUser,
  getScopedUsers,
  getScopedNodes,
} from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Manajemen Pengguna & Pemegang VPS | Pasax Defense Suite",
  description:
    "Kelola hak akses operator, penugasan VPS armada, dan kuota perlindungan cyber",
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)

  if (!ctx) {
    redirect("/login")
  }

  const allNodes = await pasaxCloud.fetchNodes()
  const users = getScopedUsers(session)
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
        avatar: "/avatars/admin.jpg",
      }}
      breadcrumbs={[
        { title: "Fleet Management", href: "/dashboard" },
        { title: "Pemegang VPS & Pengguna" },
      ]}
    >
      <UsersManagementClient
        initialUsers={users}
        initialNodes={nodes}
        currentRole={ctx.role}
        currentEmail={ctx.email}
      />
    </AdminTemplate>
  )
}
