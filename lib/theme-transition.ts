import * as React from "react"
import { flushSync } from "react-dom"

/**
 * Triggers Fumadocs authentic Bayer-dither view transition when toggling theme.
 * The 4x4 ordered dither animation (lp-dither-in) is rendered via CSS mask-image
 * on ::view-transition-new(root) for pixel-grid dissolution across the viewport.
 * If View Transitions API is unsupported or prefers-reduced-motion is active,
 * falls back to immediate theme switch without animation.
 */
export function toggleThemeWithTransition({
  currentTheme,
  setTheme,
}: {
  currentTheme: string | undefined
  setTheme: (theme: string) => void
  event?: React.MouseEvent<HTMLElement> | MouseEvent
}) {
  const nextTheme = currentTheme === "dark" ? "light" : "dark"

  if (
    typeof document === "undefined" ||
    !("startViewTransition" in document) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    setTheme(nextTheme)
    return
  }

  const doc = document as Document & {
    startViewTransition: (callback: () => void) => {
      ready: Promise<void>
      finished: Promise<void>
    }
  }

  // Trigger browser View Transition; CSS ::view-transition-new(root) executes lp-dither-in
  doc.startViewTransition(() => {
    flushSync(() => {
      setTheme(nextTheme)
    })
  })
}
