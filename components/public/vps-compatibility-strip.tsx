"use client"

import * as React from "react"
import { Server, Cpu, Check, ShieldCheck, Terminal, Cloud } from "lucide-react"

export function VpsCompatibilityStrip() {
  const providers = [
    { name: "DigitalOcean", type: "Droplets", spec: "1-vCPU / 1GB+" },
    { name: "Hetzner Cloud", type: "Cloud VPS", spec: "CAX11 / CX22" },
    { name: "AWS EC2", type: "t3.micro / t4g", spec: "ARM & x86_64" },
    { name: "Linode / Akamai", type: "Nanode 1GB", spec: "Standard" },
    { name: "Vultr", type: "Cloud Compute", spec: "All Regions" },
    { name: "Contabo", type: "Cloud VPS", spec: "S / M / L" },
    { name: "OVHcloud", type: "VPS Elite", spec: "Anti-DDoS" },
  ]

  const supportedDistros = [
    "Ubuntu 20.04 / 22.04 / 24.04 LTS",
    "Debian 11 (Bullseye) / 12 (Bookworm)",
    "AlmaLinux & Rocky Linux 9+",
    "Alpine Linux 3.18+",
    "Arch Linux (Rolling)",
  ]

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="rounded-base border-2 border-border bg-secondary-background p-6 sm:p-8 xl:p-10 shadow-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]">
              <Server className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-black text-foreground">
                  Universal VPS & Cloud Compatibility
                </span>
                <span className="hidden sm:inline-flex rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  KERNEL 5.4+ READY
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Runs as a single Go binary with &lt; 20 MB RAM footprint. Zero dependencies.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-base border border-border bg-background px-2.5 py-1 font-mono text-[11px] font-bold text-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>x86_64 &amp; aarch64 (ARM)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-base border border-border bg-background px-2.5 py-1 font-mono text-[11px] font-bold text-foreground">
              <span className="size-1.5 rounded-full bg-main" />
              <span>Docker &amp; Baremetal</span>
            </span>
          </div>
        </div>

        {/* VPS Providers Grid */}
        <div className="mt-5">
          <div className="text-[11px] font-mono font-bold uppercase text-muted-foreground mb-3 flex items-center justify-between">
            <span>Verified Cloud VPS Providers</span>
            <span className="text-emerald-600 dark:text-emerald-400">100% Plug &amp; Protect</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {providers.map((p) => (
              <div
                key={p.name}
                className="flex flex-col justify-between rounded-base border-2 border-border bg-background p-2.5 text-center shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/10 transition-colors"
              >
                <div className="font-heading font-black text-xs text-foreground truncate">
                  {p.name}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  {p.type}
                </div>
                <div className="mt-1.5 inline-flex items-center justify-center gap-1 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3" />
                  <span>{p.spec}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linux OS Ticker */}
        <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Terminal className="size-3.5 text-main shrink-0" />
            <span className="font-bold text-foreground">Supported Linux Kernels:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {supportedDistros.map((distro, idx) => (
              <span
                key={idx}
                className="rounded border border-border bg-background/80 px-2 py-0.5 text-[11px] font-semibold text-foreground/90"
              >
                {distro}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
