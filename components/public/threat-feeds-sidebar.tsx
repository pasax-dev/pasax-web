"use client"

import * as React from "react"
import {
  type CyberAttackEvent,
  type SentinelNode,
} from "@/lib/threat-map-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ShieldAlert,
  Flame,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  Minus,
  Plus,
  Zap,
} from "lucide-react"

interface ThreatFeedsSidebarProps {
  attacks: CyberAttackEvent[]
  activeAttack: CyberAttackEvent | null
  displayRateSec: number
  onChangeRate: (newRate: number) => void
  onSelectAttack: (attack: CyberAttackEvent) => void
  onSelectNode: (node: SentinelNode) => void
}

export function ThreatFeedsSidebar({
  attacks,
  activeAttack,
  displayRateSec,
  onChangeRate,
  onSelectAttack,
  onSelectNode,
}: ThreatFeedsSidebarProps) {
  const [filter, setFilter] = React.useState<"ALL" | "CRITICAL" | "KERNEL" | "SHIELD" | "HONEYPOT">("ALL")

  const filteredAttacks = React.useMemo(() => {
    return attacks.filter((atk) => {
      if (filter === "ALL") return true
      if (filter === "CRITICAL") return atk.severity === "critical"
      if (filter === "KERNEL") return atk.defenseAction.includes("nftables")
      if (filter === "SHIELD") return atk.defenseAction.includes("Shield")
      if (filter === "HONEYPOT") return atk.defenseAction.includes("Honeypot")
      return true
    })
  }, [attacks, filter])

  return (
    <aside className="flex h-full w-full flex-col border-l-2 border-border bg-card/95 text-foreground backdrop-blur-md">
      {/* Header Panel */}
      <div className="border-b-2 border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-rose-600" />
            </span>
            <h2 className="font-heading text-sm font-black tracking-wider uppercase text-foreground">
              Cyber Threat Feeds
            </h2>
          </div>
          <Badge
            variant="outline"
            className="border-2 border-border bg-main font-mono text-[10px] font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
          >
            REALTIME
          </Badge>
        </div>

        {/* Level accent bar */}
        <div className="mt-2.5 flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-muted">
          <div className="w-1/3 bg-emerald-500" />
          <div className="w-1/2 bg-amber-500" />
          <div className="w-1/4 bg-rose-500 animate-pulse" />
        </div>

        {/* Section title & Speed Controls */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-heading font-bold text-foreground/80">
            <Zap className="size-3.5 text-amber-500" />
            <span>RECENT ATTACK STREAMS</span>
          </div>

          <div className="flex items-center gap-1 rounded-base border-2 border-border bg-secondary-background px-1.5 py-0.5 shadow-[1px_1px_0px_0px_var(--border)]">
            <span className="font-mono text-[10px] font-semibold text-muted-foreground mr-1">
              RATE:
            </span>
            <button
              onClick={() => onChangeRate(Math.max(0.5, displayRateSec - 0.5))}
              className="flex size-4 items-center justify-center rounded hover:bg-muted font-bold"
              title="Faster"
            >
              <Minus className="size-2.5" />
            </button>
            <span className="font-mono text-[11px] font-black">{displayRateSec}s</span>
            <button
              onClick={() => onChangeRate(Math.min(5, displayRateSec + 0.5))}
              className="flex size-4 items-center justify-center rounded hover:bg-muted font-bold"
              title="Slower"
            >
              <Plus className="size-2.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-3 flex flex-wrap gap-1">
          {(["ALL", "CRITICAL", "KERNEL", "SHIELD", "HONEYPOT"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-base px-2 py-0.5 text-[10px] font-heading font-bold transition-all ${
                filter === tab
                  ? "border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
                  : "border border-border/40 bg-secondary-background/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stream List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
        {filteredAttacks.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center font-mono text-xs text-muted-foreground">
            Awaiting incoming telemetry packets...
          </div>
        ) : (
          filteredAttacks.map((atk) => {
            const isSelected = activeAttack?.id === atk.id
            const isCritical = atk.severity === "critical"
            const isKernel = atk.defenseAction.includes("nftables")
            const isShield = atk.defenseAction.includes("Shield")

            return (
              <div
                key={atk.id}
                onClick={() => onSelectAttack(atk)}
                className={`group relative cursor-pointer rounded-base border-2 p-2.5 transition-all ${
                  isSelected
                    ? "border-main bg-main/10 shadow-[3px_3px_0px_0px_var(--border)] translate-x-0.5"
                    : "border-border bg-secondary-background hover:border-main/70 hover:shadow-[2px_2px_0px_0px_var(--border)]"
                }`}
              >
                {/* Active Indicator line */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-base ${
                    isCritical
                      ? "bg-rose-500"
                      : isKernel
                        ? "bg-emerald-500"
                        : "bg-sky-500"
                  }`}
                />

                <div className="pl-1.5">
                  {/* Top line: Signature & Time */}
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-heading text-xs font-bold leading-tight line-clamp-1 group-hover:text-main">
                      {atk.type}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                      {atk.timestamp}
                    </span>
                  </div>

                  {/* Origin info */}
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-sm">{atk.origin.flag}</span>
                    <span className="font-mono font-bold text-foreground">
                      {atk.attackerIp}
                    </span>
                    <span className="text-[10px]">({atk.origin.name})</span>
                  </div>

                  {/* Destination & Defense Action Badges */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-black uppercase ${
                        isKernel
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                          : isShield
                            ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/40"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/40"
                      }`}
                    >
                      {atk.defenseAction}
                    </span>

                    <span className="font-mono text-[9px] text-muted-foreground">
                      {atk.latencyMs}ms
                    </span>

                    <span className="ml-auto font-mono text-[9px] text-foreground/70 truncate max-w-[110px]">
                      &rarr; {atk.targetNode.country}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer System Telemetry Status */}
      <div className="border-t-2 border-border bg-secondary-background/80 p-3">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded border-2 border-border bg-card p-2 shadow-[2px_2px_0px_0px_var(--border)]">
            <span className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">
              SENTINEL DROPS
            </span>
            <span className="font-heading text-base font-black text-emerald-600 dark:text-emerald-400">
              99.4%
            </span>
          </div>
          <div className="rounded border-2 border-border bg-card p-2 shadow-[2px_2px_0px_0px_var(--border)]">
            <span className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">
              AVG LATENCY
            </span>
            <span className="font-heading text-base font-black text-main">
              0.14 ms
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

