import type { MetadataRoute } from "next"
import { ALL_DOCS, PRODUCTS_CONFIG } from "@/lib/docs-manifest"
import { siteConfig } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tutorial`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/threats-map`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  // Product routes
  const productRoutes: MetadataRoute.Sitemap = Object.keys(PRODUCTS_CONFIG).map(
    (prodKey) => ({
      url: `${baseUrl}/docs/${prodKey}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })
  )

  // Documentation article routes
  const docRoutes: MetadataRoute.Sitemap = ALL_DOCS.map((doc) => ({
    url: `${baseUrl}/docs/${doc.product}/${doc.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...docRoutes]
}
