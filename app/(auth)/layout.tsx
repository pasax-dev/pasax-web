import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-lg font-black tracking-tight"
        >
          <div className="flex size-9 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]">
            <Shield className="size-5 stroke-[2.5]" />
          </div>
          <span className="text-xl">PASAK SUITE</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-foreground/60 py-4">
        &copy; {new Date().getFullYear()} Pasak Defense Suite &bull; SOC Platform & Bullwark Kernel Engine
      </footer>
    </div>
  )
}
