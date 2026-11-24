import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { ensureSessionUser, getScopedNodes } from "@/lib/tenant-scope"
import { TerminalClient } from "./_components/terminal-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Web Terminal VPS (Xterm.js) | Pasax Defense Suite",
  description:
    "Akses shell SSH interaktif langsung ke server VPS Linux Anda melalui browser dengan integrasi Xterm.js",
}

export default async function TerminalPage({
  searchParams,
}: {
  searchParams: Promise<{ nodeId?: string }>
}) {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)

  if (!ctx) {
    redirect("/login")
  }

  const resolvedParams = await searchParams
  const allNodes = await pasaxCloud.fetchNodes()
  const nodes = getScopedNodes(session, allNodes)
  const workspaces = nodes.slice(0, 3).map((n) => ({
    name: n.hostname,
    url: `/terminal?nodeId=${encodeURIComponent(n.node_id)}`,
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
        { title: "Web Terminal (SSH)" },
      ]}
    >
      <TerminalClient
        nodes={nodes}
        initialNodeId={resolvedParams?.nodeId}
        currentRole={ctx.role}
        currentEmail={ctx.email}
        isVercelCloud={process.env.VERCEL === "1"}
      />
    </AdminTemplate>
  )
}
