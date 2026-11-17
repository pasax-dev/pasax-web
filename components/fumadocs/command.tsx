"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandProps extends React.ComponentProps<"div"> {
  command: string
}

export function Command({ command, className, ...props }: CommandProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const parts = command.split(" ")
  const words: React.ReactNode[] = []
  for (let i = 0; i < parts.length; i++) {
    if (i > 0) words.push(" ")
    words.push(
      <span key={i} className="whitespace-nowrap">
        {parts[i]}
      </span>
    )
  }

  return (
    <div
      {...props}
      className={cn(
        "flex min-h-11 w-fit max-w-full items-stretch border border-lp-line-strong bg-lp-paper transition-all",
        className
      )}
    >
      <code className="flex min-w-0 flex-1 items-baseline gap-2 self-center px-3.5 py-2.5 font-mono text-xs sm:text-sm leading-5 text-lp-ink">
        <span aria-hidden className="text-lp-ink-2 select-none">
          $
        </span>
        <span className="min-w-0 font-medium">{words}</span>
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="inline-flex size-11 shrink-0 items-center justify-center border-s border-lp-line-strong text-lp-ink transition-colors hover:bg-lp-ink hover:text-lp-paper focus-visible:bg-lp-ink focus-visible:text-lp-paper focus-visible:outline-none"
      >
        {copied ? (
          <Check aria-hidden className="size-4 text-emerald-500" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
      </button>
    </div>
  )
}
