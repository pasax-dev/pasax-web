import type { StaticImageData } from "next/image"

export interface ShowcaseObject {
  image?: StaticImageData | string
  name: string
  url: string
}

export const showcases: ShowcaseObject[] = [
  {
    image: "/showcases/security-soc.webp",
    name: "Autonomous SOC Relays",
    url: "https://soc.pasax.dev",
  },
  {
    image: "/showcases/security-gateway.webp",
    name: "Fintech Gateway Bastion",
    url: "https://gateway.pasax.dev",
  },
  {
    image: "/showcases/security-gov.webp",
    name: "Gov Cloud VPS Cluster",
    url: "https://gov.pasax.dev",
  },
  {
    image: "/showcases/security-waf.webp",
    name: "High-Traffic Laravel Cluster",
    url: "https://waf.pasax.dev",
  },
  {
    image: "/showcases/security-edge.webp",
    name: "Edge Ingress Sentinel",
    url: "https://edge.pasax.dev",
  },
  {
    image: "/showcases/security-api-shield.webp",
    name: "Banking API Ingress",
    url: "https://api-shield.pasax.dev",
  },
  {
    image: "/showcases/security-commerce.webp",
    name: "E-Commerce Fleet Shield",
    url: "https://commerce.pasax.dev",
  },
  {
    image: "/showcases/security-telemetry.webp",
    name: "Healthcare Telemetry Node",
    url: "https://telemetry.pasax.dev",
  },
  {
    image: "/showcases/security-radar.webp",
    name: "Global Threat Radar Relays",
    url: "https://radar.pasax.dev",
  },
  {
    image: "/showcases/security-fim.webp",
    name: "Real-time FIM Webroot Guard",
    url: "https://fim.pasax.dev",
  },
  {
    image: "/showcases/security-mesh.webp",
    name: "Cloud VPS Immunity Mesh",
    url: "https://mesh.pasax.dev",
  },
  {
    image: "/showcases/security-sentinel.webp",
    name: "Autonomous Quarantine Daemon",
    url: "https://sentinel.pasax.dev",
  },
  {
    image: "/showcases/security-netfilter.webp",
    name: "Packet Filter Wire-Speed Node",
    url: "https://netfilter.pasax.dev",
  },
  {
    image: "/showcases/security-interceptor.webp",
    name: "Zero-Day Threat Interceptor",
    url: "https://interceptor.pasax.dev",
  },
  {
    image: "/showcases/security-bot-drop.webp",
    name: "Microsecond Bot Drop Fleet",
    url: "https://bot-drop.pasax.dev",
  },
  {
    image: "/showcases/security-bastion.webp",
    name: "Enterprise Multi-Tenant Bastion",
    url: "https://bastion.pasax.dev",
  },
  {
    image: "/showcases/security-fortress.webp",
    name: "PCI-DSS Ingress Fortress",
    url: "https://fortress.pasax.dev",
  },
  {
    image: "/showcases/security-edge-kernel.webp",
    name: "SaaS Edge Kernel Node",
    url: "https://edge-kernel.pasax.dev",
  },
  {
    image: "/showcases/security-honey-token.webp",
    name: "Autonomous Honey-Token Relay",
    url: "https://honey-token.pasax.dev",
  },
  {
    image: "/showcases/security-blocklist.webp",
    name: "Distributed Blocklist Registry",
    url: "https://blocklist.pasax.dev",
  },
  {
    image: "/showcases/security-php-sentinel.webp",
    name: "Zero-Overhead PHP Sentinel",
    url: "https://php-sentinel.pasax.dev",
  },
  {
    image: "/showcases/security-perimeter.webp",
    name: "Wireguard Perimeter Gateway",
    url: "https://perimeter.pasax.dev",
  },
  {
    image: "/showcases/security-nftables.webp",
    name: "nftables Kernel Drop Hub",
    url: "https://nftables.pasax.dev",
  },
  {
    image: "/showcases/security-infra.webp",
    name: "Critical Infrastructure Cluster",
    url: "https://infra.pasax.dev",
  },
  {
    image: "/showcases/security-anti-scrape.webp",
    name: "Anti-Scrape Fleet Quarantine",
    url: "https://anti-scrape.pasax.dev",
  },
  {
    image: "/showcases/security-enclave.webp",
    name: "Secure Enclave Ingress",
    url: "https://enclave.pasax.dev",
  },
  {
    image: "/showcases/security-fleet-guard.webp",
    name: "Autonomous Web Fleet Guard",
    url: "https://fleet-guard.pasax.dev",
  },
  {
    image: "/showcases/security-audit.webp",
    name: "Audit-Ready SOC Dashboard",
    url: "https://audit.pasax.dev",
  },
  {
    image: "/showcases/security-telemetry-gateway.webp",
    name: "Telemetry Ingestion Gateway",
    url: "https://telemetry-gateway.pasax.dev",
  },
  {
    image: "/showcases/security-filter.webp",
    name: "High-Throughput Threat Filter",
    url: "https://filter.pasax.dev",
  },
  {
    image: "/showcases/security-proxy-shield.webp",
    name: "Edge Reverse Proxy Shield",
    url: "https://proxy-shield.pasax.dev",
  },
  {
    image: "/showcases/security-firewall.webp",
    name: "Enterprise Cloud Firewall",
    url: "https://firewall.pasax.dev",
  },
  {
    image: "/showcases/security-zero-trust.webp",
    name: "Zero-Trust Bastion Fleet",
    url: "https://zero-trust.pasax.dev",
  },
  {
    image: "/showcases/security-quarantine.webp",
    name: "Autonomous Quarantine Pool",
    url: "https://quarantine.pasax.dev",
  },
  {
    image: "/showcases/security-ddos.webp",
    name: "Edge DDoS Suppression Mesh",
    url: "https://ddos.pasax.dev",
  },
  {
    image: "/showcases/security-kernel-hardening.webp",
    name: "Linux Kernel Hardening Daemon",
    url: "https://kernel-hardening.pasax.dev",
  },
  {
    image: "/showcases/security-ops.webp",
    name: "Security Operations Node",
    url: "https://ops.pasax.dev",
  },
  {
    image: "/showcases/security-sensors.webp",
    name: "Global Sensor Network",
    url: "https://sensors.pasax.dev",
  },
  {
    image: "/showcases/security-rules.webp",
    name: "Declarative Rule Engine",
    url: "https://rules.pasax.dev",
  },
  {
    image: "/showcases/security-ingress.webp",
    name: "Fleet Ingress Shield",
    url: "https://ingress.pasax.dev",
  },
  {
    image: "/showcases/security-threat-feed.webp",
    name: "Real-Time Threat Feed Hub",
    url: "https://threat-feed.pasax.dev",
  },
  {
    image: "/showcases/security-compliance.webp",
    name: "Security Compliance Portal",
    url: "https://compliance.pasax.dev",
  },
  {
    image: "/showcases/security-ai-triage.webp",
    name: "Autonomous AI Threat Triage",
    url: "https://ai-triage.pasax.dev",
  },
  {
    image: "/showcases/security-ha-waf.webp",
    name: "High-Availability WAF Node",
    url: "https://ha-waf.pasax.dev",
  },
]

export const blogs: ShowcaseObject[] = [
  {
    image: "/showcases/security-netfilter.webp",
    name: "Sub-0.02ms Wire-Speed Packet Drop in Linux Kernel",
    url: "https://pasax.dev/docs/pasax-sentinel",
  },
  {
    image: "/showcases/security-waf.webp",
    name: "Zero-Dependency Standalone Pure PHP WAF Architecture",
    url: "https://pasax.dev/docs/pasax-secure-monitor",
  },
  {
    image: "/showcases/security-fim.webp",
    name: "Real-Time Inotify File Integrity Monitoring at Scale",
    url: "https://pasax.dev/docs/pasax-sentinel/features/fim-realtime",
  },
  {
    image: "/showcases/security-mesh.webp",
    name: "Trinity Mesh: Synchronizing Defense Layers Across VPS Fleets",
    url: "https://pasax.dev/docs/core",
  },
]

/** Core Bastion Infrastructure Providers & Integrated Defense Relays */
export const coreBastions: ShowcaseObject[] = [
  {
    name: "Linux Kernel nftables Core",
    url: "https://pasax.dev/docs/pasax-sentinel",
  },
  {
    name: "Laravel Pure PHP Shield WAF",
    url: "https://pasax.dev/docs/pasax-secure-monitor",
  },
  {
    name: "Autonomous inotify FIM Guard",
    url: "https://pasax.dev/docs/pasax-sentinel/features/fim-realtime",
  },
  {
    name: "Trinity Fleet Telemetry Mesh",
    url: "https://pasax.dev/docs/core",
  },
]

export const vercel = coreBastions
