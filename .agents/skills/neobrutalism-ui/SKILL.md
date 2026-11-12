---
name: neobrutalism-ui
description: Best practices and rules for crafting UI components and layouts adhering strictly to the Neobrutalism design system from neobrutalism.dev.
---

# `neobrutalism-ui` Skill

Use this skill when building, styling, or refactoring user interfaces in `pasak-dashboard`.

## 1. Neobrutalism Styling Rules
- **Borders**: Always apply `border-2 border-border`.
- **Drop Shadows**: Always apply `shadow-shadow` (`4px 4px 0px 0px var(--border)`).
- **Radius**: Use `rounded-base` (5px default). Do not use soft pill or large roundings like `rounded-full` or `rounded-2xl` on cards or dialogs.
- **Card Styling**:
  ```tsx
  <Card className="rounded-base border-2 border-border bg-secondary-background shadow-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5">
  ```
- **Button Hover**:
  ```tsx
  className="border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
  ```
- **Badges**:
  Solid borders, uppercase font, bold contrast:
  - `variant="success"`: Green `bg-green-400 text-black border-2 border-border font-bold`
  - `variant="warning"`: Yellow `bg-yellow-300 text-black border-2 border-border font-bold`
  - `variant="destructive"`: Red `bg-red-400 text-black border-2 border-border font-bold`

## 2. Installing New Components from Registry
To install additional components directly from the Neobrutalism registry:
```bash
pnpm dlx shadcn@latest add https://neobrutalism.dev/r/<component>.json --overwrite -y
```
