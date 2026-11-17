import { SectionBackground } from "@/components/public/section-background"
import { VpsUseCases } from "@/components/public/vps-use-cases"

export function WorkloadsSection() {
  return (
    <div className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <SectionBackground variant="grid" />
      <VpsUseCases />
    </div>
  )
}
