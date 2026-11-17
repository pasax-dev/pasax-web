"use client"

import * as React from "react"
import { Flame, Activity, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThreatEvent {
  id: string
  time: string
  type: "FIM" | "KERNEL" | "HONEYPOT" | "VHOST"
  ip: string
  target: string
  action: string
  latency: string
  status: "mitigated" | "blocked" | "locked"
}

const INITIAL_EVENTS: ThreatEvent[] = [
  {
    id: "evt-1",
    time: "19:14:02",
    type: "FIM",
    ip: "192.168.1.104",
    target: "/var/www/html/.env",
    action:
      "Unauthorized write attempt detected -> Auto-remediated permissions to 0600",
    latency: "11ms",
    status: "locked",
  },
  {
    id: "evt-2",
    time: "19:14:18",
    type: "KERNEL",
    ip: "185.220.101.5",
    target: "Port 443 [POST /wp-login.php]",
    action: "CVE-2024-4577 exploit pattern -> Added to nftables input drop set",
    latency: "0.19ms",
    status: "blocked",
  },
  {
    id: "evt-3",
    time: "19:14:35",
    type: "HONEYPOT",
    ip: "45.154.255.8",
    target: "/.git/config",
    action:
      "Honeypot hit by automated scanner -> Global fleet blacklist broadcasted",
    latency: "1.2ms",
    status: "mitigated",
  },
  {
    id: "evt-4",
    time: "19:15:01",
    type: "KERNEL",
    ip: "103.145.13.22",
    target: "SYN Flood [120k pps]",
    action: "Volumetric SYN flood mitigated -> Wire-speed drop in kernel-space",
    latency: "0.08ms",
    status: "blocked",
  },
]

export function InteractiveTerminalPreview() {
  const [events, setEvents] = React.useState<ThreatEvent[]>(INITIAL_EVENTS)
  const [totalBlocked, setTotalBlocked] = React.useState(18429)
  const [simulating, setSimulating] = React.useState(false)

  const handleSimulate = () => {
    if (simulating) return
    setSimulating(true)

    setTimeout(() => {
      const randomIP = `${Math.floor(Math.random() * 200 + 20)}.${Math.floor(
        Math.random() * 250
      )}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`

      const now = new Date()
      const timeStr = now.toTimeString().split(" ")[0]

      const newEvent: ThreatEvent = {
        id: `evt-${Date.now()}`,
        time: timeStr,
        type: "KERNEL",
        ip: randomIP,
        target: "Port 443 [POST /api/v1/auth]",
        action: "Stepped login threshold exceeded -> Dynamic nftables drop",
        latency: "0.14ms",
        status: "blocked",
      }

      setEvents((prev) => [newEvent, ...prev.slice(0, 4)])
      setTotalBlocked((c) => c + 1)
      setSimulating(false)
    }, 450)
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border/50 bg-card/40 shadow-xl backdrop-blur-md">
      {/* Console Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-red-500/80" />
            <div className="size-3 rounded-full bg-amber-500/80" />
            <div className="size-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="hidden h-4 w-px bg-border/40 sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-foreground">
              node-sgp-01.mesh.pasax
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-500">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              ARMORED
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            onClick={handleSimulate}
            disabled={simulating}
            className="rounded-full bg-foreground font-mono text-xs font-medium text-background transition-all hover:bg-foreground/90"
          >
            <Flame className="size-3 animate-pulse text-rose-500" />
            {simulating ? "Injecting Attack..." : "Simulate Live Attack"}
          </Button>
        </div>
      </div>

      {/* Grid Content: Left Live Stream, Right Node Metrics */}
      <div className="grid grid-cols-1 divide-y divide-border/40 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {/* Left Side: Live Intercept Stream */}
        <div className="p-4 sm:p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-sky-500" />
              <h3 className="font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Autonomous Defense Activity Stream
              </h3>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Kernel Filter: nftables v1.0.9
            </span>
          </div>

          <div className="space-y-2.5">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="rounded-xl border border-border/40 bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-muted-foreground">{evt.time}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        evt.type === "FIM"
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-500"
                          : evt.type === "KERNEL"
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {evt.type}
                    </span>
                    <span className="font-semibold text-foreground">
                      {evt.ip}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Remediated in:
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-500">
                      {evt.latency}
                    </span>
                  </div>
                </div>

                <div className="mt-1.5 font-mono text-xs text-foreground/90">
                  <span className="text-muted-foreground">Target: </span>
                  <code className="font-medium text-foreground">
                    {evt.target}
                  </code>
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {evt.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Telemetry Gauges */}
        <div className="flex flex-col justify-between gap-4 bg-muted/10 p-4 sm:p-5">
          <div>
            <h4 className="mb-3 font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Host Telemetry
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-border/40 bg-card/60 p-3">
                <div className="font-mono text-[11px] text-muted-foreground">
                  Sentinel RAM
                </div>
                <div className="mt-1 font-mono text-xl font-bold text-foreground tabular-nums">
                  18.2{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    MB
                  </span>
                </div>
                <div className="mt-1 text-[10px] font-medium text-emerald-500">
                  &lt; 0.2% total memory
                </div>
              </div>

              <div className="rounded-xl border border-border/40 bg-card/60 p-3">
                <div className="font-mono text-[11px] text-muted-foreground">
                  Filter Latency
                </div>
                <div className="mt-1 font-mono text-xl font-bold text-foreground tabular-nums">
                  0.18{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    ms
                  </span>
                </div>
                <div className="mt-1 text-[10px] font-medium text-emerald-500">
                  Kernel-space drop
                </div>
              </div>

              <div className="rounded-xl border border-border/40 bg-card/60 p-3">
                <div className="font-mono text-[11px] text-muted-foreground">
                  Active Drops
                </div>
                <div className="mt-1 font-mono text-xl font-bold text-emerald-500 tabular-nums">
                  {totalBlocked.toLocaleString()}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  Synchronized mesh
                </div>
              </div>

              <div className="rounded-xl border border-border/40 bg-card/60 p-3">
                <div className="font-mono text-[11px] text-muted-foreground">
                  Watched Files
                </div>
                <div className="mt-1 font-mono text-xl font-bold text-foreground tabular-nums">
                  14,280
                </div>
                <div className="mt-1 text-[10px] font-medium text-emerald-500">
                  inotify active
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-sky-500" />
              <span className="font-sans text-xs font-semibold text-foreground">
                Zero Open Ports Active
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Daemon connects via outbound TLS 1.3 mTLS tunnels. No inbound
              ports are opened on your server firewall.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
