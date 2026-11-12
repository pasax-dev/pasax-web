"use client"

import * as React from "react"
import {
  ShieldAlert,
  Globe2,
  Cpu,
  Shield,
  Radio,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ThreatStatsPanelProps {
  isOpen: boolean
  onToggle: () => void
}

const TOP_ORIGINS = [
  { country: "Russia", flag: "🇷🇺", attacks: "4.2M", percent: 28 },
  { country: "China", flag: "🇨🇳", attacks: "3.5M", percent: 23 },
  { country: "Romania", flag: "🇷🇴", attacks: "2.1M", percent: 14 },
  { country: "Nigeria", flag: "🇳🇬", attacks: "1.8M", percent: 12 },
  { country: "Brazil", flag: "🇧🇷", attacks: "1.4M", percent: 9 },
]

const TOP_TARGETS = [
  { name: "Jakarta Primary Cluster", flag: "🇮🇩", blocked: "4.8M", percent: 32 },
  { name: "Frankfurt EU Core", flag: "🇩🇪", blocked: "3.9M", percent: 26 },
  { name: "New York US-East", flag: "🇺🇸", blocked: "3.1M", percent: 21 },
  { name: "Tokyo East-Asia Hub", flag: "🇯🇵", blocked: "1.9M", percent: 13 },
  { name: "Singapore APAC Gateway", flag: "🇸🇬", blocked: "1.2M", percent: 8 },
]

const ATTACK_VECTORS = [
  { name: "Kernel nftables Drops (Layer 2)", count: "10,126,961", percent: 68, color: "bg-emerald-500" },
  { name: "Laravel Shield App Blocks (Layer 1)", count: "3,574,221", percent: 24, color: "bg-sky-500" },
  { name: "Tarpit Decoy Honeypots (Layer 3)", count: "1,191,408", percent: 8, color: "bg-amber-500" },
]

export function ThreatStatsPanel({ isOpen, onToggle }: ThreatStatsPanelProps) {
  return (
    <div
      className={`absolute bottom-0 inset-x-0 z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-48px)]"
      }`}
    >
      {/* Drawer Toggle Header Bar */}
      <div className="flex justify-center">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 rounded-t-base border-t-2 border-x-2 border-border bg-card px-4 py-2 font-heading text-xs font-black uppercase text-foreground shadow-[0_-2px_6px_rgba(0,0,0,0.2)] hover:bg-muted"
        >
          <BarChart3 className="size-3.5 text-main" />
          <span>Global Attack Breakdown & Statistics</span>
          {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
        </button>
      </div>

      {/* Statistics Panel Body */}
      <div className="max-h-[60vh] overflow-y-auto border-t-2 border-border bg-card/95 p-5 shadow-2xl backdrop-blur-md">
        <div className="mx-auto max-w-full">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 1. Top Attack Origins */}
            <div className="rounded-base border-2 border-border bg-secondary-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center justify-between border-b-2 border-border pb-2">
                <span className="font-heading text-xs font-black uppercase text-foreground">
                  Top Attack Origins
                </span>
                <Badge variant="outline" className="font-mono text-[9px] font-bold">
                  GEOLOCATION
                </Badge>
              </div>
              <div className="mt-3 space-y-2.5">
                {TOP_ORIGINS.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 font-bold text-foreground">
                        <span>{item.flag}</span>
                        <span>{item.country}</span>
                      </span>
                      <span className="text-muted-foreground">{item.attacks} ({item.percent}%)</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Top Defended Targets */}
            <div className="rounded-base border-2 border-border bg-secondary-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center justify-between border-b-2 border-border pb-2">
                <span className="font-heading text-xs font-black uppercase text-foreground">
                  Top Defended Clusters
                </span>
                <Badge variant="outline" className="font-mono text-[9px] font-bold">
                  SENTINEL MESH
                </Badge>
              </div>
              <div className="mt-3 space-y-2.5">
                {TOP_TARGETS.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 font-bold text-foreground">
                        <span>{item.flag}</span>
                        <span className="truncate max-w-[130px]">{item.name}</span>
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.blocked} ({item.percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Defense Layer Mitigation Share */}
            <div className="rounded-base border-2 border-border bg-secondary-background p-4 shadow-[3px_3px_0px_0px_var(--border)]">
              <div className="flex items-center justify-between border-b-2 border-border pb-2">
                <span className="font-heading text-xs font-black uppercase text-foreground">
                  Mitigation by Defense Layer
                </span>
                <Badge variant="outline" className="font-mono text-[9px] font-bold">
                  TRINITY RATIO
                </Badge>
              </div>
              <div className="mt-3 space-y-3">
                {ATTACK_VECTORS.map((vec, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-foreground text-[11px] truncate max-w-[170px]">
                        {vec.name}
                      </span>
                      <span className="font-black text-foreground">{vec.percent}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${vec.color} rounded-full`}
                        style={{ width: `${vec.percent}%` }}
                      />
                    </div>
                    <span className="block text-[10px] font-mono text-muted-foreground">
                      {vec.count} intercepted attacks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
