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
  showCorners = false,
  showFloatingStamps = false,
  floatingStamps = [],
}: SectionBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className
      )}
      aria-hidden="true"
    >
      {/* 1. Subtle Ambient Gradient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(56,189,248,0.06),transparent_70%)]" />

      {/* 2. Geometric Background Patterns */}
      {variant === "dots" && (
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_60%,transparent_100%)] [background-size:24px_24px] opacity-20 dark:opacity-10" />
      )}

      {variant === "grid" && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:3.5rem_3.5rem] opacity-15 dark:opacity-10" />
          <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent blur-sm" />
        </>
      )}

      {variant === "stripes" && (
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_16px,rgba(56,189,248,0.02)_16px,rgba(56,189,248,0.02)_32px)] opacity-40 dark:opacity-20" />
      )}

      {variant === "circuit" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] opacity-15 dark:opacity-10" />
          <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-sky-500/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-1/3 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
        </>
      )}

      {/* Optional Stamps */}
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
              className={cn(
                "absolute hidden opacity-20 transition-transform sm:block",
                posClass
              )}
            >
              <span className={cn("font-mono text-xl", stamp.color)}>
                {stamp.symbol}
              </span>
            </div>
          )
        })}

      {/* Corner Brackets */}
      {showCorners && (
        <>
          <div className="absolute top-3 left-3 size-3 border-t border-l border-border/40" />
          <div className="absolute top-3 right-3 size-3 border-t border-r border-border/40" />
          <div className="absolute bottom-3 left-3 size-3 border-b border-l border-border/40" />
          <div className="absolute right-3 bottom-3 size-3 border-r border-b border-border/40" />
        </>
      )}
    </div>
  )
}
