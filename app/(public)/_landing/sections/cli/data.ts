/**
 * What `pasax sentinel` writes into a target Linux server node when hardening its
 * defense stack: deploying wire-speed nftables netfilter hooks and real-time inotify FIM monitors.
 */

export interface Entry {
  name: string;
  path: string;
  children?: Entry[];
  open?: boolean;
  /** written by the command */
  added?: boolean;
}

/** a line's change: the import or config setting the command updates */
export interface Change {
  line: number;
  from: string;
  to: string;
}

/** a file the editor shows: its lines around what the command changes */
export interface Source {
  file: string;
  /** the row of the project its imports now resolve to: its cable plugs in there */
  target?: string;
  hunks: { line: number; lines: string[] }[];
  rewires?: Change[];
  /** the line you change in your copy */
  edit?: Change;
}

export interface Plan {
  id: 'customize' | 'add';
  args: string;
  label: string;
  /** what the registry hands over, for the status line */
  fetch: string;
  done: string;
  /** the folder it installs into: its files land first */
  target: string;
  /** the files it writes, in its order */
  files: string[];
  tree: Entry[];
  sources: Source[];
  /** what your edit changes */
  component: string;
}

function paths(block: string): string[] {
  return block.trim().split(/\s+/);
}

/** the server node's root filesystem files */
const project = paths(`
  etc/nftables.conf etc/nginx/nginx.conf etc/security/limits.conf
  etc/systemd/system/pasax.service var/log/pasax/threats.log
  var/www/html/index.php var/www/html/.env
  usr/local/bin/pasax usr/local/bin/pasax-sentinel
  etc/pasax/config.yml etc/pasax/rules/owasp.yml
  etc/pasax/rules/fim.yml lib/systemd/system/pasax-agent.service
`);

/** the project with `files` added, folders first */
function tree(files: string[], open: string[]): Entry[] {
  const root: Entry = { name: '', path: '', children: [] };
  const added = new Set(files);
  for (const path of [...project, ...files]) {
    const parts = path.split('/');
    let entry = root;
    let at = '';
    for (let i = 0; i < parts.length; i++) {
      at = at ? `${at}/${parts[i]}` : parts[i];
      let next = entry.children!.find((child) => child.path === at);
      if (!next) {
        const folder = i < parts.length - 1;
        next = {
          name: parts[i],
          path: at,
          children: folder ? [] : undefined,
          open: folder && open.includes(at),
          added: added.has(path),
        };
        entry.children!.push(next);
      }
      entry = next;
    }
  }
  sort(root);
  return root.children!;
}

function sort(entry: Entry) {
  if (!entry.children) return;
  entry.children.sort(
    (a, b) => Number(!a.children) - Number(!b.children) || a.name.localeCompare(b.name),
  );
  for (const child of entry.children) sort(child);
}

const hardenFiles = paths(`
  etc/nftables.d/drop.nft etc/pasax/rules/synflood.nft etc/pasax/rules/portscan.nft
  etc/pasax/rules/ratelimit.nft etc/pasax/certs/node-cert.crt etc/pasax/certs/node-key.key
  etc/nftables.d/banlist.nft etc/pasax/rules/blocklist.cidr etc/pasax/mesh/routes.json
  etc/systemd/system/pasax-sentinel.service usr/local/bin/pasax-ebpf
`);

const fimFiles = paths(`
  etc/pasax/fim/watchers.yml etc/pasax/fim/tamper.sh
  var/log/pasax/audit.log etc/pasax/rules/quarantine.rule
`);

export const plans: Plan[] = [
  {
    id: 'customize',
    args: 'sentinel harden --netfilter',
    label: 'Harden Node',
    fetch: 'sentinel/nftables-hooks',
    done: 'nftables wire-speed drop active',
    target: 'etc/nftables.d',
    component: 'Kernel Drop',
    files: hardenFiles,
    tree: tree(
      hardenFiles,
      paths('etc etc/nftables.d etc/pasax etc/pasax/rules etc/pasax/certs etc/pasax/mesh'),
    ),
    sources: [
      {
        file: 'etc/nftables.conf',
        target: 'etc/nftables.d/drop.nft',
        rewires: [
          {
            line: 2,
            from: 'chain input { policy accept; }',
            to: 'chain input { priority -300; policy drop; }',
          },
        ],
        hunks: [
          {
            line: 1,
            lines: [
              '#!/usr/sbin/nft -f',
              'table inet pasax_shield {',
              '  chain input { priority -300; policy drop; }',
              '  include "/etc/nftables.d/*.nft"',
              '}',
            ],
          },
        ],
      },
      {
        file: 'etc/pasax/config.yml',
        target: 'etc/pasax/rules/synflood.nft',
        rewires: [{ line: 5, from: 'mode: monitor', to: 'mode: quarantine-drop' }],
        hunks: [
          {
            line: 1,
            lines: [
              '# Pasax Autonomous Fleet Immunity',
              'node_id: sentinel-sg-01',
              'cluster_mesh: apac-singapore-gateway',
              'sentinel:',
              '  mode: quarantine-drop',
              '  sub_millisecond_filter: true',
              '  hardware_offload: true',
            ],
          },
        ],
      },
      {
        file: 'etc/nftables.d/drop.nft',
        edit: { line: 8, from: '20ms', to: '0.02ms' },
        hunks: [
          {
            line: 5,
            lines: [
              '# Wire-speed hardware packet drop rules',
              'chain ddos_mitigation {',
              '  tcp flags syn tcp dport { 80, 443 } meter syn-flood { ip saddr limit rate 500/second } accept',
              '  drop comment "pasax: mitigated in 0.02ms"',
              '}',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'add',
    args: 'sentinel fim --watch=/var/www',
    label: 'Arm FIM Guard',
    fetch: 'sentinel/fim-watcher',
    done: 'inotify real-time FIM armed',
    target: 'etc/pasax/fim',
    component: 'Inotify FIM',
    files: fimFiles,
    tree: tree(fimFiles, paths('etc etc/pasax etc/pasax/fim var var/log var/log/pasax')),
    sources: [
      {
        file: 'etc/pasax/fim/watchers.yml',
        target: 'etc/pasax/fim/tamper.sh',
        rewires: [
          { line: 4, from: 'action: notify-slack', to: 'action: isolate-process' },
        ],
        edit: { line: 12, from: 'log_only', to: 'instant_quarantine' },
        hunks: [
          {
            line: 1,
            lines: [
              '# Inotify Real-Time Kernel File Integrity Monitor',
              'paths:',
              '  - target: /var/www/html/.env',
              '    action: isolate-process',
              '    events: [MODIFY, ATTRIB, DELETE, MOVE]',
            ],
          },
          {
            line: 10,
            lines: [
              'lockdown:',
              '  quarantine_tamperer: instant_quarantine',
              '  restore_backup: true',
            ],
          },
        ],
      },
      {
        file: 'etc/pasax/rules/quarantine.rule',
        target: 'etc/pasax/config.yml',
        rewires: [{ line: 3, from: 'auto_isolate: false', to: 'auto_isolate: true' }],
        hunks: [
          {
            line: 1,
            lines: [
              '# Process containment on malicious file change',
              'rule: FIM_ENV_TAMPER',
              'auto_isolate: true',
              'signal: SIGSTOP',
            ],
          },
        ],
      },
    ],
  },
];

/** a written file on its way into the tree: the row it lands in, its own or the closed folder that
 * takes it, and the rows that show once it landed */
interface Delivery {
  path: string;
  name: string;
  inlet: string;
  reveals: string[];
}

/** the files row by row, the target's first; a closed folder takes its files in the CLI's order */
export function deliveries(plan: Plan): Delivery[] {
  const rows: string[] = [];
  const open = new Set<string>();
  function walk(entries: Entry[]) {
    for (const entry of entries) {
      rows.push(entry.path);
      if (entry.open) {
        open.add(entry.path);
        walk(entry.children!);
      }
    }
  }
  walk(plan.tree);

  const out: Delivery[] = [];
  for (const path of plan.files) {
    const parts = path.split('/');
    const reveals: string[] = [];
    let inlet = path;
    let at = '';
    for (let i = 0; i < parts.length; i++) {
      at = at ? `${at}/${parts[i]}` : parts[i];
      reveals.push(at);
      if (i < parts.length - 1 && !open.has(at)) {
        inlet = at;
        break;
      }
    }
    out.push({ path, name: parts[parts.length - 1], inlet, reveals });
  }

  const rank = (d: Delivery) =>
    (d.path.startsWith(`${plan.target}/`) ? 0 : rows.length) + rows.indexOf(d.inlet);
  return out.sort((a, b) => rank(a) - rank(b));
}
