"use client"

import * as React from "react"
import { type SentinelNode } from "@/lib/threat-map-data"
import { ShieldCheck, Cpu, Zap, Activity, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SentinelNodeModalProps {
  node: SentinelNode | null
  onClose: () => void
}

export function SentinelNodeModal({ node, onClose }: SentinelNodeModalProps) {
  if (!node) return null

  return (
    <div className="absolute top-20 right-4 z-40 w-80 rounded-base border-2 border-border bg-card p-4 shadow-[4px_4px_0px_0px_var(--border)] backdrop-blur-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{node.flag}</span>
          <div>
            <h3 className="font-heading text-sm font-black text-foreground">
              {node.name}
            </h3>
            <span className="font-mono text-[10px] text-muted-foreground uppercase font-bold">
              {node.country}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close node details"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Badges & Layer */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge
          variant="outline"
          className="border-2 border-border bg-main font-mono text-[10px] font-black text-main-foreground"
        >
          {node.role.replace("_", " ")}
        </Badge>
        <Badge
          variant="outline"
          className="border border-border font-mono text-[10px] font-bold text-foreground"
        >
          {node.layer}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t-2 border-border pt-3">
        <div className="rounded border border-border bg-secondary-background p-2 text-center">
          <span className="block font-mono text-[9px] uppercase text-muted-foreground font-bold">
            DROPS TODAY
          </span>
          <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
            {node.activeDropsToday.toLocaleString()}
          </span>
        </div>
        <div className="rounded border border-border bg-secondary-background p-2 text-center">
          <span className="block font-mono text-[9px] uppercase text-muted-foreground font-bold">
            FILTER SPEED
          </span>
          <span className="font-mono text-sm font-black text-main">
            {node.avgLatencyMs} ms
          </span>
        </div>
      </div>

      {/* Coordinates */}
      <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
        <span>LAT: {node.lat.toFixed(4)}</span>
        <span>LNG: {node.lng.toFixed(4)}</span>
      </div>
    </div>
  )
}

