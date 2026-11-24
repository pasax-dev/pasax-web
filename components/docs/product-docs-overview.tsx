"use client"

import * as React from "react"
import Link from "next/link"
import {
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Clock,
  Package,
  Shield,
  Layers,
  GitBranch,
  Download,
} from "lucide-react"
import { PRODUCTS_CONFIG, getDocSectionsForProduct } from "@/lib/docs-manifest"
import { cn } from "@/lib/utils"
import { type PackagistData } from "@/lib/packagist"
import { usePackagistData } from "@/lib/use-packagist"
import { DocsBreadcrumb } from "./docs-breadcrumb"
import { DocsToc } from "./docs-toc"
import { DocsPager } from "./docs-pager"

export type ProductType = "core" | "pasax-secure-monitor" | "pasax-sentinel"

interface ProductDocsOverviewProps {
  product: ProductType
  initialPackagist?: PackagistData
}

const quickSnippets: Record<ProductType, { label: string; cmd: string }> = {
  "pasax-secure-monitor": {
    label: "Composer Require",
    cmd: "composer require pasax/secure-monitor",
  },
  "pasax-sentinel": {
    label: "Single Binary Download",
    cmd: "curl -sSL https://get.pasax.web.id/sentinel.sh | sudo bash",
  },
  core: {
    label: "Full Stack Deployment",
    cmd: "pnpm dlx pasax-cli init --with-sentinel",
  },
}

function PackagistIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16 2.5L2.8 9.5V22.5L16 29.5L29.2 22.5V9.5L16 2.5ZM16 5.6L25.8 10.8L21.5 13.1L11.7 7.9L16 5.6ZM5.4 11L14.7 16V26.1L5.4 21.1V11ZM17.3 26.1V16L21.6 13.7V18.7L24.2 17.3V12.3L26.6 11V21.1L17.3 26.1Z" />
    </svg>
  )
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export function ProductDocsOverview({
  product,
  initialPackagist,
}: ProductDocsOverviewProps) {
  const info = PRODUCTS_CONFIG[product]
  const sections = getDocSectionsForProduct(product)
  const snippet = quickSnippets[product]
  const [copied, setCopied] = React.useState(false)
  const { data: packagistData } = usePackagistData(initialPackagist)

  const copySnippet = () => {
    if (!snippet) return
    navigator.clipboard.writeText(snippet.cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Find first readable article href
  const firstDocItem = sections[0]?.items[0]
  const firstDocHref = firstDocItem
    ? `/docs/${product}/${firstDocItem.slug}`
    : "#"

  // Build Table of Contents dynamically
  const tocHeadings = React.useMemo(() => {
    const list = []
    if (product === "pasax-secure-monitor") {
      list.push({
        id: "packagist-info",
        text: "Informasi Paket Packagist & Versi Rilis",
        level: 2,
      })
    }
    if (snippet) {
      list.push({
        id: "instalasi-perintah",
        text: "Perintah Instalasi Cepat",
        level: 2,
      })
    }
    list.push({
      id: "daftar-bab",
      text: `Daftar Bab & Panduan — ${info.name}`,
      level: 2,
    })
    return list
  }, [product, snippet, info.name])

  const repoUrl =
    product === "pasax-sentinel"
      ? "https://github.com/pasax-dev/pasax-sentinel"
      : product === "core"
        ? "https://github.com/pasax-dev/pasax-suit"
        : packagistData.repository ||
          "https://github.com/pasax-dev/pasax-secure-monitor-laravel"

  const packagistUrl =
    packagistData.packagistUrl ||
    "https://packagist.org/packages/pasax/secure-monitor"

  return (
    <div className="flex w-full max-w-full min-w-0 flex-1 justify-between">
      <div className="w-full max-w-4xl min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 xl:max-w-5xl 2xl:max-w-6xl">
        <DocsBreadcrumb
          category="Dokumentasi Modul"
          title={info.name}
          product={product}
        />

        {/* Product Hero Header */}
        <header className="mb-10 border-b border-lp-line pb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-lp-orange/20 bg-lp-orange/10 px-2.5 py-0.5 font-mono text-xs font-medium text-lp-orange dark:border-lp-yellow/20 dark:bg-lp-yellow/10 dark:text-lp-yellow">
              MODUL RESMI
            </span>
            <span className="font-mono text-xs text-lp-ink/40">·</span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-lp-ink/60">
              <Clock className="size-3 text-lp-ink/50" />
              <span>5 min baca</span>
            </span>
            <span className="font-mono text-xs text-lp-ink/40">·</span>
            <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2.5 py-0.5 font-mono text-[10px] font-medium text-lp-ink">
              {info.badge}
            </span>
            {product === "pasax-secure-monitor" && (
              <>
                <span className="font-mono text-xs text-lp-ink/40">·</span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  v{packagistData.latestVersion} STABLE
                </span>
              </>
            )}
          </div>

          <h1 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-lp-ink sm:text-4xl lg:text-5xl">
            {info.name}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-lp-ink/75 sm:text-lg">
            {info.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href={firstDocHref}
              className="inline-flex items-center gap-2 rounded-lg bg-lp-ink px-4 py-2 font-mono text-xs font-medium text-lp-paper transition-all hover:opacity-90 active:scale-98"
            >
              <span>Mulai Membaca Panduan</span>
              <ArrowRight className="size-3.5" />
            </Link>

            {product === "pasax-secure-monitor" && (
              <a
                href={packagistUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#F28D1A]/30 bg-[#F28D1A]/10 px-3.5 py-2 font-mono text-xs font-medium text-[#F28D1A] transition-colors hover:bg-[#F28D1A]/20"
              >
                <PackagistIcon className="size-3.5" />
                <span>Packagist v{packagistData.latestVersion}</span>
                <ExternalLink className="size-3 opacity-60" />
              </a>
            )}

            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3.5 py-2 font-mono text-xs font-medium text-lp-ink transition-colors hover:bg-lp-paper-2"
            >
              <GitHubIcon className="size-3.5" />
              <span>Lihat di GitHub</span>
              <ExternalLink className="size-3 text-lp-ink/50" />
            </a>
          </div>
        </header>

        {/* Section Packagist Distribution & Version Matrix (Specifically for pasax-secure-monitor) */}
        {product === "pasax-secure-monitor" && (
          <section className="docs-content mb-10">
            <h2
              id="packagist-info"
              className="group flex scroll-mt-20 items-center"
            >
              <a
                href="#packagist-info"
                className="text-inherit no-underline hover:underline"
              >
                Informasi Paket Packagist &amp; Versi Rilis
              </a>
              <a
                href="#packagist-info"
                className="ms-2 font-mono text-sm text-lp-ink/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-lp-ink"
              >
                #
              </a>
            </h2>
            <p>
              Paket <code>pasax/secure-monitor</code> didistribusikan secara
              resmi melalui repositori Composer publik di{" "}
              <strong>Packagist</strong> dengan integrasi penuh standar Laravel
              package, 100% PHP murni tanpa memerlukan dependensi Node.js / NPM.
            </p>

            {/* Quick Metadata Matrix Grid */}
            <div className="not-prose my-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-3.5">
                <div className="mb-1 flex items-center gap-2 font-mono text-xs text-lp-ink/60">
                  <Package className="size-3.5 text-lp-orange" />
                  <span>Nama Paket</span>
                </div>
                <a
                  href={packagistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-mono text-xs font-bold text-lp-ink hover:underline"
                >
                  <span>pasax/secure-monitor</span>
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              </div>

              <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-3.5">
                <div className="mb-1 flex items-center gap-2 font-mono text-xs text-lp-ink/60">
                  <GitBranch className="size-3.5 text-emerald-500" />
                  <span>Versi Rilis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    v{packagistData.latestVersion}
                  </span>
                  <span className="py-0.2 rounded-full bg-emerald-500/10 px-1.5 font-mono text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                    STABLE
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-3.5">
                <div className="mb-1 flex items-center gap-2 font-mono text-xs text-lp-ink/60">
                  <Layers className="size-3.5 text-sky-500" />
                  <span>Kompatibilitas PHP</span>
                </div>
                <div className="font-mono text-xs font-bold text-lp-ink">
                  ^8.2 | ^8.3 | ^8.4 | ^8.5
                </div>
              </div>

              <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-3.5">
                <div className="mb-1 flex items-center gap-2 font-mono text-xs text-lp-ink/60">
                  <Download className="size-3.5 text-purple-500" />
                  <span>Total Unduhan</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-lp-ink">
                  <span>{packagistData.downloadsTotal} Unduhan</span>
                  <span className="text-[10px] font-normal text-lp-ink/60">
                    (Packagist)
                  </span>
                </div>
              </div>
            </div>

            {/* Version History Table (Dynamic from Packagist API) */}
            <div className="not-prose my-6 rounded-xl border border-lp-line bg-lp-paper-2/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-heading text-xs font-semibold text-lp-ink">
                  <Clock className="size-3.5 text-lp-orange" />
                  <span>
                    Riwayat Versi Packagist &amp; Catatan Perubahan (Live)
                  </span>
                </h4>
                <a
                  href={packagistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-lp-orange hover:underline"
                >
                  <span>packagist.org</span>
                  <ExternalLink className="size-2.5" />
                </a>
              </div>

              <div className="space-y-2 text-xs">
                {packagistData.versions.map((ver, idx) => {
                  const detail = packagistData.versionDetails[ver]
                  const isLatest = idx === 0
                  const releaseDate = detail?.time
                    ? new Date(detail.time).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "16 November 2026"

                  return (
                    <div
                      key={ver}
                      className={cn(
                        "flex flex-col gap-1 rounded-lg border p-3 transition-colors",
                        isLatest
                          ? "border-emerald-500/30 bg-lp-paper shadow-xs"
                          : "border-lp-line bg-lp-paper/60 hover:bg-lp-paper"
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-mono font-bold",
                              isLatest
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-lp-ink"
                            )}
                          >
                            v{ver}
                          </span>
                          {isLatest && (
                            <span className="py-0.2 rounded-full bg-emerald-500/10 px-1.5 font-mono text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                              LATEST STABLE
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-lp-ink/60">
                            {releaseDate}
                          </span>
                        </div>
                        <a
                          href={
                            detail?.releaseNotesUrl ||
                            `https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v${ver}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-lp-orange hover:underline"
                        >
                          <span>Release notes</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-lp-ink/80">
                        {detail?.summary ||
                          `Pembaruan rilis paket resmi pasax/secure-monitor v${ver}.`}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] text-lp-ink/60">
                        <span className="rounded border border-lp-line bg-lp-paper-2 px-1.5 py-0.5">
                          PHP: {detail?.php || "^8.2 | ^8.3 | ^8.4 | ^8.5"}
                        </span>
                        <span className="rounded border border-lp-line bg-lp-paper-2 px-1.5 py-0.5">
                          Laravel: {detail?.laravel || "10.x - 13.x"}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Laravel Integration Details */}
            <div className="not-prose my-6 rounded-xl border border-lp-line bg-lp-paper-2/40 p-4">
              <h4 className="mb-2 font-heading text-xs font-semibold text-lp-ink">
                Titik Integrasi Framework Laravel
              </h4>
              <div className="grid grid-cols-1 gap-3 font-mono text-xs md:grid-cols-2">
                <div className="rounded-lg border border-lp-line bg-lp-paper p-3">
                  <span className="mb-1 block font-sans text-[10px] font-medium text-lp-ink/60">
                    SERVICE PROVIDER:
                  </span>
                  <code className="text-[11px] text-lp-orange select-all">
                    Pasax\SecureMonitor\PasaxServiceProvider
                  </code>
                </div>
                <div className="rounded-lg border border-lp-line bg-lp-paper p-3">
                  <span className="mb-1 block font-sans text-[10px] font-medium text-lp-ink/60">
                    FACADE / ALIAS:
                  </span>
                  <code className="text-[11px] text-lp-orange select-all">
                    Pasax\SecureMonitor\Facades\Pasax
                  </code>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 1: Quick Command */}
        {snippet && (
          <section className="docs-content mb-10">
            <h2
              id="instalasi-perintah"
              className="group flex scroll-mt-20 items-center"
            >
              <a
                href="#instalasi-perintah"
                className="text-inherit no-underline hover:underline"
              >
                Perintah Instalasi Cepat
              </a>
              <a
                href="#instalasi-perintah"
                className="ms-2 font-mono text-sm text-lp-ink/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-lp-ink"
              >
                #
              </a>
            </h2>
            <div className="not-prose my-4 flex items-center justify-between overflow-x-auto rounded-xl border border-lp-line bg-[#121210] p-4 font-mono text-xs text-[#eceae2]">
              <code>{snippet.cmd}</code>
              <button
                onClick={copySnippet}
                className="ms-4 flex shrink-0 cursor-pointer items-center gap-1 rounded border border-[rgba(236,234,226,0.1)] bg-[#181816] px-2 py-1 text-[11px] text-[#eceae2]/70 transition-colors hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {product === "pasax-secure-monitor" && (
              <div className="not-prose my-3 space-y-1.5 rounded-lg border border-lp-line bg-lp-paper-2/30 p-3 font-mono text-xs">
                <p className="font-sans text-[11px] font-medium text-lp-ink/70">
                  Setelah memasang paket melalui Composer, jalankan setup wizard
                  dan migrasi database:
                </p>
                <div className="space-y-1 rounded bg-[#121210] p-2.5 text-[11px] text-[#eceae2]">
                  <div>php artisan pasax:install</div>
                  <div>php artisan migrate</div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Section 2: Chapters & Guides */}
        <section className="docs-content mb-12">
          <h2 id="daftar-bab" className="group flex scroll-mt-20 items-center">
            <a
              href="#daftar-bab"
              className="text-inherit no-underline hover:underline"
            >
              Daftar Bab &amp; Panduan — {info.name}
            </a>
            <a
              href="#daftar-bab"
              className="ms-2 font-mono text-sm text-lp-ink/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-lp-ink"
            >
              #
            </a>
          </h2>
          <p>
            Pilih topik untuk membuka referensi teknis mendalam dengan
            penjelasan arsitektur dan blok konfigurasi:
          </p>

          <div className="not-prose my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {sections.map((sec) => (
              <div
                key={sec.slug}
                className="space-y-3 rounded-xl border border-lp-line bg-lp-paper-2/30 p-4 transition-all hover:bg-lp-paper-2/50"
              >
                <div className="flex items-center justify-between border-b border-lp-line pb-2">
                  <h4 className="font-heading text-xs font-semibold text-lp-ink">
                    {sec.title}
                  </h4>
                  <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2 py-0.5 font-mono text-[10px] text-lp-ink/70">
                    {sec.items.length} artikel
                  </span>
                </div>
                <ul className="space-y-1">
                  {sec.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${product}/${item.slug}`}
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

        {/* Pager to first doc */}
        <DocsPager
          prev={null}
          next={firstDocItem ? { ...firstDocItem, product } : null}
        />
      </div>

      {/* Right Table of Contents */}
      <DocsToc headings={tocHeadings} />
    </div>
  )
}
