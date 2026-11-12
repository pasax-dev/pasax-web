import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { SectionBackground } from "@/components/public/section-background"
import { cn } from "@/lib/utils"

export function DocsSection() {
  return (
    <section id="docs" className="relative overflow-hidden scroll-mt-20 py-6">
      <SectionBackground variant="dots" />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3 py-1 font-mono text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)]">
            <BookOpen className="size-3.5 text-main" />
            <span>OFFICIAL DOCUMENTATION PORTAL</span>
          </div>
          <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Dokumentasi Lengkap <span className="text-main">pasak-security-monitor</span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-foreground/80 font-base leading-relaxed">
            Panduan arsitektur keamanan, instalasi Laravel Spatie-compliant 100% Pure PHP,
            konfigurasi hardening web server Nginx/Apache, hingga spesifikasi REST API headless lengkap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          <Link
            href="/docs/getting-started/introduction"
            className="group rounded-base border-2 border-border bg-background p-6 lg:p-7 shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_var(--border)] flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-black text-main">MEMULAI CEPAT</span>
              <h3 className="font-heading text-base font-black text-foreground group-hover:text-main">
                Pengenalan & Instalasi
              </h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Standar Spatie zero NPM dependency, instalasi Composer, dan integrasi Laravel core hooks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono font-bold text-foreground/80 group-hover:text-main">
              <span>3 Panduan</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/docs/core-architecture/threat-detection-engine"
            className="group rounded-base border-2 border-border bg-background p-6 lg:p-7 shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_var(--border)] flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-black text-main">ARSITEKTUR INTI</span>
              <h3 className="font-heading text-base font-black text-foreground group-hover:text-main">
                WAF & Karantina Perangkat
              </h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Zero-Tolerance payload inspection, isolasi penyerang pada NAT/Wi-Fi publik, dan proxy IP resolution.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono font-bold text-foreground/80 group-hover:text-main">
              <span>4 Panduan</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/docs/security-modules/stepped-login-throttling"
            className="group rounded-base border-2 border-border bg-background p-6 lg:p-7 shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_var(--border)] flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-black text-main">MODUL PERTAHANAN</span>
              <h3 className="font-heading text-base font-black text-foreground group-hover:text-main">
                Login Lockout & Webshell
              </h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Stepped brute-force defense (1m-24j), SHA-256 integrity baseline, dan sistem tiket banding.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono font-bold text-foreground/80 group-hover:text-main">
              <span>5 Panduan</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/docs/api-reference/api-overview"
            className="group rounded-base border-2 border-border bg-background p-6 lg:p-7 shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_var(--border)] flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-black text-main">DEVELOPER API</span>
              <h3 className="font-heading text-base font-black text-foreground group-hover:text-main">
                REST API & Web Hardening
              </h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Headless JSON endpoints untuk SPA/Mobile, aturan Nginx WAF siap pakai, dan Artisan CLI.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono font-bold text-foreground/80 group-hover:text-main">
              <span>17 Panduan</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/docs"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "inline-flex items-center gap-2 font-heading font-black shadow-shadow"
            )}
          >
            <span>Jelajahi Seluruh 29 Dokumen pasak-security-monitor</span>
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
