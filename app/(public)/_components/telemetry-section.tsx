import Link from "next/link"
import { Activity, ExternalLink, Globe2, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { SectionBackground } from "@/components/public/section-background"
import { InteractiveTerminalPreview } from "@/components/public/interactive-terminal-preview"
import { TacticalRadar } from "@/components/public/tactical-radar"
import { cn } from "@/lib/utils"

export function TelemetrySection() {
  return (
    <section id="telemetry" className="relative overflow-hidden scroll-mt-20 py-6">
      <SectionBackground variant="grid" />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-base border border-border bg-main/20 px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
              <Activity className="size-3.5 text-main" />
              <span>INTERACTIVE DEMO</span>
            </div>
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Autonomous Threat Interception In Real Time
            </h2>
            <p className="mt-2 max-w-3xl text-sm sm:text-base lg:text-lg font-base text-foreground/80 leading-relaxed">
              See how Pasax Sentinel neutralizes exploits at the kernel level
              and instantly isolates tampered configuration files before
              attackers can establish persistence.
            </p>
          </div>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex items-center gap-1.5 self-start border-2 border-border font-mono text-xs font-bold md:self-auto"
            )}
          >
            <span>Full Threat Console</span>
            <ExternalLink className="ml-1 size-3.5" />
          </Link>
        </div>

        <InteractiveTerminalPreview />

        {/* 360 Tactical Perimeter Radar */}
        <div className="mt-8">
          <TacticalRadar />
        </div>

        {/* 3D Global Live Threat Map Showcase Banner */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]">
              <Globe2 className="size-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  GLOBAL REALTIME ATTACK VISUALIZATION
                </span>
              </div>
              <h3 className="font-heading text-xl font-black text-foreground">
                Explore Pasax Global Live Threat Map
              </h3>
              <p className="mt-1 text-sm text-foreground/80">
                Track 3D ballistic cyber trajectories, active kernel drops, and honeypot entrapments in real time across the global mesh.
              </p>
            </div>
          </div>
          <Link
            href="/threats-map"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "shrink-0 font-heading font-black shadow-shadow"
            )}
          >
            <span>Launch 3D Threat Map</span>
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
