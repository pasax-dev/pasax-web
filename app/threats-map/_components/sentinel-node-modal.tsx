"use client"

import * as React from "react"
import { type SentinelNode } from "@/lib/threat-map-data"
import { X, ShieldCheck } from "lucide-react"

interface SentinelNodeModalProps {
  node: SentinelNode | null
  onClose: () => void
}

export function SentinelNodeModal({ node, onClose }: SentinelNodeModalProps) {
  if (!node) return null

  return (
    <div className="absolute top-20 right-4 z-40 w-80 rounded-lg border border-zinc-800 bg-[#090d1a]/95 p-4 shadow-2xl backdrop-blur-md text-zinc-100 animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl drop-shadow-sm">{node.flag}</span>
          <div>
            <h3 className="font-mono text-sm font-black text-zinc-100 flex items-center gap-1.5">
              <span>{node.name}</span>
              <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
            </h3>
            <span className="font-mono text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
              {node.country} &bull; FLEET BASTION
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          aria-label="Close node details"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Badges & Layer */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 uppercase">
          {node.role.replace("_", " ")}
        </span>
        <span className="rounded border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-300 uppercase">
          {node.layer}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3">
        <div className="rounded border border-zinc-800 bg-[#0c1222] p-2 text-center">
          <span className="block font-mono text-[9px] uppercase text-zinc-400 font-bold tracking-wider">
            DROPS TODAY
          </span>
          <span className="font-mono text-sm font-black text-emerald-400 tabular-nums">
            {node.activeDropsToday.toLocaleString()}
          </span>
        </div>
        <div className="rounded border border-zinc-800 bg-[#0c1222] p-2 text-center">
          <span className="block font-mono text-[9px] uppercase text-zinc-400 font-bold tracking-wider">
            FILTER SPEED
          </span>
          <span className="font-mono text-sm font-black text-amber-400 tabular-nums">
            {node.avgLatencyMs} ms
          </span>
        </div>
      </div>

      {/* Coordinates & Status */}
      <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-zinc-400 border-t border-zinc-800/60 pt-2">
        <span>LAT: {node.lat.toFixed(4)}</span>
        <span>LNG: {node.lng.toFixed(4)}</span>
      </div>
    </div>
  )
}
