"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const LANDING_FIGURES = [
  { id: "hero", label: "01: Hero" },
  { id: "telemetry", label: "02: Telemetry" },
  { id: "vps-comparison", label: "03: Attack Vectors" },
  { id: "architecture", label: "04: Architecture" },
  { id: "features", label: "05: Armory" },
  { id: "deploy", label: "06: Deploy" },
  { id: "faq", label: "07: FAQ" },
]

const DOCS_NAV = [
  { href: "/docs/pasax-secure-monitor", label: "01: WAF Monitor" },
  { href: "/docs/pasax-sentinel", label: "02: Sentinel Daemon" },
  { href: "/docs/core", label: "03: Suite Core" },
]

export function StatusBar({ className }: { className?: string }) {
  const pathname = usePathname()
  const isDocs = pathname.startsWith("/docs")

  const [activeFigure, setActiveFigure] = React.useState<string>("hero")
  const [tickerMessage, setTickerMessage] = React.useState<string>(
    isDocs
      ? "DOCS ONLINE: 3 Modules · 29 Technical Guides Active"
      : "KERNEL IMMUNITY: 4/4 subsystems armed · 0 unhandled threats"
  )

  React.useEffect(() => {
    if (isDocs) {
      setTickerMessage("DOCS ONLINE: 3 Modules · 29 Technical Guides Active")
      return
    }

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
  }, [isDocs])

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 h-8 border-t border-lp-line bg-lp-paper/95 text-xs font-medium select-none backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-(--lp-max) items-stretch px-3 sm:px-6">
        {/* Status indicator and log message */}
        <div className="flex min-w-0 flex-1 items-center gap-2 font-mono text-xs tabular-nums text-lp-ink">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="truncate text-lp-ink/70 font-normal">
            STATUS:{" "}
            <span className="text-lp-ink font-medium">{tickerMessage}</span>
          </span>
        </div>

        {/* Figure Jump Links or Docs Module Links */}
        <nav
          aria-label="Navigation status links"
          className="flex items-stretch divide-x divide-lp-line border-s border-lp-line max-lg:hidden"
        >
          {isDocs
            ? DOCS_NAV.map((doc) => {
                const isActive = pathname.startsWith(doc.href)
                return (
                  <Link
                    key={doc.href}
                    href={doc.href}
                    className={cn(
                      "flex items-center px-3 font-mono text-xs transition-colors",
                      isActive
                        ? "bg-lp-ink text-lp-paper font-semibold"
                        : "text-lp-ink/70 hover:bg-lp-paper-2 hover:text-lp-ink"
                    )}
                  >
                    {doc.label}
                  </Link>
                )
              })
            : LANDING_FIGURES.map((fig) => {
                const isActive = activeFigure === fig.id
                return (
                  <a
                    key={fig.id}
                    href={`#${fig.id}`}
                    className={cn(
                      "flex items-center px-3 font-mono text-xs transition-colors",
                      isActive
                        ? "bg-lp-ink text-lp-paper font-semibold"
                        : "text-lp-ink/70 hover:bg-lp-ink hover:text-lp-paper"
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
