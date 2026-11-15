---
version: "1.0.0"
name: "pasax-suite-cyber-neobrutalism"
description: "A high-precision Cyber Tactical Neobrutalism design system fusing neobrutalism.dev geometric boldness with ThreatsEye live threat intelligence aesthetics. Characterized by thick solid borders (2px), zero-blur hard drop shadows (4px 4px 0px 0px), electric chromatic accents (#0099ff, #facc00, #05e17a, #ff4d50), and dark tactical canvas surfaces (#050811 / #0a0f1d). Pairs Bricolage Grotesque for punchy headlines with Liberation Mono for real-time kernel telemetry, radar compass ticks, and IP readouts."
reference:
  neobrutalism: "https://www.neobrutalism.dev/"
  threatseye: "https://threatseye.io/ and https://threatseye.io/threats-map"
  format_standard: "https://github.com/VoltAgent/awesome-design-md"

colors:
  canvas:
    dark: "#050811"
    dark-surface-1: "#0a0f1d"
    dark-surface-2: "#0f172a"
    dark-surface-card: "#131b2e"
    light: "#f0f7ff"
    light-surface-1: "#ffffff"
    light-surface-2: "#e0f2fe"
  brand:
    primary: "#0099ff"
    primary-hover: "#0080ff"
    primary-foreground: "#000000"
    accent-amber: "#facc00"
    accent-green: "#05e17a"
    accent-rose: "#ff4d50"
    accent-sky: "#38bdf8"
    accent-purple: "#a78bfa"
  borders:
    strong: "oklch(0% 0 0)"
    dark-strong: "oklch(0.88 0 0)"
    tactical-grid: "rgba(56, 189, 248, 0.12)"
    tactical-grid-subtle: "rgba(56, 189, 248, 0.06)"
  threat-levels:
    critical: "#ff4d50"
    high: "#facc00"
    medium: "#0099ff"
    low: "#05e17a"
  shadows:
    hard-sm: "2px 2px 0px 0px var(--border)"
    hard-md: "4px 4px 0px 0px var(--border)"
    hard-lg: "6px 6px 0px 0px var(--border)"
    hard-reverse: "-4px -4px 0px 0px var(--border)"

typography:
  headings:
    fontFamily: "Bricolage Grotesque, sans-serif"
    weights: [700, 800, 900]
    letterSpacing: "-0.03em"
    style: "Expressive, mechanical, high-impact neo-grotesque"
  monospaced:
    fontFamily: "'Liberation Mono', var(--font-geist-mono), 'SFMono-Regular', Menlo, Monaco, Consolas, monospace"
    weights: [500, 600, 700]
    letterSpacing: "0.02em"
    style: "Precision Linux kernel console & radar coordinate readout"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    weights: [400, 500, 600]
    lineHeight: "1.6"

spacing-and-geometry:
  border-width: "2px"
  border-radius:
    base: "5px"
    sm: "3px"
    lg: "8px"
    full: "9999px"
  box-shadow: "4px 4px 0px 0px var(--border)"
  shadow-transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)"
  button-active-translate: "translate(2px, 2px)"

motion-and-physics:
  radar-sweep:
    duration: "4.0s"
    timingFunction: "linear"
    loop: "infinite"
    angleRange: "0deg to 360deg"
    beamWedgeArc: "76.5deg (Math.PI / 2.35)"
    leadingEdgeGlow: "shadowBlur 16px, white neon core"
  globe-rotation:
    idleSpeed: "0.00065 rad/frame (~2.2 deg/sec)"
    hoverSpeed: "0.00008 rad/frame (ultra-slow inspection crawl)"
    inertiaDamping: "0.965 (luxury glide on drag release)"
    interpolation: "smooth exponential lerp"
  laser-scan:
    duration: "6.0s to 7.0s"
    timingFunction: "ease-in-out"
    loop: "infinite"
  hud-bracket-breathe:
    duration: "3.0s"
    timingFunction: "ease-in-out"
    loop: "infinite"
    scaleRange: "1.0 to 1.03"
  rocket-ballistics:
    curvatureBulge: "Math.max(26, Math.min(68, distance * 0.46))"
    burstProjectiles: 3
    burstStaggerOffset: "[-0.08, -0.16]"
    impactWaves: 3
    impactRingMaxAge: "40 to 64 frames"

components:
  buttons:
    primary:
      border: "2px solid var(--border)"
      background: "var(--main)"
      color: "var(--main-foreground)"
      shadow: "4px 4px 0px 0px var(--border)"
      hover: "translate(2px, 2px) shadow-[2px_2px_0px_0px_var(--border)]"
      active: "translate(4px, 4px) shadow-none"
    outline:
      border: "2px solid var(--border)"
      background: "var(--secondary-background)"
      color: "var(--foreground)"
      shadow: "4px 4px 0px 0px var(--border)"
  cards:
    tactical:
      border: "2px solid var(--border)"
      background: "var(--card)"
      shadow: "4px 4px 0px 0px var(--border)"
      cornerAccents: "top-2 left-2 size-4 border-t-2 border-l-2 border-main/80"
  badges:
    neobrutal:
      border: "2px solid var(--border)"
      background: "var(--secondary-background)"
      shadow: "2px 2px 0px 0px var(--border)"
      font: "Liberation Mono, text-xs, font-bold"
  stickers:
    floating:
      border: "2px solid var(--border)"
      shadow: "3px 3px 0px 0px var(--border)"
      rotation: "varying from -6deg to +8deg"
      animation: "gentle floating bounce (4.5s to 6.0s)"

sections-background-matrix:
  hero:
    component: "HeroCyberBackground"
    layers:
      - "Neobrutalism Dot Grid Matrix (radial-gradient 24px x 24px)"
      - "Concentric Heavy Dashed Orbit Rings (760px / 630px / 490px)"
      - "Cardinal Square Markers with hard 2px shadows"
      - "Sweeping Laser Scanning Beam"
      - "Interactive Node Constellation Canvas (60fps with mouse repulsion)"
      - "Floating Neobrutalist Badges & Stickers (eBPF, 0.12ms Latency, Zero Open Ports)"
      - "Rotating Neobrutalist Asterisk (✱) and Star (✦) accents"
  telemetry:
    variant: "grid"
    details: "Technical 3.5rem blueprint grid with a vertical laser scan beam highlighting the live radar"
  architecture:
    variant: "circuit"
    details: "Packet bus circuitry lines with floating neobrutalism stamps (✦, ✱) emphasizing the triple defense layers"
  features:
    variant: "dots"
    details: "Crisp 24px dot matrix paper texture with corner brackets framing the feature cards"
  comparison:
    variant: "grid"
    details: "High-contrast technical inspection grid framing the comparative benchmarks table"
  pricing:
    variant: "stripes"
    details: "45-degree geometric diagonal hatch stripes with floating security badges"
  faq:
    variant: "dots"
    details: "Technical schematic blueprint matrix with animated corner brackets"
  cta-banner:
    variant: "high-energy"
    details: "Solid primary yellow/blue background with hard box shadows and rotating corner star stamps"

guidelines-for-ai-agents:
  rule-1: "ALWAYS use 2px solid borders (border-2 border-border) on interactive containers and cards."
  rule-2: "NEVER use blurred fuzzy drop shadows. ALWAYS use hard-edge shadows (e.g. shadow-[4px_4px_0px_0px_var(--border)])."
  rule-3: "Use 'font-heading' (Bricolage Grotesque) for titles, section headers, card titles, and high-energy CTAs."
  rule-4: "Use 'font-mono' (Liberation Mono) for all telemetry readings, timestamps, IP addresses, port numbers, lat/lng, and code snippets."
  rule-5: "All sections MUST maintain a subtle tactical background texture or ambient animation from SectionBackground to prevent flat or barren layouts."
  rule-6: "Interactive hover states MUST physically press down by translating (translate-x-0.5 translate-y-0.5) while reducing shadow distance."
  rule-7: "On 3D Three.js components, ensure rotation remains slow and cinematic (<= 0.00065 rad/frame) and raycasts accurately against spherical geometry."
