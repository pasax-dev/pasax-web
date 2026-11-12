"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle({
  className,
  size = "icon-sm",
}: {
  className?: string
  size?: "icon" | "icon-xs" | "icon-sm" | "icon-lg"
}) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const current = resolvedTheme || theme
    setTheme(current === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        aria-label="Loading theme toggle"
        className={cn(
          "border-2 border-border bg-secondary-background text-foreground shadow-shadow opacity-70",
          className
        )}
      >
        <span className="size-4 block" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme (D)" : "Switch to dark theme (D)"}
      title={isDark ? "Switch to light theme (Hotkey: D)" : "Switch to dark theme (Hotkey: D)"}
      className={cn(
        "border-2 border-border bg-secondary-background text-foreground shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none transition-transform",
        className
      )}
    >
      {isDark ? (
        <Sun className="size-4 text-yellow-400 stroke-[2.5]" />
      ) : (
        <Moon className="size-4 text-foreground stroke-[2.5]" />
      )}
    </Button>
  )
}

