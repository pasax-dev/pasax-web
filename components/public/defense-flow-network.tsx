"use client"

import * as React from "react"
import { Shield, Cpu, Cloud, CheckCircle2, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StageDetail {
  id: "l1" | "l2" | "l3"
  title: string
  subtitle: string
  icon: any
  tag: string
  color: string
  desc: string
  metrics: { label: string; value: string }[]
  rules: string[]
}

const STAGES: StageDetail[] = [
  {
    id: "l1",
    title: "Layer 1: Laravel Shield",
    subtitle: "Application L7 WAF & Heuristics",
    icon: Shield,
    tag: "PHP RUNTIME",
    color: "sky",
    desc: "Intercepts incoming HTTP requests inside Laravel middleware before Eloquent or controller execution. Blocks SQLi, XSS, Path Traversal, and fake bots.",
    metrics: [
      { label: "Inspection Overhead", value: "< 0.4ms" },
      { label: "Payload Sanitizer", value: "AST Analysis" },
      { label: "Bot Trap Route", value: "Auto-Tarpit" },
    ],
    rules: [
      "Strict parameter typecasting validation",
      "Honeypot hidden input field trap",
      "Dynamic CSRF / Token signature validation",
    ],
  },
  {
    id: "l2",
    title: "Layer 2: Go Sentinel",
    subtitle: "Kernel Ingress eBPF & nftables",
    icon: Cpu,
    tag: "LINUX KERNEL",
    color: "emerald",
    desc: "Standalone native Go daemon running on the host server. Listens to IPC signals and directly manipulates kernel nftables sets to drop malicious IP packets instantly.",
    metrics: [
      { label: "Kernel Drop Latency", value: "< 0.15ms" },
      { label: "Packet Drop Rate", value: "Wire Speed" },
      { label: "Memory Footprint", value: "< 14 MB RAM" },
    ],
    rules: [
      "nftables dynamic IP blacklist set",
      "Raw socket SYN-flood rate limiter",
      "Inotify File Integrity (FIM) watcher",
    ],
  },
  {
    id: "l3",
    title: "Layer 3: Pasax Cloud SOC",
    subtitle: "Decentralized Mesh & Reputation",
    icon: Cloud,
    tag: "GLOBAL MESH",
    color: "amber",
    desc: "Aggregates telemetry from all Sentinel agents across the fleet. Distributes zero-day threat intelligence and bad-actor IP lists via peer-to-peer mTLS gossip.",
    metrics: [
      { label: "Fleet Sync Latency", value: "< 180ms" },
      { label: "Mesh Consensus", value: "mTLS + Protobuf" },
      { label: "Global Threat DB", value: "Realtime" },
    ],
    rules: [
      "Automated IP reputation scoring",
      "Incident replay & audit log export",
      "Multi-tenant cluster analytics",
    ],
  },
]

export function DefenseFlowNetwork() {
  const [selectedStage, setSelectedStage] = React.useState<"l1" | "l2" | "l3">(
    "l2"
  )
  const current = STAGES.find((s) => s.id === selectedStage) || STAGES[1]

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
            </span>
            <h3 className="font-heading text-base font-bold tracking-tight text-foreground">
              Triple-Defense Telemetry Dataflow
            </h3>
          </div>
          <p className="mt-0.5 font-sans text-xs text-muted-foreground">
            Synchronized packet flow from application middleware down to Linux
            kernel wire-speed drops
          </p>
        </div>

        <Badge
          variant="outline"
          className="rounded-full border-sky-500/30 bg-sky-500/10 font-mono text-xs font-semibold text-sky-500"
        >
          ARCHITECTURE TRINITY
        </Badge>
      </div>

      {/* 3-Stage Interactive Node Flow */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {STAGES.map((stage, idx) => {
          const isSelected = selectedStage === stage.id
          const Icon = stage.icon

          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`group relative cursor-pointer rounded-xl border p-4 transition-all ${
                isSelected
                  ? "border-sky-500/50 bg-sky-500/10 shadow-lg"
                  : "border-border/40 bg-muted/20 hover:border-border hover:bg-muted/40"
              }`}
            >
              {/* Top Row: Icon & Tag */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex size-9 items-center justify-center rounded-lg border ${
                    isSelected
                      ? "border-sky-500/40 bg-sky-500/20 text-sky-500"
                      : "border-border/40 bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </div>
                <span className="rounded-full border border-border/40 px-2 py-0.5 font-mono text-[9px] font-semibold text-muted-foreground uppercase">
                  {stage.tag}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="mt-3">
                <h4 className="font-heading text-sm font-bold text-foreground">
                  {stage.title}
                </h4>
                <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                  {stage.subtitle}
                </p>
              </div>

              {/* Stage Step Number */}
              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[11px] text-muted-foreground">
                <span>STAGE 0{idx + 1} OF 03</span>
                <span className="font-sans font-semibold text-sky-500 group-hover:underline">
                  {isSelected ? "INSPECTING" : "VIEW"} &rarr;
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Animated Beam Connection Visualizer */}
      <div className="relative my-4 hidden h-6 items-center justify-center md:flex">
        <div className="h-px w-full bg-border/40" />
        <div className="absolute inset-x-12 h-0.5 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 opacity-40" />
        <div className="absolute size-2.5 -translate-y-1/2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
      </div>

      {/* Deep Inspection Panel for Selected Stage */}
      <div className="mt-4 rounded-xl border border-border/40 bg-muted/20 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl xl:max-w-4xl">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-sky-500" />
              <h4 className="font-heading text-sm font-bold text-foreground">
                {current.title} Deep Inspection
              </h4>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {current.desc}
            </p>
          </div>

          {/* Key Metrics Chips */}
          <div className="flex flex-wrap gap-2">
            {current.metrics.map((m, i) => (
              <div
                key={i}
                className="rounded-lg border border-border/40 bg-card/60 px-3 py-1.5 text-center shadow-xs"
              >
                <span className="block font-mono text-[9px] font-medium text-muted-foreground uppercase">
                  {m.label}
                </span>
                <span className="font-mono text-xs font-bold text-foreground">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Primitives Checklist */}
        <div className="mt-4 border-t border-border/40 pt-3">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            ACTIVE ENFORCEMENT PRIMITIVES
          </span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {current.rules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg border border-border/30 bg-card/40 p-2 font-sans text-xs text-foreground/90"
              >
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                <span className="truncate">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
