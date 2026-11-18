"use client"

import * as React from "react"
import {
  Clock,
  Copy,
  Check,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  FileText,
} from "lucide-react"
import { type PackagistData } from "@/lib/packagist"
import { usePackagistData } from "@/lib/use-packagist"

export function DocsContentView({
  title,
  description,
  category,
  html,
  slug,
  initialPackagist,
}: {
  title: string
  description: string
  category: string
  html: string
  slug: string
  initialPackagist?: PackagistData
}) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [copiedDoc, setCopiedDoc] = React.useState(false)
  const [feedback, setFeedback] = React.useState<"yes" | "no" | null>(null)
  const { data: packagistData } = usePackagistData(initialPackagist)

  // Attach Fumadocs-style code header & copy button to all <pre> code blocks
  React.useEffect(() => {
    if (!contentRef.current) return

    const preElements = contentRef.current.querySelectorAll("pre")
    preElements.forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-block-wrapper")) return

      const codeEl = pre.querySelector("code")
      const classList = codeEl ? Array.from(codeEl.classList) : []
      const langClass = classList.find((c) => c.startsWith("language-"))
      const lang = langClass ? langClass.replace("language-", "") : "code"

      const wrapper = document.createElement("div")
      wrapper.className =
        "code-block-wrapper not-prose my-5 overflow-hidden rounded-xl border border-lp-line bg-[#121210] shadow-sm"

      const header = document.createElement("div")
      header.className =
        "flex items-center justify-between border-b border-[rgba(236,234,226,0.08)] bg-[#181816] px-4 py-2 text-xs font-mono text-[#eceae2]/70"

      const langSpan = document.createElement("span")
      langSpan.className =
        "font-medium uppercase tracking-wider text-[11px] text-[#eceae2]/60"
      langSpan.textContent = lang

      const copyBtn = document.createElement("button")
      copyBtn.type = "button"
      copyBtn.className =
        "cursor-pointer rounded px-2 py-0.5 text-[11px] transition-colors hover:bg-[rgba(236,234,226,0.1)] hover:text-white"
      copyBtn.textContent = "Copy"

      copyBtn.addEventListener("click", () => {
        const textToCopy = pre.innerText || ""
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.textContent = "Copied!"
          setTimeout(() => {
            copyBtn.textContent = "Copy"
          }, 2000)
        })
      })

      header.appendChild(langSpan)
      header.appendChild(copyBtn)

      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(header)
      wrapper.appendChild(pre)
    })
  }, [html])

  const copyPageMarkdown = () => {
    const text = `# ${title}\n\n${description}\n\nURL: ${typeof window !== "undefined" ? window.location.href : ""}`
    navigator.clipboard.writeText(text)
    setCopiedDoc(true)
    setTimeout(() => setCopiedDoc(false), 2000)
  }

  // Derive repo URL and version badge based on category or slug
  const isSentinel = slug.includes("sentinel")
  const isCore = slug.includes("core")

  const repoUrl = isSentinel
    ? "https://github.com/pasax-dev/pasax-sentinel"
    : isCore
      ? "https://github.com/pasax-dev/pasax-suit"
      : packagistData.repository ||
        "https://github.com/pasax-dev/pasax-secure-monitor-laravel"

  const versionBadge = isSentinel
    ? "v1.0.0 Sentinel"
    : isCore
      ? "v1.0.0 Platform"
      : `Packagist v${packagistData.latestVersion}`

  return (
    <article className="w-full max-w-full min-w-0 flex-1">
      {/* Article Header */}
      <header className="mb-8 border-b border-lp-line pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-lp-line bg-lp-paper-2 px-2.5 py-0.5 font-mono text-xs font-medium text-lp-ink">
            {category}
          </span>
          <span className="font-mono text-xs text-lp-ink/40">·</span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-lp-ink/60">
            <Clock className="size-3 text-lp-ink/50" />
            <span>5 min baca</span>
          </span>
          <span className="font-mono text-xs text-lp-ink/40">·</span>
          <span className="rounded-full border border-lp-orange/20 bg-lp-orange/10 px-2 py-0.5 font-mono text-[10px] font-medium text-lp-orange dark:border-lp-yellow/20 dark:bg-lp-yellow/10 dark:text-lp-yellow">
            {versionBadge}
          </span>
        </div>

        <h1 className="mb-3 font-heading text-3xl font-semibold tracking-tight text-lp-ink sm:text-4xl lg:text-[2.5rem]">
          {title}
        </h1>

        {description && (
          <p className="text-base leading-relaxed text-lp-ink/75 sm:text-lg">
            {description}
          </p>
        )}

        {/* Action Row matching Fumadocs Spacious Layout */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-2">
          <button
            onClick={copyPageMarkdown}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3 py-1.5 font-mono text-xs font-medium text-lp-ink transition-colors hover:bg-lp-paper-2"
          >
            {copiedDoc ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  Tersalin!
                </span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-lp-ink/60" />
                <span>Salin Ringkasan</span>
              </>
            )}
          </button>

          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper-2/60 px-3 py-1.5 font-mono text-xs font-medium text-lp-ink transition-colors hover:bg-lp-paper-2"
          >
            <span>GitHub Repositori</span>
            <ExternalLink className="size-3 text-lp-ink/50" />
          </a>

          {!isSentinel && !isCore && (
            <a
              href={
                packagistData.packagistUrl ||
                "https://packagist.org/packages/pasax/secure-monitor"
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#F28D1A]/30 bg-[#F28D1A]/10 px-3 py-1.5 font-mono text-xs font-medium text-[#F28D1A] transition-colors hover:bg-[#F28D1A]/20"
            >
              <span>Packagist v{packagistData.latestVersion}</span>
              <ExternalLink className="size-3 opacity-60" />
            </a>
          )}
        </div>
      </header>

      {/* Article Rendered Body */}
      <div
        ref={contentRef}
        className="docs-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Article Feedback Card */}
      <div className="mt-12 border-t border-lp-line pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-lp-line bg-lp-paper-2/40 p-4">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-lp-orange" />
            <span className="font-heading text-xs font-medium text-lp-ink">
              Apakah artikel panduan ini membantu Anda?
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFeedback("yes")}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-xs transition-colors ${
                feedback === "yes"
                  ? "border-emerald-500/40 bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400"
                  : "cursor-pointer border-lp-line bg-lp-paper text-lp-ink hover:bg-lp-paper-2"
              }`}
            >
              <ThumbsUp className="size-3" />
              <span>Ya, sangat membantu</span>
            </button>
            <button
              onClick={() => setFeedback("no")}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-xs transition-colors ${
                feedback === "no"
                  ? "border-rose-500/40 bg-rose-500/10 font-bold text-rose-600 dark:text-rose-400"
                  : "cursor-pointer border-lp-line bg-lp-paper text-lp-ink hover:bg-lp-paper-2"
              }`}
            >
              <ThumbsDown className="size-3" />
              <span>Perlu ditingkatkan</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
