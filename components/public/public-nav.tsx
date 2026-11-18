"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu,
  X,
  ChevronDown,
  Terminal,
  ShieldCheck,
  Code2,
  Layers,
  History,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchTrigger } from "@/components/search/search-trigger"
import { IllosThreatDetection } from "@/components/illos"
import { cn } from "@/lib/utils"

export function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [docsDropdownOpen, setDocsDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDocsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-lp-line bg-lp-paper/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 w-full max-w-(--lp-max) items-center justify-between px-(--lp-gutter)">
        {/* Left: Brand Logo & Title (matching Fumadocs NavTitle) */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 font-medium text-lp-ink transition-opacity hover:opacity-90"
          >
            <div className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-lp-line bg-lp-paper-2">
              <Image
                src="/icon.png"
                alt="Pasax"
                width={24}
                height={24}
                className="size-full object-contain p-0.5"
                priority
              />
            </div>
            <span className="font-heading text-sm font-semibold tracking-tight text-lp-ink">
              Pasax
            </span>
          </Link>

          {/* Desktop Navigation Menu (matching Fumadocs HomeLayout nav) */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {/* Documentation Mega-Menu Dropdown */}
            <div className="relative" ref={dropdownRef} onMouseEnter={() => setDocsDropdownOpen(true)} onMouseLeave={() => setDocsDropdownOpen(false)}>
              <button
                type="button"
                onClick={() => setDocsDropdownOpen((v) => !v)}
                aria-expanded={docsDropdownOpen}
                className={cn(
                  "inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-lp-ink-2 transition-colors hover:text-lp-ink",
                  docsDropdownOpen && "text-lp-ink"
                )}
              >
                <span>Documentation</span>
                <ChevronDown
                  className={cn(
                    "size-3 text-lp-ink-2 transition-transform duration-200",
                    docsDropdownOpen && "rotate-180 text-lp-ink"
                  )}
                />
              </button>

              {docsDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-[640px] animate-in rounded-xl border border-lp-line bg-lp-paper p-3 shadow-2xl transition-all fade-in-0 zoom-in-95"
                >
                  <div className="grid grid-cols-12 gap-3">
                    {/* Left Preview Card */}
                    <Link
                      href="/docs"
                      onClick={() => setDocsDropdownOpen(false)}
                      className="group col-span-5 flex flex-col justify-between overflow-hidden rounded-lg border border-lp-line bg-lp-paper-2 p-3 transition-colors hover:border-lp-line-strong hover:bg-lp-paper"
                    >
                      <div>
                        {/* Illos Threat Detection Animated Preview */}
                        <div className="relative -mx-3 -mt-3 mb-2.5 flex h-28 items-center justify-center overflow-hidden rounded-t-lg border-b border-lp-line bg-lp-paper-2/60 transition-colors group-hover:bg-lp-paper">
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.1),transparent_70%)]" />
                          <div className="relative flex size-full items-center justify-center overflow-hidden p-1">
                            <IllosThreatDetection
                              className="size-full max-h-full max-w-full transition-transform duration-300 group-hover:scale-105 [&_svg]:size-full [&_svg]:object-contain"
                              style={
                                {
                                  "--illos-ground": "var(--lp-paper)",
                                  "--illos-ink": "var(--lp-ink)",
                                  "--illos-line": "var(--lp-line-strong)",
                                  "--illos-faint": "var(--lp-line)",
                                  "--illos-accent":
                                    "var(--color-lp-orange, #ff6b00)",
                                  "--illos-accent-dim":
                                    "rgba(255, 107, 0, 0.4)",
                                  "--illos-alert": "#ff4d50",
                                } as React.CSSProperties
                              }
                            />
                          </div>
                          {/* Live indicator tag */}
                          <div className="pointer-events-none absolute bottom-1.5 left-2 flex items-center gap-1.5 rounded-full border border-lp-line bg-lp-paper/95 px-2 py-0.5 font-mono text-[10px] text-lp-ink shadow-xs backdrop-blur-sm">
                            <span className="size-1.5 animate-pulse rounded-full bg-lp-orange" />
                            <span>v1.0 Sentinel Core</span>
                          </div>
                        </div>

                        <p className="font-heading text-xs font-semibold text-lp-ink">
                          Getting Started
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-lp-ink-2">
                          Learn to deploy and integrate Pasax security in
                          minutes.
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-1 font-mono text-[10px] font-medium text-lp-orange">
                        <span>Explore overview</span>
                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>

                    {/* Right Items Grid */}
                    <div className="col-span-7 flex flex-col justify-between gap-1.5">
                      <Link
                        href="/docs/pasax-sentinel"
                        onClick={() => setDocsDropdownOpen(false)}
                        className="group flex items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-lp-paper-2"
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-lp-line bg-lp-paper text-lp-ink">
                          <Terminal className="size-3.5 text-lp-orange" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading text-xs font-medium text-lp-ink group-hover:text-lp-orange">
                            Sentinel Daemon
                          </p>
                          <p className="line-clamp-1 text-[11px] text-lp-ink-2">
                            Go 1.24 raw kernel drops &amp; FIM auto-lock.
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/docs/pasax-secure-monitor"
                        onClick={() => setDocsDropdownOpen(false)}
                        className="group flex items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-lp-paper-2"
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-lp-line bg-lp-paper text-lp-ink">
                          <ShieldCheck className="size-3.5 text-lp-orange" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading text-xs font-medium text-lp-ink group-hover:text-lp-orange">
                            Shield WAF
                          </p>
                          <p className="line-clamp-1 text-[11px] text-lp-ink-2">
                            Zero-dependency Laravel application firewall.
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/docs/core-architecture/threat-detection-engine"
                        onClick={() => setDocsDropdownOpen(false)}
                        className="group flex items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-lp-paper-2"
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-lp-line bg-lp-paper text-lp-ink">
                          <Layers className="size-3.5 text-lp-orange" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading text-xs font-medium text-lp-ink group-hover:text-lp-orange">
                            Trinity Architecture
                          </p>
                          <p className="line-clamp-1 text-[11px] text-lp-ink-2">
                            Triple-layer mesh linking kernel, app &amp; cloud.
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/docs/api-reference/api-overview"
                        onClick={() => setDocsDropdownOpen(false)}
                        className="group flex items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-lp-paper-2"
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-lp-line bg-lp-paper text-lp-ink">
                          <Code2 className="size-3.5 text-lp-orange" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading text-xs font-medium text-lp-ink group-hover:text-lp-orange">
                            REST API Reference
                          </p>
                          <p className="line-clamp-1 text-[11px] text-lp-ink-2">
                            Headless security endpoints and threat hooks.
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Bottom Full-Width Bar: Changelog / Release Notes */}
                    <div className="col-span-12 border-t border-lp-line pt-2">
                      <Link
                        href="/changelog"
                        onClick={() => setDocsDropdownOpen(false)}
                        className="group flex items-center justify-between rounded-lg p-2 text-xs text-lp-ink-2 transition-colors hover:bg-lp-paper-2 hover:text-lp-ink"
                      >
                        <div className="flex items-center gap-2">
                          <History className="size-3.5 text-lp-orange" />
                          <span className="font-medium text-lp-ink">
                            Changelog &amp; Release Notes
                          </span>
                          <span className="text-[11px] text-lp-ink-2">
                            &bull; Latest security patches and advisories
                          </span>
                        </div>
                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link
              href="/threats-map"
              className="inline-flex h-8 items-center px-2.5 text-xs font-medium text-lp-ink-2 transition-colors hover:text-lp-ink"
            >
              Threat Map
            </Link>

            <Link
              href="/#benchmark"
              className="inline-flex h-8 items-center px-2.5 text-xs font-medium text-lp-ink-2 transition-colors hover:text-lp-ink"
            >
              Benchmark
            </Link>

            <Link
              href="/#faq"
              className="inline-flex h-8 items-center px-2.5 text-xs font-medium text-lp-ink-2 transition-colors hover:text-lp-ink"
            >
              FAQ
            </Link>
          </nav>
        </div>

        {/* Right Utilities: Search, GitHub, Theme Toggle, Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Global Fumadocs Search */}
          <SearchTrigger variant="navbar" className="hidden sm:inline-flex" />
          <SearchTrigger variant="icon" className="sm:hidden" />

          {/* GitHub Icon Link */}
          <a
            href="https://github.com/pasax-dev"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub Repository"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-ink transition-colors hover:bg-lp-paper-2"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>

          {/* Clean Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-ink transition-colors hover:bg-lp-paper-2 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-lp-line bg-lp-paper/98 p-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2">
            <SearchTrigger
              variant="sidebar"
              placeholder="Cari dokumentasi..."
              onClick={() => setMobileMenuOpen(false)}
            />

            <nav className="flex flex-col gap-1 pt-2">
              <Link
                href="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-xs font-medium text-lp-ink hover:bg-lp-paper-2"
              >
                <BookOpen className="size-4 text-lp-orange" />
                <span>Dokumentasi Resmi</span>
              </Link>

              <Link
                href="/docs/pasax-sentinel"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-xs font-medium text-lp-ink hover:bg-lp-paper-2"
              >
                <Terminal className="size-4 text-lp-orange" />
                <span>pasax-sentinel (Go Kernel Daemon)</span>
              </Link>

              <Link
                href="/docs/pasax-secure-monitor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-xs font-medium text-lp-ink hover:bg-lp-paper-2"
              >
                <ShieldCheck className="size-4 text-lp-orange" />
                <span>pasax/shield (Laravel WAF)</span>
              </Link>

              <Link
                href="/threats-map"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-xs font-medium text-lp-ink hover:bg-lp-paper-2"
              >
                <Sparkles className="size-4 text-lp-orange" />
                <span>Global Threat Map (3D)</span>
              </Link>

              <Link
                href="/#benchmark"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-xs font-medium text-lp-ink hover:bg-lp-paper-2"
              >
                <span>Benchmark vs Fail2ban</span>
              </Link>

              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-xs font-medium text-lp-ink hover:bg-lp-paper-2"
              >
                <span>FAQ</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
