import { SectionBackground } from "@/components/public/section-background"
import { VpsDeploySteps } from "@/components/public/vps-deploy-steps"

export function DeploySection() {
  return (
    <div className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <SectionBackground variant="circuit" />
      <VpsDeploySteps />
    </div>
  )
}
