"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Terminal, Copy, Check, CheckCircle2 } from "lucide-react"

export function InstallAgentDialog({
  triggerButton,
}: {
  triggerButton?: React.ReactNode
}) {
  const [copied, setCopied] = React.useState(false)
  const token = "PSK_LIVE_8f9c2d14b"
  const installCmd = `curl -sSL https://get.pasax.web.id/install.sh | sudo bash -s -- --token=${token}`

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          triggerButton ? (
            (triggerButton as any)
          ) : (
            <Button
              variant="default"
              size="sm"
              className="h-8 shrink-0 px-2.5 text-xs font-bold whitespace-nowrap"
            >
              <Terminal className="mr-1.5 size-3.5 shrink-0" />
              <span className="hidden 2xl:inline">+ Deploy Sentinel Agent</span>
              <span className="2xl:hidden">+ Deploy Agent</span>
            </Button>
          )
        }
      />
      <DialogContent className="max-w-xl">
        <DialogHeader className="border-b border-border/70 pb-4">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[10px]">
              v1.2.0
            </Badge>
            <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Zero-Hassle Installation
            </span>
          </div>
          <DialogTitle className="font-heading text-lg font-black sm:text-xl">
            Deploy Pasax Sentinel to your Linux Host
          </DialogTitle>
          <DialogDescription>
            Run this single command on your Ubuntu, Debian, or RHEL server as
            root. The agent will auto-discover Nginx/Apache vhosts, mount the
            Unix Domain Socket, and start real-time FIM.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="relative rounded-base border-2 border-border bg-black p-4 font-mono text-xs text-green-400 shadow-shadow">
            <div className="mb-2 flex items-center justify-between border-b border-neutral-800 pb-2 text-[11px] text-neutral-400">
              <span>bash (root / sudo)</span>
              <span>outbound: port 443 only</span>
            </div>
            <p className="leading-relaxed break-all select-all">{installCmd}</p>
            <Button
              size="sm"
              variant={copied ? "neutral" : "default"}
              onClick={handleCopy}
              className="mt-3 w-full font-sans font-bold"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 size-4 text-green-600" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 size-4" />
                  Copy Installation Command
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="rounded-base border-2 border-border bg-card p-3 text-xs">
              <div className="mb-0.5 flex items-center gap-1.5 font-bold text-foreground">
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                <span>No Open Ports</span>
              </div>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Egress-only telemetry over mTLS
              </p>
            </div>
            <div className="rounded-base border-2 border-border bg-card p-3 text-xs">
              <div className="mb-0.5 flex items-center gap-1.5 font-bold text-foreground">
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                <span>Low Footprint</span>
              </div>
              <p className="text-[11px] leading-snug text-muted-foreground">
                &lt;20MB RAM, single Go static binary
              </p>
            </div>
            <div className="rounded-base border-2 border-border bg-card p-3 text-xs">
              <div className="mb-0.5 flex items-center gap-1.5 font-bold text-foreground">
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                <span>Kernel Firewall</span>
              </div>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Native nftables &amp; iptables offloading
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <p className="mr-auto self-center text-[11px] text-muted-foreground">
            Need Docker or Ansible playbook?{" "}
            <a
              href="/docs"
              className="font-bold underline hover:text-foreground"
            >
              View Docs
            </a>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
