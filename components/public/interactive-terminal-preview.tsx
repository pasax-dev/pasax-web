"use client"

import * as React from "react"
import {
  ShieldAlert,
  Flame,
  CheckCircle2,
  Terminal,
  Activity,
  Cpu,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
    action: "Unauthorized write attempt detected -> Auto-remediated permissions to 0600",
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
    action: "Honeypot hit by automated scanner -> Global fleet blacklist broadcasted",
    latency: "1.2ms",
    status: "mitigated",
  },
  {
    id: "evt-4",
    time: "19:14:52",
    type: "KERNEL",
    ip: "91.240.118.232",
    target: "Port 80 [TCP SYN Flood]",
    action: "Rate-limit violated (1,400 req/s) -> Dropped at OSI Layer 3",
    latency: "0.08ms",
    status: "blocked",
  },
]

export function InteractiveTerminalPreview() {
  const [events, setEvents] = React.useState<ThreatEvent[]>(INITIAL_EVENTS)
  const [simulating, setSimulating] = React.useState(false)
  const [totalBlocked, setTotalBlocked] = React.useState(42910)

  const handleSimulate = () => {
    if (simulating) return
    setSimulating(true)

    const randomIps = [
      "194.26.29.112",
      "103.145.12.89",
      "185.191.171.4",
      "77.247.110.15",
    ]
    const randomIp = randomIps[Math.floor(Math.random() * randomIps.length)]

    setTimeout(() => {
      const now = new Date()
      const timeStr = now.toTimeString().split(" ")[0]
      const newEvent: ThreatEvent = {
        id: "evt-" + Date.now(),
        time: timeStr,
        type: "KERNEL",
        ip: randomIp,
        target: "POST /admin/webshell.php",
        action: "Signature 'b374k' detected -> nftables kernel drop + node quarantined",
        latency: "0.14ms",
        status: "blocked",
      }

      setEvents((prev) => [newEvent, ...prev.slice(0, 4)])
      setTotalBlocked((c) => c + 1)
      setSimulating(false)
    }, 450)
  }

  return (
    <div className="w-full rounded-base border-2 border-border bg-secondary-background shadow-shadow overflow-hidden">
      {/* Console Top Header */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-border bg-background px-4 py-3 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full border border-border bg-red-400" />
            <div className="size-3 rounded-full border border-border bg-amber-400" />
            <div className="size-3 rounded-full border border-border bg-green-400" />
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground">
              node-sgp-01.mesh.pasax
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-green-600 dark:text-green-400 border border-green-500/30">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              ARMORED
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="default"
            onClick={handleSimulate}
            disabled={simulating}
            className="font-mono font-bold text-xs"
          >
            <Flame className="size-3 text-red-600 animate-bounce" />
            {simulating ? "Injecting Attack..." : "Simulate Live Attack"}
          </Button>
        </div>
      </div>

      {/* Grid Content: Left Live Stream, Right Node Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border">
        {/* Left Side: Live Intercept Stream */}
        <div className="lg:col-span-2 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-main" />
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
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
                className="rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-0.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-muted-foreground">{evt.time}</span>
                    <span
                      className={`font-bold px-1.5 py-0.2 rounded border text-[10px] ${
                        evt.type === "FIM"
                          ? "bg-purple-100 text-purple-800 border-purple-400 dark:bg-purple-950 dark:text-purple-300"
                          : evt.type === "KERNEL"
                          ? "bg-red-100 text-red-800 border-red-400 dark:bg-red-950 dark:text-red-300"
                          : "bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {evt.type}
                    </span>
                    <span className="font-bold text-foreground">{evt.ip}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Remediated in:
                    </span>
                    <span className="font-mono text-xs font-bold text-green-600 dark:text-green-400">
                      {evt.latency}
                    </span>
                  </div>
                </div>

                <div className="mt-1.5 font-mono text-xs text-foreground/90">
                  <span className="text-muted-foreground font-semibold">Target: </span>
                  <code className="text-foreground font-bold">{evt.target}</code>
                </div>

                <div className="mt-1 text-xs font-medium text-muted-foreground">
                  {evt.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Telemetry Gauges */}
        <div className="p-4 sm:p-5 bg-background/50 flex flex-col justify-between gap-4">
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Host Telemetry
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-base border-2 border-border bg-secondary-background p-3">
                <div className="text-[11px] font-mono text-muted-foreground">Sentinel RAM</div>
                <div className="mt-1 font-mono text-xl font-black text-foreground">
                  18.2 <span className="text-xs font-normal text-muted-foreground">MB</span>
                </div>
                <div className="mt-1 text-[10px] text-green-600 dark:text-green-400 font-bold">
                  &lt; 0.2% total memory
                </div>
              </div>

              <div className="rounded-base border-2 border-border bg-secondary-background p-3">
                <div className="text-[11px] font-mono text-muted-foreground">Filter Latency</div>
                <div className="mt-1 font-mono text-xl font-black text-foreground">
                  0.18 <span className="text-xs font-normal text-muted-foreground">ms</span>
                </div>
                <div className="mt-1 text-[10px] text-green-600 dark:text-green-400 font-bold">
                  Kernel-space drop
                </div>
              </div>

              <div className="rounded-base border-2 border-border bg-secondary-background p-3">
                <div className="text-[11px] font-mono text-muted-foreground">Active Drops</div>
                <div className="mt-1 font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {totalBlocked.toLocaleString()}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  Synchronized mesh
                </div>
              </div>

              <div className="rounded-base border-2 border-border bg-secondary-background p-3">
                <div className="text-[11px] font-mono text-muted-foreground">Watched Files</div>
                <div className="mt-1 font-mono text-xl font-black text-foreground">
                  14,280
                </div>
                <div className="mt-1 text-[10px] text-green-600 dark:text-green-400 font-bold">
                  inotify active
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-base border-2 border-border bg-main/20 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-main shrink-0" />
              <span className="font-heading text-xs font-bold text-foreground">
                Zero Open Ports Active
              </span>
            </div>
            <p className="mt-1 text-xs text-foreground/80 leading-relaxed font-base">
              Daemon connects via outbound TLS 1.3 mTLS tunnels. No inbound ports are opened on your server firewall.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
