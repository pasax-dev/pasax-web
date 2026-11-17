"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { useSearch } from "./search-provider"
import { cn } from "@/lib/utils"

interface SearchTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "navbar" | "sidebar" | "icon" | "compact"
  placeholder?: string
}

export function SearchTrigger({
  variant = "navbar",
  placeholder = "Cari dokumen & fitur...",
  className,
  ...props
}: SearchTriggerProps) {
  const { openSearch } = useSearch()

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={openSearch}
        aria-label="Cari dokumentasi (⌘K)"
        title="Cari dokumentasi & fitur (⌘K)"
        className={cn(
          "flex size-8 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-ink hover:bg-lp-paper-2 transition-colors cursor-pointer",
          className
        )}
        {...props}
      >
        <Search className="size-3.5 text-lp-ink/70" />
      </button>
    )
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={openSearch}
        className={cn(
          "group flex h-9 w-full items-center justify-between rounded-lg border border-lp-line bg-lp-paper-2/40 px-3 font-mono text-xs text-lp-ink/75 hover:bg-lp-paper-2 hover:text-lp-ink transition-colors cursor-pointer",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2 truncate">
          <Search className="size-3.5 shrink-0 text-lp-ink/50 group-hover:text-lp-ink" />
          <span className="truncate">{placeholder}</span>
        </span>
        <kbd className="shrink-0 rounded border border-lp-line bg-lp-paper px-1.5 py-0.5 font-mono text-[10px] text-lp-ink/60">
          ⌘K
        </kbd>
      </button>
    )
  }

  // Default navbar variant
  return (
    <button
      type="button"
      onClick={openSearch}
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3 py-1.5 font-mono text-xs text-lp-ink/80 hover:bg-lp-paper-2 hover:text-lp-ink transition-colors cursor-pointer",
        className
      )}
      title="Cari dokumentasi & fitur (⌘K)"
      {...props}
    >
      <Search className="size-3.5 text-lp-ink/60 transition-transform group-hover:scale-105" />
      <span className="hidden sm:inline">{placeholder || "Cari..."}</span>
      <kbd className="hidden rounded border border-lp-line bg-lp-paper px-1.5 py-0.5 font-mono text-[9px] text-lp-ink/60 sm:inline-flex">
        ⌘K
      </kbd>
    </button>
  )
}
