"use client"

import * as React from "react"
import { toggleThemeWithTransition } from "@/lib/theme-transition"

export type ThemeValue = "light" | "dark" | "system"

export interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
  themes?: string[]
  forcedTheme?: string
}

export interface UseThemeResult {
  theme: string | undefined
  setTheme: (theme: string | ((prev: string) => string)) => void
  resolvedTheme: string | undefined
  systemTheme: "light" | "dark" | undefined
  themes: string[]
  forcedTheme?: string
}

const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)"

const ThemeContext = React.createContext<UseThemeResult | undefined>(undefined)

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light"
}

function applyThemeToDom(
  resolved: string,
  attribute: string,
  themes: string[],
  disableTransitionOnChange: boolean
) {
  if (typeof document === "undefined") return

  let cleanupTransition: (() => void) | null = null
  if (disableTransitionOnChange) {
    const style = document.createElement("style")
    style.appendChild(
      document.createTextNode(
        "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
      )
    )
    document.head.appendChild(style)
    cleanupTransition = () => {
      window.getComputedStyle(document.body)
      setTimeout(() => {
        if (style.parentNode) style.parentNode.removeChild(style)
      }, 1)
    }
  }

  const root = document.documentElement
  if (attribute === "class") {
    root.classList.remove(...themes)
    if (resolved) root.classList.add(resolved)
  } else if (attribute.startsWith("data-")) {
    if (resolved) root.setAttribute(attribute, resolved)
    else root.removeAttribute(attribute)
  }

  if (resolved === "light" || resolved === "dark") {
    root.style.colorScheme = resolved
  }

  cleanupTransition?.()
}

function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
  storageKey = "theme",
  themes = ["light", "dark"],
  forcedTheme,
}: ThemeProviderProps) {
  const existing = React.useContext(ThemeContext)
  if (existing) {
    return <>{children}</>
  }

  return (
    <ThemeProviderInner
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      storageKey={storageKey}
      themes={themes}
      forcedTheme={forcedTheme}
    >
      {children}
    </ThemeProviderInner>
  )
}

function ThemeProviderInner({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
  storageKey = "theme",
  themes = ["light", "dark"],
  forcedTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<string>(defaultTheme)
  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">("dark")

  // Hydrate stored theme & system preference safely after mount
  React.useEffect(() => {
    const sys = getSystemTheme()
    setSystemTheme(sys)
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) {
        setThemeState(saved)
      }
    } catch {
      // ignore storage errors
    }
  }, [storageKey])

  // Listen to OS color-scheme changes
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const media = window.matchMedia(DARK_MEDIA_QUERY)
    const onChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  // Sync across tabs
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        setThemeState(e.newValue || defaultTheme)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [storageKey, defaultTheme])

  const activeTheme = forcedTheme ?? theme
  const resolvedTheme =
    activeTheme === "system" && enableSystem ? systemTheme : activeTheme

  React.useEffect(() => {
    applyThemeToDom(resolvedTheme, attribute, themes, disableTransitionOnChange)
  }, [resolvedTheme, attribute, themes, disableTransitionOnChange])

  const setTheme = React.useCallback(
    (next: string | ((prev: string) => string)) => {
      setThemeState((prev) => {
        const value = typeof next === "function" ? next(prev) : next
        try {
          window.localStorage.setItem(storageKey, value)
        } catch {
          // ignore storage errors
        }
        return value
      })
    },
    [storageKey]
  )

  const contextValue = React.useMemo<UseThemeResult>(
    () => ({
      theme: activeTheme,
      setTheme,
      resolvedTheme,
      systemTheme: enableSystem ? systemTheme : undefined,
      themes: enableSystem ? [...themes, "system"] : themes,
      forcedTheme,
    }),
    [
      activeTheme,
      setTheme,
      resolvedTheme,
      enableSystem,
      systemTheme,
      themes,
      forcedTheme,
    ]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme(): UseThemeResult {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    return {
      theme: undefined,
      setTheme: () => {},
      resolvedTheme: undefined,
      systemTheme: undefined,
      themes: ["light", "dark"],
    }
  }
  return ctx
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (!event.key || event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      toggleThemeWithTransition({
        currentTheme: resolvedTheme,
        setTheme,
      })
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider, useTheme }
