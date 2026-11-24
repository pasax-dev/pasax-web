import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { PermissionsClient } from "./_components/permissions-client"
import { pasaxCloud } from "@/lib/pasax-cloud"
import {
  ensureSessionUser,
  getScopedUsers,
  getScopedNodes,
} from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Matriks Hak Akses & Peran Pengguna | Pasax Defense Suite",
  description:
    "Panduan wewenang dan kemampuan operasional antara Administrator, Programmer Aplikasi, dan Server Maintainer di Pasax Suite.",
}

export default async function PermissionsPage() {
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
        { title: "Matriks Hak Akses Peran" },
      ]}
    >
      <PermissionsClient
        currentRole={ctx.role}
        userCount={users.length}
        nodeCount={nodes.length}
      />
    </AdminTemplate>
  )
}
