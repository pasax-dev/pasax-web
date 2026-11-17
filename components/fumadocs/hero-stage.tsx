"use client"

import * as React from "react"
import { IllosThreatDetection } from "@/components/illos"
import { Chip } from "./chip"

export function HeroStage() {
  const [activeChip, setActiveChip] = React.useState<string>("ebpf")

  const readouts: Record<string, { title: string; desc: string }> = {
    ebpf: {
      title: "eBPF KERNEL ENGINE",
      desc: "Raw socket inspection before userland syscall context switches",
    },
    drops: {
      title: "0.2ms NFTABLES DROPS",
      desc: "Instant SYN-flood & webshell packet drops directly in ring-buffer",
    },
    lock: {
      title: "11ms FILE AUTO-LOCK",
      desc: "Immutable chmod 000 + chattr +i trigger on unauthorized .env edits",
    },
    mesh: {
      title: "mTLS EGRESS MESH",
      desc: "Zero open inbound firewall ports. Pure outbound wireguard telemetry",
    },
  }

  return (
    <div className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden border border-lp-line-strong bg-lp-paper-2 p-6 lg:min-h-[520px]">
      {/* Background Technical Grid & Crosshairs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--lp-line-strong)_1px,transparent_1px),linear-gradient(to_bottom,var(--lp-line-strong)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.12]"
      />

      {/* Decorative Technical Crosses */}
      <div className="pointer-events-none absolute top-4 left-4 font-mono text-xs text-lp-ink-2 select-none">
        [SYS_COORD: 52.3676°N, 4.9041°E]
      </div>
      <div className="pointer-events-none absolute top-4 right-4 font-mono text-xs text-lp-ink-2 select-none">
        [MODE: SENTINEL_ACTIVE]
      </div>

      {/* Central Visual Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Fumadocs Speech Bubble */}
        <div className="mb-4 inline-flex items-center gap-2 border border-lp-line-strong bg-lp-paper px-3 py-1.5 shadow-sm">
          <span className="size-2 animate-pulse rounded-full border border-lp-ink bg-lp-sun" />
          <div className="font-mono text-xs text-lp-ink">
            <span className="font-semibold text-lp-orange">
              {readouts[activeChip].title}:
            </span>{" "}
            <span className="text-lp-ink-2">{readouts[activeChip].desc}</span>
          </div>
        </div>

        {/* The Animated Illo */}
        <div className="relative size-64 sm:size-72 lg:size-80">
          <IllosThreatDetection className="size-full" />
        </div>

        {/* Orbiting / Surrounding Satellite Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveChip("ebpf")}
            className="cursor-pointer"
          >
            <Chip icon="ebpf" active={activeChip === "ebpf"}>
              eBPF Kernel
            </Chip>
          </button>
          <button
            type="button"
            onClick={() => setActiveChip("drops")}
            className="cursor-pointer"
          >
            <Chip icon="network" active={activeChip === "drops"}>
              &lt; 0.2ms Drops
            </Chip>
          </button>
          <button
            type="button"
            onClick={() => setActiveChip("lock")}
            className="cursor-pointer"
          >
            <Chip icon="shield" active={activeChip === "lock"}>
              11ms Auto-Lock
            </Chip>
          </button>
          <button
            type="button"
            onClick={() => setActiveChip("mesh")}
            className="cursor-pointer"
          >
            <Chip icon="cloud" active={activeChip === "mesh"}>
              mTLS SOC Mesh
            </Chip>
          </button>
        </div>
      </div>

      {/* Stage Bottom Status Line */}
      <div className="absolute inset-x-0 bottom-0 flex h-7 items-center justify-between border-t border-lp-line-strong bg-lp-paper px-4 font-mono text-[11px] text-lp-ink-2 select-none">
        <span>RING-0 BUFFER: PASSING</span>
        <span className="font-medium text-lp-orange">SOC SYNCHRONIZED</span>
        <span>LATENCY: 0.18ms</span>
      </div>
    </div>
  )
}
