import { Zap, ShieldAlert, FileSearch, Lock, Globe2, Flame, Cpu } from "lucide-react"
import { SectionBackground } from "@/components/public/section-background"

export function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden scroll-mt-20 py-6">
      <SectionBackground variant="dots" showFloatingStamps />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
            <Zap className="size-3.5 text-amber-500" />
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Engineered for Production Web Workloads
          </h2>
          <p className="mt-3 text-base font-base text-foreground/80 sm:text-lg">
            Built from scratch to eliminate heavy Java agents, brittle log
            scrapers, and slow cloud proxies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
          {/* Feature 1 */}
          <div className="rounded-base border-2 border-border bg-secondary-background p-6 lg:p-8 xl:p-9 shadow-shadow transition-transform hover:translate-x-0.5 hover:translate-y-0.5">
            <div className="mb-4 flex size-10 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]">
              <ShieldAlert className="size-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Sub-Millisecond Kernel Drops
            </h3>
            <p className="mt-2 text-sm leading-relaxed font-base text-foreground/80">
              Applies kernel{" "}
              <code className="font-mono font-bold">nftables</code> and{" "}
              <code className="font-mono font-bold">iptables</code> rules
              directly. Malicious packets are discarded at Layer 3/4 before
              they reach Nginx, Caddy, or PHP worker processes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-base border-2 border-border bg-secondary-background p-6 lg:p-8 xl:p-9 shadow-shadow transition-transform hover:translate-x-0.5 hover:translate-y-0.5">
            <div className="mb-4 flex size-10 items-center justify-center rounded-base border-2 border-border bg-purple-300 text-black shadow-[2px_2px_0px_0px_var(--border)]">
              <FileSearch className="size-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Autonomous FIM Auto-Healing
            </h3>
            <p className="mt-2 text-sm leading-relaxed font-base text-foreground/80">
              Watches critical files (
              <code className="font-mono font-bold">.env</code>,{" "}
              <code className="font-mono font-bold">wp-config.php</code>,
              storage uploads) using Linux inotify. Unauthorized modifications
              trigger instant permission resets to{" "}
              <code className="font-mono font-bold">0600</code>.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-base border-2 border-border bg-secondary-background p-6 lg:p-8 xl:p-9 shadow-shadow transition-transform hover:translate-x-0.5 hover:translate-y-0.5">
            <div className="mb-4 flex size-10 items-center justify-center rounded-base border-2 border-border bg-green-300 text-black shadow-[2px_2px_0px_0px_var(--border)]">
              <Lock className="size-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Egress-Only Zero-Trust mTLS
            </h3>
            <p className="mt-2 text-sm leading-relaxed font-base text-foreground/80">
              Pasax Sentinel never binds to a listening TCP port on your
              server. It communicates outbound to the Pasax Cloud API via TLS
              1.3 mTLS, making your servers invisible to Shodan and port
              scanners.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-base border-2 border-border bg-secondary-background p-6 lg:p-8 xl:p-9 shadow-shadow transition-transform hover:translate-x-0.5 hover:translate-y-0.5">
            <div className="mb-4 flex size-10 items-center justify-center rounded-base border-2 border-border bg-amber-300 text-black shadow-[2px_2px_0px_0px_var(--border)]">
              <Globe2 className="size-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Virtual Host & SSL Recon
            </h3>
            <p className="mt-2 text-sm leading-relaxed font-base text-foreground/80">
              Continuously analyzes Nginx, Apache, and Caddy configs to
              inventory every exposed domain, check SSL expiration dates, and
              verify security headers like HSTS and CSP.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-base border-2 border-border bg-secondary-background p-6 lg:p-8 xl:p-9 shadow-shadow transition-transform hover:translate-x-0.5 hover:translate-y-0.5">
            <div className="mb-4 flex size-10 items-center justify-center rounded-base border-2 border-border bg-red-400 text-black shadow-[2px_2px_0px_0px_var(--border)]">
              <Flame className="size-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Collective Threat Blocklist
            </h3>
            <p className="mt-2 text-sm leading-relaxed font-base text-foreground/80">
              When an attacker attempts an exploit on one server in your
              cluster, that IP address is quarantined and automatically
              synchronized to every other node in your fleet within seconds.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-base border-2 border-border bg-secondary-background p-6 lg:p-8 xl:p-9 shadow-shadow transition-transform hover:translate-x-0.5 hover:translate-y-0.5">
            <div className="mb-4 flex size-10 items-center justify-center rounded-base border-2 border-border bg-blue-300 text-black shadow-[2px_2px_0px_0px_var(--border)]">
              <Cpu className="size-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Ultra-Lightweight Go Binary
            </h3>
            <p className="mt-2 text-sm leading-relaxed font-base text-foreground/80">
              Single static binary with zero external dependencies. Consumes
              less than 20MB of memory and under 0.5% CPU even while tailing
              gigabytes of access logs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
