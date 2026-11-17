"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  ShieldAlert,
  Terminal,
  Layers,
  Bug,
  GitCommit,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Tag,
  ArrowRight,
  Radar,
  Radio,
  BookOpen,
  Cpu,
} from "lucide-react"
import { LegalNav } from "@/components/public/legal-nav"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ReleaseChange {
  type: "feat" | "security" | "perf" | "fix" | "docs"
  title: string
  description: string
  scope?: "Sentinel" | "Monitor WAF" | "Core Mesh" | "UI / Docs" | "Threat Radar"
}

interface Release {
  version: string
  codename: string
  date: string
  isLatest?: boolean
  summary: string
  tags: string[]
  changes: ReleaseChange[]
  githubUrl: string
}

const RELEASES: Release[] = [
  {
    version: "v1.4.0",
    codename: "Perimeter Sweep & Unified Switcher",
    date: "17 November 2026",
    isLatest: true,
    summary:
      "Rilis major yang memperkenalkan visualisasi 360° Tactical Perimeter Radar asli berpresisi tinggi di dashboard Threat Monitor, komponen VersionSwitcher terpadu di dokumentasi resmi, serta optimalisasi anti brute-force bertingkat pada WAF PHP.",
    tags: ["Threat Radar", "Docs Switcher", "WAF Stepped Login", "Canvas Fixes"],
    githubUrl: "https://github.com/pasax-dev/pasax-suit/releases/tag/v1.4.0",
    changes: [
      {
        type: "feat",
        scope: "Threat Radar",
        title: "360° Tactical Marine Sweep Radar Engine",
        description:
          "Menghadirkan kembali instrumen radar perimeter 360° dengan sapuan sweep phosphor kontinu, deretan skala kompas derajat kutub (000°–330°), cincin batas jarak jangkau (10 NM–100 NM), dan target blip telemetri real-time yang memetakan intersepsi ancaman.",
      },
      {
        type: "feat",
        scope: "UI / Docs",
        title: "Dokumentasi Version & Module Switcher (Shadcn Dropdown)",
        description:
          "Menggantikan tombol tab modul lama dengan komponen VersionSwitcher dropdown modern berbasis Radix Primitives. Memungkinkan pengembang berpindah antara modul Pasax Secure Monitor, Pasax Sentinel, dan Core Engine serta beralih versi rilis dokumentasi secara instan.",
      },
      {
        type: "security",
        scope: "Monitor WAF",
        title: "Stepped Login Lockout & Karantina Sidik Jari Perangkat",
        description:
          "Peningkatan algoritma anti brute-force adaptif pada Laravel WAF. Menerapkan pembatasan berbasis eksponensial dan token device-level quarantine untuk mencegah serangan credential stuffing terdistribusi.",
      },
      {
        type: "perf",
        scope: "UI / Docs",
        title: "Interactive Sand Physics Wordmark Canvas",
        description:
          "Pengembangan simulasi gravitasi partikel pasir di footer landing page dengan komputasi offscreen canvas berkinerja 60 FPS tanpa beban CPU berlebih.",
      },
      {
        type: "fix",
        scope: "UI / Docs",
        title: "Fix Canvas Dithering Runtime IndexSizeError",
        description:
          "Memperbaiki IndexSizeError pada pemanggilan getImageData saat dimensi canvas bernilai 0px pada transisi projector showcase. Menambahkan pengaman dimensi dan validasi naturalWidth/naturalHeight gambar.",
      },
    ],
  },
  {
    version: "v1.3.2",
    codename: "Kernel Inotify FIM & CVE Intelligence",
    date: "24 Oktober 2026",
    summary:
      "Pembaruan keamanan fokus pada File Integrity Monitoring (FIM) berbasis Linux inotify dengan penguncian otomatis berkas (chattr +i), serta integrasi feed intelijen CVE global.",
    tags: ["Kernel FIM", "CVE Feed", "mTLS Telemetry"],
    githubUrl: "https://github.com/pasax-dev/pasax-suit/releases/tag/v1.3.2",
    changes: [
      {
        type: "security",
        scope: "Sentinel",
        title: "Autonomous Kernel FIM & Immutable Locks",
        description:
          "Deteksi manipulasi berkas kritis (/etc/passwd, /etc/shadow, direktori web server) secara sub-milidetik dengan eksekusi kunci atribut kernel seketika sebelum filewebshell dapat dijalankan.",
      },
      {
        type: "feat",
        scope: "Core Mesh",
        title: "CVE-2026 Global Intelligence Feed",
        description:
          "Sinkronisasi otomatis feed ancaman zero-day dan signature payload berbahaya ke seluruh node VPS terdaftar melalui channel mTLS terenkripsi.",
      },
      {
        type: "perf",
        scope: "Sentinel",
        title: "Optimized eBPF / inotify Ring Buffers",
        description:
          "Mengurangi overhead memori daemon Go menjadi kurang dari 18MB RAM saat mengamati lebih dari 250.000 file sistem.",
      },
      {
        type: "fix",
        scope: "Monitor WAF",
        title: "Reverse Proxy Client IP Multi-Hop Resolution",
        description:
          "Memperbaiki deteksi IP asli klien di balik Cloudflare, AWS CloudFront, dan Nginx upstream multi-tier untuk mencegah spoofing header X-Forwarded-For.",
      },
    ],
  },
  {
    version: "v1.2.0",
    codename: "Declarative Policy as Code",
    date: "15 September 2026",
    summary:
      "Memperkenalkan standarisasi aturan keamanan terdesentralisasi pasax-rules.yml berbasis GitOps, pemindai webshell heuristik AST, dan orkestrasi armada node.",
    tags: ["Policy as Code", "Webshell Scanner", "GitOps"],
    githubUrl: "https://github.com/pasax-dev/pasax-suit/releases/tag/v1.2.0",
    changes: [
      {
        type: "feat",
        scope: "Core Mesh",
        title: "Declarative Policy Engine (pasax-rules.yml)",
        description:
          "Format deklaratif YAML untuk mendefinisikan whitelist IP subnet, aturan rate-limiting, dan threshold drop paket yang dapat dikelola via version control (GitOps).",
      },
      {
        type: "security",
        scope: "Monitor WAF",
        title: "Heuristic PHP AST Webshell Scanner",
        description:
          "Parser AST statis untuk membedah kode PHP mencurigakan yang diobfuskasi dengan base64_decode, eval, str_rot13, dan panggilan fungsi variabel dinamis.",
      },
      {
        type: "feat",
        scope: "Sentinel",
        title: "Fleet Sync Daemon Hooks",
        description:
          "Dukungan daemon untuk reload aturan keamanan secara live (SIGHUP) tanpa perlu me-restart layanan systemd atau mengganggu koneksi aktif.",
      },
      {
        type: "fix",
        scope: "Sentinel",
        title: "SSH Port Exemption Safeguard",
        description:
          "Pencegahan otomatis penguncian akses root administrator saat firewall nftables mengaktifkan mode lockdown darurat.",
      },
    ],
  },
  {
    version: "v1.1.0",
    codename: "Linux Kernel nftables High-Performance Engine",
    date: "10 Agustus 2026",
    summary:
      "Integrasi langsung subsistem nftables kernel Linux untuk mencapai pemblokiran paket jaringan di bawah 0.2 milidetik.",
    tags: ["nftables", "Sub-0.2ms", "Linux Kernel"],
    githubUrl: "https://github.com/pasax-dev/pasax-suit/releases/tag/v1.1.0",
    changes: [
      {
        type: "perf",
        scope: "Sentinel",
        title: "Direct Kernel-Space Packet Drop (<0.2ms Latency)",
        description:
          "Bypass context switching ruang pengguna (userspace) dengan memasukkan tabel dan rantai aturan langsung ke dalam kernel nftables.",
      },
      {
        type: "feat",
        scope: "Sentinel",
        title: "Automated Ban List Pruning & Expiration",
        description:
          "Mekanisme auto-aging untuk membersihkan IP penyerang sementara yang telah melewati masa karantina tanpa mengorbankan memori tabel.",
      },
      {
        type: "security",
        scope: "Core Mesh",
        title: "Zero-Knowledge Telemetry Protocols",
        description:
          "Enkripsi mTLS 1.3 satu arah untuk transmisi metadata insiden tanpa pernah mengirimkan isi payload aplikasi atau data sensitif pengguna.",
      },
    ],
  },
  {
    version: "v1.0.0",
    codename: "Genesis Release — The Pasax Trinity Architecture",
    date: "01 Juli 2026",
    summary:
      "Rilis publik perdana ekosistem keamanan Pasax. Memadukan WAF 100% murni PHP untuk aplikasi web, daemon Sentinel Go untuk Linux server hardening, dan Central SOC Console.",
    tags: ["Initial Release", "Trinity Architecture", "Open Source"],
    githubUrl: "https://github.com/pasax-dev/pasax-suit/releases/tag/v1.0.0",
    changes: [
      {
        type: "feat",
        scope: "Sentinel",
        title: "Pasax Sentinel Go Daemon",
        description:
          "Daemon Linux mandiri yang ringan, dikompilasi statis tanpa dependensi eksternal, kompatibel dengan arsitektur x86_64 dan ARM64.",
      },
      {
        type: "feat",
        scope: "Monitor WAF",
        title: "Pasax Secure Monitor for Laravel",
        description:
          "Paket middleware keamanan WAF murni PHP tanpa ekstensi C, siap dipasang via Composer pada Laravel 10, 11, 12, dan 13.",
      },
      {
        type: "feat",
        scope: "Core Mesh",
        title: "Community Threat Ledger & Web Console",
        description:
          "Portal pemantauan telemetri SOC terpadu dengan visualisasi 3D globe dan integrasi REST API headless.",
      },
    ],
  },
]

export default function ChangelogPage() {
  const [selectedTag, setSelectedTag] = React.useState<string>("ALL")
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const allTags = React.useMemo(() => {
    const set = new Set<string>()
    RELEASES.forEach((r) => r.tags.forEach((t) => set.add(t)))
    return ["ALL", ...Array.from(set)]
  }, [])

  const filteredReleases = React.useMemo(() => {
    return RELEASES.filter((release) => {
      const matchesTag =
        selectedTag === "ALL" || release.tags.includes(selectedTag)
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        release.version.toLowerCase().includes(q) ||
        release.codename.toLowerCase().includes(q) ||
        release.summary.toLowerCase().includes(q) ||
        release.changes.some(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        )
      return matchesTag && matchesSearch
    })
  }, [selectedTag, searchQuery])

  const getChangeBadge = (type: ReleaseChange["type"]) => {
    switch (type) {
      case "feat":
        return (
          <Badge className="border-2 border-border bg-emerald-500 font-mono text-[10px] font-black uppercase text-white shadow-[1px_1px_0px_0px_var(--border)]">
            NEW FEATURE
          </Badge>
        )
      case "security":
        return (
          <Badge className="border-2 border-border bg-rose-600 font-mono text-[10px] font-black uppercase text-white shadow-[1px_1px_0px_0px_var(--border)]">
            SECURITY
          </Badge>
        )
      case "perf":
        return (
          <Badge className="border-2 border-border bg-amber-500 font-mono text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_0px_var(--border)]">
            PERFORMANCE
          </Badge>
        )
      case "fix":
        return (
          <Badge className="border-2 border-border bg-blue-600 font-mono text-[10px] font-black uppercase text-white shadow-[1px_1px_0px_0px_var(--border)]">
            BUG FIX
          </Badge>
        )
      case "docs":
        return (
          <Badge className="border-2 border-border bg-purple-600 font-mono text-[10px] font-black uppercase text-white shadow-[1px_1px_0px_0px_var(--border)]">
            DOCS
          </Badge>
        )
    }
  }

  return (
    <div className="w-full max-w-full py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Ecosystem</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-main">Changelog</span>
        </div>

        {/* Legal & Docs Navigation Bar */}
        <LegalNav />

        {/* Header Block */}
        <div className="rounded-base border-2 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--border)] md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)]">
              <Sparkles className="size-4 text-main" />
              <span>RELEASE CHRONICLES &bull; PASAX SUITE</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <a
                href="https://github.com/pasax-dev/pasax-suit/releases"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-main px-3 py-1 font-mono text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                <GitCommit className="size-3.5" />
                <span>GitHub Releases</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Changelog &amp; Catatan Rilis
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg text-pretty">
            Lacak seluruh pembaruan, peningkatan keamanan kernel, fitur baru WAF, dan perbaikan performa pada seluruh lini ekosistem <strong>Pasax Security</strong>. Setiap versi dirilis secara terbuka, transparan, dan dapat diverifikasi.
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-base border-2 border-border bg-secondary-background/80 p-3.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                VERSI TERBARU
              </span>
              <div className="mt-1 font-mono text-xl font-black text-foreground tabular-nums">
                v1.4.0
              </div>
            </div>
            <div className="rounded-base border-2 border-border bg-secondary-background/80 p-3.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                TOTAL RILIS
              </span>
              <div className="mt-1 font-mono text-xl font-black text-foreground tabular-nums">
                5 Versi Utama
              </div>
            </div>
            <div className="rounded-base border-2 border-border bg-secondary-background/80 p-3.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                LATENSI KERNEL
              </span>
              <div className="mt-1 font-mono text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                &lt; 0.2 ms
              </div>
            </div>
            <div className="rounded-base border-2 border-border bg-secondary-background/80 p-3.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                LISENSI
              </span>
              <div className="mt-1 font-mono text-xl font-black text-foreground">
                MIT 100% Open
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari versi, fitur, atau perbaikan bug..."
                className="w-full rounded-base border-2 border-border bg-background py-2 pl-9 pr-4 font-mono text-xs font-medium text-foreground placeholder:text-muted-foreground/60 shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none focus:ring-2 focus:ring-main"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    "rounded-base border-2 border-border px-2.5 py-1 font-mono text-[10px] font-bold transition-all shadow-[1px_1px_0px_0px_var(--border)] cursor-pointer",
                    selectedTag === tag
                      ? "bg-main text-main-foreground"
                      : "bg-secondary-background text-foreground hover:bg-muted"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline List */}
        <div className="mt-12 space-y-10">
          {filteredReleases.length === 0 ? (
            <div className="rounded-base border-2 border-border bg-card p-12 text-center shadow-[4px_4px_0px_0px_var(--border)]">
              <p className="font-heading text-lg font-bold text-foreground">
                Tidak ada catatan rilis yang cocok dengan pencarian Anda.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedTag("ALL")
                }}
                className="mt-4 rounded-base border-2 border-border bg-main px-4 py-2 font-mono text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredReleases.map((release) => (
              <article
                key={release.version}
                id={release.version}
                className="relative rounded-base border-2 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--border)] md:p-8"
              >
                {/* Header of Release */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-base border-2 border-border bg-main px-3 py-1 font-mono text-sm font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] tabular-nums">
                      {release.version}
                    </span>
                    {release.isLatest && (
                      <Badge className="border-2 border-border bg-emerald-500 font-mono text-[10px] font-black uppercase text-white shadow-[1px_1px_0px_0px_var(--border)]">
                        LATEST STABLE
                      </Badge>
                    )}
                    <h2 className="font-heading text-lg font-black text-foreground sm:text-2xl">
                      {release.codename}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <Calendar className="size-3.5" />
                      <span>{release.date}</span>
                    </div>
                    <a
                      href={release.githubUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      title="Lihat tag di GitHub"
                      className="inline-flex size-7 items-center justify-center rounded-base border-2 border-border bg-secondary-background hover:bg-main hover:text-main-foreground transition-colors shadow-[1px_1px_0px_0px_var(--border)]"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>

                {/* Release Summary */}
                <p className="mt-4 text-sm leading-relaxed text-foreground/85 sm:text-base text-pretty">
                  {release.summary}
                </p>

                {/* Tags Pill Row */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {release.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded border border-border bg-secondary-background px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground"
                    >
                      <Tag className="size-2.5" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>

                {/* Granular Changes List */}
                <div className="mt-6 space-y-3">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Detail Perubahan &amp; Peningkatan:
                  </h3>
                  <div className="divide-y divide-border rounded-base border-2 border-border bg-background">
                    {release.changes.map((change, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4"
                      >
                        <div className="flex shrink-0 items-center gap-2 sm:w-44">
                          {getChangeBadge(change.type)}
                          {change.scope && (
                            <span className="font-mono text-[10px] font-bold text-foreground/70">
                              [{change.scope}]
                            </span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-heading text-sm font-bold text-foreground">
                            {change.title}
                          </h4>
                          <p className="text-xs leading-relaxed text-foreground/80 text-pretty">
                            {change.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Footer Support Banner */}
        <div className="mt-12 rounded-base border-2 border-border bg-secondary-background p-6 text-center shadow-[4px_4px_0px_0px_var(--border)] sm:p-8">
          <h3 className="font-heading text-lg font-black text-foreground sm:text-xl">
            Ingin Mengikuti Rilis dan Pembahasan Teknis Terbaru?
          </h3>
          <p className="mt-2 text-sm text-foreground/80">
            Bergabunglah di repositori resmi GitHub untuk membaca commit log harian, mengajukan issue, atau berkontribusi pada kode sumber terbuka Pasax.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-mono text-xs font-bold">
            <a
              href="https://github.com/pasax-dev/pasax-suit"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-main px-4 py-2 font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <span>Kunjungi GitHub Repository</span>
              <ExternalLink className="size-3.5" />
            </a>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-card px-4 py-2 text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-muted transition-all"
            >
              <span>Buka Halaman FAQ</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
