import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/** each layer or security mechanism's 8x8 pixel icon, as an SVG path */
export const LAYER_ICONS = {
  content: 'M0 1h8v1H0zM0 3h8v1H0zM0 5h8v1H0zM0 7h5v1H0z',
  core: 'M2 0h4v1H2zM1 1h1v1H1zM6 1h1v1H6zM0 2h1v4H0zM7 2h1v4H7zM1 6h1v1H1zM6 6h1v1H6zM2 7h4v1H2zM3 3h2v2H3z',
  ui: 'M0 0h8v3H0zM0 3h1v5H0zM7 3h1v5H7zM1 7h6v1H1z',
  framework: 'M0 4h8v2H0zM1 6h1v2H1zM6 6h1v2H6zM2 1h4v3H2z',
  shield: 'M1 0h6v1H1zM0 1h8v3H0zM1 4h6v1H1zM2 5h4v1H2zM3 6h2v1H3zM3 7h2v1H3z',
  radar: 'M3 0h2v1H3zM1 1h2v1H1zM5 1h2v1H5zM0 3h1v2H0zM7 3h1v2H7zM3 3h2v2H3zM1 6h2v1H1zM5 6h2v1H5zM3 7h2v1H3z',
  lock: 'M2 0h4v2H2zM1 2h6v6H1zM3 4h2v2H3z',
} as const;

export type Layer = 'content' | 'core' | 'ui' | 'framework';
export type ChipIcon = keyof typeof LAYER_ICONS;

/** label on the hero's revolving satellites; the parts figure prints the same icons */
export function Chip({
  layer = 'shield',
  children,
  className,
  ...props
}: ComponentProps<'span'> & { layer?: ChipIcon }) {
  const icon = LAYER_ICONS[layer] ?? LAYER_ICONS.shield;
  return (
    <span
      {...props}
      className={cn(
        'inline-flex h-6 items-center gap-1.5 border border-lp-line-strong bg-lp-paper px-2 font-pixel text-pixel whitespace-nowrap antialiased shadow-sm',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 8 8"
        shapeRendering="crispEdges"
        className="size-2.5 shrink-0 fill-current text-lp-orange dark:text-lp-yellow"
      >
        <path d={icon} />
      </svg>
      {children}
    </span>
  );
}
