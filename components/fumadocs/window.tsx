import * as React from "react"
import { cn } from "@/lib/utils"

export const STRIPES =
  "my-auto h-2.5 bg-[linear-gradient(to_bottom,var(--lp-line-strong)_1px,transparent_1px)] [background-size:100%_3px]"

interface TitleBarProps {
  title?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function TitleBar({ title, actions, className }: TitleBarProps) {
  return (
    <div
      className={cn(
        "relative flex h-8 shrink-0 items-center gap-2 border-b border-lp-line-strong bg-lp-paper-2 px-2.5 select-none",
        className
      )}
    >
      <div aria-hidden className={`absolute inset-x-2 inset-y-0 ${STRIPES}`} />
      <span
        aria-hidden
        className="relative size-3.5 shrink-0 border border-lp-line-strong bg-lp-paper"
      />
      <span className="relative mx-auto truncate bg-lp-paper px-2.5 font-mono text-xs leading-5 font-medium text-lp-ink">
        {title}
      </span>
      {actions ?? (
        <span
          aria-hidden
          className="relative size-3.5 shrink-0 border border-lp-line-strong bg-lp-paper"
        />
      )}
    </div>
  )
}

interface WindowProps extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode
  actions?: React.ReactNode
}

export function Window({
  title,
  actions,
  className,
  children,
  ...props
}: WindowProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden border border-lp-line-strong bg-lp-paper shadow-sm",
        className
      )}
      {...props}
    >
      <TitleBar title={title} actions={actions} />
      <div className="relative flex-1">{children}</div>
    </div>
  )
}
