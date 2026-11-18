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
import { cn } from "@/lib/utils"
import { PACKAGIST_URL, GITHUB_MONITOR_REPO } from "@/lib/packagist"

interface ReleaseChange {
  type: "feat" | "security" | "perf" | "fix" | "docs"
  title: string
  description: string
  scope?:
    "Sentinel" | "Monitor WAF" | "Core Mesh" | "UI / Docs" | "Threat Radar"
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
  packagistUrl?: string
}

const RELEASES: Release[] = [
  {
    version: "v1.0.6",
    codename: "Packagist v1.0.6 — Smart Backups & CI Test Suite Stabilization",
    date: "16 November 2026",
    isLatest: true,
    summary:
      "Rilis pemeliharaan resmi paket Packagist pasax/secure-monitor v1.0.6. Mengintegrasikan mekanisme pencadangan cerdas berkas host (hanya membuat backup jika konten berkas target berbeda dari template stub), pembersihan penamaan paket pasax/secure-monitor, perbaikan format Pint di src/compat.php, dan stabilitas 100% matrix testing Pest di seluruh versi PHP (8.2, 8.3, 8.4, 8.5) serta Laravel (10, 11, 12, 13).",
    tags: [
      "Packagist v1.0.6",
      "Smart Backups",
      "CI Test Suite",
      "Pint Styling",
      "Laravel 10-13",
    ],
    githubUrl:
      "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.6",
    packagistUrl: PACKAGIST_URL,
    changes: [
      {
        type: "fix",
        scope: "Monitor WAF",
        title: "Smart Host Backups Tanpa Redundansi Berkas",
        description:
          "Perintah artisan pasax:upgrade kini membandingkan isi berkas secara cerdas sebelum mencadangkan. Berkas cadangan hanya dibuat jika berkas konfigurasi, rute, atau tampilan host benar-benar berbeda dari stub bawaan paket.",
      },
      {
        type: "fix",
        scope: "Monitor WAF",
        title: "Penyelarasan Ekspektasi Banner PASAX di Seluruh Matrix CI",
        description:
          "Memperbarui seluruh ekspektasi konsol pada pengujian otomatis menjadi 'PASAX SECURITY UPGRADE' dan merapikan standar penulisan kode di src/compat.php sesuai kaidah Laravel Pint.",
      },
      {
        type: "perf",
        scope: "Monitor WAF",
        title: "Validasi 100% Lulus di 12 Kombinasi PHP & Laravel",
        description:
          "Menjamin kompatibilitas runtime penuh untuk PHP 8.2 hingga 8.5 dan Laravel 10 hingga 13 LTS tanpa regresi arsitektur.",
      },
    ],
  },
  {
    version: "v1.0.5",
    codename: "Packagist v1.0.5 — Non-redundant File Backup Engine",
    date: "16 November 2026",
    summary:
      "Optimasi logika penyimpanan berkas cadangan (*.backup-*) pada direktori routes, views, dan config agar tidak menumpuk saat perintah upgrade dijalankan secara berkala.",
    tags: [
      "Packagist v1.0.5",
      "Backup Engine",
      "File Integrity",
    ],
    githubUrl:
      "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.5",
    packagistUrl: PACKAGIST_URL,
    changes: [
      {
        type: "fix",
        scope: "Monitor WAF",
        title: "Isolasi File Backup Host",
        description:
          "Menghindari penumpukan duplikasi file cadangan lama saat proses sinkronisasi rute dan tampilan dashboard dijalankan berulang kali.",
      },
    ],
  },
  {
    version: "v1.0.4",
    codename: "Packagist v1.0.4 — Dynamic Package Detection",
    date: "16 November 2026",
    summary:
      "Deteksi dinamis nama package Composer yang terpasang pada perintah artisan pasax:upgrade dan pasax:uninstall untuk kompatibilitas multi-nama package composer.",
    tags: [
      "Packagist v1.0.4",
      "Dynamic Detection",
      "CLI Upgrade",
    ],
    githubUrl:
      "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.4",
    packagistUrl: PACKAGIST_URL,
    changes: [
      {
        type: "feat",
        scope: "Monitor WAF",
        title: "Resolusi Nama Paket Komposer Dinamis",
        description:
          "Command upgrade kini membaca nama paket yang terdaftar di vendor/installed.json secara dinamis alih-alih hardcoded string.",
      },
    ],
  },
  {
    version: "v1.0.3",
    codename: "Packagist v1.0.3 — Safe Class Alias & Collision Guard",
    date: "16 November 2026",
    summary:
      "Menambahkan helper pasax_safe_class_alias untuk mencegah collision error jika alias kelas service provider, facade, atau service telah dideklarasikan sebelumnya di aplikasi host.",
    tags: [
      "Packagist v1.0.3",
      "Compatibility Guard",
      "Class Alias",
    ],
    githubUrl:
      "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.3",
    packagistUrl: PACKAGIST_URL,
    changes: [
      {
        type: "fix",
        scope: "Monitor WAF",
        title: "Safeguard Class Alias Autoloading",
        description:
          "Pemeriksaan class_exists, interface_exists, dan trait_exists sebelum mendefinisikan alias backward-compatibility untuk mencegah runtime fatal exception.",
      },
    ],
  },
  {
    version: "v1.0.2",
    codename: "Packagist v1.0.2 — Laravel 10–13 & ReDoS Mitigations",
    date: "15 November 2026",
    isLatest: false,
    summary:
      "Rilis resmi paket Packagist pasax/secure-monitor v1.0.2. Memperkenalkan autoload berkas src/compat.php, penyelarasan dependency constraint untuk Laravel 10, 11, 12, dan 13, perbaikan auto-service provider discovery, penguatan regex ReDoS mitigasi, serta komponen VersionSwitcher berbasis modul ekosistem.",
    tags: [
      "Threat Radar",
      "Packagist v1.0.2",
      "WAF Stepped Login",
      "Laravel 10-13",
      "Docs Switcher",
    ],
    githubUrl:
      "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.2",
    packagistUrl: PACKAGIST_URL,
    changes: [
      {
        type: "security",
        scope: "Monitor WAF",
        title: "Packagist v1.0.2: Autoload src/compat.php & ReDoS Mitigation",
        description:
          "Menambahkan autoload src/compat.php langsung ke composer.json untuk penyelarasan fungsi helper kompatibilitas di Laravel 10–13 dan pengamanan pola regex terhadap serangan Catastrophic Backtracking.",
      },
      {
        type: "feat",
        scope: "Threat Radar",
        title: "360° Tactical Marine Sweep Radar Engine",
        description:
          "Menghadirkan instrumen radar perimeter 360° dengan sapuan sweep phosphor kontinu, deretan skala kompas derajat kutub (000°–330°), cincin batas jarak jangkau (10 NM–100 NM), dan target blip telemetri real-time yang memetakan intersepsi ancaman.",
      },
      {
        type: "feat",
        scope: "UI / Docs",
        title: "Dokumentasi Version & Module Switcher (Ecosystem-Aware)",
        description:
          "Menggantikan pemilih versi lama dengan komponen VersionSwitcher yang membaca versi rilis riil dari Packagist untuk pasax-secure-monitor (v1.0.2, v1.0.1, v1.0.0) serta versi modul daemon Sentinel dan Platform Core secara terpisah.",
      },
      {
        type: "security",
        scope: "Monitor WAF",
        title: "Stepped Login Lockout & Karantina Sidik Jari Perangkat",
        description:
          "Peningkatan algoritma anti brute-force adaptif pada Laravel WAF. Menerapkan pembatasan berbasis eksponensial dan token device-level quarantine untuk mencegah serangan credential stuffing terdistribusi.",
      },
      {
        type: "fix",
        scope: "Monitor WAF",
        title: "Auto-Service Provider Discovery di Laravel 11, 12, & 13",
        description:
          "Pendaftaran PasaxServiceProvider dan Facade Pasax secara otomatis tanpa memerlukan registrasi manual di config/app.php.",
      },
    ],
  },
  {
    version: "v1.0.1",
    codename: "Packagist v1.0.1 — Database Migrations & Relations",
    date: "15 November 2026",
    summary:
      "Pembaruan paket Packagist pasax/secure-monitor v1.0.1 yang berfokus pada penyempurnaan migrasi database SQLite dan MySQL, trait relasi HasPasaxSecurityRelations, dan isolasi token karantina.",
    tags: [
      "Packagist v1.0.1",
      "Database Migrations",
      "Kernel FIM",
      "mTLS Telemetry",
    ],
    githubUrl:
      "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.1",
    packagistUrl: PACKAGIST_URL,
    changes: [
      {
        type: "fix",
        scope: "Monitor WAF",
        title: "Migrasi Tabel Database SQLite & MySQL Multi-Hop",
        description:
          "Memperbaiki sintaks migrasi skema tabel pasax_threat_logs dan pasax_quarantines agar berjalan mulus di lingkungan pengujian SQLite in-memory maupun MySQL 8.0+ produksi.",
      },
      {
        type: "feat",
        scope: "Monitor WAF",
        title: "HasPasaxSecurityRelations Trait untuk Model User",
        description:
          "Menyediakan trait Eloquent siap pakai untuk menghubungkan riwayat login, status karantina, dan IP terpercaya langsung dari model User host.",
      },
      {
        type: "security",
        scope: "Sentinel",
        title: "Kernel Inotify FIM & Immutable Locks",
        description:
          "Deteksi manipulasi berkas kritis sistem secara sub-milidetik dengan eksekusi kunci atribut kernel seketika sebelum file webshell dapat dieksekusi.",
      },
    ],
  },
  {
    version: "v1.0.0",
    codename: "Genesis Release — The Pasax Trinity Architecture",
    date: "15 November 2026",
    summary:
      "Rilis publik perdana ekosistem keamanan Pasax. Memadukan WAF 100% murni PHP untuk aplikasi web Laravel (pasax/secure-monitor), daemon Sentinel Go untuk Linux server hardening (pasax-sentinel), dan Central SOC Console (pasax-web).",
    tags: [
      "Packagist v1.0.0",
      "Sentinel v1.0.0",
      "Trinity Architecture",
      "Open Source",
    ],
    githubUrl:
      "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.0",
    packagistUrl: PACKAGIST_URL,
    changes: [
      {
        type: "feat",
        scope: "Monitor WAF",
        title: "Pasax Secure Monitor for Laravel (Packagist Release)",
        description:
          "Paket middleware keamanan WAF murni PHP tanpa ekstensi C dan zero NPM dependency, siap dipasang via Composer pada Laravel 10, 11, 12, dan 13.",
      },
      {
        type: "feat",
        scope: "Sentinel",
        title: "Pasax Sentinel Go Daemon",
        description:
          "Daemon Linux mandiri yang ringan, dikompilasi statis tanpa dependensi eksternal, kompatibel dengan arsitektur x86_64 dan ARM64.",
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

  const renderChangeBadge = (type: ReleaseChange["type"]) => {
    switch (type) {
      case "feat":
        return (
          <span className="font-semiboldtext-emerald-600 inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase dark:text-emerald-400">
            New Feature
          </span>
        )
      case "security":
        return (
          <span className="font-semiboldtext-rose-600 inline-flex items-center rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] uppercase dark:text-rose-400">
            Security
          </span>
        )
      case "perf":
        return (
          <span className="font-semiboldtext-amber-600 inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase dark:text-amber-400">
            Performance
          </span>
        )
      case "fix":
        return (
          <span className="font-semiboldtext-sky-600 inline-flex items-center rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] uppercase dark:text-sky-400">
            Bug Fix
          </span>
        )
      case "docs":
        return (
          <span className="font-semiboldtext-purple-600 inline-flex items-center rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] uppercase dark:text-purple-400">
            Docs
          </span>
        )
    }
  }

  return (
    <div className="w-full max-w-full py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs matching Fumadocs */}
        <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs">
          <Link
            href="/"
            className="text-lp-ink/60 transition-colors hover:text-lp-ink hover:underline"
          >
            Beranda
          </Link>
          <span className="text-lp-ink/30">/</span>
          <span className="text-lp-ink/75">Ekosistem</span>
          <span className="text-lp-ink/30">/</span>
          <span className="font-semibold text-lp-ink">Changelog</span>
        </div>

        {/* Legal & Docs Navigation Bar */}
        <LegalNav />

        {/* Header Block matching Fumadocs card */}
        <header className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-lp-orange/20 bg-lp-orange/10 px-3 py-1 font-mono text-xs font-medium text-lp-orange dark:border-lp-yellow/20 dark:bg-lp-yellow/10 dark:text-lp-yellow">
              <Sparkles className="size-3.5" />
              <span>PASAX ECOSYSTEM RELEASES</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <a
                href={PACKAGIST_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3 py-1.5 font-mono text-xs font-medium text-lp-ink transition-colors hover:bg-lp-paper-2"
              >
                <span>Packagist: pasax/secure-monitor</span>
                <ExternalLink className="size-3 text-lp-ink/50" />
              </a>
              <a
                href="https://github.com/pasax-dev"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3 py-1.5 font-mono text-xs font-medium text-lp-ink transition-colors hover:bg-lp-paper-2"
              >
                <GitCommit className="size-3.5 text-lp-ink/50" />
                <span>GitHub Org</span>
                <ExternalLink className="size-3 text-lp-ink/50" />
              </a>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-lp-ink sm:text-4xl lg:text-5xl">
            Changelog &amp; Catatan Rilis Ekosistem
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-pretty text-lp-ink/75 sm:text-lg">
            Pasax adalah grup/ekosistem keamanan server terpadu. Setiap modul
            memiliki versi independen: paket Laravel{" "}
            <strong>pasax/secure-monitor</strong> di Packagist, daemon{" "}
            <strong>pasax-sentinel</strong> di Linux, dan platform web.
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-3.5">
              <span className="font-mono text-[10px] font-medium tracking-wider text-lp-ink/60 uppercase">
                PACKAGIST STABLE
              </span>
              <div className="mt-1 font-mono text-xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                v1.0.6
              </div>
            </div>
            <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-3.5">
              <span className="font-mono text-[10px] font-medium tracking-wider text-lp-ink/60 uppercase">
                SENTINEL DAEMON
              </span>
              <div className="mt-1 font-mono text-xl font-bold text-lp-ink tabular-nums">
                v1.0.0
              </div>
            </div>
            <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-3.5">
              <span className="font-mono text-[10px] font-medium tracking-wider text-lp-ink/60 uppercase">
                LATENSI KERNEL
              </span>
              <div className="mt-1 font-mono text-xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                &lt; 0.2 ms
              </div>
            </div>
            <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-3.5">
              <span className="font-mono text-[10px] font-medium tracking-wider text-lp-ink/60 uppercase">
                LISENSI
              </span>
              <div className="mt-1 font-mono text-xl font-bold text-lp-ink">
                MIT License
              </div>
            </div>
          </div>

          {/* Search & Tag Filter Matrix */}
          <div className="mt-8 flex flex-col gap-4 border-t border-lp-line pt-6 md:flex-row md:items-center md:justify-between">
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 flex items-center gap-1 font-mono text-xs text-lp-ink/60">
                <Filter className="size-3.5" />
                <span>FILTER:</span>
              </span>
              {allTags.map((tag) => {
                const isActive = selectedTag === tag
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "cursor-pointer rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors",
                      isActive
                        ? "border-lp-orange/30 bg-lp-orange/10 font-semibold text-lp-orange dark:border-lp-yellow/30 dark:bg-lp-yellow/10 dark:text-lp-yellow"
                        : "lppaper-2hover:text-lp-ink border-lp-line bg-lp-paper-2/40 text-lp-ink/75 hover:bg-secondary-background/60"
                    )}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-lp-ink/40" />
              <input
                type="text"
                placeholder="Cari rilis atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="8pr-3 focus: w-full rounded-lg border border-lp-line bg-lp-paper-2/40 py-1.5 pl-9 font-mono text-xs text-lp-ink placeholder:text-lp-ink/40 focus:border-lp-line-strong focus:outline-none"
              />
            </div>
          </div>
        </header>

        {/* Releases Timeline */}
        <div className="mt-8 space-y-8">
          {filteredReleases.map((release) => (
            <article
              key={release.version}
              id={release.version}
              className="scroll-mt-24 rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8"
            >
              {/* Release Header */}
              <div className="flex flex-col gap-3 border-b border-lp-line pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-2xl font-bold text-lp-ink">
                      {release.version}
                    </span>
                    {release.isLatest && (
                      <span className="font-semiboldtext-emerald-600 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs dark:text-emerald-400">
                        LATEST STABLE
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono text-xs text-lp-ink/60">
                      <Calendar className="size-3.5" />
                      <span>{release.date}</span>
                    </span>
                  </div>
                  <h2 className="mt-2 font-heading text-lg font-semibold text-lp-ink sm:text-xl">
                    {release.codename}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {release.packagistUrl && (
                    <a
                      href={release.packagistUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-lp-orange/30 bg-lp-orange/10 px-3 py-1 font-mono text-xs font-medium text-lp-orange transition-colors hover:bg-lp-orange/20 dark:border-lp-yellow/30 dark:bg-lp-yellow/10 dark:text-lp-yellow"
                    >
                      <span>Packagist</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                  <a
                    href={release.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3 py-1 font-mono text-xs font-medium text-lp-ink transition-colors hover:bg-lp-paper-2"
                  >
                    <GitCommit className="size-3.5 text-lp-ink/50" />
                    <span>Release Notes</span>
                    <ExternalLink className="size-3 text-lp-ink/50" />
                  </a>
                </div>
              </div>

              {/* Release Summary */}
              <p className="mt-5 text-sm leading-relaxed text-lp-ink/80 md:text-base">
                {release.summary}
              </p>

              {/* Release Tag Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <Tag className="size-3 text-lp-ink/40" />
                {release.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-lp-line bg-lp-paper-2/40 px-2 py-0.5 font-mono text-[11px] text-lp-ink/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Granular Changes List */}
              <div className="mt-6 space-y-2.5">
                <h3 className="flex items-center gap-2 font-heading text-xs font-semibold tracking-wider text-lp-ink/60 uppercase">
                  <CheckCircle2 className="size-3.5 text-lp-orange dark:text-lp-yellow" />
                  <span>Rincian Perubahan &amp; Peningkatan</span>
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {release.changes.map((change, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-lp-line bg-lp-paper-2/30 p-3.5 transition-colors hover:bg-lp-paper-2/60"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {renderChangeBadge(change.type)}
                        {change.scope && (
                          <span className="rounded-md border border-lp-line bg-lp-paper px-2 py-0.5 font-mono text-[10px] font-medium text-lp-ink">
                            [{change.scope}]
                          </span>
                        )}
                        <h4 className="font-heading text-sm font-semibold text-lp-ink">
                          {change.title}
                        </h4>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-lp-ink/75 sm:text-sm">
                        {change.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {filteredReleases.length === 0 && (
            <div className="rounded-2xl border border-lp-line bg-lp-paper p-12 text-center shadow-xs">
              <Bug className="mx-auto size-8 text-lp-ink/40" />
              <h3 className="mt-3 font-heading text-base font-semibold text-lp-ink">
                Tidak ada riwayat rilis yang cocok
              </h3>
              <p className="mt-1 font-mono text-xs text-lp-ink/60">
                Coba sesuaikan kata kunci pencarian atau bersihkan filter tag.
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA to Docs matching Fumadocs */}
        <div className="mt-12 rounded-2xl border border-lp-line bg-lp-paper-2/40 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold text-lp-ink">
                Ingin mempelajari implementasi teknis lebih lanjut?
              </h3>
              <p className="mt-1 text-xs text-lp-ink/75 sm:text-sm">
                Buka dokumentasi lengkap untuk panduan instalasi Composer,
                konfigurasi middleware, dan arsitektur firewall.
              </p>
            </div>
            <Link
              href="/docs"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-lp-line bg-lp-paper px-4 py-2 font-mono text-xs font-medium text-lp-ink shadow-xs transition-colors hover:bg-lp-paper-2"
            >
              <BookOpen className="size-4" />
              <span>Buka Dokumentasi</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
