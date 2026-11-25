import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["ssh2", "cpu-features"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  outputFileTracingExcludes: {
    "*": [
      "./public/downloads/**",
      "./public/showcases/**",
      "./releases/**",
      "./.agents/**",
      "./skills/**",
      "./scripts/**",
      "./playwright-report/**",
      "./test-results/**",
    ],
  },
  async headers() {
    return [
      {
        source: "/showcases/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/downloads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ]
  },
}

export default nextConfig
