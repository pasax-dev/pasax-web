import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { BlocklistClient } from "./_components/blocklist-client"
import { pasaxCloud } from "@/lib/pasax-cloud"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Crowd Defense & Kernel Blocklist | Pasax Defense Suite",
  description: "Daftar IP penyerang yang dicekal di level kernel Linux firewall",
}

export default async function BlocklistPage() {
  const session = await getServerSession(authOptions)

  const userRole = (session?.user as any)?.role || "Superadmin"
  const userEmail = session?.user?.email || "admin@pasax.id"
  const userName = session?.user?.name || "Roby Kartis (Chief SOC)"

  const blocklist = await pasaxCloud.fetchBlocklist()

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
        { title: "Crowd Defense Blocklist" },
      ]}
    >
      <BlocklistClient
        initialBlocklist={blocklist}
        currentRole={userRole}
      />
    </AdminTemplate>
  )
}
