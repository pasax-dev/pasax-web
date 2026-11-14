"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ShieldAlert,
  Lock,
  FileText,
  Home,
  CheckCircle2,
  Copy,
  Terminal,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ForbiddenView() {
  const [copied, setCopied] = React.useState(false)
  const [appealSubmitted, setAppealSubmitted] = React.useState(false)
  const [appealReason, setAppealReason] = React.useState("")

  const incidentId = "PSK-BLCK-9824-NAT"

  const handleCopyIncident = () => {
    navigator.clipboard.writeText(incidentId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAppeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!appealReason.trim()) return
    setAppealSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-lg font-black tracking-tight"
        >
          <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-base border-2 border-border bg-card shadow-[2px_2px_0px_0px_var(--border)]">
            <Image
              src="/icon.png"
              alt="Pasak Suite"
              width={32}
              height={32}
              className="size-full object-contain p-0.5"
            />
          </div>
          <span>PASAK WAF SHIELD</span>
        </Link>
        <Badge
          variant="outline"
          className="font-mono text-xs font-black border-2 border-border bg-destructive text-destructive-foreground shadow-[2px_2px_0px_0px_var(--border)]"
        >
          ACCESS DENIED (403)
        </Badge>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-xl rounded-base border-2 border-border bg-background p-6 shadow-[8px_8px_0px_0px_var(--border)] sm:p-10 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <span className="font-heading text-6xl font-black text-destructive drop-shadow-[2px_2px_0px_var(--border)] sm:text-7xl">
              403
            </span>
            <div className="border-l-2 border-border pl-3">
              <Badge className="bg-destructive font-mono text-[10px] font-black text-destructive-foreground">
                FIREWALL BLOCKED
              </Badge>
              <h1 className="font-heading text-lg font-black text-foreground sm:text-xl">
                Akses Ditolak oleh Sistem Pertahanan
              </h1>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-foreground/80">
            Permintaan Anda dihentikan oleh modul WAF <strong>pasak-secure-monitor</strong>{" "}
            atau daemon <strong>pasak-sentinel</strong> karena terdeteksi pola aktivitas
            mencurigakan, IP dibatasi dalam daftar karantina, atau sesi tidak memiliki
            hak akses (RBAC) yang memadai.
          </p>

          {/* Incident Telemetry Box */}
          <div className="rounded-base border-2 border-border bg-secondary-background p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="font-bold text-foreground/70">INCIDENT ID:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-destructive">{incidentId}</span>
                <button
                  type="button"
                  onClick={handleCopyIncident}
                  className="rounded border border-border bg-background p-1 hover:bg-main hover:text-main-foreground"
                  title="Salin Incident ID"
                >
                  {copied ? (
                    <CheckCircle2 className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between text-foreground/70">
              <span>RULE TRIGGERED:</span>
              <span className="text-foreground font-bold">WAF_DEVICE_QUARANTINE_NAT</span>
            </div>
            <div className="flex justify-between text-foreground/70">
              <span>SECURITY ENGINE:</span>
              <span className="text-foreground">Pasak Trinity Defense L2/L3</span>
            </div>
            <div className="flex justify-between text-foreground/70">
              <span>ACTION CODE:</span>
              <span className="text-destructive font-bold">HTTP_403_FORBIDDEN</span>
            </div>
          </div>

          {/* Ticket Appeal Form Demo */}
          <div className="rounded-base border-2 border-dashed border-border bg-background p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-main" />
              <h3 className="font-heading text-sm font-black text-foreground">
                Ajukan Banding Pemulihan Akses
              </h3>
            </div>

            {appealSubmitted ? (
              <div className="rounded-base border-2 border-border bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Tiket banding #{incidentId} berhasil dikirim ke antrean SOC. Tim teknis akan meninjau karantina perangkat dalam 15 menit.
              </div>
            ) : (
              <form onSubmit={handleAppeal} className="space-y-2.5">
                <p className="text-xs text-foreground/75">
                  Jika Anda meyakini ini adalah false positive, jelaskan konteks akses Anda:
                </p>
                <textarea
                  rows={2}
                  required
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Misal: Saya sedang mengakses endpoint API dashboard dari jaringan kantor..."
                  className="w-full rounded-base border-2 border-border bg-secondary-background p-2.5 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-main"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-3 py-1.5 font-heading text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
                >
                  <span>Kirim Tiket Banding</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-4 py-2 font-heading text-xs font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
            >
              <Home className="size-4" />
              <span>Kembali ke Beranda</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-background px-4 py-2 font-heading text-xs font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
            >
              <Lock className="size-4 text-main" />
              <span>Ganti Akun Operator</span>
            </Link>

            <Link
              href="/docs/pasak-secure-monitor"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-background px-4 py-2 font-heading text-xs font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
            >
              <Terminal className="size-4 text-main" />
              <span>Pelajari Mekanisme WAF</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-foreground/50 py-4">
        Pasak Defense Suite &bull; WAF Ingress & Access Gate
      </footer>
    </div>
  )
}
