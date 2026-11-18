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
import { cn } from "@/lib/utils"

interface FaqItem {
  id: string
  category:
    | "architecture"
    | "performance"
    | "compatibility"
    | "privacy"
    | "licensing"
    | "fleet"
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
    question:
      "Apa itu Pasax Security Suite dan untuk siapa framework ini dibuat?",
    answer:
      "Pasax adalah ekosistem kekebalan server mandiri (autonomous server fleet immunity) yang dirancang khusus untuk pengembang, DevOps, dan tim SecOps yang mengelola server Linux dan aplikasi web produksi. Berbeda dari solusi keamanan konvensional yang lambat dan berat, Pasax menggabungkan proteksi level aplikasi (PHP WAF) dengan proteksi level kernel (Linux nftables & inotify FIM) untuk memotong serangan siber dalam hitungan mikrodetik sebelum menyentuh resource server.",
    tags: ["Umum", "Arsitektur", "DevOps"],
  },
  {
    id: "three-layer-architecture",
    category: "architecture",
    question:
      "Mengapa Pasax memisahkan sistemnya menjadi 3 lapis (Trinity Architecture)?",
    answer:
      "Arsitektur 3 lapis memisahkan domain tanggung jawab keamanan secara independen namun terkoordinasi:\n1. Lapisan Aplikasi (Pasax Secure Monitor): WAF 100% PHP murni yang menyaring HTTP payload, brute-force login, dan karantina session tanpa dependensi runtime C.\n2. Lapisan Kernel (Pasax Sentinel): Daemon Go otonom yang mengeksekusi penolakan paket jaringan instan via Linux nftables dan mengunci integritas berkas sistem via inotify.\n3. Lapisan Koordinasi (Core Mesh & Threat Ledger): Mesh sinkronisasi GitOps (pasax-rules.yml) dan telemetri insiden terdesentralisasi antar-node.",
    tags: ["Arsitektur", "3 Layers", "Trinity"],
  },
  {
    id: "comparison-fail2ban-cloudflare",
    category: "architecture",
    question:
      "Apa perbedaan Pasax dengan Fail2ban, CrowdSec, atau Cloudflare WAF?",
    answer:
      "Fail2ban membaca log teks secara reaktif setelah serangan terjadi (delay 5–30 detik). Cloudflare WAF hanya melindungi traffic HTTP publik dan tidak mengetahui apa yang terjadi di dalam OS Linux host Anda.\n\nPasax bekerja proaktif secara end-to-end: WAF aplikasi mendeteksi payload SQLi/XSS/Brute-force, seketika memerintahkan kernel nftables untuk memblokir IP penyerang di level TCP/IP (<0.2ms) sebelum request berikutnya sampai ke web server, sekaligus memantau integritas filesystem dari infeksi webshell.",
    tags: ["Perbandingan", "Fail2ban", "Cloudflare"],
  },
  {
    id: "how-sub-02ms-blocking-works",
    category: "performance",
    question:
      "Bagaimana cara Pasax Sentinel mencapai pemblokiran paket jaringan di bawah 0.2 milidetik?",
    answer:
      "Ketika WAF aplikasi mendeteksi payload berbahaya, ia mengirimkan sinyal IPC UNIX Socket lokal ke daemon Pasax Sentinel (latensi ~0.04ms). Sentinel langsung menyuntikkan rule penolakan ke nftables kernel set tanpa me-reload firewall.\n\nKarena nftables beroperasi langsung di kernel network stack (Netfilter hook) sebelum paket mencapai socket TCP web server (Nginx/Apache), paket penyerang selanjutnya di-drop secara wire-speed tanpa membebani CPU PHP maupun web server sama sekali.",
    codeSnippet: "pasax sentinel status --benchmark-netfilter",
    tags: ["Performa", "Kernel", "nftables"],
  },
  {
    id: "memory-footprint",
    category: "performance",
    question:
      "Berapa banyak penggunaan RAM dan CPU oleh Pasax Sentinel di server VPS?",
    answer:
      "Pasax Sentinel dikompilasi statis dalam bahasa Go dengan alokasi memori nol-overhead. Rata-rata footprint memori hanya berkisar antara 14MB hingga 22MB RAM saat idle, dan lonjakan CPU di bawah 0.8% bahkan ketika memproses ribuan event inotify per detik.",
    tags: ["RAM", "Overhead", "Efisiensi"],
  },
  {
    id: "zero-npm-philosophy",
    category: "compatibility",
    question:
      "Mengapa pasax/secure-monitor tidak memiliki dependensi NPM / Node.js sama sekali?",
    answer:
      "Mengikuti filosofi Spatie standar emas Laravel, paket ini adalah 100% Pure PHP. Anda tidak perlu menginstal Node.js, npm, yarn, atau menjalankan build step (Vite/Webpack) di server produksi backend Anda. Paket langsung bekerja di Laravel Blade, Livewire, Filament, Inertia, maupun API headless murni.",
    tags: ["Laravel", "Pure PHP", "Zero NPM"],
  },
  {
    id: "laravel-compatibility",
    category: "compatibility",
    question:
      "Versi Laravel dan PHP apa saja yang didukung oleh pasax/secure-monitor?",
    answer:
      "Paket Packagist pasax/secure-monitor mendukung penuh:\n- PHP: ^8.2, ^8.3, ^8.4, dan ^8.5\n- Framework Laravel: 10.x, 11.x, 12.x, dan 13.x\n\nPaket menggunakan auto-discovery modern untuk mendaftarkan PasaxServiceProvider dan Facade Pasax secara otomatis.",
    tags: ["PHP 8.2+", "Laravel 10-13", "Composer"],
  },
  {
    id: "zero-knowledge-privacy",
    category: "privacy",
    question:
      "Apakah telemetri Pasax mengirimkan data sensitif pelanggan ke server cloud?",
    answer:
      "TIDAK PERNAH. Pasax beroperasi berdasarkan prinsip Zero-Knowledge. Seluruh inspeksi regex WAF dan deteksi webshell berjalan 100% lokal di CPU server Anda. Telemetri keluar hanya mentransmisikan metadata teknis penyerang (misal: IP penyerang dan tipe serangan) lewat koneksi terenkripsi mTLS 1.3 demi membangun blocklist global.",
    tags: ["Privasi", "Zero-Knowledge", "mTLS"],
  },
  {
    id: "licensing-model",
    category: "licensing",
    question: "Apakah Pasax gratis untuk keperluan proyek komersial?",
    answer:
      "YA. Paket pasax-sentinel dan pasax/secure-monitor berlisensi MIT Open Source penuh. Anda bebas menggunakannya untuk aplikasi klien, startup, enterprise, maupun server produksi pribadi tanpa royalti.",
    tags: ["Lisensi", "MIT", "Komersial"],
  },
]

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({
    "what-is-pasax": true,
  })
  const [copiedSnippetId, setCopiedSnippetId] = React.useState<string | null>(
    null
  )

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const expandAll = () => {
    const all: Record<string, boolean> = {}
    FAQ_LIST.forEach((item) => {
      all[item.id] = true
    })
    setOpenItems(all)
  }

  const collapseAll = () => {
    setOpenItems({})
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSnippetId(id)
      setTimeout(() => setCopiedSnippetId(null), 2000)
    })
  }

  const filteredFaqs = React.useMemo(() => {
    return FAQ_LIST.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.tags.some((t) => t.toLowerCase().includes(q))

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="w-full max-w-full py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb matching Fumadocs */}
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
          <span className="font-semibold text-lp-ink">FAQ</span>
        </div>

        {/* Legal & Docs Navigation Bar */}
        <LegalNav />

        {/* Header Block matching Fumadocs */}
        <header className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-lp-orange/20 bg-lp-orange/10 px-3 py-1 font-mono text-xs font-medium text-lp-orange dark:border-lp-yellow/20 dark:bg-lp-yellow/10 dark:text-lp-yellow">
              <HelpCircle className="size-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2.5 py-0.5 font-mono text-xs font-medium text-lp-ink">
                {FAQ_LIST.length} Jawaban Resmi
              </span>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-lp-ink sm:text-4xl lg:text-5xl">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-lp-ink/75 sm:text-lg">
            Temukan jawaban komprehensif seputar arsitektur 3 lapis, performa
            latensi kernel di bawah 0.2 milidetik, kepatuhan privasi data
            Zero-Knowledge, dan implementasi di aplikasi web serta server Anda.
          </p>

          {/* Search Box */}
          <div className="relative mt-8">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-lp-ink/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik kata kunci pertanyaan (misal: 'nftables', 'Laravel', 'RAM', 'Lisensi')..."
              className="w-full rounded-xl border border-lp-line bg-lp-paper-2/40 py-2.5 pr-12 pl-10 font-mono text-xs text-lp-ink transition-colors placeholder:text-lp-ink/40 focus:border-lp-line-strong focus:outline-none sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer font-mono text-xs text-lp-ink/50 hover:text-lp-ink"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                    isSelected
                      ? "border-lp-orange/30 bg-lp-orange/10 font-semibold text-lp-orange dark:border-lp-yellow/30 dark:bg-lp-yellow/10 dark:text-lp-yellow"
                      : "border-lp-line bg-lp-paper-2/40 text-lp-ink/75 hover:bg-lp-paper-2 hover:text-lp-ink"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </header>

        {/* Action Bar (Expand/Collapse) */}
        <div className="mt-8 flex items-center justify-between text-xs">
          <span className="font-mono text-lp-ink/60">
            Menampilkan {filteredFaqs.length} dari {FAQ_LIST.length} pertanyaan
          </span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={expandAll}
              className="cursor-pointer text-lp-ink/70 hover:text-lp-ink hover:underline"
            >
              Buka Semua
            </button>
            <span className="text-lp-ink/30">&bull;</span>
            <button
              onClick={collapseAll}
              className="cursor-pointer text-lp-ink/70 hover:text-lp-ink hover:underline"
            >
              Tutup Semua
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-4 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-lp-line bg-lp-paper p-12 text-center shadow-xs">
              <AlertCircle className="mx-auto size-8 text-lp-ink/40" />
              <p className="mt-3 font-heading text-lg font-semibold text-lp-ink">
                Tidak ada pertanyaan yang sesuai dengan kata kunci pencarian.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
                className="mt-4 cursor-pointer rounded-lg border border-lp-line bg-lp-paper-2 px-4 py-2 font-mono text-xs font-medium text-lp-ink transition-colors hover:bg-lp-paper"
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
                    "overflow-hidden rounded-xl border border-lp-line bg-lp-paper shadow-xs transition-all",
                    isOpen && "border-lp-line-strong bg-lp-paper-2/20"
                  )}
                >
                  {/* Trigger Header */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full cursor-pointer items-start justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                        Q
                      </span>
                      <div className="space-y-1">
                        <h2 className="font-heading text-base font-semibold text-lp-ink sm:text-lg">
                          {faq.question}
                        </h2>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-lp-line bg-lp-paper-2/40 px-2 py-0.5 font-mono text-[10px] text-lp-ink/65"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "mt-1 flex size-6 shrink-0 items-center justify-center rounded-md border border-lp-line bg-lp-paper-2 text-lp-ink/60 transition-transform duration-200",
                        isOpen &&
                          "rotate-180 border-lp-orange/20 bg-lp-orange/10 text-lp-orange dark:border-lp-yellow/20 dark:bg-lp-yellow/10 dark:text-lp-yellow"
                      )}
                    >
                      <ChevronDown className="size-3.5" />
                    </div>
                  </button>

                  {/* Body Content */}
                  {isOpen && (
                    <div className="border-t border-lp-line px-5 pt-4 pb-6 sm:px-6">
                      <div className="max-w-prose space-y-3 font-sans text-sm leading-relaxed whitespace-pre-line text-lp-ink/80">
                        {faq.answer}
                      </div>

                      {/* Optional Code Snippet */}
                      {faq.codeSnippet && (
                        <div className="relative mt-4 overflow-hidden rounded-xl border border-lp-line bg-[#121210] p-3 text-[#eceae2]">
                          <div className="flex items-center justify-between border-b border-[rgba(236,234,226,0.1)] pb-1.5 font-mono text-[10px] text-[#eceae2]/60">
                            <span>TERMINAL EXECUTION</span>
                            <button
                              onClick={() =>
                                handleCopy(faq.id, faq.codeSnippet!)
                              }
                              className="inline-flex cursor-pointer items-center gap-1 rounded bg-[#1e1e1c] px-2 py-0.5 font-mono text-[10px] text-[#eceae2] hover:text-white"
                            >
                              {copiedSnippetId === faq.id ? (
                                <>
                                  <Check className="size-2.5 text-emerald-400" />
                                  <span className="text-emerald-400">
                                    Tersalin!
                                  </span>
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

        {/* Still Have Questions Banner matching Fumadocs */}
        <div className="mt-12 rounded-2xl border border-lp-line bg-lp-paper-2/40 p-6 text-center sm:p-8">
          <h3 className="font-heading text-lg font-semibold text-lp-ink sm:text-xl">
            Punya Pertanyaan Spesifik Terkait Infrastruktur Anda?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-lp-ink/75">
            Tim teknis dan komunitas Pasax siap membantu integrasi firewall,
            ruleset kustom, atau audit arsitektur keamanan server Anda.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
            <a
              href="https://github.com/pasax-dev"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper px-4 py-2 font-medium text-lp-ink shadow-xs transition-colors hover:bg-lp-paper-2"
            >
              <span>GitHub Discussions</span>
              <ExternalLink className="size-3.5 text-lp-ink/50" />
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-lg border border-lp-orange/30 bg-lp-orange/10 px-4 py-2 font-medium text-lp-orange shadow-xs transition-colors hover:bg-lp-orange/20 dark:border-lp-yellow/30 dark:bg-lp-yellow/10 dark:text-lp-yellow"
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
