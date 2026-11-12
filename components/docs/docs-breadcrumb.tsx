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
    <nav className="mb-6 flex flex-wrap items-center gap-1.5 font-mono text-xs text-foreground/70">
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <Home className="size-3" />
        <span>Beranda</span>
      </Link>
      <ChevronRight className="size-3 text-foreground/40" />
      <Link
        href="/docs"
        className="flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <BookOpen className="size-3" />
        <span>Dokumentasi</span>
      </Link>
      {prodConfig && (
        <>
          <ChevronRight className="size-3 text-foreground/40" />
          <Link
            href={`/docs/${prodConfig.id}`}
            className="font-bold text-foreground/90 transition-colors hover:text-main"
          >
            {prodConfig.name}
          </Link>
        </>
      )}
      <ChevronRight className="size-3 text-foreground/40" />
      <span className="font-bold text-foreground/80">{category}</span>
      <ChevronRight className="size-3 text-foreground/40" />
      <span className="font-black text-main underline decoration-2 underline-offset-4">
        {title}
      </span>
    </nav>
  )
}
