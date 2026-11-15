"use client"

import { HelpCircle } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
            <HelpCircle className="size-3.5 text-main" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Answers to Technical Questions
          </h2>
          <p className="mt-2 font-base text-foreground/80">
            Everything you need to know about architecture, kernel safety, and
            deployment.
          </p>
        </div>

        <div className="mx-auto max-w-4xl lg:max-w-5xl"><Accordion className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How does pasax-sentinel differ from Fail2ban?
            </AccordionTrigger>
            <AccordionContent>
              Fail2ban relies heavily on Python regex parsing of log files on
              disk, which often introduces a 10 to 30 second delay between an
              exploit attempt and a firewall ban. Furthermore, Fail2ban
              operates in isolation per machine. In contrast,{" "}
              <strong>pasax-sentinel</strong> is compiled Go that interacts
              with the Linux kernel via <strong>nftables</strong> in
              sub-millisecond timeframes, performs real-time inotify File
              Integrity Monitoring (FIM) with automatic permission
              remediation, and instantly broadcasts banned attack IPs to your
              entire fleet.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              Can I run Pasax Sentinel without Laravel?
            </AccordionTrigger>
            <AccordionContent>
              Yes! While{" "}
              <code className="font-mono font-bold">pasax/shield</code>{" "}
              provides specialized Laravel middleware and honeypot routes,{" "}
              <strong>pasax-sentinel</strong> is an independent Linux host
              daemon. It can protect any web server stack (Node.js,
              Python/Django, Ruby on Rails, Go, WordPress, Nginx, Apache, or
              Caddy) by performing kernel firewall filtering, FIM monitoring,
              and virtual host security analysis.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              How does Sentinel connect to Pasax Cloud without open ports?
            </AccordionTrigger>
            <AccordionContent>
              Sentinel operates on an{" "}
              <strong>egress-only zero-trust architecture</strong>. When
              started, it establishes an outbound TLS 1.3 mTLS connection to
              Pasax Cloud over HTTPS (port 443). Telemetry and threat events
              are sent outbound; policy updates and global blocklists are
              streamed back through the persistent connection. Your server
              never listens on any external port for Sentinel.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              What happens if a monitored file like .env is modified?
            </AccordionTrigger>
            <AccordionContent>
              Linux inotify generates a kernel-level notification within
              microseconds. Pasax Sentinel immediately executes an autonomous
              remediation policy: it snapshots the diff, locks the file
              permissions to <code className="font-mono font-bold">0600</code>{" "}
              (read/write only by owner), alerts the SOC console, and
              quarantines the offending process or IP address.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              Does it conflict with UFW or existing iptables firewalls?
            </AccordionTrigger>
            <AccordionContent>
              No. Sentinel creates its own isolated table and set in{" "}
              <code className="font-mono font-bold">nftables</code> (named{" "}
              <code className="font-mono font-bold">pasax_mesh</code>). It
              inserts priority drop rules without overwriting or interfering
              with your existing UFW rules or Docker iptables forward chains.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>
              What are the minimum hardware requirements?
            </AccordionTrigger>
            <AccordionContent>
              The sentinel binary is less than 15MB, requires under 20MB of
              RAM, and runs smoothly on low-end 1-vCPU VPS instances (such as
              1GB RAM DigitalOcean or Hetzner VPS instances) running Linux kernel 5.4
              or higher (Ubuntu 20.04+, Debian 11+, RHEL/Rocky 9+, Alpine
              Linux).
            </AccordionContent>
          </AccordionItem>
        </Accordion></div>
      </div>
    </section>
  )
}
