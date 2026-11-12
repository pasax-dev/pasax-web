import Link from "next/link"
import { DocItem } from "@/lib/docs-manifest"
import { ArrowLeft, ArrowRight } from "lucide-react"

export function DocsPager({
  prev,
  next,
}: {
  prev: DocItem | null
  next: DocItem | null
}) {
  if (!prev && !next) return null

  return (
    <div className="mt-12 grid grid-cols-1 gap-4 border-t-2 border-border pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/docs/${prev.product}/${prev.slug}`}
          className="group flex flex-col rounded-base border-2 border-border bg-secondary-background p-4 shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border)]"
        >
          <span className="mb-1 flex items-center gap-1.5 font-mono text-xs font-bold text-foreground/60 group-hover:text-foreground">
            <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
            <span>Sebelumnya ({prev.category})</span>
          </span>
          <span className="line-clamp-1 font-heading text-sm font-black text-foreground group-hover:text-main">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link
          href={`/docs/${next.product}/${next.slug}`}
          className="group flex flex-col items-end rounded-base border-2 border-border bg-secondary-background p-4 text-right shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border)] sm:col-start-2"
        >
          <span className="mb-1 flex items-center gap-1.5 font-mono text-xs font-bold text-foreground/60 group-hover:text-foreground">
            <span>Selanjutnya ({next.category})</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="line-clamp-1 font-heading text-sm font-black text-foreground group-hover:text-main">
            {next.title}
          </span>
        </Link>
      )}
    </div>
  )
}
