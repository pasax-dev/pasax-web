"use client"

import * as React from "react"
import Link from "next/link"
import { Globe2, Activity, ArrowRight } from "lucide-react"

export function LiveTelemetryTicker() {
  const [ticks, setTicks] = React.useState(14892590)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTicks((prev) => prev + Math.floor(Math.random() * 3 + 1))
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full border-y border-border/40 bg-muted/20 px-4 py-2 backdrop-blur-md sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="mx-auto flex max-w-full flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Live Status & Mesh telemetry */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-sky-500 uppercase">
            <span className="size-1.5 animate-ping rounded-full bg-sky-400" />
            <span>MESH TELEMETRY</span>
          </div>

          <div className="hidden h-4 w-px bg-border/40 sm:block" />

          {/* Trinity status pills */}
          <div className="hidden items-center gap-2 font-mono text-[11px] text-muted-foreground md:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/50 px-2.5 py-0.5">
              <span className="size-1.5 rounded-full bg-sky-500" />
              <span>
                L1 Shield: <strong className="text-foreground">ONLINE</strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/50 px-2.5 py-0.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>
                L2 Sentinel:{" "}
                <strong className="text-foreground">0.14ms DROP</strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/50 px-2.5 py-0.5">
              <span className="size-1.5 rounded-full bg-amber-500" />
              <span>
                L3 Fleet SOC:{" "}
                <strong className="text-foreground">mTLS SYNC</strong>
              </span>
            </span>
          </div>
        </div>

        {/* Center: Live Counter */}
        <div className="flex items-center gap-2 font-mono text-muted-foreground">
          <Activity className="size-3.5 animate-pulse text-sky-500" />
          <span className="text-[11px] tracking-wider uppercase">
            ATTACKS INTERCEPTED:
          </span>
          <span className="inline-flex items-center rounded-full border border-border/40 bg-background/60 px-2.5 py-0.5 font-mono text-xs font-bold text-foreground tabular-nums">
            {ticks.toLocaleString("en-US")}
          </span>
        </div>

        {/* Right: CTA to Live Threat Map */}
        <Link
          href="/threats-map"
          className="group inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-sans text-xs font-medium text-rose-500 transition-all hover:bg-rose-500/20"
        >
          <Globe2 className="size-3.5 animate-spin [animation-duration:12s]" />
          <span>Live Threat Map</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
