import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { SectionBackground } from "@/components/public/section-background"

export function DocsSection() {
  const docCards = [
    {
      href: "/docs/getting-started/introduction",
      tag: "MEMULAI CEPAT",
      tagColor: "border-sky-500/30 bg-sky-500/10 text-sky-500",
      title: "Pengenalan & Instalasi",
      desc: "Standar Spatie zero NPM dependency, instalasi Composer, dan integrasi Laravel core hooks.",
      guides: "3 Panduan",
    },
    {
      href: "/docs/core-architecture/threat-detection-engine",
      tag: "ARSITEKTUR INTI",
      tagColor: "border-purple-500/30 bg-purple-500/10 text-purple-500",
      title: "WAF & Karantina Perangkat",
      desc: "Zero-Tolerance payload inspection, isolasi penyerang pada NAT/Wi-Fi publik, dan proxy IP resolution.",
      guides: "4 Panduan",
    },
    {
      href: "/docs/security-modules/stepped-login-throttling",
      tag: "MODUL PERTAHANAN",
      tagColor: "border-amber-500/30 bg-amber-500/10 text-amber-500",
      title: "Login Lockout & Webshell",
      desc: "Stepped brute-force defense (1m-24j), SHA-256 integrity baseline, dan sistem tiket banding.",
      guides: "5 Panduan",
    },
    {
      href: "/docs/api-reference/api-overview",
      tag: "DEVELOPER API",
      tagColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
      title: "REST API & Web Hardening",
      desc: "Headless JSON endpoints untuk SPA/Mobile, aturan Nginx WAF siap pakai, dan Artisan CLI.",
      guides: "17 Panduan",
    },
  ]

  return (
    <div className="relative overflow-hidden py-12">
      <SectionBackground variant="dots" />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
            <BookOpen className="size-3.5 text-sky-500" />
            <span>OFFICIAL DOCUMENTATION PORTAL</span>
          </div>
          <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-5xl">
            Dokumentasi Lengkap{" "}
            <span className="text-sky-500">pasax-secure-monitor</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            Panduan arsitektur keamanan, instalasi Laravel Spatie-compliant 100%
            Pure PHP, konfigurasi hardening web server Nginx/Apache, hingga
            spesifikasi REST API headless lengkap.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:gap-8">
          {docCards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-sky-500/30 hover:bg-card/70 lg:p-7"
            >
              <div className="space-y-3">
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${card.tagColor}`}
                >
                  {card.tag}
                </span>
                <h3 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-sky-500">
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {card.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4 font-sans text-xs">
                <span className="font-mono text-muted-foreground">
                  {card.guides}
                </span>
                <span className="flex items-center gap-1 font-medium text-sky-500 transition-transform group-hover:translate-x-1">
                  <span>Baca</span>
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
