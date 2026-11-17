import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Lock, Globe2, Terminal } from "lucide-react"

function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/80 transition-colors">
      <div className="mx-auto max-w-full px-4 py-12 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {/* Col 1: Brand Info & Status (Span 2 on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/40 transition-transform group-hover:scale-105">
                <Image
                  src="/icon.png"
                  alt="Pasax Suite Icon"
                  width={32}
                  height={32}
                  className="size-full object-contain p-0.5"
                />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                PASAX<span className="text-sky-500">.</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Autonomous, zero-overhead Linux VPS and web fleet immunity.
              Combines kernel-level <strong>sub-0.2ms nftables drops</strong>,
              instant <strong>11ms FIM auto-lock</strong>, and centralized fleet
              SOC telemetry across your distributed servers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-500">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="font-medium">Sentinel Mesh: Operational</span>
              </div>

              <Link
                href="/threats-map"
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-xs font-medium text-rose-500 transition-all hover:bg-rose-500/20"
              >
                <Globe2 className="size-3.5" />
                <span>Global Threat Map</span>
              </Link>
            </div>
          </div>

          {/* Col 2: The Ecosystem */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-foreground uppercase">
              Triple Defense
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs/pasax-sentinel"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  pasax-sentinel (Go Daemon)
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/pasax-secure-monitor"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  pasax/shield (Laravel WAF)
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Fleet SOC Cloud Console
                </Link>
              </li>
              <li>
                <Link
                  href="/threats-map"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  3D Interactive Threat Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Documentation */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-foreground uppercase">
              Documentation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Documentation Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/getting-started/introduction"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Quick Start &amp; Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/core-architecture/threat-detection-engine"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Zero-Tolerance WAF Engine
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/api-reference/api-overview"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Headless REST API
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Open Source */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-foreground uppercase">
              Open Source
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/pasax-dev"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <GithubIcon className="size-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/pasax-dev"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Report Vulnerability
                </a>
              </li>
              <li>
                <span className="block pt-1 font-mono text-xs text-muted-foreground">
                  MIT Licensed &bull; 100% Auditable
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
            <span>
              &copy; {new Date().getFullYear()} Pasax Security Ecosystem.
            </span>
            <span className="hidden sm:inline">&bull;</span>
            <Link
              href="/privacy"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link
              href="/terms"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-500">
              <Lock className="size-3.5" />
              <span>TLS 1.3 mTLS Encrypted</span>
            </span>
            <span>&bull;</span>
            <span>Zero Inbound Ports</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
