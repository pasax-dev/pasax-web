import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { PricingManagementClient } from "./_components/pricing-management-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Model Bisnis & Manajemen Paket Harga | Pasax Superadmin",
  description:
    "Kelola katalog harga bundling per VPS, fitur perlindungan Laravel, kuota node, dan paket khusus Perusahaan serta Pemerintahan.",
}

export default async function AdminPricingPage() {
  const session = await getServerSession(authOptions)

  const userRole = (session?.user as any)?.role || "Superadmin"
  const userEmail = session?.user?.email || "admin@pasax.id"
  const userName = session?.user?.name || "Roby Kartis (Chief SOC)"

  const plans = await pasaxCloud.fetchPricingPlans(true)

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
        { title: "Paket Harga & Model Bisnis" },
      ]}
    >
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <PricingManagementClient initialPlans={plans} />
      </div>
    </AdminTemplate>
  )
}
