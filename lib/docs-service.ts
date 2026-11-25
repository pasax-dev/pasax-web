import { marked } from "marked"
import { findDocBySlug, DocItem, ALL_DOCS } from "./docs-manifest"

export interface DocHeading {
  id: string
  text: string
  level: number
}

export interface ParsedDoc {
  item: DocItem
  title: string
  description: string
  html: string
  headings: DocHeading[]
  rawContent: string
}

const PASAX_API_URL =
  process.env.NEXT_PUBLIC_PASAX_API_URL ||
  process.env.PASAX_API_URL ||
  process.env.NEXT_PUBLIC_PASAK_API_URL ||
  process.env.PASAK_API_URL ||
  "https://pasax-service.vercel.app"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export async function getDocContent(slug: string): Promise<ParsedDoc | null> {
  const item = findDocBySlug(slug)
  if (!item) return null

  let title = item.title
  let description = item.description
  let markdownBody = ""

  // 1. Local filesystem priority for instant loading & offline resilience
  if (typeof window === "undefined") {
    try {
      const fs = require("fs")
      const path = require("path")
      const candidates = [
        path.join(process.cwd(), "docs", item.product, item.filePath),
        path.join(process.cwd(), "docs", item.filePath),
        path.join(process.cwd(), "docs", item.product, `${item.slug}.md`),
        path.join(process.cwd(), "docs", `${item.slug}.md`),
      ]
      for (const p of candidates) {
        if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
          const raw = fs.readFileSync(/*turbopackIgnore: true*/ p, "utf-8")
          markdownBody = raw.replace(/^---[\s\S]*?---\s*/, "")
          break
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. Fetch from Pasax Cloud API if local filesystem has no match
  if (!markdownBody) {
    try {
      const res = await fetch(
        `${PASAX_API_URL}/api/v1/docs/${item.product}/${item.slug}`,
        {
          next: { revalidate: 21600 },
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(3000),
        }
      )

      if (res.ok) {
        const data = await res.json()
        if (data?.ok && data?.doc) {
          title = data.doc.title || title
          description = data.doc.description || description
          markdownBody = data.doc.content || data.doc.rawContent || ""
        }
      }
    } catch {
      // Remote unavailable
    }
  }

  if (!markdownBody) {
    return null
  }

  // Transform Astro Starlight component syntax if present
  markdownBody = markdownBody
    .replace(/import\s+{[^}]+}\s+from\s+["'][^"']+["'];?/g, "")
    .replace(/<CardGrid>([\s\S]*?)<\/CardGrid>/g, "$1")
    .replace(
      /<Card\s+title=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Card>/g,
      "### $1\n\n$2\n"
    )

  // Extract headings
  const headings: DocHeading[] = []
  const tokens = marked.lexer(markdownBody)

  tokens.forEach((token) => {
    if (token.type === "heading" && (token.depth === 2 || token.depth === 3)) {
      const text = token.text.replace(/<[^>]+>/g, "").trim()
      const id = slugify(text)
      headings.push({
        id,
        text,
        level: token.depth,
      })
    }
  })

  // Configure marked renderer
  const renderer = new marked.Renderer()
  renderer.heading = ({ text, depth }) => {
    const cleanText = text.replace(/<[^>]+>/g, "").trim()
    const id = slugify(cleanText)
    if (depth === 2 || depth === 3) {
      return `
        <h${depth} id="${id}" class="group flex items-center scroll-mt-20">
          <a href="#${id}" class="no-underline text-inherit hover:underline">${text}</a>
          <a href="#${id}" class="ms-2 opacity-0 group-hover:opacity-100 text-lp-ink/40 hover:text-lp-ink font-mono text-sm transition-opacity" aria-label="Link to ${cleanText}">#</a>
        </h${depth}>
      `
    }
    return `<h${depth}>${text}</h${depth}>`
  }

  const html = await marked.parse(markdownBody, { renderer, gfm: true })

  return {
    item,
    title,
    description,
    html,
    headings,
    rawContent: markdownBody,
  }
}

export function getAllDocsList(): DocItem[] {
  return ALL_DOCS
}
