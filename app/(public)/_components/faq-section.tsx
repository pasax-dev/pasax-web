"use client"

import { HelpCircle } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { SectionBackground } from "@/components/public/section-background"

export function FaqSection() {
  return (
    <div className="relative overflow-hidden py-12">
      <SectionBackground variant="dots" />
      <div className="relative z-10 mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
            <HelpCircle className="size-3.5 text-sky-500" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-5xl">
            Answers to Technical Questions
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Everything you need to know about architecture, kernel safety, and
            deployment.
          </p>
        </div>

        <div className="mx-auto max-w-4xl lg:max-w-5xl">
          <Accordion className="space-y-3">
            <AccordionItem
              value="item-1"
              className="rounded-2xl border border-border/50 bg-card/40 px-6 backdrop-blur-md transition-all hover:border-border hover:bg-card/70"
            >
              <AccordionTrigger className="py-4 font-heading text-base font-semibold text-foreground hover:no-underline">
                How does pasax-sentinel differ from Fail2ban?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                Fail2ban relies heavily on Python regex parsing of log files on
                disk, which often introduces a 10 to 30 second delay between an
                exploit attempt and a firewall ban. Furthermore, Fail2ban
                operates in isolation per machine. In contrast,{" "}
                <strong className="font-medium text-foreground">
                  pasax-sentinel
                </strong>{" "}
                is compiled Go that interacts with the Linux kernel via{" "}
                <strong className="font-medium text-foreground">
                  nftables
                </strong>{" "}
                in sub-millisecond timeframes, performs real-time inotify File
                Integrity Monitoring (FIM) with automatic permission
                remediation, and instantly broadcasts banned attack IPs to your
                entire fleet.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="rounded-2xl border border-border/50 bg-card/40 px-6 backdrop-blur-md transition-all hover:border-border hover:bg-card/70"
            >
              <AccordionTrigger className="py-4 font-heading text-base font-semibold text-foreground hover:no-underline">
                Can I run Pasax Sentinel without Laravel?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                Yes! While{" "}
                <code className="rounded-md border border-border/40 bg-muted/30 px-1.5 py-0.5 font-mono text-xs text-foreground">
                  pasax/shield
                </code>{" "}
                provides specialized Laravel middleware and honeypot routes,{" "}
                <strong className="font-medium text-foreground">
                  pasax-sentinel
                </strong>{" "}
                is an independent Linux host daemon. It can protect any web
                server stack (Node.js, Python/Django, Ruby on Rails, Go,
                WordPress, Nginx, Apache, or Caddy) by performing kernel
                firewall filtering, FIM monitoring, and virtual host security
                analysis.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="rounded-2xl border border-border/50 bg-card/40 px-6 backdrop-blur-md transition-all hover:border-border hover:bg-card/70"
            >
              <AccordionTrigger className="py-4 font-heading text-base font-semibold text-foreground hover:no-underline">
                How does Sentinel connect to Pasax Cloud without open ports?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                Sentinel operates on an{" "}
                <strong className="font-medium text-foreground">
                  egress-only zero-trust architecture
                </strong>
                . When started, it establishes an outbound TLS 1.3 mTLS
                connection to Pasax Cloud over HTTPS (port 443). Telemetry and
                threat events are sent outbound; policy updates and global
                blocklists are streamed back through the persistent connection.
                Your server never listens on any external port for Sentinel.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="rounded-2xl border border-border/50 bg-card/40 px-6 backdrop-blur-md transition-all hover:border-border hover:bg-card/70"
            >
              <AccordionTrigger className="py-4 font-heading text-base font-semibold text-foreground hover:no-underline">
                What happens if a monitored file like .env is modified?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                Linux inotify generates a kernel-level notification within
                microseconds. Pasax Sentinel immediately executes an autonomous
                remediation policy: it snapshots the diff, locks the file
                permissions to{" "}
                <code className="rounded-md border border-border/40 bg-muted/30 px-1.5 py-0.5 font-mono text-xs text-foreground">
                  0600
                </code>{" "}
                (read/write only by owner), alerts the SOC console, and
                quarantines the offending process or IP address.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="rounded-2xl border border-border/50 bg-card/40 px-6 backdrop-blur-md transition-all hover:border-border hover:bg-card/70"
            >
              <AccordionTrigger className="py-4 font-heading text-base font-semibold text-foreground hover:no-underline">
                Does it conflict with UFW or existing iptables firewalls?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                No. Sentinel creates its own isolated table and set in{" "}
                <code className="rounded-md border border-border/40 bg-muted/30 px-1.5 py-0.5 font-mono text-xs text-foreground">
                  nftables
                </code>{" "}
                (named{" "}
                <code className="rounded-md border border-border/40 bg-muted/30 px-1.5 py-0.5 font-mono text-xs text-foreground">
                  pasax_mesh
                </code>
                ). It inserts priority drop rules without overwriting or
                interfering with your existing UFW rules or Docker iptables
                forward chains.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="rounded-2xl border border-border/50 bg-card/40 px-6 backdrop-blur-md transition-all hover:border-border hover:bg-card/70"
            >
              <AccordionTrigger className="py-4 font-heading text-base font-semibold text-foreground hover:no-underline">
                What are the minimum hardware requirements?
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                The sentinel binary is less than 15MB, requires under 20MB of
                RAM, and runs smoothly on low-end 1-vCPU VPS instances (such as
                1GB RAM DigitalOcean or Hetzner VPS instances) running Linux
                kernel 5.4 or higher (Ubuntu 20.04+, Debian 11+, RHEL/Rocky 9+,
                Alpine Linux).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
