---
name: app-typography
description: Master typography guidelines, scale systems, readability ergonomics, tabular numerals, gradient headlines, and Tailwind/CSS implementation standards for modern developer frameworks and dashboards adhering to the Fumadocs standard.
metadata:
  category: design
---

# Application Typography System & Ergonomics Skill

This skill provides strict, production-ready typography principles, modular scales, readability guidelines, and component recipes for web applications, developer documentation portals (Fumadocs standard), and data-dense dashboards.

---

## 1. Core Principles of App & Framework Typography

1. **Scannability over Linear Reading:** Developers scan interfaces to identify commands, metrics, status, actions, and key identifiers.
2. **Gradient Visual Hierarchy:** Major headlines feature vertical light-falloff gradient masks (`bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent`) delivering a refined modern framework feel.
3. **Tabular Alignment:** Numbers, timestamps, and counters must use `tabular-nums` so values do not shift or wobble during live telemetry updates.
4. **Information Density & Hierarchy:** Distinct contrast between section labels (pill badges), data values, unit labels, and helper captions.
5. **Zero Layout Shift:** Font loading and metric fallback must avoid Flash of Unstyled Text (FOUT) or layout reflows.

---

## 2. Type Hierarchy & Modular Scale

Use a consistent 3-font family system:

- **Heading / Display Font (`font-heading`):** Bold or Semi-bold, tracking-tight, with gradient text fill.
- **Interface / Body Font (`font-sans` / `font-base`):** Highly legible at 12–16px, open counters, tall x-height (Inter / Geist).
- **Monospace / Telemetry Font (`font-mono`):** Clean tabular figures, distinct `0`/`O` and `1`/`l` (Geist Mono, JetBrains Mono, Space Mono).

### Recommended Type Scale (Tailwind)

| Role                        | Class                              | Size      | Leading                  | Tracking                      | Weight                | Usage                                       |
| --------------------------- | ---------------------------------- | --------- | ------------------------ | ----------------------------- | --------------------- | ------------------------------------------- |
| **Display / Hero**          | `text-4xl sm:text-6xl lg:text-7xl` | 36px–72px | `leading-[1.08]`         | `tracking-tight` (`-0.03em`)  | `font-bold` (700/800) | Landing Hero Headlines (with gradient mask) |
| **H1 (Page Title)**         | `text-2xl sm:text-3xl lg:text-4xl` | 24px–36px | `leading-tight`          | `tracking-tight` (`-0.02em`)  | `font-bold`           | App Views & Page Headers                    |
| **H2 (Section Header)**     | `text-xl sm:text-3xl lg:text-4xl`  | 20px–36px | `leading-snug`           | `tracking-tight` (`-0.015em`) | `font-bold` (700)     | Major Cards & Section Titles                |
| **H3 (Widget / Group)**     | `text-base sm:text-lg`             | 16px–18px | `leading-normal`         | `tracking-normal`             | `font-semibold` (600) | Card Headers & Modal Titles                 |
| **Metric / Stat Hero**      | `text-2xl sm:text-4xl font-mono`   | 24px–36px | `leading-none`           | `tracking-tight tabular-nums` | `font-bold`           | KPI Numbers & Counter Stats                 |
| **Body (Default)**          | `text-sm sm:text-base`             | 14px–16px | `leading-relaxed` (1.65) | `tracking-normal`             | `font-normal` (400)   | Descriptions, Articles, Explanations        |
| **Body (Compact)**          | `text-xs sm:text-sm`               | 12px–14px | `leading-normal` (1.5)   | `tracking-normal`             | `font-normal` (400)   | Table Rows, List Details, Inputs            |
| **Pill Badge / Overline**   | `text-xs font-medium`              | 11px–12px | `leading-none`           | `tracking-normal`             | `font-medium`         | Section Badges, Pill Headers                |
| **Code / Inline Monospace** | `font-mono text-xs sm:text-sm`     | 12px–14px | `leading-normal`         | `tracking-tight`              | `font-medium`         | Paths, Shell commands, IPs, Hashes          |

---

## 3. Fumadocs Typography Component Recipes

### 1. Section Header (Centered with Pill Badge & Gradient)

```tsx
<div className="mx-auto mb-12 max-w-4xl text-center">
  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md">
    <Zap className="size-3.5 text-primary" />
    <span>CORE CAPABILITIES</span>
  </div>
  <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-balance text-transparent sm:text-5xl">
    Engineered for High-Throughput Fleets
  </h2>
  <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
    Detailed subtitle explaining the value proposition clearly without line
    orphans.
  </p>
</div>
```

### 2. Copyable Command Chip

```tsx
<div className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/30 px-4 py-2 font-mono text-xs text-foreground backdrop-blur-md transition-all hover:border-foreground/20">
  <span className="text-muted-foreground select-none">$</span>
  <span>curl -sSL https://get.pasax.id | bash</span>
  <CopyButton text="curl -sSL https://get.pasax.id | bash" />
</div>
```
