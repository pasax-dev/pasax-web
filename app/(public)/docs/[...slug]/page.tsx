import { notFound } from "next/navigation"
import { Metadata } from "next"
import {
  ALL_DOCS,
  PRODUCTS_CONFIG,
  findDocBySlug,
  getDocNavigation,
  isProductSlug,
} from "@/lib/docs-manifest"
import { getDocContent } from "@/lib/docs-service"
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

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = []

  // 1. Dedicated product roots: /docs/pasak-security-monitor, /docs/pasak-sentinel, /docs/core
  for (const prodKey of Object.keys(PRODUCTS_CONFIG)) {
    paths.push({ slug: [prodKey] })
  }

  // 2. Product-scoped doc pages: /docs/pasak-security-monitor/getting-started/introduction, etc.
  for (const doc of ALL_DOCS) {
    paths.push({ slug: [doc.product, ...doc.slug.split("/")] })
    // Direct slug for backward compatibility
    paths.push({ slug: doc.slug.split("/") })
  }

  return paths
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slugStr = resolvedParams.slug.join("/")

  if (isProductSlug(slugStr)) {
    const prod = PRODUCTS_CONFIG[slugStr]
    return {
      title: `Dokumentasi Resmi ${prod.name} — Pasak Suite`,
      description: prod.description,
    }
  }

  const doc = findDocBySlug(slugStr)
  if (!doc) {
    return {
      title: "Halaman Tidak Ditemukan — Pasak Dokumentasi",
    }
  }

  const prodName = PRODUCTS_CONFIG[doc.product]?.name || "Pasak"
  return {
    title: `${doc.title} — ${prodName} Dokumentasi`,
    description: doc.description,
  }
}

export default async function DocDynamicPage({ params }: PageProps) {
  const resolvedParams = await params
  const slugStr = resolvedParams.slug.join("/")

  // Case 1: Product Dedicated Overview (/docs/pasak-security-monitor, /docs/pasak-sentinel, /docs/core)
  if (isProductSlug(slugStr)) {
    const product = PRODUCTS_CONFIG[slugStr]
    return <ProductDocsOverview product={product.id as ProductType} />
  }

  // Case 2: Document Article Page
  const parsed = await getDocContent(slugStr)

  if (!parsed) {
    notFound()
  }

  const { prev, next } = getDocNavigation(slugStr)

  return (
    <div className="flex w-full max-w-full min-w-0 flex-1 justify-between">
      <div className="w-full max-w-full min-w-0 flex-1 px-4 py-6 sm:px-8 lg:px-10">
        <DocsBreadcrumb
          category={parsed.item.category}
          title={parsed.title}
          product={parsed.item.product}
        />

        <DocsContentView
          title={parsed.title}
          description={parsed.description}
          category={parsed.item.category}
          html={parsed.html}
          slug={parsed.item.slug}
        />

        <DocsPager prev={prev} next={next} />
      </div>

      <DocsToc headings={parsed.headings} />
    </div>
  )
}
