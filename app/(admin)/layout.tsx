import React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground antialiased selection:bg-main selection:text-black [--font-heading:var(--font-sans)]">
      {children}
    </div>
  )
}
