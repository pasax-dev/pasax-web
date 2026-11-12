---
name: app-typography
description: Master typography guidelines, scale systems, readability ergonomics, tabular numerals, and Tailwind/CSS implementation standards for high-performance web applications and dashboards.
metadata:
  category: design
---

# Application Typography System & Ergonomics Skill

This skill provides strict, production-ready typography principles, modular scales, readability guidelines, and component recipes for web applications, SaaS platforms, and data-dense dashboards.

---

## 1. Core Principles of App Typography

Applications have different typographic requirements than long-form editorial blogs:
1. **Scannability over Linear Reading:** Users scan interfaces to identify metrics, status, actions, and key identifiers.
2. **Tabular Alignment:** Numbers, timestamps, and counters must not shift or wobble during updates.
3. **Information Density & Hierarchy:** Distinct contrast between section labels, data values, unit labels, and helper captions.
4. **Zero Layout Shift:** Font loading and metric fallback must avoid Flash of Unstyled Text (FOUT) or layout reflows.

---

## 2. Type Hierarchy & Modular Scale

Use a consistent 3-font family system:
- **Heading / Display Font (`font-heading`):** Bold, high personality, tracking-tight. (e.g., Space Grotesk, Plus Jakarta Sans, Inter Display, Satoshi, Syne).
- **Interface / Body Font (`font-sans` / `font-base`):** Highly legible at 12–16px, open counters, tall x-height. (e.g., Inter, Geist, Figtree).
- **Monospace / Telemetry Font (`font-mono`):** Clean tabular figures, distinct `0`/`O` and `1`/`l`. (e.g., JetBrains Mono, Fira Code, Geist Mono).

### Recommended App Type Scale (Tailwind)

| Role | Class | Size | Leading | Tracking | Weight | Usage |
|---|---|---|---|---|---|---|
| **Display / Hero** | `text-4xl sm:text-6xl lg:text-7xl` | 36px–72px | `leading-[1.05]` | `tracking-tight` (`-0.03em`) | `font-black` (900) | Landing Hero Headlines |
| **H1 (Page Title)** | `text-2xl sm:text-3xl lg:text-4xl` | 24px–36px | `leading-tight` | `tracking-tight` (`-0.02em`) | `font-black` / `font-bold` | App Views & Page Headers |
| **H2 (Section Header)** | `text-xl sm:text-2xl` | 20px–24px | `leading-snug` | `tracking-tight` (`-0.015em`) | `font-bold` (700) | Major Cards & Section Titles |
| **H3 (Widget / Group)** | `text-base sm:text-lg` | 16px–18px | `leading-normal` | `tracking-normal` | `font-bold` (700) | Card Headers & Modal Titles |
| **Metric / Stat Hero** | `text-3xl sm:text-4xl font-mono` | 30px–36px | `leading-none` | `tracking-tight tabular-nums` | `font-black` (900) | KPI Numbers & Counter Stats |
| **Body (Default)** | `text-sm sm:text-base` | 14px–16px | `leading-relaxed` (1.6) | `tracking-normal` | `font-normal` (400) | Descriptions, Articles, Explanations |
| **Body (Compact)** | `text-xs sm:text-sm` | 12px–14px | `leading-normal` (1.5) | `tracking-normal` | `font-normal` (400) | Table Rows, List Details, Inputs |
| **Overline / Category** | `text-[10px] sm:text-xs` | 10px–12px | `leading-none` | `tracking-widest uppercase` | `font-mono font-bold` | Section Badges, Pill Headers |
| **Caption / Meta** | `text-[11px] sm:text-xs` | 11px–12px | `leading-normal` | `tracking-normal` | `font-medium` (500) | Timestamp, Helper hints, Sub-labels |
| **Code / Inline Monospace** | `font-mono text-xs sm:text-sm` | 12px–14px | `leading-normal` | `tracking-tight` | `font-semibold` (600) | Paths, Shell commands, IPs, Hashes |

---

## 3. Micro-Typography & Readability Ergonomics

### Measure (Line Length)
- **Optimal Reading Length:** 45 to 75 characters per line (`max-w-prose` or `max-w-2xl` / `max-w-3xl`).
- **Never allow body text to stretch unbounded** across 100% of a 1920px+ display. Constrain descriptive paragraphs (`max-w-2xl` or `max-w-3xl`) while allowing data cards or grids to span `max-w-full`.

### Leading (Line Height)
- Headings require **tighter leading** (`leading-tight`, `leading-[1.1]`). Loose line height on big text causes visual disconnection.
- Paragraphs require **generous leading** (`leading-relaxed`, 1.6 to 1.7) to allow eyes to scan without skipping lines.
- Dense data tables require **compact leading** (`leading-none` or `leading-snug`) to maximize vertical efficiency.

### Tracking (Letter Spacing)
- **Large Headlines (>24px):** Apply negative tracking (`tracking-tight` or `-0.02em` to `-0.04em`). Large letters have excessive optical whitespace.
- **Small Caps & Uppercase Badges (<12px):** Apply positive tracking (`tracking-wider` or `tracking-widest`, `+0.05em` to `+0.12em`). Without tracking, uppercase small letters clump together.
- **Body Text (14px–16px):** Normal tracking (`tracking-normal`). Never apply negative tracking to small body text.

### Modern CSS Text Primitives
- **Headlines:** Always apply `text-wrap: balance` (`text-balance` in Tailwind) to prevent single-word orphan lines.
- **Body Text:** Apply `text-wrap: pretty` (`text-pretty` in Tailwind) to eliminate awkward paragraph ragged edges.
- **Font Smoothing:** Always apply `antialiased` to the `<body>` element for crisp subpixel text rendering on macOS and Linux.

---

## 4. Rules for Data-Dense Dashboards & Telemetry

### 1. Tabular Figures (`tabular-nums`)
Whenever numbers change dynamically, render in columns, or display currency/metrics:
```tsx
// Correct: Numbers do not jump or wobble horizontally
<span className="font-mono text-2xl font-black tabular-nums">
  {value.toLocaleString()}
</span>
```
If using custom fonts, enforce `font-variant-numeric: tabular-nums` in CSS.

### 2. IP Addresses, Git Hashes, and Cryptographic Keys
- Always use `font-mono font-semibold text-xs` or `text-[11px]`.
- For space-constrained tables, use middle truncation:
  `185.220...101.5` or `0x7f4a...9b12`.
- Pair with a one-click copy button with tooltip and visual feedback (`Copied!`).

### 3. Status Badges & Pills
Combine uppercase tracking with monospace:
```tsx
<span className="inline-flex items-center gap-1.5 rounded border border-border bg-secondary-background px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-foreground">
  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
  <span>ONLINE &bull; 0.15ms</span>
</span>
```

### 4. High-Contrast Dark Mode & Halation Prevention
- Never use pure `#000000` background with pure `#ffffff` text in long-form paragraphs; it causes ocular strain (halation).
- Use softened contrast:
  - Background: `hsl(222, 47%, 7%)` or `#090d16`.
  - Foreground text: `hsl(210, 40%, 98%)` or `rgba(255, 255, 255, 0.92)`.
  - Secondary/Muted: `hsl(215, 20%, 65%)` or `rgba(255, 255, 255, 0.65)`.

---

## 5. Tailwind CSS Application Recipes

### 1. Section Header (Centered)
```tsx
<div className="mx-auto mb-12 max-w-4xl text-center">
  <div className="mb-3 inline-flex items-center gap-1.5 rounded-base border border-border bg-secondary-background px-2.5 py-0.5 font-mono text-xs font-bold text-foreground">
    <Zap className="size-3.5 text-main" />
    <span className="tracking-wider uppercase">CORE CAPABILITIES</span>
  </div>
  <h2 className="font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
    Engineered for High-Throughput Fleets
  </h2>
  <p className="mt-3 text-base sm:text-lg font-base text-foreground/80 text-pretty max-w-2xl mx-auto">
    Detailed subtitle explaining the value proposition clearly without line orphans.
  </p>
</div>
```

### 2. KPI / Stat Widget
```tsx
<div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-[3px_3px_0px_0px_var(--border)]">
  <div className="flex items-center justify-between">
    <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
      Kernel Drop Latency
    </span>
    <Badge variant="outline" className="font-mono text-[10px] font-bold">
      L2 ENGINE
    </Badge>
  </div>
  <div className="mt-2 font-mono text-3xl sm:text-4xl font-black tabular-nums tracking-tight text-foreground">
    &lt; 0.18 <span className="text-base font-bold text-muted-foreground">ms</span>
  </div>
  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1">
    <span>&uarr; 99.98% faster than user-space</span>
  </p>
</div>
```

### 3. Data Table Cell Typography
```tsx
<td className="p-4 sm:p-5 font-mono text-xs text-foreground">
  <div className="font-bold tabular-nums">192.168.1.104:443</div>
  <div className="text-[11px] text-muted-foreground">POST /api/v1/auth</div>
</td>
```

---

## 6. Typography Anti-Patterns (What to Avoid)

| Anti-Pattern | Why It Breaks UI | Correct Solution |
|---|---|---|
| `uppercase` on full paragraphs | Destroys word shape recognition; slows reading speed by 40%. | Use sentence case for body; reserve uppercase for tags & badges (<4 words). |
| Centering body text > 3 lines | Irregular start-point for each line forces eyes to search for the next line. | Left-align body copy; center only titles and short 1–2 line leads. |
| Omitting `tabular-nums` on live counters | Causes numbers and neighboring buttons to visibly shake and trigger layout shifts. | Add `tabular-nums` or `font-mono` to every changing number. |
| Negative tracking on body copy | Characters collide at 12–14px; severely impairs readability. | Use `tracking-tight` only on headings >= 24px; use `tracking-normal` for body. |
| Tiny font (<11px) for interactive buttons | Fails accessibility guidelines; impossible to tap on touch devices. | Minimum interactive touch target 13px–14px with `min-h-[36px]`. |
| Unbounded width on wide screens | 1920px paragraphs span 250+ characters per line, making eye tracking exhausting. | Constrain paragraphs to `max-w-2xl` or `max-w-3xl`. |

---

## 7. Review Checklist for Any Page or Component

Before completing any UI task, verify:
- [ ] Is line wrapping balanced on titles (`text-balance`)?
- [ ] Are orphan words eliminated on paragraphs (`text-pretty`)?
- [ ] Are all counters, timestamps, latencies, and prices using `tabular-nums`?
- [ ] Are uppercase badges given positive tracking (`tracking-wider` / `tracking-widest`)?
- [ ] Are headings above 24px using negative tracking (`tracking-tight`)?
- [ ] Is body copy constrained within comfortable line lengths (`max-w-2xl` / `max-w-3xl`)?
- [ ] Is there clear visual hierarchy between Title, Subtitle, Stat Number, and Helper Caption?
