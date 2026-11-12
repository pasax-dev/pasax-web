# Chapter 02: Neobrutalism Design System

## 1. Design Philosophy
The user interface follows the **Neobrutalism** design movement ([neobrutalism.dev](https://www.neobrutalism.dev/docs/installation)). Neobrutalism breaks away from generic minimalist SaaS templates by embracing:
1. **High Contrast Borders**: Prominent `border-2 border-border` (pure black `oklch(0% 0 0)` in light mode).
2. **Hard Box Shadows**: Zero-blur displacement shadows (`4px 4px 0px 0px var(--border)`).
3. **Bold Typography**: Heavy font weights (`font-heading font-black`) paired with clean monospaced data indicators.
4. **Vibrant Color Accents**: Vivid cyan/blue (`--main: hsl(204, 100%, 50%)`), energetic warning yellows, and sharp alert reds.

## 2. Core Design Tokens (`app/globals.css`)
```css
:root {
  --border: oklch(0% 0 0);
  --shadow: 4px 4px 0px 0px var(--border);
  --spacing-boxShadowX: 4px;
  --spacing-boxShadowY: 4px;
  --spacing-reverseBoxShadowX: -4px;
  --spacing-reverseBoxShadowY: -4px;
  --radius-base: 5px;
  --main: hsl(204, 100%, 50%);
  --main-foreground: oklch(0% 0 0);
  --background: hsl(207, 89%, 93%);
  --secondary-background: oklch(100% 0 0);
}
```

## 3. Interactive Component Standards
- **Buttons**:
  On hover, buttons shift by `translate-x-boxShadowX translate-y-boxShadowY` while collapsing shadow to `none`, simulating a tactile physical button click.
- **Cards**:
  Always use `rounded-base border-2 border-border bg-secondary-background shadow-shadow`.
- **Badges**:
  Never use soft pill badges. Badges must feature solid 2px borders, uppercase bold fonts, and contextual alert colors (`success`, `warning`, `destructive`, `secondary`, `neutral`).
