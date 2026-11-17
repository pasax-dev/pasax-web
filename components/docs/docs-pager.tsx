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
    <div className="mt-12 grid grid-cols-1 gap-5 border-t-2 border-border pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/docs/${prev.product}/${prev.slug}`}
          className="group flex flex-col justify-between rounded-base border-2 border-border bg-card p-5 shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <span className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-foreground/80 group-hover:text-foreground">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Sebelumnya ({prev.category})</span>
          </span>
          <span className="line-clamp-1 font-heading text-base font-black text-foreground underline-offset-4 transition-all group-hover:underline group-hover:decoration-main group-hover:decoration-4">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link
          href={`/docs/${next.product}/${next.slug}`}
          className="group flex flex-col items-end justify-between rounded-base border-2 border-border bg-card p-5 text-right shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none sm:col-start-2"
        >
          <span className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-foreground/80 group-hover:text-foreground">
            <span>Selanjutnya ({next.category})</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="line-clamp-1 font-heading text-base font-black text-foreground underline-offset-4 transition-all group-hover:underline group-hover:decoration-main group-hover:decoration-4">
            {next.title}
          </span>
        </Link>
      )}
    </div>
  )
}
