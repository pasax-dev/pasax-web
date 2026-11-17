"use client"

import * as React from "react"
import Link from "next/link"
import {
  ShieldCheck,
  Globe2,
  Box,
  Pause,
  Play,
  Plus,
  Minus,
  RotateCcw,
  Activity,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { REGIONS_VIEW } from "@/lib/threat-map-data"

interface ThreatMapHudProps {
  viewMode: "3D" | "2D"
  onToggleViewMode: (mode: "3D" | "2D") => void
  isRotating: boolean
  onToggleRotation: () => void
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onSelectRegion: (lat: number, lng: number) => void
  activeRegion: string | null
  attackCount: number
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function ThreatMapHud({
  viewMode,
  onToggleViewMode,
  isRotating,
  onToggleRotation,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onSelectRegion,
  activeRegion,
  attackCount,
  isSidebarOpen,
  onToggleSidebar,
}: ThreatMapHudProps) {
  // Format attack number with commas
  const formattedCount = React.useMemo(() => {
    return attackCount.toLocaleString("en-US")
  }, [attackCount])

  return (
    <>
      {/* Top Main Navigation Bar */}
      <header className="absolute top-0 inset-x-0 z-40 flex h-16 items-center justify-between border-b border-zinc-800/80 bg-[#090d1a]/85 px-4 backdrop-blur-md sm:px-6">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-sm transition-transform group-hover:scale-105">
              <ShieldCheck className="size-5 stroke-[2.5]" />
            </div>
            <span className="font-heading text-lg font-black tracking-tight text-zinc-100">
              PASAX<span className="text-amber-400">.</span>
            </span>
          </Link>

          <div className="hidden h-5 w-px bg-zinc-800 sm:block" />

          {/* Live Badge */}
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-emerald-400 shadow-sm">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-xs font-black uppercase tracking-wider">
              LIVE THREAT MAP
            </span>
          </div>
        </div>

        {/* Center Live Attacks Counter */}
        <div className="hidden items-center gap-3 rounded-md border border-zinc-800 bg-[#0c1222]/90 px-4 py-1.5 shadow-sm md:flex">
          <Activity className="size-4 text-rose-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              ATTACKS INTERCEPTED TODAY
            </span>
            <span className="font-mono text-base font-black tracking-tight text-zinc-100 tabular-nums">
              {formattedCount}
            </span>
          </div>
        </div>

        {/* Right Navigation & Mobile Feeds Toggle */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="hidden items-center gap-1 rounded-md border border-zinc-800 bg-[#0c1222]/80 px-3 py-1.5 font-mono text-xs font-bold text-zinc-200 shadow-sm transition-colors hover:border-zinc-700 hover:bg-zinc-800 sm:inline-flex"
          >
            &larr; Home
          </Link>

          <ThemeToggle />

          <Link
            href="/dashboard"
            className="hidden items-center gap-1.5 rounded-md border border-amber-500/60 bg-amber-500 px-3.5 py-1.5 font-mono text-xs font-bold text-zinc-950 shadow-sm transition-all hover:bg-amber-400 sm:inline-flex"
          >
            <span>SOC Console</span>
            <ArrowRight className="size-3.5" />
          </Link>

          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-[#0c1222] px-3 py-1.5 font-mono text-xs font-bold text-zinc-200 shadow-sm lg:hidden hover:bg-zinc-800"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Feeds</span>
          </button>
        </div>
      </header>

      {/* Top Left Floating Tactical Controls */}
      <div className="absolute top-20 left-4 z-30 flex flex-wrap items-center gap-2">
        {/* 2D / 3D Mode Selector */}
        <div className="flex items-center rounded-md border border-zinc-800 bg-[#090d1a]/90 p-1 shadow-md backdrop-blur-md">
          <button
            onClick={() => onToggleViewMode("2D")}
            className={`flex items-center gap-1 rounded px-2.5 py-1 font-mono text-xs font-bold uppercase transition-all ${
              viewMode === "2D"
                ? "bg-amber-500 text-zinc-950 shadow-sm"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            <Box className="size-3.5" />
            <span>2D</span>
          </button>
          <button
            onClick={() => onToggleViewMode("3D")}
            className={`flex items-center gap-1 rounded px-2.5 py-1 font-mono text-xs font-bold uppercase transition-all ${
              viewMode === "3D"
                ? "bg-amber-500 text-zinc-950 shadow-sm"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            <Globe2 className="size-3.5" />
            <span>3D</span>
          </button>
        </div>

        {/* Rotation Toggle Button */}
        {viewMode === "3D" && (
          <button
            onClick={onToggleRotation}
            aria-label={isRotating ? "Stop Rotation" : "Resume Rotation"}
            className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-[#090d1a]/90 px-3 py-1.5 font-mono text-xs font-bold uppercase text-zinc-200 shadow-md backdrop-blur-md transition-all hover:border-amber-500/50 hover:bg-zinc-800"
          >
            {isRotating ? (
              <>
                <Pause className="size-3.5 text-amber-400" />
                <span className="hidden sm:inline">STOP ROTATION</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 text-emerald-400" />
                <span className="hidden sm:inline">RESUME ROTATION</span>
              </>
            )}
          </button>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center rounded-md border border-zinc-800 bg-[#090d1a]/90 p-1 shadow-md backdrop-blur-md">
          <button
            onClick={onZoomOut}
            disabled={zoomLevel <= 0.6}
            className="flex size-7 items-center justify-center rounded hover:bg-zinc-800 disabled:opacity-30 text-zinc-300"
            title="Zoom Out"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] font-bold text-zinc-200 tabular-nums">
            {zoomLevel.toFixed(1)}x
          </span>
          <button
            onClick={onZoomIn}
            disabled={zoomLevel >= 2.4}
            className="flex size-7 items-center justify-center rounded hover:bg-zinc-800 disabled:opacity-30 text-zinc-300"
            title="Zoom In"
          >
            <Plus className="size-3.5" />
          </button>
          <button
            onClick={onResetZoom}
            className="ml-1 flex size-7 items-center justify-center rounded border-l border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Reset Zoom"
          >
            <RotateCcw className="size-3" />
          </button>
        </div>
      </div>

      {/* Bottom Continent Quick-Focus Dock */}
      <div className="absolute bottom-12 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-[#090d1a]/95 p-1.5 shadow-xl backdrop-blur-md">
          {REGIONS_VIEW.map((region) => {
            const isSelected = activeRegion === region.label
            return (
              <button
                key={region.label}
                onClick={() => onSelectRegion(region.lat, region.lng)}
                className={`rounded px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider uppercase transition-all ${
                  isSelected
                    ? "border border-amber-500/60 bg-amber-500 text-zinc-950 font-black shadow-sm"
                    : "border border-zinc-800/80 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
                }`}
              >
                {region.label}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
