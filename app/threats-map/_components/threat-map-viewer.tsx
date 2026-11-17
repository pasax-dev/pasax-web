"use client"

import * as React from "react"
import { ThreatGlobe } from "./threat-globe"
import { ThreatFeedsSidebar } from "./threat-feeds-sidebar"
import { ThreatMapHud } from "./threat-map-hud"
import { ThreatStatsPanel } from "./threat-stats-panel"
import { SentinelNodeModal } from "./sentinel-node-modal"
import {
  type CyberAttackEvent,
  type SentinelNode,
  generateRandomAttack,
  REGIONS_VIEW,
} from "@/lib/threat-map-data"

export function ThreatMapViewer() {
  const [attacks, setAttacks] = React.useState<CyberAttackEvent[]>([])
  const [activeAttack, setActiveAttack] = React.useState<CyberAttackEvent | null>(null)
  const [selectedNode, setSelectedNode] = React.useState<SentinelNode | null>(null)
  const [isRotating, setIsRotating] = React.useState(true)
  const [zoomLevel, setZoomLevel] = React.useState(1.0)
  const [viewMode, setViewMode] = React.useState<"3D" | "2D">("3D")
  const [displayRateSec, setDisplayRateSec] = React.useState(1.5)
  const [attackCount, setAttackCount] = React.useState(14892590)
  const [activeRegion, setActiveRegion] = React.useState<string | null>(null)
  const [focusedCoords, setFocusedCoords] = React.useState<{ lat: number; lng: number } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isStatsOpen, setIsStatsOpen] = React.useState(false)

  // Seed initial attacks on mount
  React.useEffect(() => {
    const initialList: CyberAttackEvent[] = []
    for (let i = 0; i < 6; i++) {
      initialList.push(generateRandomAttack())
    }
    setAttacks(initialList)
  }, [])

  // Realtime attack simulation stream
  React.useEffect(() => {
    const timer = setInterval(() => {
      const newAtk = generateRandomAttack()
      setAttacks((prev) => [newAtk, ...prev.slice(0, 49)])
      setAttackCount((prev) => prev + 1)
    }, displayRateSec * 1000)

    return () => clearInterval(timer)
  }, [displayRateSec])

  // Handle region select from bottom dock
  const handleSelectRegion = (lat: number, lng: number) => {
    const found = REGIONS_VIEW.find((r) => r.lat === lat && r.lng === lng)
    setActiveRegion(found?.label || null)
    setFocusedCoords({ lat, lng })
  }

  // Handle select attack from feeds sidebar
  const handleSelectAttack = (atk: CyberAttackEvent) => {
    setActiveAttack(atk)
    // Smoothly focus camera towards destination node
    setFocusedCoords({
      lat: atk.targetNode.lat,
      lng: atk.targetNode.lng,
    })
  }

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#060913] text-foreground select-none">
      {/* Background Tactical Grid Lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"
      />

      {/* Top HUD Overlays (Header, 2D/3D toggle, Rotation, Zoom, Continent Dock) */}
      <ThreatMapHud
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        isRotating={isRotating}
        onToggleRotation={() => setIsRotating((prev) => !prev)}
        zoomLevel={zoomLevel}
        onZoomIn={() => setZoomLevel((z) => Math.min(2.4, z + 0.2))}
        onZoomOut={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
        onResetZoom={() => setZoomLevel(1.0)}
        onSelectRegion={handleSelectRegion}
        activeRegion={activeRegion}
        attackCount={attackCount}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Threat Map Canvas & Sidebar Layout */}
      <div className="relative flex flex-1 pt-16 overflow-hidden z-10">
        {/* Globe & 2D Tactical Viewport */}
        <main className="relative flex-1 h-full w-full overflow-hidden bg-transparent">
          <ThreatGlobe
            attacks={attacks}
            activeAttack={activeAttack}
            isRotating={isRotating}
            zoomLevel={zoomLevel}
            viewMode={viewMode}
            focusedCoords={focusedCoords}
            onSelectNode={setSelectedNode}
          />
        </main>

        {/* Desktop Sidebar (Permanent) */}
        <div className="hidden h-full w-[360px] shrink-0 lg:block border-l border-zinc-800/80 bg-[#090d1a]/95 backdrop-blur-md shadow-2xl">
          <ThreatFeedsSidebar
            attacks={attacks}
            activeAttack={activeAttack}
            displayRateSec={displayRateSec}
            onChangeRate={setDisplayRateSec}
            onSelectAttack={handleSelectAttack}
            onSelectNode={setSelectedNode}
          />
        </div>

        {/* Mobile Slide-over Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-y-0 right-0 z-50 flex w-[min(340px,90vw)] flex-col bg-[#090d1a] border-l border-zinc-800 pt-16 shadow-2xl lg:hidden">
            <ThreatFeedsSidebar
              attacks={attacks}
              activeAttack={activeAttack}
              displayRateSec={displayRateSec}
              onChangeRate={setDisplayRateSec}
              onSelectAttack={(atk) => {
                handleSelectAttack(atk)
                setIsSidebarOpen(false)
              }}
              onSelectNode={(node) => {
                setSelectedNode(node)
                setIsSidebarOpen(false)
              }}
            />
          </div>
        )}

        {/* Floating Sentinel Node Details Holographic Card */}
        <SentinelNodeModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />

        {/* Bottom Drawer: Global Attack Statistics Breakdown */}
        <ThreatStatsPanel
          isOpen={isStatsOpen}
          onToggle={() => setIsStatsOpen((prev) => !prev)}
        />
      </div>
    </div>
  )
}
