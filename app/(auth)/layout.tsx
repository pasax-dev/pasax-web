import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ShieldCheck, Terminal, Cpu, Lock } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SectionBackground } from "@/components/public/section-background"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-background p-4 text-foreground selection:bg-main selection:text-black sm:p-8">
      {/* Dynamic Tactical Background with Grid & Ambient Lighting */}
      <SectionBackground variant="grid" />

      {/* Top Header */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between pb-6 sm:pb-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 font-heading text-lg font-black tracking-tight"
        >
          <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-base border-2 border-border bg-card shadow-[3px_3px_0px_0px_var(--border)] transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1.5px_1.5px_0px_0px_var(--border)]">
            <Image
              src="/icon.png"
              alt="Pasax Suite Logo"
              width={40}
              height={40}
              className="size-full object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-black tracking-tight text-foreground sm:text-2xl">
                PASAX<span className="text-main">.</span>
              </span>
              <span className="hidden -rotate-1 items-center rounded-base border-2 border-border bg-main px-2 py-0.5 font-mono text-[9px] font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)] sm:inline-flex">
                GATEWAY
              </span>
            </div>
            <span className="hidden font-mono text-[10px] font-bold text-muted-foreground sm:inline-block">
              Host & Fleet Defense Mesh
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-base border-2 border-border bg-card px-3 py-1.5 font-mono text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)] md:flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-black uppercase">Nodes Live: 100%</span>
          </div>

          <ThemeToggle />

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3.5 py-1.5 font-mono text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Kembali</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="relative z-20 flex flex-1 items-center justify-center py-4 sm:py-8">
        {children}
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 border-t-2 border-border/60 pt-5 font-mono text-xs font-bold text-muted-foreground sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:justify-start">
          <div className="flex items-center gap-1.5 text-foreground">
            <ShieldCheck className="size-3.5 text-main" />
            <span className="font-black">mTLS 1.3</span>
          </div>
          <span>&bull;</span>
          <div className="flex items-center gap-1.5 text-foreground">
            <Lock className="size-3 text-emerald-500" />
            <span>FIPS-140-3 Standard</span>
          </div>
          <span>&bull;</span>
          <div className="flex items-center gap-1.5 text-foreground">
            <Cpu className="size-3.5 text-sky-400" />
            <span>Kernel Netfilter Synced</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span>&copy; {new Date().getFullYear()} Pasax Security</span>
          <span>&bull;</span>
          <Link
            href="/threats-map"
            className="flex items-center gap-1 font-bold text-foreground underline decoration-main decoration-2 underline-offset-2 hover:text-main"
          >
            <Terminal className="size-3" />
            <span>Live Threat Radar</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
