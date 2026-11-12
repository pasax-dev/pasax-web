"use client"

import * as React from "react"
import { Copy, Check, Terminal, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TerminalInstall() {
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"curl" | "docker" | "go">("curl")

  const commands = {
    curl: "curl -sSL https://get.pasak.is-a.dev/install.sh | sudo bash -s -- --token=psk_live_mesh",
    docker: "docker run -d --name pasak-sentinel --net=host --cap-add=NET_ADMIN -v /:/host:ro pasak/sentinel:v1",
    go: "go install github.com/pasak-suit/pasak-sentinel/cmd/sentinel@latest && sudo sentinel daemon --init",
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-3xl xl:max-w-4xl rounded-base border-2 border-border bg-secondary-background shadow-shadow">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b-2 border-border bg-background px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full border border-border bg-red-400" />
          <div className="size-3 rounded-full border border-border bg-amber-400" />
          <div className="size-3 rounded-full border border-border bg-green-400" />
          <span className="ml-2 font-mono text-xs font-semibold text-muted-foreground">
            bash ~ root@sentinel-node
          </span>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("curl")}
            className={`rounded px-2 py-0.5 font-mono text-xs font-bold transition-colors ${
              activeTab === "curl"
                ? "border border-border bg-main text-main-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            One-liner
          </button>
          <button
            onClick={() => setActiveTab("docker")}
            className={`rounded px-2 py-0.5 font-mono text-xs font-bold transition-colors ${
              activeTab === "docker"
                ? "border border-border bg-main text-main-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Docker
          </button>
          <button
            onClick={() => setActiveTab("go")}
            className={`rounded px-2 py-0.5 font-mono text-xs font-bold transition-colors ${
              activeTab === "go"
                ? "border border-border bg-main text-main-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Go CLI
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 font-mono text-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-foreground scrollbar-thin">
          <span className="select-none text-main font-bold shrink-0">$</span>
          <code className="whitespace-nowrap font-semibold text-xs sm:text-sm">
            {commands[activeTab]}
          </code>
        </div>
        <Button
          onClick={handleCopy}
          size="sm"
          variant="outline"
          className="self-end sm:self-auto shrink-0 border-2 border-border bg-background font-mono text-xs shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5"
          aria-label="Copy terminal install command"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Terminal Footer Sub-status */}
      <div className="flex items-center justify-between border-t-2 border-border bg-background/50 px-4 py-2 font-mono text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Zap className="size-3 text-amber-500" />
          <span>Auto-detects kernel nftables, inotify subsystem & Nginx/Apache configs</span>
        </span>
        <span className="hidden font-bold text-foreground sm:inline">
          Deploy time: &lt; 15s
        </span>
      </div>
    </div>
  )
}
