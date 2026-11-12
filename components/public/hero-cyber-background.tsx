"use client"

import * as React from "react"
import * as topojson from "topojson-client"
import {
  SENTINEL_NODES,
  ATTACKER_ORIGINS,
  ATTACK_SIGNATURES,
  type SentinelNode,
  type AttackerOrigin,
} from "@/lib/threat-map-data"

interface ActiveAttackArc {
  id: string
  origin: AttackerOrigin
  target: SentinelNode
  type: string
  color: string
  progress: number
  speed: number
  arcHeight: number
  trail: { x: number; y: number; alpha: number }[]
}

interface DefenseExplosion {
  id: string
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
  text: string
  textY: number
}

export function HeroCyberBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animFrameRef = React.useRef<number | null>(null)
  const mousePosRef = React.useRef<{ x: number; y: number }>({ x: -1000, y: -1000 })
  const worldDataRef = React.useRef<any>(null)
  const [hudFeed, setHudFeed] = React.useState<string>("SIMULATION ACTIVE • 9 SENTINEL NODES ARMORED")

  // 1. Fetch world map TopoJSON once
  React.useEffect(() => {
    let isMounted = true
    fetch("/map/world-110m.json")
      .then((res) => res.json())
      .then((topology) => {
        if (!isMounted) return
        const land = topojson.feature(topology, (topology as any).objects.land)
        worldDataRef.current = land
      })
      .catch(() => {
        // Fallback gracefully
      })
    return () => {
      isMounted = false
    }
  }, [])

  // 2. Main Canvas Animation Engine
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 850)

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }
    window.addEventListener("resize", onResize)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    window.addEventListener("mousemove", onMouseMove)

    // Upward-shifted projection: eliminates empty Arctic ocean gap at the top.
    // Major landmasses (North America, Europe, Russia, Asia) start immediately below the header.
    const getProjectionParams = () => {
      const mapW = width * 0.96
      const mapH = Math.max(height * 0.92, 720)
      const startX = (width - mapW) / 2
      // Shift up so northern continents start right at the top edge (y ≈ 0px)
      const startY = -Math.max(65, height * 0.085)

      return { mapW, mapH, startX, startY }
    }

    const project = (lng: number, lat: number) => {
      const { mapW, mapH, startX, startY } = getProjectionParams()
      // Lat domain: 75° down to -50° (span = 125°)
      const normY = (75 - lat) / 125
      const y = startY + normY * mapH
      const x = startX + ((lng + 180) / 360) * mapW
      return { x, y }
    }

    const activeAttacks: ActiveAttackArc[] = []
    const activeExplosions: DefenseExplosion[] = []
    let lastSpawnTime = 0
    let nodePulseAngle = 0

    const attackColors = ["#f43f5e", "#fb923c", "#e11d48", "#f59e0b"]

    const spawnAttack = () => {
      const origin = ATTACKER_ORIGINS[Math.floor(Math.random() * ATTACKER_ORIGINS.length)]
      const target = SENTINEL_NODES[Math.floor(Math.random() * SENTINEL_NODES.length)]
      const sig = ATTACK_SIGNATURES[Math.floor(Math.random() * ATTACK_SIGNATURES.length)]
      const color = attackColors[Math.floor(Math.random() * attackColors.length)]

      const p1 = project(origin.lng, origin.lat)
      const p2 = project(target.lng, target.lat)
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y)

      activeAttacks.push({
        id: `atk-${Date.now()}-${Math.random()}`,
        origin,
        target,
        type: sig.type.split(" ")[0],
        color,
        progress: 0,
        speed: 0.007 + Math.random() * 0.008,
        arcHeight: Math.min(Math.max(dist * 0.30, 30), 120),
        trail: [],
      })

      // Update HUD status with realistic telemetry drop info
      setHudFeed(`${origin.country} → ${target.name.split(" ")[0]} [${sig.type.split(" (")[0]}] • DROPPED 0.${Math.floor(Math.random() * 10 + 10)}ms`)
    }

    // Seed initial attacks
    spawnAttack()
    spawnAttack()

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      nodePulseAngle += 0.035

      const isDark = document.documentElement.classList.contains("dark")
      const { mapW, mapH, startX, startY } = getProjectionParams()

      // A. Subtle Lat/Long Cyber Graticule bounded to the tactical radar area
      ctx.lineWidth = 1
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"
      ctx.setLineDash([2, 6])

      for (let lng = -180; lng <= 180; lng += 30) {
        const { x } = project(lng, 0)
        ctx.beginPath()
        ctx.moveTo(x, Math.max(0, startY))
        ctx.lineTo(x, Math.min(height, startY + mapH))
        ctx.stroke()
      }

      for (let lat = -50; lat <= 70; lat += 20) {
        const { y } = project(0, lat)
        if (y < 0 || y > height) continue
        ctx.beginPath()
        ctx.moveTo(startX, y)
        ctx.lineTo(startX + mapW, y)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // B. Render World Continents from TopoJSON
      if (worldDataRef.current) {
        const landFeature = worldDataRef.current
        const coords =
          landFeature.geometry?.coordinates ||
          landFeature.features?.[0]?.geometry?.coordinates ||
          []

        ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.035)" : "rgba(0, 0, 0, 0.025)"
        ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.16)" : "rgba(0, 0, 0, 0.10)"
        ctx.lineWidth = 1

        for (const polygon of coords) {
          for (const ring of polygon) {
            // Skip Antarctica polygon to focus cleanly on inhabited VPS / threat regions
            const isAntarctica = ring.some(([_, lat]: [number, number]) => lat < -62)
            if (isAntarctica) continue

            ctx.beginPath()
            for (let i = 0; i < ring.length; i++) {
              const [lng, lat] = ring[i]
              const { x, y } = project(lng, lat)
              if (i === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
          }
        }
      }

      // C. Periodically Spawn Attacks
      if (time - lastSpawnTime > 1200 && activeAttacks.length < 8) {
        spawnAttack()
        lastSpawnTime = time
      }

      // D. Draw & Animate Cyber Attack Ballistic Trajectories
      for (let i = activeAttacks.length - 1; i >= 0; i--) {
        const atk = activeAttacks[i]
        atk.progress += atk.speed

        const p1 = project(atk.origin.lng, atk.origin.lat)
        const p2 = project(atk.target.lng, atk.target.lat)

        const midX = (p1.x + p2.x) / 2
        const midY = (p1.y + p2.y) / 2
        const cx = midX
        // Ballistic curve apex guard: stays at least 8px below the header line
        const maxArc = Math.max(10, midY - 8)
        const cy = Math.max(8, midY - Math.min(atk.arcHeight, maxArc))

        const t = Math.min(atk.progress, 1)
        const curX = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * cx + t * t * p2.x
        const curY = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * cy + t * t * p2.y

        atk.trail.push({ x: curX, y: curY, alpha: 1 })
        if (atk.trail.length > 20) atk.trail.shift()

        // 1. Faint Trajectory Arc
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.quadraticCurveTo(cx, cy, p2.x, p2.y)
        ctx.strokeStyle = `${atk.color}25`
        ctx.lineWidth = 1
        ctx.setLineDash([3, 5])
        ctx.stroke()
        ctx.setLineDash([])

        // 2. Fading Missile Trail
        for (let j = 0; j < atk.trail.length - 1; j++) {
          const pt1 = atk.trail[j]
          const pt2 = atk.trail[j + 1]
          const tailAlpha = (j / atk.trail.length) * 0.8
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.strokeStyle = `${atk.color}${Math.floor(tailAlpha * 255).toString(16).padStart(2, "0")}`
          ctx.lineWidth = 2.5 * (j / atk.trail.length)
          ctx.stroke()
        }

        // 3. Glowing Missile Head
        const glow = ctx.createRadialGradient(curX, curY, 0, curX, curY, 8)
        glow.addColorStop(0, "#ffffff")
        glow.addColorStop(0.4, atk.color)
        glow.addColorStop(1, "transparent")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(curX, curY, 6, 0, Math.PI * 2)
        ctx.fill()

        // 4. Attack Signature Label
        if (t > 0.25 && t < 0.85) {
          ctx.font = "10px monospace"
          ctx.fillStyle = isDark ? "rgba(244, 63, 94, 0.85)" : "rgba(225, 29, 72, 0.9)"
          ctx.fillText(atk.type, curX + 8, curY - 6)
        }

        // 5. Impact Defense Shockwave
        if (atk.progress >= 1) {
          activeExplosions.push({
            id: `exp-${Date.now()}-${Math.random()}`,
            x: p2.x,
            y: p2.y,
            radius: 4,
            maxRadius: 28,
            alpha: 1,
            text: `0.${Math.floor(Math.random() * 10 + 10)}ms DROP`,
            textY: p2.y - 12,
          })
          activeAttacks.splice(i, 1)
        }
      }

      // E. Render Defense Shockwaves & Floating Remediation Badges
      for (let i = activeExplosions.length - 1; i >= 0; i--) {
        const exp = activeExplosions[i]
        exp.radius += 0.85
        exp.alpha -= 0.025
        exp.textY -= 0.5

        if (exp.alpha <= 0) {
          activeExplosions.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(16, 185, 129, ${exp.alpha * 0.9})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.font = "bold 9px monospace"
        ctx.fillStyle = `rgba(16, 185, 129, ${exp.alpha})`
        ctx.textAlign = "center"
        ctx.fillText(exp.text, exp.x, exp.textY)
        ctx.textAlign = "start"
      }

      // F. Attacker Origin Nodes (Crimson Pulsing Nodes)
      for (const atk of ATTACKER_ORIGINS) {
        const { x, y } = project(atk.lng, atk.lat)
        if (y < -10 || y > height + 10) continue
        ctx.fillStyle = "rgba(244, 63, 94, 0.65)"
        ctx.beginPath()
        ctx.arc(x, y, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // G. Sentinel Armored Fleet Nodes (Emerald Glow Shields)
      for (const node of SENTINEL_NODES) {
        const { x, y } = project(node.lng, node.lat)
        if (y < -10 || y > height + 10) continue
        const pulse = Math.sin(nodePulseAngle) * 3

        // Outer Target Ring
        ctx.beginPath()
        ctx.arc(x, y, 9 + pulse, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)"
        ctx.lineWidth = 1
        ctx.stroke()

        // Inner Shield Core
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#10b981"
        ctx.fill()

        // Highlight
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.fill()

        // Identification Code
        const code = node.id.replace("node-", "").toUpperCase()
        ctx.font = "bold 9px monospace"
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.75)" : "rgba(0, 0, 0, 0.75)"
        ctx.fillText(code, x + 8, y + 3)
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Crisp at top under header, subtle bottom fade into next section */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)]">
        {/* 1. Neobrutalism Blueprint Dot Matrix */}
        <div
          className="absolute inset-0 bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-35 dark:opacity-20"
        />

        {/* 2. Full-Bleed 2D World Cyber Threat Map & Attack Trajectory Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full opacity-85 dark:opacity-75 transition-opacity"
        />
      </div>

      {/* 3. Live Attack Simulation Tactical HUD Status Pill */}
      <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 rounded-base border-2 border-border bg-card/95 px-3.5 py-1 font-mono text-[11px] font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)] backdrop-blur-sm z-20">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-rose-600" />
        </span>
        <span className="text-muted-foreground uppercase text-[10px]">LIVE THREAT SIMULATION:</span>
        <span className="text-foreground font-black tracking-wide">
          {hudFeed}
        </span>
      </div>

      {/* 4. Floating Neobrutalist Tactical Stickers in Corners */}
      <div className="hidden xl:block z-20">
        {/* Top-Left: eBPF Kernel Sticker */}
        <div className="absolute top-14 left-6 lg:left-10 rotate-[-5deg] animate-[bounce_5s_ease-in-out_infinite]">
          <div className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-amber-300 dark:bg-amber-400 px-3 py-1 font-mono text-xs font-black text-black shadow-[3px_3px_0px_0px_var(--border)]">
            <span className="text-sm">✦</span>
            <span>eBPF KERNEL FILTER</span>
          </div>
        </div>

        {/* Top-Right: 0.12ms Latency Sticker */}
        <div className="absolute top-16 right-6 lg:right-10 rotate-[5deg] animate-[bounce_6s_ease-in-out_infinite_reverse]">
          <div className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-main px-3 py-1 font-mono text-xs font-black text-main-foreground shadow-[3px_3px_0px_0px_var(--border)]">
            <span>⚡</span>
            <span>0.12ms ATOMIC DROP</span>
          </div>
        </div>


      </div>

      {/* 5. Neobrutalist Corner Brackets */}
      <div className="absolute top-3 left-3 size-4 border-t-2 border-l-2 border-border bg-secondary-background shadow-[2px_2px_0px_0px_var(--border)] hidden sm:block z-10" />
      <div className="absolute top-3 right-3 size-4 border-t-2 border-r-2 border-border bg-secondary-background shadow-[2px_2px_0px_0px_var(--border)] hidden sm:block z-10" />
      <div className="absolute bottom-6 left-6 size-4 border-b-2 border-l-2 border-border bg-secondary-background shadow-[2px_2px_0px_0px_var(--border)] hidden sm:block z-10" />
      <div className="absolute bottom-6 right-6 size-4 border-b-2 border-r-2 border-border bg-secondary-background shadow-[2px_2px_0px_0px_var(--border)] hidden sm:block z-10" />
    </div>
  )
}
