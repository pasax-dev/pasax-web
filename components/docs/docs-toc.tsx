"use client"

import * as React from "react"
import { DocHeading } from "@/lib/docs-service"
import { AlignLeft, ArrowUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function DocsToc({
  headings,
  className,
}: {
  headings: DocHeading[]
  className?: string
}) {
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0% -60% 0%" }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings || headings.length === 0) return null

  return (
    <aside
      className={cn(
        "sticky top-12 hidden h-[calc(100vh-3rem)] w-64 shrink-0 overflow-y-auto border-s border-lp-line bg-lp-paper/60 p-6 text-xs xl:block",
        className
      )}
    >
      <div className="mb-3.5 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wider text-lp-ink/70 uppercase">
        <AlignLeft className="size-3.5 text-lp-ink/50" />
        <span>Di Halaman Ini</span>
      </div>

      <nav className="space-y-1 border-s border-lp-line ps-3">
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={cn(
                "line-clamp-1 block py-1 text-xs transition-colors",
                h.level === 3 ? "ps-2.5 text-[11px]" : "",
                isActive
                  ? "-ms-[13px] ps-[11px] border-s-2 border-lp-orange dark:border-lp-yellow font-medium text-lp-orange dark:text-lp-yellow"
                  : "text-lp-ink/65 hover:text-lp-ink"
              )}
            >
              {h.text}
            </a>
          )
        })}
      </nav>

      {/* Fumadocs-style TOC footer widget */}
      <div className="mt-8 space-y-3 border-t border-lp-line pt-4">
        <div className="rounded-lg border border-lp-line bg-lp-paper-2/50 p-2.5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-lp-orange dark:text-lp-yellow uppercase">
            <Sparkles className="size-3" />
            <span>Pasax Trinity Defense</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-lp-ink/70">
            WAF PHP, Linux Kernel nftables, dan Cloud Console tersinkronisasi.
          </p>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex cursor-pointer items-center gap-1.5 font-mono text-[11px] text-lp-ink/60 hover:text-lp-ink transition-colors"
        >
          <ArrowUp className="size-3.5" />
          <span>Kembali ke atas</span>
        </button>
      </div>
    </aside>
  )
}
