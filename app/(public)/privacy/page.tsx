import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Server,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Privacy Policy | Pasax Security Ecosystem",
  description:
    "Learn how Pasax Security handles telemetry, Linux node metrics, and zero-knowledge data retention across Sentinel daemons, Shield WAF, and Cloud SOC.",
  keywords: [
    "Pasax Privacy Policy",
    "Security Telemetry Privacy",
    "Zero Knowledge Security",
    "Linux Node Privacy",
    "mTLS Data Encryption",
    "GDPR Compliance Security",
  ],
  alternates: {
    canonical: "https://pasax.is-a.dev/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Pasax Security Ecosystem",
    description:
      "Transparent zero-knowledge security telemetry and minimal data retention across Sentinel daemons and Pasax Cloud.",
    url: "https://pasax.is-a.dev/privacy",
    siteName: "Pasax Security",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Pasax Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Pasax Security Ecosystem",
    description:
      "Transparent zero-knowledge security telemetry across Pasax Sentinel and Cloud SOC.",
    images: ["/logo.png"],
  },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 10, 2026"

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
          <span className="text-main">Privacy Policy</span>
        </div>

        {/* Header Block */}
        <div className="rounded-base border-2 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--border)] md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)]">
              <ShieldCheck className="size-4 text-main" />
              <span>DATA PROTECTION COMMITMENT</span>
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
            At <strong>Pasax Security</strong>, we believe security should never
            come at the expense of user privacy. We design our architecture—from
            the raw Go kernel daemon to our central SOC dashboard—around a
            strict <strong>zero-knowledge and minimal data retention</strong>{" "}
            philosophy.
          </p>

          {/* Quick Highlight Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-base border-2 border-border bg-secondary-background/60 p-4">
              <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                <Lock className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Payload Peeking</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-foreground/75">
                We never inspect, store, or transmit your database credentials,
                API secrets, or customer application payloads.
              </p>
            </div>

            <div className="rounded-base border-2 border-border bg-secondary-background/60 p-4">
              <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                <Server className="size-4 text-blue-600 dark:text-blue-400" />
                <span>Egress-Only mTLS</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-foreground/75">
                Telemetry flows outbound only over mutual TLS 1.3. Your Linux
                nodes keep zero open inbound listening ports.
              </p>
            </div>

            <div className="rounded-base border-2 border-border bg-secondary-background/60 p-4">
              <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                <EyeOff className="size-4 text-amber-600 dark:text-amber-400" />
                <span>No Ad Trackers</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-foreground/75">
                No third-party analytics pixels, no behavioral profiling, and
                zero cross-site advertising telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-12 space-y-10">
          {/* Section 1 */}
          <section className="rounded-base border-2 border-border bg-background p-6 shadow-[4px_4px_0px_0px_var(--border)] md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                1
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Scope &amp; Identity
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                This Privacy Policy applies to the Pasax Security ecosystem,
                which comprises:
              </p>
              <ul className="list-inside list-disc space-y-1.5 pl-2 font-medium">
                <li>
                  <strong>pasax-sentinel:</strong> The open-source Go Linux
                  kernel background daemon deployed on user VPS instances.
                </li>
                <li>
                  <strong>pasax/shield:</strong> The Spatie-compliant
                  PHP/Laravel Web Application Firewall (WAF) and honeypot
                  middleware.
                </li>
                <li>
                  <strong>Pasax Cloud SOC Console:</strong> The central
                  web-based dashboard and fleet management API located at{" "}
                  <code>https://pasax.is-a.dev</code>.
                </li>
              </ul>
              <p>
                When you deploy the open-source components in a standalone,
                self-hosted, or air-gapped environment without pairing to Pasax
                Cloud, zero data is transmitted to external servers.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-base border-2 border-border bg-background p-6 shadow-[4px_4px_0px_0px_var(--border)] md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                2
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Telemetry Collected by Pasax Sentinel Daemon
              </h2>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85">
              <p>
                When a node is connected to Pasax Cloud,{" "}
                <code>pasax-sentinel</code> emits strictly structured, defensive
                metadata:
              </p>
              <div className="overflow-x-auto rounded-base border-2 border-border bg-secondary-background">
                <table className="w-full text-left text-xs">
                  <thead className="border-b-2 border-border bg-card font-heading font-black text-foreground uppercase">
                    <tr>
                      <th className="p-3">Data Field</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Transmission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-border font-mono text-[11px]">
                    <tr>
                      <td className="p-3 font-bold text-foreground">
                        Attacker Source IP &amp; Port
                      </td>
                      <td className="p-3 text-foreground/80">
                        Triggering nftables sub-0.2ms packet drops and sharing
                        global reputation.
                      </td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                        Encrypted mTLS
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">
                        Attack Signature (e.g. SQLi/LFI)
                      </td>
                      <td className="p-3 text-foreground/80">
                        Categorizing malicious HTTP requests intercepted by
                        WAF/honeypot.
                      </td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                        Encrypted mTLS
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">
                        FIM File Hash &amp; Permissions
                      </td>
                      <td className="p-3 text-foreground/80">
                        Detecting unauthorized <code>.env</code> file permission
                        drift or webshell creation.
                      </td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                        Hash Only (No Content)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">
                        Node Health (CPU, RAM, Disk)
                      </td>
                      <td className="p-3 text-foreground/80">
                        Monitoring node responsiveness and alerting on daemon
                        crashes or OOM.
                      </td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                        Encrypted mTLS
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-base border-2 border-emerald-500/50 bg-emerald-500/10 p-3.5 text-xs text-foreground/90">
                <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Important Privacy Guarantee:</span>
                </div>
                <p className="mt-1">
                  Pasax Sentinel never reads or transmits database values,
                  customer personal data, PHP session data, or cleartext secret
                  keys from <code>.env</code> files. File Integrity Monitoring
                  hashes paths and checks Linux file permission octals (e.g.
                  enforcing <code>0600</code>) without dumping file contents.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-base border-2 border-border bg-background p-6 shadow-[4px_4px_0px_0px_var(--border)] md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                3
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Account &amp; Dashboard Data
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>When you create an account on Pasax Cloud SOC:</p>
              <ul className="list-inside list-disc space-y-2 pl-2 font-medium">
                <li>
                  <strong>Authentication Credentials:</strong> Your email
                  address and cryptographically salted password hash
                  (Argon2id/bcrypt). We never store cleartext passwords.
                </li>
                <li>
                  <strong>API Tokens:</strong> Node pairing tokens and secret
                  bearer keys are stored in encrypted form using AES-256-GCM.
                </li>
                <li>
                  <strong>Session Cookies:</strong> Strictly necessary HTTP-only
                  authentication cookies to maintain your login session. We do
                  not use third-party tracking cookies or advertising cookies.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-base border-2 border-border bg-background p-6 shadow-[4px_4px_0px_0px_var(--border)] md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                4
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Data Retention &amp; Deletion
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                Security telemetry is inherently ephemeral. We apply automated
                rolling retention windows:
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-base border-2 border-border bg-secondary-background p-3">
                  <span className="font-mono text-xs font-black text-foreground uppercase">
                    Real-time Threat Events
                  </span>
                  <p className="mt-1 text-xs text-foreground/75">
                    Dropped packet counters and attack logs are retained on a
                    rolling <strong>30 to 90 days</strong> schedule, after which
                    they are permanently purged.
                  </p>
                </div>
                <div className="rounded-base border-2 border-border bg-secondary-background p-3">
                  <span className="font-mono text-xs font-black text-foreground uppercase">
                    Node Metadata &amp; Account
                  </span>
                  <p className="mt-1 text-xs text-foreground/75">
                    De-registering a node permanently removes its pairing token
                    and associated heartbeat logs within{" "}
                    <strong>24 hours</strong>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-base border-2 border-border bg-background p-6 shadow-[4px_4px_0px_0px_var(--border)] md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                5
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Global Threat Intelligence Sharing
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                To provide collective fleet immunity, Pasax computes an
                aggregated reputation score of malicious IP addresses (e.g.
                repeated brute-force bots and known CVE exploit scanners).
              </p>
              <p>
                Shared threat indicators are strictly anonymized: no information
                identifying your company, server domain name, or origin internal
                network is ever disclosed to other nodes or third parties.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-base border-2 border-border bg-background p-6 shadow-[4px_4px_0px_0px_var(--border)] md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                6
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Your Rights (GDPR &amp; Global Regulations)
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                Under applicable privacy laws (including GDPR and CCPA), you
                have the right to:
              </p>
              <ul className="list-inside list-disc space-y-1.5 pl-2 font-medium">
                <li>
                  Request an export of all telemetry associated with your
                  account.
                </li>
                <li>
                  Request immediate deletion of your account and paired node
                  histories.
                </li>
                <li>
                  Audit the open-source codebase of <code>pasax-sentinel</code>{" "}
                  and <code>pasax/shield</code> to verify our compliance claims
                  independently.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="rounded-base border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_var(--border)] md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                7
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Contact &amp; Vulnerability Disclosure
              </h2>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85">
              <p>
                If you have questions regarding this Privacy Policy, wish to
                exercise data subject rights, or need to disclose a security
                vulnerability responsibly, please contact our security team:
              </p>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold">
                <a
                  href="mailto:security@pasax.is-a.dev"
                  className={cn(
                    buttonVariants({ variant: "neutral", size: "sm" }),
                    "border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
                  )}
                >
                  <span>security@pasax.is-a.dev</span>
                </a>
                <a
                  href="https://github.com/pasax-dev"
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "flex items-center gap-1.5 border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
                  )}
                >
                  <span>GitHub Security Advisory</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t-2 border-border pt-6 font-heading text-sm font-bold">
          <Link
            href="/terms"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-main hover:underline"
          >
            <span>Review Terms of Service</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-main hover:underline"
          >
            <span>Read Security Documentation</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
