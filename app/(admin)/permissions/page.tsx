import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { PermissionsClient } from "./_components/permissions-client"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Matriks Hak Akses & Peran Pengguna | Pasax Defense Suite",
  description:
    "Panduan wewenang dan kemampuan operasional antara Administrator, Programmer Aplikasi, dan Server Maintainer di Pasax Suite.",
}

export default async function PermissionsPage() {
  const session = await getServerSession(authOptions)

  const userRole = (session?.user as any)?.role || "Admin"
  const userEmail = session?.user?.email || "admin@pasax.id"
  const userName = session?.user?.name || "Administrator Armada"

  const users = pasaxStore.getUsers()
  const nodes = pasaxStore.getNodes()

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
        { title: "Matriks Hak Akses Peran" },
      ]}
    >
      <PermissionsClient
        currentRole={userRole}
        userCount={users.length}
        nodeCount={nodes.length}
      />
    </AdminTemplate>
  )
}
