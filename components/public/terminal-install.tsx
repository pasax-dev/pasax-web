"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { Window } from "@/components/fumadocs/window"

export function TerminalInstall() {
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"curl" | "docker" | "go">(
    "curl"
  )

  const commands = {
    curl: "curl -fsSL https://get.pasax.web.id/install.sh | sudo bash -s -- --token=psk_live_mesh",
    docker:
      "docker run -d --name pasax-sentinel --net=host --cap-add=NET_ADMIN -v /:/host:ro pasax/sentinel:v1",
    go: "go install github.com/pasax-suit/pasax-sentinel/cmd/sentinel@latest && sudo sentinel daemon --init",
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commands[activeTab])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <Window
      title="install ~ sentinel.sh"
      actions={
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("curl")}
            className={`px-2 py-0.5 font-mono text-[11px] transition-colors ${
              activeTab === "curl"
                ? "bg-lp-ink font-semibold text-lp-paper"
                : "text-lp-ink-2 hover:bg-lp-ink hover:text-lp-paper"
            }`}
          >
            One-liner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("docker")}
            className={`px-2 py-0.5 font-mono text-[11px] transition-colors ${
              activeTab === "docker"
                ? "bg-lp-ink font-semibold text-lp-paper"
                : "text-lp-ink-2 hover:bg-lp-ink hover:text-lp-paper"
            }`}
          >
            Docker
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("go")}
            className={`px-2 py-0.5 font-mono text-[11px] transition-colors ${
              activeTab === "go"
                ? "bg-lp-ink font-semibold text-lp-paper"
                : "text-lp-ink-2 hover:bg-lp-ink hover:text-lp-paper"
            }`}
          >
            Go CLI
          </button>
        </div>
      }
      className="w-full max-w-4xl"
    >
      <div className="flex flex-col justify-between gap-3 bg-lp-paper p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex scrollbar-thin items-center gap-3 overflow-x-auto pb-1 font-mono text-xs text-lp-ink sm:text-sm">
          <span className="shrink-0 font-bold text-lp-orange select-none">
            $
          </span>
          <code className="font-mono whitespace-nowrap">
            {commands[activeTab]}
          </code>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 border border-lp-line-strong bg-lp-paper px-3 font-mono text-xs text-lp-ink transition-none hover:bg-lp-ink hover:text-lp-paper active:translate-x-[1px] active:translate-y-[1px]"
          aria-label="Copy terminal install command"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </Window>
  )
}
