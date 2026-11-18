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
        <DocsBreadcrumb category="Portal Resmi" title="Ikhtisar Pasax Suite" />

        {/* Article Header */}
        <header className="mb-10 border-b border-lp-line pb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-lp-orange/20 bg-lp-orange/10 px-2.5 py-0.5 font-mono text-xs font-medium text-lp-orange dark:border-lp-yellow/20 dark:bg-lp-yellow/10 dark:text-lp-yellow">
              OFFICIAL DOCS
            </span>
            <span className="font-mono text-xs text-lp-ink/40">·</span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-lp-ink/60">
              <Clock className="size-3 text-lp-ink/50" />
              <span>5 min baca</span>
            </span>
            <span className="font-mono text-xs text-lp-ink/40">·</span>
            <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2.5 py-0.5 font-mono text-[10px] font-medium text-lp-ink">
              Pasax Ecosystem
            </span>
          </div>

          <h1 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-lp-ink sm:text-4xl lg:text-5xl">
            Pusat Dokumentasi Pasax Suite
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-lp-ink/75 sm:text-lg">
            Referensi teknis terpadu untuk arsitektur pertahanan server berlapis
            tiga (Trinity Defense). Pelajari implementasi WAF mandiri murni PHP
            untuk Laravel, daemon kernel Go dengan penurunan paket nftables
            instan, serta integrasi pemantauan cloud terpusat.
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3.5 py-2 font-mono text-xs font-medium text-lp-ink transition-colors hover:bg-lp-paper-2"
            >
              <span>GitHub Repositori</span>
              <ExternalLink className="size-3 text-lp-ink/50" />
            </a>
          </div>
        </header>

        {/* Section 1: Trinity Defense Architecture */}
        <section className="docs-content mb-12">
          <h2
            id="arsitektur-trinity"
            className="group flex scroll-mt-20 items-center"
          >
            <a
              href="#arsitektur-trinity"
              className="text-inherit no-underline hover:underline"
            >
              Arsitektur Trinity Defense (3 Lapisan Pertahanan)
            </a>
            <a
              href="#arsitektur-trinity"
              className="ms-2 font-mono text-sm text-lp-ink/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-lp-ink"
            >
              #
            </a>
          </h2>
          <p>
            Pasax Suite menggabungkan tiga pilar pertahanan mandiri yang saling
            berkolaborasi secara real-time melalui IPC socket lokal dan cloud
            telemetry mTLS:
          </p>

          <div className="not-prose my-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Card 1: Secure Monitor */}
            <div className="group relative rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 transition-all hover:bg-lp-paper-2 hover:shadow-sm">
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-orange dark:text-lp-yellow">
                <Shield className="size-5" />
              </div>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-lp-ink">
                  1. pasax-secure-monitor
                </h3>
                <span className="rounded-full bg-lp-orange/10 px-2 py-0.5 font-mono text-[10px] text-lp-orange dark:bg-lp-yellow/10 dark:text-lp-yellow">
                  PHP WAF
                </span>
              </div>
              <p className="text-xs leading-relaxed text-lp-ink/75">
                Pustaka PHP murni mandiri untuk Laravel (10–13). Mencegah SQLi,
                XSS, brute-force, dan karantina perangkat tanpa build tool
                Node.js.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-lp-line/60 pt-3 font-mono text-[11px]">
                <span className="text-lp-ink/50">Packagist library</span>
                <Link
                  href="/docs/pasax-secure-monitor"
                  className="inline-flex items-center gap-1 font-semibold text-lp-orange hover:underline dark:text-lp-yellow"
                >
                  <span>Buka Modul</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: Sentinel */}
            <div className="group relative rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 transition-all hover:bg-lp-paper-2 hover:shadow-sm">
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-orange dark:text-lp-yellow">
                <Terminal className="size-5" />
              </div>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-lp-ink">
                  2. pasax-sentinel
                </h3>
                <span className="rounded-full bg-lp-orange/10 px-2 py-0.5 font-mono text-[10px] text-lp-orange dark:bg-lp-yellow/10 dark:text-lp-yellow">
                  Go Daemon
                </span>
              </div>
              <p className="text-xs leading-relaxed text-lp-ink/75">
                Daemon Linux Go berperforma tinggi. Menangani pembatasan IP
                wire-speed via nftables/iptables (&lt;0.02ms) dan pengawasan
                integritas file (FIM).
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-lp-line/60 pt-3 font-mono text-[11px]">
                <span className="text-lp-ink/50">Kernel filter</span>
                <Link
                  href="/docs/pasax-sentinel"
                  className="inline-flex items-center gap-1 font-semibold text-lp-orange hover:underline dark:text-lp-yellow"
                >
                  <span>Buka Modul</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Card 3: Cloud Control */}
            <div className="group relative rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 transition-all hover:bg-lp-paper-2 hover:shadow-sm">
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-orange dark:text-lp-yellow">
                <Layers className="size-5" />
              </div>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-lp-ink">
                  3. Pasax Web &amp; SOC
                </h3>
                <span className="rounded-full bg-lp-orange/10 px-2 py-0.5 font-mono text-[10px] text-lp-orange dark:bg-lp-yellow/10 dark:text-lp-yellow">
                  Cloud SOC
                </span>
              </div>
              <p className="text-xs leading-relaxed text-lp-ink/75">
                Platform orkestrasi awan terpusat berbasis Next.js 16.
                Menyajikan peta ancaman 3D, live heartbeat armada node, dan
                sinkronisasi blocklist global.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-lp-line/60 pt-3 font-mono text-[11px]">
                <span className="text-lp-ink/50">Platform control</span>
                <Link
                  href="/docs/core"
                  className="inline-flex items-center gap-1 font-semibold text-lp-orange hover:underline dark:text-lp-yellow"
                >
                  <span>Buka Modul</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Product Modules Catalog */}
        <section className="docs-content mb-12">
          <h2
            id="modul-produk"
            className="group flex scroll-mt-20 items-center"
          >
            <a
              href="#modul-produk"
              className="text-inherit no-underline hover:underline"
            >
              Pilihan Modul Dokumentasi
            </a>
            <a
              href="#modul-produk"
              className="ms-2 font-mono text-sm text-lp-ink/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-lp-ink"
            >
              #
            </a>
          </h2>
          <p>
            Pilih modul di bawah ini atau gunakan pemilih modul di panel kiri
            untuk membuka dokumentasi spesifik produk:
          </p>

          <div className="not-prose my-6 space-y-3">
            <Link
              href="/docs/pasax-secure-monitor"
              className="group flex flex-col justify-between gap-3 rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 transition-all hover:border-lp-orange/50 hover:bg-lp-paper-2 sm:flex-row sm:items-center dark:hover:border-lp-yellow/50"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-orange dark:text-lp-yellow">
                  <Shield className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-semibold text-lp-ink transition-colors group-hover:text-lp-orange dark:group-hover:text-lp-yellow">
                      Dokumentasi pasax-secure-monitor
                    </span>
                    <span className="py-0.2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      v1.0.2 STABLE (PACKAGIST)
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-lp-ink/75">
                    Panduan integrasi Laravel package via Composer, instalasi
                    nol NPM, konfigurasi middleware security, aturan validasi,
                    dan event monitoring.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 font-mono text-xs text-lp-ink/60 group-hover:text-lp-ink">
                <span>27 Artikel</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/docs/pasax-sentinel"
              className="group flex flex-col justify-between gap-3 rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 transition-all hover:border-lp-orange/50 hover:bg-lp-paper-2 sm:flex-row sm:items-center dark:hover:border-lp-yellow/50"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-orange dark:text-lp-yellow">
                  <Terminal className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-semibold text-lp-ink transition-colors group-hover:text-lp-orange dark:group-hover:text-lp-yellow">
                      Dokumentasi pasax-sentinel
                    </span>
                    <span className="py-0.2 rounded-full border border-lp-line bg-lp-paper-2 px-2 font-mono text-[10px] text-lp-ink/70">
                      v1.0.0 (LINUX DAEMON)
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-lp-ink/75">
                    Instalasi binary Go, konfigurasi IPC socket Unix, aturan
                    firewall nftables otomatis, dan pemantauan FIM berbasis
                    kernel inotify.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 font-mono text-xs text-lp-ink/60 group-hover:text-lp-ink">
                <span>Panduan Daemon</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/docs/core"
              className="group flex flex-col justify-between gap-3 rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 transition-all hover:border-lp-orange/50 hover:bg-lp-paper-2 sm:flex-row sm:items-center dark:hover:border-lp-yellow/50"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-orange dark:text-lp-yellow">
                  <Layers className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-semibold text-lp-ink transition-colors group-hover:text-lp-orange dark:group-hover:text-lp-yellow">
                      Dokumentasi Pasax Platform Core
                    </span>
                    <span className="py-0.2 rounded-full border border-lp-line bg-lp-paper-2 px-2 font-mono text-[10px] text-lp-ink/70">
                      v1.0.0 (PLATFORM CONTROL)
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-lp-ink/75">
                    Arsitektur mesh Trinity Defense, protokol mTLS, skema
                    database PostgreSQL Neon, dan integrasi dasbor SOC global.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 font-mono text-xs text-lp-ink/60 group-hover:text-lp-ink">
                <span>Arsitektur Mesh</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* Section 3: Quick Start Code */}
        <section className="docs-content mb-12">
          <h2
            id="instalasi-cepat"
            className="group flex scroll-mt-20 items-center"
          >
            <a
              href="#instalasi-cepat"
              className="text-inherit no-underline hover:underline"
            >
              Instalasi Cepat (Quickstart)
            </a>
            <a
              href="#instalasi-cepat"
              className="ms-2 font-mono text-sm text-lp-ink/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-lp-ink"
            >
              #
            </a>
          </h2>
          <p>
            Mulai melindungi aplikasi Laravel Anda dalam waktu kurang dari 2
            menit menggunakan paket resmi Packagist:
          </p>

          <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-xl border border-lp-line bg-lp-paper-2/40 p-4">
              <div className="flex items-center justify-between border-b border-lp-line pb-2">
                <span className="font-mono text-base font-bold text-lp-ink">
                  01
                </span>
                <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2 py-0.5 font-mono text-[10px] text-lp-ink/70">
                  COMPOSER
                </span>
              </div>
              <h4 className="font-heading text-xs font-semibold text-lp-ink">
                Pasang Paket
              </h4>
              <p className="text-[11px] text-lp-ink/70">
                Unduh paket resmi dari Packagist.
              </p>
              <pre className="overflow-x-auto rounded-lg border border-lp-line bg-[#121210] p-2.5 font-mono text-[11px] text-[#eceae2]">
                <code>composer require pasax/secure-monitor</code>
              </pre>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-lp-line bg-lp-paper-2/40 p-4">
              <div className="flex items-center justify-between border-b border-lp-line pb-2">
                <span className="font-mono text-base font-bold text-lp-ink">
                  02
                </span>
                <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2 py-0.5 font-mono text-[10px] text-lp-ink/70">
                  ARTISAN
                </span>
              </div>
              <h4 className="font-heading text-xs font-semibold text-lp-ink">
                Inisialisasi Setup
              </h4>
              <p className="text-[11px] text-lp-ink/70">
                Publikasi config dan registrasi hook.
              </p>
              <pre className="overflow-x-auto rounded-lg border border-lp-line bg-[#121210] p-2.5 font-mono text-[11px] text-[#eceae2]">
                <code>php artisan pasax:install</code>
              </pre>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-lp-line bg-lp-paper-2/40 p-4">
              <div className="flex items-center justify-between border-b border-lp-line pb-2">
                <span className="font-mono text-base font-bold text-lp-ink">
                  03
                </span>
                <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2 py-0.5 font-mono text-[10px] text-lp-ink/70">
                  DATABASE
                </span>
              </div>
              <h4 className="font-heading text-xs font-semibold text-lp-ink">
                Migrasi Tabel
              </h4>
              <p className="text-[11px] text-lp-ink/70">
                Siapkan tabel log ancaman dan karantina.
              </p>
              <pre className="overflow-x-auto rounded-lg border border-lp-line bg-[#121210] p-2.5 font-mono text-[11px] text-[#eceae2]">
                <code>php artisan migrate</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Section 4: Document Catalog */}
        <section className="docs-content mb-12">
          <h2
            id="katalog-panduan"
            className="group flex scroll-mt-20 items-center"
          >
            <a
              href="#katalog-panduan"
              className="text-inherit no-underline hover:underline"
            >
              Katalog Panduan Teknis
            </a>
            <a
              href="#katalog-panduan"
              className="ms-2 font-mono text-sm text-lp-ink/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-lp-ink"
            >
              #
            </a>
          </h2>
          <p>
            Daftar lengkap seluruh bab teknis yang tersedia di repositori
            dokumentasi Pasax Suite:
          </p>

          <div className="not-prose my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {DOCS_MANIFEST.map((cat) => (
              <div
                key={cat.slug}
                className="space-y-2.5 rounded-xl border border-lp-line bg-lp-paper-2/30 p-4 transition-all hover:bg-lp-paper-2/50"
              >
                <div className="flex items-center justify-between border-b border-lp-line pb-2">
                  <h4 className="font-heading text-xs font-semibold text-lp-ink">
                    {cat.title}
                  </h4>
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
