"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlitchProps {
  children: string
  className?: string
}

export function Glitch({ children, className }: GlitchProps) {
  const [isGlitching, setIsGlitching] = React.useState(false)

  React.useEffect(() => {
    // Initial glitch on boot
    const bootTimer = setTimeout(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 450)
    }, 800)

    // Periodic micro-glitch
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 380)
    }, 7000)

    return () => {
      clearTimeout(bootTimer)
      clearInterval(interval)
    }
  }, [])

  return (
    <span
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
      className={cn("relative inline-block select-none cursor-default", className)}
    >
      <span className="relative z-10">{children}</span>
      {isGlitching && (
        <>
          {/* Top slice shifted right */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[45%] overflow-hidden bg-lp-paper text-lp-orange translate-x-[3px] opacity-90 select-none z-20 pointer-events-none"
            style={{ clipPath: "inset(0 0 0 0)" }}
          >
            {children}
          </span>
          {/* Middle inverted slice shifted left */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-[35%] h-[35%] overflow-hidden bg-lp-ink text-lp-paper -translate-x-[4px] opacity-90 select-none z-20 pointer-events-none"
            style={{ clipPath: "inset(0 0 0 0)" }}
          >
            {children}
          </span>
          {/* Bottom slice */}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[40%] overflow-hidden bg-lp-paper text-lp-orange translate-x-[2px] opacity-80 select-none z-20 pointer-events-none"
            style={{ clipPath: "inset(0 0 0 0)" }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  )
}
