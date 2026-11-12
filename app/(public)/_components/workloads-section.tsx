import { SectionBackground } from "@/components/public/section-background"
import { VpsUseCases } from "@/components/public/vps-use-cases"

export function WorkloadsSection() {
  return (
    <section id="workloads" className="relative overflow-hidden scroll-mt-20 py-6">
      <SectionBackground variant="stripes" />
      <VpsUseCases />
    </section>
  )
}
