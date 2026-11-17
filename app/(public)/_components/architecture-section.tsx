import { Layers, Server, Terminal, CloudCog, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SectionBackground } from "@/components/public/section-background"
import { DefenseFlowNetwork } from "@/components/public/defense-flow-network"

export function ArchitectureSection() {
  return (
    <div className="relative overflow-hidden py-12">
      <SectionBackground variant="circuit" />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
            <Layers className="size-3.5 text-sky-500" />
            <span>DEFENSE-IN-DEPTH</span>
          </div>
          <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-5xl">
            The Triple Defense Architecture
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Security that operates across all layers: from the web runtime and
            OS kernel to the centralized fleet telemetry cloud.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 xl:gap-10">
          {/* Layer 1: pasax/shield */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-amber-500/30 hover:bg-card/70 lg:p-8 xl:p-9">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
                  <Server className="size-5" />
                </div>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-500">
                  LAYER 1 · APP
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground">
                pasax/shield
              </h3>
              <p className="mt-1 font-mono text-xs font-medium text-amber-500">
                Application-Level WAF &amp; Middleware
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Pure PHP package dropped directly into your Laravel or PHP
                application. Inspects incoming payloads with zero external
                dependencies, enforces stepped login throttling, and traps
                automated bots via smart honeypot routes.
              </p>

              <div className="mt-6 space-y-2.5 border-t border-border/40 pt-4 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    Zero NPM / Node dependencies
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    SHA-256 Webshell Scanner
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    Stepped brute-force login lockout
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    NAT-aware device fingerprinting
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border/40 pt-4">
              <span className="font-mono text-xs text-muted-foreground">
                Runtime: PHP 8.1+ · Composer Package
              </span>
            </div>
          </div>

          {/* Layer 2: pasax-sentinel */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sky-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-sky-500/30 hover:bg-card/70 lg:p-8 xl:p-9">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-500">
                  <Terminal className="size-5" />
                </div>
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-sky-500">
                  LAYER 2 · KERNEL
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground">
                pasax-sentinel
              </h3>
              <p className="mt-1 font-mono text-xs font-medium text-sky-500">
                Kernel-Level Linux Daemon
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Lightweight compiled Go binary running as a systemd daemon on
                your host VPS. Interfaces directly with{" "}
                <code className="font-mono font-medium text-foreground">
                  nftables
                </code>{" "}
                to drop malicious packets at sub-0.2ms latency, monitors file
                integrity via{" "}
                <code className="font-mono font-medium text-foreground">
                  inotify
                </code>
                , and audits web server virtual hosts.
              </p>

              <div className="mt-6 space-y-2.5 border-t border-border/40 pt-4 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    Sub-0.2ms nftables kernel packet drops
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    Autonomous FIM auto-lock (0600)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    Egress-only zero-trust mTLS tunnel
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    Less than 20MB RAM footprint
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border/40 pt-4">
              <span className="font-mono text-xs text-muted-foreground">
                Runtime: Compiled Go · Linux Kernel 5.4+
              </span>
            </div>
          </div>

          {/* Layer 3: Pasax Cloud */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-emerald-500/30 hover:bg-card/70 lg:p-8 xl:p-9">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                  <CloudCog className="size-5" />
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-emerald-500">
                  LAYER 3 · CLOUD
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground">
                Pasax Cloud SOC
              </h3>
              <p className="mt-1 font-mono text-xs font-medium text-emerald-500">
                Fleet Telemetry &amp; Threat Mesh
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Centralized command console aggregating security signals across
                your entire server fleet. Distributes collective threat
                intelligence in real time, manages automated security policies,
                and alerts your team before breaches propagate.
              </p>

              <div className="mt-6 space-y-2.5 border-t border-border/40 pt-4 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    Fleet-wide collective blocklist sync
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    Centralized multi-tenant SOC console
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    3D Global live attack radar
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground/90">
                    Instant webhook alerts (Telegram/Slack)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border/40 pt-4">
              <span className="font-mono text-xs text-muted-foreground">
                Runtime: Global cloud control plane
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Defense Flow Diagram */}
        <div className="mt-12">
          <DefenseFlowNetwork />
        </div>
      </div>
    </div>
  )
}
