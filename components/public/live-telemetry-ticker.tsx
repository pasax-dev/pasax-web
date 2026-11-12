"use client"

import * as React from "react"
import Link from "next/link"
import { Globe2, ShieldCheck, Zap, Activity, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function LiveTelemetryTicker() {
  const [ticks, setTicks] = React.useState(14892590)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTicks((prev) => prev + Math.floor(Math.random() * 3 + 1))
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full border-y-2 border-border bg-secondary-background/95 py-2.5 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 backdrop-blur-sm">
      <div className="mx-auto flex max-w-full flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Live Status & Mesh telemetry */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-heading font-black tracking-wide text-foreground">
              MESH TELEMETRY
            </span>
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          {/* Trinity status */}
          <div className="hidden items-center gap-3 font-mono text-[11px] font-semibold text-muted-foreground md:flex">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-sky-400" />
              <span>L1 Shield: <strong className="text-foreground">ONLINE</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>L2 Sentinel: <strong className="text-foreground">0.14ms DROP</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-amber-400" />
              <span>L3 Cloud SOC: <strong className="text-foreground">mTLS SYNC</strong></span>
            </span>
          </div>
        </div>

        {/* Center: Live Counter */}
        <div className="flex items-center gap-2 font-mono">
          <Activity className="size-3.5 text-rose-500 animate-pulse" />
          <span className="text-[11px] text-muted-foreground">ATTACKS INTERCEPTED:</span>
          <span className="font-bold text-foreground">
            {ticks.toLocaleString("en-US")}
          </span>
        </div>

        {/* Right: CTA to Live Threat Map */}
        <Link
          href="/threats-map"
          className="group flex items-center gap-1.5 rounded-base border-2 border-border bg-main px-3 py-1 font-heading text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        >
          <Globe2 className="size-3.5 animate-spin [animation-duration:8s]" />
          <span>LIVE THREAT MAP 3D</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
