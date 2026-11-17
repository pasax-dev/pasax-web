"use client"

import * as React from "react"
import { Server, Check, Terminal } from "lucide-react"

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
    "Debian 11 / 12",
    "AlmaLinux & Rocky 9+",
    "Alpine Linux 3.18+",
    "Arch Linux",
  ]

  return (
    <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-md sm:p-8 xl:p-10">
        <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-500">
              <Server className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-base font-bold text-foreground">
                  Universal VPS &amp; Cloud Compatibility
                </span>
                <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-500 sm:inline-flex">
                  KERNEL 5.4+ READY
                </span>
              </div>
              <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                Runs as a single Go binary with &lt; 20 MB RAM footprint. Zero
                dependencies.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 px-3 py-1 font-mono text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>x86_64 &amp; aarch64 (ARM)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 px-3 py-1 font-mono text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-sky-500" />
              <span>Docker &amp; Baremetal</span>
            </span>
          </div>
        </div>

        {/* VPS Providers Grid */}
        <div className="mt-6">
          <div className="mb-3.5 flex items-center justify-between font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <span>Verified Cloud VPS Providers</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-500">
              100% Plug &amp; Protect
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {providers.map((p) => (
              <div
                key={p.name}
                className="flex flex-col justify-between rounded-xl border border-border/40 bg-muted/20 p-3 text-center transition-all hover:border-sky-500/30 hover:bg-muted/40"
              >
                <div className="truncate font-sans text-xs font-semibold text-foreground">
                  {p.name}
                </div>
                <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  {p.type}
                </div>
                <div className="mt-2 inline-flex items-center justify-center gap-1 font-mono text-[10px] font-medium text-emerald-500">
                  <Check className="size-3" />
                  <span>{p.spec}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linux OS Ticker */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4 font-sans text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Terminal className="size-4 shrink-0 text-sky-500" />
            <span className="font-medium text-foreground">
              Supported Linux Kernels:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {supportedDistros.map((distro, idx) => (
              <span
                key={idx}
                className="rounded-full border border-border/40 bg-muted/30 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
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
