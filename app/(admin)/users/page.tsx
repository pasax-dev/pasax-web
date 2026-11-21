import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { UsersManagementClient } from "./_components/users-management-client"
import { pasaxStore } from "@/lib/store"
import { pasaxCloud } from "@/lib/pasax-cloud"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Manajemen Pengguna & Pemegang VPS | Pasax Defense Suite",
  description:
    "Kelola hak akses operator, penugasan VPS armada, dan kuota perlindungan cyber",
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  const userRole = (session?.user as any)?.role || "Superadmin"
  const userEmail = session?.user?.email || "admin@pasax.id"
  const userName = session?.user?.name || "Roby Kartis (Chief SOC)"

  const [users, nodes] = await Promise.all([
    Promise.resolve(pasaxStore.getUsers()),
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
        { title: "Fleet Management", href: "/dashboard" },
        { title: "Pemegang VPS & Pengguna" },
      ]}
    >
      <UsersManagementClient
        initialUsers={users}
        initialNodes={nodes}
        currentRole={userRole}
      />
    </AdminTemplate>
  )
}
