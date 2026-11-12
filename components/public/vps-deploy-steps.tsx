"use client"

import * as React from "react"
import { Terminal, Shield, CheckCircle2, ArrowRight, Zap, Lock, Cpu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function VpsDeploySteps() {
  const steps = [
    {
      num: "01",
      badge: "ONE COMMAND",
      title: "Deploy Single Go Binary",
      description:
        "Execute our audited install script via SSH. It fetches a standalone static Linux binary compiled with zero external dependencies.",
      code: "curl -sSL https://get.pasak.is-a.dev/install.sh | sudo bash",
      tag: "< 15s execution time",
    },
    {
      num: "02",
      badge: "KERNEL HOOKS",
      title: "Autonomous Kernel Wiring",
      description:
        "Sentinel auto-detects nftables and wires isolated drop tables. Inotify watchers attach to your .env and upload directories in milliseconds.",
      code: "# Attached: inotify & nftables\n# RAM Footprint: 18.2 MB (< 0.2%)",
      tag: "Zero manual firewall config",
    },
    {
      num: "03",
      badge: "ZERO-TRUST SOC",
      title: "Instant Live Telemetry",
      description:
        "Establishes an outbound TLS 1.3 mTLS tunnel to your Pasak Cloud SOC. No incoming ports are opened; Shodan port scanners see nothing.",
      code: "# mTLS Handshake: OK\n# Status: ARMORED & SYNCED",
      tag: "0 open inbound ports",
    },
  ]

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="rounded-base border-2 border-border bg-card p-6 sm:p-10 xl:p-14 shadow-shadow">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
            <Zap className="size-3.5 text-amber-500" />
            <span>INSTANT ONBOARDING</span>
          </div>
          <h2 className="font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Protect Your Linux VPS in Under 60 Seconds
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground font-base">
            No complex firewall syntax, no bloated dependencies, and no downtime for your running applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((st, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-6 lg:p-7 shadow-[3px_3px_0px_0px_var(--border)]"
            >
              <div>
                <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-4">
                  <span className="font-heading font-black text-2xl text-main">
                    {st.num}
                  </span>
                  <span className="font-mono text-[10px] font-black uppercase text-foreground bg-background px-2 py-0.5 rounded border border-border">
                    {st.badge}
                  </span>
                </div>

                <h3 className="font-heading text-base font-black text-foreground">
                  {st.title}
                </h3>
                <p className="mt-2 text-xs text-foreground/80 leading-relaxed font-base">
                  {st.description}
                </p>

                <div className="mt-4 rounded border border-border bg-[#070b14] p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre">
                  {st.code}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-muted-foreground">Guarantee:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {st.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t-2 border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]">
              <Terminal className="size-5" />
            </div>
            <div>
              <div className="font-heading font-black text-sm text-foreground">
                Ready to fortify your production VPS?
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Works on DigitalOcean, Hetzner, AWS, Linode, Vultr, and bare metal servers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2 font-heading text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
            >
              <span>Launch Free SOC Console</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
