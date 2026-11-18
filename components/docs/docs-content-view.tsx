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

export function DocsContentView({
  title,
  description,
  category,
  html,
  slug,
}: {
  title: string
  description: string
  category: string
  html: string
  slug: string
}) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [copiedDoc, setCopiedDoc] = React.useState(false)
  const [feedback, setFeedback] = React.useState<"yes" | "no" | null>(null)

  // Attach Fumadocs-style code header & copy button to all <pre> code blocks
  React.useEffect(() => {
    if (!contentRef.current) return

    const preElements = contentRef.current.querySelectorAll("pre")
    preElements.forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-block-wrapper")) return

      const codeEl = pre.querySelector("code")
      const classList = codeEl ? Array.from(codeEl.classList) : []
      const langClass = classList.find((c) => c.startsWith("language-"))
      const lang = langClass ? langClass.replace("language-", "") : ""

      const wrapper = document.createElement("div")
      wrapper.className =
        "code-block-wrapper relative group my-6 overflow-hidden rounded-xl border border-lp-line bg-[#121210]"
      pre.parentNode?.insertBefore(wrapper, pre)

      // Top bar for codeblock with language badge and copy button
      const topBar = document.createElement("div")
      topBar.className =
        "flex items-center justify-between border-b border-[rgba(236,234,226,0.1)] bg-[#181816] px-3.5 py-1.5"

      const langBadge = document.createElement("div")
      langBadge.className =
        "flex items-center gap-1.5 font-mono text-[11px] font-medium text-[#eceae2]/70 uppercase tracking-wider"
      langBadge.innerHTML = `<span>${lang || "code"}</span>`
      topBar.appendChild(langBadge)

      const copyBtn = document.createElement("button")
      copyBtn.className =
        "flex items-center gap-1 text-[11px] font-mono font-medium text-[#eceae2]/70 hover:text-white px-2 py-0.5 rounded transition-colors cursor-pointer"
      copyBtn.innerHTML = `<span>Salin</span>`
      copyBtn.title = "Salin kode ke papan klip"

      copyBtn.addEventListener("click", () => {
        const codeText = codeEl?.innerText || pre.innerText
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = `<span class="text-emerald-400">✓ Tersalin</span>`
          setTimeout(() => {
            copyBtn.innerHTML = `<span>Salin</span>`
          }, 2000)
        })
      })

      topBar.appendChild(copyBtn)
      wrapper.appendChild(topBar)
      wrapper.appendChild(pre)
    })
  }, [html])

  const copyPageMarkdown = () => {
    if (typeof window === "undefined") return
    const text = `# ${title}\n\n${description}\n\nURL: ${window.location.href}`
    navigator.clipboard.writeText(text).then(() => {
      setCopiedDoc(true)
      setTimeout(() => setCopiedDoc(false), 2000)
    })
  }

  // Derive repo URL and version badge based on category or slug
  const isSentinel = slug.includes("sentinel")
  const isCore = slug.includes("core")

  const repoUrl = isSentinel
    ? "https://github.com/pasax-dev/pasax-sentinel"
    : isCore
      ? "https://github.com/pasax-dev/pasax-suit"
      : "https://github.com/pasax-dev/pasax-secure-monitor-laravel"

  const versionBadge = isSentinel
    ? "v1.0.0 Sentinel"
    : isCore
      ? "v1.0.0 Platform"
      : "Packagist v1.0.2"

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
        </div>
      </header>

      {/* Main Prose Content */}
      <div
        ref={contentRef}
        className="docs-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Article Feedback & Footer */}
      <footer className="mt-16 border-t border-lp-line pt-8">
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-lp-line bg-lp-paper-2/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-heading text-sm font-semibold text-lp-ink">
              Apakah dokumentasi ini bermanfaat?
            </h4>
            <p className="text-xs text-lp-ink/65">
              Bantu kami menyempurnakan dokumentasi ekosistem Pasax.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {feedback === null ? (
              <>
                <button
                  onClick={() => setFeedback("yes")}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper px-3 py-1.5 text-xs font-medium text-lp-ink transition-colors hover:border-emerald-500/50 hover:bg-lp-paper-2"
                >
                  <ThumbsUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ya, membantu</span>
                </button>
                <button
                  onClick={() => setFeedback("no")}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-lp-line bg-lp-paper px-3 py-1.5 text-xs font-medium text-lp-ink transition-colors hover:border-rose-500/50 hover:bg-lp-paper-2"
                >
                  <ThumbsDown className="size-3.5 text-rose-500" />
                  <span>Kurang lengkap</span>
                </button>
              </>
            ) : (
              <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ✓ Terima kasih atas tanggapan Anda!
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 font-mono text-xs text-lp-ink/65 sm:flex-row">
          <div className="flex items-center gap-2">
            <span>Lisensi: MIT Open Source</span>
            <span>·</span>
            <span>Pasax Ecosystem</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`${repoUrl}/issues`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-lp-ink hover:underline"
            >
              <FileText className="size-3.5" />
              <span>Laporkan masalah dokumentasi</span>
              <ExternalLink className="size-2.5" />
            </a>
          </div>
        </div>
      </footer>
    </article>
  )
}
