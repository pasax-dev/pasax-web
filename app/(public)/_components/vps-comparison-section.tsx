import { SectionBackground } from "@/components/public/section-background"
import { VpsBeforeAfter } from "@/components/public/vps-before-after"

export function VpsComparisonSection() {
  return (
    <section id="vps-comparison" className="relative overflow-hidden scroll-mt-20 py-6">
      <SectionBackground variant="dots" />
      <VpsBeforeAfter />
    </section>
  )
}
