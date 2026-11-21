import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { LicensesClient } from "./_components/licenses-client"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Kunci Lisensi & API Token | Pasax Defense Suite",
  description: "Kelola token autentikasi agen Sentinel dan Laravel WAF",
}

export default async function LicensesPage() {
  const session = await getServerSession(authOptions)

  const userRole = (session?.user as any)?.role || "Superadmin"
  const userEmail = session?.user?.email || "admin@pasax.id"
  const userName = session?.user?.name || "Roby Kartis (Chief SOC)"

  const [keys, users] = await Promise.all([
    Promise.resolve(pasaxStore.getLicenseKeys()),
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
        { title: "Fleet Management", href: "/dashboard" },
        { title: "Kunci Lisensi & API" },
      ]}
    >
      <LicensesClient
        initialKeys={keys}
        initialUsers={users}
        currentRole={userRole}
      />
    </AdminTemplate>
  )
}
