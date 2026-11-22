import { pasaxCloud } from "@/lib/pasax-cloud"
import { PricingManagementClient } from "./_components/pricing-management-client"

export const metadata = {
  title: "Model Bisnis & Manajemen Paket Harga | Pasax Superadmin",
  description:
    "Kelola katalog harga bundling per VPS, fitur perlindungan Laravel, kuota node, dan paket khusus Perusahaan serta Pemerintahan.",
}

export default async function AdminPricingPage() {
  const plans = await pasaxCloud.fetchPricingPlans(true)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <PricingManagementClient initialPlans={plans} />
    </div>
  )
}
