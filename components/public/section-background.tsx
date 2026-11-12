"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionBackgroundProps {
  variant?: "dots" | "grid" | "stripes" | "circuit" | "minimal"
  className?: string
  showCorners?: boolean
  showFloatingStamps?: boolean
  floatingStamps?: {
    symbol: string
    color: string
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    rotate?: number
  }[]
}

export function SectionBackground({
  variant = "dots",
  className,
  showCorners = true,
  showFloatingStamps = false,
  floatingStamps = [
    { symbol: "✦", color: "text-amber-400", position: "top-left", rotate: -12 },
    { symbol: "✱", color: "text-main", position: "bottom-right", rotate: 18 },
  ],
}: SectionBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className
      )}
      aria-hidden="true"
    >
      {/* 1. Geometric Background Patterns */}
      {variant === "dots" && (
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25 dark:opacity-15" />
      )}

      {variant === "grid" && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20 dark:opacity-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="absolute inset-x-0 h-16 animate-[laser-scan_7s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-main/10 to-transparent blur-[1px]" />
        </>
      )}

      {variant === "stripes" && (
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_16px,rgba(0,153,255,0.04)_16px,rgba(0,153,255,0.04)_32px)] opacity-50 dark:opacity-30" />
      )}

      {variant === "circuit" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] opacity-20 dark:opacity-10" />
          <div className="absolute top-1/3 inset-x-0 h-px bg-gradient-to-r from-transparent via-main/25 to-transparent" />
          <div className="absolute bottom-1/3 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
        </>
      )}

      {/* 2. Floating Neobrutalism Stamp Accents */}
      {showFloatingStamps &&
        floatingStamps.map((stamp, idx) => {
          const posClass =
            stamp.position === "top-left"
              ? "top-8 left-8"
              : stamp.position === "top-right"
                ? "top-8 right-8"
                : stamp.position === "bottom-left"
                  ? "bottom-8 left-8"
                  : "bottom-8 right-8"

          return (
            <div
              key={idx}
              style={{ transform: `rotate(${stamp.rotate || 0}deg)` }}
              className={cn("absolute hidden sm:block opacity-40 transition-transform", posClass)}
            >
              <span className={cn("font-heading text-2xl font-black", stamp.color)}>
                {stamp.symbol}
              </span>
            </div>
          )
        })}

      {/* 3. Neobrutalist Corner Brackets */}
      {showCorners && (
        <>
          <div className="absolute top-3 left-3 size-4 border-t-2 border-l-2 border-border/70" />
          <div className="absolute top-3 right-3 size-4 border-t-2 border-r-2 border-border/70" />
          <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-border/70" />
          <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-border/70" />
        </>
      )}
    </div>
  )
}
