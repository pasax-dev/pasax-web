"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShieldCheck, Server, Globe, Flame, TrendingUpIcon } from "lucide-react"

export function SectionCards({
  stats,
}: {
  stats?: {
    score?: number
    activeNodes?: number
    vhostsCount?: number
    totalBlocks?: number
  }
}) {
  const score = stats?.score ?? 98
  const nodes = stats?.activeNodes ?? 3
  const vhosts = stats?.vhostsCount ?? 4
  const blocks = stats?.totalBlocks ?? 1420

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Stat Card 1: Health Score */}
      <Card className="rounded-base border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md shadow-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:border-main/70">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <CardDescription className="font-semibold text-foreground/70">
              Cluster Health Score
            </CardDescription>
            <ShieldCheck className="size-5 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="font-heading text-3xl font-black tabular-nums">
            {score}
            <span className="text-sm font-normal text-muted-foreground">
              /100
            </span>
          </CardTitle>
          <CardAction>
            <Badge variant="success">OPTIMAL</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-green-700 dark:text-green-400">
            <TrendingUpIcon className="size-3.5" />
            +2.4% integrity baseline
          </div>
          <div className="font-mono text-muted-foreground">
            Zero unmitigated critical files
          </div>
        </CardFooter>
      </Card>

      {/* Stat Card 2: Connected Nodes */}
      <Card className="rounded-base border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md shadow-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:border-main/70">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <CardDescription className="font-semibold text-foreground/70">
              Protected VPS Nodes
            </CardDescription>
            <Server className="size-5 text-main" />
          </div>
          <CardTitle className="font-heading text-3xl font-black tabular-nums">
            {nodes}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              hosts
            </span>
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">100% ONLINE</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="font-bold text-foreground">
            Go Sentinel Daemon v1.2.0
          </div>
          <div className="font-mono text-muted-foreground">
            &lt; 0.2ms IPC socket latency
          </div>
        </CardFooter>
      </Card>

      {/* Stat Card 3: Monitored VHosts */}
      <Card className="rounded-base border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md shadow-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:border-main/70">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <CardDescription className="font-semibold text-foreground/70">
              Discovered Domains & VHosts
            </CardDescription>
            <Globe className="size-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="font-heading text-3xl font-black tabular-nums">
            {vhosts}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              vhosts
            </span>
          </CardTitle>
          <CardAction>
            <Badge variant="warning">SSL ACTIVE</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="font-bold text-foreground">
            Auto-recon: Nginx & Apache
          </div>
          <div className="font-mono text-muted-foreground">
            1 cert expiring in &lt; 5 days
          </div>
        </CardFooter>
      </Card>

      {/* Stat Card 4: Dropped Threats */}
      <Card className="rounded-base border-2 border-border bg-secondary-background/80 dark:bg-[#0c1324]/85 backdrop-blur-md shadow-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:border-main/70">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <CardDescription className="font-semibold text-foreground/70">
              Attacks Blocked (Kernel)
            </CardDescription>
            <Flame className="size-5 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="font-heading text-3xl font-black tabular-nums">
            {blocks.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="destructive">DROPPED</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
            <Flame className="size-3.5 fill-red-500" />
            Kernel nftables + WAF drops
          </div>
          <div className="font-mono text-muted-foreground">
            Shared with 5 global nodes
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
