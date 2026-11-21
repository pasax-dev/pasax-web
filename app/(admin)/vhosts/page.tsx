import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { VHostsClient } from "./_components/vhosts-client"
import { pasaxCloud } from "@/lib/pasax-cloud"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Virtual Hosts & SSL Recon | Pasax Defense Suite",
  description: "Pemindaian virtual host Nginx & Apache dan sertifikat SSL",
}

export default async function VHostsPage() {
  const session = await getServerSession(authOptions)

  const userRole = (session?.user as any)?.role || "Superadmin"
  const userEmail = session?.user?.email || "admin@pasax.id"
  const userName = session?.user?.name || "Roby Kartis (Chief SOC)"

  const nodes = await pasaxCloud.fetchNodes()

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
        { title: "VHost & SSL Recon" },
      ]}
    >
      <VHostsClient
        initialNodes={nodes}
        currentRole={userRole}
      />
    </AdminTemplate>
  )
}
