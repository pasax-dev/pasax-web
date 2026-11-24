import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Server,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Scale,
  HelpCircle,
  BookOpen,
} from "lucide-react"
import { LegalNav } from "@/components/public/legal-nav"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Privacy Policy | Pasax Security Ecosystem",
  description:
    "Pelajari komitmen privasi Pasax Security: inspeksi Zero-Knowledge lokal, telemetri keluar terenkripsi mTLS 1.3, dan ketiadaan pelacak pihak ketiga.",
  keywords: [
    "Pasax Privacy Policy",
    "Security Telemetry Privacy",
    "Zero Knowledge Security",
    "Linux Node Privacy",
    "mTLS Data Encryption",
    "GDPR Compliance Security",
  ],
  alternates: {
    canonical: "https://pasax.web.id/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Pasax Security Ecosystem",
    description:
      "Transparent zero-knowledge security telemetry and minimal data retention across Sentinel daemons and Pasax Cloud.",
    url: "https://pasax.web.id/privacy",
    siteName: "Pasax Security",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Pasax Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Pasax Security Ecosystem",
    description:
      "Transparent zero-knowledge security telemetry across Pasax Sentinel and Cloud SOC.",
    images: ["/logo.png"],
  },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "18 November 2026"

  return (
    <div className="w-full max-w-full py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs">
          <Link
            href="/"
            className="text-lp-ink/60 transition-colors hover:text-lp-ink hover:underline"
          >
            Beranda
          </Link>
          <span className="text-lp-ink/30">/</span>
          <span className="text-lp-ink/75">Legal</span>
          <span className="text-lp-ink/30">/</span>
          <span className="font-semibold text-lp-ink">Privacy Policy</span>
        </div>

        {/* Legal Navigation Bar */}
        <LegalNav />

        {/* Header Block matching Fumadocs */}
        <header className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-lp-orange/20 bg-lp-orange/10 px-3 py-1 font-mono text-xs font-medium text-lp-orange dark:border-lp-yellow/20 dark:bg-lp-yellow/10 dark:text-lp-yellow">
              <ShieldCheck className="size-3.5" />
              <span>KOMITMEN PERLINDUNGAN PRIVASI DATA</span>
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-lp-ink/60">
              <Clock className="size-3.5" />
              <span>Terakhir diperbarui: {lastUpdated}</span>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-lp-ink sm:text-4xl lg:text-5xl">
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-lp-ink/75 sm:text-lg">
            Di <strong>Pasax Security</strong>, kami meyakini bahwa perlindungan
            keamanan tingkat tinggi tidak boleh mengorbankan privasi data Anda.
            Kami merancang arsitektur Pasax—mulai dari daemon Go kernel tingkat
            rendah hingga portal SOC—berdasarkan prinsip dasar{" "}
            <strong>Zero-Knowledge dan retensi data minimal</strong>.
          </p>

          {/* Quick Highlight Cards (TL;DR) */}
          <div className="mt-8 rounded-xl border border-lp-line bg-lp-paper-2/40 p-5">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-lp-ink/60 uppercase">
              RINGKASAN EKSEKUTIF (TL;DR)
            </span>
            <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              <div className="rounded-xl border border-lp-line bg-lp-paper p-4 shadow-xs">
                <div className="flex items-center gap-2 font-heading text-sm font-semibold text-lp-ink">
                  <Lock className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Nol Inspeksi Payload (Zero-Payload)</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-lp-ink/75">
                  Kami tidak pernah membaca, menyimpan, atau mentransmisikan
                  kredensial database, API key, maupun isi request HTTP aplikasi
                  web Anda.
                </p>
              </div>

              <div className="rounded-xl border border-lp-line bg-lp-paper p-4 shadow-xs">
                <div className="flex items-center gap-2 font-heading text-sm font-semibold text-lp-ink">
                  <Server className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
                  <span>Egress-Only mTLS 1.3</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-lp-ink/75">
                  Telemetri hanya keluar (outbound) lewat koneksi terenkripsi
                  mTLS 1.3. Server VPS Anda tidak membuka port listening inbound
                  tambahan.
                </p>
              </div>

              <div className="rounded-xl border border-lp-line bg-lp-paper p-4 shadow-xs">
                <div className="flex items-center gap-2 font-heading text-sm font-semibold text-lp-ink">
                  <EyeOff className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Tanpa Pelacak Iklan (No Trackers)</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-lp-ink/75">
                  Bebas dari pixel analitik pihak ketiga, tanpa profiling
                  perilaku personal, dan nol telemetri periklanan lintas situs.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="mt-8 space-y-6">
          {/* Section 1 */}
          <section className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                1
              </span>
              <h2 className="font-heading text-xl font-semibold text-lp-ink sm:text-2xl">
                Cakupan &amp; Identitas Pengelola Data
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-lp-ink/80">
              <p>
                Kebijakan Privasi ini berlaku untuk seluruh interaksi dengan
                perangkat lunak open-source Pasax, daemon{" "}
                <code>pasax-sentinel</code>, paket WAF{" "}
                <code>pasax/secure-monitor</code>, serta antarmuka web
                dokumentasi dan konsol.
              </p>
              <p>
                Data telemetri node dikelola oleh tim pengembang Pasax untuk
                keperluan agregasi daftar blokir ancaman global (Global Threat
                Blocklist) yang didistribusikan kembali secara terbuka demi
                melindungi seluruh komunitas server.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                2
              </span>
              <h2 className="font-heading text-xl font-semibold text-lp-ink sm:text-2xl">
                Data yang Diproses vs. Data yang TIDAK PERNAH Disentuh
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-lp-ink/80">
              <p>
                Kami memegang teguh prinsip transparansi radikal atas data apa
                saja yang diproses oleh sistem pertahanan:
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <h4 className="flex items-center gap-2 font-heading text-xs font-semibold text-emerald-700 uppercase dark:text-emerald-400">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>Data yang Diproses (Hanya Metadata):</span>
                  </h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed text-lp-ink/80">
                    <li>
                      Alamat IP penyerang yang terdeteksi melakukan brute force
                      / exploit injection.
                    </li>
                    <li>
                      Klasifikasi insiden (misal: <code>SQLI_BLOCKED</code>,{" "}
                      <code>SSH_BRUTE_FORCE</code>).
                    </li>
                    <li>
                      Timestamp waktu kejadian dan durasi pemblokiran nftables.
                    </li>
                    <li>
                      ID Node acak (UUID v4) dan versi daemon untuk keperluan
                      sinkronisasi ruleset.
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                  <h4 className="flex items-center gap-2 font-heading text-xs font-semibold text-rose-700 uppercase dark:text-rose-400">
                    <AlertTriangle className="size-4 shrink-0" />
                    <span>Data yang TIDAK PERNAH Disentuh:</span>
                  </h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed text-lp-ink/80">
                    <li>
                      Isi database, tabel MySQL/PostgreSQL, atau baris data
                      pelanggan.
                    </li>
                    <li>
                      Kredensial login pengguna sah, token sesi cookie, atau
                      auth header.
                    </li>
                    <li>
                      Body request HTTP yang valid milik pengunjung sah situs
                      Anda.
                    </li>
                    <li>
                      Kunci privat SSH, file sertifikat SSL internal, atau
                      environment variables (<code>.env</code>).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                3
              </span>
              <h2 className="font-heading text-xl font-semibold text-lp-ink sm:text-2xl">
                Arsitektur Zero-Knowledge &amp; Kriptografi mTLS 1.3
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-lp-ink/80">
              <p>
                Seluruh inspeksi regular expression, parsing Abstract Syntax
                Tree (AST) webshell, dan verifikasi hash inotify berjalan lokal
                100% pada CPU server Anda. Tidak ada data yang dikirimkan ke
                cloud pihak ketiga untuk diproses atau di-inferensikan.
              </p>
              <p>
                Koneksi antara VPS node dan pusat agregasi ancaman Pasax
                diamankan dengan Mutual Transport Layer Security (mTLS) berbasis
                cipher suites modern TLS 1.3 (
                <code>TLS_AES_256_GCM_SHA384</code>) dengan autentikasi
                sertifikat dua arah untuk mencegah serangan Man-in-the-Middle
                (MitM).
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                4
              </span>
              <h2 className="font-heading text-xl font-semibold text-lp-ink sm:text-2xl">
                Kebijakan Retensi &amp; Penghapusan Data
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-lp-ink/80">
              <p>Kami menerapkan retensi otomatis yang ketat:</p>
              <ul className="list-inside list-disc space-y-1.5 pl-2">
                <li>
                  Log insiden IP penyerang pada telemetry broker secara otomatis
                  kedaluwarsa dan dihapus permanen dalam waktu{" "}
                  <strong>30 hari</strong>.
                </li>
                <li>
                  Daftar IP ban aktif di level nftables node lokal memiliki masa
                  karantina yang dapat Anda sesuaikan sendiri di file
                  konfigurasi (default: 3600 detik).
                </li>
                <li>
                  Jika Anda menghapus instalasi <code>pasax-sentinel</code> atau
                  menonaktifkan API token di konsol web, seluruh histori
                  telemetri node terkait akan langsung di-purge dari sistem
                  kami.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                5
              </span>
              <h2 className="font-heading text-xl font-semibold text-lp-ink sm:text-2xl">
                Kepatuhan Regulasi &amp; Kontak Privasi
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-lp-ink/80">
              <p>
                Jika Anda memiliki pertanyaan spesifik terkait pemrosesan
                telemetri, permintaan penghapusan data (right to erasure), atau
                audit kepatuhan regulasi data pribadi, silakan hubungi tim kami:
              </p>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <a
                  href="mailto:privacy@pasax.web.id"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3.5 py-2 font-medium text-lp-ink transition-colors hover:bg-lp-paper-2"
                >
                  <span>privacy@pasax.web.id</span>
                </a>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper px-3.5 py-2 font-medium text-lp-ink shadow-xs transition-colors hover:bg-lp-paper-2"
                >
                  <span>Lihat Terms of Service</span>
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper px-3.5 py-2 font-medium text-lp-ink shadow-xs transition-colors hover:bg-lp-paper-2"
                >
                  <span>Buka FAQ</span>
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Cross Navigation */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-lp-line pt-6 text-sm font-medium">
          <Link
            href="/terms"
            className="inline-flex items-center gap-1.5 text-lp-ink/75 transition-colors hover:text-lp-ink hover:underline"
          >
            <span>Baca Ketentuan Layanan (Terms of Service)</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-lp-ink/75 transition-colors hover:text-lp-ink hover:underline"
          >
            <span>Lihat Jawaban Pertanyaan Umum (FAQ)</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
