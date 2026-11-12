import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { HeroCyberBackground } from "@/components/public/hero-cyber-background"
import { TerminalInstall } from "@/components/public/terminal-install"
import { VpsCompatibilityStrip } from "@/components/public/vps-compatibility-strip"
import TypingText from "@/components/animata/text/typing-text"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 md:pt-20">
      {/* ThreatsEye-Inspired Cyber Animated Background */}
      <HeroCyberBackground />

      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col items-center text-center">
          {/* Top Release Pill */}
          <Link
            href="/docs"
            className="mb-6 inline-flex max-w-full items-center gap-1.5 sm:gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <span className="flex size-2 shrink-0 animate-ping rounded-full bg-main" />
            <span className="font-heading tracking-wide uppercase truncate sm:overflow-visible">
              <span className="inline sm:hidden">v1.7.0 RELEASE</span>
              <span className="hidden sm:inline">PASAK-SENTINEL v1.7.0</span>
            </span>
            <span className="text-muted-foreground">&bull;</span>
            <span className="font-bold text-main flex items-center gap-1 shrink-0">
              <span>LINUX VPS IMMUNITY</span>
              <ArrowRight className="size-3" />
            </span>
          </Link>

          {/* Main Headline with Cyber Terminal Typing Text Animation */}
          <h1 className="max-w-5xl xl:max-w-6xl font-heading text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
            <TypingText
              text="Bulletproof Security for Linux VPS & Web Fleets"
              repeat={false}
              delay={100}
              className="font-heading"
            />
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 max-w-3xl xl:max-w-4xl text-lg leading-relaxed font-base text-foreground/80 sm:text-xl lg:text-2xl">
            Stop webshells, brute-force bots, and zero-day exploits at the raw Linux kernel. Combines{" "}
            <strong className="text-foreground">
              sub-0.2ms nftables drops
            </strong>
            , instant 11ms{" "}
            <strong className="text-foreground">
              File Integrity Monitoring (.env auto-lock)
            </strong>
            , and an autonomous{" "}
            <strong className="text-foreground">
              cloud SOC mesh
            </strong>
            —using less than 20MB RAM on any 1GB VPS.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "flex items-center gap-2 font-heading text-base font-bold shadow-shadow"
              )}
            >
              <span>Launch SOC Console</span>
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="/docs"
              className={cn(
                buttonVariants({ variant: "neutral", size: "lg" }),
                "flex items-center gap-2 border-2 border-border font-heading text-base font-bold shadow-shadow hover:bg-background"
              )}
            >
              <BookOpen className="size-5 text-main" />
              <span>Explore Documentation</span>
            </Link>
            <a
              href="#vps-comparison"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "flex items-center gap-2 border-2 border-border bg-secondary-background font-heading text-base font-bold shadow-shadow hover:bg-background"
              )}
            >
              <span>Why VPS Needs Pasak</span>
            </a>
          </div>

          {/* One-Line Terminal Installer */}
          <div className="mt-12 flex w-full justify-center">
            <TerminalInstall />
          </div>

          {/* Metrics Highlights Bar */}
          <div className="mt-12 grid w-full max-w-5xl xl:max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            <div className="rounded-base border-2 border-border bg-secondary-background p-4 text-center shadow-[2px_2px_0px_0px_var(--border)]">
              <div className="font-mono text-2xl font-black text-foreground sm:text-3xl">
                &lt; 20 MB
              </div>
              <div className="mt-1 font-mono text-xs font-semibold text-muted-foreground">
                RAM Footprint
              </div>
            </div>

            <div className="rounded-base border-2 border-border bg-secondary-background p-4 text-center shadow-[2px_2px_0px_0px_var(--border)]">
              <div className="font-mono text-2xl font-black text-foreground sm:text-3xl">
                &lt; 0.2 ms
              </div>
              <div className="mt-1 font-mono text-xs font-semibold text-muted-foreground">
                Kernel Filter Latency
              </div>
            </div>

            <div className="rounded-base border-2 border-border bg-secondary-background p-4 text-center shadow-[2px_2px_0px_0px_var(--border)]">
              <div className="font-mono text-2xl font-black text-green-600 sm:text-3xl dark:text-green-400">
                0 Open Ports
              </div>
              <div className="mt-1 font-mono text-xs font-semibold text-muted-foreground">
                Egress-Only mTLS
              </div>
            </div>

            <div className="rounded-base border-2 border-border bg-secondary-background p-4 text-center shadow-[2px_2px_0px_0px_var(--border)]">
              <div className="font-mono text-2xl font-black text-foreground sm:text-3xl">
                100%
              </div>
              <div className="mt-1 font-mono text-xs font-semibold text-muted-foreground">
                Auditable & Open Source
              </div>
            </div>
          </div>

          {/* Universal VPS & Cloud Compatibility Strip */}
          <div className="mt-12 w-full">
            <VpsCompatibilityStrip />
          </div>
        </div>
      </div>
    </section>
  )
}
