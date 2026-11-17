import type { Metadata } from "next"
import { siteConfig } from "@/config/site"
import { Figure } from "@/components/fumadocs/figure"
import {
  HeroSection,
  TelemetrySection,
  VpsComparisonSection,
  ArchitectureSection,
  WorkloadsSection,
  FeaturesSection,
  DeploySection,
  ComparisonSection,
  DocsSection,
  FaqSection,
  CtaSection,
} from "./_components"
import { LiveTelemetryTicker } from "@/components/public/live-telemetry-ticker"

export const metadata: Metadata = {
  title: siteConfig.tagline,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 916,
        height: 272,
        alt: `${siteConfig.name} Logo Banner`,
      },
      {
        url: siteConfig.favicon,
        width: 505,
        height: 494,
        alt: `${siteConfig.name} Security Shield Icon`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export default function PublicLandingPage() {
  return (
    <div className="flex w-full max-w-full flex-col">
      {/* 1. Hero Section (Fumadocs 2-column grid + Glitch + Command + Stage) */}
      <HeroSection />

      {/* Live Telemetry Status Ticker */}
      <LiveTelemetryTicker />

      {/* 2. Interactive Telemetry & Threat Radar Demo */}
      <Figure id="telemetry" status="02: interactive telemetry & radar active">
        <TelemetrySection />
      </Figure>

      {/* 3. VPS Reality Check (Before vs After) */}
      <Figure id="vps-comparison" status="03: unmanaged vs armored vps">
        <VpsComparisonSection />
      </Figure>

      {/* 4. Triple Defense Architecture */}
      <Figure id="architecture" status="04: 3 defense layers active">
        <ArchitectureSection />
      </Figure>

      {/* 5. Production Workloads & Use Cases */}
      <Figure id="workloads" status="05: production workloads">
        <WorkloadsSection />
      </Figure>

      {/* 6. Core Capabilities & Bento Grid powered by Illos */}
      <Figure id="features" status="06: six defense vectors armed">
        <FeaturesSection />
      </Figure>

      {/* 7. 60-Second Onboarding & VPS Deploy Steps */}
      <Figure id="deploy" status="07: 60-second deploy">
        <DeploySection />
      </Figure>

      {/* 8. Benchmark & Legacy Comparison Matrix */}
      <Figure id="comparison" status="08: benchmark matrix">
        <ComparisonSection />
      </Figure>

      {/* 9. Official Documentation Portal */}
      <Figure id="docs" status="09: documentation index">
        <DocsSection />
      </Figure>

      {/* 10. Frequently Asked Questions */}
      <Figure id="faq" status="10: technical faq">
        <FaqSection />
      </Figure>

      {/* 11. Bottom High-Energy CTA Banner */}
      <Figure id="cta" status="11: get started with sentinel">
        <CtaSection />
      </Figure>
    </div>
  )
}
