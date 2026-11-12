import * as React from "react"
import { PublicNav } from "@/components/public/public-nav"
import { PublicFooter } from "@/components/public/public-footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full max-w-full flex-col bg-background text-foreground font-sans">
      <PublicNav />
      <main className="flex-1 w-full max-w-full">{children}</main>
      <PublicFooter />
    </div>
  )
}
