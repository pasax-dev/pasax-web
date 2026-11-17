"use client"

import * as React from "react"
import {
  Code2,
  Globe,
  Server,
  Layers,
  ArrowRight,
  Workflow,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

export function VpsUseCases() {
  const useCases = [
    {
      badge: "PHP & LARAVEL FLEETS",
      badgeColor: "border-rose-500/30 bg-rose-500/10 text-rose-500",
      icon: Code2,
      iconColor: "text-rose-500",
      title: "Laravel & PHP Production Apps",
      subtitle: "Full Stack Protection via pasax/shield",
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
      badgeColor: "border-sky-500/30 bg-sky-500/10 text-sky-500",
      icon: Globe,
      iconColor: "text-sky-500",
      title: "WordPress & WooCommerce VPS",
      subtitle: "Kernel-Level Plugin Exploit Barrier",
      description:
        "WordPress sites hosted on unmanaged VPS are constantly attacked via xmlrpc.php and vulnerable plugins. Pasax drops exploit traffic at the kernel before PHP consumes server CPU.",
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
      badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
      icon: Server,
      iconColor: "text-emerald-500",
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
      badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-500",
      icon: Workflow,
      iconColor: "text-purple-500",
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
    <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
          <Layers className="size-3.5 text-sky-500" />
          <span>PRODUCTION WORKLOADS</span>
        </div>
        <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-5xl">
          Built for What You Actually Run on VPS
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          Whether you host a single Laravel SaaS, a fleet of client WordPress
          sites, or high-throughput API microservices.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:gap-8">
        {useCases.map((uc, i) => {
          const Icon = uc.icon
          return (
            <div
              key={i}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-sky-500/30 hover:bg-card/70 xl:p-7"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl border border-border/40 bg-muted/30 ${uc.iconColor}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${uc.badgeColor}`}
                  >
                    {uc.badge}
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-foreground">
                  {uc.title}
                </h3>
                <p className="mt-0.5 font-sans text-xs text-sky-500">
                  {uc.subtitle}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {uc.description}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-border/40 pt-3">
                  {uc.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs text-foreground/85"
                    >
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-border/40 pt-4">
                <Link
                  href={uc.href}
                  className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-sky-500 transition-transform group-hover:translate-x-0.5 hover:text-sky-400"
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
