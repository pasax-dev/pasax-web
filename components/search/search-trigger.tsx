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
          "flex size-9 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none",
          className
        )}
        {...props}
      >
        <Search className="size-4" />
      </button>
    )
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={openSearch}
        className={cn(
          "group flex h-9 w-full items-center justify-between rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2 truncate text-foreground/80 group-hover:text-foreground">
          <Search className="size-3.5 shrink-0 text-foreground" />
          <span className="truncate">{placeholder}</span>
        </span>
        <kbd className="shrink-0 rounded border border-border bg-secondary-background px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground shadow-[1px_1px_0px_0px_var(--border)]">
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
        "group inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 font-mono text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none",
        className
      )}
      title="Cari dokumentasi & fitur (⌘K)"
      {...props}
    >
      <Search className="size-3.5 text-foreground transition-transform group-hover:scale-110" />
      <span className="hidden md:inline">Cari...</span>
      <kbd className="hidden rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px] font-bold text-foreground shadow-[1px_1px_0px_0px_var(--border)] sm:inline-flex">
        ⌘K
      </kbd>
    </button>
  )
}
