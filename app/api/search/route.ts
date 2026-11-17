import { createSearchAPI } from "fumadocs-core/search/server"
import { ALL_DOCS, PRODUCTS_CONFIG } from "@/lib/docs-manifest"

// Build search indexes from docs & app pages
const docIndexes = ALL_DOCS.map((doc) => {
  const url =
    doc.product === "core"
      ? `/docs/core/${doc.slug}`
      : `/docs/${doc.product}/${doc.slug}`
  const prodName = PRODUCTS_CONFIG[doc.product]?.name || doc.product

  return {
    id: url,
    title: doc.title,
    description: doc.description,
    url,
    content: `${doc.title} ${doc.description} ${doc.category} ${prodName} ${doc.slug}`,
    breadcrumbs: [prodName, doc.category],
    tag: doc.product,
  }
})

// Dedicated product documentation overviews
const productRootIndexes = Object.entries(PRODUCTS_CONFIG).map(
  ([key, config]) => ({
    id: `/docs/${key}`,
    title: `Dokumentasi ${config.name}`,
    description: config.description,
    url: `/docs/${key}`,
    content: `${config.name} ${config.badge} ${config.description} panduan dokumentasi overview`,
    breadcrumbs: [config.name, "Overview"],
    tag: key,
  })
)

// Platform-level interactive destinations
const platformPages = [
  {
    id: "/threats-map",
    title: "Threat Map 3D Live — Radar Serangan Global",
    description:
      "Visualisasi serangan siber real-time interaktif berbasis Three.js dengan live telemetry radar.",
    url: "/threats-map",
    content:
      "Threat Map 3D Live Radar Serangan Global visualisasi globe cyber defense telemetry live",
    breadcrumbs: ["Platform", "3D Radar"],
    tag: "platform",
  },
  {
    id: "/dashboard",
    title: "SOC Operations Console & Fleet Telemetry",
    description:
      "Konsol sentral pemantauan status armada server VPS, insiden keamanan, dan daemon Sentinel.",
    url: "/dashboard",
    content:
      "SOC Operations Console Dashboard armada VPS Sentinel telemetry cluster monitoring",
    breadcrumbs: ["Platform", "SOC Console"],
    tag: "platform",
  },
  {
    id: "/login",
    title: "Login Konsol SOC Operator",
    description:
      "Akses masuk ke konsol pertahanan siber Pasax Suite dengan autentikasi mTLS / NextAuth.",
    url: "/login",
    content:
      "Login Masuk Operator Konsol SOC autentikasi kredensial NextAuth akun operator",
    breadcrumbs: ["Akses", "Autentikasi"],
    tag: "auth",
  },
  {
    id: "/register",
    title: "Registrasi Operator Baru",
    description:
      "Daftarkan instansi atau operator Anda untuk memonitor kluster server Pasax.",
    url: "/register",
    content: "Register Pendaftaran Registrasi akun operator instansi baru",
    breadcrumbs: ["Akses", "Pendaftaran"],
    tag: "auth",
  },
  {
    id: "/#features",
    title: "Fitur Trinity Defense Mesh",
    description:
      "Arsitektur perlindungan 3 lapis: PHP WAF, Go Sentinel Daemon, Cloud SOC Console.",
    url: "/#features",
    content:
      "Fitur Trinity Defense Mesh arsitektur perlindungan 3 lapis Laravel Go Sentinel",
    breadcrumbs: ["Landing Page", "Fitur"],
    tag: "landing",
  },
  {
    id: "/#comparison",
    title: "Benchmark & Perbandingan Keamanan",
    description:
      "Perbandingan latensi (0.04ms) dan efisiensi memori Pasax vs WAF tradisional.",
    url: "/#comparison",
    content:
      "Benchmark Perbandingan Keamanan latensi efisiensi memori Pasax vs WAF Cloudflare ModSecurity",
    breadcrumbs: ["Landing Page", "Benchmark"],
    tag: "landing",
  },
  {
    id: "/#faq",
    title: "FAQ & Tanya Jawab Teknis",
    description:
      "Pertanyaan umum seputar instalasi VPS, kompatibilitas Laravel 10–13, dan isolasi kernel.",
    url: "/#faq",
    content:
      "FAQ Tanya Jawab Teknis instalasi VPS kompatibilitas Laravel isolasi kernel",
    breadcrumbs: ["Landing Page", "FAQ"],
    tag: "landing",
  },
]

export const { GET } = createSearchAPI("simple", {
  indexes: [...docIndexes, ...productRootIndexes, ...platformPages],
})
