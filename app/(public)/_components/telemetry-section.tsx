import Link from "next/link"
import { Activity, ExternalLink, Globe2, ArrowRight } from "lucide-react"
import { SectionBackground } from "@/components/public/section-background"
import { InteractiveTerminalPreview } from "@/components/public/interactive-terminal-preview"
import { TacticalRadar } from "@/components/public/tactical-radar"

export function TelemetrySection() {
  return (
    <div className="relative overflow-hidden py-12">
      <SectionBackground variant="grid" />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
              <Activity className="size-3.5 text-sky-500" />
              <span>INTERACTIVE TELEMETRY</span>
            </div>
            <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-4xl lg:text-5xl">
              Autonomous Threat Interception In Real Time
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base lg:text-lg">
              See how Pasax Sentinel neutralizes exploits at the kernel level
              and instantly isolates tampered configuration files before
              attackers can establish persistence.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-border/60 bg-muted/40 px-4 py-2 font-sans text-xs font-medium text-foreground backdrop-blur-md transition-all hover:border-border hover:bg-muted/80 md:self-auto"
          >
            <span>Full Threat Console</span>
            <ExternalLink className="ml-1 size-3.5 text-muted-foreground" />
          </Link>
        </div>

        <InteractiveTerminalPreview />

        {/* 360 Tactical Perimeter Radar */}
        <div className="mt-8">
          <TacticalRadar />
        </div>

        {/* 3D Global Live Threat Map Showcase Banner */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-2xl border border-rose-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-rose-500/30 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500">
              <Globe2 className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-2 animate-ping rounded-full bg-rose-500" />
                <span className="font-mono text-[10px] font-semibold tracking-wider text-rose-500 uppercase">
                  GLOBAL REALTIME ATTACK VISUALIZATION
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Explore Pasax Global Live Threat Map
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Track 3D ballistic cyber trajectories, active kernel drops, and
                honeypot entrapments in real time across the global mesh.
              </p>
            </div>
          </div>
          <Link
            href="/threats-map"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 font-sans text-xs font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-rose-600"
          >
            <span>Launch 3D Threat Map</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
