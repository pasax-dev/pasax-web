import { RefreshCw, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { SectionBackground } from "@/components/public/section-background"

export function ComparisonSection() {
  return (
    <div className="relative overflow-hidden py-12">
      <SectionBackground variant="grid" />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
            <RefreshCw className="size-3.5 text-sky-500" />
            <span>BENCHMARK &amp; COMPARISON</span>
          </div>
          <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-5xl">
            Why Teams Replace Legacy Agents
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Comparing Pasax against traditional SIEM agents, Cloudflare WAF, and
            Fail2ban.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card/40 shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="border-b border-border/40 bg-muted/30 font-sans text-xs tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="p-4 font-semibold text-foreground sm:p-5 lg:p-6">
                  Feature / Metric
                </th>
                <th className="border-x border-sky-500/20 bg-sky-500/10 p-4 font-bold text-sky-500 sm:p-5 lg:p-6 dark:text-sky-400">
                  <span className="flex items-center gap-1.5">
                    <span>⚡ PASAX SUITE</span>
                    <span className="rounded-full border border-sky-500/30 bg-sky-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-sky-500">
                      ARMORED
                    </span>
                  </span>
                </th>
                <th className="p-4 font-medium text-muted-foreground sm:p-5 lg:p-6">
                  Traditional SIEM (Wazuh/Datadog)
                </th>
                <th className="p-4 font-medium text-muted-foreground sm:p-5 lg:p-6">
                  Cloudflare WAF
                </th>
                <th className="p-4 font-medium text-muted-foreground sm:p-5 lg:p-6">
                  Fail2ban
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-sans text-xs">
              <tr className="transition-colors hover:bg-muted/20">
                <td className="p-4 font-semibold text-foreground sm:p-5 lg:p-6">
                  Kernel-Level Drops (nftables)
                </td>
                <td className="border-x border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 lg:p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-500">
                    <CheckCircle2 className="size-3.5" />
                    Sub-0.2ms Latency
                  </span>
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  Log analysis only (seconds)
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  Cloud proxy only (No host access)
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  iptables regex (10-30s lag)
                </td>
              </tr>

              <tr className="transition-colors hover:bg-muted/20">
                <td className="p-4 font-semibold text-foreground sm:p-5 lg:p-6">
                  Instant FIM Auto-Healing
                </td>
                <td className="border-x border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 lg:p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-500">
                    <CheckCircle2 className="size-3.5" />
                    Auto-lock (0600) in &lt;15ms
                  </span>
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  Alert only (No auto-lock)
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  No host file access
                </td>
                <td className="p-4 font-medium text-rose-500 sm:p-5 lg:p-6">
                  Not supported
                </td>
              </tr>

              <tr className="transition-colors hover:bg-muted/20">
                <td className="p-4 font-semibold text-foreground sm:p-5 lg:p-6">
                  Application-Aware (Laravel/PHP)
                </td>
                <td className="border-x border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 lg:p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-500">
                    <CheckCircle2 className="size-3.5" />
                    Deep native integration
                  </span>
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  Generic OS logs only
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  HTTP edge only
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  Regex parsing only
                </td>
              </tr>

              <tr className="transition-colors hover:bg-muted/20">
                <td className="p-4 font-semibold text-foreground sm:p-5 lg:p-6">
                  Memory Footprint
                </td>
                <td className="border-x border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 lg:p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-500">
                    &lt; 20 MB (Go binary)
                  </span>
                </td>
                <td className="p-4 font-medium text-rose-500 sm:p-5 lg:p-6">
                  500 MB – 2.5 GB (Heavy)
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  0 MB (SaaS proxy)
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  50 MB – 150 MB (Python)
                </td>
              </tr>

              <tr className="transition-colors hover:bg-muted/20">
                <td className="p-4 font-semibold text-foreground sm:p-5 lg:p-6">
                  Inbound Listening Ports
                </td>
                <td className="border-x border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 lg:p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-500">
                    0 Ports (Egress mTLS)
                  </span>
                </td>
                <td className="p-4 font-medium text-amber-500 sm:p-5 lg:p-6">
                  Requires agent port
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  N/A (DNS proxy)
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  0 Ports (Local daemon)
                </td>
              </tr>

              <tr className="transition-colors hover:bg-muted/20">
                <td className="p-4 font-semibold text-foreground sm:p-5 lg:p-6">
                  Fleet Blocklist Sync
                </td>
                <td className="border-x border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 lg:p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-500">
                    <CheckCircle2 className="size-3.5" />
                    Instant mesh broadcast
                  </span>
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  Complex pipeline setup
                </td>
                <td className="p-4 text-muted-foreground sm:p-5 lg:p-6">
                  Supported (Cloud-only)
                </td>
                <td className="p-4 font-medium text-rose-500 sm:p-5 lg:p-6">
                  Single-server isolated
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
