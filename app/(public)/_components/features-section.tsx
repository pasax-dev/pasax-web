"use client"

import * as React from "react"
import {
  Zap,
  ShieldAlert,
  FileSearch,
  Lock,
  Globe2,
  Cpu,
  Sparkles,
  Layers,
  Terminal,
  Activity,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { SectionBackground } from "@/components/public/section-background"
import {
  IllosFirewall,
  IllosThreatDetection,
  IllosServerHealth,
  IllosLogStream,
  IllosEncryption,
  IllosMonitoring,
} from "@/components/illos"

export function FeaturesSection() {
  return (
    <div className="relative overflow-hidden py-12">
      <SectionBackground variant="dots" />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
            <Sparkles className="size-3.5 text-sky-500" />
            <span>FUMADOCS BENTO GRID · POWERED BY ILLOS.DEV</span>
          </div>
          <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-5xl">
            Engineered for Production Web Workloads
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Sistem pertahanan berlapis dengan animasi SVG interaktif langsung
            dari illos.dev. Tidak membebani memori, 100% responsif, dan siap
            produksi.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* Card 1: Large Bento (2 cols) - Kernel Firewall (IllosFirewall) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sky-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-sky-500/40 hover:bg-card/70 md:col-span-2 lg:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-center">
              <div className="space-y-3 sm:col-span-7">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-sky-500">
                    L3/L4 NETFILTER KERNEL
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    LATENCY: 0.04ms
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Sub-Millisecond Kernel Packet Drops
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Menerapkan aturan tabel{" "}
                  <code className="font-mono font-medium text-foreground">
                    pasax_mesh
                  </code>{" "}
                  langsung pada subsistem netfilter Linux. Paket penyerang
                  di-drop secara atomik sebelum menyentuh Nginx, Caddy, atau
                  worker PHP Laravel.
                </p>
                <div className="rounded-xl border border-border/40 bg-muted/30 p-2.5 font-mono text-[11px] text-foreground">
                  <span className="mr-1.5 text-sky-500">$</span>
                  <span>nft add rule inet pasax_mesh drop // 1.2M pps</span>
                </div>
              </div>

              <div className="flex items-center justify-center rounded-xl border border-border/40 bg-muted/10 p-4 sm:col-span-5">
                <IllosFirewall className="w-full max-w-[280px] transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
          </div>

          {/* Card 2: Threat Detection (IllosThreatDetection) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-rose-500/40 hover:bg-card/70 lg:p-7">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-rose-500">
                  THREAT RADAR
                </span>
                <span className="font-mono text-[10px] font-medium text-emerald-500">
                  REALTIME
                </span>
              </div>
              <div className="my-4 flex items-center justify-center rounded-xl border border-border/40 bg-muted/10 p-3">
                <IllosThreatDetection className="w-full max-w-[220px] transition-transform duration-300 group-hover:scale-105" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Autonomous Zero-Tolerance Scanner
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Pemeriksaan mendalam terhadap HTTP payload, signature webshell
                PHP, upaya RCE, dan serangan zero-day dengan akurasi tinggi.
              </p>
            </div>
            <div className="mt-4 border-t border-border/40 pt-3">
              <Link
                href="/docs/pasax-secure-monitor/core-architecture/threat-detection-engine"
                className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-sky-500 hover:text-sky-400"
              >
                <span>Pelajari Engine</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Server Health & Lightweight Binary (IllosServerHealth) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-amber-500/40 hover:bg-card/70 lg:p-7">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amber-500">
                  &lt; 20MB RAM
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  GO 1.24
                </span>
              </div>
              <div className="my-4 flex items-center justify-center rounded-xl border border-border/40 bg-muted/10 p-3">
                <IllosServerHealth className="w-full max-w-[220px] transition-transform duration-300 group-hover:scale-105" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Ultra-Lightweight Daemon
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Binary mandiri terkompilasi statis tanpa dependensi Node/Java.
                Aman dijalankan di VPS 1GB paling hemat tanpa menghabiskan CPU.
              </p>
            </div>
            <div className="mt-4 border-t border-border/40 pt-3">
              <Link
                href="/docs/pasax-sentinel/sentinel-overview"
                className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-sky-500 hover:text-sky-400"
              >
                <span>Setup Sentinel</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Inotify & Log Stream (IllosLogStream) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-purple-500/40 hover:bg-card/70 lg:p-7">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-purple-500">
                  11MS INOTIFY
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  FIM AUTO-LOCK
                </span>
              </div>
              <div className="my-4 flex items-center justify-center rounded-xl border border-border/40 bg-muted/10 p-3">
                <IllosLogStream className="w-full max-w-[220px] transition-transform duration-300 group-hover:scale-105" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Autonomous File Integrity Auto-Healing
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Memantau berkas{" "}
                <code className="font-mono font-medium text-foreground">
                  .env
                </code>{" "}
                dan konfigurasi web. Perubahan ilegal otomatis di-reset ke izin
                aman dalam hitungan milidetik.
              </p>
            </div>
            <div className="mt-4 border-t border-border/40 pt-3">
              <Link
                href="/docs/pasax-sentinel/02-fim-controller"
                className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-sky-500 hover:text-sky-400"
              >
                <span>Panduan FIM</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 5: Zero-Trust Encryption & Vault (IllosEncryption) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-card/70 lg:p-7">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-500">
                  ZERO OPEN PORTS
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  mTLS 1.3
                </span>
              </div>
              <div className="my-4 flex items-center justify-center rounded-xl border border-border/40 bg-muted/10 p-3">
                <IllosEncryption className="w-full max-w-[220px] transition-transform duration-300 group-hover:scale-105" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Egress-Only mTLS Cryptography
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Server VPS tidak pernah membuka port listening publik untuk
                agen. Komunikasi keluar dienkripsi mTLS TLS 1.3 dengan
                verifikasi Ed25519.
              </p>
            </div>
            <div className="mt-4 border-t border-border/40 pt-3">
              <Link
                href="/docs/core/cloud-api"
                className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-sky-500 hover:text-sky-400"
              >
                <span>Arsitektur mTLS</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 6: Large Bento (2 cols) - Multi-Node Monitoring Mesh (IllosMonitoring) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sky-500/20 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-sky-500/40 hover:bg-card/70 md:col-span-2 lg:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-center">
              <div className="space-y-3 sm:col-span-7">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-sky-500">
                    COLLECTIVE FLEET MESH
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    SYNC &lt; 2 SECONDS
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Synchronized Quarantine Threat Mesh
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Begitu penyerang terdeteksi menyerang salah satu server atau
                  aplikasi Laravel Anda, IP penyerang dikarantina secara
                  serentak ke seluruh kluster server dalam waktu kurang dari 2
                  detik.
                </p>
                <div className="rounded-xl border border-border/40 bg-muted/30 p-2.5 font-mono text-[11px] text-foreground">
                  <span className="mr-1.5 text-sky-500">$</span>
                  <span>
                    pasax-sentinel --sync-mesh cluster-indonesia-nodes // 100%
                    immune
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center rounded-xl border border-border/40 bg-muted/10 p-4 sm:col-span-5">
                <IllosMonitoring className="w-full max-w-[280px] transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
