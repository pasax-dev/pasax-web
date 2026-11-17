import Link from "next/link"
import {
  ArrowRight,
  Rocket,
  Shield,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  Clock,
  Check,
} from "lucide-react"
import { DOCS_MANIFEST, ALL_DOCS } from "@/lib/docs-manifest"
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb"
import { DocsToc } from "@/components/docs/docs-toc"
import { DocsPager } from "@/components/docs/docs-pager"
import { SearchTrigger } from "@/components/search/search-trigger"

export const metadata = {
  title: "Dokumentasi Resmi — Pasax Suite Ecosystem",
  description:
    "Portal dokumentasi resmi ekosistem Pasax Suite: pasax-secure-monitor (Laravel WAF), pasax-sentinel (Go daemon), dan cloud control plane.",
}

const tocHeadings = [
  { id: "arsitektur-trinity", text: "Arsitektur Trinity Defense", level: 2 },
  { id: "modul-produk", text: "Katalog Modul Produk", level: 2 },
  { id: "instalasi-cepat", text: "Instalasi Cepat (Quickstart)", level: 2 },
  { id: "katalog-panduan", text: "Katalog Panduan Teknis", level: 2 },
]

export default function DocsHomePage() {
  const firstDoc = ALL_DOCS[0]

  return (
    <div className="flex w-full max-w-full min-w-0 flex-1 justify-between">
      <div className="w-full max-w-4xl min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 xl:max-w-5xl 2xl:max-w-6xl">
        <DocsBreadcrumb
          category="Portal Resmi"
          title="Ikhtisar Pasax Suite"
        />

        {/* Article Header */}
        <header className="mb-10 border-b border-lp-line pb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-lp-orange/20 dark:border-lp-yellow/20 bg-lp-orange/10 dark:bg-lp-yellow/10 px-2.5 py-0.5 font-mono text-xs font-medium text-lp-orange dark:text-lp-yellow">
              OFFICIAL DOCS
            </span>
            <span className="font-mono text-xs text-lp-ink/40">·</span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-lp-ink/60">
              <Clock className="size-3 text-lp-ink/50" />
              <span>5 min baca</span>
            </span>
            <span className="font-mono text-xs text-lp-ink/40">·</span>
            <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2.5 py-0.5 font-mono text-[10px] font-medium text-lp-ink">
              Pasax Suite v1.4
            </span>
          </div>

          <h1 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-lp-ink sm:text-4xl lg:text-5xl">
            Pusat Dokumentasi Pasax Suite
          </h1>

          <p className="text-base leading-relaxed text-lp-ink/75 sm:text-lg max-w-3xl">
            Referensi teknis terpadu untuk arsitektur pertahanan server berlapis tiga (Trinity Defense).
            Pelajari implementasi WAF mandiri murni PHP untuk Laravel, daemon kernel Go dengan penurunan paket nftables instan, serta integrasi pemantauan cloud terpusat.
          </p>

          {/* Quick Search & Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="w-full max-w-md">
              <SearchTrigger
                variant="sidebar"
                className="h-10 border-lp-line bg-lp-paper"
                placeholder="Cari konsep, fungsi, atau perintah teknis..."
              />
            </div>
            <a
              href="https://github.com/pasax-dev/pasax-suit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3.5 py-2 font-mono text-xs font-medium text-lp-ink hover:bg-lp-paper-2 transition-colors"
            >
              <span>GitHub Repositori</span>
              <ExternalLink className="size-3 text-lp-ink/50" />
            </a>
          </div>
        </header>

        {/* Section 1: Trinity Defense Architecture */}
        <section className="docs-content mb-12">
          <h2 id="arsitektur-trinity" className="group flex items-center scroll-mt-20">
            <a href="#arsitektur-trinity" className="no-underline text-inherit hover:underline">
              Arsitektur Trinity Defense (3 Lapisan Pertahanan)
            </a>
            <a href="#arsitektur-trinity" className="ms-2 opacity-0 group-hover:opacity-100 text-lp-ink/40 hover:text-lp-ink font-mono text-sm transition-opacity">#</a>
          </h2>
          <p>
            Pasax Suite menggabungkan tiga pilar pertahanan mandiri yang saling berkolaborasi secara real-time melalui IPC socket lokal dan cloud telemetry mTLS:
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 my-6 not-prose">
            <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-lp-orange dark:text-lp-yellow">LAPISAN 1</span>
                <span className="font-mono text-[10px] text-lp-ink/60">PHP 8.2+</span>
              </div>
              <h3 className="font-heading text-sm font-semibold text-lp-ink">pasax-secure-monitor</h3>
              <p className="text-xs text-lp-ink/75 leading-relaxed">
                WAF aplikasi mandiri 100% PHP murni. Proteksi OWASP Top 10, karantina sesi NAT bersama, dan inspeksi webshell.
              </p>
            </div>

            <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">LAPISAN 2</span>
                <span className="font-mono text-[10px] text-lp-ink/60">GO 1.24</span>
              </div>
              <h3 className="font-heading text-sm font-semibold text-lp-ink">pasax-sentinel</h3>
              <p className="text-xs text-lp-ink/75 leading-relaxed">
                Daemon host kernel Linux single-binary. Penurunan paket nftables sub-0.2ms, inotify FIM auto-lockdown ke 0600.
              </p>
            </div>

            <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">LAPISAN 3</span>
                <span className="font-mono text-[10px] text-lp-ink/60">CLOUD PLATFORM</span>
              </div>
              <h3 className="font-heading text-sm font-semibold text-lp-ink">Pasax Suite Core</h3>
              <p className="text-xs text-lp-ink/75 leading-relaxed">
                Konsol SOC terpusat, analitik armada server VPS, telemetry API, dan sinkronisasi blokir ancaman global.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Main Product Portals */}
        <section className="docs-content mb-12">
          <h2 id="modul-produk" className="group flex items-center scroll-mt-20">
            <a href="#modul-produk" className="no-underline text-inherit hover:underline">
              Katalog Modul Produk
            </a>
            <a href="#modul-produk" className="ms-2 opacity-0 group-hover:opacity-100 text-lp-ink/40 hover:text-lp-ink font-mono text-sm transition-opacity">#</a>
          </h2>
          <p>
            Pilih modul di bawah ini untuk membuka dokumentasi dan referensi implementasi lengkap:
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 my-6 not-prose">
            {/* Card 1: Monitor */}
            <div className="group flex flex-col justify-between space-y-4 rounded-xl border border-lp-line bg-lp-paper-2/30 p-5 transition-all hover:bg-lp-paper-2/60 hover:border-lp-orange/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-lp-orange/20 dark:border-lp-yellow/20 bg-lp-orange/10 dark:bg-lp-yellow/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-lp-orange dark:text-lp-yellow">
                    LARAVEL CORE
                  </span>
                  <span className="font-mono text-xs text-lp-ink/60">29 Panduan</span>
                </div>
                <h3 className="font-heading text-base font-semibold text-lp-ink group-hover:text-lp-orange dark:group-hover:text-lp-yellow transition-colors">
                  pasax-secure-monitor
                </h3>
                <p className="text-xs leading-relaxed text-lp-ink/75">
                  WAF mandiri 100% PHP murni untuk Laravel 10–13, karantina perangkat pada NAT bersama, dan stepped login lockout.
                </p>
                <div className="overflow-x-auto rounded-lg border border-lp-line bg-[#121210] p-2.5 font-mono text-[11px] text-[#eceae2]">
                  <code>composer require pasax/secure-monitor</code>
                </div>
              </div>
              <Link
                href="/docs/pasax-secure-monitor"
                className="inline-flex w-full items-center justify-between border-t border-lp-line pt-3 font-mono text-xs font-medium text-lp-ink/80 transition-colors group-hover:text-lp-ink"
              >
                <span>Buka Dokumentasi WAF</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Card 2: Sentinel */}
            <div className="group flex flex-col justify-between space-y-4 rounded-xl border border-lp-line bg-lp-paper-2/30 p-5 transition-all hover:bg-lp-paper-2/60 hover:border-lp-orange/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-sky-600 dark:text-sky-400">
                    GO 1.24 DAEMON
                  </span>
                  <span className="font-mono text-xs text-lp-ink/60">8 Panduan</span>
                </div>
                <h3 className="font-heading text-base font-semibold text-lp-ink group-hover:text-lp-orange dark:group-hover:text-lp-yellow transition-colors">
                  pasax-sentinel
                </h3>
                <p className="text-xs leading-relaxed text-lp-ink/75">
                  Daemon host Linux single-binary (&lt;20MB RAM). Penurunan paket kernel via nftables sub-0.2ms dan inotify FIM.
                </p>
                <div className="overflow-x-auto rounded-lg border border-lp-line bg-[#121210] p-2.5 font-mono text-[11px] text-[#eceae2]">
                  <code>curl -sSL https://get.pasax.is-a.dev/sentinel.sh | sudo bash</code>
                </div>
              </div>
              <Link
                href="/docs/pasax-sentinel"
                className="inline-flex w-full items-center justify-between border-t border-lp-line pt-3 font-mono text-xs font-medium text-lp-ink/80 transition-colors group-hover:text-lp-ink"
              >
                <span>Buka Dokumentasi Daemon</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Card 3: Core */}
            <div className="group flex flex-col justify-between space-y-4 rounded-xl border border-lp-line bg-lp-paper-2/30 p-5 transition-all hover:bg-lp-paper-2/60 hover:border-lp-orange/40">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    PLATFORM CORE
                  </span>
                  <span className="font-mono text-xs text-lp-ink/60">5 Panduan</span>
                </div>
                <h3 className="font-heading text-base font-semibold text-lp-ink group-hover:text-lp-orange dark:group-hover:text-lp-yellow transition-colors">
                  Pasax Suite Core
                </h3>
                <p className="text-xs leading-relaxed text-lp-ink/75">
                  Arsitektur pertahanan terpadu, konsol SOC Dashboard, dan Hono Control Plane dengan basis data Neon PostgreSQL.
                </p>
                <div className="overflow-x-auto rounded-lg border border-lp-line bg-[#121210] p-2.5 font-mono text-[11px] text-[#eceae2]">
                  <code>pnpm dlx pasax-cli init --with-sentinel</code>
                </div>
              </div>
              <Link
                href="/docs/core"
                className="inline-flex w-full items-center justify-between border-t border-lp-line pt-3 font-mono text-xs font-medium text-lp-ink/80 transition-colors group-hover:text-lp-ink"
              >
                <span>Buka Panduan Suite</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Quick Start Guide */}
        <section className="docs-content mb-12">
          <h2 id="instalasi-cepat" className="group flex items-center scroll-mt-20">
            <a href="#instalasi-cepat" className="no-underline text-inherit hover:underline">
              Instalasi Cepat (Quickstart)
            </a>
            <a href="#instalasi-cepat" className="ms-2 opacity-0 group-hover:opacity-100 text-lp-ink/40 hover:text-lp-ink font-mono text-sm transition-opacity">#</a>
          </h2>
          <p>
            Pasang paket resmi WAF ke dalam aplikasi Laravel Anda hanya dalam 3 langkah mudah:
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 my-6 not-prose">
            <div className="space-y-2.5 rounded-xl border border-lp-line bg-lp-paper-2/30 p-4">
              <div className="flex items-center justify-between border-b border-lp-line pb-2">
                <span className="font-mono text-base font-bold text-lp-ink">01</span>
                <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2 py-0.5 font-mono text-[10px] text-lp-ink/70">
                  COMPOSER
                </span>
              </div>
              <h4 className="font-heading text-xs font-semibold text-lp-ink">Pasang Paket</h4>
              <p className="text-[11px] text-lp-ink/70">Unduh paket resmi dari Packagist.</p>
              <pre className="overflow-x-auto rounded-lg border border-lp-line bg-[#121210] p-2.5 font-mono text-[11px] text-[#eceae2]">
                <code>composer require pasax/secure-monitor</code>
              </pre>
            </div>

            <div className="space-y-2.5 rounded-xl border border-lp-line bg-lp-paper-2/30 p-4">
              <div className="flex items-center justify-between border-b border-lp-line pb-2">
                <span className="font-mono text-base font-bold text-lp-ink">02</span>
                <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2 py-0.5 font-mono text-[10px] text-lp-ink/70">
                  ARTISAN
                </span>
              </div>
              <h4 className="font-heading text-xs font-semibold text-lp-ink">Jalankan Setup</h4>
              <p className="text-[11px] text-lp-ink/70">Publikasi konfigurasi dan middleware.</p>
              <pre className="overflow-x-auto rounded-lg border border-lp-line bg-[#121210] p-2.5 font-mono text-[11px] text-[#eceae2]">
                <code>php artisan pasax:install</code>
              </pre>
            </div>

            <div className="space-y-2.5 rounded-xl border border-lp-line bg-lp-paper-2/30 p-4">
              <div className="flex items-center justify-between border-b border-lp-line pb-2">
                <span className="font-mono text-base font-bold text-lp-ink">03</span>
                <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2 py-0.5 font-mono text-[10px] text-lp-ink/70">
                  DATABASE
                </span>
              </div>
              <h4 className="font-heading text-xs font-semibold text-lp-ink">Migrasi Tabel</h4>
              <p className="text-[11px] text-lp-ink/70">Siapkan tabel log ancaman dan karantina.</p>
              <pre className="overflow-x-auto rounded-lg border border-lp-line bg-[#121210] p-2.5 font-mono text-[11px] text-[#eceae2]">
                <code>php artisan migrate</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Section 4: Document Catalog */}
        <section className="docs-content mb-12">
          <h2 id="katalog-panduan" className="group flex items-center scroll-mt-20">
            <a href="#katalog-panduan" className="no-underline text-inherit hover:underline">
              Katalog Panduan Teknis
            </a>
            <a href="#katalog-panduan" className="ms-2 opacity-0 group-hover:opacity-100 text-lp-ink/40 hover:text-lp-ink font-mono text-sm transition-opacity">#</a>
          </h2>
          <p>
            Daftar lengkap seluruh bab teknis yang tersedia di repositori dokumentasi Pasax Suite:
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 my-6 not-prose">
            {DOCS_MANIFEST.map((cat) => (
              <div
                key={cat.slug}
                className="space-y-2.5 rounded-xl border border-lp-line bg-lp-paper-2/30 p-4 transition-all hover:bg-lp-paper-2/50"
              >
                <div className="flex items-center justify-between border-b border-lp-line pb-2">
                  <h4 className="font-heading text-xs font-semibold text-lp-ink">{cat.title}</h4>
                  <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2 py-0.5 font-mono text-[10px] text-lp-ink/70">
                    {cat.items.length} artikel
                  </span>
                </div>
                <ul className="space-y-1">
                  {cat.items.slice(0, 4).map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/pasax-secure-monitor/${item.slug}`}
                        className="group flex items-center justify-between rounded-md px-2 py-1 text-xs text-lp-ink/75 transition-colors hover:bg-lp-paper-2 hover:text-lp-ink hover:text-lp-orange dark:hover:text-lp-yellow"
                      >
                        <span className="line-clamp-1">{item.title}</span>
                        <ArrowRight className="size-3 text-lp-ink/40 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Pager */}
        <DocsPager
          prev={null}
          next={firstDoc ? { ...firstDoc, category: "Memulai Cepat" } : null}
        />
      </div>

      {/* Right Table of Contents */}
      <DocsToc headings={tocHeadings} />
    </div>
  )
}
