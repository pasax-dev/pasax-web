import { notFound } from "next/navigation"
import { Metadata } from "next"
import {
  PRODUCTS_CONFIG,
  getDocNavigation,
  isProductSlug,
} from "@/lib/docs-manifest"
import { source } from "@/lib/source"
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb"
import { DocsContentView } from "@/components/docs/docs-content-view"
import { DocsPager } from "@/components/docs/docs-pager"
import { DocsToc } from "@/components/docs/docs-toc"
import {
  ProductDocsOverview,
  type ProductType,
} from "@/components/docs/product-docs-overview"

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slugStr = resolvedParams.slug.join("/")

  if (isProductSlug(slugStr)) {
    const prod = PRODUCTS_CONFIG[slugStr]
    return {
      title: `Dokumentasi Resmi ${prod.name} — Pasax Suite`,
      description: prod.description,
    }
  }

  const page = await source.getPage(resolvedParams.slug)
  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan — Pasax Dokumentasi",
    }
  }

  const prodName = PRODUCTS_CONFIG[page.data.product]?.name || "Pasax"
  return {
    title: `${page.data.title} — ${prodName} Dokumentasi`,
    description: page.data.description,
  }
}

export default async function DocDynamicPage({ params }: PageProps) {
  const resolvedParams = await params
  const slugStr = resolvedParams.slug.join("/")

  // Case 1: Product Dedicated Overview (/docs/pasax-secure-monitor, /docs/pasax-sentinel, /docs/core)
  if (isProductSlug(slugStr)) {
    const product = PRODUCTS_CONFIG[slugStr]
    return <ProductDocsOverview product={product.id as ProductType} />
  }

  // Case 2: Document Article Page via source loader
  const page = await source.getPage(resolvedParams.slug)

  if (!page) {
    notFound()
  }

  const { prev, next } = getDocNavigation(slugStr)

  return (
    <div className="flex w-full max-w-full min-w-0 flex-1 justify-between">
      <div className="w-full max-w-4xl min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 xl:max-w-5xl 2xl:max-w-6xl">
        <DocsBreadcrumb
          category={page.data.category}
          title={page.data.title}
          product={page.data.product}
        />

        <DocsContentView
          title={page.data.title}
          description={page.data.description}
          category={page.data.category}
          html={page.data.html}
          slug={page.url.replace(/^\/docs\//, "")}
        />

        <DocsPager prev={prev} next={next} />
      </div>

      <DocsToc
        headings={page.data.toc.map((t) => ({
          id: t.url.replace(/^#/, ""),
          text: t.title,
          level: t.depth,
        }))}
      />
    </div>
  )
}
