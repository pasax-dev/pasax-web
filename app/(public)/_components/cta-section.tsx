import Link from "next/link"
import { ArrowRight, ExternalLink, Sparkles, ShieldCheck } from "lucide-react"

export function CtaSection() {
  return (
    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-b from-card/80 to-card/40 p-8 text-center text-foreground shadow-2xl backdrop-blur-xl md:p-14 lg:p-16 xl:p-20">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(56,189,248,0.18),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs text-sky-500 backdrop-blur-md dark:text-sky-400">
            <Sparkles className="size-3.5" />
            <span>INSTANT FLEET FORTIFICATION</span>
          </div>

          <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-5xl lg:text-6xl">
            Arm Your Web Fleets in Under 60 Seconds
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg lg:text-xl">
            Stop waiting for attackers to exploit your server configs. Deploy
            the zero-overhead kernel sentinel or explore the live SOC dashboard
            today.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-sans text-sm font-medium text-background shadow-sm transition-all hover:scale-[1.02] hover:bg-foreground/90 active:scale-[0.98]"
            >
              <span>Launch SOC Console</span>
              <ArrowRight className="size-4" />
            </Link>

            <a
              href="https://github.com/pasax-dev"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-6 py-3 font-sans text-sm font-medium text-foreground backdrop-blur-md transition-all hover:scale-[1.02] hover:border-border hover:bg-muted/80 active:scale-[0.98]"
            >
              <ShieldCheck className="size-4" />
              <span>Read GitHub Guide</span>
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500">✓</span> 100% Free &amp; Open
              Source
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500">✓</span> Sub-0.2ms Kernel Drops
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500">✓</span> Zero Inbound Open
              Ports
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
