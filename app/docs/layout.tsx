import * as React from "react"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
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
            <a
              href="https://github.com/pasax-dev/pasax-suit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-lp-ink/75 transition-colors hover:text-lp-ink"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
              <ExternalLink className="size-2.5 text-lp-ink/40" />
            </a>
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
