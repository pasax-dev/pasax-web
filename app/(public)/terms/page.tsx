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
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
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
    description: "Terms, conditions, and responsible use policies for Pasax Security Suite.",
    images: ["/logo.png"],
  },
}

export default function TermsOfServicePage() {
  const lastUpdated = "18 November 2026"
  const version = "1.8.0"

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
          <span className="text-foreground">Legal</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-main">Terms of Service</span>
        </div>

        {/* Legal Navigation Bar */}
        <LegalNav />

        {/* Header Block */}
        <div className="rounded-base border-2 border-border bg-card p-6 md:p-10 shadow-[6px_6px_0px_0px_var(--border)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)]">
              <Scale className="size-4 text-main" />
              <span>LEGAL AGREEMENT &bull; v{version}</span>
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <span>Terakhir diperbarui: {lastUpdated}</span>
            </div>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg text-pretty">
            Harap baca Ketentuan Layanan ini dengan saksama sebelum memasang <strong>pasax-sentinel</strong>, mengintegrasikan <strong>pasax/secure-monitor</strong>, atau menggunakan dashboard <strong>Pasax Cloud SOC</strong>. Dengan mengunduh, mengonfigurasi, atau mengoperasikan komponen dari ekosistem Pasax, Anda menyatakan setuju untuk terikat oleh ketentuan di bawah ini.
          </p>

          {/* Ringkasan Eksekutif (TL;DR Bilingual Cards) */}
          <div className="mt-8 rounded-base border-2 border-border bg-secondary-background/80 p-5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              RINGKASAN EKSEKUTIF (TL;DR)
            </span>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-base border-2 border-border bg-card p-4 shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                  <ShieldAlert className="size-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Hanya Tujuan Defensif</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-foreground/75 text-pretty">
                  Pasax hanya boleh digunakan untuk perlindungan server sah, penolakan serangan siber, dan audit keamanan yang memiliki izin resmi.
                </p>
              </div>

              <div className="rounded-base border-2 border-border bg-card p-4 shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                  <Code2 className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Kode Terbuka MIT</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-foreground/75 text-pretty">
                  Paket Sentinel dan WAF 100% open source di bawah lisensi MIT. Anda bebas mengaudit, memodifikasi, dan menggunakannya untuk kebutuhan komersial.
                </p>
              </div>

              <div className="rounded-base border-2 border-border bg-card p-4 shadow-[2px_2px_0px_0px_var(--border)]">
                <div className="flex items-center gap-2 font-heading text-sm font-black text-foreground">
                  <Terminal className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Kedaulatan Root Linux</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-foreground/75 text-pretty">
                  Operasi kernel nftables dan penguncian berkas berada sepenuhnya di bawah kendali administratif pemilik VPS host Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-12 space-y-10">
          {/* Section 1 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                1
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Persetujuan &amp; Kewenangan Operasional
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-foreground/85 text-pretty">
              <p>
                Dengan membuat akun pada portal <code>https://pasax.is-a.dev</code>, membuat token node telemetri, atau mengunduh dan mengeksekusi biner <code>pasax-sentinel</code> pada virtual private server (VPS) maupun bare-metal host, Anda menyatakan bahwa:
              </p>
              <ul className="list-inside list-disc space-y-1.5 pl-2 font-medium">
                <li>Anda memiliki wewenang hukum penuh untuk mengelola, memasang firewall, dan memantau lalu lintas jaringan pada mesin target.</li>
                <li>Anda berusia sekurang-kurangnya 18 tahun atau memiliki kecakapan hukum di wilayah yurisdiksi Anda.</li>
                <li>Anda akan menggunakan seluruh komponen keamanan Pasax selaras dengan ketentuan hukum siber, privasi data, dan undang-undang ITE yang berlaku.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                2
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Kebijakan Penggunaan yang Diizinkan (AUP)
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-foreground/85 text-pretty">
              <p>
                Pasax Security menyediakan inspeksi paket berkecepatan tinggi via nftables, instrumentasi honeypot, dan pemantauan integritas berkas kernel via inotify. Pengguna <strong>DILARANG KERAS</strong> untuk:
              </p>
              <div className="space-y-2 rounded-base border-2 border-rose-500/50 bg-rose-500/10 p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>Aktivitas yang Dilarang (Prohibited Activities):</span>
                </div>
                <ul className="list-inside list-disc space-y-1.5 pl-1 text-foreground/90">
                  <li>Memasang Pasax pada host, server cloud, atau jaringan pihak ketiga tanpa izin kepemilikan tertulis yang sah.</li>
                  <li>Memanfaatkan endpoint telemetri Pasax untuk meluncurkan serangan Distributed Denial of Service (DDoS) atau memalsukan reputasi blocklist ancaman global.</li>
                  <li>Melakukan pemalsuan (spoofing) token sertifikat identitas mTLS node untuk menyadap telemetri server lain.</li>
                  <li>Melakukan reverse proxy bypass atau eksploitasi yang bertujuan melumpuhkan mekanisme rate-limiting Pasax Cloud API.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                3
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Hak Akses Root &amp; Subsistem Kernel Linux
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-foreground/85 text-pretty">
              <p>
                Karena <code>pasax-sentinel</code> berinteraksi langsung dengan subsistem kernel Linux (tabel paket <code>nftables</code> dan hook filesystem <code>inotify</code>), daemon beroperasi sebagai layanan <code>systemd</code> dengan kapabilitas sistem istimewa.
              </p>
              <p>
                Anda memahami dan menyepakati bahwa:
              </p>
              <ul className="list-inside list-disc space-y-1.5 pl-2 font-medium">
                <li>Anda bertanggung jawab penuh untuk meninjau definisi aturan firewall (<code>pasax-rules.yml</code>) sebelum mengaktifkan mode pemblokiran otomatis.</li>
                <li>Meskipun Pasax menyediakan safeguard otomatis (seperti pengecualian port SSH otomatis dan fallback whitelist), Anda tetap berkewajiban mempertahankan akses konsol out-of-band ke VPS Anda untuk mencegah risiko lockout yang tidak disengaja.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                4
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Lisensi Open Source MIT vs. Cloud SOC Platform
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-foreground/85 text-pretty">
              <p>
                Ekosistem software Pasax terdiri dari dua pilar:
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-base border-2 border-border bg-secondary-background p-4 shadow-[2px_2px_0px_0px_var(--border)]">
                  <Badge variant="outline" className="font-mono text-[10px] font-bold">
                    MIT Open Source License
                  </Badge>
                  <h4 className="mt-2 font-heading text-sm font-black text-foreground">
                    Sentinel &amp; Secure Monitor Packages
                  </h4>
                  <p className="mt-1 text-xs text-foreground/75 leading-relaxed text-pretty">
                    Kode sumber <code>pasax-sentinel</code> dan <code>pasax/secure-monitor</code> bebas diakses, dimodifikasi, dan didistribusikan ulang sesuai izin lisensi MIT.
                  </p>
                </div>

                <div className="rounded-base border-2 border-border bg-secondary-background p-4 shadow-[2px_2px_0px_0px_var(--border)]">
                  <Badge variant="outline" className="font-mono text-[10px] font-bold">
                    Community Control Plane
                  </Badge>
                  <h4 className="mt-2 font-heading text-sm font-black text-foreground">
                    Pasax Cloud SOC Platform
                  </h4>
                  <p className="mt-1 text-xs text-foreground/75 leading-relaxed text-pretty">
                    Dashboard cloud terpusat, Threat Map 3D, dan agregasi data blocklist global disediakan untuk komunitas developer berdasarkan kuota penggunaan wajar (*fair-use*).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-base border-2 border-border bg-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                5
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Batasan Tanggung Jawab &amp; Jaminan (Disclaimer)
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-foreground/85 text-pretty">
              <p className="font-mono text-xs uppercase text-muted-foreground">
                DISEDIAKAN &quot;SEBAGAIMANA ADANYA&quot; (AS IS) TANPA JAMINAN MUTLAK
              </p>
              <p>
                Sejauh diizinkan oleh hukum yang berlaku, perangkat lunak Pasax dan platform Cloud SOC disediakan atas dasar <strong>&quot;AS IS&quot; dan &quot;AS AVAILABLE&quot;</strong>, tanpa jaminan tersirat atas kelayakan dagang, kecocokan untuk tujuan tertentu, atau bebas dari galat teknis.
              </p>
              <p>
                Meskipun Pasax menerapkan intersepsi paket di bawah 0.2ms dan penguncian berkas otonom, <strong>tidak ada sistem keamanan di dunia yang dapat menjamin kekebalan 100%</strong> terhadap eksploitasi zero-day baru yang belum teridentifikasi, pembobolan fisik server, atau kegagalan upstream ISP.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-base border-2 border-border bg-card p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-main font-mono text-sm font-black text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                6
              </span>
              <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
                Pembaruan Ketentuan &amp; Kontak Legal
              </h2>
            </div>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-foreground/85 text-pretty">
              <p>
                Kami berhak memperbarui Ketentuan Layanan ini sewaktu-waktu untuk menyesuaikan perkembangan regulasi siber dan penambahan modul sistem. Tanggal pembaruan terakhir akan selalu dicantumkan di bagian atas halaman ini.
              </p>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold">
                <a
                  href="mailto:legal@pasax.is-a.dev"
                  className={cn(
                    buttonVariants({ variant: "neutral", size: "sm" }),
                    "border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
                  )}
                >
                  <span>legal@pasax.is-a.dev</span>
                </a>
                <Link
                  href="/privacy"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
                  )}
                >
                  <span>Lihat Kebijakan Privasi</span>
                </Link>
                <Link
                  href="/faq"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]"
                  )}
                >
                  <span>Baca FAQ</span>
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Cross Navigation */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t-2 border-border pt-6 font-heading text-sm font-bold">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-main hover:underline"
          >
            <span>Baca Kebijakan Privasi &amp; Zero-Knowledge</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/changelog"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-main hover:underline"
          >
            <span>Lihat Catatan Rilis &amp; Changelog</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
