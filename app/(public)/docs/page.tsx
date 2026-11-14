import Link from "next/link"
import {
  ShieldAlert,
  ArrowRight,
  Rocket,
  Cpu,
  Shield,
  Terminal,
  Command,
  Server,
  Puzzle,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Layers,
} from "lucide-react"
import { PRODUCTS_CONFIG, DOCS_MANIFEST } from "@/lib/docs-manifest"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Dokumentasi Resmi — pasak-secure-monitor & Pasak Suite",
  description:
    "Portal dokumentasi resmi ekosistem Pasak Suite: pasak-secure-monitor (Laravel WAF), pasak-sentinel (Go daemon), dan cloud control plane.",
}

const iconMap: Record<string, React.ElementType> = {
  Rocket,
  Cpu,
  Shield,
  Terminal,
  Command,
  Server,
  Puzzle,
  HelpCircle,
  Layers,
}

export default function DocsHomePage() {
  return (
    <div className="w-full max-w-full flex-1 space-y-10 px-4 py-8 sm:px-8 lg:px-10">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-base border-2 border-border bg-secondary-background p-6 shadow-[4px_4px_0px_0px_var(--border)] sm:p-8">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-2 border-border bg-main font-mono text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
            >
              pasak-secure-monitor
            </Badge>
            <Badge
              variant="outline"
              className="bg-background font-mono text-xs font-bold"
            >
              SPATIE-COMPLIANT WAF
            </Badge>
            <Badge
              variant="outline"
              className="bg-background font-mono text-xs font-bold"
            >
              GO KERNEL DAEMON
            </Badge>
          </div>

          <h1 className="font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Portal Dokumentasi Resmi <br className="hidden sm:inline" />
            <span className="text-main underline decoration-4 underline-offset-8">
              pasak-secure-monitor
            </span>
          </h1>

          <p className="max-w-4xl text-sm leading-relaxed font-normal text-foreground/80 sm:text-base">
            Pusat dokumentasi dan referensi arsitektur keamanan server terpadu.
            Pelajari implementasi WAF mandiri murni PHP untuk Laravel, daemon
            kernel Go dengan penurunan paket nftables instan, serta integrasi
            pemantauan cloud terpusat.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/docs/pasak-secure-monitor"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2 font-heading text-sm font-black text-main-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--border)]"
            >
              <span>Mulai: Security Monitor</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/docs/pasak-sentinel"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-background px-4 py-2 font-heading text-sm font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--border)]"
            >
              <Terminal className="size-4 text-main" />
              <span>Panduan Sentinel Daemon</span>
            </Link>
            <Link
              href="/docs/core"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-background px-4 py-2 font-heading text-sm font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--border)]"
            >
              <Layers className="size-4 text-main" />
              <span>Suite Core Trinity</span>
            </Link>
          </div>
        </div>

        {/* Tactical Decorative Watermark */}
        <ShieldAlert className="pointer-events-none absolute -right-10 -bottom-10 size-64 stroke-[0.8] text-foreground opacity-10" />
      </section>

      {/* 3 Main Product Documentation Portals */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 stroke-[2.5] text-main" />
          <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
            Dokumentasi Berdasarkan Komponen Produk
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Card 1: pasak-secure-monitor */}
          <div className="flex flex-col justify-between space-y-3 rounded-base border-2 border-border bg-background p-5 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="bg-main font-mono text-[10px] font-black text-main-foreground"
                >
                  LARAVEL CORE
                </Badge>
                <span className="font-mono text-xs text-foreground/60">
                  29 Panduan
                </span>
              </div>
              <h3 className="font-heading text-base font-black text-foreground">
                pasak-secure-monitor
              </h3>
              <p className="text-xs leading-relaxed text-foreground/75">
                WAF mandiri 100% PHP murni untuk Laravel 10–13, karantina
                perangkat pada NAT bersama, stepped login lockout, dan pemindai
                webshell.
              </p>
            </div>
            <Link
              href="/docs/pasak-secure-monitor"
              className="inline-flex w-full items-center justify-between border-t border-border/40 pt-3 font-mono text-xs font-bold text-main hover:underline"
            >
              <span>Buka Dokumentasi WAF</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Card 2: pasak-sentinel */}
          <div className="flex flex-col justify-between space-y-3 rounded-base border-2 border-border bg-background p-5 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="bg-sky-500 font-mono text-[10px] font-black text-white"
                >
                  GO 1.24 DAEMON
                </Badge>
                <span className="font-mono text-xs text-foreground/60">
                  8 Panduan
                </span>
              </div>
              <h3 className="font-heading text-base font-black text-foreground">
                pasak-sentinel
              </h3>
              <p className="text-xs leading-relaxed text-foreground/75">
                Daemon host Linux single-binary (&lt;25MB RAM). Penurunan paket
                kernel via nftables, inotify FIM auto-lockdown, dan IPC socket
                lokal.
              </p>
            </div>
            <Link
              href="/docs/pasak-sentinel"
              className="inline-flex w-full items-center justify-between border-t border-border/40 pt-3 font-mono text-xs font-bold text-main hover:underline"
            >
              <span>Buka Dokumentasi Daemon</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Card 3: Pasak Suite Core */}
          <div className="flex flex-col justify-between space-y-3 rounded-base border-2 border-border bg-background p-5 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="bg-secondary-background font-mono text-[10px] font-black"
                >
                  PLATFORM CORE
                </Badge>
                <span className="font-mono text-xs text-foreground/60">
                  5 Panduan
                </span>
              </div>
              <h3 className="font-heading text-base font-black text-foreground">
                Pasak Suite Core
              </h3>
              <p className="text-xs leading-relaxed text-foreground/75">
                Arsitektur pertahanan berlapis tiga terintegrasi (Trinity
                Defense), konsol SOC Dashboard, dan Hono Control Plane dengan
                Neon PostgreSQL.
              </p>
            </div>
            <Link
              href="/docs/core"
              className="inline-flex w-full items-center justify-between border-t border-border/40 pt-3 font-mono text-xs font-bold text-main hover:underline"
            >
              <span>Buka Panduan Suite</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Steps Quick Start Guide */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Rocket className="size-5 stroke-[2.5] text-main" />
          <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
            Instalasi Cepat pasak-secure-monitor
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 rounded-base border-2 border-border bg-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black text-main">
                LANGKAH 01
              </span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </div>
            <h3 className="font-heading text-sm font-black text-foreground">
              Pasang via Composer
            </h3>
            <p className="text-xs text-foreground/70">
              Unduh paket resmi dari Packagist ke aplikasi Laravel Anda.
            </p>
            <pre className="overflow-x-auto rounded-sm border border-border bg-secondary-background p-2.5 font-mono text-[11px] text-foreground">
              composer require pasak-dev/secure-monitor
            </pre>
          </div>

          <div className="space-y-2 rounded-base border-2 border-border bg-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black text-main">
                LANGKAH 02
              </span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </div>
            <h3 className="font-heading text-sm font-black text-foreground">
              Jalankan Wizard Pasak
            </h3>
            <p className="text-xs text-foreground/70">
              Publikasikan konfigurasi, template server, dan auto-hook
              middleware.
            </p>
            <pre className="overflow-x-auto rounded-sm border border-border bg-secondary-background p-2.5 font-mono text-[11px] text-foreground">
              php artisan pasak:install
            </pre>
          </div>

          <div className="space-y-2 rounded-base border-2 border-border bg-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black text-main">
                LANGKAH 03
              </span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </div>
            <h3 className="font-heading text-sm font-black text-foreground">
              Migrasi Basis Data
            </h3>
            <p className="text-xs text-foreground/70">
              Siapkan tabel log ancaman, karantina perangkat, dan tiket banding.
            </p>
            <pre className="overflow-x-auto rounded-sm border border-border bg-secondary-background p-2.5 font-mono text-[11px] text-foreground">
              php artisan migrate
            </pre>
          </div>
        </div>
      </section>

      {/* Directory of All Document Categories for pasak-secure-monitor */}
      <section className="space-y-6 pt-4">
        <div>
          <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
            Katalog Modul pasak-secure-monitor
          </h2>
          <p className="text-xs font-medium text-foreground/70 sm:text-sm">
            Jelajahi panduan teknis mendalam untuk setiap modul pertahanan
            aplikasi:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {DOCS_MANIFEST.map((cat) => {
            const Icon = iconMap[cat.icon] || BookOpen
            return (
              <div
                key={cat.slug}
                className="space-y-3 rounded-base border-2 border-border bg-background p-5 shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-main shadow-[2px_2px_0px_0px_var(--border)]">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="font-heading text-base font-black text-foreground">
                      {cat.title}
                    </h3>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {cat.items.length} artikel
                  </Badge>
                </div>

                <ul className="space-y-1.5 border-t border-border/40 pt-3">
                  {cat.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/pasak-secure-monitor/${item.slug}`}
                        className="group flex items-center justify-between py-1 text-xs text-foreground/80 hover:text-foreground"
                      >
                        <span className="line-clamp-1 font-medium underline-offset-2 group-hover:text-main group-hover:underline">
                          {item.title}
                        </span>
                        <ArrowRight className="size-3 text-foreground/30 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
