"use client"

import * as React from "react"
import Link from "next/link"
import {
  Compass,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Server,
  KeyRound,
  Users,
  Radar,
  ArrowRight,
  Clock,
  BookOpen,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
} from "lucide-react"
import { LegalNav } from "@/components/public/legal-nav"
import { cn } from "@/lib/utils"

type TrackId = "all" | "vps" | "laravel" | "team"

interface CommandBlock {
  id: string
  label: string
  command: string
}

interface TutorialStep {
  number: string
  id: string
  tracks: TrackId[]
  badge: string
  duration: string
  title: string
  summary: string
  icon: React.ComponentType<{ className?: string }>
  details: string[]
  commands?: CommandBlock[]
  tip?: string
  warning?: string
  actionLink?: {
    label: string
    href: string
  }
}

const TRACKS: { id: TrackId; label: string; desc: string }[] = [
  {
    id: "all",
    label: "Semua Tahap (Lengkap)",
    desc: "Panduan menyeluruh dari daftar akun hingga uji proteksi",
  },
  {
    id: "vps",
    label: "Jalur Cepat VPS",
    desc: "Fokus aktivasi lisensi & instalasi daemon Linux Sentinel",
  },
  {
    id: "laravel",
    label: "Integrasi Laravel WAF",
    desc: "Fokus pemasangan middleware pasax/secure-monitor via Composer",
  },
  {
    id: "team",
    label: "Web Terminal & Tim",
    desc: "Fokus multi-konfigurasi SSH & delegasi hak akses tim",
  },
]

export function TutorialClient() {
  const [selectedTrack, setSelectedTrack] = React.useState<TrackId>("all")
  const [completedSteps, setCompletedSteps] = React.useState<
    Record<string, boolean>
  >({})
  const [copiedCmdId, setCopiedCmdId] = React.useState<string | null>(null)

  // Live command customizer for Step 2 & Step 7
  const [sampleToken, setSampleToken] = React.useState<string>("PSK_MASUKKAN_KUNCI_ANDA")
  const [sampleProject, setSampleProject] = React.useState<string>("prj_production")
  const [sampleDomain, setSampleDomain] = React.useState<string>("https://domain-staging-anda.com")

  const steps: TutorialStep[] = React.useMemo(
    () => [
      {
        number: "01",
        id: "tahap-1",
        tracks: ["all", "vps", "laravel", "team"],
        badge: "AKUN & LISENSI",
        duration: "± 1 menit",
        title: "Daftar Akun & Salin Kunci Lisensi Uji Coba Pro 14 Hari",
        summary:
          "Mulai dengan membuat akun pengelola di Pasax Cloud Console. Setiap pendaftar baru langsung memperoleh paket Pro (Free Trial 14 Hari) berfitur penuh beserta License Key unik.",
        icon: KeyRound,
        details: [
          "Buka halaman Pendaftaran (/register), masukkan nama lengkap, organisasi, email aktif, dan kata sandi.",
          "Setelah masuk ke Dashboard SOC (/dashboard), navigasikan ke menu Kunci Lisensi & API (/licenses).",
          "Salin License Key aktif (berawalan PSK_...) dan ID Proyek Anda untuk menghubungkan server VPS pada tahap berikutnya.",
        ],
        tip: "Pasax memakai 2 paket utama (Pro dengan Free Trial 14 Hari dan Enterprise). Selama masa evaluasi aktif, seluruh fitur manajemen server dan penyimpanan multi-konfigurasi Web Terminal sudah terbuka.",
        actionLink: {
          label: "Buka Halaman Daftar / Lisensi",
          href: "/register",
        },
      },
      {
        number: "02",
        id: "tahap-2",
        tracks: ["all", "vps"],
        badge: "LINUX KERNEL AGENT",
        duration: "± 1 menit",
        title: "Pasang Daemon Pasax Sentinel di Server VPS Linux Anda",
        summary:
          "Jalankan satu baris skrip installer resmi via terminal server (sebagai root atau sudo). Skrip otomatis mengunduh biner statis Sentinel, menyiapkan tabel kernel nftables, dan mendaftarkan service systemd.",
        icon: Server,
        details: [
          "Login ke VPS Ubuntu/Debian Anda via SSH atau konsol penyedia VPS.",
          "Isi token & ID proyek Anda pada kotak pratinjau di bawah (atau gunakan nilai dari halaman /node), lalu salin dan jalankan perintah installer.",
          "Pastikan status daemon berjalan aktif dan tabel firewall inet pasax terbentuk tanpa error.",
        ],
        commands: [
          {
            id: "cmd-install-sentinel",
            label: "INSTALLER SENTINEL RESMI (JALANKAN DI VPS)",
            command: `curl -sSL https://pasax.web.id/install.sh | sudo bash -s -- --token=${sampleToken.trim() || "PSK_ANDA"} --project=${sampleProject.trim() || "default"}`,
          },
          {
            id: "cmd-verify-sentinel",
            label: "VERIFIKASI DAEMON & KERNEL NFTABLES",
            command:
              "systemctl status pasax-sentinel --no-pager && sudo nft list table inet pasax",
          },
        ],
        tip: "Sentinel berjalan ringan (~14–22 MB RAM) menggunakan koneksi keluar terenkripsi, tanpa perlu membuka port masuk tambahan di VPS Anda.",
        actionLink: {
          label: "Kelola Server Nodes",
          href: "/node",
        },
      },
      {
        number: "03",
        id: "tahap-3",
        tracks: ["all", "laravel"],
        badge: "LARAVEL APPLICATION WAF",
        duration: "± 2 menit",
        title: "Hubungkan Aplikasi Laravel dengan pasax/secure-monitor",
        summary:
          "Untuk aplikasi web Laravel (10.x–13.x, PHP 8.2+), pasang paket murni PHP tanpa dependensi NPM untuk menyaring SQLi, XSS, brute-force login, dan memicu blokir kernel instan lewat socket IPC lokal.",
        icon: ShieldCheck,
        details: [
          "Masuk ke direktori root proyek Laravel Anda di server.",
          "Pasang paket pasax/secure-monitor dari Packagist menggunakan Composer.",
          "Jalankan perintah Artisan pasax:install untuk menautkan middleware WAF dan konfigurasi awal.",
          "Uji komunikasi antara Laravel WAF dan daemon Sentinel melalui UNIX socket lokal.",
        ],
        commands: [
          {
            id: "cmd-composer-require",
            label: "1. PASANG PAKET PACKAGIST",
            command: "composer require pasax/secure-monitor",
          },
          {
            id: "cmd-artisan-install",
            label: "2. INISIALISASI MIDDLEWARE & KONFIGURASI",
            command: "php artisan pasax:install",
          },
          {
            id: "cmd-artisan-ping",
            label: "3. UJI JABAT TANGAN SOCKET SENTINEL",
            command: "php artisan pasax:sentinel --ping",
          },
        ],
        tip: "Paket ini 100% Pure PHP dengan auto-discovery ServiceProvider. Tidak diperlukan Node.js, Vite build step, atau ekstensi C tambahan pada server produksi.",
        actionLink: {
          label: "Baca Dokumentasi Laravel WAF",
          href: "/docs/pasax-secure-monitor",
        },
      },
      {
        number: "04",
        id: "tahap-4",
        tracks: ["all", "vps", "laravel"],
        badge: "TELEMETRI & VHOST",
        duration: "± 1 menit",
        title: "Verifikasi Node ONLINE, Virtual Host & SSL di Konsol SOC",
        summary:
          "Setelah agen aktif mengirim heartbeat, pastikan VPS Anda tampil berstatus ONLINE di dashboard dan seluruh domain Nginx/Apache terdeteksi otomatis.",
        icon: Compass,
        details: [
          "Buka menu Server Nodes (VPS) (/node) dan pastikan hostname serta IP server Anda tampil dengan badge ONLINE.",
          "Buka menu VHost & SSL Recon (/vhosts) untuk memantau domain aktif, upstream aplikasi, dan masa berlaku sertifikat TLS/SSL.",
          "Setiap akun Admin hanya melihat node milik akunnya sendiri dan tim delegasinya berkat isolasi multi-tenant.",
        ],
        actionLink: {
          label: "Buka VHost & SSL Recon",
          href: "/vhosts",
        },
      },
      {
        number: "05",
        id: "tahap-5",
        tracks: ["all", "team", "vps"],
        badge: "WEB TERMINAL SSH",
        duration: "± 2 menit",
        title: "Simpan Multi-Konfigurasi Web Terminal & Akses VPS di Peramban",
        summary:
          "Kelola server langsung dari peramban melalui halaman Web Terminal (/terminal). Pelanggan aktif dapat menguji dan menyimpan lebih dari satu profil akses SSH ke database.",
        icon: Terminal,
        details: [
          "Masuk ke menu Web Terminal (SSH) (/terminal) lalu klik tombol + Tambah Konfigurasi.",
          "Pilih Server VPS terdaftar, isi Host/IP, Port (misal 22 untuk VPS publik atau 127.0.0.1:2222 untuk VM VirtualBox NAT lokal), Username, dan Password / SSH Private Key.",
          "Klik Uji Koneksi & Simpan. Sistem memverifikasi handshake SSH secara langsung; hanya konfigurasi yang berhasil diverifikasi yang akan tersimpan aman dan muncul di daftar Target Server.",
          "Gunakan 1-klik Hubungkan SSH untuk masuk ke shell interaktif, jalankan Quick Commands, atau aktifkan mode Layar Penuh agar terminal memenuhi seluruh layar.",
        ],
        tip: "Anda dapat menyimpan banyak profil untuk satu server maupun beberapa server berbeda (misal profil admin root dan profil deploy aplikasi), lalu mengedit atau menghapusnya kapan saja.",
        actionLink: {
          label: "Buka Web Terminal SSH",
          href: "/terminal",
        },
      },
      {
        number: "06",
        id: "tahap-6",
        tracks: ["all", "team"],
        badge: "DELEGASI TIM",
        duration: "± 2 menit",
        title: "Tambahkan Anggota Tim (Programmer / DevOps) dengan Isolasi Ketat",
        summary:
          "Delegasikan akses pemantauan dan terminal ke tim teknis tanpa membagikan akun utama Anda. Setiap anggota tim hanya dapat melihat server yang ditugaskan kepada mereka.",
        icon: Users,
        details: [
          "Buka menu Tim VPS & Pengguna (/users), klik Daftarkan Pengguna Pemegang VPS Baru.",
          "Pilih peran (Programmer atau DevOps), isi identitas akun, lalu centang node VPS spesifik yang menjadi wewenangnya.",
          "Tinjau Matriks Hak Akses (/permissions) untuk memastikan batasan aksi tiap peran sudah sesuai kebijakan keamanan tim Anda.",
        ],
        actionLink: {
          label: "Kelola Tim & Hak Akses",
          href: "/users",
        },
      },
      {
        number: "07",
        id: "tahap-7",
        tracks: ["all", "vps", "laravel"],
        badge: "UJI PERTAHANAN",
        duration: "± 1 menit",
        title: "Uji Simulasi Serangan Aman & Pantau Pemblokiran Otomatis",
        summary:
          "Pastikan proteksi bekerja menyeluruh dengan mengirim pola probe aman ke lingkungan staging/lab Anda sendiri, lalu verifikasi respons pemblokiran di dasbor insiden.",
        icon: Radar,
        details: [
          "Kirim permintaan HTTP simulasi payload berbahaya ke domain staging/VM lab milik Anda sendiri menggunakan perintah curl di bawah.",
          "Amati log Insiden Serangan (/threats) dan daftar IP terblokir (/blocklist) untuk memastikan insiden terekam dan aturan drop kernel aktif.",
          "Lihat visualisasi persebaran ancaman pada Global 3D Threat Map (/threats-map).",
        ],
        commands: [
          {
            id: "cmd-test-sqli",
            label: "SIMULASI PROBE SQLI AMAN (HANYA DI SERVER/LAB SENDIRI)",
            command: `curl -i "${sampleDomain.replace(/\/$/, "") || "https://domain-staging-anda.com"}/?id=1%27%20OR%20%271%27=%271"`,
          },
          {
            id: "cmd-check-nft-drops",
            label: "CEK IP TERBLOKIR DI KERNEL VPS",
            command: "sudo nft list table inet pasax",
          },
        ],
        warning:
          "Perhatian: Jalankan perintah simulasi probe HANYA ke server atau lingkungan staging milik Anda sendiri agar IP perangkat Anda tidak memicu pemblokiran permanen di aplikasi produksi.",
        actionLink: {
          label: "Lihat Peta Ancaman & Insiden",
          href: "/threats-map",
        },
      },
    ],
    [sampleToken, sampleProject, sampleDomain]
  )

  const visibleSteps = React.useMemo(() => {
    if (selectedTrack === "all") return steps
    return steps.filter((s) => s.tracks.includes(selectedTrack))
  }, [steps, selectedTrack])

  const completedCount = React.useMemo(
    () => visibleSteps.filter((s) => completedSteps[s.id]).length,
    [visibleSteps, completedSteps]
  )

  const progressPercent =
    visibleSteps.length > 0
      ? Math.round((completedCount / visibleSteps.length) * 100)
      : 0

  const toggleComplete = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }))
  }

  const handleCopy = (id: string, command: string) => {
    navigator.clipboard.writeText(command).then(() => {
      setCopiedCmdId(id)
      setTimeout(() => setCopiedCmdId(null), 2000)
    })
  }

  return (
    <div className="w-full max-w-full py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs">
          <Link
            href="/"
            className="text-lp-ink/60 transition-colors hover:text-lp-ink hover:underline"
          >
            Beranda
          </Link>
          <span className="text-lp-ink/30">/</span>
          <span className="text-lp-ink/75">Panduan</span>
          <span className="text-lp-ink/30">/</span>
          <span className="font-semibold text-lp-ink">
            Tutorial Tahap Demi Tahap
          </span>
        </div>

        <LegalNav />

        {/* Hero Header */}
        <header className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-lp-orange/20 bg-lp-orange/10 px-3 py-1 font-mono text-xs font-medium tracking-wider text-lp-orange uppercase dark:border-lp-yellow/20 dark:bg-lp-yellow/10 dark:text-lp-yellow">
              <Sparkles className="size-3.5" />
              <span>STEP-BY-STEP ONBOARDING</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lp-line bg-lp-paper-2 px-3 py-1 font-mono text-xs font-medium text-lp-ink tabular-nums">
                <Clock className="size-3.5 text-lp-orange dark:text-lp-yellow" />
                <span>± 10 Menit Selesai</span>
              </span>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance text-lp-ink sm:text-4xl lg:text-5xl">
            Tutorial Pasax Tahap Demi Tahap
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-pretty text-lp-ink/75 sm:text-lg">
            Ikuti panduan terstruktur dari nol hingga server VPS dan aplikasi
            web Anda terlindungi secara menyeluruh: mulai dari registrasi uji
            coba Pro 14 hari, pemasangan daemon Linux, integrasi WAF Laravel,
            hingga manajemen Web Terminal SSH dan tim.
          </p>

          {/* Track Filter Pills */}
          <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {TRACKS.map((track) => {
              const active = selectedTrack === track.id
              return (
                <button
                  key={track.id}
                  type="button"
                  data-testid={`track-${track.id}`}
                  onClick={() => setSelectedTrack(track.id)}
                  className={cn(
                    "cursor-pointer rounded-xl border p-3.5 text-left transition-all",
                    active
                      ? "border-lp-orange/40 bg-lp-orange/10 shadow-xs dark:border-lp-yellow/40 dark:bg-lp-yellow/10"
                      : "border-lp-line bg-lp-paper-2/40 hover:bg-lp-paper-2"
                  )}
                >
                  <div
                    className={cn(
                      "font-heading text-xs font-semibold sm:text-sm",
                      active
                        ? "text-lp-orange dark:text-lp-yellow"
                        : "text-lp-ink"
                    )}
                  >
                    {track.label}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-lp-ink/65">
                    {track.desc}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Interactive Progress Summary */}
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-lp-line bg-lp-paper-2/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="font-semibold tracking-wider text-lp-ink/75 uppercase">
                  Progres Tutorial Anda
                </span>
                <span
                  data-testid="tutorial-progress-text"
                  className="font-bold text-lp-ink tabular-nums"
                >
                  {completedCount} / {visibleSteps.length} Tahap ({progressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full border border-lp-line bg-lp-paper">
                <div
                  className="h-full bg-lp-orange transition-all duration-300 dark:bg-lp-yellow"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={() => setCompletedSteps({})}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper px-3 py-1.5 font-mono text-xs font-medium text-lp-ink/75 transition-colors hover:bg-lp-paper-2 hover:text-lp-ink"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Progres</span>
              </button>
            )}
          </div>
        </header>

        {/* Main 2-Column Tutorial Body */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Sticky Step Navigator */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20 space-y-4 rounded-2xl border border-lp-line bg-lp-paper p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-lp-line pb-3">
                <h2 className="font-heading text-sm font-semibold tracking-tight text-lp-ink">
                  Daftar Tahap ({visibleSteps.length})
                </h2>
                <span className="font-mono text-[11px] text-lp-ink/60 tabular-nums">
                  {completedCount}/{visibleSteps.length} Selesai
                </span>
              </div>

              <nav aria-label="Daftar Tahap Tutorial" className="space-y-1.5">
                {visibleSteps.map((step) => {
                  const done = !!completedSteps[step.id]
                  return (
                    <a
                      key={step.id}
                      href={`#${step.id}`}
                      className={cn(
                        "group flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition-colors",
                        done
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-transparent hover:border-lp-line hover:bg-lp-paper-2/60"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] font-bold tabular-nums",
                          done
                            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "border-lp-line bg-lp-paper-2 text-lp-ink"
                        )}
                      >
                        {done ? "✓" : step.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[10px] font-semibold tracking-wider text-lp-ink/55 uppercase">
                          {step.badge}
                        </div>
                        <div className="line-clamp-2 text-xs font-medium text-lp-ink group-hover:text-lp-orange dark:group-hover:text-lp-yellow">
                          {step.title}
                        </div>
                      </div>
                    </a>
                  )
                })}
              </nav>

              {/* Quick Personalizer */}
              <div className="space-y-3 border-t border-lp-line pt-4">
                <div className="font-mono text-[10px] font-bold tracking-wider text-lp-ink/70 uppercase">
                  Sesuaikan Parameter Perintah
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="mb-1 block font-mono text-[11px] text-lp-ink/65">
                      License Key (dari /licenses)
                    </label>
                    <input
                      type="text"
                      value={sampleToken}
                      onChange={(e) => setSampleToken(e.target.value)}
                      className="w-full rounded-lg border border-lp-line bg-lp-paper-2/50 px-2.5 py-1.5 font-mono text-xs text-lp-ink focus:border-lp-line-strong focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[11px] text-lp-ink/65">
                      ID Proyek
                    </label>
                    <input
                      type="text"
                      value={sampleProject}
                      onChange={(e) => setSampleProject(e.target.value)}
                      className="w-full rounded-lg border border-lp-line bg-lp-paper-2/50 px-2.5 py-1.5 font-mono text-xs text-lp-ink focus:border-lp-line-strong focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[11px] text-lp-ink/65">
                      Domain Uji (Staging)
                    </label>
                    <input
                      type="text"
                      value={sampleDomain}
                      onChange={(e) => setSampleDomain(e.target.value)}
                      className="w-full rounded-lg border border-lp-line bg-lp-paper-2/50 px-2.5 py-1.5 font-mono text-xs text-lp-ink focus:border-lp-line-strong focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Step-by-Step Cards */}
          <div className="space-y-6 lg:col-span-8">
            {visibleSteps.map((step) => {
              const Icon = step.icon
              const isDone = !!completedSteps[step.id]

              return (
                <article
                  key={step.id}
                  id={step.id}
                  data-testid={`tutorial-step-${step.number}`}
                  className={cn(
                    "scroll-mt-20 rounded-2xl border bg-lp-paper p-6 shadow-xs transition-colors sm:p-8",
                    isDone
                      ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                      : "border-lp-line"
                  )}
                >
                  {/* Step Card Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-lp-line pb-5">
                    <div className="flex items-start gap-3.5">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-lp-line bg-lp-paper-2 font-mono text-base font-bold text-lp-ink tabular-nums">
                        {step.number}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md border border-lp-orange/25 bg-lp-orange/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-lp-orange uppercase dark:border-lp-yellow/25 dark:bg-lp-yellow/10 dark:text-lp-yellow">
                            <Icon className="size-3" />
                            <span>{step.badge}</span>
                          </span>
                          <span className="font-mono text-[11px] text-lp-ink/60 tabular-nums">
                            {step.duration}
                          </span>
                        </div>
                        <h2 className="font-heading text-lg font-semibold tracking-tight text-balance text-lp-ink sm:text-xl">
                          {step.title}
                        </h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      data-testid={`complete-btn-${step.number}`}
                      onClick={() => toggleComplete(step.id)}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-colors",
                        isDone
                          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "border-lp-line bg-lp-paper-2/60 text-lp-ink/80 hover:bg-lp-paper-2 hover:text-lp-ink"
                      )}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="size-3.5" />
                          <span>Selesai</span>
                        </>
                      ) : (
                        <>
                          <Circle className="size-3.5" />
                          <span>Tandai Selesai</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step Summary */}
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-pretty text-lp-ink/80 sm:text-base">
                    {step.summary}
                  </p>

                  {/* Action Sub-steps */}
                  <ol className="mt-5 space-y-2.5">
                    {step.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm leading-relaxed text-lp-ink/85"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-lp-line bg-lp-paper-2 font-mono text-[11px] font-semibold text-lp-ink tabular-nums">
                          {idx + 1}
                        </span>
                        <span className="max-w-2xl text-pretty">{detail}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Code Snippets */}
                  {step.commands && step.commands.length > 0 && (
                    <div className="mt-5 space-y-3">
                      {step.commands.map((cmd) => (
                        <div
                          key={cmd.id}
                          className="overflow-hidden rounded-xl border border-lp-line bg-[#121210] p-3.5 text-[#eceae2]"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[rgba(236,234,226,0.1)] pb-2 font-mono text-[10px] tracking-wider text-[#eceae2]/65 uppercase">
                            <span>{cmd.label}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(cmd.id, cmd.command)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded bg-[#1e1e1c] px-2 py-0.5 font-mono text-[10px] text-[#eceae2] normal-case hover:text-white"
                            >
                              {copiedCmdId === cmd.id ? (
                                <>
                                  <Check className="size-3 text-emerald-400" />
                                  <span className="text-emerald-400">
                                    Tersalin!
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="size-3" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="mt-2.5 overflow-x-auto font-mono text-xs text-amber-300 sm:text-sm">
                            <code>{cmd.command}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tip Callout */}
                  {step.tip && (
                    <div className="mt-5 rounded-xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-xs leading-relaxed text-sky-900 dark:text-sky-200 sm:text-sm">
                      <strong className="font-mono uppercase">Tips:</strong>{" "}
                      {step.tip}
                    </div>
                  )}

                  {/* Warning Callout */}
                  {step.warning && (
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-900 dark:text-amber-200 sm:text-sm">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>{step.warning}</span>
                    </div>
                  )}

                  {/* Action Footer Link */}
                  {step.actionLink && (
                    <div className="mt-5 flex justify-end border-t border-lp-line pt-4">
                      <Link
                        href={step.actionLink.href}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/70 px-3.5 py-2 font-mono text-xs font-semibold text-lp-ink transition-colors hover:border-lp-line-strong hover:bg-lp-paper-2"
                      >
                        <span>{step.actionLink.label}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-lp-line bg-lp-paper-2/40 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold text-lp-ink sm:text-xl">
                Siap Mengamankan Armada Server Anda?
              </h3>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-pretty text-lp-ink/75 sm:text-sm">
                Mulai uji coba Pro 14 hari gratis sekarang atau buka
                dokumentasi teknis lengkap untuk konfigurasi lanjutan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper px-4 py-2 font-medium text-lp-ink shadow-xs transition-colors hover:bg-lp-paper-2"
              >
                <BookOpen className="size-3.5" />
                <span>Dokumentasi Lengkap</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-main px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
              >
                <span>Mulai Free Trial 14 Hari</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
