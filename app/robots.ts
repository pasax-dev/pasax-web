import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs", "/docs/*", "/threats-map", "/privacy", "/terms"],
        disallow: ["/api/*", "/dashboard/*"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
