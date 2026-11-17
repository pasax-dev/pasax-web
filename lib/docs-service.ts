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

  // Fetch from Pasax Cloud API (Neon Serverless PostgreSQL Database)
  try {
    const res = await fetch(
      `${PASAX_API_URL}/api/v1/docs/${item.product}/${item.slug}`,
      {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
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
  } catch (err) {
    console.warn(
      `[DocsService] Failed to load doc '${slug}' from Neon API:`,
      err
    )
  }

  // Local filesystem fallback
  if (!markdownBody && typeof window === "undefined") {
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
    } catch (e) {
      // ignore
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
    .replace(
      /<LinkCard\s+title=["']([^"']+)["']\s+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/LinkCard>/g,
      "### [$1]($2)\n\n$3\n"
    )
    .replace(/<Steps>([\s\S]*?)<\/Steps>/g, "$1")
    .replace(/<Tabs>([\s\S]*?)<\/Tabs>/g, "$1")
    .replace(
      /<TabItem\s+label=["']([^"']+)["'][^>]*>([\s\S]*?)<\/TabItem>/g,
      "**$1**:\n\n$2\n"
    )

  // Normalize relative doc links to /docs/...
  ALL_DOCS.forEach((d) => {
    const slugWithoutPrefix = d.slug
    const regex1 = new RegExp(
      `\\]\\((\\.\\.\\/)*${slugWithoutPrefix}\\/?[\\)]`,
      "g"
    )
    markdownBody = markdownBody.replace(regex1, `](/docs/${slugWithoutPrefix})`)

    const slugLastPart = d.slug.split("/").pop()
    if (slugLastPart) {
      const regex2 = new RegExp(`\\]\\(${slugLastPart}\\/?[\\)]`, "g")
      markdownBody = markdownBody.replace(
        regex2,
        `](/docs/${slugWithoutPrefix})`
      )
    }
  })

  // Extract headings for Table of Contents
  const headings: DocHeading[] = []
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(markdownBody)) !== null) {
    const level = match[1].length
    const text = match[2].replace(/<[^>]+>/g, "").trim()
    const id = slugify(text)
    headings.push({ id, text, level })
  }

  // Parse GitHub Callout blockquotes into Fumadocs Callout structure
  markdownBody = markdownBody
    .replace(
      />\s*\[!NOTE\]\s*\n((?:>.*(?:\n|$))*)/g,
      '<div class="callout callout-note"><div class="callout-title"><svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><span>Catatan Penting</span></div><div class="callout-body">\n$1\n</div></div>'
    )
    .replace(
      />\s*\[!TIP\]\s*\n((?:>.*(?:\n|$))*)/g,
      '<div class="callout callout-tip"><div class="callout-title"><svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg><span>Tips Keamanan</span></div><div class="callout-body">\n$1\n</div></div>'
    )
    .replace(
      />\s*\[!IMPORTANT\]\s*\n((?:>.*(?:\n|$))*)/g,
      '<div class="callout callout-important"><div class="callout-title"><svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span>Perhatian Khusus</span></div><div class="callout-body">\n$1\n</div></div>'
    )
    .replace(
      />\s*\[!WARNING\]\s*\n((?:>.*(?:\n|$))*)/g,
      '<div class="callout callout-warning"><div class="callout-title"><svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>Peringatan</span></div><div class="callout-body">\n$1\n</div></div>'
    )
    .replace(
      />\s*\[!CAUTION\]\s*\n((?:>.*(?:\n|$))*)/g,
      '<div class="callout callout-caution"><div class="callout-title"><svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>Risiko Keamanan Tinggi</span></div><div class="callout-body">\n$1\n</div></div>'
    )

  // Configure marked renderer for headings with IDs and hover anchor links
  const renderer = new marked.Renderer()
  renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
    const cleanText = text.replace(/<[^>]+>/g, "").trim()
    const id = slugify(cleanText)
    return `<h${depth} id="${id}" class="group flex items-center scroll-mt-20"><a href="#${id}" class="no-underline text-inherit hover:underline">${text}</a><a href="#${id}" class="ms-2 opacity-0 group-hover:opacity-100 text-lp-ink/40 hover:text-lp-ink font-mono text-sm transition-opacity" aria-label="Tautan ke bagian ${cleanText}">#</a></h${depth}>`
  }

  // Convert markdown to HTML
  const parsedHtml = marked.parse(markdownBody, {
    renderer,
    gfm: true,
    breaks: false,
  }) as string

  return {
    item,
    title,
    description,
    html: parsedHtml,
    headings,
    rawContent: markdownBody,
  }
}
