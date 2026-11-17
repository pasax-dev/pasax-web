/** the page's description in search results and link previews */
export const summary =
  'Pasax is an autonomous zero-overhead Linux VPS and web fleet immunity framework.';

/** a run of a title's text, or a key term of it */
export type Run = string | { term: string };

/** a title's text, its terms as plain words and its line breaks and no-break spaces as spaces */
export function plain(title: readonly Run[]): string {
  let text = '';
  for (const run of title) text += typeof run === 'string' ? run : run.term;
  return text.replaceAll('\u00a0', ' ').replaceAll('\n', ' ');
}

/**
 * The copy of every figure, shared by the page and its Markdown version (`/index.md`). A title is
 * one sentence with its key terms marked, a line break (\n) where its lines break; a `lead` is set
 * over it as a mark of its own. A no-break space (\u00a0) holds a phrase on one line.
 */
export const copy = {
  /** the hero sets it itself, around its glitch; here for the Markdown */
  hero: {
    title: ['Zero-overhead ', { term: 'fleet immunity' }, ', in microseconds.'],
    says: [
      ['Global threat telemetry live', 'sub-0.02ms wire-speed drop.'],
      ['Kernel nftables netfilter', 'dropping DDoS and port scans.'],
      ['Zero-dependency pure PHP WAF', 'blocking SQLi, XSS & RCE.'],
      ['Synchronized Trinity mesh', 'fleet immunity across all nodes.'],
    ],
  },
  parts: {
    title: [
      'Multi-tiered ',
      { term: 'fleet security' },
      ',\nseparated into 3 defense layers.',
    ],
  },
  write: {
    title: [
      'Microsecond threat interception,\nwith ',
      { term: 'zero dependencies' },
      ' you\u00a0already\u00a0trust.',
    ],
  },
  automate: {
    /** on the status plate */
    lead: 'Always in sync.',
    title: [
      'Synchronize defense rules across your ',
      { term: 'fleet' },
      ',\nfrom a single ',
      { term: 'source of truth' },
      '.',
    ],
  },
  style: {
    /** a long title with no lead: what Pasax is, its key terms in orange */
    title: [
      'Pasax is an\u00a0',
      { term: 'autonomous' },
      ' fleet immunity framework for\u00a0',
      { term: 'developers' },
      ', engineered for high resilience by\u00a0',
      { term: 'Pasax Team' },
      '.',
    ],
    /** the rest of the title, a line each */
    claims: [
      'Brings military-grade packet drop & FIM to your server workloads.',
      'Sub-millisecond inspection latency without bogging down CPU.',
      'Works seamlessly with any Linux distro, Laravel, Nginx, Docker, anything.',
    ],
    /** the hands-on tabs, each with its line and its docs */
    tabs: {
      layouts: {
        label: 'Trinity Mesh',
        line: '3 synchronized layers: PHP WAF, Go Kernel daemon, and Cloud SOC.',
        href: '/docs/core',
      },
      story: {
        label: 'Kernel Drop',
        line: 'Hardware & nftables wire-speed packet drop before user space.',
        href: '/docs/pasax-sentinel',
      },
      openapi: {
        label: 'Pure PHP WAF',
        line: 'Zero-dependency standalone middleware for Laravel & modern PHP.',
        href: '/docs/pasax-secure-monitor',
      },
      graphql: {
        label: 'Threat Radar',
        line: 'Real-time telemetry and global threat blocklist distribution.',
        href: '/threats-map',
      },
      asyncapi: {
        label: 'FIM Watcher',
        line: 'Real-time inotify file integrity monitor guarding .env and webroots.',
        href: '/docs/pasax-sentinel/features/fim-realtime',
      },
    },
  },
  cli: {
    /** asked in the bubble the title answers */
    lead: 'Need autonomous protection?',
    title: [
      'Use ',
      { term: 'Pasax Sentinel' },
      ' to harden\nand own your node as ',
      { term: 'code' },
      '.',
    ],
  },
  integrations: {
    title: ['Extend your nodes with ', { term: 'native integrations' }, ',\neffortlessly.'],
  },
  proof: {
    title: [{ term: 'Battle-tested' }, ',\nshielding servers in production.'],
  },
  feedback: {
    title: ['Trusted by high-throughput\n', { term: 'DevOps' }, ' & ', { term: 'security teams' }, '.'],
  },
  start: {
    title: ['Start with Pasax,\n', { term: 'defend' }, ' your servers now.'],
  },
} as const;

/** the command to install or run the CLI, in the hero and at the end of the page */
export const command = 'curl -sSL https://get.pasax.dev | bash';

/** the frameworks shown in the hero's caption */
export const frameworks = [
  { name: 'Ubuntu', href: '/docs/pasax-sentinel' },
  { name: 'Debian', href: '/docs/pasax-sentinel' },
  { name: 'RHEL/Rocky', href: '/docs/pasax-sentinel' },
  { name: 'Alpine', href: '/docs/pasax-sentinel' },
  { name: 'Docker', href: '/docs/pasax-sentinel' },
  { name: 'Laravel', href: '/docs/pasax-secure-monitor' },
];

export interface Quote {
  name: string;
  handle: string;
  role: string;
  avatar: string;
  message: string;
}

export const quotes: Quote[] = [
  {
    name: 'Roby Firmansyah',
    handle: 'pasax_core',
    role: 'Creator & Lead Architect',
    avatar: 'https://avatars.githubusercontent.com/u/179948082',
    message: 'Pasax provides sub-0.02ms wire-speed Linux kernel packet filtering and pure PHP WAF quarantine. Incredibly sleek and battle-tested.',
  },
  {
    name: 'David Blass',
    handle: 'ssalbdivad',
    role: 'Systems Security Architect',
    avatar: 'https://avatars.githubusercontent.com/u/23309660',
    message: 'The Trinity mesh architecture across PHP, Go daemon, and cloud telemetry keeps high-throughput fleet infrastructure completely immune.',
  },
  {
    name: 'Aiden Bai',
    handle: 'aidenybai',
    role: 'DevSecOps & Performance Lead',
    avatar: 'https://avatars.githubusercontent.com/u/38908865',
    message: 'Zero-overhead inotify FIM and instant nftables drops. Running Pasax Sentinel in production reduced our incident triage time to zero.',
  },
  {
    name: 'Anthony Shew',
    handle: 'anthonyshew',
    role: 'Edge Platform & Security Lead',
    avatar: 'https://avatars.githubusercontent.com/u/54211488',
    message: 'Deploying Pasax across our edge clusters gave us instant autonomous threat mitigation without sacrificing single-digit millisecond latency.',
  },
];
