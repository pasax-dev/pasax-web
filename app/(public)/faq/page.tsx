"use client"

import * as React from "react"
import Link from "next/link"
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShieldCheck,
  Zap,
  Cpu,
  Lock,
  Scale,
  Server,
  Terminal,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react"
import { LegalNav } from "@/components/public/legal-nav"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FaqItem {
  id: string
  category: "architecture" | "performance" | "compatibility" | "privacy" | "licensing" | "fleet"
  question: string
  answer: string
  codeSnippet?: string
  tags: string[]
}

const CATEGORIES = [
  { id: "all", label: "Semua Pertanyaan", icon: HelpCircle },
  { id: "architecture", label: "Arsitektur & Konsep", icon: ShieldCheck },
  { id: "performance", label: "Performa (<0.2ms)", icon: Zap },
  { id: "compatibility", label: "Kompatibilitas", icon: Cpu },
  { id: "privacy", label: "Privasi & Zero-Knowledge", icon: Lock },
  { id: "licensing", label: "Lisensi Open Source", icon: Scale },
  { id: "fleet", label: "Fleet & Deployment", icon: Server },
] as const

const FAQ_LIST: FaqItem[] = [
  {
    id: "what-is-pasax",
    category: "architecture",
    question: "Apa itu Pasax Security Suite dan untuk siapa framework ini dibuat?",
    answer:
      "Pasax adalah ekosistem kekebalan server mandiri (autonomous server fleet immunity) yang dirancang khusus untuk pengembang, DevOps, dan tim SecOps yang mengelola server Linux dan aplikasi web produksi. Berbeda dari solusi keamanan konvensional yang lambat dan berat, Pasax menggabungkan proteksi level aplikasi (PHP WAF) dengan proteksi level kernel (Linux nftables & inotify FIM) untuk memotong serangan siber dalam hitungan mikrodetik sebelum menyentuh resource server.",
    tags: ["Umum", "Arsitektur", "DevOps"],
  },
  {
    id: "three-layer-architecture",
    category: "architecture",
    question: "Mengapa Pasax memisahkan sistemnya menjadi 3 lapis (Trinity Architecture)?",
    answer:
      "Arsitektur 3 lapis memisahkan domain tanggung jawab keamanan secara independen namun terkoordinasi:\n1. Lapisan Aplikasi (Pasax Secure Monitor): WAF 100% PHP murni yang menyaring HTTP payload, brute-force login, dan karantina session tanpa dependensi runtime C.\n2. Lapisan Kernel (Pasax Sentinel): Daemon Go otonom yang mengeksekusi penolakan paket jaringan instan via Linux nftables dan mengunci integritas berkas sistem via inotify.\n3. Lapisan Koordinasi (Core Mesh & Threat Ledger): Mesh sinkronisasi GitOps (pasax-rules.yml) dan telemetri insiden terdesentralisasi antar-node.",
    tags: ["Arsitektur", "3 Layers", "Trinity"],
  },
  {
    id: "comparison-fail2ban-cloudflare",
    category: "architecture",
    question: "Apa perbedaan Pasax dengan Fail2ban, CrowdSec, atau Cloudflare WAF?",
    answer:
      "Fail2ban membaca log teks secara reaktif setelah serangan terjadi (delay 5–30 detik). Cloudflare WAF hanya melindungi traffic HTTP publik dan tidak mengetahui apa yang terjadi di dalam OS Linux host Anda.\n\nPasax bekerja proaktif secara end-to-end: WAF aplikasi mendeteksi payload SQLi/XSS/Brute-force, seketika memerintahkan kernel nftables untuk memblokir IP penyerang di level TCP/IP (<0.2ms) sebelum request berikutnya sampai ke web server, sekaligus memantau integritas filesystem dari infeksi webshell.",
    tags: ["Perbandingan", "Fail2ban", "Cloudflare"],
  },
  {
    id: "sub-millisecond-latency",
    category: "performance",
    question: "Bagaimana cara Pasax Sentinel mencapai pemblokiran paket jaringan di bawah 0.2 milidetik?",
    answer:
      "Pasax Sentinel berkomunikasi langsung dengan API Netlink subsistem nftables kernel Linux menggunakan socket biner murni tanpa memanggil proses shell terpisah (fork/exec). Aturan drop dimasukkan langsung ke tabel raw prerouting kernel, sehingga paket berbahaya dari IP terblokir dibuang seketika pada kartu jaringan (NIC) sebelum melewati stack memori socket TCP/IP ruang pengguna.",
    tags: ["nftables", "Performa", "Sub-0.2ms"],
  },
  {
    id: "waf-overhead-performance",
    category: "performance",
    question: "Apakah middleware Pasax Secure Monitor akan memperlambat response time aplikasi web saya?",
    answer:
      "Overhead evaluasi regex WAF murni PHP Pasax telah dioptimalkan dengan algoritma Aho-Corasick dan caching token perangkat in-memory. Pada pengujian benchmark produksi (Laravel 11 di PHP 8.3 OPcache), penambahan latensi rata-rata hanya berkisar antara 0.15ms hingga 0.40ms per HTTP request, praktis tidak terasa oleh pengguna akhir.",
    tags: ["PHP WAF", "Latensi", "Benchmark"],
  },
  {
    id: "resource-consumption-ram-cpu",
    category: "performance",
    question: "Berapa konsumsi CPU dan RAM daemon Pasax Sentinel di server Linux?",
    answer:
      "Sangat efisien. Daemon Pasax Sentinel dikompilasi statis dengan bahasa Go. Dalam kondisi operasional normal memantau firewall nftables dan ratusan ribu file inotify, konsumsi memori hanya memakan 12MB hingga 25MB RAM dengan penggunaan CPU di bawah 0.5% pada VPS 1 vCPU.",
    tags: ["RAM", "CPU", "Overhead"],
  },
  {
    id: "supported-os-linux-distros",
    category: "compatibility",
    question: "Distro Linux apa saja yang didukung resmi oleh Pasax Sentinel?",
    answer:
      "Pasax Sentinel mendukung kernel Linux 5.4 ke atas yang mendukung subsistem nftables, termasuk:\n• Ubuntu 20.04 LTS, 22.04 LTS, 24.04 LTS\n• Debian 11 (Bullseye), 12 (Bookworm)\n• RHEL 8 / 9, Rocky Linux, AlmaLinux\n• Alpine Linux (arsitektur x86_64 dan aarch64 / ARM64).",
    tags: ["Linux", "Ubuntu", "Debian", "ARM64"],
  },
  {
    id: "docker-container-support",
    category: "compatibility",
    question: "Apakah Pasax dapat berjalan di dalam container Docker atau Kubernetes?",
    answer:
      "Ya! Untuk Pasax Secure Monitor (WAF), Anda dapat menjalankannya di container PHP-FPM / Laravel manapun tanpa izin khusus.\nUntuk Pasax Sentinel (Kernel Daemon), daemon dijalankan pada level host server (atau container dengan flag cap-add=NET_ADMIN dan host network) agar dapat memanipulasi aturan nftables jaringan host.",
    codeSnippet: "docker run -d --name pasax-sentinel --net=host --cap-add=NET_ADMIN -v /etc/pasax:/etc/pasax pasax/sentinel:latest",
    tags: ["Docker", "Kubernetes", "Container"],
  },
  {
    id: "php-laravel-versions",
    category: "compatibility",
    question: "Versi PHP dan framework apa saja yang kompatibel dengan WAF?",
    answer:
      "Pasax Secure Monitor kompatibel penuh dengan PHP 8.1, 8.2, 8.3, dan 8.4. Didesain secara khusus untuk framework Laravel versi 10, 11, 12, dan 13, serta dapat diintegrasikan dengan aplikasi non-Laravel via antarmuka middleware standalone PSR-15.",
    codeSnippet: "composer require pasax/secure-monitor",
    tags: ["PHP", "Laravel", "Composer"],
  },
  {
    id: "nginx-apache-reverse-proxy",
    category: "compatibility",
    question: "Apakah Pasax memerlukan konfigurasi khusus jika menggunakan Nginx atau Apache?",
    answer:
      "Tidak wajib, namun kami menyediakan blueprint konfigurasi hardened Nginx dan Apache (.htaccess) di dokumentasi resmi. Pasax secara otomatis membaca header reverse proxy terpercaya (seperti X-Forwarded-For atau CF-Connecting-IP) dengan validasi subnet aman agar penyerang tidak dapat memalsukan IP aslinya.",
    tags: ["Nginx", "Apache", "Reverse Proxy"],
  },
  {
    id: "zero-knowledge-privacy",
    category: "privacy",
    question: "Apakah Pasax mengirimkan isi request (payload), password, atau database saya ke cloud?",
    answer:
      "SAMA SEKALI TIDAK. Pasax menganut prinsip Zero-Knowledge Architecture. Seluruh inspeksi muatan HTTP dan berkas sensitif berlangsung lokal 100% di dalam mesin server Anda. Telemetri yang dikirimkan ke console terpusat HANYA berupa metadata keamanan anonim (IP penyerang, tipe serangan seperti SQLi/BruteForce, timestamp, dan kode negara) tanpa pernah membawa isi body request, cookie sesi, atau data pelanggan.",
    tags: ["Privasi", "Zero-Knowledge", "Data Security"],
  },
  {
    id: "telemetry-egress-mtls",
    category: "privacy",
    question: "Mengapa koneksi telemetri Pasax bersifat egress-only via mTLS 1.3?",
    answer:
      "Server VPS Anda tidak pernah membuka port inbound listening tambahan untuk koneksi remote Pasax. Semua pertukaran data adalah outbound-only (keluar) yang dienkripsi timbal-balik (mutual TLS 1.3) menggunakan sertifikat kriptografi X.509 unik per node. Hal ini menjamin penyerang di luar internet tidak dapat melakukan port scanning atau mengeksploitasi celah komunikasi daemon.",
    tags: ["mTLS", "Egress Only", "Port Security"],
  },
  {
    id: "open-source-license-mit",
    category: "licensing",
    question: "Apakah kode sumber Pasax benar-benar 100% open source dan gratis?",
    answer:
      "Ya. Komponen inti Pasax Sentinel (daemon Go) dan Pasax Secure Monitor (WAF Laravel) dirilis di bawah lisensi terbuka MIT License. Anda bebas mengunduh, mengaudit, memodifikasi, dan menggunakannya untuk server pribadi maupun infrastruktur produksi komersial tanpa biaya royalti.",
    tags: ["MIT License", "Open Source", "Gratis"],
  },
  {
    id: "commercial-use",
    category: "licensing",
    question: "Bolehkah saya menggunakan Pasax untuk melindungi infrastruktur klien atau bisnis komersial?",
    answer:
      "Tentu saja. Lisensi MIT memberikan kebebasan komersial penuh. Anda dapat memasang Pasax pada server klien jasa hosting, agensi software house, maupun platform SaaS milik perusahaan Anda.",
    tags: ["Komersial", "Lisensi", "Enterprise"],
  },
  {
    id: "quick-install-command",
    category: "fleet",
    question: "Bagaimana cara memasang Pasax Sentinel pada server Linux baru?",
    answer:
      "Pemasangan dapat dilakukan dengan satu baris perintah shell interaktif yang secara otomatis mendeteksi distro, mengonfigurasi systemd service, dan menyiapkan whitelist SSH:",
    codeSnippet: "curl -sSL https://get.pasax.dev | bash",
    tags: ["Instalasi", "CLI", "Shell"],
  },
  {
    id: "admin-lockout-ssh-protection",
    category: "fleet",
    question: "Bagaimana jika firewall tidak sengaja memblokir IP saya sendiri? Apakah ada proteksi SSH?",
    answer:
      "Pasax Sentinel memiliki fitur SSH Safe-Harbor otomatis. Port SSH Anda (default port 22 atau custom port yang aktif di sshd_config) secara otomatis dikecualikan dari pemblokiran massal. Selain itu, Anda dapat mendaftarkan subnet IP kantor/rumah ke dalam berkas whitelist permanen /etc/pasax/whitelist.conf.",
    tags: ["SSH", "Lockout", "Whitelist"],
  },
  {
    id: "gitops-fleet-rules-sync",
    category: "fleet",
    question: "Bagaimana cara menyinkronkan aturan keamanan di puluhan server secara bersamaan?",
    answer:
      "Anda dapat menggunakan fitur Declarative Policy as Code pasax-rules.yml. Cukup letakkan berkas konfigurasi di repositori Git internal organisasi Anda dan jalankan webhook pipeline (CI/CD) atau daemon sync pasax-sentinel sync untuk mendistribusikan aturan baru ke seluruh armada node secara instan.",
    codeSnippet: "pasax-sentinel policy apply --config /path/to/pasax-rules.yml",
    tags: ["GitOps", "Policy as Code", "Fleet Sync"],
  },
]

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({
    "what-is-pasax": true,
    "three-layer-architecture": true,
  })
  const [copiedSnippetId, setCopiedSnippetId] = React.useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const expandAll = () => {
    const all: Record<string, boolean> = {}
    FAQ_LIST.forEach((item) => (all[item.id] = true))
    setOpenItems(all)
  }

  const collapseAll = () => {
    setOpenItems({})
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSnippetId(id)
    setTimeout(() => setCopiedSnippetId(null), 2000)
  }

  const filteredFaqs = React.useMemo(() => {
    return FAQ_LIST.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="w-full max-w-full py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
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
          <span className="text-main">FAQ</span>
        </div>

        {/* Legal & Docs Navigation Bar */}
        <LegalNav />

        {/* Header Block */}
        <div className="rounded-base border-2 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--border)] md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)]">
              <HelpCircle className="size-4 text-main" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="rounded-base border-2 border-border bg-main px-2.5 py-0.5 font-mono text-xs font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                {FAQ_LIST.length} JAWABAN RESMI
              </span>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg text-pretty">
            Temukan jawaban komprehensif seputar arsitektur 3 lapis, performa latensi kernel di bawah 0.2 milidetik, kepatuhan privasi data Zero-Knowledge, dan tata cara implementasi di armada server Anda.
          </p>

          {/* Search Box */}
          <div className="relative mt-8">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik kata kunci pertanyaan (misal: 'nftables', 'Docker', 'RAM', 'SSH', 'Lisensi')..."
              className="w-full rounded-base border-2 border-border bg-background py-3 pl-10 pr-4 font-mono text-xs font-medium text-foreground placeholder:text-muted-foreground/60 shadow-[3px_3px_0px_0px_var(--border)] focus:outline-none focus:ring-2 focus:ring-main sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-base border-2 border-border px-3 py-1.5 font-heading text-xs font-bold transition-all shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer",
                    isSelected
                      ? "bg-main text-main-foreground"
                      : "bg-secondary-background text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Bar (Expand/Collapse) */}
        <div className="mt-8 flex items-center justify-between text-xs">
          <span className="font-mono font-bold text-muted-foreground">
            Menampilkan {filteredFaqs.length} dari {FAQ_LIST.length} pertanyaan
          </span>
          <div className="flex items-center gap-2 font-mono font-bold">
            <button
              onClick={expandAll}
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              Buka Semua
            </button>
            <span>&bull;</span>
            <button
              onClick={collapseAll}
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              Tutup Semua
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-4 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-base border-2 border-border bg-card p-12 text-center shadow-[4px_4px_0px_0px_var(--border)]">
              <AlertCircle className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-heading text-lg font-bold text-foreground">
                Tidak ada pertanyaan yang sesuai dengan kata kunci pencarian.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
                className="mt-4 rounded-base border-2 border-border bg-main px-4 py-2 font-mono text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id]
              return (
                <div
                  key={faq.id}
                  id={faq.id}
                  className={cn(
                    "rounded-base border-2 border-border bg-card transition-all shadow-[4px_4px_0px_0px_var(--border)]",
                    isOpen && "bg-secondary-background/40"
                  )}
                >
                  {/* Trigger Header */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left cursor-pointer sm:p-6"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-border bg-main font-mono text-[10px] font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                        Q
                      </span>
                      <div className="space-y-1">
                        <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                          {faq.question}
                        </h2>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-border bg-secondary-background px-1.5 py-0.2 font-mono text-[9px] font-bold text-muted-foreground uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "mt-1 flex size-6 shrink-0 items-center justify-center rounded-base border-2 border-border bg-background transition-transform duration-200 shadow-[1px_1px_0px_0px_var(--border)]",
                        isOpen && "rotate-180 bg-main text-main-foreground"
                      )}
                    >
                      <ChevronDown className="size-3.5" />
                    </div>
                  </button>

                  {/* Body Content */}
                  {isOpen && (
                    <div className="border-t-2 border-border px-5 pb-6 pt-4 sm:px-6">
                      <div className="max-w-prose space-y-3 font-sans text-sm leading-relaxed text-foreground/85 whitespace-pre-line text-pretty">
                        {faq.answer}
                      </div>

                      {/* Optional Code Snippet */}
                      {faq.codeSnippet && (
                        <div className="relative mt-4 overflow-hidden rounded-base border-2 border-border bg-[#0b0f19] p-3 text-slate-100 shadow-[2px_2px_0px_0px_var(--border)]">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[10px] font-mono text-slate-400">
                            <span>TERMINAL EXECUTION</span>
                            <button
                              onClick={() => handleCopy(faq.id, faq.codeSnippet!)}
                              className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-200 hover:bg-slate-700"
                            >
                              {copiedSnippetId === faq.id ? (
                                <>
                                  <Check className="size-2.5 text-emerald-400" />
                                  <span>Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="size-2.5" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="mt-2 overflow-x-auto font-mono text-xs text-amber-300">
                            <code>{faq.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="mt-12 rounded-base border-2 border-border bg-secondary-background p-6 text-center shadow-[4px_4px_0px_0px_var(--border)] sm:p-8">
          <h3 className="font-heading text-lg font-black text-foreground sm:text-xl">
            Punya Pertanyaan Spesifik Terkait Infrastruktur Anda?
          </h3>
          <p className="mt-2 text-sm text-foreground/80">
            Tim teknis dan komunitas Pasax siap membantu integrasi firewall, ruleset kustom, atau audit arsitektur keamanan server Anda.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-mono text-xs font-bold">
            <a
              href="https://github.com/pasax-dev/pasax-suit/discussions"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-main px-4 py-2 font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <span>GitHub Discussions</span>
              <ExternalLink className="size-3.5" />
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-card px-4 py-2 text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-muted transition-all"
            >
              <span>Baca Dokumentasi Lengkap</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
