"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const FIGURES = [
  { id: "hero", label: "01: Hero" },
  { id: "telemetry", label: "02: Telemetry" },
  { id: "vps-comparison", label: "03: Attack Vectors" },
  { id: "architecture", label: "04: Architecture" },
  { id: "features", label: "05: Armory" },
  { id: "deploy", label: "06: Deploy" },
  { id: "faq", label: "07: FAQ" },
]

export function StatusBar({ className }: { className?: string }) {
  const [activeFigure, setActiveFigure] = React.useState<string>("hero")
  const [tickerMessage, setTickerMessage] = React.useState<string>(
    "KERNEL IMMUNITY: 4/4 subsystems armed · 0 unhandled threats"
  )

  React.useEffect(() => {
    const handleScroll = () => {
      const figures = document.querySelectorAll("[data-figure]")
      const scrollPos = window.scrollY + 160

      for (let i = figures.length - 1; i >= 0; i--) {
        const el = figures[i] as HTMLElement
        if (el.offsetTop <= scrollPos) {
          const id = el.getAttribute("data-figure") || ""
          setActiveFigure(id)
          const status = el.getAttribute("data-status")
          if (status) {
            setTickerMessage(status)
          }
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 h-8 border-t border-lp-line-strong bg-lp-paper text-xs font-medium select-none backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-(--lp-max) items-stretch px-3 sm:px-6">
        {/* Status indicator and log message */}
        <div className="flex min-w-0 flex-1 items-center gap-2 font-mono text-xs tabular-nums text-lp-ink">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-lp-sun opacity-75" />
            <span className="relative inline-flex size-2 rounded-full border border-lp-ink bg-lp-sun" />
          </span>
          <span className="truncate text-lp-ink-2 font-normal">
            STATUS: <span className="text-lp-ink font-medium">{tickerMessage}</span>
          </span>
        </div>

        {/* Figure Jump Links */}
        <nav
          aria-label="Figures navigation"
          className="flex items-stretch divide-x divide-lp-line border-s border-lp-line max-lg:hidden"
        >
          {FIGURES.map((fig) => {
            const isActive = activeFigure === fig.id
            return (
              <a
                key={fig.id}
                href={`#${fig.id}`}
                className={cn(
                  "flex items-center px-3 font-mono text-xs transition-colors",
                  isActive
                    ? "bg-lp-ink text-lp-paper font-semibold"
                    : "text-lp-ink-2 hover:bg-lp-ink hover:text-lp-paper"
                )}
              >
                {fig.label}
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
