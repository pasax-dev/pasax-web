"use client"

import * as React from "react"
import {
  Code2,
  FileCode2,
  Globe,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Workflow,
} from "lucide-react"
import Link from "next/link"

export function VpsUseCases() {
  const useCases = [
    {
      badge: "PHP & LARAVEL FLEETS",
      icon: Code2,
      iconBg: "bg-red-400 text-black",
      title: "Laravel & PHP Production Apps",
      subtitle: "Full Stack Protection via pasak/shield",
      description:
        "Stops stepped brute-force attacks on login routes, traps automated bots with fake .git & phpmyadmin honeypots, and prevents webshell execution inside PHP-FPM workers.",
      features: [
        "13 Security Middlewares embedded",
        "Stepped Login Lockout (1m–24h)",
        "Zero-Tolerance Payload Inspection",
      ],
      linkText: "Read Laravel Docs",
      href: "/docs/getting-started/introduction",
    },
    {
      badge: "CMS & WORDPRESS VPS",
      icon: Globe,
      iconBg: "bg-sky-400 text-black",
      title: "WordPress & WooCommerce VPS",
      subtitle: "Kernel-Level Plugin Exploit Barrier",
      description:
        "WordPress sites hosted on unmanaged VPS are constantly attacked via xmlrpc.php and vulnerable plugins. Pasak drops exploit traffic at the kernel before PHP consumes server CPU.",
      features: [
        "Instant wp-config.php permission lock",
        "Neutralizes CVE-2024 exploit probes",
        "Tarpit decoy honeypots for bot scanners",
      ],
      linkText: "Explore Web Hardening",
      href: "/docs/api-reference/api-overview",
    },
    {
      badge: "MODERN APIS & DOCKER",
      icon: Server,
      iconBg: "bg-emerald-400 text-black",
      title: "Node.js, Go & Docker Containers",
      subtitle: "Layer 3/4 Wire-Speed Rate Limiting",
      description:
        "Protect Node.js event-loops and Go microservices from volumetric HTTP floods and SYN sweeps. Malicious packets are discarded at the network interface with 0.12ms latency.",
      features: [
        "Raw socket SYN-flood mitigation",
        "Docker host container compatibility",
        "Zero performance penalty on I/O throughput",
      ],
      linkText: "View Daemon Specs",
      href: "/docs/core-architecture/threat-detection-engine",
    },
    {
      badge: "HOSTING & AGENCIES",
      icon: Workflow,
      iconBg: "bg-amber-300 text-black",
      title: "Agencies & Multi-Server Fleets",
      subtitle: "Central SOC Mesh Intelligence",
      description:
        "Manage 10 to 500 client droplets across different cloud providers from one unified dashboard. When one VPS is attacked, the malicious IP is quarantined across your entire fleet.",
      features: [
        "Sub-second collective blocklist sync",
        "Virtual Host & SSL expiry monitor",
        "Telegram & Discord webhook alerts",
      ],
      linkText: "Launch Fleet SOC",
      href: "/dashboard",
    },
  ]

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
          <Layers className="size-3.5 text-main" />
          <span>PRODUCTION WORKLOADS</span>
        </div>
        <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Built for What You Actually Run on VPS
        </h2>
        <p className="mt-3 text-base font-base text-foreground/80 sm:text-lg">
          Whether you host a single Laravel SaaS, a fleet of client WordPress sites, or high-throughput API microservices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
        {useCases.map((uc, i) => {
          const Icon = uc.icon
          return (
            <div
              key={i}
              className="flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-6 xl:p-7 shadow-shadow hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_var(--border)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex size-10 items-center justify-center rounded-base border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] ${uc.iconBg}`}
                  >
                    <Icon className="size-5 stroke-[2.5]" />
                  </div>
                  <span className="font-mono text-[9px] font-black uppercase text-foreground/80 border border-border bg-background px-1.5 py-0.5 rounded">
                    {uc.badge}
                  </span>
                </div>

                <h3 className="font-heading text-base font-black text-foreground">
                  {uc.title}
                </h3>
                <p className="font-mono text-[11px] font-bold text-main mt-0.5">
                  {uc.subtitle}
                </p>

                <p className="mt-3 text-xs text-foreground/80 leading-relaxed font-base">
                  {uc.description}
                </p>

                <div className="mt-4 pt-3 border-t border-border/60 space-y-1.5">
                  {uc.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs font-mono text-foreground">
                      <ShieldCheck className="size-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t-2 border-border">
                <Link
                  href={uc.href}
                  className="inline-flex items-center gap-1.5 font-heading text-xs font-bold text-foreground hover:text-main transition-colors"
                >
                  <span>{uc.linkText}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
