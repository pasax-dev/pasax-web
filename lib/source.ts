import type * as PageTree from "fumadocs-core/page-tree"
import {
  PRODUCTS_CONFIG,
  ALL_DOCS,
  findDocBySlug,
  isProductSlug,
} from "./docs-manifest"
import { getDocContent } from "./docs-service"

export interface PageData {
  title: string
  description: string
  category: string
  product: string
  toc: { title: string; url: string; depth: number }[]
  html: string
  rawContent: string
}

export interface SourcePage {
  data: PageData
  url: string
  slugs: string[]
}

export function getPageTree(): PageTree.Root {
  return {
    name: "Pasax Suite",
    children: Object.values(PRODUCTS_CONFIG).map((product) => ({
      type: "folder" as const,
      name: product.name,
      root: true,
      defaultOpen: true,
      children: product.categories.map((cat) => ({
        type: "folder" as const,
        name: cat.title,
        children: cat.items.map((item) => ({
          type: "page" as const,
          name: item.title,
          url: `/docs/${item.product}/${item.slug}`,
        })),
      })),
    })),
  };
}

export async function getPage(slugArr?: string[]): Promise<SourcePage | null> {
  const slugs = slugArr ?? []
  const slugStr = slugs.join("/")

  const doc = findDocBySlug(slugStr)
  if (!doc) return null

  const parsed = await getDocContent(slugStr)
  if (!parsed) return null

  return {
    data: {
      title: parsed.title,
      description: parsed.description,
      category: parsed.item.category,
      product: parsed.item.product,
      toc: parsed.headings.map((h) => ({
        title: h.text,
        url: `#${h.id}`,
        depth: h.level,
      })),
      html: parsed.html,
      rawContent: parsed.rawContent,
    },
    url: `/docs/${doc.product}/${doc.slug}`,
    slugs,
  }
}

export function generateParams() {
  const paths: { slug: string[] }[] = []
  for (const prodKey of Object.keys(PRODUCTS_CONFIG)) {
    paths.push({ slug: [prodKey] })
  }
  for (const doc of ALL_DOCS) {
    paths.push({ slug: [doc.product, ...doc.slug.split("/")] })
    paths.push({ slug: doc.slug.split("/") })
  }
  return paths
}

export const source = {
  getPageTree,
  getPage,
  generateParams,
}
