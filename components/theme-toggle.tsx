"use client"

import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleThemeWithTransition } from "@/lib/theme-transition"

export function ThemeToggle({
  className,
}: {
  className?: string
  size?: string
}) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === "dark"

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleThemeWithTransition({
      currentTheme,
      setTheme,
      event: e,
    })
  }

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Loading theme toggle"
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg border border-lp-line bg-lp-paper text-lp-ink/40 opacity-60",
          className
        )}
      >
        <Sun className="size-4 text-amber-600/40" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative inline-flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-lp-line bg-lp-paper text-lp-ink transition-colors hover:bg-lp-paper-2",
        className
      )}
    >
      <Sun className="size-4 scale-100 rotate-0 text-amber-600 transition-all duration-300 dark:scale-0 dark:-rotate-90 dark:text-amber-400" />
      <Moon className="absolute size-4 scale-0 rotate-90 text-lp-ink transition-all duration-300 dark:scale-100 dark:rotate-0 dark:text-slate-200" />
      <span className="sr-only">
        {isDark ? "Switch to light theme" : "Switch to dark theme"}
      </span>
    </button>
  )
}
