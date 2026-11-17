import type { Layer } from '../../ui/chip';

/** the layers top down: the order of the stack and of its labels */
export const LAYERS: Layer[] = ['ui', 'core', 'content', 'framework'];

/** each layer's name in a sentence */
export const NAMES: Record<Layer, string> = {
  ui: 'SOC',
  core: 'Core',
  content: 'Vectors',
  framework: 'Host',
};

/** what each layer does, beside its name in the panel */
export const ROLES: Record<Layer, string> = {
  ui: 'Centralized SOC & threat telemetry',
  core: 'Kernel IPC, taxonomy & threat ledger',
  content: 'Detection vectors & rule engine',
  framework: 'Target Linux host & web runtime',
};

export type SwapLayer = Exclude<Layer, 'core'>;

/** how a module looks on the stack: the UI's screen, the content's bay, the framework's case */
export type Look = 'styled' | 'plain' | 'edited' | 'files' | 'blocks' | 'ink' | 'paper' | 'grey';

export interface Option {
  /** its name in prose, as the docs spell it */
  title: string;
  /** its name on a plate too narrow for the title */
  short: string;
  /** the package */
  name: string;
  /** what it does, told as the arm sets it */
  line: string;
  /** what a caption calls it, where not its title */
  caption?: string;
  look: Look;
  /** a content source's three pages, and what Core's search types to find the second */
  pages?: Page[];
  query?: string;
}

/** a page a content source brings: its title, and its file for one read from files */
export interface Page {
  title: string;
  file?: string;
}

/** the core never swaps: every other layer plugs into it */
export const CORE: Omit<Option, 'look'> = {
  title: 'Pasax Core',
  short: 'Core',
  name: 'pasax-core',
  line: 'The unified security bus: kernel IPC, threat taxonomy, global blocklist & telemetry.',
};

export const OPTIONS: Record<SwapLayer, Option[]> = {
  ui: [
    {
      title: 'Cloud SOC',
      short: 'SOC',
      name: 'pasax-web',
      line: 'Centralized telemetry, live threat radar, and multi-tenant fleet operations.',
      look: 'styled',
    },
    {
      title: 'SIEM Alerts',
      caption: 'custom alerts',
      short: 'Alerts',
      name: '@pasax/alerts',
      line: 'Stream instant incident alerts to Telegram, Slack, and SIEM pipelines.',
      look: 'plain',
    },
    {
      title: 'Terminal CLI',
      caption: 'pasax top terminal',
      short: 'CLI',
      name: 'pasax-cli',
      line: 'Real-time terminal dashboard with live traffic, blocked IPs, and memory stats.',
      look: 'edited',
    },
  ],
  content: [
    {
      title: 'OWASP WAF',
      short: 'WAF',
      name: '@pasax/waf',
      line: 'Detects SQLi, XSS, RCE, LFI, and SSRF in sub-0.2 milliseconds.',
      look: 'files',
      pages: [
        { title: 'SQLi Filter', file: 'sqli.rule' },
        { title: 'XSS Shield', file: 'xss.rule' },
        { title: 'RCE Guard', file: 'rce.rule' },
      ],
      query: 'sqli',
    },
    {
      title: 'Kernel Drop',
      short: 'Kernel',
      name: '@pasax/nft',
      line: 'Wire-speed netfilter hardware packet drops for DDoS and port scanners.',
      look: 'blocks',
      pages: [
        { title: 'SYN Flood', file: 'syn.nft' },
        { title: 'Port Scan', file: 'scan.nft' },
        { title: 'Rate Burst', file: 'burst.nft' },
      ],
      query: 'syn',
    },
    {
      title: 'FIM Watcher',
      short: 'FIM',
      name: '@pasax/fim',
      line: 'Inotify kernel hooks monitoring .env, config, and webroot tampering.',
      look: 'files',
      pages: [
        { title: 'Env Guard', file: '.env' },
        { title: 'Nginx Conf', file: 'nginx.conf' },
        { title: 'PHP-FPM Pool', file: 'www.conf' },
      ],
      query: 'env',
    },
    {
      title: 'Threat Intel',
      short: 'Intel',
      name: '@pasax/intel',
      line: 'P2P synchronized reputation ledger with over 250,000 bad IPs.',
      look: 'blocks',
      pages: [
        { title: 'Bad IPs', file: 'bad.ip' },
        { title: 'Tor Exits', file: 'tor.ip' },
        { title: 'Bot CIDR', file: 'bot.cidr' },
      ],
      query: 'bot',
    },
    {
      title: 'Rate Limiter',
      short: 'RateLimit',
      name: '@pasax/rate',
      line: 'Adaptive sliding-window rate limiting per IP, API token, or route.',
      look: 'files',
      pages: [
        { title: 'Auth Burst', file: 'auth.limit' },
        { title: 'API Throttle', file: 'api.limit' },
        { title: 'DDoS Mitigate', file: 'ddos.limit' },
      ],
      query: 'auth',
    },
  ],
  framework: [
    {
      title: 'Ubuntu Linux',
      short: 'Ubuntu',
      name: 'linux-debian',
      line: 'Native systemd background daemon with zero CPU overhead.',
      look: 'ink',
    },
    {
      title: 'RHEL Linux',
      short: 'RHEL',
      name: 'linux-rhel',
      line: 'Enterprise Linux compatibility with SELinux & nftables.',
      look: 'paper',
    },
    {
      title: 'Alpine Docker',
      short: 'Alpine',
      name: 'linux-alpine',
      line: 'Ultra-lightweight musl binary for microVMs and containers.',
      look: 'grey',
    },
    {
      title: 'Laravel Engine',
      short: 'Laravel',
      name: 'laravel-waf',
      line: 'Zero-dependency pure PHP middleware with automatic threat quarantine.',
      look: 'paper',
    },
    {
      title: 'Nginx Proxy',
      short: 'Nginx',
      name: 'edge-proxy',
      line: 'Transparent layer-7 inspection and connection draining.',
      look: 'grey',
    },
  ],
};
