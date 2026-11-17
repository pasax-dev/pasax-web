"use client"

import * as React from "react"
import { Clock, ExternalLink } from "lucide-react"

function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

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

  // Attach copy button logic to all <pre> code blocks
  React.useEffect(() => {
    if (!contentRef.current) return

    const preElements = contentRef.current.querySelectorAll("pre")
    preElements.forEach((pre) => {
      // Avoid duplicate wrappers
      if (pre.parentElement?.classList.contains("code-block-wrapper")) return

      const wrapper = document.createElement("div")
      wrapper.className = "code-block-wrapper relative group my-6"
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)

      // Add copy button
      const copyBtn = document.createElement("button")
      copyBtn.className =
        "absolute right-3 top-3 hidden group-hover:flex items-center gap-1 text-[11px] font-mono font-black bg-black text-white border-2 border-border px-2.5 py-1 rounded-base shadow-[2px_2px_0px_0px_var(--border)] transition-all cursor-pointer hover:bg-main hover:text-black"
      copyBtn.innerHTML = `<span>Salin</span>`
      copyBtn.title = "Salin kode ke clipboard"

      copyBtn.addEventListener("click", () => {
        const codeText = pre.querySelector("code")?.innerText || pre.innerText
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = `<span>✓ Tersalin!</span>`
          copyBtn.classList.add("bg-emerald-400", "text-black")
          setTimeout(() => {
            copyBtn.innerHTML = `<span>Salin</span>`
            copyBtn.classList.remove("bg-emerald-400", "text-black")
          }, 2000)
        })
      })

      wrapper.appendChild(copyBtn)
    })
  }, [html])

  return (
    <article className="w-full max-w-full min-w-0 flex-1">
      {/* Article Header */}
      <header className="mb-8 border-b-2 border-border pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="-rotate-1 rounded-base border-2 border-border bg-amber-300 px-2.5 py-0.5 font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)]">
            pasax-secure-monitor
          </span>
          <span className="rounded-base border-2 border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-black text-foreground shadow-[1.5px_1.5px_0px_0px_var(--border)]">
            {category}
          </span>
          <span className="font-mono text-xs text-foreground/50">·</span>
          <span className="flex items-center gap-1 font-mono text-xs font-bold text-foreground">
            <Clock className="size-3 text-foreground" />
            <span>5 min baca</span>
          </span>
        </div>

        <h1 className="mb-3 font-heading text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="text-base leading-relaxed font-medium text-foreground sm:text-lg">
            {description}
          </p>
        )}
      </header>

      {/* Article Body Content */}
      <div
        ref={contentRef}
        className="docs-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Article Footer Feedback */}
      <footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t-2 border-border pt-6 font-mono text-xs text-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <span>
            Produk:{" "}
            <strong className="text-foreground">pasax-secure-monitor</strong>
          </span>
          <span>·</span>
          <span>
            Lisensi:{" "}
            <strong className="text-foreground">MIT Open Source</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/pasax-dev/pasax-secure-monitor-laravel"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 font-mono text-xs font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <GithubIcon className="size-3.5" />
            <span>GitHub Repository</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </footer>
    </article>
  )
}
