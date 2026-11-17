"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FigureProps extends React.ComponentProps<"section"> {
  id: string
  status?: string
}

export function Figure({
  id,
  status,
  className,
  children,
  ...props
}: FigureProps) {
  return (
    <section
      id={id}
      data-figure={id}
      data-status={status}
      className={cn(
        "relative scroll-mt-(--lp-menu-h) border-t border-lp-line",
        className
      )}
      {...props}
    >
      <Mark className="left-0 -translate-x-1/2" />
      <Mark className="right-0 translate-x-1/2" />
      {children}
    </section>
  )
}

export function Mark({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      data-mark=""
      viewBox="0 0 11 11"
      className={cn(
        "pointer-events-none absolute top-0 z-10 size-2.75 -translate-y-1/2 text-lp-line-strong select-none",
        className
      )}
    >
      <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function StatusPlate({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative isolate mb-3 flex h-7 w-fit font-mono text-xs font-normal tracking-normal text-lp-ink">
      <span
        aria-hidden
        className="relative flex aspect-square h-full items-center justify-center border border-lp-line-strong bg-lp-paper"
      >
        <span className="size-2 rounded-full border border-lp-ink bg-lp-sun" />
      </span>
      <span className="relative flex items-center border border-s-0 border-lp-line-strong bg-lp-paper px-3 font-medium">
        <span className="truncate">{children}</span>
      </span>
    </span>
  )
}

export interface TermRun {
  term: string
}

export type Run = string | TermRun

export function Terms({ runs }: { runs: readonly Run[] }) {
  const out: React.ReactNode[] = []
  for (let i = 0; i < runs.length; i++) {
    const run = runs[i]
    if (typeof run !== "string") {
      out.push(
        <span
          key={`term-${i}`}
          className="font-medium whitespace-nowrap text-lp-orange"
        >
          {run.term}
        </span>
      )
      continue
    }
    const lines = run.split("\n")
    for (let j = 0; j < lines.length; j++) {
      if (j > 0) out.push(<br key={`br-${i}-${j}`} />)
      out.push(lines[j])
    }
  }
  return <>{out}</>
}

interface FigureHeaderProps
  extends Omit<React.ComponentProps<"h2">, "title" | "children"> {
  lead?: React.ReactNode
  title: readonly Run[] | string
}

export function FigureHeader({
  lead,
  title,
  className,
  ...props
}: FigureHeaderProps) {
  const runs: readonly Run[] =
    typeof title === "string" ? [title] : title

  return (
    <div className="mb-8">
      {lead && typeof lead === "string" ? (
        <StatusPlate>{lead}</StatusPlate>
      ) : (
        lead
      )}
      <h2
        {...props}
        className={cn(
          "max-w-3xl text-[clamp(1.75rem,1.25rem+2vw,2.75rem)] font-light leading-tight tracking-tight text-lp-ink",
          className
        )}
      >
        <Terms runs={runs} />
      </h2>
    </div>
  )
}
