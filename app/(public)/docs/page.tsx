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
  BookOpen,
  Layers,
} from "lucide-react"
import { DOCS_MANIFEST } from "@/lib/docs-manifest"

export const metadata = {
  title: "Dokumentasi Resmi — pasax-secure-monitor & Pasax Suite",
  description:
    "Portal dokumentasi resmi ekosistem Pasax Suite: pasax-secure-monitor (Laravel WAF), pasax-sentinel (Go daemon), dan cloud control plane.",
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
    <div className="w-full max-w-full flex-1 space-y-12 px-4 py-8 sm:px-8 lg:px-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-base border-2 border-border bg-secondary-background p-6 shadow-[6px_6px_0px_0px_var(--border)] sm:p-10">
        {/* Neobrutalist Corner Decorative Stamps */}
        <div className="pointer-events-none absolute -top-4 -right-4 font-mono text-6xl font-black text-foreground/5 select-none">
          ✦
        </div>
        <div className="pointer-events-none absolute -bottom-6 -left-4 font-mono text-7xl font-black text-foreground/5 select-none">
          ✱
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="-rotate-1 rounded-base border-2 border-border bg-amber-300 px-3 py-1 font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)]">
              OFFICIAL DOCS PORTAL
            </span>
            <span className="rounded-base border-2 border-border bg-background px-2.5 py-0.5 font-mono text-[11px] font-bold text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)]">
              SPATIE-COMPLIANT WAF
            </span>
            <span className="rounded-base border-2 border-border bg-background px-2.5 py-0.5 font-mono text-[11px] font-bold text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)]">
              GO KERNEL DAEMON
            </span>
          </div>

          <h1 className="font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Portal Dokumentasi Resmi <br className="hidden sm:inline" />
            <span className="text-foreground underline decoration-main decoration-6 underline-offset-8">
              pasax-secure-monitor
            </span>
          </h1>

          <p className="max-w-4xl text-sm leading-relaxed font-medium text-foreground sm:text-base lg:text-lg">
            Pusat dokumentasi dan referensi arsitektur keamanan server terpadu.
            Pelajari implementasi WAF mandiri murni PHP untuk Laravel, daemon
            kernel Go dengan penurunan paket nftables instan, serta integrasi
            pemantauan cloud terpusat.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/docs/pasax-secure-monitor"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-5 py-2.5 font-heading text-sm font-black text-black shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <span>Mulai: Security Monitor</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/docs/pasax-sentinel"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-5 py-2.5 font-heading text-sm font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <Terminal className="size-4 text-foreground" />
              <span>Panduan Sentinel Daemon</span>
            </Link>
            <Link
              href="/docs/core"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-5 py-2.5 font-heading text-sm font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <Layers className="size-4 text-foreground" />
              <span>Suite Core Trinity</span>
            </Link>
          </div>
        </div>

        {/* Tactical Decorative Watermark */}
        <ShieldAlert className="pointer-events-none absolute -right-10 -bottom-10 size-64 stroke-[0.8] text-foreground opacity-10" />
      </section>

      {/* 3 Main Product Documentation Portals */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-base border-2 border-border bg-main text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
            <BookOpen className="size-4.5 stroke-[2.5]" />
          </div>
          <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
            Dokumentasi Berdasarkan Komponen Produk
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1: pasax-secure-monitor */}
          <div className="group flex flex-col justify-between space-y-4 rounded-base border-2 border-border bg-card p-6 shadow-[5px_5px_0px_0px_var(--border)] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--border)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-base border-2 border-border bg-amber-300 px-2.5 py-0.5 font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                  LARAVEL CORE
                </span>
                <span className="font-mono text-xs font-bold text-foreground">
                  29 Panduan
                </span>
              </div>
              <h3 className="font-heading text-lg font-black text-foreground underline-offset-4 transition-all group-hover:underline group-hover:decoration-main group-hover:decoration-4">
                pasax-secure-monitor
              </h3>
              <p className="text-xs leading-relaxed font-medium text-foreground">
                WAF mandiri 100% PHP murni untuk Laravel 10–13, karantina
                perangkat pada NAT bersama, stepped login lockout, dan pemindai
                webshell berkecepatan tinggi.
              </p>
            </div>
            <Link
              href="/docs/pasax-secure-monitor"
              className="inline-flex w-full items-center justify-between border-t-2 border-border pt-4 font-mono text-xs font-black text-foreground transition-all group-hover:underline group-hover:decoration-main group-hover:decoration-2"
            >
              <span>Buka Dokumentasi WAF</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Card 2: pasax-sentinel */}
          <div className="group flex flex-col justify-between space-y-4 rounded-base border-2 border-border bg-card p-6 shadow-[5px_5px_0px_0px_var(--border)] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--border)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-base border-2 border-border bg-sky-300 px-2.5 py-0.5 font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                  GO 1.24 DAEMON
                </span>
                <span className="font-mono text-xs font-bold text-foreground">
                  8 Panduan
                </span>
              </div>
              <h3 className="font-heading text-lg font-black text-foreground underline-offset-4 transition-all group-hover:underline group-hover:decoration-main group-hover:decoration-4">
                pasax-sentinel
              </h3>
              <p className="text-xs leading-relaxed font-medium text-foreground">
                Daemon host Linux single-binary (&lt;20MB RAM). Penurunan paket
                kernel via nftables sub-0.2ms, inotify FIM auto-lockdown ke
                0600, dan IPC socket lokal.
              </p>
            </div>
            <Link
              href="/docs/pasax-sentinel"
              className="inline-flex w-full items-center justify-between border-t-2 border-border pt-4 font-mono text-xs font-black text-foreground transition-all group-hover:underline group-hover:decoration-main group-hover:decoration-2"
            >
              <span>Buka Dokumentasi Daemon</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Card 3: Pasax Suite Core */}
          <div className="group flex flex-col justify-between space-y-4 rounded-base border-2 border-border bg-card p-6 shadow-[5px_5px_0px_0px_var(--border)] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--border)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-base border-2 border-border bg-emerald-300 px-2.5 py-0.5 font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                  PLATFORM CORE
                </span>
                <span className="font-mono text-xs font-bold text-foreground">
                  5 Panduan
                </span>
              </div>
              <h3 className="font-heading text-lg font-black text-foreground underline-offset-4 transition-all group-hover:underline group-hover:decoration-main group-hover:decoration-4">
                Pasax Suite Core
              </h3>
              <p className="text-xs leading-relaxed font-medium text-foreground">
                Arsitektur pertahanan berlapis tiga terintegrasi (Trinity
                Defense), konsol SOC Dashboard, dan Hono Control Plane dengan
                Neon PostgreSQL & Cloud telemetry.
              </p>
            </div>
            <Link
              href="/docs/core"
              className="inline-flex w-full items-center justify-between border-t-2 border-border pt-4 font-mono text-xs font-black text-foreground transition-all group-hover:underline group-hover:decoration-main group-hover:decoration-2"
            >
              <span>Buka Panduan Suite</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Steps Quick Start Guide */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-base border-2 border-border bg-amber-300 text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
            <Rocket className="size-4.5 stroke-[2.5]" />
          </div>
          <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
            Instalasi Cepat pasax-secure-monitor
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group space-y-3 rounded-base border-2 border-border bg-card p-5 shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between border-b-2 border-border pb-2.5">
              <span className="font-mono text-xl font-black text-foreground">
                01
              </span>
              <span className="rounded-base border-2 border-border bg-amber-300 px-2 py-0.5 font-mono text-[9px] font-black text-black shadow-[1px_1px_0px_0px_var(--border)]">
                COMPOSER
              </span>
            </div>
            <h3 className="font-heading text-base font-black text-foreground">
              Pasang via Composer
            </h3>
            <p className="text-xs leading-relaxed font-medium text-foreground">
              Unduh paket resmi dari Packagist ke aplikasi Laravel Anda.
            </p>
            <pre className="overflow-x-auto rounded-base border-2 border-border bg-[#070b14] p-3 font-mono text-[11px] font-bold text-emerald-400 shadow-[2px_2px_0px_0px_var(--border)]">
              composer require pasax/secure-monitor
            </pre>
          </div>

          <div className="group space-y-3 rounded-base border-2 border-border bg-card p-5 shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between border-b-2 border-border pb-2.5">
              <span className="font-mono text-xl font-black text-foreground">
                02
              </span>
              <span className="rounded-base border-2 border-border bg-sky-300 px-2 py-0.5 font-mono text-[9px] font-black text-black shadow-[1px_1px_0px_0px_var(--border)]">
                ARTISAN
              </span>
            </div>
            <h3 className="font-heading text-base font-black text-foreground">
              Jalankan Wizard Pasax
            </h3>
            <p className="text-xs leading-relaxed font-medium text-foreground">
              Publikasikan konfigurasi, template server, dan auto-hook
              middleware.
            </p>
            <pre className="overflow-x-auto rounded-base border-2 border-border bg-[#070b14] p-3 font-mono text-[11px] font-bold text-emerald-400 shadow-[2px_2px_0px_0px_var(--border)]">
              php artisan pasax:install
            </pre>
          </div>

          <div className="group space-y-3 rounded-base border-2 border-border bg-card p-5 shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between border-b-2 border-border pb-2.5">
              <span className="font-mono text-xl font-black text-foreground">
                03
              </span>
              <span className="rounded-base border-2 border-border bg-emerald-300 px-2 py-0.5 font-mono text-[9px] font-black text-black shadow-[1px_1px_0px_0px_var(--border)]">
                DATABASE
              </span>
            </div>
            <h3 className="font-heading text-base font-black text-foreground">
              Migrasi Basis Data
            </h3>
            <p className="text-xs leading-relaxed font-medium text-foreground">
              Siapkan tabel log ancaman, karantina perangkat, dan tiket banding.
            </p>
            <pre className="overflow-x-auto rounded-base border-2 border-border bg-[#070b14] p-3 font-mono text-[11px] font-bold text-emerald-400 shadow-[2px_2px_0px_0px_var(--border)]">
              php artisan migrate
            </pre>
          </div>
        </div>
      </section>

      {/* Directory of All Document Categories for pasax-secure-monitor */}
      <section className="space-y-6 pt-4">
        <div className="border-b-2 border-border pb-3">
          <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
            Katalog Modul pasax-secure-monitor
          </h2>
          <p className="text-xs font-medium text-foreground sm:text-sm">
            Jelajahi panduan teknis mendalam untuk setiap modul pertahanan
            aplikasi:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {DOCS_MANIFEST.map((cat) => {
            const Icon = iconMap[cat.icon] || BookOpen
            return (
              <div
                key={cat.slug}
                className="space-y-3.5 rounded-base border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--border)]"
              >
                <div className="flex items-center justify-between border-b-2 border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-base border-2 border-border bg-main text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                      <Icon className="size-4.5 stroke-[2.5]" />
                    </div>
                    <h3 className="font-heading text-base font-black text-foreground">
                      {cat.title}
                    </h3>
                  </div>
                  <span className="rounded-base border-2 border-border bg-secondary-background px-2 py-0.5 font-mono text-[10px] font-black shadow-[1px_1px_0px_0px_var(--border)]">
                    {cat.items.length} artikel
                  </span>
                </div>

                <ul className="space-y-2 pt-1">
                  {cat.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/pasax-secure-monitor/${item.slug}`}
                        className="group flex items-center justify-between rounded-base px-2 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-secondary-background hover:text-foreground"
                      >
                        <span className="line-clamp-1 group-hover:underline group-hover:decoration-main group-hover:decoration-3">
                          {item.title}
                        </span>
                        <ArrowRight className="size-3.5 text-foreground transition-transform group-hover:translate-x-1" />
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
