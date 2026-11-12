export const siteConfig = {
  name: "Pasak Suite",
  shortName: "Pasak",
  tagline: "Bulletproof Security for Linux VPS & Web Fleets",
  description:
    "Sub-0.2ms kernel-level nftables packet filtering, instant 11ms File Integrity Monitoring (.env auto-lock), and autonomous cloud SOC mesh for Linux VPS & web servers.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://pasak.is-a.dev",
  ogImage: "/logo.png",
  favicon: "/icon.png",
  appleTouchIcon: "/apple-touch-icon.png",
  author: {
    name: "Pasak Dev",
    url: "https://github.com/pasak-dev",
    handle: "@pasak_dev",
  },
  links: {
    github: "https://github.com/pasak-dev/pasak-secure-monitor-laravel",
    docs: "/docs",
    packagist: "https://packagist.org/packages/pasak-dev/secure-monitor",
  },
  keywords: [
    "Pasak Suite",
    "Pasak Sentinel",
    "pasak-security-monitor",
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
