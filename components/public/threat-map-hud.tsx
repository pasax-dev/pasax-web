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
  Radio,
  Layers,
  Activity,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
      <header className="absolute top-0 inset-x-0 z-40 flex h-16 items-center justify-between border-b-2 border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5">
              <ShieldCheck className="size-5 stroke-[2.5]" />
            </div>
            <span className="font-heading text-lg font-black tracking-tight text-foreground">
              PASAK<span className="text-main">.</span>
            </span>
          </Link>

          <div className="hidden h-5 w-px bg-border sm:block" />

          {/* Live Badge */}
          <div className="flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-2.5 py-1 shadow-[2px_2px_0px_0px_var(--border)]">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-heading text-xs font-black uppercase tracking-wider text-foreground">
              LIVE THREAT MAP
            </span>
          </div>
        </div>

        {/* Center Live Attacks Counter */}
        <div className="hidden items-center gap-3 rounded-base border-2 border-border bg-secondary-background px-4 py-1.5 shadow-[2px_2px_0px_0px_var(--border)] md:flex">
          <Activity className="size-4 text-rose-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              ATTACKS INTERCEPTED TODAY
            </span>
            <span className="font-mono text-base font-black tracking-tight text-foreground">
              {formattedCount}
            </span>
          </div>
        </div>

        {/* Right Navigation & Mobile Feeds Toggle */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="hidden items-center gap-1 rounded-base border-2 border-border bg-secondary-background px-2.5 py-1 font-heading text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:bg-muted sm:inline-flex"
          >
            &larr; Home
          </Link>

          <ThemeToggle />

          <Link
            href="/dashboard"
            className="hidden items-center gap-1.5 rounded-base border-2 border-border bg-main px-3 py-1.5 font-heading text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:inline-flex"
          >
            <span>SOC Console</span>
            <ArrowRight className="size-3.5" />
          </Link>

          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 font-heading text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)] lg:hidden"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Feeds</span>
          </button>
        </div>
      </header>

      {/* Top Left Floating Tactical Controls */}
      <div className="absolute top-20 left-4 z-30 flex flex-wrap items-center gap-2">
        {/* 2D / 3D Mode Selector */}
        <div className="flex items-center rounded-base border-2 border-border bg-secondary-background p-1 shadow-[3px_3px_0px_0px_var(--border)]">
          <button
            onClick={() => onToggleViewMode("2D")}
            className={`flex items-center gap-1 rounded-base px-2.5 py-1 font-heading text-xs font-black uppercase transition-all ${
              viewMode === "2D"
                ? "bg-main text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Box className="size-3.5" />
            <span>2D</span>
          </button>
          <button
            onClick={() => onToggleViewMode("3D")}
            className={`flex items-center gap-1 rounded-base px-2.5 py-1 font-heading text-xs font-black uppercase transition-all ${
              viewMode === "3D"
                ? "bg-main text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]"
                : "text-muted-foreground hover:text-foreground"
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
            className="flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 font-heading text-xs font-black uppercase text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:bg-main hover:text-main-foreground"
          >
            {isRotating ? (
              <>
                <Pause className="size-3.5" />
                <span className="hidden sm:inline">STOP ROTATION</span>
              </>
            ) : (
              <>
                <Play className="size-3.5" />
                <span className="hidden sm:inline">RESUME ROTATION</span>
              </>
            )}
          </button>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center rounded-base border-2 border-border bg-secondary-background p-1 shadow-[3px_3px_0px_0px_var(--border)]">
          <button
            onClick={onZoomOut}
            disabled={zoomLevel <= 0.6}
            className="flex size-7 items-center justify-center rounded-base hover:bg-muted disabled:opacity-40"
            title="Zoom Out"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[10px] font-bold">
            {zoomLevel.toFixed(1)}x
          </span>
          <button
            onClick={onZoomIn}
            disabled={zoomLevel >= 2.4}
            className="flex size-7 items-center justify-center rounded-base hover:bg-muted disabled:opacity-40"
            title="Zoom In"
          >
            <Plus className="size-3.5" />
          </button>
          <button
            onClick={onResetZoom}
            className="ml-1 flex size-7 items-center justify-center rounded-base border-l border-border/40 hover:bg-muted"
            title="Reset Zoom"
          >
            <RotateCcw className="size-3" />
          </button>
        </div>
      </div>

      {/* Bottom Continent Quick-Focus Dock */}
      <div className="absolute bottom-14 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-base border-2 border-border bg-card/90 p-1.5 shadow-[4px_4px_0px_0px_var(--border)] backdrop-blur-md">
          {REGIONS_VIEW.map((region) => {
            const isSelected = activeRegion === region.label
            return (
              <button
                key={region.label}
                onClick={() => onSelectRegion(region.lat, region.lng)}
                className={`rounded-base px-2.5 py-1 font-heading text-[11px] font-black tracking-wider uppercase transition-all ${
                  isSelected
                    ? "border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
                    : "border border-border/40 bg-secondary-background text-foreground hover:border-border hover:bg-muted"
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
