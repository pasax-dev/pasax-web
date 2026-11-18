import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import {
  FileText,
  ShieldAlert,
  Scale,
  Terminal,
  Server,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Code2,
  Lock,
  HelpCircle,
  BookOpen,
} from "lucide-react"
import { LegalNav } from "@/components/public/legal-nav"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Terms of Service | Pasax Security Ecosystem",
  description:
    "Ketentuan layanan, kebijakan penggunaan wajar (AUP), lisensi open-source MIT, dan tanggung jawab hak akses root untuk ekosistem keamanan Pasax.",
  keywords: [
    "Pasax Terms of Service",
    "Security Software Terms",
    "Acceptable Use Policy",
    "MIT Open Source License",
    "Linux Node Security Disclaimer",
    "Kernel Daemon Terms",
  ],
  alternates: {
    canonical: "https://pasax.is-a.dev/terms",
  },
  openGraph: {
    title: "Terms of Service | Pasax Security Ecosystem",
    description:
      "Transparent terms and responsible security use guidelines for Pasax Sentinel, Shield WAF, and Cloud SOC.",
    url: "https://pasax.is-a.dev/terms",
    siteName: "Pasax Security",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Pasax Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Pasax Security Ecosystem",
    description:
      "Terms, conditions, and responsible use policies for Pasax Security Suite.",
    images: ["/logo.png"],
  },
}

export default function TermsOfServicePage() {
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
          <span className="font-semibold text-lp-ink">Terms of Service</span>
        </div>

        {/* Legal Navigation Bar */}
        <LegalNav />

        {/* Header Block matching Fumadocs */}
        <header className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-lp-orange/20 bg-lp-orange/10 px-3 py-1 font-mono text-xs font-medium text-lp-orange dark:border-lp-yellow/20 dark:bg-lp-yellow/10 dark:text-lp-yellow">
              <Scale className="size-3.5" />
              <span>LEGAL AGREEMENT &bull; PASAX ECOSYSTEM</span>
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-lp-ink/60">
              <Clock className="size-3.5" />
              <span>Terakhir diperbarui: {lastUpdated}</span>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-lp-ink sm:text-4xl lg:text-5xl">
            Ketentuan Layanan (Terms of Service)
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-lp-ink/75 sm:text-lg">
            Harap baca Ketentuan Layanan ini dengan saksama sebelum memasang{" "}
            <strong>pasax-sentinel</strong>, mengintegrasikan paket Composer{" "}
            <strong>pasax/secure-monitor</strong>, atau menggunakan dashboard{" "}
            <strong>Pasax Cloud SOC</strong>. Dengan mengunduh, mengonfigurasi,
            atau mengoperasikan komponen dari ekosistem Pasax, Anda menyatakan
            setuju untuk terikat oleh ketentuan di bawah ini.
          </p>

          {/* Ringkasan Eksekutif (TL;DR Cards) */}
          <div className="mt-8 rounded-xl border border-lp-line bg-lp-paper-2/40 p-5">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-lp-ink/60 uppercase">
              RINGKASAN EKSEKUTIF (TL;DR)
            </span>
            <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              <div className="rounded-xl border border-lp-line bg-lp-paper p-4 shadow-xs">
                <div className="flex items-center gap-2 font-heading text-sm font-semibold text-lp-ink">
                  <ShieldAlert className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>Hanya Tujuan Defensif</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-lp-ink/75">
                  Pasax hanya boleh digunakan untuk perlindungan server sah,
                  penolakan serangan siber, dan audit keamanan yang memiliki
                  izin resmi.
                </p>
              </div>

              <div className="rounded-xl border border-lp-line bg-lp-paper p-4 shadow-xs">
                <div className="flex items-center gap-2 font-heading text-sm font-semibold text-lp-ink">
                  <Code2 className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
                  <span>Kode Terbuka MIT</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-lp-ink/75">
                  Paket Sentinel dan WAF 100% open source di bawah lisensi MIT.
                  Anda bebas mengaudit, memodifikasi, dan menggunakannya untuk
                  kebutuhan komersial.
                </p>
              </div>

              <div className="rounded-xl border border-lp-line bg-lp-paper p-4 shadow-xs">
                <div className="flex items-center gap-2 font-heading text-sm font-semibold text-lp-ink">
                  <Terminal className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Kedaulatan Root Linux</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-lp-ink/75">
                  Operasi kernel nftables dan penguncian berkas berada
                  sepenuhnya di bawah kendali administratif pemilik VPS host
                  Anda.
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
                Persetujuan &amp; Kewenangan Operasional
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-lp-ink/80">
              <p>
                Dengan membuat akun pada portal, membuat token node telemetri,
                atau mengunduh dan mengeksekusi biner{" "}
                <code>pasax-sentinel</code> pada virtual private server (VPS)
                maupun bare-metal host, Anda menyatakan bahwa:
              </p>
              <ul className="list-inside list-disc space-y-1.5 pl-2">
                <li>
                  Anda memiliki wewenang hukum penuh untuk mengelola, memasang
                  firewall, dan memantau lalu lintas jaringan pada mesin target.
                </li>
                <li>
                  Anda berusia sekurang-kurangnya 18 tahun atau memiliki
                  kecakapan hukum di wilayah yurisdiksi Anda.
                </li>
                <li>
                  Anda akan menggunakan seluruh komponen keamanan Pasax selaras
                  dengan ketentuan hukum siber, privasi data, dan regulasi yang
                  berlaku.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                2
              </span>
              <h2 className="font-heading text-xl font-semibold text-lp-ink sm:text-2xl">
                Kebijakan Penggunaan yang Diizinkan (AUP)
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-lp-ink/80">
              <p>
                Pasax Security menyediakan inspeksi paket berkecepatan tinggi
                via nftables, instrumentasi honeypot, dan pemantauan integritas
                berkas kernel via inotify. Pengguna{" "}
                <strong>DILARANG KERAS</strong> untuk:
              </p>
              <div className="space-y-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs">
                <div className="flex items-center gap-2 font-semibold text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>Aktivitas yang Dilarang (Prohibited Activities):</span>
                </div>
                <ul className="list-inside list-disc space-y-1.5 pl-1 leading-relaxed text-lp-ink/85">
                  <li>
                    Memasang Pasax pada host, server cloud, atau jaringan pihak
                    ketiga tanpa izin kepemilikan tertulis yang sah.
                  </li>
                  <li>
                    Memanfaatkan endpoint telemetri Pasax untuk meluncurkan
                    serangan Distributed Denial of Service (DDoS) atau
                    memalsukan reputasi blocklist ancaman global.
                  </li>
                  <li>
                    Melakukan pemalsuan (spoofing) token sertifikat identitas
                    mTLS node untuk menyadap telemetri server lain.
                  </li>
                  <li>
                    Melakukan reverse proxy bypass atau eksploitasi yang
                    bertujuan melumpuhkan mekanisme rate-limiting Pasax Cloud
                    API.
                  </li>
                </ul>
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
                Hak Akses Root &amp; Subsistem Kernel Linux
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-lp-ink/80">
              <p>
                Karena <code>pasax-sentinel</code> berinteraksi langsung dengan
                subsistem kernel Linux (tabel paket <code>nftables</code> dan
                hook filesystem <code>inotify</code>), daemon beroperasi sebagai
                layanan <code>systemd</code> dengan kapabilitas sistem istimewa.
              </p>
              <p>Anda memahami dan menyepakati bahwa:</p>
              <ul className="list-inside list-disc space-y-1.5 pl-2">
                <li>
                  Anda bertanggung jawab penuh untuk meninjau definisi aturan
                  firewall (<code>pasax-rules.yml</code>) sebelum mengaktifkan
                  mode pemblokiran otomatis.
                </li>
                <li>
                  Meskipun Pasax menyediakan safeguard otomatis (seperti
                  pengecualian port SSH otomatis dan fallback whitelist), Anda
                  tetap berkewajiban mempertahankan akses konsol out-of-band ke
                  VPS Anda untuk mencegah risiko lockout yang tidak disengaja.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                4
              </span>
              <h2 className="font-heading text-xl font-semibold text-lp-ink sm:text-2xl">
                Lisensi Open Source MIT vs. Cloud SOC Platform
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-lp-ink/80">
              <p>Ekosistem software Pasax terdiri dari komponen mandiri:</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 shadow-xs">
                  <span className="inline-block rounded-md border border-lp-line bg-lp-paper px-2 py-0.5 font-mono text-[10px] font-medium text-lp-ink">
                    MIT Open Source License
                  </span>
                  <h4 className="mt-2 font-heading text-sm font-semibold text-lp-ink">
                    Sentinel &amp; Secure Monitor Packages
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-lp-ink/75">
                    Kode sumber <code>pasax-sentinel</code> dan{" "}
                    <code>pasax/secure-monitor</code> bebas diakses,
                    dimodifikasi, dan didistribusikan ulang sesuai izin lisensi
                    MIT.
                  </p>
                </div>

                <div className="rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 shadow-xs">
                  <span className="inline-block rounded-md border border-lp-line bg-lp-paper px-2 py-0.5 font-mono text-[10px] font-medium text-lp-ink">
                    Community Control Plane
                  </span>
                  <h4 className="mt-2 font-heading text-sm font-semibold text-lp-ink">
                    Pasax Cloud SOC Platform
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-lp-ink/75">
                    Dashboard cloud terpusat, Threat Map 3D, dan agregasi data
                    blocklist global disediakan untuk komunitas developer
                    berdasarkan kuota penggunaan wajar (*fair-use*).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                5
              </span>
              <h2 className="font-heading text-xl font-semibold text-lp-ink sm:text-2xl">
                Batasan Tanggung Jawab &amp; Jaminan (Disclaimer)
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-lp-ink/80">
              <p className="font-mono text-xs text-lp-ink/60 uppercase">
                DISEDIAKAN &quot;SEBAGAIMANA ADANYA&quot; (AS IS) TANPA JAMINAN
                MUTLAK
              </p>
              <p>
                Sejauh diizinkan oleh hukum yang berlaku, perangkat lunak Pasax
                dan platform Cloud SOC disediakan atas dasar{" "}
                <strong>&quot;AS IS&quot; dan &quot;AS AVAILABLE&quot;</strong>,
                tanpa jaminan tersirat atas kelayakan dagang, kecocokan untuk
                tujuan tertentu, atau bebas dari galat teknis.
              </p>
              <p>
                Meskipun Pasax menerapkan intersepsi paket di bawah 0.2ms dan
                penguncian berkas otonom,{" "}
                <strong>
                  tidak ada sistem keamanan di dunia yang dapat menjamin
                  kekebalan 100%
                </strong>{" "}
                terhadap eksploitasi zero-day baru yang belum teridentifikasi,
                pembobolan fisik server, atau kegagalan upstream ISP.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-2xl border border-lp-line bg-lp-paper p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg border border-lp-line bg-lp-paper-2 font-mono text-xs font-bold text-lp-ink">
                6
              </span>
              <h2 className="font-heading text-xl font-semibold text-lp-ink sm:text-2xl">
                Pembaruan Ketentuan &amp; Kontak Legal
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-lp-ink/80">
              <p>
                Kami berhak memperbarui Ketentuan Layanan ini sewaktu-waktu
                untuk menyesuaikan perkembangan regulasi siber dan penambahan
                modul sistem. Tanggal pembaruan terakhir akan selalu dicantumkan
                di bagian atas halaman ini.
              </p>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <a
                  href="mailto:legal@pasax.is-a.dev"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3.5 py-2 font-medium text-lp-ink transition-colors hover:bg-lp-paper-2"
                >
                  <span>legal@pasax.is-a.dev</span>
                </a>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper px-3.5 py-2 font-medium text-lp-ink shadow-xs transition-colors hover:bg-lp-paper-2"
                >
                  <span>Lihat Kebijakan Privasi</span>
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper px-3.5 py-2 font-medium text-lp-ink shadow-xs transition-colors hover:bg-lp-paper-2"
                >
                  <span>Baca FAQ</span>
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Cross Navigation */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-lp-line pt-6 text-sm font-medium">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-lp-ink/75 transition-colors hover:text-lp-ink hover:underline"
          >
            <span>Baca Kebijakan Privasi &amp; Zero-Knowledge</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/changelog"
            className="inline-flex items-center gap-1.5 text-lp-ink/75 transition-colors hover:text-lp-ink hover:underline"
          >
            <span>Lihat Catatan Rilis &amp; Changelog</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
