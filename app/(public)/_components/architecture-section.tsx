import { Layers, Server, Terminal, CloudCog, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SectionBackground } from "@/components/public/section-background"
import { DefenseFlowNetwork } from "@/components/public/defense-flow-network"

export function ArchitectureSection() {
  return (
    <section id="architecture" className="relative overflow-hidden scroll-mt-20 py-6">
      <SectionBackground variant="circuit" showFloatingStamps />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
            <Layers className="size-3.5 text-main" />
            <span>DEFENSE-IN-DEPTH</span>
          </div>
          <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            The Triple Defense Architecture
          </h2>
          <p className="mt-3 text-base font-base text-foreground/80 sm:text-lg">
            Security that operates across all layers: from the web runtime and
            OS kernel to the centralized fleet telemetry cloud.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 xl:gap-10">
          {/* Layer 1: pasax/shield */}
          <div className="flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-6 lg:p-8 xl:p-9 shadow-shadow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-base border-2 border-border bg-amber-300 text-black shadow-[2px_2px_0px_0px_var(--border)]">
                  <Server className="size-6 stroke-[2.5]" />
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-xs font-bold"
                >
                  LAYER 1 · APP
                </Badge>
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground">
                pasax/shield
              </h3>
              <p className="mt-1 font-mono text-xs font-semibold text-muted-foreground">
                PHP 8.2+ · Laravel Application Core
              </p>

              <p className="mt-4 text-sm leading-relaxed font-base text-foreground/80">
                Embeds directly into the web application lifecycle. Enforces
                13 security middlewares, deploys decoy honeypots for automated
                scanners, and performs deep webshell signature inspection
                before requests execute.
              </p>

              <div className="mt-5 space-y-2 border-t-2 border-border pt-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-green-500" />
                  <span>Fake wp-login & .git honeypots</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-green-500" />
                  <span>Webshell regex signature scanner</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-green-500" />
                  <span>In-app SHA-256 integrity baseline</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t-2 border-border pt-4">
              <span className="font-mono text-[11px] text-muted-foreground">
                Runtime: Inside PHP-FPM worker
              </span>
            </div>
          </div>

          {/* Layer 2: pasax-sentinel */}
          <div className="flex flex-col justify-between rounded-base border-2 border-border bg-main p-6 lg:p-8 xl:p-9 text-main-foreground shadow-shadow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground shadow-[2px_2px_0px_0px_var(--border)]">
                  <Terminal className="size-6 stroke-[2.5]" />
                </div>
                <Badge
                  variant="outline"
                  className="border-border bg-secondary-background font-mono text-xs font-bold text-foreground"
                >
                  LAYER 2 · HOST
                </Badge>
              </div>

              <h3 className="font-heading text-xl font-black text-foreground">
                pasax-sentinel
              </h3>
              <p className="mt-1 font-mono text-xs font-bold text-foreground/80">
                Go 1.24 · Kernel & Host Daemon
              </p>

              <p className="mt-4 text-sm leading-relaxed font-base text-foreground/90">
                Ultra-lightweight Linux daemon compiled to a single static
                binary. Intercepts attacks at the kernel boundary using
                nftables, monitors file systems via inotify, and
                auto-quarantines zero-days with &lt;20MB RAM.
              </p>

              <div className="mt-5 space-y-2 border-t-2 border-border pt-4 font-mono text-xs font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-foreground" />
                  <span>Sub-millisecond kernel IP drop</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-foreground" />
                  <span>Instant FIM permission lockdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-foreground" />
                  <span>Zero open inbound ports (mTLS)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t-2 border-border pt-4 text-foreground">
              <span className="font-mono text-[11px] font-bold">
                Runtime: Native systemd daemon
              </span>
            </div>
          </div>

          {/* Layer 3: Pasax Cloud */}
          <div className="flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-6 lg:p-8 xl:p-9 shadow-shadow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-base border-2 border-border bg-cyan-300 text-black shadow-[2px_2px_0px_0px_var(--border)]">
                  <CloudCog className="size-6 stroke-[2.5]" />
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-xs font-bold"
                >
                  LAYER 3 · SOC
                </Badge>
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground">
                Pasax Cloud
              </h3>
              <p className="mt-1 font-mono text-xs font-semibold text-muted-foreground">
                Next.js 16 · Central Fleet Intelligence
              </p>

              <p className="mt-4 text-sm leading-relaxed font-base text-foreground/80">
                Synchronizes security state across your entire server mesh.
                Propagates global blocklists within seconds, aggregates audit
                trails, inspects virtual hosts & SSL certs, and sends instant
                alerts.
              </p>

              <div className="mt-5 space-y-2 border-t-2 border-border pt-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-green-500" />
                  <span>Mesh-wide collective blocklist</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-green-500" />
                  <span>Fleet telemetry aggregation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-green-500" />
                  <span>VHost & SSL certificate auditor</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t-2 border-border pt-4">
              <span className="font-mono text-[11px] text-muted-foreground">
                Runtime: Cloud / Private On-Prem
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Triple-Defense Dataflow Network Visualizer */}
        <div className="mt-12">
          <DefenseFlowNetwork />
        </div>
      </div>
    </section>
  )
}
