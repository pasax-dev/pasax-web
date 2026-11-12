"use client"

import * as React from "react"
import { DocHeading } from "@/lib/docs-service"
import { List, ArrowUp } from "lucide-react"
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
        "hidden xl:block w-64 shrink-0 p-4 border-l-2 border-border/60 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto text-xs",
        className
      )}
    >
      <div className="flex items-center gap-1.5 font-heading text-xs font-black uppercase tracking-wider text-foreground/80 mb-3">
        <List className="size-3.5 text-main" />
        <span>Daftar Isi Halaman</span>
      </div>

      <nav className="space-y-1.5 border-l-2 border-border/40 pl-2.5">
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={cn(
                "block py-0.5 transition-colors line-clamp-1",
                h.level === 3 ? "pl-3 text-[11px]" : "font-semibold",
                isActive
                  ? "text-main font-bold translate-x-0.5"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              {h.text}
            </a>
          )
        })}
      </nav>

      <div className="mt-8 pt-4 border-t-2 border-border/40">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground text-[11px] font-mono font-medium"
        >
          <ArrowUp className="size-3" />
          <span>Kembali ke atas</span>
        </button>
      </div>
    </aside>
  )
}
