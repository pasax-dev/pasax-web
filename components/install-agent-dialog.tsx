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
import { Terminal, Copy, Check, ShieldCheck, CheckCircle2 } from "lucide-react"

export function InstallAgentDialog({
  triggerButton,
}: {
  triggerButton?: React.ReactNode
}) {
  const [copied, setCopied] = React.useState(false)
  const token = "PSK_LIVE_8f9c2d14b"
  const installCmd = `curl -sSL https://get.pasax.is-a.dev/install.sh | sudo bash -s -- --token=${token}`

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Dialog>
      <DialogTrigger render={
        triggerButton ? (
          (triggerButton as any)
        ) : (
          <Button variant="default" className="font-bold">
            <Terminal className="size-4 mr-1.5" />
            + Deploy Sentinel Agent
          </Button>
        )
      } />
      <DialogContent className="max-w-xl border-2 border-border shadow-shadow">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="font-mono">v1.2.0</Badge>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Zero-Hassle Installation
            </span>
          </div>
          <DialogTitle className="text-xl font-heading">
            Deploy Pasax Sentinel to your Linux Host
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground/80">
            Run this single command on your Ubuntu, Debian, or RHEL server as root. The agent will auto-discover Nginx/Apache vhosts, mount the Unix Domain Socket, and start real-time FIM.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 my-2">
          <div className="relative rounded-base border-2 border-border bg-black p-4 font-mono text-xs text-green-400 shadow-shadow">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-neutral-400 text-[11px]">
              <span>bash (root / sudo)</span>
              <span>outbound: port 443 only</span>
            </div>
            <p className="break-all select-all leading-relaxed">
              {installCmd}
            </p>
            <Button
              size="sm"
              variant={copied ? "neutral" : "default"}
              onClick={handleCopy}
              className="mt-3 w-full font-sans font-bold"
            >
              {copied ? (
                <>
                  <Check className="size-4 mr-1.5 text-green-600" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="size-4 mr-1.5" />
                  Copy Installation Command
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="p-2.5 rounded-base border-2 border-border bg-background text-xs">
              <div className="font-bold mb-0.5 flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-green-600" /> No Open Ports
              </div>
              <p className="text-[11px] text-muted-foreground">Egress-only telemetry over mTLS</p>
            </div>
            <div className="p-2.5 rounded-base border-2 border-border bg-background text-xs">
              <div className="font-bold mb-0.5 flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-green-600" /> Low Footprint
              </div>
              <p className="text-[11px] text-muted-foreground">&lt;20MB RAM, single Go static binary</p>
            </div>
            <div className="p-2.5 rounded-base border-2 border-border bg-background text-xs">
              <div className="font-bold mb-0.5 flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-green-600" /> Kernel Firewall
              </div>
              <p className="text-[11px] text-muted-foreground">Native nftables & iptables offloading</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <p className="text-[11px] text-muted-foreground self-center mr-auto">
            Need Docker or Ansible playbook? <a href="#" className="underline font-bold">View Docs</a>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
