/** the source the figure edits: a policy config, `dropAction` deprecated by the edit */
export const FILE = "policy.ts"
export const EDIT = "  /** @deprecated Use `firewallAction`. */"
export const SOURCE = `export interface PolicyConfig {
  /** Target CIDR or interface block. */
  target: string;
  /** Sub-0.02ms wire-speed drop rule. */
  netfilter?: boolean;
${EDIT}
  dropAction?: string;
  /** Quarantine duration in seconds. */
  quarantineTtl?: number;
}`

/** the source as it was before the edit, and the line the edit adds */
export const BEFORE = SOURCE.replace(`${EDIT}\n`, "")
export const EDIT_LINE = SOURCE.split("\n").indexOf(EDIT)

/** the type's name in the source, and where the build keeps the tables generated from it */
export const TYPE_NAME = "PolicyConfig"
export const TYPE_TABLES = ".type-tables"

/** the page the source documents */
export const PAGE = {
  title: "Security Policy",
  description: "Autonomous WAF & kernel drop coordinator.",
}

/** the component's releases, newest first: the first ships the edit */
export const RELEASES = [
  {
    title: "v1.0.2",
    description: "Laravel 10-13 WAF, zero NPM, ReDoS defense.",
  },
  {
    title: "v1.0.0",
    description: "Kernel nftables hardware drop & FIM inotify.",
  },
]

/**
 * What the source makes, in the order its thread reaches them, one clockwise loop round the desk:
 * each window, its title, and the status it reports as it pops.
 */
export const OUTPUTS = [
  { id: "props", title: "SecurityPolicy", status: "validating policy rules" },
  { id: "page", title: "threat-map", status: "streaming node telemetry" },
  { id: "og", title: "radar.png", status: "rendering threat radar" },
  { id: "llms", title: "blocklist.txt", status: "syncing global blocklist" },
  { id: "releases", title: "advisories", status: "reading security advisory" },
] as const

export type Output = (typeof OUTPUTS)[number]["id"]
