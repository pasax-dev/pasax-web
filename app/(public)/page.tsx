import type { Metadata } from "next"
import { asMarkdown } from "fumadocs-core/server"
import { createMetadata } from "@/lib/metadata"
import { Hero } from "./_landing/sections/hero"
import { Style } from "./_landing/sections/style"
import { Write } from "./_landing/sections/write"
import { Automate } from "./_landing/sections/automate"
import { Parts } from "./_landing/sections/parts"
import { Integrations } from "./_landing/sections/integrations"
import { Cli } from "./_landing/sections/cli"
import { Feedback, Wires } from "./_landing/sections/feedback"
import { Proof } from "./_landing/sections/proof"
import { Start } from "./_landing/sections/start"
import { summary } from "./_landing/content"
import { PricingSection } from "./_components/pricing-section"

export const metadata: Metadata = createMetadata({
  description: summary,
  alternates: {
    types: { "text/markdown": "/index.md" },
  },
})

export default function Page() {
  asMarkdown()

  return (
    <>
      <Hero />
      <Style />
      <Write />
      <Automate />
      <Parts />
      <Integrations />
      <Cli />
      <Wires>
        <Proof />
        <Feedback />
      </Wires>
      <PricingSection />
      <Start />
    </>
  )
}
