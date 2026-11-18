"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { PublicFooter } from "./public-footer"

export function ConditionalFooter() {
  const pathname = usePathname()

  // On the landing page (/), the Fumadocs <Start /> section already renders the complete footer & wordmark
  if (pathname === "/") return null

  return <PublicFooter />
}
