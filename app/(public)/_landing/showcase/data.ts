import type { ShowcaseObject } from "@/lib/showcases"

export const suggest = "https://github.com/pasax-dev"

/** the showcase's copy, shared with `/showcase.md`: a title is one sentence, its key terms marked */
export const copy = {
  header: {
    title: [
      "Nodes secured with\u00a0",
      { term: "Pasax" },
      ", trusted\u00a0by\u00a0production fleets.",
    ],
    /** for search results, link previews and the Markdown */
    summary:
      "Autonomous fleet immunity deployments: kernel packet filtering, pure PHP WAF, and live threat telemetry.",
  },
  bastion:
    "Pasax secures high-traffic cloud edges, VPS clusters, and mission-critical ingress bastions in production.",
  vercel:
    "Pasax secures high-traffic cloud edges, VPS clusters, and mission-critical ingress bastions in production.",
  blogs: {
    title: [
      "Deploying Pasax across your ",
      { term: "fleet infrastructure" },
      ".",
    ],
  },
}

/** the featured projects by URL, and what they are in their own words */
export const kinds: Record<string, string> = {
  "https://soc.pasax.dev": "autonomous soc",
  "https://gateway.pasax.dev": "fintech gateway",
  "https://gov.pasax.dev": "sovereign cloud",
  "https://waf.pasax.dev": "laravel cluster",
  "https://edge.pasax.dev": "edge sentinel",
  "https://api-shield.pasax.dev": "banking api shield",
  "https://telemetry.pasax.dev": "telemetry node",
  "https://radar.pasax.dev": "threat radar",
  "https://fim.pasax.dev": "fim webroot guard",
  "https://mesh.pasax.dev": "immunity mesh",
  "https://sentinel.pasax.dev": "quarantine daemon",
  "https://netfilter.pasax.dev": "wire-speed filter",
  "https://pasax.dev/docs/pasax-sentinel": "kernel raw drop",
  "https://pasax.dev/docs/pasax-secure-monitor": "pure php waf",
  "https://pasax.dev/docs/pasax-sentinel/features/fim-realtime": "inotify fim",
  "https://pasax.dev/docs/core": "telemetry mesh",
}

/** the wall's order: the featured with a screenshot, every other site with one, then the rest */
export function arrange(sites: ShowcaseObject[]) {
  const featured: Required<ShowcaseObject>[] = []
  const shots: Required<ShowcaseObject>[] = []
  const blank: ShowcaseObject[] = []
  for (const site of sites) {
    if (!site.image) blank.push(site)
    else if (kinds[site.url]) featured.push({ ...site, image: site.image })
    else shots.push({ ...site, image: site.image })
  }
  return { featured, shots, blank }
}
