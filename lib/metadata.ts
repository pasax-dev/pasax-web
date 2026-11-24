import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pasax.web.id"

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    title: override.title ?? `${siteConfig.name} — ${siteConfig.tagline}`,
    description: override.description ?? siteConfig.description,
    openGraph: {
      title: override.title ?? `${siteConfig.name} — ${siteConfig.tagline}`,
      description: override.description ?? siteConfig.description,
      url: baseUrl,
      images: "/banner.png",
      siteName: siteConfig.name,
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: siteConfig.author.handle,
      title: override.title ?? `${siteConfig.name} — ${siteConfig.tagline}`,
      description: override.description ?? siteConfig.description,
      images: "/banner.png",
      ...override.twitter,
    },
  }
}
