export interface PolicyConfig {
  /** Target CIDR or interface block. */
  target: string;
  /** Sub-0.02ms wire-speed drop rule. */
  netfilter?: boolean;
  /** @deprecated Use `firewallAction`. */
  dropAction?: string;
  /** Quarantine duration in seconds. */
  quarantineTtl?: number;
}

const base = 'inline-flex items-center gap-1.5 rounded-sm border px-3 py-1 font-mono text-xs font-semibold no-underline';

export function Button({ label, href }: { label: string; href?: string }) {
  if (href)
    return (
      <a href={href} className={`${base} border-lp-line bg-fd-secondary text-fd-secondary-foreground hover:bg-lp-ink hover:text-lp-paper`}>
        {label}
      </a>
    );
  return (
    <span className={`${base} border-lp-orange/60 bg-lp-orange/15 text-lp-orange`}>
      {label}
    </span>
  );
}
