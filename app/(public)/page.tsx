import type { Metadata } from "next"
import { siteConfig } from "@/config/site"
import { LiveTelemetryTicker } from "@/components/public/live-telemetry-ticker"
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
    <div className="flex flex-col gap-24 pb-20 w-full max-w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* Live Telemetry Status Ticker */}
      <LiveTelemetryTicker />

      {/* 2. Interactive Telemetry & Threat Radar Demo */}
      <TelemetrySection />

      {/* 2.5. VPS Reality Check (Before vs After) */}
      <VpsComparisonSection />

      {/* 3. Triple Defense Architecture */}
      <ArchitectureSection />

      {/* 3.5. Production Workloads & Use Cases */}
      <WorkloadsSection />

      {/* 4. Core Capabilities & Features Grid */}
      <FeaturesSection />

      {/* 4.5. 60-Second Onboarding & VPS Deploy Steps */}
      <DeploySection />

      {/* 5. Benchmark & Legacy Comparison Matrix */}
      <ComparisonSection />

      {/* 6. Official Documentation Portal */}
      <DocsSection />

      {/* 7. Frequently Asked Questions (Accordion) */}
      <FaqSection />

      {/* 8. Bottom High-Energy CTA Banner */}
      <CtaSection />
    </div>
  )
}
