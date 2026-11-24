import React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground antialiased [--font-heading:var(--font-sans)] selection:bg-main selection:text-black">
      {children}
    </div>
  )
}
