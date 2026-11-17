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
        "sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-l-2 border-border bg-background/50 p-5 text-xs xl:block",
        className
      )}
    >
      <div className="mb-4 flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 font-heading text-xs font-black tracking-wider text-foreground uppercase shadow-[2px_2px_0px_0px_var(--border)]">
        <List className="size-3.5 stroke-[2.5] text-foreground" />
        <span>Daftar Isi</span>
      </div>

      <nav className="space-y-1 border-l-2 border-border/40 pl-2">
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={cn(
                "line-clamp-1 block rounded-base px-2 py-1 text-xs transition-all",
                h.level === 3 ? "pl-3 text-[11px]" : "",
                isActive
                  ? "border border-border bg-main font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]"
                  : "font-bold text-foreground/85 hover:bg-secondary-background hover:text-foreground"
              )}
            >
              {h.text}
            </a>
          )
        })}
      </nav>

      <div className="mt-8 border-t-2 border-border pt-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex cursor-pointer items-center gap-1.5 font-mono text-[11px] font-bold text-foreground hover:underline"
        >
          <ArrowUp className="size-3.5 stroke-[2.5]" />
          <span>Kembali ke atas</span>
        </button>
      </div>
    </aside>
  )
}
