import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { VHostsClient } from "./_components/vhosts-client"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { ensureSessionUser, getScopedNodes } from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Virtual Hosts & SSL Recon | Pasax Defense Suite",
  description: "Pemindaian virtual host Nginx & Apache dan sertifikat SSL",
}

export default async function VHostsPage() {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)

  if (!ctx) {
    redirect("/login")
  }

  const allNodes = await pasaxCloud.fetchNodes()
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
        { title: "Security Operations", href: "/dashboard" },
        { title: "VHost & SSL Recon" },
      ]}
    >
      <VHostsClient initialNodes={nodes} currentRole={ctx.role} />
    </AdminTemplate>
  )
}
