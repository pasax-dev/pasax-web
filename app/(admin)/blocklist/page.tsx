import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { BlocklistClient } from "./_components/blocklist-client"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { ensureSessionUser, getScopedNodes } from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Crowd Defense & Kernel Blocklist | Pasax Defense Suite",
  description:
    "Daftar IP penyerang yang dicekal di level kernel Linux firewall",
}

export default async function BlocklistPage() {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)

  if (!ctx) {
    redirect("/login")
  }

  const [blocklist, allNodes] = await Promise.all([
    pasaxCloud.fetchBlocklist(),
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
        avatar: "/avatars/admin.jpg",
      }}
      breadcrumbs={[
        { title: "Security Operations", href: "/dashboard" },
        { title: "Crowd Defense Blocklist" },
      ]}
    >
      <BlocklistClient initialBlocklist={blocklist} currentRole={ctx.role} />
    </AdminTemplate>
  )
}
