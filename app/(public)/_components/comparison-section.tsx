import { RefreshCw, CheckCircle2 } from "lucide-react"
import { SectionBackground } from "@/components/public/section-background"

export function ComparisonSection() {
  return (
    <section id="comparison" className="relative overflow-hidden scroll-mt-20 py-6">
      <SectionBackground variant="grid" />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
            <RefreshCw className="size-3.5 text-main" />
            <span>BENCHMARK & COMPARISON</span>
          </div>
          <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Why Teams Replace Legacy Agents
          </h2>
          <p className="mt-3 text-base font-base text-foreground/80 sm:text-lg">
            Comparing Pasak against traditional SIEM agents, Cloudflare WAF,
            and Fail2ban.
          </p>
        </div>

        <div className="overflow-x-auto rounded-base border-2 border-border bg-secondary-background shadow-shadow">
          <table className="w-full text-left text-sm sm:text-base font-base">
            <thead className="border-b-2 border-border bg-background font-heading text-xs tracking-wider uppercase">
              <tr>
                <th className="p-4 sm:p-5 lg:p-6">Feature / Metric</th>
                <th className="border-x-2 border-border bg-main/20 p-4 sm:p-5 lg:p-6 font-black text-main-foreground">
                  PASAK SUITE
                </th>
                <th className="p-4 sm:p-5 lg:p-6">Traditional SIEM (Wazuh/Datadog)</th>
                <th className="p-4 sm:p-5 lg:p-6">Cloudflare WAF</th>
                <th className="p-4 sm:p-5 lg:p-6">Fail2ban</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border font-mono text-xs">
              <tr>
                <td className="p-4 sm:p-5 lg:p-6 font-heading font-bold text-foreground">
                  Kernel-Level Drops (nftables/eBPF)
                </td>
                <td className="border-x-2 border-border bg-main/10 p-4 sm:p-5 lg:p-6 font-bold text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    Sub-0.2ms Latency
                  </span>
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-muted-foreground">
                  Log analysis only (seconds)
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-muted-foreground">
                  Cloud proxy only (No host access)
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-foreground">
                  iptables regex (10-30s lag)
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 lg:p-6 font-heading font-bold text-foreground">
                  Instant FIM Auto-Healing
                </td>
                <td className="border-x-2 border-border bg-main/10 p-4 sm:p-5 lg:p-6 font-bold text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    Auto-lock (0600) in &lt;15ms
                  </span>
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-muted-foreground">
                  Alert only (No auto-lock)
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-muted-foreground">
                  No host file access
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-muted-foreground">Not supported</td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 lg:p-6 font-heading font-bold text-foreground">
                  Application-Aware (Laravel/PHP)
                </td>
                <td className="border-x-2 border-border bg-main/10 p-4 sm:p-5 lg:p-6 font-bold text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    Deep native integration
                  </span>
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-muted-foreground">
                  Generic OS logs only
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-muted-foreground">HTTP edge only</td>
                <td className="p-4 sm:p-5 lg:p-6 text-muted-foreground">
                  Regex parsing only
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 lg:p-6 font-heading font-bold text-foreground">
                  Memory Footprint
                </td>
                <td className="border-x-2 border-border bg-main/10 p-4 sm:p-5 lg:p-6 font-black text-green-600 dark:text-green-400">
                  &lt; 20 MB (Go binary)
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-red-600 dark:text-red-400">
                  500 MB – 2.5 GB (Heavy)
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-foreground">0 MB (SaaS proxy)</td>
                <td className="p-4 sm:p-5 lg:p-6 text-foreground">
                  50 MB – 150 MB (Python)
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 lg:p-6 font-heading font-bold text-foreground">
                  Inbound Listening Ports
                </td>
                <td className="border-x-2 border-border bg-main/10 p-4 sm:p-5 lg:p-6 font-black text-green-600 dark:text-green-400">
                  0 Ports (Egress mTLS)
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-amber-600 dark:text-amber-400">
                  Requires agent port
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-foreground">N/A (DNS proxy)</td>
                <td className="p-4 sm:p-5 lg:p-6 text-foreground">
                  0 Ports (Local daemon)
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 lg:p-6 font-heading font-bold text-foreground">
                  Fleet Blocklist Sync
                </td>
                <td className="border-x-2 border-border bg-main/10 p-4 sm:p-5 lg:p-6 font-bold text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    Instant mesh broadcast
                  </span>
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-muted-foreground">
                  Complex pipeline setup
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-foreground">
                  Supported (Cloud-only)
                </td>
                <td className="p-4 sm:p-5 lg:p-6 text-red-600 dark:text-red-400">
                  Single-server isolated
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
