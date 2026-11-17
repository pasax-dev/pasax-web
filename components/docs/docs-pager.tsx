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
    <div className="mt-12 grid grid-cols-1 gap-4 border-t border-lp-line pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/docs/${prev.product}/${prev.slug}`}
          className="group flex flex-col justify-between rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 transition-all hover:bg-lp-paper-2 hover:border-lp-orange/40"
        >
          <span className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-lp-ink/60 transition-colors group-hover:text-lp-ink">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Sebelumnya ({prev.category})</span>
          </span>
          <span className="line-clamp-1 font-heading text-sm font-semibold text-lp-ink transition-colors group-hover:text-lp-orange dark:group-hover:text-lp-yellow">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link
          href={`/docs/${next.product}/${next.slug}`}
          className="group flex flex-col items-end justify-between rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 text-right transition-all hover:bg-lp-paper-2 hover:border-lp-orange/40 sm:col-start-2"
        >
          <span className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-lp-ink/60 transition-colors group-hover:text-lp-ink">
            <span>Selanjutnya ({next.category})</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="line-clamp-1 font-heading text-sm font-semibold text-lp-ink transition-colors group-hover:text-lp-orange dark:group-hover:text-lp-yellow">
            {next.title}
          </span>
        </Link>
      )}
    </div>
  )
}
