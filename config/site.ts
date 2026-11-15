export const siteConfig = {
  name: "Pasax Suite",
  shortName: "Pasax",
  tagline: "Bulletproof Security for Linux VPS & Web Fleets",
  description:
    "Sub-0.2ms kernel-level nftables packet filtering, instant 11ms File Integrity Monitoring (.env auto-lock), and autonomous cloud SOC mesh for Linux VPS & web servers.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://pasax.is-a.dev",
  ogImage: "/logo.png",
  favicon: "/icon.png",
  appleTouchIcon: "/apple-touch-icon.png",
  author: {
    name: "Pasax Dev",
    url: "https://github.com/pasax-dev",
    handle: "@pasax_dev",
  },
  links: {
    github: "https://github.com/pasax-dev/pasax-secure-monitor-laravel",
    docs: "/docs",
    packagist: "https://packagist.org/packages/pasax/secure-monitor",
  },
  keywords: [
    "Pasax Suite",
    "Pasax Sentinel",
    "pasax-secure-monitor",
    "Linux VPS Security",
    "Kernel Firewall",
    "nftables",
    "eBPF",
    "Laravel WAF",
    "Webshell Scanner",
    "File Integrity Monitoring",
    "FIM auto-healing",
    "Cloud SOC Threat Map",
    "Cloud SOC Mesh",
  ],
}

export type SiteConfig = typeof siteConfig
