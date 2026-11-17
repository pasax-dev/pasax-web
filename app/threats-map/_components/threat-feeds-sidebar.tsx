"use client"

import * as React from "react"
import {
  type CyberAttackEvent,
  type SentinelNode,
} from "@/lib/threat-map-data"
import { Badge } from "@/components/ui/badge"
import {
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
    <aside className="flex h-full w-full flex-col border-l border-zinc-800/80 bg-[#090d1a]/95 text-zinc-100 backdrop-blur-md">
      {/* Header Panel */}
      <div className="border-b border-zinc-800/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-rose-600" />
            </span>
            <h2 className="font-mono text-xs font-black tracking-wider uppercase text-zinc-100">
              Cyber Threat Feeds
            </h2>
          </div>
          <span className="rounded border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400">
            REALTIME
          </span>
        </div>

        {/* Level accent bar */}
        <div className="mt-3 flex h-1 w-full gap-1 overflow-hidden rounded-full bg-zinc-800">
          <div className="w-1/3 bg-emerald-500" />
          <div className="w-1/2 bg-amber-500" />
          <div className="w-1/4 bg-rose-500 animate-pulse" />
        </div>

        {/* Section title & Speed Controls */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-mono font-bold text-zinc-300">
            <Zap className="size-3.5 text-amber-400" />
            <span className="text-[11px] tracking-tight">RECENT ATTACK STREAMS</span>
          </div>

          <div className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 shadow-sm">
            <span className="font-mono text-[10px] font-bold text-zinc-400 mr-1">
              RATE:
            </span>
            <button
              onClick={() => onChangeRate(Math.max(0.5, displayRateSec - 0.5))}
              className="flex size-4 items-center justify-center rounded hover:bg-zinc-800 text-zinc-300"
              title="Faster"
            >
              <Minus className="size-2.5" />
            </button>
            <span className="font-mono text-[11px] font-black text-amber-400 tabular-nums">{displayRateSec}s</span>
            <button
              onClick={() => onChangeRate(Math.min(5, displayRateSec + 0.5))}
              className="flex size-4 items-center justify-center rounded hover:bg-zinc-800 text-zinc-300"
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
              className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold transition-all ${
                filter === tab
                  ? "border border-amber-500/80 bg-amber-500 text-zinc-950 font-black shadow-sm"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stream List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {filteredAttacks.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center font-mono text-xs text-zinc-500">
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
                className={`group relative cursor-pointer rounded-md border p-2.5 transition-all ${
                  isSelected
                    ? "border-amber-500/80 bg-amber-500/10 shadow-md translate-x-0.5"
                    : "border-zinc-800/80 bg-[#0c1222]/80 hover:border-zinc-700 hover:bg-[#0c1222]"
                }`}
              >
                {/* Active Indicator line */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-md ${
                    isCritical
                      ? "bg-rose-500"
                      : isKernel
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                  }`}
                />

                <div className="pl-1.5">
                  {/* Top line: Signature & Time */}
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-mono text-xs font-bold leading-tight line-clamp-1 text-zinc-200 group-hover:text-amber-400">
                      {atk.type}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 shrink-0 tabular-nums">
                      {atk.timestamp}
                    </span>
                  </div>

                  {/* Origin info */}
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <span className="text-sm">{atk.origin.flag}</span>
                    <span className="font-mono font-bold text-zinc-200">
                      {atk.attackerIp}
                    </span>
                    <span className="text-[10px] text-zinc-500">({atk.origin.name})</span>
                  </div>

                  {/* Destination & Defense Action Badges */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-black uppercase ${
                        isKernel
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : isShield
                            ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {atk.defenseAction}
                    </span>

                    <span className="font-mono text-[9px] text-zinc-400 tabular-nums">
                      {atk.latencyMs}ms
                    </span>

                    <span className="ml-auto font-mono text-[9px] text-zinc-400 truncate max-w-[110px]">
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
      <div className="border-t border-zinc-800/80 bg-[#070b16] p-3">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded border border-zinc-800 bg-[#0c1222] p-2">
            <span className="block font-mono text-[9px] text-zinc-400 uppercase font-bold tracking-wider">
              SENTINEL DROPS
            </span>
            <span className="font-mono text-base font-black text-emerald-400 tabular-nums">
              99.98%
            </span>
          </div>
          <div className="rounded border border-zinc-800 bg-[#0c1222] p-2">
            <span className="block font-mono text-[9px] text-zinc-400 uppercase font-bold tracking-wider">
              AVG LATENCY
            </span>
            <span className="font-mono text-base font-black text-amber-400 tabular-nums">
              &lt;0.02 ms
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
