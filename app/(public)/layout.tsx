import * as React from "react"
import { PublicNav } from "@/components/public/public-nav"
import { PublicFooter } from "@/components/public/public-footer"
import { StatusBar } from "@/components/fumadocs/status-bar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="landing flex min-h-screen w-full max-w-full flex-col bg-lp-paper pb-8 font-sans text-lp-ink selection:bg-lp-yellow selection:text-lp-on-yellow">
      {/* Top Floating Glassmorphic Nav */}
      <PublicNav />

      {/* Fumadocs Sheet: Framed with 1px border lines and 1400px maximum width */}
      <div
        data-sheet=""
        className="mx-auto w-full max-w-(--lp-max) flex-1 border-lp-line lg:border-x"
      >
        <main className="w-full max-w-full flex-1">{children}</main>
      </div>

      {/* Footer */}
      <PublicFooter />

      {/* Fumadocs Fixed Bottom Status Bar */}
      <StatusBar />
    </div>
  )
}
