"use client"

import * as React from "react"
import { FumadocsSearchDialog } from "./fumadocs-search-dialog"

interface SearchContextValue {
  isOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
}

const SearchContext = React.createContext<SearchContextValue | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const openSearch = React.useCallback(() => setIsOpen(true), [])
  const closeSearch = React.useCallback(() => setIsOpen(false), [])
  const toggleSearch = React.useCallback(() => setIsOpen((prev) => !prev), [])

  // Global hotkey listener: ⌘K, Ctrl+K, and '/'
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        return
      }

      // '/' trigger when not inside an editable form element
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null
        const isEditable =
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.tagName === "SELECT" ||
          target?.isContentEditable

        if (!isEditable) {
          e.preventDefault()
          setIsOpen(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      openSearch,
      closeSearch,
      toggleSearch,
    }),
    [isOpen, openSearch, closeSearch, toggleSearch]
  )

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
      <FumadocsSearchDialog open={isOpen} onOpenChange={setIsOpen} />
    </SearchContext.Provider>
  )
}

export function useSearch(): SearchContextValue {
  const context = React.useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
