import { SectionBackground } from "@/components/public/section-background"
import { VpsDeploySteps } from "@/components/public/vps-deploy-steps"

export function DeploySection() {
  return (
    <section id="deploy" className="relative overflow-hidden scroll-mt-20 py-6">
      <SectionBackground variant="circuit" />
      <VpsDeploySteps />
    </section>
  )
}
