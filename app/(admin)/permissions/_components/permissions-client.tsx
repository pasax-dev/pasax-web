"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ShieldCheck,
  Server,
  Code2,
  Cpu,
  Users,
  Key,
  ShieldAlert,
  HardDrive,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  Terminal,
  Activity,
  Eye,
} from "lucide-react"

interface PermissionsClientProps {
  currentRole: string
  userCount: number
  nodeCount: number
}

type RoleTab = "admin" | "programmer" | "devops" | "support"

interface RoleDetail {
  id: RoleTab
  title: string
  badgeText: string
  badgeColor: string
  targetUser: string
  philosophy: string
  scope: string
  canDo: { title: string; desc: string; icon: any }[]
  cannotDo: { title: string; desc: string }[]
  accessScopeText: string
}

const roleDetails: Record<RoleTab, RoleDetail> = {
  admin: {
    id: "admin",
    title: "Administrator Armada (Tenant Owner / Admin)",
    badgeText: "HAK AKSES PENUH",
    badgeColor: "bg-main text-black border-main",
    targetUser: "Pemilik Akun yang Mendaftar di Pasak Suite",
    philosophy:
      "Setiap pengguna yang mendaftar mandiri otomatis berstatus Admin. Memegang otoritas penuh atas armada server VPS, lisensi, penugasan tim programmer, dan perizinan mitigasi cyber.",
    scope: "Seluruh Armada Node VPS & Tim",
    accessScopeText: "Monitoring 100% Seluruh Node VPS yang Ada",
    canDo: [
      {
        title: "Monitoring SELURUH Node VPS Armada",
        desc: "Memantau performa CPU, RAM, Disk, Uptime, driver nftables, dan status drop kernel pada seluruh node tanpa batasan.",
        icon: Server,
      },
      {
        title: "Membuat & Mengatur Akun Tim (Programmer & Maintainer)",
        desc: "Membuatkan akun untuk programmer aplikasi dan teknisi maintainer VPS, serta menentukan server mana yang boleh mereka akses.",
        icon: Users,
      },
      {
        title: "Manajemen Kunci Lisensi & Siklus Uji Coba 14 Hari",
        desc: "Melihat token lisensi produksi (psk_live_...), memantau sisa hari evaluasi Pro Trial, serta meng-upgrade ke Enterprise.",
        icon: Key,
      },
      {
        title: "Kendali Penuh Firewall Kernel & Crowd Defense",
        desc: "Melakukan pemblokiran manual IP berbahaya, membuka blokir, mengecek sinkronisasi intelijen global, dan inspeksi bukti forensik.",
        icon: ShieldAlert,
      },
      {
        title: "Pendaftaran & Penghapusan Node Server",
        desc: "Men-generate perintah instalasi one-line agen Sentinel, mendaftarkan VPS baru, dan me-remove node dari kluster.",
        icon: Terminal,
      },
    ],
    cannotDo: [
      {
        title: "Mengakses Data Pribadi Multi-Tenant Lain",
        desc: "Isolasi data antar organisasi strictly terpisah demi kepatuhan kedaulatan data UU PDP No. 27/2022.",
      },
    ],
  },
  programmer: {
    id: "programmer",
    title: "Programmer Aplikasi (Web Developer L7)",
    badgeText: "AKSES LAYER APLIKASI",
    badgeColor:
      "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500",
    targetUser: "Programmer / Developer yang Membangun & Mengelola Web di VPS",
    philosophy:
      "Dibuatkan oleh Admin untuk menangani kode aplikasi, integrasi REST API, framework web (Laravel, Express, dsb), penanganan celah keamanan L7 (SQLi/XSS/RCE), dan simulasi kerentanan.",
    scope: "Node VPS yang Ditugaskan oleh Admin",
    accessScopeText: "Hanya Node VPS yang Ditugaskan Admin",
    canDo: [
      {
        title: "Monitoring Node VPS yang Ditugaskan",
        desc: "Melihat status operasional server tempat aplikasi mereka berjalan untuk memastikan kesiapan hosting web.",
        icon: Server,
      },
      {
        title: "Inspeksi Log Serangan Web L7 Seketika",
        desc: "Menelaah upaya penyerangan injeksi SQL, XSS, RCE, dan bypass autentikasi yang diblokir oleh WAF pada aplikasinya.",
        icon: Code2,
      },
      {
        title: "Panduan Integrasi WAF & Token Aplikasi",
        desc: "Menyalin snippet konfigurasi .env, middleware pengamanan, dan perintah artisan pasax:sentinel untuk aplikasi lokal.",
        icon: Terminal,
      },
      {
        title: "Uji Coba & Simulasi Penanganan Serangan",
        desc: "Melakukan pengetesan payload uji pada rute CRUD web untuk memverifikasi proteksi WAF bekerja tanpa false-positive.",
        icon: Activity,
      },
    ],
    cannotDo: [
      {
        title: "Menghapus Node Server atau Lisensi Induk",
        desc: "Programmer tidak memiliki izin untuk menghapus VPS dari sistem atau mengubah paket langganan organisasi.",
      },
      {
        title: "Mengelola Pengguna Lain",
        desc: "Tidak dapat menambah, mengedit, atau mencabut akses anggota tim lainnya.",
      },
      {
        title: "Mengakses VPS yang Tidak Ditugaskan",
        desc: "Hanya server yang dialokasikan oleh Admin yang dapat dilihat dan dimonitor.",
      },
    ],
  },
  devops: {
    id: "devops",
    title: "Server Maintainer (DevOps / Linux SysAdmin L3/L4)",
    badgeText: "AKSES INFRASTRUKTUR & KERNEL",
    badgeColor:
      "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500",
    targetUser:
      "Teknisi / SysAdmin yang Merawat OS, Nginx, & Keamanan Kernel VPS",
    philosophy:
      "Dibuatkan oleh Admin untuk memastikan server Linux tetap sehat, daemon Sentinel berjalan prima, aturan firewall kernel aktif, serta mengawasi peringatan integritas berkas (FIM).",
    scope: "Node VPS yang Ditugaskan oleh Admin (atau Semua Infra)",
    accessScopeText: "Node VPS & Spesifikasi Hardware Kernel",
    canDo: [
      {
        title: "Monitoring Kesehatan Performa Hardware VPS",
        desc: "Memantau beban CPU, konsumsi RAM, utilisasi Disk, latensi jaringan, dan uptime server secara terperinci.",
        icon: HardDrive,
      },
      {
        title: "Pemantauan Status Daemon Sentinel & Firewall Kernel",
        desc: "Mengecek kesiapan soket lokal /run/pasax/agent.sock, tabel nftables inet pasax, dan statistik drop paket jaringan.",
        icon: Cpu,
      },
      {
        title: "Penanganan Alert Integritas Berkas (FIM)",
        desc: "Memantau peringatan saat berkas rahasia .env dimodifikasi tanpa izin dan memastikan izin berkas otomatis dipulihkan.",
        icon: ShieldAlert,
      },
      {
        title: "Pengecekan Diagnostik & Perintah Ping Agen",
        desc: "Melakukan verifikasi diagnostik cepat pada daemon untuk memastikan sistem pertahanan selalu siap.",
        icon: Terminal,
      },
    ],
    cannotDo: [
      {
        title: "Mengubah Lisensi atau Paket Tagihan",
        desc: "Tidak memiliki hak akses terhadap tagihan, upgrade paket langganan, atau token master lisensi.",
      },
      {
        title: "Menambah atau Menghapus Akun Tim Lain",
        desc: "Wewenang pengelolaan user dipegang sepenuhnya oleh Admin armada.",
      },
    ],
  },
  support: {
    id: "support",
    title: "Staff Teknis & Pengawas Operasional (Support SOC)",
    badgeText: "AKSES OPERASIONAL TELEMETRI",
    badgeColor:
      "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500",
    targetUser: "Operator Pengawas yang Bertugas Memantau Layanan Harian",
    philosophy:
      "Bertugas memantau telemetri insiden, memeriksa sertifikat domain SSL, serta memberikan pendampingan teknis jika terjadi anomali pada aplikasi.",
    scope: "Telemetri Publik & Pemantauan Insiden",
    accessScopeText: "Laporan Telemetri & Status Sertifikat SSL",
    canDo: [
      {
        title: "Monitoring Feed Insiden Serangan Terpusat",
        desc: "Melihat aliran peringatan insiden keamanan yang masuk dari seluruh node VPS.",
        icon: Eye,
      },
      {
        title: "Pemeriksaan Masa Berlaku Sertifikat SSL/TLS Domain",
        desc: "Memastikan domain layanan web terlindungi dan sertifikat TLS tidak kedaluwarsa.",
        icon: Globe,
      },
      {
        title: "Pengamatan Peta Ancaman Global 3D",
        desc: "Menganalisis tren asal negara penyerang melalui visualisasi radar taktis 3D.",
        icon: Activity,
      },
    ],
    cannotDo: [
      {
        title: "Melakukan Perubahan Konfigurasi Server",
        desc: "Hanya memiliki hak akses baca (read-only) untuk kebutuhan pengawasan.",
      },
      {
        title: "Membuat User atau Mengatur Lisensi",
        desc: "Dibatasi dari seluruh aksi administratif dan billing.",
      },
    ],
  },
}

interface MatrixRow {
  category: string
  feature: string
  admin: "YES" | "LIMITED" | "NO"
  programmer: "YES" | "LIMITED" | "NO"
  devops: "YES" | "LIMITED" | "NO"
  support: "YES" | "LIMITED" | "NO"
  note: string
}

const matrixData: MatrixRow[] = [
  {
    category: "Armada VPS & Node Monitoring",
    feature: "Monitoring SEMUA Node VPS Armada",
    admin: "YES",
    programmer: "LIMITED",
    devops: "YES",
    support: "LIMITED",
    note: "Admin memonitor 100% node, programmer hanya VPS aplikasi terkait.",
  },
  {
    category: "Armada VPS & Node Monitoring",
    feature: "Pendaftaran Node VPS Baru (One-Line Installer)",
    admin: "YES",
    programmer: "NO",
    devops: "YES",
    support: "NO",
    note: "Men-generate perintah instalasi dan mengintegrasikan agen Sentinel.",
  },
  {
    category: "Armada VPS & Node Monitoring",
    feature: "Hapus / Decommission Node Server dari Sistem",
    admin: "YES",
    programmer: "NO",
    devops: "NO",
    support: "NO",
    note: "Hanya Admin pemilik armada yang berhak menghapus node.",
  },
  {
    category: "Armada VPS & Node Monitoring",
    feature: "Alokasi / Penugasan VPS ke Programmer & Maintainer",
    admin: "YES",
    programmer: "NO",
    devops: "NO",
    support: "NO",
    note: "Menentukan user mana yang bertanggung jawab atas VPS tertentu.",
  },
  {
    category: "Manajemen Tim & Pengguna",
    feature: "Membuat Akun Anggota Tim (Programmer & DevOps)",
    admin: "YES",
    programmer: "NO",
    devops: "NO",
    support: "NO",
    note: "Admin membuat kredensial tim untuk memelihara server dan kode.",
  },
  {
    category: "Manajemen Tim & Pengguna",
    feature: "Ubah Peran & Cabut Akses Pengguna Tim",
    admin: "YES",
    programmer: "NO",
    devops: "NO",
    support: "NO",
    note: "Kendali status aktif/nonaktif akun tim dipegang oleh Admin.",
  },
  {
    category: "Manajemen Tim & Pengguna",
    feature: "Melihat Daftar Anggota Tim & Penugasan VPS",
    admin: "YES",
    programmer: "LIMITED",
    devops: "LIMITED",
    support: "LIMITED",
    note: "Admin melihat profil lengkap, tim hanya melihat kontak relevan.",
  },
  {
    category: "Keamanan Aplikasi Web L7 (WAF)",
    feature: "Lihat Log Serangan L7 (SQLi, XSS, RCE, CSRF)",
    admin: "YES",
    programmer: "YES",
    devops: "LIMITED",
    support: "YES",
    note: "Programmer meninjau payload serangan untuk audit kode aplikasi.",
  },
  {
    category: "Keamanan Aplikasi Web L7 (WAF)",
    feature: "Salin Konfigurasi Integrasi WAF (.env & Middleware)",
    admin: "YES",
    programmer: "YES",
    devops: "LIMITED",
    support: "NO",
    note: "Panduan integrasi Laravel package untuk tim pengembang web.",
  },
  {
    category: "Keamanan Aplikasi Web L7 (WAF)",
    feature: "Pengujian Simulasi Serangan pada Rute CRUD Aplikasi",
    admin: "YES",
    programmer: "YES",
    devops: "LIMITED",
    support: "LIMITED",
    note: "Menguji efektivitas penolakan serangan secara mandiri di browser.",
  },
  {
    category: "Keamanan Kernel L3/L4 & FIM",
    feature: "Monitoring Beban CPU, RAM, Disk, Uptime Hardware",
    admin: "YES",
    programmer: "LIMITED",
    devops: "YES",
    support: "LIMITED",
    note: "Maintainer/DevOps memantau kesehatan server Linux secara presisi.",
  },
  {
    category: "Keamanan Kernel L3/L4 & FIM",
    feature: "Status Daemon Sentinel & Kernel nftables Packet Drop",
    admin: "YES",
    programmer: "LIMITED",
    devops: "YES",
    support: "LIMITED",
    note: "Memastikan tabel firewall inet pasax beroperasi di priority raw.",
  },
  {
    category: "Keamanan Kernel L3/L4 & FIM",
    feature: "Penanganan Alert Integritas Berkas (FIM .env Locks)",
    admin: "YES",
    programmer: "LIMITED",
    devops: "YES",
    support: "LIMITED",
    note: "Pemberitahuan perubahan tidak sah pada berkas rahasia server.",
  },
  {
    category: "Keamanan Kernel L3/L4 & FIM",
    feature: "Blokir & Buka Blokir IP Manual di Layer Kernel",
    admin: "YES",
    programmer: "NO",
    devops: "YES",
    support: "NO",
    note: "Menyuntikkan alamat IP penyerang langsung ke firewall kernel.",
  },
  {
    category: "Lisensi, Kuota, & Bisnis",
    feature: "Melihat Token Lisensi Master (psk_live_...)",
    admin: "YES",
    programmer: "LIMITED",
    devops: "LIMITED",
    support: "NO",
    note: "Admin memegang kunci lisensi utama untuk aktivasi seluruh node.",
  },
  {
    category: "Lisensi, Kuota, & Bisnis",
    feature: "Manajemen Siklus Evaluasi Pro 14 Hari & Upgrade",
    admin: "YES",
    programmer: "NO",
    devops: "NO",
    support: "NO",
    note: "Wewenang peningkatan paket langganan dan kuota server.",
  },
]

export function PermissionsClient({
  currentRole,
  userCount,
  nodeCount,
}: PermissionsClientProps) {
  const [activeTab, setActiveTab] = React.useState<RoleTab>("admin")
  const selectedRole = roleDetails[activeTab]

  const renderStatusIcon = (status: "YES" | "LIMITED" | "NO") => {
    if (status === "YES") {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5 stroke-[2.5]" />
          <span>Bisa</span>
        </span>
      )
    }
    if (status === "LIMITED") {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
          <AlertTriangle className="size-3.5 stroke-[2.5]" />
          <span>Terbatas</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-destructive">
        <XCircle className="size-3.5 stroke-[2.5]" />
        <span>Dibatasi</span>
      </span>
    )
  }

  return (
    <div className="space-y-6" data-user-count={userCount}>
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-base border-2 border-border bg-card p-6 shadow-[6px_6px_0px_0px_var(--border)] sm:p-8">
        <div className="pointer-events-none absolute -right-6 -bottom-6 font-mono text-8xl font-black text-foreground/[0.03] select-none">
          ROLES
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl min-w-0 flex-1 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-2.5 py-0.5 font-mono text-[11px] font-black tracking-wider text-black">
              <ShieldCheck className="size-3.5" />
              <span>ARSITEKTUR OTORITAS BERJENJANG PASAX</span>
            </div>
            <h1 className="font-heading text-2xl font-black tracking-tight text-balance text-foreground sm:text-3xl">
              Matriks Hak Akses &amp; Kemampuan Peran
            </h1>
            <p className="font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
              Di Pasak Suite,{" "}
              <strong>
                setiap pengguna yang mendaftar mandiri otomatis berstatus Admin
              </strong>
              . Sebagai Admin, Anda dapat{" "}
              <strong>memonitor SELURUH node VPS</strong> yang ada dalam armada
              Anda, serta{" "}
              <strong>
                membuatkan akun untuk tim programmer dan maintainer server
              </strong>{" "}
              dengan wewenang yang terisolasi secara presisi.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link href="/users">
              <Button className="gap-1.5 font-heading text-xs font-bold whitespace-nowrap shadow-[3px_3px_0px_0px_var(--border)]">
                <Users className="size-4" />
                <span>Kelola Tim &amp; Pengguna</span>
              </Button>
            </Link>
            <Link href="/node">
              <Button
                variant="outline"
                className="gap-1.5 border-2 font-heading text-xs font-bold whitespace-nowrap tabular-nums shadow-[3px_3px_0px_0px_var(--border)]"
              >
                <Server className="size-4" />
                <span>Monitor Semua Node ({nodeCount})</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Highlights Pin */}
        <div className="mt-6 grid grid-cols-1 gap-3 border-t-2 border-dashed border-border/70 pt-4 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-base border border-border bg-main/20 font-bold text-foreground">
              1
            </span>
            <div>
              <div className="font-bold text-foreground">User Baru = Admin</div>
              <div className="font-sans text-[11px] text-muted-foreground">
                Pendaftaran mandiri otomatis menjadi Admin
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-base border border-border bg-emerald-500/20 font-bold text-emerald-600 dark:text-emerald-400">
              2
            </span>
            <div>
              <div className="font-bold text-foreground">
                Delegasi Tim Terisolasi
              </div>
              <div className="font-sans text-[11px] text-muted-foreground">
                Admin membuat akun Programmer &amp; Maintainer
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-base border border-border bg-blue-500/20 font-bold text-blue-600 dark:text-blue-400">
              3
            </span>
            <div>
              <div className="font-bold text-foreground">
                Kendali Penuh Node VPS
              </div>
              <div className="font-sans text-[11px] text-muted-foreground">
                Admin mengawasi semua server tanpa batas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Role Capabilities Simulator */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-heading text-lg font-black">
                <Sparkles className="size-5 text-main" />
                <span>Eksplorasi Kemampuan Peran (Role Explorer)</span>
              </CardTitle>
              <CardDescription className="font-sans text-xs">
                Pilih peran di bawah ini untuk melihat detail apa yang bisa
                dilakukan dan apa yang dibatasi di web Pasak:
              </CardDescription>
            </div>

            <div className="font-mono text-xs text-muted-foreground">
              Peran Anda saat ini:{" "}
              <Badge className="ml-1 font-bold">{currentRole}</Badge>
            </div>
          </div>

          {/* Role Tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2 rounded-base border-2 px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                activeTab === "admin"
                  ? "-translate-y-0.5 border-border bg-main text-black shadow-[3px_3px_0px_0px_var(--border)]"
                  : "border-border/60 bg-background text-muted-foreground hover:bg-muted/30"
              }`}
            >
              <ShieldCheck className="size-4" />
              <span>Admin (Pemilik Armada)</span>
            </button>

            <button
              onClick={() => setActiveTab("programmer")}
              className={`flex items-center gap-2 rounded-base border-2 px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                activeTab === "programmer"
                  ? "-translate-y-0.5 border-purple-600 bg-purple-500/20 text-purple-700 shadow-[3px_3px_0px_0px_var(--border)] dark:text-purple-300"
                  : "border-border/60 bg-background text-muted-foreground hover:bg-muted/30"
              }`}
            >
              <Code2 className="size-4" />
              <span>Programmer Aplikasi (L7)</span>
            </button>

            <button
              onClick={() => setActiveTab("devops")}
              className={`flex items-center gap-2 rounded-base border-2 px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                activeTab === "devops"
                  ? "-translate-y-0.5 border-emerald-600 bg-emerald-500/20 text-emerald-700 shadow-[3px_3px_0px_0px_var(--border)] dark:text-emerald-300"
                  : "border-border/60 bg-background text-muted-foreground hover:bg-muted/30"
              }`}
            >
              <Cpu className="size-4" />
              <span>Server Maintainer / DevOps (L3/L4)</span>
            </button>

            <button
              onClick={() => setActiveTab("support")}
              className={`flex items-center gap-2 rounded-base border-2 px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                activeTab === "support"
                  ? "-translate-y-0.5 border-amber-600 bg-amber-500/20 text-amber-700 shadow-[3px_3px_0px_0px_var(--border)] dark:text-amber-300"
                  : "border-border/60 bg-background text-muted-foreground hover:bg-muted/30"
              }`}
            >
              <Eye className="size-4" />
              <span>Staff Teknis / Support</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: Role Overview */}
            <div className="space-y-4 rounded-base border-2 border-border bg-muted/10 p-5">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  className={`font-mono text-xs font-black tracking-wider ${selectedRole.badgeColor}`}
                >
                  {selectedRole.badgeText}
                </Badge>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">
                  Wewenang Terdaftar
                </span>
              </div>

              <div>
                <h3 className="font-heading text-lg font-black text-foreground">
                  {selectedRole.title}
                </h3>
                <div className="mt-1 font-mono text-xs font-semibold text-main">
                  Target: {selectedRole.targetUser}
                </div>
              </div>

              <p className="border-t border-dashed border-border/80 pt-3 font-sans text-xs leading-relaxed text-pretty text-muted-foreground">
                {selectedRole.philosophy}
              </p>

              <div className="space-y-2 border-t border-dashed border-border/80 pt-3 font-mono text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Jangkauan VPS:</span>
                  <span className="text-right font-bold text-foreground">
                    {selectedRole.accessScopeText}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">
                    Status Akses Web:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Aktif &amp; Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: What they CAN do */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-heading text-sm font-black text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4.5 stroke-[2.5]" />
                <span>APA YANG BISA DILAKUKAN DI WEB (ALLOWED):</span>
              </div>

              <div className="space-y-2.5">
                {selectedRole.canDo.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={idx}
                      className="rounded-base border-2 border-emerald-500/40 bg-emerald-500/5 p-3 font-sans transition-all hover:border-emerald-500"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-base border border-emerald-500/60 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          <Icon className="size-3.5" />
                        </div>
                        <div>
                          <div className="font-heading text-xs font-bold text-foreground">
                            {item.title}
                          </div>
                          <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: What is RESTRICTED */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-heading text-sm font-black text-destructive">
                <XCircle className="size-4.5 stroke-[2.5]" />
                <span>BATASAN AKSES (RESTRICTED):</span>
              </div>

              <div className="space-y-2.5">
                {selectedRole.cannotDo.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-base border-2 border-destructive/40 bg-destructive/5 p-3 font-sans transition-all hover:border-destructive"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-base border border-destructive/60 bg-destructive/20 text-destructive">
                        <XCircle className="size-3.5" />
                      </div>
                      <div>
                        <div className="font-heading text-xs font-bold text-foreground">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedRole.id === "admin" && (
                  <div className="rounded-base border-2 border-border/80 bg-muted/20 p-3.5 font-sans">
                    <div className="flex items-center gap-2 font-heading text-xs font-bold text-foreground">
                      <ShieldCheck className="size-4 text-emerald-500" />
                      <span>Kewenangan Penuh Pemilik Armada</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Admin memegang kunci master organisasi dan memiliki
                      wewenang tak terbatas di dalam seluruh kluster server yang
                      ia daftarkan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Comprehensive Comparison Matrix Table */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-heading text-lg font-black">
                <Layers className="size-5 text-main" />
                <span>Matriks Perbandingan Wewenang Lengkap</span>
              </CardTitle>
              <CardDescription className="font-sans text-xs">
                Tabel rinci perbandingan kapabilitas operasional seluruh peran
                di dalam konsol Pasak Suite:
              </CardDescription>
            </div>
            <div className="flex shrink-0 items-center gap-3 font-mono text-xs">
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> Bisa
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-3.5" /> Terbatas
              </span>
              <span className="flex items-center gap-1 font-bold text-destructive">
                <XCircle className="size-3.5" /> Dibatasi
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border bg-muted/30">
                  <TableHead className="px-3 font-mono text-[11px] font-black tracking-wider text-foreground">
                    FITUR &amp; KAPABILITAS
                  </TableHead>
                  <TableHead className="px-2.5 text-center font-mono text-[11px] font-black tracking-wider text-foreground">
                    ADMIN
                  </TableHead>
                  <TableHead className="px-2.5 text-center font-mono text-[11px] font-black tracking-wider text-foreground">
                    PROGRAMMER
                  </TableHead>
                  <TableHead className="px-2.5 text-center font-mono text-[11px] font-black tracking-wider text-foreground">
                    MAINTAINER
                  </TableHead>
                  <TableHead className="px-2.5 text-center font-mono text-[11px] font-black tracking-wider text-foreground">
                    SUPPORT
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-black tracking-wider text-foreground">
                    CATATAN OPERASIONAL
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrixData.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="border-b border-border/60 transition-colors hover:bg-muted/10"
                  >
                    <TableCell className="max-w-[260px] px-3 py-3 font-mono text-xs font-semibold whitespace-normal text-foreground">
                      <div className="flex flex-col">
                        <span>{row.feature}</span>
                        <span className="text-[10px] font-normal text-muted-foreground">
                          {row.category}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-2.5 py-3 text-center">
                      {renderStatusIcon(row.admin)}
                    </TableCell>

                    <TableCell className="px-2.5 py-3 text-center">
                      {renderStatusIcon(row.programmer)}
                    </TableCell>

                    <TableCell className="px-2.5 py-3 text-center">
                      {renderStatusIcon(row.devops)}
                    </TableCell>

                    <TableCell className="px-2.5 py-3 text-center">
                      {renderStatusIcon(row.support)}
                    </TableCell>

                    <TableCell className="max-w-[260px] px-3 py-3 font-sans text-xs whitespace-normal text-muted-foreground">
                      {row.note}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Real-world Operational Workflow Card */}
      <Card className="border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_var(--border)]">
        <div className="flex items-center gap-2 font-heading text-base font-black text-foreground">
          <Terminal className="size-5 text-main" />
          <span>
            Skenario Nyata: Kolaborasi Admin, Programmer, dan Server Maintainer
          </span>
        </div>
        <p className="mt-1 font-sans text-xs text-muted-foreground">
          Bagaimana alur kerja tim sehari-hari di Pasak Suite:
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative rounded-base border-2 border-border bg-background p-4 font-sans">
            <div className="font-mono text-xs font-black text-main">
              LANGKAH 1
            </div>
            <div className="mt-1 font-heading text-xs font-bold text-foreground">
              Admin Mendaftar Mandiri
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              User mendaftar di Pasak, otomatis mendapatkan role{" "}
              <strong>Admin</strong>, lisensi Pro Trial 14 Hari, dan kuota
              hingga 10 VPS.
            </p>
          </div>

          <div className="relative rounded-base border-2 border-border bg-background p-4 font-sans">
            <div className="font-mono text-xs font-black text-main">
              LANGKAH 2
            </div>
            <div className="mt-1 font-heading text-xs font-bold text-foreground">
              Admin Daftarkan VPS Node
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Admin menjalankan perintah instalasi satu baris agen Sentinel di
              VPS host (misal Ubuntu VPS 127.0.0.1:2222). Node otomatis
              terhubung.
            </p>
          </div>

          <div className="relative rounded-base border-2 border-border bg-background p-4 font-sans">
            <div className="font-mono text-xs font-black text-main">
              LANGKAH 3
            </div>
            <div className="mt-1 font-heading text-xs font-bold text-foreground">
              Admin Membuat Akun Tim
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Admin membuka halaman <strong>Tim &amp; Pengguna</strong>,
              menambahkan akun Programmer (Budi) dan Maintainer (Ahmad), lalu
              menugaskan VPS terkait.
            </p>
          </div>

          <div className="relative rounded-base border-2 border-border bg-background p-4 font-sans">
            <div className="font-mono text-xs font-black text-main">
              LANGKAH 4
            </div>
            <div className="mt-1 font-heading text-xs font-bold text-foreground">
              Kolaborasi &amp; Monitoring
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Programmer memantau WAF &amp; aplikasi, Maintainer memantau
              performa kernel &amp; nftables, dan Admin memonitor{" "}
              <strong>SEMUA node VPS</strong> secara komprehensif.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
