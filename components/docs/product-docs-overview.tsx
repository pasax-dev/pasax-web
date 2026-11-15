import Link from "next/link"
import {
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { PRODUCTS_CONFIG, getDocSectionsForProduct } from "@/lib/docs-manifest"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ProductType = "core" | "pasax-secure-monitor" | "pasax-sentinel"

interface ProductDocsOverviewProps {
  product: ProductType
}

const quickSnippets: Record<ProductType, { label: string; cmd: string }> = {
  "pasax-secure-monitor": {
    label: "Composer Require",
    cmd: "composer require pasax-dev/secure-monitor",
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
    <div className="w-full max-w-full flex-1 space-y-10 px-4 py-8 sm:px-8">
      {/* Product Hero Header */}
      <section className="relative overflow-hidden rounded-base border-2 border-border bg-secondary-background p-6 shadow-[4px_4px_0px_0px_var(--border)] sm:p-8">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-2 border-border bg-main font-mono text-xs font-black text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]"
            >
              DOKUMENTASI PRODUK
            </Badge>
            <Badge
              variant="outline"
              className="bg-background font-mono text-xs font-bold"
            >
              {info.badge}
            </Badge>
            <Badge
              variant="outline"
              className="bg-background font-mono text-xs font-bold"
            >
              {totalArticles} PANDUAN TEKNIS
            </Badge>
          </div>

          <h1 className="font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            {info.name}
          </h1>

          <p className="max-w-4xl text-sm leading-relaxed text-foreground/80 sm:text-base">
            {info.description}
          </p>

          {snippet && (
            <div className="pt-2">
              <span className="font-mono text-xs font-bold text-foreground/70">
                {snippet.label}:
              </span>
              <div className="flex items-center justify-between rounded-base border-2 border-border bg-background p-3 font-mono text-xs font-bold text-foreground shadow-[2px_2px_0px_0px_var(--border)]">
                <code>{snippet.cmd}</code>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href={firstDocHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 font-heading font-black"
              )}
            >
              <span>Mulai Membaca Panduan</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/docs"
              className={cn(
                buttonVariants({ variant: "neutral", size: "lg" }),
                "gap-2 font-heading font-bold"
              )}
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
            Daftar Bab & Artikel — {info.name}
          </h2>
          <p className="text-xs text-foreground/75 sm:text-sm">
            Pilih topik untuk membuka dokumentasi lengkap dengan blok kode dan
            diagram.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((sec) => (
            <div
              key={sec.slug}
              className="flex flex-col justify-between space-y-3 rounded-base border-2 border-border bg-background p-5 shadow-[3px_3px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-black text-foreground">
                    {sec.title}
                  </h3>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {sec.items.length} artikel
                  </Badge>
                </div>

                <ul className="space-y-1.5 border-t border-border/40 pt-2.5">
                  {sec.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${product}/${item.slug}`}
                        className="group flex items-center justify-between py-1 text-xs text-foreground/80 hover:text-foreground"
                      >
                        <span className="line-clamp-1 font-medium group-hover:text-main group-hover:underline">
                          {item.title}
                        </span>
                        <ArrowRight className="size-3 text-foreground/30 opacity-0 transition-opacity group-hover:opacity-100" />
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
