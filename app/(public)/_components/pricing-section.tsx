import Link from "next/link"
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { SectionBackground } from "@/components/public/section-background"
import { cn } from "@/lib/utils"

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-20 overflow-hidden py-6"
    >
      <SectionBackground variant="stripes" showFloatingStamps />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
            <Sparkles className="size-3.5 text-main" />
            <span>SIMPLE & PREDICTABLE</span>
          </div>
          <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Transparent Pricing for Any Fleet
          </h2>
          <p className="mt-3 text-base font-base text-foreground/80 sm:text-lg">
            Run on your own infrastructure for free, or connect to Pasak Cloud
            for autonomous fleet intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-8 xl:gap-10">
          {/* Tier 1: Community */}
          <div className="flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow lg:p-8 xl:p-10">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold">Community</h3>
                <Badge variant="outline" className="font-mono text-xs">
                  SELF-HOSTED
                </Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-black">$0</span>
                <span className="font-mono text-sm text-muted-foreground">
                  / forever
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                For solo developers and single production servers needing
                rock-solid kernel defense.
              </p>

              <ul className="mt-6 space-y-3 border-t-2 border-border pt-6 text-sm font-base">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  <span>Unlimited File Integrity Monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  <span>nftables & iptables kernel firewall</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  <span>Local Honeypot & Webshell scanner</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  <span>MIT Licensed & Open Source</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t-2 border-border pt-6">
              <a
                href="https://github.com/pasak-dev"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex w-full items-center justify-center border-2 font-heading font-bold"
                )}
              >
                Get Started Free
              </a>
            </div>
          </div>

          {/* Tier 2: Developer Pro (Highlighted) */}
          <div className="relative z-10 flex scale-105 flex-col justify-between rounded-base border-2 border-border bg-main p-6 text-main-foreground shadow-shadow lg:p-8 xl:p-10">
            <div className="absolute -top-3.5 right-6 rounded-base border-2 border-border bg-amber-300 px-2.5 py-0.5 font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_var(--border)]">
              MOST POPULAR
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-xl font-black text-foreground">
                  Developer Pro
                </h3>
                <Badge
                  variant="outline"
                  className="border-border bg-secondary-background font-mono text-xs font-bold text-foreground"
                >
                  MANAGED CLOUD
                </Badge>
              </div>
              <div className="flex items-baseline gap-1 text-foreground">
                <span className="font-heading text-4xl font-black">$19</span>
                <span className="font-mono text-sm font-bold">/ month</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed font-semibold text-foreground/90">
                For growing web applications, SaaS businesses, and agency client
                servers.
              </p>

              <ul className="mt-6 space-y-3 border-t-2 border-border pt-6 text-sm font-semibold text-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-foreground" />
                  <span>Up to 10 Connected Nodes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-foreground" />
                  <span>Real-Time Pasak Cloud SOC Console</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-foreground" />
                  <span>Collective Fleet Blocklist Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-foreground" />
                  <span>Virtual Host & SSL Expiry Recon</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-foreground" />
                  <span>Telegram, Discord & Slack Webhooks</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t-2 border-border pt-6">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "flex w-full items-center justify-center gap-1.5 border-2 border-border bg-secondary-background font-heading font-black text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:bg-background"
                )}
              >
                <span>Launch SOC Console</span>
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </div>
          </div>

          {/* Tier 3: Agency Fleet */}
          <div className="flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow lg:p-8 xl:p-10">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold">Agency Fleet</h3>
                <Badge variant="outline" className="font-mono text-xs">
                  ENTERPRISE
                </Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-black">$79</span>
                <span className="font-mono text-sm text-muted-foreground">
                  / month
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                For hosting providers, multi-tenant clouds, and high-stakes
                infrastructure fleets.
              </p>

              <ul className="mt-6 space-y-3 border-t-2 border-border pt-6 text-sm font-base">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  <span>Unlimited Fleet Nodes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  <span>Custom Dedicated Threat Feeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  <span>Multi-Tenant Workspaces & RBAC</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  <span>Priority 99.9% Ingestion SLA</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t-2 border-border pt-6">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex w-full items-center justify-center border-2 font-heading font-bold"
                )}
              >
                Contact Enterprise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
