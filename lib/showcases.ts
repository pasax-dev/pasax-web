import type { StaticImageData } from 'next/image';
import Expostarter from '@/public/showcases/expostarter.png';
import Sunar from '@/public/showcases/sunar.png';
import OpenPanel from '@/public/showcases/openpanel.png';
import Supastarter from '@/public/showcases/supastarter.png';
import BetterAuth from '@/public/showcases/better-auth.png';
import ArkType from '@/public/showcases/arktype.png';
import AssistantUI from '@/public/showcases/assistant-ui.png';
import VisionUI from '@/public/showcases/vision-ui.png';
import MixSpace from '@/public/showcases/mix-space.png';
import TurboStarter from '@/public/showcases/turbostarter.png';
import HexaasBlog from '@/public/showcases/hexaas-blog.png';

export interface ShowcaseObject {
  image?: StaticImageData | string;
  name: string;
  url: string;
}

export const showcases: ShowcaseObject[] = [
  {
    image: '/showcases/shadcn.png',
    name: 'Autonomous SOC Relays',
    url: 'https://soc.pasax.dev',
  },
  {
    image: BetterAuth,
    name: 'Fintech Gateway Bastion',
    url: 'https://gateway.pasax.dev',
  },
  {
    image: '/showcases/c15t.png',
    name: 'Gov Cloud VPS Cluster',
    url: 'https://gov.pasax.dev',
  },
  {
    image: '/showcases/better-t-stack.jpeg',
    name: 'High-Traffic Laravel Cluster',
    url: 'https://waf.pasax.dev',
  },
  {
    image: '/showcases/zod.png',
    name: 'Edge Ingress Sentinel',
    url: 'https://edge.pasax.dev',
  },
  {
    image: '/showcases/prisma.png',
    name: 'Banking API Ingress',
    url: 'https://api-shield.pasax.dev',
  },
  {
    image: '/showcases/nuqs.jpg',
    name: 'E-Commerce Fleet Shield',
    url: 'https://commerce.pasax.dev',
  },
  {
    image: '/showcases/dokploy.png',
    name: 'Healthcare Telemetry Node',
    url: 'https://telemetry.pasax.dev',
  },
  {
    image: '/showcases/ultracite.jpg',
    name: 'Global Threat Radar Relays',
    url: 'https://radar.pasax.dev',
  },
  {
    image: '/showcases/sim.png',
    name: 'Real-time FIM Webroot Guard',
    url: 'https://fim.pasax.dev',
  },
  {
    image: '/showcases/agentskit.png',
    name: 'Cloud VPS Immunity Mesh',
    url: 'https://mesh.pasax.dev',
  },
  {
    image: '/showcases/generative-a11y.png',
    name: 'Autonomous Quarantine Daemon',
    url: 'https://sentinel.pasax.dev',
  },
  {
    image: '/showcases/openpost.png',
    name: 'Packet Filter Wire-Speed Node',
    url: 'https://netfilter.pasax.dev',
  },
  {
    image: '/showcases/turbobulls.png',
    name: 'Zero-Day Threat Interceptor',
    url: 'https://interceptor.pasax.dev',
  },
  {
    image: '/showcases/hotcodepush.webp',
    name: 'Microsecond Bot Drop Fleet',
    url: 'https://bot-drop.pasax.dev',
  },
  {
    image: '/showcases/comfydeploy.png',
    name: 'Enterprise Multi-Tenant Bastion',
    url: 'https://bastion.pasax.dev',
  },
  {
    image: '/showcases/conductor.png',
    name: 'PCI-DSS Ingress Fortress',
    url: 'https://fortress.pasax.dev',
  },
  {
    image: '/showcases/cossistant.png',
    name: 'SaaS Edge Kernel Node',
    url: 'https://edge-kernel.pasax.dev',
  },
  {
    image: '/showcases/llm-gateway.png',
    name: 'Autonomous Honey-Token Relay',
    url: 'https://honey-token.pasax.dev',
  },
  {
    image: '/showcases/nativewind.png',
    name: 'Distributed Blocklist Registry',
    url: 'https://blocklist.pasax.dev',
  },
  {
    image: ArkType,
    name: 'Zero-Overhead PHP Sentinel',
    url: 'https://php-sentinel.pasax.dev',
  },
  {
    image: '/showcases/zen-browser.png',
    name: 'Wireguard Perimeter Gateway',
    url: 'https://perimeter.pasax.dev',
  },
  {
    image: '/showcases/hero-ui.png',
    name: 'nftables Kernel Drop Hub',
    url: 'https://nftables.pasax.dev',
  },
  {
    image: '/showcases/documenso.png',
    name: 'Critical Infrastructure Cluster',
    url: 'https://infra.pasax.dev',
  },
  {
    image: '/showcases/mrscraper.png',
    name: 'Anti-Scrape Fleet Quarantine',
    url: 'https://anti-scrape.pasax.dev',
  },
  {
    image: '/showcases/hiro.png',
    name: 'Secure Enclave Ingress',
    url: 'https://enclave.pasax.dev',
  },
  {
    image: '/showcases/next-faq.png',
    name: 'Autonomous Web Fleet Guard',
    url: 'https://fleet-guard.pasax.dev',
  },
  {
    image: OpenPanel,
    name: 'Audit-Ready SOC Dashboard',
    url: 'https://audit.pasax.dev',
  },
  {
    image: '/showcases/animate-ui.png',
    name: 'Telemetry Ingestion Gateway',
    url: 'https://telemetry-gateway.pasax.dev',
  },
  {
    image: '/showcases/sora-ui.png',
    name: 'High-Throughput Threat Filter',
    url: 'https://filter.pasax.dev',
  },
  {
    image: '/showcases/kibo-ui.jpg',
    name: 'Edge Reverse Proxy Shield',
    url: 'https://proxy-shield.pasax.dev',
  },
  {
    image: '/showcases/hexta-ui.png',
    name: 'Enterprise Cloud Firewall',
    url: 'https://firewall.pasax.dev',
  },
  {
    image: MixSpace,
    name: 'Zero-Trust Bastion Fleet',
    url: 'https://zero-trust.pasax.dev',
  },
  {
    image: '/showcases/libra.png',
    name: 'Autonomous Quarantine Pool',
    url: 'https://quarantine.pasax.dev',
  },
  {
    image: Sunar,
    name: 'Edge DDoS Suppression Mesh',
    url: 'https://ddos.pasax.dev',
  },
  {
    image: '/showcases/freestyle.png',
    name: 'Linux Kernel Hardening Daemon',
    url: 'https://kernel-hardening.pasax.dev',
  },
  {
    image: '/showcases/zap-studio.png',
    name: 'Security Operations Node',
    url: 'https://ops.pasax.dev',
  },
  {
    image: VisionUI,
    name: 'Global Sensor Network',
    url: 'https://sensors.pasax.dev',
  },
  {
    image: '/showcases/yamlresume.png',
    name: 'Declarative Rule Engine',
    url: 'https://rules.pasax.dev',
  },
  {
    image: '/showcases/kaneo.png',
    name: 'Fleet Ingress Shield',
    url: 'https://ingress.pasax.dev',
  },
  {
    image: '/showcases/axionjs.jpg',
    name: 'Real-Time Threat Feed Hub',
    url: 'https://threat-feed.pasax.dev',
  },
  {
    image: '/showcases/codehike.png',
    name: 'Security Compliance Portal',
    url: 'https://compliance.pasax.dev',
  },
  {
    image: AssistantUI,
    name: 'Autonomous AI Threat Triage',
    url: 'https://ai-triage.pasax.dev',
  },
  {
    image: '/showcases/constatic.png',
    name: 'High-Availability WAF Node',
    url: 'https://ha-waf.pasax.dev',
  },
  {
    image: Supastarter,
    name: 'Edge Rate-Limiting Bastion',
    url: 'https://rate-limit.pasax.dev',
  },
  {
    image: Expostarter,
    name: 'Mobile Gateway Ingress Shield',
    url: 'https://mobile-gateway.pasax.dev',
  },
  {
    image: '/showcases/nxjs.png',
    name: 'Core System Watchdog',
    url: 'https://watchdog.pasax.dev',
  },
  {
    image: TurboStarter,
    name: 'Wire-Speed Netfilter Daemon',
    url: 'https://daemon.pasax.dev',
  },
  {
    name: 'Multi-Cloud Sentinel Relay',
    url: 'https://multi-cloud.pasax.dev',
    image: '/showcases/modelfetch.png',
  },
  {
    image: '/showcases/fashnai.png',
    name: 'Enterprise Threat Intelligence',
    url: 'https://intel.pasax.dev',
  },
  {
    name: 'Air-Gapped Sovereign Node',
    url: 'https://sovereign.pasax.dev',
  },
  {
    name: 'Decentralized Threat Mesh',
    url: 'https://threat-mesh.pasax.dev',
  },
  {
    name: 'Linux Fleet Integrity Daemon',
    url: 'https://integrity.pasax.dev',
  },
  {
    name: 'Kernel Space Netfilter Node',
    url: 'https://netfilter-node.pasax.dev',
  },
  {
    name: 'Cloud VPS Fleet Immunity Hub',
    url: 'https://immunity-hub.pasax.dev',
  },
  {
    name: 'Autonomous Quarantine Cluster',
    url: 'https://cluster.pasax.dev',
  },
  {
    name: 'High-Throughput Packet Scrutinizer',
    url: 'https://scrutinizer.pasax.dev',
  },
  {
    name: 'Distributed Inotify Monitor',
    url: 'https://inotify-monitor.pasax.dev',
  },
  {
    name: 'Edge Perimeter Defense Relay',
    url: 'https://perimeter-relay.pasax.dev',
  },
  {
    image: '/showcases/arkenv.png',
    name: 'Enterprise Bastion Core',
    url: 'https://bastion-core.pasax.dev',
  },
];

export const blogs: ShowcaseObject[] = [
  {
    name: 'Sub-0.02ms Wire-Speed Packet Drop in Linux Kernel',
    url: 'https://pasax.dev/docs/pasax-sentinel',
  },
  {
    name: 'Zero-Dependency Standalone Pure PHP WAF Architecture',
    url: 'https://pasax.dev/docs/pasax-secure-monitor',
  },
  {
    name: 'Real-Time Inotify File Integrity Monitoring at Scale',
    url: 'https://pasax.dev/docs/pasax-sentinel/features/fim-realtime',
  },
  {
    image: HexaasBlog,
    name: 'Trinity Mesh: Synchronizing Defense Layers Across VPS Fleets',
    url: 'https://pasax.dev/docs/core',
  },
];

/** Enterprise Fleet Partners & Infrastructure Providers */
export const vercel = [
  {
    name: 'Ubuntu Cloud Fleet',
    url: 'https://ubuntu.com',
  },
  {
    name: 'Debian Enterprise Nodes',
    url: 'https://debian.org',
  },
  {
    name: 'Docker Container Hosts',
    url: 'https://docker.com',
  },
];
