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
  const mousePosRef = React.useRef<{ x: number; y: number }>({
    x: -1000,
    y: -1000,
  })
  const worldDataRef = React.useRef<any>(null)
  const [hudFeed, setHudFeed] = React.useState<string>(
    "SIMULATION ACTIVE • 9 SENTINEL NODES ARMORED"
  )

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

    let width = (canvas.width =
      canvas.parentElement?.clientWidth || window.innerWidth)
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
    const getProjectionParams = () => {
      const mapW = width * 0.96
      const mapH = Math.max(height * 0.92, 720)
      const startX = (width - mapW) / 2
      const startY = -Math.max(65, height * 0.085)
      return { mapW, mapH, startX, startY }
    }

    const project = (lng: number, lat: number) => {
      const { mapW, mapH, startX, startY } = getProjectionParams()
      const x = startX + ((lng + 180) / 360) * mapW
      const clampedLat = Math.max(-85, Math.min(85, lat))
      const rad = (clampedLat * Math.PI) / 180
      const mercN = Math.log(Math.tan(Math.PI / 4 + rad / 2))
      const maxMerc = Math.log(Math.tan(Math.PI / 4 + (85 * Math.PI) / 360))
      const y = startY + (mapH / 2 - (mercN / (2 * maxMerc)) * mapH)
      return { x, y }
    }

    // Animation state
    const attacks: ActiveAttackArc[] = []
    const explosions: DefenseExplosion[] = []
    let lastSpawnTime = performance.now()
    let frameCount = 0

    const spawnAttack = () => {
      const origin =
        ATTACKER_ORIGINS[Math.floor(Math.random() * ATTACKER_ORIGINS.length)]
      const target =
        SENTINEL_NODES[Math.floor(Math.random() * SENTINEL_NODES.length)]
      const sig =
        ATTACK_SIGNATURES[Math.floor(Math.random() * ATTACK_SIGNATURES.length)]
      const color = sig.severity === "critical" ? "#f43f5e" : sig.severity === "high" ? "#f59e0b" : "#38bdf8"

      attacks.push({
        id: Math.random().toString(36).substring(2, 9),
        origin,
        target,
        type: sig.type,
        color,
        progress: 0,
        speed: 0.007 + Math.random() * 0.006,
        arcHeight: 30 + Math.random() * 60,
        trail: [],
      })

      if (Math.random() > 0.4) {
        setHudFeed(
          `BLOCKED ${sig.type} → ${target.name} [0.12ms nftables]`
        )
      }
    }

    // Initial warm-up attacks
    for (let i = 0; i < 4; i++) {
      spawnAttack()
      if (attacks[i]) attacks[i].progress = Math.random() * 0.8
    }

    const render = (time: number) => {
      frameCount++
      ctx.clearRect(0, 0, width, height)

      // Spawn incoming threat arcs periodically
      if (time - lastSpawnTime > 900 && attacks.length < 8) {
        spawnAttack()
        lastSpawnTime = time
      }

      // 1. Draw World Landmass outlines if loaded
      const land = worldDataRef.current
      if (land && land.coordinates) {
        const isDark = document.documentElement.classList.contains("dark")
        ctx.fillStyle = isDark
          ? "rgba(56, 189, 248, 0.025)"
          : "rgba(14, 165, 233, 0.03)"
        ctx.strokeStyle = isDark
          ? "rgba(56, 189, 248, 0.08)"
          : "rgba(14, 165, 233, 0.1)"
        ctx.lineWidth = 0.8

        const drawPolygon = (ring: [number, number][]) => {
          if (ring.length === 0) return
          ctx.beginPath()
          const p0 = project(ring[0][0], ring[0][1])
          ctx.moveTo(p0.x, p0.y)
          for (let i = 1; i < ring.length; i++) {
            const pt = project(ring[i][0], ring[i][1])
            ctx.lineTo(pt.x, pt.y)
          }
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }

        if (land.type === "Polygon") {
          land.coordinates.forEach(drawPolygon)
        } else if (land.type === "MultiPolygon") {
          land.coordinates.forEach((poly: any) => poly.forEach(drawPolygon))
        }
      }

      // 2. Draw Sentinel Fleet Defense Nodes
      SENTINEL_NODES.forEach((node) => {
        const { x, y } = project(node.lng, node.lat)
        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) return

        const pulseScale = 1 + Math.sin(frameCount * 0.05 + node.lat) * 0.2
        ctx.beginPath()
        ctx.arc(x, y, 7 * pulseScale, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(56, 189, 248, 0.12)"
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#38bdf8"
        ctx.fill()
      })

      // 3. Draw & Advance Attack Arcs
      for (let i = attacks.length - 1; i >= 0; i--) {
        const atk = attacks[i]
        const pStart = project(atk.origin.lng, atk.origin.lat)
        const pEnd = project(atk.target.lng, atk.target.lat)

        atk.progress += atk.speed

        const t = Math.min(atk.progress, 1)
        const curX = pStart.x + (pEnd.x - pStart.x) * t
        const curY =
          pStart.y +
          (pEnd.y - pStart.y) * t -
          Math.sin(t * Math.PI) * atk.arcHeight

        atk.trail.push({ x: curX, y: curY, alpha: 1.0 })
        if (atk.trail.length > 18) atk.trail.shift()

        // Render Trail
        for (let j = 0; j < atk.trail.length - 1; j++) {
          const pt1 = atk.trail[j]
          const pt2 = atk.trail[j + 1]
          const trailAlpha = (j / atk.trail.length) * 0.7

          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.strokeStyle = atk.color
          ctx.globalAlpha = trailAlpha
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
        ctx.globalAlpha = 1.0

        // Leading missile head
        ctx.beginPath()
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = atk.color
        ctx.fill()

        // Intercept Explosion when reaching node
        if (atk.progress >= 1) {
          explosions.push({
            id: Math.random().toString(36).substring(2, 9),
            x: pEnd.x,
            y: pEnd.y,
            radius: 2,
            maxRadius: 22,
            alpha: 1.0,
            text: `BLOCKED 0.12ms`,
            textY: pEnd.y - 10,
          })
          attacks.splice(i, 1)
        }
      }

      // 4. Draw Intercept Explosions
      for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i]
        exp.radius += 0.8
        exp.alpha -= 0.035
        exp.textY -= 0.4

        if (exp.alpha <= 0) {
          explosions.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(56, 189, 248, ${exp.alpha})`
        ctx.lineWidth = 1.2
        ctx.stroke()

        ctx.font = "9px 'Geist Mono', 'Space Mono', monospace"
        ctx.fillStyle = `rgba(56, 189, 248, ${exp.alpha * 0.9})`
        ctx.textAlign = "center"
        ctx.fillText(exp.text, exp.x, exp.textY)
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
      {/* Fumadocs-Style Ambient Top Glow & Diffuse Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,243,131,0.10),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,243,131,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_30%,rgba(255,122,51,0.06),transparent_60%)]" />

      {/* Subtle Blueprint Dot Grid Matrix */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,black_40%,transparent_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-25 dark:opacity-15" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full opacity-70 transition-opacity dark:opacity-60"
        />
      </div>

      {/* Fumadocs Minimal Pill Status Indicator */}
      <div className="absolute top-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-border/50 bg-background/60 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md sm:flex">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
        </span>
        <span className="font-mono text-[11px] font-medium tracking-wide">
          {hudFeed}
        </span>
      </div>
    </div>
  )
}
