import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
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
    <nav
      aria-label="Breadcrumbs"
      className="mb-6 flex flex-wrap items-center gap-1.5 font-mono text-xs text-lp-ink/60"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-lp-ink transition-colors"
        title="Beranda"
      >
        <Home className="size-3.5" />
      </Link>
      <ChevronRight className="size-3 text-lp-ink/30 shrink-0" />
      <Link
        href="/docs"
        className="hover:text-lp-ink transition-colors"
      >
        Dokumentasi
      </Link>
      {prodConfig && (
        <>
          <ChevronRight className="size-3 text-lp-ink/30 shrink-0" />
          <Link
            href={`/docs/${prodConfig.id}`}
            className="hover:text-lp-ink transition-colors"
          >
            {prodConfig.name}
          </Link>
        </>
      )}
      <ChevronRight className="size-3 text-lp-ink/30 shrink-0" />
      <span className="text-lp-ink/75">{category}</span>
      <ChevronRight className="size-3 text-lp-ink/30 shrink-0" />
      <span className="font-medium text-lp-ink truncate max-w-[200px] sm:max-w-xs">
        {title}
      </span>
    </nav>
  )
}
