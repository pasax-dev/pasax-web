import * as React from "react"
import { cn } from "@/lib/utils"

export const LAYER_ICONS = {
  ebpf: "M2 0h4v1H2zM1 1h1v1H1zM6 1h1v1H6zM0 2h1v4H0zM7 2h1v4H7zM1 6h1v1H1zM6 6h1v1H6zM2 7h4v1H2zM3 3h2v2H3z",
  network: "M0 1h8v1H0zM0 3h8v1H0zM0 5h8v1H0zM0 7h5v1H0z",
  shield: "M0 0h8v3H0zM0 3h1v5H0zM7 3h1v5H7zM1 7h6v1H1z",
  cloud: "M0 4h8v2H0zM1 6h1v2H1zM6 6h1v2H6zM2 1h4v3H2z",
} as const

export type LayerIconType = keyof typeof LAYER_ICONS

interface ChipProps extends React.ComponentProps<"span"> {
  icon?: LayerIconType
  active?: boolean
}

export function Chip({
  icon = "ebpf",
  active,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 border border-lp-line-strong px-2.5 font-mono text-xs whitespace-nowrap transition-colors",
        active
          ? "bg-lp-ink text-lp-paper"
          : "bg-lp-paper text-lp-ink hover:bg-lp-ink hover:text-lp-paper",
        className
      )}
      {...props}
    >
      <svg
        aria-hidden
        viewBox="0 0 8 8"
        shapeRendering="crispEdges"
        className="size-2.5 shrink-0 fill-current"
      >
        <path d={LAYER_ICONS[icon]} />
      </svg>
      <span className="font-medium">{children}</span>
    </span>
  )
}
