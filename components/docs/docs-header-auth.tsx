"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { LayoutDashboard } from "lucide-react"

export function DocsHeaderAuth() {
  const { status } = useSession()

  if (status === "authenticated") {
    return (
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-main px-2.5 py-1 font-mono text-xs font-bold text-black shadow-[1.5px_1.5px_0px_0px_var(--border)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
      >
        <LayoutDashboard className="size-3 stroke-[2.5]" />
        <span>Dashboard</span>
      </Link>
    )
  }

  return (
    <>
      <Link
        href="/login"
        className="inline-flex items-center font-mono text-xs font-semibold text-lp-ink/75 transition-colors hover:text-lp-ink"
      >
        <span>Masuk</span>
      </Link>
      <Link
        href="/register"
        className="inline-flex items-center rounded-sm border border-border bg-main px-2.5 py-1 font-mono text-xs font-bold text-black shadow-[1.5px_1.5px_0px_0px_var(--border)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
      >
        <span>Daftar</span>
      </Link>
    </>
  )
}
