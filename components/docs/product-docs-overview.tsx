import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { PRODUCTS_CONFIG, getDocSectionsForProduct } from "@/lib/docs-manifest"

export type ProductType = "core" | "pasax-secure-monitor" | "pasax-sentinel"

interface ProductDocsOverviewProps {
  product: ProductType
}

const quickSnippets: Record<ProductType, { label: string; cmd: string }> = {
  "pasax-secure-monitor": {
    label: "Composer Require",
    cmd: "composer require pasax/secure-monitor",
  },
  "pasax-sentinel": {
    label: "Single Binary Download",
    cmd: "curl -sSL https://get.pasax.is-a.dev/sentinel.sh | sudo bash",
  },
  core: {
    label: "Full Stack Deployment",
    cmd: "pnpm dlx pasax-cli init --with-sentinel",
  },
}

export function ProductDocsOverview({ product }: ProductDocsOverviewProps) {
  const info = PRODUCTS_CONFIG[product]
  const sections = getDocSectionsForProduct(product)
  const snippet = quickSnippets[product]

  // First available document link
  const firstDocHref =
    sections.length > 0 && sections[0].items.length > 0
      ? `/docs/${product}/${sections[0].items[0].slug}`
      : `/docs/${product}`

  const totalArticles = sections.reduce((acc, sec) => acc + sec.items.length, 0)

  return (
    <div className="w-full max-w-full flex-1 space-y-10 px-4 py-8 sm:px-8 lg:px-12">
      {/* Product Hero Header */}
      <section className="relative overflow-hidden rounded-base border-2 border-border bg-secondary-background p-6 shadow-[6px_6px_0px_0px_var(--border)] sm:p-10">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="-rotate-1 rounded-base border-2 border-border bg-amber-300 px-3 py-1 font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)]">
              DOKUMENTASI PRODUK
            </span>
            <span className="rounded-base border-2 border-border bg-background px-2.5 py-0.5 font-mono text-[11px] font-bold text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)]">
              {info.badge}
            </span>
            <span className="rounded-base border-2 border-border bg-background px-2.5 py-0.5 font-mono text-[11px] font-bold text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)]">
              {totalArticles} PANDUAN TEKNIS
            </span>
          </div>

          <h1 className="font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            {info.name}
          </h1>

          <p className="max-w-4xl text-sm leading-relaxed font-medium text-foreground sm:text-base lg:text-lg">
            {info.description}
          </p>

          {snippet && (
            <div className="pt-2">
              <span className="font-mono text-xs font-bold text-foreground">
                {snippet.label}:
              </span>
              <div className="mt-1 flex items-center justify-between rounded-base border-2 border-border bg-[#070b14] p-3 font-mono text-xs font-bold text-emerald-400 shadow-[3px_3px_0px_0px_var(--border)]">
                <code>{snippet.cmd}</code>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href={firstDocHref}
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-5 py-2.5 font-heading text-sm font-black text-black shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <span>Mulai Membaca Panduan</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-5 py-2.5 font-heading text-sm font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <BookOpen className="size-4" />
              <span>Direktori Semua Produk</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories & Chapter Directory */}
      <div className="space-y-6">
        <div className="border-b-2 border-border pb-3">
          <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">
            Daftar Bab &amp; Artikel — {info.name}
          </h2>
          <p className="text-xs font-medium text-foreground sm:text-sm">
            Pilih topik untuk membuka dokumentasi lengkap dengan blok kode dan
            diagram.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((sec) => (
            <div
              key={sec.slug}
              className="flex flex-col justify-between space-y-4 rounded-base border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--border)]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-border pb-3">
                  <h3 className="font-heading text-base font-black text-foreground">
                    {sec.title}
                  </h3>
                  <span className="rounded-base border-2 border-border bg-secondary-background px-2 py-0.5 font-mono text-[10px] font-black shadow-[1px_1px_0px_0px_var(--border)]">
                    {sec.items.length} artikel
                  </span>
                </div>

                <ul className="space-y-2 pt-1">
                  {sec.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${product}/${item.slug}`}
                        className="group flex items-center justify-between rounded-base px-2 py-1 text-xs font-semibold text-foreground transition-all hover:bg-secondary-background hover:text-foreground"
                      >
                        <span className="line-clamp-1 group-hover:underline group-hover:decoration-main group-hover:decoration-3">
                          {item.title}
                        </span>
                        <ArrowRight className="size-3.5 text-foreground transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
