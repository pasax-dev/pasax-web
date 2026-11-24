import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { LicensesClient } from "./_components/licenses-client"
import { pasaxCloud } from "@/lib/pasax-cloud"
import {
  ensureSessionUser,
  getScopedLicenseKeys,
  getScopedUsers,
  getScopedNodes,
} from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Kunci Lisensi & API Token | Pasax Defense Suite",
  description: "Kelola token autentikasi agen Sentinel dan Laravel WAF",
}

export default async function LicensesPage() {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)

  if (!ctx) {
    redirect("/login")
  }

  const allNodes = await pasaxCloud.fetchNodes()
  const nodes = getScopedNodes(session, allNodes)
  const keys = getScopedLicenseKeys(session)
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
        { title: "Fleet Management", href: "/dashboard" },
        { title: "Kunci Lisensi & API" },
      ]}
    >
      <LicensesClient
        initialKeys={keys}
        initialUsers={users}
        currentRole={ctx.role}
      />
    </AdminTemplate>
  )
}
