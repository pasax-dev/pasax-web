import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminTemplate } from "@/components/admin-template"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { PricingManagementClient } from "./_components/pricing-management-client"
import { ensureSessionUser, getScopedNodes } from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Model Bisnis & Manajemen Paket Harga | Pasax Superadmin",
  description:
    "Kelola katalog harga bundling per VPS, fitur perlindungan Laravel, kuota node, dan paket khusus Perusahaan serta Pemerintahan.",
}

export default async function AdminPricingPage() {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)

  if (!ctx) {
    redirect("/login")
  }

  const [plans, allNodes] = await Promise.all([
    pasaxCloud.fetchPricingPlans(true),
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
