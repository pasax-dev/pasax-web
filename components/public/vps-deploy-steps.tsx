"use client"

import * as React from "react"
import { Terminal, ArrowRight, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function VpsDeploySteps() {
  const steps = [
    {
      num: "01",
      badge: "ONE COMMAND",
      badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-500",
      numColor: "text-amber-500",
      title: "Deploy Single Go Binary",
      description:
        "Execute our audited install script via SSH. It fetches a standalone static Linux binary compiled with zero external dependencies.",
      code: "curl -sSL https://get.pasax.is-a.dev/install.sh | sudo bash",
      tag: "< 15s execution time",
    },
    {
      num: "02",
      badge: "KERNEL HOOKS",
      badgeColor: "border-sky-500/30 bg-sky-500/10 text-sky-500",
      numColor: "text-sky-500",
      title: "Autonomous Kernel Wiring",
      description:
        "Sentinel auto-detects nftables and wires isolated drop tables. Inotify watchers attach to your .env and upload directories in milliseconds.",
      code: "# Attached: inotify & nftables\n# RAM Footprint: 18.2 MB (< 0.2%)",
      tag: "Zero manual firewall config",
    },
    {
      num: "03",
      badge: "ZERO-TRUST SOC",
      badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
      numColor: "text-emerald-500",
      title: "Instant Live Telemetry",
      description:
        "Establishes an outbound TLS 1.3 mTLS tunnel to your Pasax Cloud SOC. No incoming ports are opened; Shodan port scanners see nothing.",
      code: "# mTLS Handshake: OK\n# Status: ARMORED & SYNCED",
      tag: "0 open inbound ports",
    },
  ]

  return (
    <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-md sm:p-10 xl:p-14">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
            <Zap className="size-3.5 text-sky-500" />
            <span>INSTANT ONBOARDING</span>
          </div>
          <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-4xl lg:text-5xl">
            Protect Your Linux VPS in Under 60 Seconds
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            No complex firewall syntax, no bloated dependencies, and no downtime
            for your running applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((st, i) => (
            <div
              key={i}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/40 bg-muted/20 p-6 backdrop-blur-md transition-all hover:border-sky-500/30 hover:bg-muted/30 lg:p-7"
            >
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
                    {st.num}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${st.badgeColor}`}
                  >
                    {st.badge}
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-foreground">
                  {st.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {st.description}
                </p>

                <div className="mt-4 overflow-x-auto rounded-lg border border-border/40 bg-background/60 p-3 font-mono text-[11px] whitespace-pre text-emerald-500">
                  {st.code}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3 font-mono text-[11px]">
                <span className="text-muted-foreground">Guarantee:</span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-500">
                  <CheckCircle2 className="size-3.5" />
                  {st.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-500">
              <Terminal className="size-5" />
            </div>
            <div>
              <div className="font-sans text-sm font-semibold text-foreground">
                Ready to fortify your production VPS?
              </div>
              <p className="font-sans text-xs text-muted-foreground">
                Works on DigitalOcean, Hetzner, AWS, Linode, Vultr, and bare
                metal servers.
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Link
              href="/dashboard"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-sans text-xs font-medium text-background shadow-sm transition-all hover:scale-[1.02] hover:bg-foreground/90 sm:flex-none"
            >
              <span>Launch Free SOC Console</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
