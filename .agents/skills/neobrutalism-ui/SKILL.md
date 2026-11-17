---
name: fumadocs-ui
description: Best practices and rules for crafting modern, refined developer documentation and infrastructure UI components adhering to the Fumadocs framework standard (fumadocs.dev) and Illos.dev animations.
---

# `fumadocs-ui` Skill (formerly neobrutalism-ui)

Use this skill when building, styling, or refactoring user interfaces in `pasax-web`.

## 1. Fumadocs Aesthetic & Rules

- **Borders**: Always use delicate 1px subtle borders (`border border-border/50` or `border-border/60`). Never use heavy 2px/3px borders or cartoonish offset shadows.
- **Border Radius**: Use `rounded-xl`, `rounded-2xl`, or `rounded-full` for pill badges, buttons, and command chips.
- **Glassmorphism**: Combine `backdrop-blur-md` with `bg-card/40` or `bg-card/60` for cards and modals.
- **Headings**: Apply vertical gradient clipping:
  ```tsx
  <h2 className="bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text font-heading text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
    Title Text
  </h2>
  ```
- **Pill Badges**:
  ```tsx
  <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
    <span className="size-2 animate-pulse rounded-full bg-primary" />
    <span>PASAX FRAMEWORK</span>
  </div>
  ```
- **Illos Animations**:
  Import animated SVG illustrations from `@/components/illos`:
  ```tsx
  import {
    IllosThreatDetection,
    IllosFirewall,
    IllosServerHealth,
    IllosLogStream,
    IllosMonitoring,
    IllosEncryption,
    IllosAlerts,
  } from "@/components/illos"
  ```
- **Buttons**:
  - Primary: `rounded-full bg-foreground px-6 py-2.5 font-sans text-sm font-medium text-background transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98]`
  - Secondary: `rounded-full border border-border/60 bg-background/50 px-6 py-2.5 font-sans text-sm font-medium text-foreground backdrop-blur-md transition-all hover:bg-muted/80 hover:scale-[1.02]`
  - Code Snippet Copy Pill: `rounded-full border border-border/60 bg-muted/30 px-4 py-2 font-mono text-xs text-foreground backdrop-blur-md flex items-center gap-2.5`
