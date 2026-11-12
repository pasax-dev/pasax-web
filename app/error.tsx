"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, Home, Terminal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log exception to console
    console.error("Pasak Dashboard Runtime Error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-lg font-black tracking-tight"
        >
          <div className="flex size-8 items-center justify-center rounded-base border-2 border-border bg-destructive text-destructive-foreground shadow-[2px_2px_0px_0px_var(--border)]">
            <AlertTriangle className="size-4 stroke-[2.5]" />
          </div>
          <span>PASAK DEFENSE</span>
        </Link>
        <Badge variant="outline" className="font-mono text-xs font-bold border-2 border-border bg-destructive/15 text-destructive">
          ERR_CRITICAL_500
        </Badge>
      </header>

      {/* Main Error Box */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-xl rounded-base border-2 border-border bg-background p-6 shadow-[8px_8px_0px_0px_var(--border)] sm:p-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-heading text-6xl font-black text-destructive drop-shadow-[2px_2px_0px_var(--border)] sm:text-7xl">
                500
              </span>
              <div className="border-l-2 border-border pl-3">
                <Badge className="bg-destructive font-mono text-[10px] font-black text-destructive-foreground">
                  INTERNAL ENGINE FAULT
                </Badge>
                <h1 className="font-heading text-lg font-black text-foreground sm:text-xl">
                  Kendala Eksekusi Dashboard
                </h1>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-foreground/80">
              Terjadi kegagalan pemrosesan tak terduga pada layer render dashboard atau
              koneksi kontrol plane. Laporan error telah dicatat untuk inspeksi teknis SOC.
            </p>

            {/* Diagnostic Box */}
            <div className="rounded-base border-2 border-border bg-secondary-background p-3 font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-foreground/60">
                <span>FAULT_DIGEST:</span>
                <span className="font-bold text-destructive truncate max-w-[200px]">
                  {error.digest || "ERR_SYS_UNHANDLED_EXCEPTION"}
                </span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>MESSAGE:</span>
                <span className="text-foreground truncate max-w-[260px]">
                  {error.message || "Unknown runtime exception"}
                </span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>TIMESTAMP:</span>
                <span className="text-foreground">{new Date().toISOString()}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2 font-heading text-xs font-black text-main-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <RotateCcw className="size-4" />
                <span>Coba Muat Ulang</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-4 py-2 font-heading text-xs font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
              >
                <Home className="size-4" />
                <span>Kembali ke Beranda</span>
              </Link>

              <Link
                href="/docs/pasak-security-monitor"
                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-background px-4 py-2 font-heading text-xs font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
              >
                <Terminal className="size-4 text-main" />
                <span>Panduan Pemulihan</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-foreground/50 py-4">
        Pasak Defense Suite &bull; System Fault Boundary
      </footer>
    </div>
  )
}
