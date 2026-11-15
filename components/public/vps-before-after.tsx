"use client"

import * as React from "react"
import {
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Flame,
  Zap,
  Lock,
  ArrowRight,
  Server,
  FileCode,
} from "lucide-react"

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
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
          <ShieldCheck className="size-3.5 text-main" />
          <span>THE VPS REALITY CHECK</span>
        </div>
        <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Why Traditional Security Fails on Linux VPS
        </h2>
        <p className="mt-3 text-base font-base text-foreground/80 sm:text-lg">
          Most security tools were built for multi-gigabyte corporate servers, not cost-effective production VPS instances.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-stretch">
        {/* Left: The Legacy VPS Nightmare */}
        <div className="flex flex-col rounded-base border-2 border-border bg-card p-6 sm:p-8 xl:p-10 shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-base border-2 border-border bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <XCircle className="size-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-black text-foreground">
                  Your VPS Without Pasax
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  Vulnerable, bloated &amp; brittle
                </p>
              </div>
            </div>
            <span className="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-xs font-black text-rose-600 dark:text-rose-400 border border-rose-500/30">
              HIGH RISK
            </span>
          </div>

          <div className="space-y-5 flex-1">
            {comparisons.map((item, idx) => (
              <div
                key={idx}
                className="rounded-base border border-border/80 bg-secondary-background p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-heading text-xs font-bold text-foreground">
                    {item.title}
                  </h4>
                  <span className="font-mono text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                    {item.without.badge}
                  </span>
                </div>
                <p className="text-xs text-foreground/70 leading-relaxed font-base">
                  {item.without.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>Resulting Status:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              Unstable server, constant bot noise
            </span>
          </div>
        </div>

        {/* Right: The Pasax Sentinel Advantage */}
        <div className="flex flex-col rounded-base border-2 border-border bg-secondary-background p-6 sm:p-8 xl:p-10 shadow-[4px_4px_0px_0px_var(--border)] ring-2 ring-main">
          <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]">
                <CheckCircle2 className="size-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-black text-foreground">
                  Your VPS With Pasax Sentinel
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  Sub-millisecond kernel immunity
                </p>
              </div>
            </div>
            <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              ARMORED
            </span>
          </div>

          <div className="space-y-5 flex-1">
            {comparisons.map((item, idx) => (
              <div
                key={idx}
                className="rounded-base border-2 border-border bg-card p-4 shadow-[2px_2px_0px_0px_var(--border)]"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-heading text-xs font-black text-foreground">
                    {item.title}
                  </h4>
                  <span className="font-mono text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {item.withPasax.badge}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed font-base">
                  {item.withPasax.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between font-mono text-xs">
            <span className="text-muted-foreground">Resulting Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full kernel immunity with 0.14ms latency</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
