import * as React from "react"
import { DocsSidebar } from "@/components/docs/docs-sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full max-w-full min-h-[calc(100vh-4rem)]">
      <DocsSidebar />
      <div className="flex-1 min-w-0 flex flex-col w-full max-w-full">{children}</div>
    </div>
  )
}
