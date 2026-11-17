"use client"

import * as React from "react"
import {
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export function VpsBeforeAfter() {
  const comparisons = [
    {
      title: "Memory & CPU Consumption on 1GB VPS",
      without: {
        badge: "FATAL OOM CRASH",
        text: "Traditional SIEMs (Wazuh, OSSEC, Java agents) consume 800MB–2GB RAM, triggering Linux OOM-killer and crashing your MySQL database or web workers.",
      },
      withPasax: {
        badge: "< 18 MB RAM",
        text: "Compiled Go daemon runs silently in kernel-space with < 0.2% CPU overhead. Your apps get 98%+ of your VPS resources undisturbed.",
      },
    },
    {
      title: "Attack Mitigation Velocity",
      without: {
        badge: "15–45s DELAY",
        text: "Fail2ban and regex log-parsers wait for access logs to flush to disk before banning. By then, automated scanners have already executed hundreds of exploit payloads.",
      },
      withPasax: {
        badge: "< 0.15ms KERNEL DROP",
        text: "Direct integration with Linux netfilter (nftables). Drops malicious packets at OSI Layer 3/4 before packets ever reach Nginx, Apache, or PHP-FPM.",
      },
    },
    {
      title: "Sensitive App Files (.env, wp-config.php)",
      without: {
        badge: "PERMANENT LEAK",
        text: "A webshell or arbitrary file write overwrites .env or config files, extracting your DB_PASSWORD and AWS_SECRET_KEY within seconds.",
      },
      withPasax: {
        badge: "11ms AUTO-HEALING",
        text: "Inotify kernel hooks detect unauthorized file writes in real time, instantly snapshots the tamper diff, and forces file permissions to 0600.",
      },
    },
    {
      title: "Firewall & Port Scanner Exposure",
      without: {
        badge: "EXPOSED TO SHODAN",
        text: "Agents require opening inbound listening ports (e.g. 1514, 514, 8080) on your VPS, making your server discoverable on Shodan and Censys.",
      },
      withPasax: {
        badge: "ZERO OPEN INBOUND PORTS",
        text: "Operates 100% on egress-only TLS 1.3 mTLS tunnels. Your VPS firewall rejects all unsolicited incoming connections completely.",
      },
    },
  ]

  return (
    <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
          <ShieldCheck className="size-3.5 text-sky-500" />
          <span>THE VPS REALITY CHECK</span>
        </div>
        <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-5xl">
          Why Traditional Security Fails on Linux VPS
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          Most security tools were built for multi-gigabyte corporate servers,
          not cost-effective production VPS instances.
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10">
        {/* Left: The Legacy VPS Nightmare */}
        <div className="flex flex-col rounded-2xl border border-rose-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-rose-500/30 sm:p-8 xl:p-10">
          <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500">
                <XCircle className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Your VPS Without Pasax
                </h3>
                <p className="font-sans text-xs text-muted-foreground">
                  Vulnerable, bloated &amp; brittle
                </p>
              </div>
            </div>
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 font-sans text-xs font-medium text-rose-500">
              High Risk
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            {comparisons.map((c, i) => (
              <div
                key={i}
                className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-sm font-semibold text-foreground">
                    {c.title}
                  </span>
                  <span className="shrink-0 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-rose-500">
                    {c.without.badge}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {c.without.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 border-t border-border/40 pt-4 font-mono text-xs text-rose-500">
            <AlertTriangle className="size-4 shrink-0" />
            <span>
              Average time to rootkit compromise on unmonitored VPS: &lt; 4
              hours
            </span>
          </div>
        </div>

        {/* Right: The Pasax Fortified Reality */}
        <div className="flex flex-col rounded-2xl border border-emerald-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-emerald-500/30 sm:p-8 xl:p-10">
          <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Your VPS Armored by Pasax
                </h3>
                <p className="font-sans text-xs text-emerald-500">
                  Zero memory drain, sub-millisecond drops
                </p>
              </div>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-sans text-xs font-medium text-emerald-500">
              Armored
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            {comparisons.map((c, i) => (
              <div
                key={i}
                className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-sm font-semibold text-foreground">
                    {c.title}
                  </span>
                  <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-500">
                    {c.withPasax.badge}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {c.withPasax.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4 font-sans text-xs font-medium text-emerald-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 shrink-0" />
              <span>Full kernel protection ready in &lt; 60 seconds</span>
            </span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 font-semibold text-sky-500 hover:text-sky-400"
            >
              <span>Test Sentinel</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
