"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu,
  X,
  ArrowRight,
  BookOpen,
  LogIn,
  Globe2,
  Terminal,
  Server,
  CloudCog,
  Zap,
  FileSearch,
  Layers,
  Lock,
  ShieldCheck,
  Code2,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"


export function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [mobileSection, setMobileSection] = React.useState<string | null>(null)

  const toggleMobileSection = (key: string) => {
    setMobileSection((prev) => (prev === key ? null : key))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Left: Brand Logo & Identifier */}
        <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
          <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-base border-2 border-border bg-card shadow-[2px_2px_0px_0px_var(--border)] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5">
            <Image
              src="/icon.png"
              alt="Pasak Suite Icon"
              width={36}
              height={36}
              className="size-full object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-black tracking-tight text-foreground">
              PASAK<span className="text-main">.</span>
            </span>
            <Badge
              variant="outline"
              className="hidden border-border bg-secondary-background/80 font-mono text-[10px] font-bold tracking-wider sm:inline-flex"
            >
              DEFENSE SHIELD
            </Badge>
          </div>
        </Link>

        {/* Center: ThreatEye-Inspired Rich NavigationMenu (Desktop) */}
        <nav className="hidden items-center lg:flex">
          <NavigationMenu className="border-0 bg-transparent p-0">
            <NavigationMenuList className="gap-1">
              {/* 1. PLATFORM / PRODUCTS DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-heading text-xs font-bold uppercase tracking-wider">
                  Platform
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[620px] grid-cols-12 gap-3 p-3">
                    {/* Left Featured Card */}
                    <div className="col-span-5 flex flex-col justify-between rounded-base border-2 border-border bg-main p-4 text-main-foreground shadow-[3px_3px_0px_0px_var(--border)]">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-wider text-foreground">
                          <Sparkles className="size-3.5 text-foreground" />
                          <span>TRINITY MESH</span>
                        </div>
                        <h4 className="font-heading text-lg font-black text-foreground">
                          Triple-Layer Defense
                        </h4>
                        <p className="text-xs font-base text-foreground/85 leading-relaxed">
                          Synchronized immunity connecting in-app Laravel WAF,
                          raw Go kernel packet drops, and cloud fleet SOC telemetry.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60">
                        <NavigationMenuLink
                          render={<Link href="/#architecture" />}
                          className="inline-flex items-center gap-1.5 font-heading text-xs font-black text-foreground hover:underline p-0"
                        >
                          <span>Explore Architecture</span>
                          <ArrowRight className="size-3.5" />
                        </NavigationMenuLink>
                      </div>
                    </div>

                    {/* Right Product Items */}
                    <div className="col-span-7 flex flex-col gap-1.5">
                      <NavigationMenuLink
                        render={<Link href="/docs/pasak-sentinel" />}
                        className="group flex items-start gap-2.5 rounded-base border-2 border-transparent p-2.5 transition-colors hover:border-border hover:bg-secondary-background"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-base border-2 border-border bg-card shadow-[1px_1px_0px_0px_var(--border)]">
                          <Terminal className="size-4 text-main" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                              pasak-sentinel
                            </span>
                            <Badge variant="outline" className="border-border text-[9px] font-mono py-0 px-1 font-bold">
                              Go 1.24
                            </Badge>
                          </div>
                          <p className="line-clamp-2 text-[11px] text-foreground/75 leading-tight">
                            Linux daemon for sub-0.2ms nftables drops & microsecond FIM auto-lock.
                          </p>
                        </div>
                      </NavigationMenuLink>

                      <NavigationMenuLink
                        render={<Link href="/docs/pasak-security-monitor" />}
                        className="group flex items-start gap-2.5 rounded-base border-2 border-transparent p-2.5 transition-colors hover:border-border hover:bg-secondary-background"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-base border-2 border-border bg-card shadow-[1px_1px_0px_0px_var(--border)]">
                          <Server className="size-4 text-amber-500" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                              pasak/shield
                            </span>
                            <Badge variant="outline" className="border-border text-[9px] font-mono py-0 px-1 font-bold">
                              Laravel Core
                            </Badge>
                          </div>
                          <p className="line-clamp-2 text-[11px] text-foreground/75 leading-tight">
                            Zero-dependency PHP WAF, honeypots, and in-app webshell integrity scan.
                          </p>
                        </div>
                      </NavigationMenuLink>

                      <NavigationMenuLink
                        render={<Link href="/dashboard" />}
                        className="group flex items-start gap-2.5 rounded-base border-2 border-transparent p-2.5 transition-colors hover:border-border hover:bg-secondary-background"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-base border-2 border-border bg-card shadow-[1px_1px_0px_0px_var(--border)]">
                          <CloudCog className="size-4 text-cyan-500" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                              Pasak Cloud SOC
                            </span>
                            <Badge variant="outline" className="border-border text-[9px] font-mono py-0 px-1 font-bold">
                              Next.js 16
                            </Badge>
                          </div>
                          <p className="line-clamp-2 text-[11px] text-foreground/75 leading-tight">
                            Fleet telemetry aggregation, collective blocklist sync, and SSL audits.
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* 2. SOLUTIONS DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-heading text-xs font-bold uppercase tracking-wider">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[580px] grid-cols-2 gap-2 p-3">
                    <NavigationMenuLink
                      render={<Link href="/#vps-comparison" />}
                      className="group flex items-start gap-3 rounded-base border-2 border-transparent p-3 transition-colors hover:border-border hover:bg-secondary-background"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/20 text-main shadow-[1px_1px_0px_0px_var(--border)]">
                        <Zap className="size-4.5" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                          Linux VPS Immunity
                        </span>
                        <p className="text-[11px] text-foreground/75 leading-tight">
                          Sub-0.2ms kernel drops &lt;20MB RAM for any 1GB droplet.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/#features" />}
                      className="group flex items-start gap-3 rounded-base border-2 border-transparent p-3 transition-colors hover:border-border hover:bg-secondary-background"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-purple-500/20 text-purple-600 dark:text-purple-400 shadow-[1px_1px_0px_0px_var(--border)]">
                        <FileSearch className="size-4.5" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                          FIM Auto-Healing
                        </span>
                        <p className="text-[11px] text-foreground/75 leading-tight">
                          Microsecond .env tamper detection & auto-lock to 0600.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/#workloads" />}
                      className="group flex items-start gap-3 rounded-base border-2 border-border/40 p-3 transition-colors hover:border-border hover:bg-secondary-background"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-[1px_1px_0px_0px_var(--border)]">
                        <Layers className="size-4.5" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                          Production Web Stacks
                        </span>
                        <p className="text-[11px] text-foreground/75 leading-tight">
                          Hardened profiles for Nginx, Caddy, Apache & Docker hosts.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/#features" />}
                      className="group flex items-start gap-3 rounded-base border-2 border-border/40 p-3 transition-colors hover:border-border hover:bg-secondary-background"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-[1px_1px_0px_0px_var(--border)]">
                        <Lock className="size-4.5" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                          Egress Zero-Trust mTLS
                        </span>
                        <p className="text-[11px] text-foreground/75 leading-tight">
                          0 open inbound ports. Completely invisible to port scanners.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* 3. DOCUMENTATION DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-heading text-xs font-bold uppercase tracking-wider">
                  Docs
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[560px] grid-cols-2 gap-2 p-3">
                    <NavigationMenuLink
                      render={<Link href="/docs" />}
                      className="group flex items-start gap-3 rounded-base border-2 border-transparent p-3 transition-colors hover:border-border hover:bg-secondary-background"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                        <BookOpen className="size-4.5" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                          Docs Portal
                        </span>
                        <p className="text-[11px] text-foreground/75 leading-tight">
                          Handbook arsitektur keamanan, panduan instalasi &amp; referensi.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/docs/pasak-security-monitor" />}
                      className="group flex items-start gap-3 rounded-base border-2 border-transparent p-3 transition-colors hover:border-border hover:bg-secondary-background"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-card shadow-[1px_1px_0px_0px_var(--border)]">
                        <ShieldCheck className="size-4.5 text-main" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                          pasak-security-monitor
                        </span>
                        <p className="text-[11px] text-foreground/75 leading-tight">
                          29 panduan Spatie-compliant Laravel WAF &amp; webshell scanner.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/docs/pasak-sentinel" />}
                      className="group flex items-start gap-3 rounded-base border-2 border-transparent p-3 transition-colors hover:border-border hover:bg-secondary-background"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-card shadow-[1px_1px_0px_0px_var(--border)]">
                        <Terminal className="size-4.5 text-main" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                          Sentinel Daemon
                        </span>
                        <p className="text-[11px] text-foreground/75 leading-tight">
                          Setup kernel nftables, service systemd &amp; konfigurasi FIM.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/docs/api-reference/api-overview" />}
                      className="group flex items-start gap-3 rounded-base border-2 border-transparent p-3 transition-colors hover:border-border hover:bg-secondary-background"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-card shadow-[1px_1px_0px_0px_var(--border)]">
                        <Code2 className="size-4.5 text-main" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-black text-foreground group-hover:text-main">
                          REST API Reference
                        </span>
                        <p className="text-[11px] text-foreground/75 leading-tight">
                          Headless API endpoints untuk integrasi SPA dan bot reporting.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* 4. PRICING DIRECT LINK */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/#pricing" />}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "font-heading text-xs font-bold uppercase tracking-wider"
                  )}
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* 5. FAQ DIRECT LINK */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/#faq" />}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "font-heading text-xs font-bold uppercase tracking-wider"
                  )}
                >
                  FAQ
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right: Actions (Threat Map replaces GitHub, Theme, Sign In, Console CTA) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Prominent Threat Map Link replacing GitHub button */}
          <Link
            href="/threats-map"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "group relative hidden items-center gap-2 border-2 border-border bg-secondary-background font-heading text-xs font-black shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
            )}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-rose-600" />
            </span>
            <Globe2 className="size-3.5 text-rose-600 dark:text-rose-400" />
            <span className="text-foreground">Threat Map</span>
            <Badge
              variant="outline"
              className="border-rose-500/50 bg-rose-500/15 px-1 py-0 font-mono text-[9px] font-black text-rose-600 dark:text-rose-400"
            >
              3D LIVE
            </Badge>
          </Link>

          {/* Compact Threat Map Icon Button for Mobile screens */}
          <Link
            href="/threats-map"
            className="relative flex size-9 items-center justify-center rounded-base border-2 border-border bg-secondary-background shadow-[2px_2px_0px_0px_var(--border)] sm:hidden"
            aria-label="Launch 3D Threat Map"
          >
            <Globe2 className="size-4 text-rose-600 dark:text-rose-400" />
            <span className="absolute -top-1 -right-1 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
            </span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle size="icon-sm" />

          {/* Sign In (hidden on small screens, visible on md+) */}
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden items-center gap-1.5 border-2 border-border bg-background font-heading font-bold shadow-[2px_2px_0px_0px_var(--border)] md:inline-flex"
            )}
          >
            <LogIn className="size-3.5" />
            <span>Sign In</span>
          </Link>



          {/* Mobile Menu Hamburger Trigger (visible on lg:hidden) */}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Responsive) */}
      {mobileMenuOpen && (
        <div className="border-b-2 border-border bg-secondary-background/95 p-4 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-2">
            {/* Live 3D Threat Map Banner (Top in mobile drawer) */}
            <Link
              href="/threats-map"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-base border-2 border-rose-500/40 bg-rose-500/10 p-3 font-heading text-sm font-black text-rose-600 dark:text-rose-400 shadow-[2px_2px_0px_0px_var(--border)]"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-rose-600" />
                </span>
                <Globe2 className="size-4" />
                <span>Global Live Threat Map</span>
              </div>
              <Badge
                variant="outline"
                className="border-rose-500/50 bg-rose-500/20 font-mono text-[9px] font-black text-rose-600 dark:text-rose-400"
              >
                3D LIVE
              </Badge>
            </Link>

            {/* Accordion 1: Platform */}
            <div className="rounded-base border-2 border-border bg-background shadow-[2px_2px_0px_0px_var(--border)]">
              <button
                type="button"
                onClick={() => toggleMobileSection("platform")}
                className="flex w-full items-center justify-between p-3 font-heading text-xs font-black uppercase tracking-wider text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="size-3.5 text-main" />
                  <span>Platform Trinity</span>
                </div>
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform",
                    mobileSection === "platform" && "rotate-90"
                  )}
                />
              </button>
              {mobileSection === "platform" && (
                <div className="space-y-2 border-t-2 border-border p-3 bg-secondary-background/50">
                  <Link
                    href="/docs/pasak-sentinel"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    <span>pasak-sentinel (Go Kernel Daemon)</span>
                    <Badge variant="outline" className="font-mono text-[9px]">Go 1.24</Badge>
                  </Link>
                  <Link
                    href="/docs/pasak-security-monitor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    <span>pasak/shield (Laravel WAF &amp; Honeypot)</span>
                    <Badge variant="outline" className="font-mono text-[9px]">PHP</Badge>
                  </Link>
                  {/*<Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    <span>Pasak Cloud SOC Console</span>
                    <Badge variant="outline" className="font-mono text-[9px]">Cloud</Badge>
                  </Link>*/}
                </div>
              )}
            </div>

            {/* Accordion 2: Solutions */}
            <div className="rounded-base border-2 border-border bg-background shadow-[2px_2px_0px_0px_var(--border)]">
              <button
                type="button"
                onClick={() => toggleMobileSection("solutions")}
                className="flex w-full items-center justify-between p-3 font-heading text-xs font-black uppercase tracking-wider text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Zap className="size-3.5 text-amber-500" />
                  <span>Solutions</span>
                </div>
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform",
                    mobileSection === "solutions" && "rotate-90"
                  )}
                />
              </button>
              {mobileSection === "solutions" && (
                <div className="space-y-2 border-t-2 border-border p-3 bg-secondary-background/50">
                  <Link
                    href="/#vps-comparison"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    Linux VPS Immunity (&lt;20MB RAM)
                  </Link>
                  <Link
                    href="/#features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    FIM Auto-Healing (.env 0600 Auto-Lock)
                  </Link>
                  <Link
                    href="/#workloads"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    Web Server Hardening (Nginx, Caddy)
                  </Link>
                  <Link
                    href="/#features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    Egress-Only Zero-Trust mTLS
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion 3: Docs */}
            <div className="rounded-base border-2 border-border bg-background shadow-[2px_2px_0px_0px_var(--border)]">
              <button
                type="button"
                onClick={() => toggleMobileSection("docs")}
                className="flex w-full items-center justify-between p-3 font-heading text-xs font-black uppercase tracking-wider text-foreground"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="size-3.5 text-main" />
                  <span>Documentation</span>
                </div>
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform",
                    mobileSection === "docs" && "rotate-90"
                  )}
                />
              </button>
              {mobileSection === "docs" && (
                <div className="space-y-2 border-t-2 border-border p-3 bg-secondary-background/50">
                  <Link
                    href="/docs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    Portal Dokumentasi Resmi
                  </Link>
                  <Link
                    href="/docs/pasak-security-monitor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    Panduan pasak-security-monitor
                  </Link>
                  <Link
                    href="/docs/pasak-sentinel"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    Panduan Daemon pasak-sentinel
                  </Link>
                  <Link
                    href="/#comparison"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-bold text-foreground hover:text-main"
                  >
                    Benchmark vs Fail2ban &amp; SIEM
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Links: Pricing & FAQ */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-base border-2 border-border bg-background p-2.5 text-center font-heading text-xs font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main hover:text-main-foreground"
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-base border-2 border-border bg-background p-2.5 text-center font-heading text-xs font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main hover:text-main-foreground"
              >
                FAQ
              </Link>
            </div>

            {/* Mobile Auth & SOC CTAs */}
            <div className="my-2 flex flex-col gap-2 border-t-2 border-border pt-3">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "flex items-center justify-center gap-1.5 border-2 border-border font-heading font-bold shadow-[2px_2px_0px_0px_var(--border)]"
                  )}
                >
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/threats-map"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "flex items-center justify-center gap-1.5 border-2 border-border bg-secondary-background font-heading font-bold shadow-[2px_2px_0px_0px_var(--border)] text-rose-600 dark:text-rose-400"
                  )}
                >
                  <Globe2 className="size-4" />
                  <span>Threat Map</span>
                </Link>
              </div>
              {/*<Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "flex w-full items-center justify-center gap-1.5 font-heading font-black shadow-shadow"
                )}
              >
                <span>Launch SOC Console</span>
                <ArrowRight className="size-4" />
              </Link>*/}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
