import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import {
  FileText,
  ShieldAlert,
  Scale,
  Terminal,
  Server,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Code2,
  Lock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Terms of Service | Pasak Security Ecosystem",
  description:
    "Review the terms, conditions, acceptable use policies, and open-source licensing governing Pasak Sentinel daemons, Shield WAF, and Cloud SOC console.",
  keywords: [
    "Pasak Terms of Service",
    "Security Software Terms",
    "Acceptable Use Policy",
    "MIT Open Source License",
    "Linux Node Security Disclaimer",
    "Kernel Daemon Terms",
  ],
  alternates: {
    canonical: "https://pasak.is-a.dev/terms",
  },
  openGraph: {
    title: "Terms of Service | Pasak Security Ecosystem",
    description:
      "Transparent terms and responsible security use guidelines for Pasak Sentinel, Shield WAF, and Cloud SOC.",
    url: "https://pasak.is-a.dev/terms",
    siteName: "Pasak Security",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Pasak Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Pasak Security Ecosystem",
    description: "Terms, conditions, and responsible use policies for Pasak Security Suite.",
    images: ["/logo.png"],
  },
}

export default function TermsOfServicePage() {
  const lastUpdated = "November 10, 2026"
  const version = "1.7.0"

  return (
    <div className="w-full max-w-full py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Top Tag */}
        <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Legal</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-main">Terms of Service</span>
        </div>

        {/* Header Block */}
        <div className="rounded-base border-2 border-border bg-card p-6 md:p-10 shadow-[6px_6px_0px_0px_var(--border)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)]">
              <Scale className="size-4 text-main" />
              <span>LEGAL AGREEMENT &bull; v{version}</span>
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Please read these Terms of Service carefully before installing <strong>pasak-sentinel</strong>,
            incorporating <strong>pasak/shield</strong>, or using the <strong>Pasak Cloud SOC</strong> dashboard.
            By accessing or operating any part of our ecosystem, you agree to be bound by these terms.
          </p>

          {/* Quick Pillars */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-base border-2 border-border bg-secondary-background/60 p-4">
              <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                <ShieldAlert className="size-4 text-rose-600 dark:text-rose-400" />
                <span>Defensive Intent Only</span>
              </div>
              <p className="mt-2 text-xs text-foreground/75 leading-relaxed">
                Pasak is strictly designed for defensive threat mitigation, server hardening, and authorized audit environments.
              </p>
            </div>

            <div className="rounded-base border-2 border-border bg-secondary-background/60 p-4">
              <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                <Code2 className="size-4 text-blue-600 dark:text-blue-400" />
                <span>MIT Licensed Core</span>
              </div>
              <p className="mt-2 text-xs text-foreground/75 leading-relaxed">
                Core daemons and WAF libraries are 100% open source and verifiable on GitHub under the permissive MIT license.
              </p>
            </div>

            <div className="rounded-base border-2 border-border bg-secondary-background/60 p-4">
              <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                <Terminal className="size-4 text-amber-600 dark:text-amber-400" />
                <span>User Root Responsibility</span>
              </div>
              <p className="mt-2 text-xs text-foreground/75 leading-relaxed">
                Deploying kernel-level daemon tools requires elevated Linux permissions under your own administrative control.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-12 space-y-10">
          {/* Section 1 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                1
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Agreement &amp; Acceptance
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                By creating an account on <code>https://pasak.is-a.dev</code>, obtaining an API token, or installing the <code>pasak-sentinel</code> daemon onto any virtual private server (VPS) or bare-metal host, you represent that:
              </p>
              <ul className="list-inside list-disc space-y-1.5 pl-2 font-medium">
                <li>You have legal authority to administer and deploy security monitoring on the target machines.</li>
                <li>You are at least 18 years of age or possess legal capacity in your jurisdiction.</li>
                <li>You will use the suite strictly in accordance with these Terms and all applicable cybercrime, privacy, and data security laws.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                2
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Acceptable Use Policy (AUP)
              </h2>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85">
              <p>
                Pasak Security provides high-speed packet inspection (nftables), honeypot instrumentation, and inotify File Integrity Monitoring. You agree <strong>NOT</strong> to:
              </p>
              <div className="space-y-2 rounded-base border-2 border-rose-500/50 bg-rose-500/10 p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>Prohibited Activities:</span>
                </div>
                <ul className="list-inside list-disc space-y-1 pl-1 text-foreground/90">
                  <li>Deploying Pasak on hosts, cloud instances, or networks for which you do not possess verified ownership or express written authorization.</li>
                  <li>Using Pasak telemetry endpoints to launch denial-of-service (DDoS) attacks, flood reputation feeds, or poison global threat blocklists.</li>
                  <li>Attempting to spoof node identity tokens or intercept mTLS telemetry from neighboring nodes.</li>
                  <li>Circumventing licensing, billing meters, or rate-limiting thresholds implemented by the Pasak Cloud API.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                3
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Root &amp; Kernel-Level Privileges
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                Because <code>pasak-sentinel</code> interacts with raw Linux kernel subsystems (specifically <code>nftables</code> packet filtering and <code>inotify</code> file system hooks), it operates as a privileged <code>systemd</code> service.
              </p>
              <p>
                You acknowledge and agree that:
              </p>
              <ul className="list-inside list-disc space-y-1.5 pl-2 font-medium">
                <li>You are solely responsible for reviewing firewall rule definitions before enabling automated drop thresholds.</li>
                <li>Pasak provides automated safeguards (such as automatic SSH port exemption and whitelist fallbacks) to prevent administrative lockouts, but you remain responsible for maintaining console or out-of-band access to your VPS.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                4
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Open Source Licensing vs. Cloud Services
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                The Pasak software ecosystem consists of two distinct tiers:
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-base border-2 border-border bg-secondary-background p-4">
                  <Badge variant="outline" className="font-mono text-[10px] font-bold">
                    MIT Open Source License
                  </Badge>
                  <h4 className="mt-2 font-heading text-sm font-black text-foreground">
                    Sentinel &amp; Shield Packages
                  </h4>
                  <p className="mt-1 text-xs text-foreground/75 leading-relaxed">
                    The source code of <code>pasak-sentinel</code> and <code>pasak/shield</code> is freely available under the MIT License. You may modify, fork, and distribute it in compliance with the MIT copyright notice.
                  </p>
                </div>

                <div className="rounded-base border-2 border-border bg-secondary-background p-4">
                  <Badge variant="outline" className="font-mono text-[10px] font-bold">
                    Proprietary SaaS / Cloud Console
                  </Badge>
                  <h4 className="mt-2 font-heading text-sm font-black text-foreground">
                    Pasak Cloud SOC Platform
                  </h4>
                  <p className="mt-1 text-xs text-foreground/75 leading-relaxed">
                    The hosted multi-tenant cloud dashboard, 3D threat map visualization, and real-time mesh routing infrastructure are proprietary services provided under subscription or free-tier quotas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                5
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Disclaimer of Warranties
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p className="font-mono text-xs uppercase text-muted-foreground">
                PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY
              </p>
              <p>
                To the maximum extent permitted by applicable law, the Pasak software suite and Cloud SOC platform are provided on an <strong>&quot;AS IS&quot; and &quot;AS AVAILABLE&quot;</strong> basis, without warranties of any kind, either express or implied, including but not limited to merchantability, fitness for a particular purpose, non-infringement, or error-free operation.
              </p>
              <p>
                While Pasak implements autonomous sub-0.2ms drops and instant FIM file locks, <strong>no security solution can guarantee 100% immunity</strong> against novel zero-day exploits, physical host breaches, or upstream ISP disruptions.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                6
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Limitation of Liability
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                In no event shall the authors, maintainers, or Pasak Security team be held liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including loss of profits, data corruption, business interruption, or server downtime) arising in any way out of the use or inability to use this software.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="rounded-base border-2 border-border bg-card p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                7
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Modifications &amp; Contact
              </h2>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85">
              <p>
                We reserve the right to modify these Terms of Service at any time. When updates are published, the &quot;Last updated&quot; date at the top of this document will be amended. Your continued use of the platform constitutes acceptance of the revised terms.
              </p>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold">
                <a
                  href="mailto:legal@pasak.is-a.dev"
                  className={cn(
                    buttonVariants({ variant: "neutral", size: "sm" }),
                    "border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
                  )}
                >
                  <span>legal@pasak.is-a.dev</span>
                </a>
                <Link
                  href="/privacy"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
                  )}
                >
                  <span>View Privacy Policy</span>
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t-2 border-border pt-6 font-heading text-sm font-bold">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-main hover:underline"
          >
            <span>Review Privacy Policy</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-main hover:underline"
          >
            <span>Explore Documentation</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
