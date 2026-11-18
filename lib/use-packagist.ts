"use client"

import * as React from "react"
import {
  type PackagistData,
  FALLBACK_PACKAGIST_DATA,
} from "./packagist"

// In-memory module cache to avoid redundant client fetches during page transitions
let cachedPackagistData: PackagistData | null = null

export function usePackagistData(initialData?: PackagistData) {
  const [data, setData] = React.useState<PackagistData>(() => {
    if (initialData) {
      cachedPackagistData = initialData
      return initialData
    }
    return cachedPackagistData || FALLBACK_PACKAGIST_DATA
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialData && !cachedPackagistData)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let isMounted = true

    // If initialData was passed, use it immediately
    if (initialData) {
      cachedPackagistData = initialData
      setData(initialData)
    }

    async function loadLiveData() {
      try {
        const res = await fetch("/api/packagist")
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const json: PackagistData = await res.json()
        if (isMounted && json?.latestVersion) {
          cachedPackagistData = json
          setData(json)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
        }
      }
    }

    loadLiveData()

    return () => {
      isMounted = false
    }
  }, [initialData])

  return { data, isLoading, error }
}
