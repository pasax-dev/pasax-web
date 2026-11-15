"use client"

import * as React from "react"
import {
  Radar,
  Shield,
  FileCheck,
  Radio,
  Zap,
  Activity,
  Layers,
  Crosshair,
  Target,
  AlertTriangle,
  Lock,
  Flame,
  Terminal,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ThreatTarget {
  id: string
  label: string
  angle: number // 0 - 360 deg
  distance: number // 0.2 - 0.95 radial ratio
  ip: string
  type: string
  port: number
  status: "DROPPED" | "TRAPPED" | "INSPECTING"
  severity: "critical" | "high" | "medium"
  originCountry: string
  kernelAction: string
  latencyMs: number
}

const RADAR_TARGETS: ThreatTarget[] = [
  {
    id: "tgt-1",
    label: "SQLi Injection Probe",
    angle: 38,
    distance: 0.78,
    ip: "194.26.29.112",
    type: "Blind SQLi / ' OR 1=1",
    port: 443,
    status: "DROPPED",
    severity: "critical",
    originCountry: "Russia (St. Petersburg)",
    kernelAction: "nft add element inet filter pasax_blocklist { 194.26.29.112 timeout 24h }",
    latencyMs: 0.12,
  },
  {
    id: "tgt-2",
    label: "SSH Brute-Force",
    angle: 115,
    distance: 0.62,
    ip: "45.148.10.194",
    type: "SSH Honeypot Tarpit",
    port: 2222,
    status: "TRAPPED",
    severity: "high",
    originCountry: "Netherlands (Amsterdam)",
    kernelAction: "iptables -A INPUT -p tcp --dport 2222 -j TARPIT",
    latencyMs: 0.08,
  },
  {
    id: "tgt-3",
    label: "Spring4Shell RCE",
    angle: 215,
    distance: 0.86,
    ip: "185.220.101.5",
    type: "CVE-2022-22965 Probe",
    port: 8080,
    status: "DROPPED",
    severity: "critical",
    originCountry: "China (Beijing)",
    kernelAction: "nft add element inet filter rce_signatures { 185.220.101.5 flags drop }",
    latencyMs: 0.15,
  },
  {
    id: "tgt-4",
    label: "Path Traversal Scan",
    angle: 295,
    distance: 0.52,
    ip: "104.196.38.100",
    type: "etc/passwd Arbitrary Read",
    port: 80,
    status: "DROPPED",
    severity: "medium",
    originCountry: "United States (Ashburn)",
    kernelAction: "nft drop ip saddr 104.196.38.100 tcp dport 80",
    latencyMs: 0.11,
  },
  {
    id: "tgt-5",
    label: "Redis Auth Sweep",
    angle: 340,
    distance: 0.72,
    ip: "89.248.163.78",
    type: "Redis Unprotected Rogue",
    port: 6379,
    status: "TRAPPED",
    severity: "high",
    originCountry: "Bulgaria (Sofia)",
    kernelAction: "pasax-sentinel isolate-port --port 6379 --attacker 89.248.163.78",
    latencyMs: 0.14,
  },
]

export function TacticalRadar() {
  const [activeTab, setActiveTab] = React.useState<"detection" | "drop" | "fim" | "mesh">("detection")
  const [selectedTarget, setSelectedTarget] = React.useState<ThreatTarget>(RADAR_TARGETS[0])
  const [visibleTargets, setVisibleTargets] = React.useState<ThreatTarget[]>([])

  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const angleRef = React.useRef<number>(0)
  const animFrameRef = React.useRef<number | null>(null)
  const [radarSize, setRadarSize] = React.useState<number>(360)

  // ThreatsEye-inspired Canvas 2D Radar Renderer
  const drawRadar = React.useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, sweepAngle: number) => {
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      const maxRadius = Math.max(1, Math.min(width, height) / 2 - 38)

      // 1. Base dark radar background
      ctx.beginPath()
      ctx.arc(cx, cy, maxRadius, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(7, 11, 22, 0.92)"
      ctx.fill()

      // 2. Concentric Range Rings with Radial Glow Gradients (ThreatsEye pattern)
      const ringCount = 4
      for (let i = 1; i <= ringCount; i++) {
        const ringRadius = Math.max(16, (maxRadius * i) / ringCount)
        const innerRadius = Math.max(0, ringRadius - 18)

        const grad = ctx.createRadialGradient(cx, cy, innerRadius, cx, cy, ringRadius)
        grad.addColorStop(0, "rgba(56, 189, 248, 0.04)")
        grad.addColorStop(0.5, "rgba(56, 189, 248, 0.12)")
        grad.addColorStop(1, "rgba(16, 185, 129, 0.08)")

        ctx.beginPath()
        ctx.arc(cx, cy, ringRadius, 0, 2 * Math.PI)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.beginPath()
        ctx.arc(cx, cy, ringRadius, 0, 2 * Math.PI)
        ctx.strokeStyle = i === ringCount ? "rgba(16, 185, 129, 0.75)" : "rgba(56, 189, 248, 0.35)"
        ctx.lineWidth = i === ringCount ? 1.5 : 1
        ctx.stroke()
      }

      // 3. Crosshair Axis Lines with division markers
      ctx.beginPath()
      ctx.moveTo(cx - maxRadius, cy)
      ctx.lineTo(cx + maxRadius, cy)
      ctx.moveTo(cx, cy - maxRadius)
      ctx.lineTo(cx, cy + maxRadius)
      ctx.strokeStyle = "rgba(56, 189, 248, 0.3)"
      ctx.lineWidth = 1
      ctx.stroke()

      // 4. Perimeter Compass Degree Ticks (Every 10° with monospace labels, ThreatsEye style)
      ctx.font = `${Math.max(8, Math.round(maxRadius * 0.048))}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      for (let deg = 0; deg < 360; deg += 10) {
        const rad = (deg * Math.PI) / 180
        const isMajor = deg % 30 === 0
        const rTickStart = isMajor ? maxRadius - 10 : maxRadius - 5
        const rTickEnd = maxRadius + 2

        ctx.beginPath()
        ctx.moveTo(cx + rTickStart * Math.cos(rad), cy + rTickStart * Math.sin(rad))
        ctx.lineTo(cx + rTickEnd * Math.cos(rad), cy + rTickEnd * Math.sin(rad))
        ctx.strokeStyle = isMajor ? "rgba(16, 185, 129, 0.85)" : "rgba(56, 189, 248, 0.45)"
        ctx.lineWidth = isMajor ? 1.5 : 0.8
        ctx.stroke()

        // Monospace degree labels for every 30°
        if (isMajor) {
          const rText = maxRadius + 18
          const tx = cx + rText * Math.cos(rad)
          const ty = cy + rText * Math.sin(rad)

          ctx.save()
          ctx.translate(tx, ty)
          ctx.rotate(rad + Math.PI / 2)
          ctx.fillStyle = deg === 0 || deg === 90 || deg === 180 || deg === 270
            ? "rgba(52, 211, 153, 0.95)"
            : "rgba(148, 163, 184, 0.75)"
          ctx.fillText(deg.toString().padStart(3, "0") + "°", 0, 0)
          ctx.restore()
        }
      }

      // 5. Rotating Sweeping Beam Wedge (ThreatsEye signature gradient sector)
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(sweepAngle)

      const sweepSector = Math.PI / 2.35 // ~76.5 degrees
      const beamGrad = ctx.createLinearGradient(0, 0, maxRadius, 0)
      beamGrad.addColorStop(0, "rgba(16, 185, 129, 0.75)")
      beamGrad.addColorStop(0.35, "rgba(56, 189, 248, 0.35)")
      beamGrad.addColorStop(1, "rgba(56, 189, 248, 0)")

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, maxRadius, 0, sweepSector)
      ctx.lineTo(0, 0)
      ctx.fillStyle = beamGrad
      ctx.fill()

      // Glowing Neon Leading Edge Line
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(maxRadius, 0)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)"
      ctx.lineWidth = 2
      ctx.shadowColor = "rgba(16, 185, 129, 0.9)"
      ctx.shadowBlur = 16
      ctx.stroke()
      ctx.shadowBlur = 0

      // Sub-arc outer ring accent
      ctx.beginPath()
      ctx.arc(0, 0, maxRadius * 0.99, 0, sweepSector)
      ctx.strokeStyle = "rgba(52, 211, 153, 0.6)"
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.restore()

      // 6. Glowing Bullseye Central Hub
      const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22)
      hubGrad.addColorStop(0, "rgba(16, 185, 129, 0.95)")
      hubGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.4)")
      hubGrad.addColorStop(1, "rgba(7, 11, 22, 0)")

      ctx.beginPath()
      ctx.arc(cx, cy, 22, 0, 2 * Math.PI)
      ctx.fillStyle = hubGrad
      ctx.fill()

      // Center Core Dot
      ctx.beginPath()
      ctx.arc(cx, cy, 3.5, 0, 2 * Math.PI)
      ctx.fillStyle = "#ffffff"
      ctx.fill()

      // 7. Calculate which targets are currently swept & illuminated
      const currentDeg = ((sweepAngle * 180) / Math.PI) % 360
      const activeTargets = RADAR_TARGETS.filter((tgt) => {
        const diff = (tgt.angle - currentDeg + 360) % 360
        return diff <= 190
      })
      setVisibleTargets(activeTargets)
    },
    []
  )

  // ResizeObserver for Retina HD Canvas
  React.useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      setRadarSize(Math.min(w, 520))
    }

    handleResize()
    const ro = new ResizeObserver(handleResize)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Animation Loop
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = radarSize * dpr
    canvas.height = radarSize * dpr

    let isRunning = true
    const loop = () => {
      if (!isRunning) return
      angleRef.current += 0.015
      ctx.save()
      ctx.scale(dpr, dpr)
      drawRadar(ctx, radarSize, radarSize, angleRef.current)
      ctx.restore()
      animFrameRef.current = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      isRunning = false
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [radarSize, drawRadar])

  const radarRadius = radarSize / 2 - 38

  return (
    <div className="relative overflow-hidden rounded-base border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_var(--border)]">
      {/* ThreatsEye HUD Corner Brackets */}
      <div className="pointer-events-none absolute top-2 left-2 size-4 border-t-2 border-l-2 border-main/80 animate-[hud-bracket-breathe_3s_ease-in-out_infinite] hidden sm:block" />
      <div className="pointer-events-none absolute top-2 right-2 size-4 border-t-2 border-r-2 border-main/80 animate-[hud-bracket-breathe_3s_ease-in-out_infinite] hidden sm:block" />
      <div className="pointer-events-none absolute bottom-2 left-2 size-4 border-b-2 border-l-2 border-main/80 animate-[hud-bracket-breathe_3s_ease-in-out_infinite] hidden sm:block" />
      <div className="pointer-events-none absolute bottom-2 right-2 size-4 border-b-2 border-r-2 border-main/80 animate-[hud-bracket-breathe_3s_ease-in-out_infinite] hidden sm:block" />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </span>
            <h3 className="font-heading text-lg font-black tracking-tight text-foreground">
              360° Tactical Perimeter Radar
            </h3>
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              HD SWEEP 60FPS
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            ThreatsEye-grade precision telemetry, socket-level entrapment & automated honeypots
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-2 border-border bg-secondary-background font-mono text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)]"
          >
            DETECTED: {visibleTargets.length} ACTIVE
          </Badge>
        </div>
      </div>

      {/* Main Grid: Radar Screen + Live Diagnostics Bay */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left: Tactical Radar Canvas Bay (7 cols) */}
        <div className="relative mx-auto flex w-full flex-col items-center justify-center lg:col-span-7">
          {/* ThreatsEye Animated Conic Spinning Border Shell */}
          <div
            ref={containerRef}
            className="relative flex aspect-square w-full max-w-[460px] xl:max-w-[520px] items-center justify-center overflow-hidden rounded-full border-2 border-border bg-[#060a14] p-1 shadow-[0_0_35px_rgba(56,189,248,0.18),inset_0_0_24px_rgba(16,185,129,0.12)]"
          >
            {/* Ambient Conic Ring */}
            <div className="pointer-events-none absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full opacity-35 bg-[conic-gradient(from_0deg,#0000_0deg,rgba(16,185,129,0.7)_50deg,#0000_120deg,rgba(56,189,248,0.5)_240deg,#0000_320deg)]" />

            {/* Canvas Core Engine */}
            <canvas
              ref={canvasRef}
              style={{ width: `${radarSize}px`, height: `${radarSize}px` }}
              className="relative z-10 block"
            />

            {/* Polar-Projected Target Blip Badges */}
            {visibleTargets.map((target) => {
              const rad = (target.angle * Math.PI) / 180
              const distPx = radarRadius * target.distance
              const xOffset = Math.cos(rad) * distPx
              const yOffset = Math.sin(rad) * distPx

              const isCritical = target.severity === "critical"
              const isSelected = selectedTarget?.id === target.id
              const isRightSide = target.angle < 90 || target.angle > 270
              const labelPositionClass = isRightSide
                ? "right-4 top-1/2 -translate-y-1/2"
                : "left-4 top-1/2 -translate-y-1/2"

              return (
                <div
                  key={target.id}
                  onClick={() => setSelectedTarget(target)}
                  style={{
                    transform: `translate(${xOffset}px, ${yOffset}px)`,
                  }}
                  className="group absolute z-20 cursor-pointer transition-all duration-300"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Blip Ping Ring */}
                    <span
                      className={`absolute inline-flex size-5 animate-ping rounded-full opacity-75 ${
                        isCritical ? "bg-rose-500" : "bg-amber-400"
                      }`}
                    />
                    {/* Center Blip */}
                    <span
                      className={`relative inline-flex size-3 rounded-full border border-white shadow-[0_0_10px_rgba(244,63,94,0.9)] ${
                        isCritical ? "bg-rose-600" : "bg-amber-500"
                      }`}
                    />

                    {/* Threat Tag Label */}
                    <div
                      className={`pointer-events-none absolute ${labelPositionClass} whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[10px] font-bold shadow-md transition-all ${
                        isSelected
                          ? "border-emerald-400 bg-emerald-950/90 text-emerald-200"
                          : isCritical
                            ? "border-rose-500/40 bg-[#0d0e17]/95 text-rose-300"
                            : "border-amber-500/40 bg-[#0d0e17]/95 text-amber-300"
                      }`}
                    >
                      {target.type} &middot; {target.ip}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Scanline CRT overlay */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />
          </div>

          {/* Quick HUD Metrics Bar */}
          <div className="mt-3 grid w-full max-w-[460px] xl:max-w-[520px] grid-cols-4 gap-2 text-center font-mono text-[11px]">
            <div className="rounded border border-border bg-secondary-background p-1.5 shadow-[2px_2px_0px_0px_var(--border)]">
              <span className="block text-[9px] uppercase text-muted-foreground font-bold">MONITORED</span>
              <span className="font-bold text-foreground">65,535</span>
            </div>
            <div className="rounded border border-border bg-secondary-background p-1.5 shadow-[2px_2px_0px_0px_var(--border)]">
              <span className="block text-[9px] uppercase text-muted-foreground font-bold">TRAPPED</span>
              <span className="font-bold text-amber-500">2 NODES</span>
            </div>
            <div className="rounded border border-border bg-secondary-background p-1.5 shadow-[2px_2px_0px_0px_var(--border)]">
              <span className="block text-[9px] uppercase text-muted-foreground font-bold">DROPPED</span>
              <span className="font-bold text-rose-500">3 DROPS</span>
            </div>
            <div className="rounded border border-border bg-secondary-background p-1.5 shadow-[2px_2px_0px_0px_var(--border)]">
              <span className="block text-[9px] uppercase text-muted-foreground font-bold">LATENCY</span>
              <span className="font-bold text-emerald-500">0.12ms</span>
            </div>
          </div>
        </div>

        {/* Right: Rich Telemetry & Capability Diagnostics Dock (5 cols) */}
        <div className="flex flex-col gap-3 lg:col-span-5">
          {/* 1. Target Quick-Select Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="flex items-center gap-1.5 font-bold uppercase text-muted-foreground">
                <Target className="size-3 text-rose-500" />
                <span>Detected Ingress Vectors:</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-bold">CLICK TO INSPECT</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {RADAR_TARGETS.map((tgt, idx) => {
                const isSelected = selectedTarget?.id === tgt.id
                return (
                  <button
                    key={tgt.id}
                    onClick={() => setSelectedTarget(tgt)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-base border p-1 text-center font-mono transition-all",
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-[2px_2px_0px_0px_var(--border)] translate-x-0.5 translate-y-0.5"
                        : "border-border bg-secondary-background hover:bg-muted text-foreground"
                    )}
                  >
                    <span className="text-[10px] font-black truncate w-full">#{idx + 1} {tgt.status}</span>
                    <span className="text-[9px] text-muted-foreground truncate w-full">{tgt.ip}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Deep Target Forensic & Kernel Remediation Card */}
          {selectedTarget && (
            <div className="rounded-base border-2 border-border bg-card p-3.5 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-1.5 font-heading text-xs font-black text-foreground">
                  <Crosshair className="size-3.5 text-rose-500 animate-pulse" />
                  <span className="truncate max-w-[200px]">{selectedTarget.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-mono text-[10px] font-bold px-1.5 py-0",
                      selectedTarget.severity === "critical"
                        ? "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        : "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {selectedTarget.severity.toUpperCase()}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-mono text-[10px] font-bold px-1.5 py-0",
                      selectedTarget.status === "DROPPED"
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {selectedTarget.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attacker IP:</span>
                  <span className="font-bold text-rose-500">{selectedTarget.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Port:</span>
                  <span className="font-bold text-foreground">Port {selectedTarget.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Geo Origin:</span>
                  <span className="text-foreground truncate max-w-[120px]">{selectedTarget.originCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mitigation Speed:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">&lt; {selectedTarget.latencyMs}ms</span>
                </div>
              </div>

              {/* Active Kernel Mitigation Snippet */}
              <div className="mt-2 rounded border border-border bg-[#0b101c] p-2 font-mono text-[10px] text-emerald-400">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">
                  ⚡ Autonomous Kernel Hook:
                </span>
                <span className="text-amber-400 font-bold">$</span> {selectedTarget.kernelAction}
              </div>
            </div>
          )}

          {/* 3. Capability Dock Tabs */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "detection", label: "Perimeter", icon: Radar },
              { id: "drop", label: "nftables Drop", icon: Zap },
              { id: "fim", label: "FIM Integrity", icon: FileCheck },
              { id: "mesh", label: "Mesh Gossip", icon: Radio },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 rounded-base border-2 p-2 font-heading text-xs font-bold transition-all ${
                  activeTab === id
                    ? "border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] translate-x-0.5 translate-y-0.5"
                    : "border-border bg-secondary-background text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>

          {/* 4. Tab Detailed Diagnostics */}
          <div className="rounded-base border-2 border-border bg-secondary-background p-3.5 shadow-[2px_2px_0px_0px_var(--border)]">
            {activeTab === "detection" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-black text-foreground">INGRESS SWEEP</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <p className="text-xs text-foreground/80 dark:text-slate-300 leading-relaxed">
                  Continuous packet sniffing at the raw socket level. Correlates port sweeps, slowloris patterns, and automated scanners before reaching application threads.
                </p>
                <div className="mt-1 font-mono text-[10px] text-foreground bg-card p-1.5 rounded border border-border">
                  &gt; Sockets monitored: <strong>65,535</strong> | Decoys: <strong>2222, 3306, 6379</strong>
                </div>
              </div>
            )}

            {activeTab === "drop" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-black text-foreground">KERNEL NFTABLES</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">0.12ms DROP</span>
                </div>
                <p className="text-xs text-foreground/80 dark:text-slate-300 leading-relaxed">
                  Go Sentinel compiles atomic rules into Linux kernel netfilter tables. Dropping happens directly at layer 3/4 with zero CPU overhead.
                </p>
                <div className="mt-1 font-mono text-[10px] text-foreground bg-card p-1.5 rounded border border-border">
                  &gt; Chain: <strong>pasax_input_filter</strong> | Rule: <strong>ip saddr @malicious_set drop</strong>
                </div>
              </div>
            )}

            {activeTab === "fim" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-black text-foreground">FILE INTEGRITY (FIM)</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">LOCKED</span>
                </div>
                <p className="text-xs text-foreground/80 dark:text-slate-300 leading-relaxed">
                  Real-time inotify monitoring over critical PHP, blade templates, and .env files. Immediate rollback if unauthorized tampering occurs.
                </p>
                <div className="mt-1 font-mono text-[10px] text-foreground bg-card p-1.5 rounded border border-border">
                  &gt; Hash baseline: <strong>SHA-256 Verified</strong> | Dirs: <strong>/app, /routes, /.env</strong>
                </div>
              </div>
            )}

            {activeTab === "mesh" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-black text-foreground">P2P MESH GOSSIP</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">9 NODES</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When one node drops an attacker, the IP reputation hash propagates across all sentinel nodes globally in under 200ms via mTLS gossip.
                </p>
                <div className="mt-1 font-mono text-[10px] text-foreground bg-card p-1.5 rounded border border-border">
                  &gt; Protocol: <strong>mTLS + Protobuf</strong> | Sync: <strong>&lt; 200ms</strong>
                </div>
              </div>
            )}
          </div>

          {/* 5. Live Kernel Interception Stream (Terminal Log) */}
          <div className="rounded-base border-2 border-border bg-[#080d1a] p-3 text-slate-200 shadow-[2px_2px_0px_0px_var(--border)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span>KERNEL TELEMETRY STREAM</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">● LIVE FEED</span>
            </div>

            <div className="space-y-1 font-mono text-[10px] leading-relaxed">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-slate-500">06:35:12</span>
                <span className="rounded bg-rose-500/20 px-1 text-rose-400 font-bold">DROP</span>
                <span className="text-slate-300 truncate">194.26.29.112:54210 → :443</span>
                <span className="text-amber-400 hidden sm:inline">[SQLi]</span>
                <span className="ml-auto text-emerald-400 font-bold shrink-0">&lt;0.12ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-slate-500">06:35:10</span>
                <span className="rounded bg-amber-500/20 px-1 text-amber-400 font-bold">TARPIT</span>
                <span className="text-slate-300 truncate">45.148.10.194:38902 → :2222</span>
                <span className="text-amber-400 hidden sm:inline">[SSH-BF]</span>
                <span className="ml-auto text-emerald-400 font-bold shrink-0">&lt;0.08ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-slate-500">06:35:08</span>
                <span className="rounded bg-emerald-500/20 px-1 text-emerald-400 font-bold">LOCK</span>
                <span className="text-slate-300 truncate">/var/www/html/.env</span>
                <span className="text-sky-400 hidden sm:inline">[chmod 0600]</span>
                <span className="ml-auto text-emerald-400 font-bold shrink-0">11.2ms</span>
              </div>
            </div>
          </div>

          {/* 6. Autonomous Sentinel Health Matrix */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
            <div className="rounded border border-border bg-secondary-background p-1.5 shadow-[2px_2px_0px_0px_var(--border)]">
              <span className="block text-[9px] uppercase text-muted-foreground font-bold">NFTABLES CORE</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Shield className="size-3 shrink-0" /> ENFORCING
              </span>
            </div>
            <div className="rounded border border-border bg-secondary-background p-1.5 shadow-[2px_2px_0px_0px_var(--border)]">
              <span className="block text-[9px] uppercase text-muted-foreground font-bold">FIM AUTO-LOCK</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Lock className="size-3 shrink-0" /> 1,420 FILES
              </span>
            </div>
            <div className="rounded border border-border bg-secondary-background p-1.5 shadow-[2px_2px_0px_0px_var(--border)]">
              <span className="block text-[9px] uppercase text-muted-foreground font-bold">GLOBAL MESH</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Radio className="size-3 shrink-0" /> 9/9 NODES
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
