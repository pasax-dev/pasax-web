import { SectionBackground } from "@/components/public/section-background"
import { VpsBeforeAfter } from "@/components/public/vps-before-after"

export function VpsComparisonSection() {
  return (
    <div className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <SectionBackground variant="dots" />
      <VpsBeforeAfter />
    </div>
  )
}
