import * as React from "react"
import { cn } from "@/lib/utils"

export function Ruler({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full h-8 border-t border-lp-line-strong select-none overflow-hidden",
        className
      )}
    >
      {/* 24px fine tick marks */}
      <div className="h-2 bg-[repeating-linear-gradient(to_right,var(--lp-line-strong)_0_1px,transparent_1px_24px)] opacity-60" />
      {/* 240px major tick marks */}
      <div className="absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(to_right,var(--lp-line-strong)_0_2px,transparent_2px_240px)] opacity-90" />
    </div>
  )
}
