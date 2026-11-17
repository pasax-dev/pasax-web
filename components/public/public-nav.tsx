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
import { Button } from "@/components/ui/button"
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
import { SearchTrigger } from "@/components/search/search-trigger"

export function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [mobileSection, setMobileSection] = React.useState<string | null>(null)

  const toggleMobileSection = (key: string) => {
    setMobileSection((prev) => (prev === key ? null : key))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-14 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Left: Brand Logo & Identifier */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm transition-transform group-hover:scale-105">
            <Image
              src="/icon.png"
              alt="Pasax Suite Icon"
              width={32}
              height={32}
              className="size-full object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              PASAX<span className="text-sky-500">.</span>
            </span>
            <span className="hidden items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-sky-500 sm:inline-flex dark:text-sky-400">
              FRAMEWORK
            </span>
          </div>
        </Link>

        {/* Center: Fumadocs Refined NavigationMenu (Desktop) */}
        <nav className="hidden items-center lg:flex">
          <NavigationMenu className="border-0 bg-transparent p-0">
            <NavigationMenuList className="gap-1">
              {/* 1. PLATFORM / PRODUCTS DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-sans text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Platform
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-12 gap-3 rounded-2xl border border-border/50 bg-popover/95 p-3 shadow-xl backdrop-blur-xl">
                    {/* Left Featured Card */}
                    <div className="col-span-5 flex flex-col justify-between rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent p-4 text-foreground">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-sky-500 uppercase">
                          <Sparkles className="size-3 text-sky-500" />
                          <span>TRINITY MESH</span>
                        </div>
                        <h4 className="font-heading text-base font-bold text-foreground">
                          Triple-Layer Defense
                        </h4>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          Synchronized immunity connecting in-app Laravel WAF,
                          raw Go kernel packet drops, and cloud fleet SOC
                          telemetry.
                        </p>
                      </div>

                      <div className="mt-4 border-t border-border/40 pt-3">
                        <NavigationMenuLink
                          render={<Link href="/#architecture" />}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-500 hover:text-sky-400"
                        >
                          <span>Explore Architecture</span>
                          <ArrowRight className="size-3.5" />
                        </NavigationMenuLink>
                      </div>
                    </div>

                    {/* Right Product Items */}
                    <div className="col-span-7 flex flex-col gap-1.5">
                      <NavigationMenuLink
                        render={<Link href="/docs/pasax-sentinel" />}
                        className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-sky-500">
                          <Terminal className="size-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-sans text-xs font-semibold text-foreground group-hover:text-sky-500">
                              pasax-sentinel
                            </span>
                            <Badge
                              variant="outline"
                              className="h-4 border-sky-500/30 px-1 font-mono text-[9px] text-sky-500"
                            >
                              Go 1.24
                            </Badge>
                          </div>
                          <p className="text-[11px] leading-tight text-muted-foreground">
                            Sub-0.2ms kernel packet drop &amp; FIM auto-lock.
                          </p>
                        </div>
                      </NavigationMenuLink>

                      <NavigationMenuLink
                        render={<Link href="/docs/pasax-secure-monitor" />}
                        className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-amber-500">
                          <Server className="size-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-sans text-xs font-semibold text-foreground group-hover:text-amber-500">
                              pasax/shield
                            </span>
                            <Badge
                              variant="outline"
                              className="h-4 border-amber-500/30 px-1 font-mono text-[9px] text-amber-500"
                            >
                              PHP WAF
                            </Badge>
                          </div>
                          <p className="text-[11px] leading-tight text-muted-foreground">
                            Zero-dependency Laravel application firewall.
                          </p>
                        </div>
                      </NavigationMenuLink>

                      <NavigationMenuLink
                        render={<Link href="/dashboard" />}
                        className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-purple-500">
                          <CloudCog className="size-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-sans text-xs font-semibold text-foreground group-hover:text-purple-500">
                              Fleet SOC Cloud
                            </span>
                            <Badge
                              variant="outline"
                              className="h-4 border-purple-500/30 px-1 font-mono text-[9px] text-purple-500"
                            >
                              Cloud
                            </Badge>
                          </div>
                          <p className="text-[11px] leading-tight text-muted-foreground">
                            Centralized telemetry, attack radar &amp; fleet
                            rules.
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* 2. SOLUTIONS DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-sans text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[540px] grid-cols-2 gap-2 rounded-2xl border border-border/50 bg-popover/95 p-3 shadow-xl backdrop-blur-xl">
                    <NavigationMenuLink
                      render={<Link href="/#vps-comparison" />}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-sky-500">
                        <Zap className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-sans text-xs font-semibold text-foreground group-hover:text-sky-500">
                          Linux VPS Immunity
                        </span>
                        <p className="text-[11px] leading-tight text-muted-foreground">
                          Sub-0.2ms drops &lt;20MB RAM for any 1GB VPS.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/#features" />}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-purple-500">
                        <FileSearch className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-sans text-xs font-semibold text-foreground group-hover:text-purple-500">
                          FIM Auto-Healing
                        </span>
                        <p className="text-[11px] leading-tight text-muted-foreground">
                          Microsecond .env tamper detection &amp; auto-lock to
                          0600.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/#workloads" />}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-amber-500">
                        <Layers className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-sans text-xs font-semibold text-foreground group-hover:text-amber-500">
                          Production Web Stacks
                        </span>
                        <p className="text-[11px] leading-tight text-muted-foreground">
                          Hardened profiles for Nginx, Caddy, Apache &amp;
                          Docker.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/#features" />}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-emerald-500">
                        <Lock className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-sans text-xs font-semibold text-foreground group-hover:text-emerald-500">
                          Zero-Trust mTLS
                        </span>
                        <p className="text-[11px] leading-tight text-muted-foreground">
                          0 open inbound ports. Invisible to port scanners.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* 3. DOCUMENTATION DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-sans text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Docs
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[540px] grid-cols-2 gap-2 rounded-2xl border border-border/50 bg-popover/95 p-3 shadow-xl backdrop-blur-xl">
                    <NavigationMenuLink
                      render={<Link href="/docs" />}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-sky-500">
                        <BookOpen className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-sans text-xs font-semibold text-foreground group-hover:text-sky-500">
                          Docs Portal
                        </span>
                        <p className="text-[11px] leading-tight text-muted-foreground">
                          Arsitektur keamanan, panduan instalasi &amp;
                          referensi.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/docs/pasax-secure-monitor" />}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-amber-500">
                        <ShieldCheck className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-sans text-xs font-semibold text-foreground group-hover:text-amber-500">
                          pasax-secure-monitor
                        </span>
                        <p className="text-[11px] leading-tight text-muted-foreground">
                          29 panduan Spatie-compliant Laravel WAF &amp; scanner.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/docs/pasax-sentinel" />}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-sky-500">
                        <Terminal className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-sans text-xs font-semibold text-foreground group-hover:text-sky-500">
                          Sentinel Daemon
                        </span>
                        <p className="text-[11px] leading-tight text-muted-foreground">
                          Setup kernel nftables, systemd &amp; FIM config.
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      render={<Link href="/docs/api-reference/api-overview" />}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-emerald-500">
                        <Code2 className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-sans text-xs font-semibold text-foreground group-hover:text-emerald-500">
                          REST API Reference
                        </span>
                        <p className="text-[11px] leading-tight text-muted-foreground">
                          Headless API endpoints untuk integrasi SPA dan bot.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* 4. BENCHMARK DIRECT LINK */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/#comparison" />}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "font-sans text-xs font-medium text-muted-foreground hover:text-foreground"
                  )}
                >
                  Benchmark
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* 5. FAQ DIRECT LINK */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/#faq" />}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "font-sans text-xs font-medium text-muted-foreground hover:text-foreground"
                  )}
                >
                  FAQ
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Global Fumadocs Search */}
          <SearchTrigger variant="navbar" className="hidden sm:inline-flex" />
          <SearchTrigger variant="icon" className="sm:hidden" />

          {/* Prominent Threat Map Link */}
          <Link
            href="/threats-map"
            className="group relative hidden items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-sans text-xs font-medium text-rose-500 transition-all hover:scale-[1.02] hover:bg-rose-500/20 sm:inline-flex dark:text-rose-400"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
            </span>
            <Globe2 className="size-3.5" />
            <span>Threat Map</span>
          </Link>

          {/* Compact Threat Map Icon Button for Mobile */}
          <Link
            href="/threats-map"
            className="relative flex size-8 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-500 sm:hidden"
            aria-label="Launch 3D Threat Map"
          >
            <Globe2 className="size-4" />
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle size="icon-sm" />

          {/* Sign In */}
          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md transition-all hover:border-border hover:bg-muted/80 md:inline-flex"
          >
            <LogIn className="size-3.5" />
            <span>Sign In</span>
          </Link>

          {/* Mobile Menu Hamburger Trigger */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="rounded-full lg:hidden"
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
        <div className="border-b border-border/40 bg-background/95 p-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-2">
            {/* Fumadocs Search in Mobile Drawer */}
            <SearchTrigger
              variant="sidebar"
              placeholder="Cari dokumentasi & fitur..."
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Live 3D Threat Map Banner */}
            <Link
              href="/threats-map"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-500 dark:text-rose-400"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
                </span>
                <Globe2 className="size-4" />
                <span>Global Live Threat Map</span>
              </div>
              <Badge
                variant="outline"
                className="border-rose-500/40 text-[9px] text-rose-500"
              >
                3D LIVE
              </Badge>
            </Link>

            {/* Accordion 1: Platform */}
            <div className="rounded-xl border border-border/50 bg-card/40">
              <button
                type="button"
                onClick={() => toggleMobileSection("platform")}
                className="flex w-full items-center justify-between p-3 text-xs font-semibold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="size-3.5 text-sky-500" />
                  <span>Platform Trinity</span>
                </div>
                <ChevronRight
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    mobileSection === "platform" && "rotate-90"
                  )}
                />
              </button>
              {mobileSection === "platform" && (
                <div className="space-y-2 border-t border-border/40 p-3">
                  <Link
                    href="/docs/pasax-sentinel"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <span>pasax-sentinel (Go Kernel Daemon)</span>
                    <Badge variant="outline" className="font-mono text-[9px]">
                      Go 1.24
                    </Badge>
                  </Link>
                  <Link
                    href="/docs/pasax-secure-monitor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <span>pasax/shield (Laravel WAF &amp; Honeypot)</span>
                    <Badge variant="outline" className="font-mono text-[9px]">
                      PHP
                    </Badge>
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion 2: Solutions */}
            <div className="rounded-xl border border-border/50 bg-card/40">
              <button
                type="button"
                onClick={() => toggleMobileSection("solutions")}
                className="flex w-full items-center justify-between p-3 text-xs font-semibold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Zap className="size-3.5 text-amber-500" />
                  <span>Solutions</span>
                </div>
                <ChevronRight
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    mobileSection === "solutions" && "rotate-90"
                  )}
                />
              </button>
              {mobileSection === "solutions" && (
                <div className="space-y-2 border-t border-border/40 p-3">
                  <Link
                    href="/#vps-comparison"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Linux VPS Immunity (&lt;20MB RAM)
                  </Link>
                  <Link
                    href="/#features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    FIM Auto-Healing (.env 0600 Auto-Lock)
                  </Link>
                  <Link
                    href="/#workloads"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Web Server Hardening (Nginx, Caddy)
                  </Link>
                  <Link
                    href="/#features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Egress-Only Zero-Trust mTLS
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion 3: Docs */}
            <div className="rounded-xl border border-border/50 bg-card/40">
              <button
                type="button"
                onClick={() => toggleMobileSection("docs")}
                className="flex w-full items-center justify-between p-3 text-xs font-semibold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="size-3.5 text-sky-500" />
                  <span>Documentation</span>
                </div>
                <ChevronRight
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    mobileSection === "docs" && "rotate-90"
                  )}
                />
              </button>
              {mobileSection === "docs" && (
                <div className="space-y-2 border-t border-border/40 p-3">
                  <Link
                    href="/docs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Portal Dokumentasi Resmi
                  </Link>
                  <Link
                    href="/docs/pasax-secure-monitor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Panduan pasax-secure-monitor
                  </Link>
                  <Link
                    href="/docs/pasax-sentinel"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Panduan Daemon pasax-sentinel
                  </Link>
                  <Link
                    href="/#comparison"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Benchmark vs Fail2ban &amp; SIEM
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Links: Benchmark & FAQ */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/#comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-border/50 bg-card/40 p-2.5 text-center text-xs font-medium text-foreground transition-colors hover:bg-muted/60"
              >
                Benchmark
              </Link>
              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-border/50 bg-card/40 p-2.5 text-center text-xs font-medium text-foreground transition-colors hover:bg-muted/60"
              >
                FAQ
              </Link>
            </div>

            {/* Mobile Auth & Threat Map CTAs */}
            <div className="my-2 flex flex-col gap-2 border-t border-border/40 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-border/60 bg-muted/40 p-2 text-xs font-medium text-foreground"
                >
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/threats-map"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 p-2 text-xs font-medium text-rose-500"
                >
                  <Globe2 className="size-4" />
                  <span>Threat Map</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
