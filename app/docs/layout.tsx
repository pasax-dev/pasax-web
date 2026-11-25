import * as React from "react"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsHeaderAuth } from "@/components/docs/docs-header-auth"
import Link from "next/link"
import { ExternalLink, LayoutTemplate } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { fetchPackagistData } from "@/lib/packagist"

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const packagistData = await fetchPackagistData()

  return (
    <div className="flex min-h-screen w-full flex-col bg-lp-paper font-sans text-lp-ink antialiased selection:bg-lp-yellow selection:text-lp-on-yellow lg:flex-row">
      {/* 1. Left Sidebar (desktop full-height + mobile drawer) */}
      <DocsSidebar initialPackagist={packagistData} />

      {/* 2. Main Documentation Container */}
      <div className="flex w-full min-w-0 flex-1 flex-col">
        {/* Desktop Header Action Bar (matching Fumadocs Spacious actions) */}
        <div className="sticky top-0 z-20 hidden h-12 items-center justify-between border-b border-lp-line bg-lp-paper/85 px-8 backdrop-blur-md lg:flex">
          <div className="flex items-center gap-2 font-mono text-xs text-lp-ink/65">
            <span className="inline-block size-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Pasax Suite Documentation</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/showcase"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-lp-ink/75 transition-colors hover:text-lp-ink"
            >
              <LayoutTemplate className="size-3.5" />
              <span>Showcase</span>
            </Link>
            <span className="text-lp-line">|</span>
            <DocsHeaderAuth />
            <span className="text-lp-line">|</span>
            <ThemeToggle className="size-7" />
          </div>
        </div>

        {/* Content Body */}
        <main className="flex w-full flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
