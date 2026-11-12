import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Lock,
  Globe2,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Sparkles,
} from "lucide-react"

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
    <footer className="border-t-2 border-border bg-secondary-background">
      <div className="mx-auto max-w-full px-4 py-12 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {/* Col 1: Brand Info & Status (Span 2 on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-base border-2 border-border bg-card shadow-[2px_2px_0px_0px_var(--border)] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                <Image
                  src="/icon.png"
                  alt="Pasak Suite Icon"
                  width={36}
                  height={36}
                  className="size-full object-contain p-0.5"
                />
              </div>
              <span className="font-heading text-xl font-black tracking-tight text-foreground">
                PASAK<span className="text-main">.</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed font-base text-foreground/80">
              Autonomous, zero-overhead Linux VPS and web fleet immunity.
              Combines kernel-level <strong>sub-0.2ms nftables drops</strong>,
              instant <strong>11ms FIM auto-lock</strong>, and centralized fleet
              SOC telemetry across your distributed servers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-background px-3 py-1 font-mono text-xs shadow-[2px_2px_0px_0px_var(--border)]">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="font-bold text-foreground">
                  Sentinel Mesh: Operational
                </span>
              </div>

              <Link
                href="/threats-map"
                className="inline-flex items-center gap-1.5 rounded-base border-2 border-rose-500/50 bg-rose-500/10 px-3 py-1 font-mono text-xs font-bold text-rose-600 shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 dark:text-rose-400"
              >
                <Globe2 className="size-3.5" />
                <span>Global Threat Map</span>
              </Link>
            </div>
          </div>

          {/* Col 2: The Ecosystem */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-black tracking-wider text-foreground uppercase">
              Triple Defense
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  href="/docs/pasak-sentinel"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  pasak-sentinel (Go Daemon)
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/pasak-security-monitor"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  pasak/shield (Laravel WAF)
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  Pasak Cloud (Fleet SOC)
                </Link>
              </li>
              <li>
                <Link
                  href="/threats-map"
                  className="flex items-center gap-1.5 text-foreground/80 hover:text-foreground hover:underline"
                >
                  <span>3D Live Threat Map</span>
                  <span className="flex size-1.5 animate-pulse rounded-full bg-rose-500" />
                </Link>
              </li>
              <li>
                <a
                  href="/#telemetry"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  Real-time Telemetry Feed
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Documentation & Guides */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-black tracking-wider text-foreground uppercase">
              Documentation
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  href="/docs"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  Documentation Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/pasak-sentinel"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  Sentinel Kernel Setup
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/pasak-security-monitor"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  Laravel WAF &amp; Honeypots
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/api-reference/api-overview"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  REST API Reference
                </Link>
              </li>
              <li>
                <a
                  href="/#vps-comparison"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  Pasak vs Legacy SIEM
                </a>
              </li>
              <li>
                <a
                  href="/#faq"
                  className="text-foreground/80 hover:text-foreground hover:underline"
                >
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-black tracking-wider text-foreground uppercase">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  href="/privacy"
                  className="font-bold text-foreground hover:text-main hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="font-bold text-foreground hover:text-main hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/pasak-dev"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-foreground/80 hover:text-foreground hover:underline"
                >
                  <GithubIcon className="size-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/pasak-dev"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground/80 hover:text-foreground hover:underline"
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t-2 border-border pt-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
            <span>
              &copy; {new Date().getFullYear()} Pasak Security Ecosystem.
            </span>
            <span className="hidden sm:inline">&bull;</span>
            <Link
              href="/privacy"
              className="text-foreground/75 hover:text-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link
              href="/terms"
              className="text-foreground/75 hover:text-foreground hover:underline"
            >
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Lock className="size-3.5 text-emerald-500" />
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
