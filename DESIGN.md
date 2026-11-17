---

version: "2.0.0"
name: "pasax-fumadocs-framework"
description: "A hyper-refined, modern developer platform design system inspired directly by Fumadocs (https://www.fumadocs.dev/) and powered by Illos.dev free animated SVG illustrations (https://illos.dev/library/free). Emphasizes clean dark-mode-first glassmorphic gradients, hairline 1px borders with subtle alpha channels, ambient radial glow lighting, interactive bento showcase cards with code-to-preview tabs, and smooth micro-interactions."
reference:
fumadocs: "https://www.fumadocs.dev/"
illos-library: "https://illos.dev/library/free"
format_standard: "https://github.com/VoltAgent/awesome-design-md"

colors:
canvas:
dark: "#030712"
dark-surface-1: "#080e1e"
dark-surface-2: "#0f172a"
dark-surface-card: "rgba(15, 23, 42, 0.65)"
light: "#f8fafc"
light-surface-1: "#ffffff"
light-surface-2: "#f1f5f9"
light-surface-card: "rgba(255, 255, 255, 0.85)"
brand:
primary: "#38bdf8"
primary-hover: "#0284c7"
primary-foreground: "#000000"
accent-cyan: "#00d8ff"
accent-purple: "#a855f7"
accent-emerald: "#10b981"
accent-amber: "#f59e0b"
accent-rose: "#f43f5e"
borders:
subtle: "rgba(255, 255, 255, 0.08)"
default: "var(--border)"
hover-glow: "rgba(56, 189, 248, 0.4)"
focus-ring: "#38bdf8"
glows:
radial-top: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56, 189, 248, 0.15), transparent 70%)"
radial-accent: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(168, 85, 247, 0.12), transparent 75%)"

typography:
headings:
fontFamily: "var(--font-heading), 'Inter', 'Space Grotesk', -apple-system, sans-serif"
weights: [600, 700, 800]
letterSpacing: "-0.03em"
style: "Refined modern gradient headline (bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent)"
monospaced:
fontFamily: "var(--font-mono), 'Geist Mono', 'JetBrains Mono', 'Liberation Mono', monospace"
weights: [400, 500, 600]
letterSpacing: "-0.01em"
style: "Clean developer console, terminal snippets, tabular latency metrics, and API paths"
body:
fontFamily: "var(--font-sans), 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
weights: [400, 500]
lineHeight: "1.65"
style: "Balanced reading ergonomics with text-pretty and text-balance"

spacing-and-geometry:
border-width: "1px"
border-radius:
pill: "9999px"
sm: "8px"
base: "12px"
lg: "16px"
xl: "20px"
2xl: "24px"
backdrop-blur: "backdrop-blur-md"
shadows:
diffuse-sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
diffuse-md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
diffuse-lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
glow-cyan: "0 0 25px -5px rgba(56, 189, 248, 0.25)"
glow-purple: "0 0 25px -5px rgba(168, 85, 247, 0.25)"

components:
announcement-badge:
layout: "inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md transition-colors hover:border-foreground/20 hover:text-foreground"
indicator: "size-2 rounded-full bg-primary animate-pulse"
buttons:
primary:
layout: "rounded-full bg-foreground px-6 py-2.5 font-sans text-sm font-medium text-background transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
secondary:
layout: "rounded-full border border-border/60 bg-background/50 px-6 py-2.5 font-sans text-sm font-medium text-foreground backdrop-blur-md transition-all hover:bg-muted/80 hover:border-border hover:scale-[1.02] active:scale-[0.98]"
code-pill:
layout: "rounded-full border border-border/60 bg-muted/30 px-4 py-2 font-mono text-xs text-foreground backdrop-blur-md transition-all hover:border-foreground/20 flex items-center gap-2.5"
cards:
bento-feature:
layout: "relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-border hover:bg-card/70 group"
ambient-hover: "absolute -inset-px rounded-2xl bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
hero-showcase:
layout: "w-full max-w-5xl rounded-2xl border border-border/60 bg-card/60 shadow-2xl backdrop-blur-xl overflow-hidden"
tab-bar: "flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/20"
search-modal:
trigger: "inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur hover:border-border transition-colors"
dialog: "fumadocs-core search dialog with category filters and keyboard navigation (⌘K)"

illos-animations-guide:
directory: "components/illos/"
components: - name: "IllosThreatDetection"
file: "components/illos/threat-detection.tsx"
theme: "HUD threat radar & telemetry scanner" - name: "IllosFirewall"
file: "components/illos/firewall.tsx"
theme: "Isometric packet firewall & netfilter inspection" - name: "IllosServerHealth"
file: "components/illos/server-health.tsx"
theme: "Autonomous kernel health & memory telemetry" - name: "IllosLogStream"
file: "components/illos/log-stream.tsx"
theme: "Real-time log watcher with colorized stream lines" - name: "IllosMonitoring"
file: "components/illos/monitoring.tsx"
theme: "Multi-cluster node fleet monitoring" - name: "IllosEncryption"
file: "components/illos/encryption.tsx"
theme: "TLS 1.3 mTLS cryptographic channel" - name: "IllosAlerts"
file: "components/illos/alerts.tsx"
theme: "Zero-tolerance security anomaly badge & alert pulse"

guidelines-for-ai-agents:
rule-1: "ALWAYS use delicate 1px borders (border border-border/50 or border-border/60). NEVER use thick 2px/3px borders or cartoonish offset shadows."
rule-2: "Use 'rounded-xl', 'rounded-2xl', or 'rounded-full' for pill buttons, inputs, and container cards."
rule-3: "Use vertical gradient text clipping on major section headings: 'bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'."
rule-4: "Emphasize glassmorphism with 'backdrop-blur-md bg-card/40' or 'bg-background/80' to maintain Fumadocs aesthetic."
rule-5: "Place Illos.dev animated SVGs from 'components/illos/' inside hero showcase tabs, feature bento cards, and interactive walkthroughs."
rule-6: "All interactive elements must feature subtle micro-interactions: smooth scale ([1.02]), border glow, and refined transition-all."
rule-7: "Ensure full accessibility and high contrast in both dark and light modes."
