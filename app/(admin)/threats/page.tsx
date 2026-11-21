import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { ThreatsClient } from "./_components/threats-client"
import { pasaxCloud } from "@/lib/pasax-cloud"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Insiden Serangan & Forensik | Pasax Defense Suite",
  description: "Audit telemetri forensik dan mitigasi serangan cyber waktu-nyata",
}

export default async function ThreatsPage() {
  const session = await getServerSession(authOptions)

  const userRole = (session?.user as any)?.role || "Superadmin"
  const userEmail = session?.user?.email || "admin@pasax.id"
  const userName = session?.user?.name || "Roby Kartis (Chief SOC)"

  const [threats, nodes] = await Promise.all([
    pasaxCloud.fetchThreats(100),
    pasaxCloud.fetchNodes(),
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
        { title: "Insiden Serangan" },
      ]}
    >
      <ThreatsClient
        initialThreats={threats}
        initialNodes={nodes}
        currentRole={userRole}
      />
    </AdminTemplate>
  )
}
