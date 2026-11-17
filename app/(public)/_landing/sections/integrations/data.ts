/** the modules on the board, shared by the figure and the page's Markdown version */
export interface Module {
  title: string;
  /** one line under the title */
  line: string;
  /** the package or import path that ships it */
  pkg: string;
  /** docs page; without it the cell opens the search dialog */
  href?: string;
  install: string;
}

export const modules: Module[] = [
  {
    title: 'Kernel Drop',
    line: 'Wire-speed netfilter hardware packet filter.',
    pkg: 'pasax-sentinel/nftables',
    href: '/docs/pasax-sentinel',
    install: 'pasax sentinel install --netfilter',
  },
  {
    title: 'Laravel WAF',
    line: 'Zero-dependency pure PHP request firewall.',
    pkg: 'pasax/pasax-secure-monitor',
    href: '/docs/pasax-secure-monitor',
    install: 'composer require pasax/pasax-secure-monitor',
  },
  {
    title: 'FIM Watcher',
    line: 'Real-time inotify file monitoring for .env & webroots.',
    pkg: 'pasax-sentinel/fim',
    href: '/docs/pasax-sentinel',
    install: 'pasax sentinel fim --watch=/var/www',
  },
  {
    title: 'Global Mesh',
    line: 'Autonomous threat ledger across the entire fleet.',
    pkg: 'pasax-core/mesh',
    href: '/docs/core',
    install: 'pasax core sync --blocklist',
  },
  {
    title: 'Threat Radar',
    line: 'Sub-second mTLS health metrics and attack visualizer.',
    pkg: 'pasax-core/telemetry',
    href: '/threats-map',
    install: 'pasax sentinel telemetry --enable',
  },
  {
    title: 'Alert Hooks',
    line: 'Instant dispatch to Telegram, Discord, and SIEM.',
    pkg: 'pasax-core/webhooks',
    href: '/docs/core',
    install: 'pasax core webhook add --telegram',
  },
];

/** further integrations, in the row under the board */
export const more: { name: string; href: string }[] = [
  { name: 'Nginx Proxy', href: '/docs/core' },
  { name: 'Caddy Ingress', href: '/docs/core' },
  { name: 'Docker Guard', href: '/docs/pasax-sentinel' },
  { name: 'Cloudflare Sync', href: '/docs/core' },
  { name: 'Fail2ban Bridge', href: '/docs/pasax-sentinel' },
  { name: 'Prometheus Exporter', href: '/docs/core' },
  { name: 'Grafana Dashboard', href: '/docs/core' },
  { name: 'Auditd Hook', href: '/docs/pasax-sentinel' },
  { name: 'Systemd Daemon', href: '/docs/pasax-sentinel' },
  { name: 'IP Geolocation', href: '/threats-map' },
  { name: 'Tor Exit Filter', href: '/docs/pasax-secure-monitor' },
  { name: 'Bad Bot Blocker', href: '/docs/pasax-secure-monitor' },
  { name: 'SSH Brute Jail', href: '/docs/pasax-sentinel' },
  { name: 'Rate Limiter', href: '/docs/pasax-secure-monitor' },
  { name: 'mTLS Authentication', href: '/docs/core' },
  { name: 'Logrotate Integration', href: '/docs/pasax-sentinel' },
  { name: 'Zero-Trust Token Mesh', href: '/docs/core' },
];
