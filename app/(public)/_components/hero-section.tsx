"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Figure } from "@/components/fumadocs/figure"
import { Command } from "@/components/fumadocs/command"
import { Glitch } from "@/components/fumadocs/glitch"
import { HeroStage } from "@/components/fumadocs/hero-stage"

const invert =
  "transition-none hover:bg-lp-ink hover:text-lp-paper focus-visible:bg-lp-ink focus-visible:text-lp-paper focus-visible:outline-none"

const PLATFORMS = [
  { name: "Linux Kernel 5.4+", href: "/docs" },
  { name: "eBPF Ring-0", href: "/docs" },
  { name: "Debian / Ubuntu", href: "/docs" },
  { name: "Rocky Linux / RHEL", href: "/docs" },
  { name: "AlmaLinux", href: "/docs" },
  { name: "Alpine", href: "/docs" },
  { name: "Arch", href: "/docs" },
]

export function HeroSection() {
  return (
    <Figure
      id="hero"
      aria-label="Pasax Suite"
      status="ready: sentinel kernel defense online"
      className="@container grid min-h-[calc(100svh-var(--lp-menu-h))] grid-rows-[auto_1fr_auto] items-center gap-x-12 px-4 pb-(--lp-status-h) sm:px-6 lg:grid-cols-2 lg:grid-rows-[1fr_auto] lg:px-8"
    >
      <div className="py-8 lg:self-center lg:py-16">
        {/* Fumadocs Signature Large Asymmetric Headline */}
        <h1 className="text-[clamp(2.5rem,7vw,5rem)] leading-[1.08] font-light tracking-tight text-lp-ink">
          Armored{" "}
          <span className="font-medium text-lp-orange">
            <Glitch>VPS Defense</Glitch>
          </span>
          ,<br />
          in seconds.
        </h1>

        {/* Subtitle in clean Fumadocs ink-2 style */}
        <p className="mt-6 max-w-xl text-base leading-relaxed font-normal text-lp-ink-2 sm:text-lg">
          Stop webshells, brute-force bots, and zero-day exploits directly at
          the Linux kernel. Combines sub-0.2ms nftables drops, 11ms file locks,
          and an autonomous mesh—using less than 20MB RAM.
        </p>

        {/* Fumadocs Action Buttons Row */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/docs"
            className={`inline-flex h-11 items-center justify-center border border-lp-line-strong bg-lp-yellow px-5 font-medium text-lp-on-yellow max-sm:w-full ${invert}`}
          >
            Get started
          </Link>
          <Command
            command="curl -fsSL https://get.pasax.is-a.dev | bash"
            className="max-sm:w-full"
          />
          <Link
            href="/threats-map"
            className={`-ms-2 inline-flex h-11 items-center gap-1 px-3 font-medium underline decoration-lp-line-strong underline-offset-4 ${invert}`}
          >
            Live Threat Radar
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>

        {/* Supported Platforms Line */}
        <p className="mt-6 text-xs text-lp-ink-2 sm:text-sm">
          Runs on{" "}
          {PLATFORMS.map((platform, i) => (
            <span key={platform.name}>
              {i > 0 && <span className="opacity-50"> · </span>}
              <Link
                href={platform.href}
                className={`whitespace-nowrap text-lp-ink ${invert}`}
              >
                {platform.name}
              </Link>
            </span>
          ))}
        </p>
      </div>

      {/* Fumadocs Asymmetric Hero Stage */}
      <div className="py-6 lg:py-12">
        <HeroStage />
      </div>

      {/* Fumadocs Iconic Bottom Ruler Seam with 24px and 240px Tick Gradients */}
      <div
        aria-hidden
        className="relative col-span-full -mx-4 h-10 overflow-hidden border-t border-lp-line-strong select-none sm:-mx-6 lg:-mx-8"
      >
        <div className="h-1.5 bg-[repeating-linear-gradient(to_right,var(--lp-line-strong)_0_1px,transparent_1px_24px)] opacity-70" />
        <div className="absolute inset-x-0 top-0 h-2.5 bg-[repeating-linear-gradient(to_right,var(--lp-line-strong)_0_2px,transparent_2px_240px)] opacity-95" />
      </div>
    </Figure>
  )
}
