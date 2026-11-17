import Link from "next/link"
import { ChevronRight, Home, BookOpen } from "lucide-react"
import { PRODUCTS_CONFIG } from "@/lib/docs-manifest"

export function DocsBreadcrumb({
  category,
  title,
  product,
}: {
  category: string
  title: string
  product?: string
}) {
  const prodConfig = product ? PRODUCTS_CONFIG[product] : null

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs text-foreground">
      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-2.5 py-1 font-bold text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
      >
        <Home className="size-3.5" />
        <span>Beranda</span>
      </Link>
      <ChevronRight className="size-3 text-foreground/70" />
      <Link
        href="/docs"
        className="flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-2.5 py-1 font-bold text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
      >
        <BookOpen className="size-3.5" />
        <span>Dokumentasi</span>
      </Link>
      {prodConfig && (
        <>
          <ChevronRight className="size-3 text-foreground/70" />
          <Link
            href={`/docs/${prodConfig.id}`}
            className="rounded-base border-2 border-border bg-amber-300 px-2.5 py-1 font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            {prodConfig.name}
          </Link>
        </>
      )}
      <ChevronRight className="size-3 text-foreground/70" />
      <span className="rounded-base border-2 border-border bg-secondary-background px-2.5 py-1 font-bold text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)]">
        {category}
      </span>
      <ChevronRight className="size-3 text-foreground/70" />
      <span className="rounded-base border-2 border-border bg-main px-2.5 py-1 font-black text-black shadow-[1.5px_1.5px_0px_0px_var(--border)]">
        {title}
      </span>
    </nav>
  )
}
