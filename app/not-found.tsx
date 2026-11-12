import Link from "next/link"
import { ShieldAlert, Home, BookOpen, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-lg font-black tracking-tight"
        >
          <div className="flex size-8 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]">
            <ShieldAlert className="size-4 stroke-[2.5]" />
          </div>
          <span>PASAK DEFENSE</span>
        </Link>
        <Badge variant="outline" className="font-mono text-xs font-bold border-2 border-border bg-secondary-background">
          ERR_HTTP_404
        </Badge>
      </header>

      {/* Main 404 Box */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-xl rounded-base border-2 border-border bg-background p-6 shadow-[8px_8px_0px_0px_var(--border)] sm:p-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-heading text-6xl font-black text-main drop-shadow-[2px_2px_0px_var(--border)] sm:text-7xl">
                404
              </span>
              <div className="border-l-2 border-border pl-3">
                <Badge className="bg-destructive font-mono text-[10px] font-black text-destructive-foreground">
                  TARGET NOT FOUND
                </Badge>
                <h1 className="font-heading text-lg font-black text-foreground sm:text-xl">
                  Halaman Tidak Ditemukan
                </h1>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-foreground/80">
              Alamat URL yang Anda tuju tidak terdaftar pada routing Pasak Cloud Dashboard
              maupun katalog dokumentasi resmi. Kemungkinan rute telah dipindahkan,
              dihapus, atau salah penulisan slug.
            </p>

            {/* Diagnostic Box */}
            <div className="rounded-base border-2 border-border bg-secondary-background p-3 font-mono text-xs space-y-1">
              <div className="flex justify-between text-foreground/60">
                <span>STATUS:</span>
                <span className="font-bold text-destructive">404 NOT_FOUND</span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>SYSTEM:</span>
                <span className="text-foreground">PASAK_EDGE_ROUTER</span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>ACTION:</span>
                <span className="text-foreground">CHECK_PATH_OR_SEARCH_DOCS</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2 font-heading text-xs font-black text-main-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
              >
                <Home className="size-4" />
                <span>Kembali ke Beranda</span>
              </Link>

              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-4 py-2 font-heading text-xs font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
              >
                <BookOpen className="size-4 text-main" />
                <span>Buka Dokumentasi</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-background px-4 py-2 font-heading text-xs font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
              >
                <span>Masuk SOC Console</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-foreground/50 py-4">
        Pasak Suite Defense &bull; HTTP Gateway Error Handler
      </footer>
    </div>
  )
}
