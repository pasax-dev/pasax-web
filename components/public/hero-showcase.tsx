"use client"

import * as React from "react"
import Link from "next/link"
import {
  Shield,
  Terminal,
  Activity,
  FileCode2,
  CheckCircle2,
  Zap,
  Lock,
  ArrowRight,
  Globe2,
  Radio,
  Sparkles,
  Server,
  Play,
} from "lucide-react"
import {
  IllosThreatDetection,
  IllosFirewall,
  IllosServerHealth,
  IllosLogStream,
} from "@/components/illos"
import { cn } from "@/lib/utils"

type ShowcaseTab = "threats" | "firewall" | "health" | "logs"

export function HeroShowcase() {
  const [activeTab, setActiveTab] = React.useState<ShowcaseTab>("threats")

  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-base border-2 border-border bg-card shadow-[8px_8px_0px_0px_var(--border)]">
      {/* Top Window Bar (Fumadocs-Style Window Controls & Tabs) */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-border bg-secondary-background px-4 py-2.5">
        {/* Left Mac-style traffic dots */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full border border-border bg-rose-500 shadow-[1px_1px_0px_0px_var(--border)]" />
            <span className="size-3 rounded-full border border-border bg-amber-400 shadow-[1px_1px_0px_0px_var(--border)]" />
            <span className="size-3 rounded-full border border-border bg-emerald-400 shadow-[1px_1px_0px_0px_var(--border)]" />
          </div>
          <span className="ml-2 font-mono text-[11px] font-black text-foreground">
            pasax-telemetry-engine // live-inspect
          </span>
        </div>

        {/* Tab Switchers */}
        <div className="flex flex-wrap items-center gap-1 pt-1 sm:pt-0">
          {[
            { id: "threats", label: "Threat Radar", icon: Shield, badge: "HUD" },
            { id: "firewall", label: "nftables L3/L4", icon: Zap, badge: "KERNEL" },
            { id: "health", label: "Fleet Health", icon: Activity, badge: "METRICS" },
            { id: "logs", label: "Log Stream", icon: Terminal, badge: "INOTIFY" },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ShowcaseTab)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[11px] font-black transition-all",
                  isActive
                    ? "border-border bg-main text-black shadow-[2px_2px_0px_0px_var(--border)]"
                    : "border-transparent text-foreground hover:border-border hover:bg-background"
                )}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Interactive Showcase Body */}
      <div className="grid grid-cols-1 gap-6 p-5 sm:p-8 lg:grid-cols-12 lg:gap-8">
        {/* Left Visual Area: Illos Animated Illustration */}
        <div className="relative flex flex-col items-center justify-center rounded-base border-2 border-border bg-background/80 p-4 shadow-[4px_4px_0px_0px_var(--border)] lg:col-span-7">
          <div className="pointer-events-none absolute top-2 right-2 font-mono text-[9px] font-bold text-foreground/40 uppercase">
            ILLOS.DEV ENGINE // ANIMATED SVG
          </div>

          <div className="flex w-full items-center justify-center py-4 min-h-[260px] sm:min-h-[300px]">
            {activeTab === "threats" && (
              <IllosThreatDetection className="w-full max-w-[420px] transition-transform duration-300 hover:scale-[1.02]" />
            )}
            {activeTab === "firewall" && (
              <IllosFirewall className="w-full max-w-[420px] transition-transform duration-300 hover:scale-[1.02]" />
            )}
            {activeTab === "health" && (
              <IllosServerHealth className="w-full max-w-[420px] transition-transform duration-300 hover:scale-[1.02]" />
            )}
            {activeTab === "logs" && (
              <IllosLogStream className="w-full max-w-[420px] transition-transform duration-300 hover:scale-[1.02]" />
            )}
          </div>

          <div className="mt-2 flex w-full items-center justify-between border-t-2 border-border/40 pt-2 font-mono text-[10px] font-bold text-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 animate-ping rounded-full bg-emerald-400" />
              <span>Hover diagram untuk memicu siklus animasi SVG</span>
            </span>
            <span className="hidden sm:inline font-mono text-muted-foreground">
              Zero-runtime · 100% Vector
            </span>
          </div>
        </div>

        {/* Right Details Panel: Technical Diagnostics & Readout */}
        <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
          {activeTab === "threats" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block rounded-base border border-border bg-amber-300 px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                  L3/L7 TRINITY THREAT DETECTION
                </span>
                <h3 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                  Autonomous Zero-Tolerance Scan
                </h3>
                <p className="text-xs leading-relaxed font-medium text-foreground">
                  Memindai setiap paket HTTP incoming dan payload raw socket. Menjaring webshell PHP, injeksi SQLi, dan serangan DDoS sebelum mencapai server worker.
                </p>
              </div>

              <div className="space-y-2 rounded-base border-2 border-border bg-secondary-background p-3 font-mono text-[11px] shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-foreground">Status Engine:</span>
                  <span className="font-bold text-emerald-500">ARMED (ACTIVE)</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-foreground">Kernel Drop Latency:</span>
                  <span className="font-black text-main">&lt; 0.04 ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Global Quarantine Sync:</span>
                  <span className="font-bold text-sky-400">12 Nodes Mesh</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "firewall" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block rounded-base border border-border bg-sky-300 px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                  LINUX RAW KERNEL NFTABLES
                </span>
                <h3 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                  Atomic Packet Drop Engine
                </h3>
                <p className="text-xs leading-relaxed font-medium text-foreground">
                  Menjalankan aturan tabel <code className="font-mono font-bold text-foreground">pasax_filter</code> langsung di netfilter kernel. SYN flood dan brute-force di-drop tanpa alokasi memori pengguna.
                </p>
              </div>

              <div className="space-y-2 rounded-base border-2 border-border bg-secondary-background p-3 font-mono text-[11px] shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-foreground">Driver:</span>
                  <span className="font-bold text-foreground">nftables v1.0.9 (eBPF fallback)</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-foreground">Throughput:</span>
                  <span className="font-black text-emerald-500">1.2M pps / core</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">RAM Overhead:</span>
                  <span className="font-bold text-main">~4.2 MB</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block rounded-base border border-border bg-emerald-300 px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                  FLEET TELEMETRY &amp; AUDIT
                </span>
                <h3 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                  Low-Footprint Systemd Daemon
                </h3>
                <p className="text-xs leading-relaxed font-medium text-foreground">
                  Daemon Sentinel Go mengawasi beban CPU, memori, I/O disk, dan status daemon VPS secara kontinu dengan heartbeat mTLS 1.3 setiap 15 detik.
                </p>
              </div>

              <div className="space-y-2 rounded-base border-2 border-border bg-secondary-background p-3 font-mono text-[11px] shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-foreground">Daemon Binary:</span>
                  <span className="font-bold text-foreground">Go 1.24 (Statically Linked)</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-foreground">Total Memory:</span>
                  <span className="font-black text-emerald-500">&lt; 18.5 MB RAM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Inbound Open Ports:</span>
                  <span className="font-bold text-main">0 (Egress Only)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block rounded-base border border-border bg-purple-300 px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                  REAL-TIME LOG WATCHER &amp; FIM
                </span>
                <h3 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                  Autonomous Inotify Guard
                </h3>
                <p className="text-xs leading-relaxed font-medium text-foreground">
                  Pengawasan berkas kritis (<code className="font-mono font-bold text-foreground">.env</code>, <code className="font-mono font-bold text-foreground">wp-config.php</code>) secara real-time. Modifikasi tanpa izin dikembalikan ke izin aman <code className="font-mono font-bold text-foreground">0600</code> dalam 11ms.
                </p>
              </div>

              <div className="space-y-2 rounded-base border-2 border-border bg-secondary-background p-3 font-mono text-[11px] shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-foreground">Inotify Watch Limit:</span>
                  <span className="font-bold text-foreground">65,536 files</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-foreground">Auto-Lock Response:</span>
                  <span className="font-black text-emerald-500">11 ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">IPC Socket Speed:</span>
                  <span className="font-bold text-main">0.04 ms (Unix Domain)</span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href="/threats-map"
              className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-main px-3.5 py-2 font-heading text-xs font-black text-black shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_var(--border)]"
            >
              <Globe2 className="size-3.5" />
              <span>Buka Threat Map 3D</span>
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3.5 py-2 font-heading text-xs font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_var(--border)]"
            >
              <span>Dokumentasi</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Status Ticker Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-border bg-secondary-background px-4 py-2 font-mono text-[10px] font-bold text-foreground">
        <div className="flex items-center gap-2">
          <span className="flex size-2 items-center justify-center">
            <span className="size-1.5 rounded-full bg-emerald-400" />
          </span>
          <span>TRINITY MESH STATUS: 100% OPERATIONAL</span>
        </div>
        <div className="flex items-center gap-3">
          <span>TLS 1.3 mTLS VERIFIED</span>
          <span>&bull;</span>
          <span>LATENCY: 0.04ms</span>
        </div>
      </div>
    </div>
  )
}
