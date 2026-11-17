import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ShieldCheck, Terminal } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SectionBackground } from "@/components/public/section-background"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-background p-4 text-foreground sm:p-8">
      <SectionBackground variant="dots" />

      {/* Top Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between pb-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-heading text-lg font-black tracking-tight"
        >
          <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-base border-2 border-border bg-card shadow-[2px_2px_0px_0px_var(--border)] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5">
            <Image
              src="/icon.png"
              alt="Pasax Suite Icon"
              width={36}
              height={36}
              className="size-full object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-black text-foreground">
              PASAX<span className="text-main">.</span>
            </span>
            <span className="hidden -rotate-1 items-center rounded-base border-2 border-border bg-amber-300 px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)] sm:inline-flex">
              DEFENSE GATEWAY
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 font-mono text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="relative z-10 flex flex-1 items-center justify-center py-6">
        {children}
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 border-t-2 border-border/40 pt-4 font-mono text-[11px] font-bold text-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-main" />
          <span>mTLS 1.3 Encrypted &bull; FIPS-Compliant Authentication</span>
        </div>
        <div className="flex items-center gap-3">
          <span>&copy; {new Date().getFullYear()} Pasax Suite</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Terminal className="size-3" />
            <span>Bullwark Engine</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
