/** each preset's name; its id is its telemetry theme profile, `soc-telemetry/<id>.json` */
export const THEME_NAMES = {
  neutral: "Neutral",
  black: "Stealth",
  vitepress: "Hardened",
  dusk: "Dusk",
  catppuccin: "Cyber",
  ocean: "Ocean",
  purple: "Perimeter",
  solar: "Solar",
  emerald: "Emerald",
  ruby: "Sentinel",
  aspen: "Mesh",
  shadcn: "Tactical",
}

export type ThemeId = keyof typeof THEME_NAMES

export const THEMES = Object.keys(THEME_NAMES) as ThemeId[]

export const LAYOUTS = [
  { id: "docs", name: "Sentinel" },
  { id: "notebook", name: "Telemetry" },
  { id: "flux", name: "Perimeter" },
  { id: "glass", name: "Bastion" },
  { id: "spacious", name: "Cluster" },
  { id: "home", name: "SOC Grid" },
] as const

export type LayoutId = (typeof LAYOUTS)[number]["id"]

/** the layout the desk starts on, its cables settled on the server */
export const FIRST: LayoutId = "docs"

export const TABS = [
  "layouts",
  "story",
  "openapi",
  "graphql",
  "asyncapi",
] as const

export type TabId = (typeof TABS)[number]

type DemoId = Exclude<TabId, "layouts">

/** each demo's frame, by its accessible name */
export const DEMOS: Record<DemoId, string> = {
  story: "Kernel hardware netfilter packet drop simulation",
  openapi: "Pure PHP Laravel WAF request inspection & quarantine",
  graphql: "Real-time interactive threat radar & telemetry",
  asyncapi: "Inotify real-time File Integrity Monitoring watch",
}

/** a preset's colour on this page: the preset's `var(--x)` reads this page's `--color-fd-x` */
export function paint(value: string): string {
  return value.startsWith("var(--") ? `var(--color-fd-${value.slice(6)}` : value
}

/** the viewport of a story frame, like `<story.WithControl />` */
export const FRAME = { w: 1280, h: 800 }

// same arguments as `content/docs/ui/layouts/layouts.story.tsx`
const SHARED_ARGS = {
  nav: { title: "Pasax Sentinel" },
  themeSwitch: { enabled: true, mode: "light-dark" },
  searchToggle: { enabled: true },
}

export const STORY_ARGS: Record<LayoutId, object> = {
  docs: { ...SHARED_ARGS, tabMode: "auto", sidebar: { collapsible: true } },
  notebook: {
    ...SHARED_ARGS,
    nav: { ...SHARED_ARGS.nav, mode: "auto" },
    tabMode: "sidebar",
    sidebar: { collapsible: true },
  },
  flux: SHARED_ARGS,
  glass: { ...SHARED_ARGS, sidebar: { collapsible: true } },
  spacious: SHARED_ARGS,
  home: { ...SHARED_ARGS, nav: { ...SHARED_ARGS.nav, transparentMode: "top" } },
}

/**
 * Each layout story's 1-bit plan in its frame, measured from its DOM: rows of `x, y, w, h` for its
 * dotted panels, outlined boxes, outlines, solid fills, and its search trigger.
 */
interface Plan {
  dots: number[]
  boxes: number[]
  lines: number[]
  solid: number[]
  search: readonly [x: number, y: number, w: number, h: number]
}

export const PLANS: Record<LayoutId, Plan> = {
  docs: {
    dots: [0, 0, 268, 800, 1012, 0, 268, 800, 301, 628, 678, 47],
    boxes: [
      15, 21, 20, 20, 15, 58, 236, 36, 197, 65, 22, 22, 222, 65, 22, 22, 15,
      106, 236, 38, 15, 748, 236, 36, 300, 322, 334, 116, 317, 339, 30, 30, 646,
      322, 334, 116, 663, 339, 30, 30, 300, 590, 680, 86,
    ],
    lines: [
      0, 0, 268, 800, 268, 0, 744, 800, 1012, 0, 268, 800, 227, 22, 18, 18, 24,
      68, 16, 16, 24, 115, 20, 20, 226, 117, 16, 16, 23, 178, 16, 16, 23, 282,
      16, 16, 23, 320, 16, 16, 23, 358, 16, 16, 23, 396, 16, 16, 23, 434, 16,
      16, 23, 472, 16, 16, 23, 510, 16, 16, 23, 548, 16, 16, 23, 586, 16, 16,
      23, 624, 16, 16, 23, 662, 16, 16, 23, 700, 16, 16, 23, 738, 16, 16, 23,
      776, 16, 16, 23, 814, 16, 16, 23, 852, 16, 16, 23, 890, 16, 16, 23, 928,
      16, 16, 23, 966, 16, 16, 23, 1004, 16, 16,
    ],
    solid: [
      300, 48, 200, 28, 300, 92, 420, 16, 300, 120, 360, 16, 300, 164, 140, 20,
      300, 200, 680, 48, 300, 264, 520, 16,
    ],
    search: [15, 58, 236, 36],
  },
  notebook: {
    dots: [0, 0, 268, 800, 1012, 0, 268, 800],
    boxes: [15, 21, 20, 20, 15, 58, 236, 36, 300, 322, 680, 140],
    lines: [0, 0, 268, 800, 268, 0, 744, 800, 1012, 0, 268, 800],
    solid: [300, 48, 240, 28, 300, 92, 460, 16, 300, 120, 380, 16],
    search: [15, 58, 236, 36],
  },
  flux: {
    dots: [0, 0, 220, 800, 1060, 0, 220, 800],
    boxes: [15, 21, 20, 20, 260, 48, 760, 700],
    lines: [0, 0, 220, 800, 1060, 0, 220, 800],
    solid: [260, 72, 300, 24, 260, 110, 500, 14],
    search: [15, 58, 190, 36],
  },
  glass: {
    dots: [0, 0, 268, 800, 1012, 0, 268, 800],
    boxes: [15, 21, 20, 20, 300, 48, 680, 700],
    lines: [0, 0, 268, 800, 1012, 0, 268, 800],
    solid: [300, 72, 280, 24, 300, 110, 480, 14],
    search: [15, 58, 236, 36],
  },
  spacious: {
    dots: [0, 0, 268, 800, 1012, 0, 268, 800],
    boxes: [15, 21, 20, 20, 15, 58, 236, 36, 300, 48, 680, 700],
    lines: [0, 0, 268, 800, 1012, 0, 268, 800],
    solid: [300, 72, 280, 24, 300, 110, 480, 14],
    search: [15, 58, 236, 36],
  },
  home: {
    dots: [0, 0, 1280, 800],
    boxes: [15, 21, 20, 20, 200, 120, 880, 500],
    lines: [0, 0, 1280, 60],
    solid: [200, 160, 400, 36, 200, 210, 600, 18],
    search: [200, 260, 300, 40],
  },
}
