"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, ArrowRight, Copy, Check, Terminal, ExternalLink, Clock } from "lucide-react"
import { PRODUCTS_CONFIG, getDocSectionsForProduct } from "@/lib/docs-manifest"
import { DocsBreadcrumb } from "./docs-breadcrumb"
import { DocsToc } from "./docs-toc"
import { DocsPager } from "./docs-pager"

export type ProductType = "core" | "pasax-secure-monitor" | "pasax-sentinel"

interface ProductDocsOverviewProps {
  product: ProductType
}

const quickSnippets: Record<ProductType, { label: string; cmd: string }> = {
  "pasax-secure-monitor": {
    label: "Composer Require",
    cmd: "composer require pasax/secure-monitor",
  },
  "pasax-sentinel": {
    label: "Single Binary Download",
    cmd: "curl -sSL https://get.pasax.is-a.dev/sentinel.sh | sudo bash",
  },
  core: {
    label: "Full Stack Deployment",
    cmd: "pnpm dlx pasax-cli init --with-sentinel",
  },
}

export function ProductDocsOverview({ product }: ProductDocsOverviewProps) {
  const info = PRODUCTS_CONFIG[product]
  const sections = getDocSectionsForProduct(product)
  const snippet = quickSnippets[product]
  const [copied, setCopied] = React.useState(false)

  // First available document link
  const firstDocItem =
    sections.length > 0 && sections[0].items.length > 0
      ? sections[0].items[0]
      : null

  const firstDocHref = firstDocItem
    ? `/docs/${product}/${firstDocItem.slug}`
    : `/docs/${product}`

  const copySnippet = () => {
    if (!snippet) return
    navigator.clipboard.writeText(snippet.cmd).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const tocHeadings = [
    { id: "instalasi-perintah", text: "Perintah Cepat", level: 2 },
    { id: "daftar-bab", text: "Daftar Bab & Panduan", level: 2 },
  ]

  const repoUrl =
    product === "pasax-sentinel"
      ? "https://github.com/pasax-dev/pasax-sentinel"
      : product === "core"
        ? "https://github.com/pasax-dev/pasax-suit"
        : "https://github.com/pasax-dev/pasax-secure-monitor-laravel"

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
            <span className="rounded-full border border-lp-orange/20 dark:border-lp-yellow/20 bg-lp-orange/10 dark:bg-lp-yellow/10 px-2.5 py-0.5 font-mono text-xs font-medium text-lp-orange dark:text-lp-yellow">
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
          </div>

          <h1 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-lp-ink sm:text-4xl lg:text-5xl">
            {info.name}
          </h1>

          <p className="text-base leading-relaxed text-lp-ink/75 sm:text-lg max-w-3xl">
            {info.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href={firstDocHref}
              className="inline-flex items-center gap-2 rounded-lg bg-lp-ink text-lp-paper px-4 py-2 font-mono text-xs font-medium hover:opacity-90 active:scale-98 transition-all"
            >
              <span>Mulai Membaca Panduan</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3.5 py-2 font-mono text-xs font-medium text-lp-ink hover:bg-lp-paper-2 transition-colors"
            >
              <span>Lihat di GitHub</span>
              <ExternalLink className="size-3 text-lp-ink/50" />
            </a>
          </div>
        </header>

        {/* Section 1: Quick Command */}
        {snippet && (
          <section className="docs-content mb-10">
            <h2 id="instalasi-perintah" className="group flex items-center scroll-mt-20">
              <a href="#instalasi-perintah" className="no-underline text-inherit hover:underline">
                Perintah Instalasi Cepat
              </a>
              <a href="#instalasi-perintah" className="ms-2 opacity-0 group-hover:opacity-100 text-lp-ink/40 hover:text-lp-ink font-mono text-sm transition-opacity">#</a>
            </h2>
            <div className="my-4 rounded-xl border border-lp-line bg-[#121210] p-4 font-mono text-xs text-[#eceae2] flex items-center justify-between overflow-x-auto not-prose">
              <code>{snippet.cmd}</code>
              <button
                onClick={copySnippet}
                className="ms-4 shrink-0 flex items-center gap-1 text-[11px] text-[#eceae2]/70 hover:text-white px-2 py-1 rounded bg-[#181816] border border-[rgba(236,234,226,0.1)] transition-colors cursor-pointer"
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
          </section>
        )}

        {/* Section 2: Chapters & Guides */}
        <section className="docs-content mb-12">
          <h2 id="daftar-bab" className="group flex items-center scroll-mt-20">
            <a href="#daftar-bab" className="no-underline text-inherit hover:underline">
              Daftar Bab &amp; Panduan — {info.name}
            </a>
            <a href="#daftar-bab" className="ms-2 opacity-0 group-hover:opacity-100 text-lp-ink/40 hover:text-lp-ink font-mono text-sm transition-opacity">#</a>
          </h2>
          <p>
            Pilih topik untuk membuka referensi teknis mendalam dengan penjelasan arsitektur dan blok konfigurasi:
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 my-6 not-prose">
            {sections.map((sec) => (
              <div
                key={sec.slug}
                className="space-y-3 rounded-xl border border-lp-line bg-lp-paper-2/30 p-4 transition-all hover:bg-lp-paper-2/50"
              >
                <div className="flex items-center justify-between border-b border-lp-line pb-2">
                  <h4 className="font-heading text-xs font-semibold text-lp-ink">{sec.title}</h4>
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
