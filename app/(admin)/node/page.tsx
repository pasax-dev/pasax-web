import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { NodesManagementClient } from "./_components/nodes-management-client"
import { pasaxStore } from "@/lib/store"
import { pasaxCloud } from "@/lib/pasax-cloud"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Daftar VPS & Node Sentinel | Pasax Defense Suite",
  description:
    "Manajemen dan pendaftaran server VPS Linux dalam armada pertahanan cyber Pasax",
}

export default async function NodePage() {
  const session = await getServerSession(authOptions)

  const userRole = (session?.user as any)?.role || "Superadmin"
  const userEmail = session?.user?.email || "admin@pasax.id"
  const userName = session?.user?.name || "Roby Kartis (Chief SOC)"

  const [nodes, users] = await Promise.all([
    pasaxCloud.fetchNodes(),
    Promise.resolve(pasaxStore.getUsers()),
  ])

  return (
    <AdminTemplate
      role={userRole}
      user={{
        name: userName,
        email: userEmail,
        role: userRole,
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
        currentRole={userRole}
      />
    </AdminTemplate>
  )
}
