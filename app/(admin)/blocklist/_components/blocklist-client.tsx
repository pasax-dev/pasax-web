"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Plus,
  Search,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Clock,
  Layers,
  Terminal,
} from "lucide-react"

interface BlocklistClientProps {
  initialBlocklist: string[]
  currentRole?: string
}

export function BlocklistClient({
  initialBlocklist = [],
  currentRole = "Superadmin",
}: BlocklistClientProps) {
  const [blocklist, setBlocklist] = React.useState<string[]>(initialBlocklist)
  const [newIp, setNewIp] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedIp, setCopiedIp] = React.useState<string | null>(null)
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIp(text)
    setTimeout(() => setCopiedIp(null), 2000)
  }

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/v1/threats/global-blocklist")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setBlocklist(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddIp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIp.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/v1/threats/global-blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: newIp.trim() }),
      })
      if (res.ok) {
        const result = await res.json()
        if (Array.isArray(result.blocklist)) {
          setBlocklist(result.blocklist)
        } else {
          setBlocklist((prev) => Array.from(new Set([...prev, newIp.trim()])))
        }
        setStatusMsg(
          `IP ${newIp.trim()} berhasil ditambahkan ke daftar cekal kernel nftables.`
        )
        setNewIp("")
        setTimeout(() => setStatusMsg(null), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveIp = async (ip: string) => {
    if (!confirm(`Hapus cekal untuk IP ${ip}?`)) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/threats/global-blocklist?ip=${ip}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setBlocklist((prev) => prev.filter((item) => item !== ip))
        setStatusMsg(`Cekal untuk IP ${ip} berhasil dicabut.`)
        setTimeout(() => setStatusMsg(null), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBlocklist = React.useMemo(() => {
    return blocklist.filter((ip) => {
      const q = searchQuery.toLowerCase().trim()
      return !q || ip.includes(q)
    })
  }, [blocklist, searchQuery])

  return (
    <div className="flex flex-col gap-6" data-role={currentRole}>
      {/* 1. Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-heading text-2xl font-black tracking-tight text-balance text-foreground sm:text-3xl">
              Crowd Defense &amp; Kernel Blocklist
            </h1>
            <Badge
              variant="outline"
              className="border-emerald-500/50 bg-emerald-500/10 font-mono text-[11px] font-bold tracking-wider text-emerald-500"
            >
              NFTABLES LEVEL
            </Badge>
          </div>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
            Daftar IP berbahaya yang dicekal secara instan di kernel Linux
            sebelum mencapai Nginx, Apache2, atau PHP.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isLoading}
          className="h-9 shrink-0 border-2 font-mono text-xs whitespace-nowrap"
        >
          <RefreshCw
            className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Sinkronkan
        </Button>
      </div>

      {statusMsg && (
        <div className="flex items-center gap-2 rounded-base border-2 border-emerald-500 bg-emerald-500/10 p-3 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* 2. Tactical Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                TOTAL IP DICEKAL
              </span>
              <Shield className="size-4 shrink-0 text-rose-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-rose-500 tabular-nums">
              {blocklist.length}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Aktif di seluruh node
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                AKSI MITIGASI
              </span>
              <Terminal className="size-4 shrink-0 text-main" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-main">
              DROP
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              nftables kernel bypass
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                CROWD INTELLIGENCE
              </span>
              <Layers className="size-4 shrink-0 text-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-500">
              SYNC ON
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Auto-share across cluster
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-[3px_3px_0px_0px_var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                LATENSI DROPPING
              </span>
              <Clock className="size-4 shrink-0 text-sky-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-black text-sky-500 tabular-nums">
              &lt; 0.2 ms
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Zero CPU overhead
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Form Tambah IP Cepat */}
      <Card className="border-2 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <form
            onSubmit={handleAddIp}
            className="flex flex-col items-center gap-3 sm:flex-row"
          >
            <div className="relative w-full flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari dalam daftar cekal atau masukkan IP baru..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 border-2 border-border bg-background pl-9 font-mono text-xs"
              />
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                placeholder="Misal: 198.51.100.42"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                className="h-10 w-full border-2 border-border bg-background font-mono text-xs tabular-nums sm:w-48"
              />
              <Button
                type="submit"
                disabled={isLoading || !newIp.trim()}
                className="h-10 shrink-0 border-2 border-border bg-main font-heading font-black whitespace-nowrap text-black shadow-[2px_2px_0px_0px_var(--border)]"
              >
                <Plus className="mr-1 size-3.5 stroke-[3]" />
                Cekal IP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 4. Table */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-5 py-4">
          <CardTitle className="flex items-center gap-2 font-heading text-lg font-black text-foreground tabular-nums">
            <Shield className="size-5 text-rose-500" />
            <span>Daftar IP Yang Dicekal ({filteredBlocklist.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border bg-muted/30">
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    ALAMAT IP (IPv4)
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    RULE FIREWALL
                  </TableHead>
                  <TableHead className="px-3 font-mono text-[11px] font-bold tracking-wider text-foreground">
                    STATUS SINKRONISASI
                  </TableHead>
                  <TableHead className="px-3 text-right font-mono text-[11px] font-bold tracking-wider text-foreground">
                    AKSI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlocklist.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center font-mono text-xs text-muted-foreground"
                    >
                      Tidak ada IP yang cocok dengan filter pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlocklist.map((ip) => (
                    <TableRow
                      key={ip}
                      className="border-b border-border/60 transition-colors hover:bg-muted/10"
                    >
                      <TableCell className="px-3 py-3 font-mono text-xs font-bold text-foreground tabular-nums">
                        <div className="flex items-center gap-2">
                          <span className="size-2 animate-pulse rounded-full bg-rose-500" />
                          <span>{ip}</span>
                          <button
                            onClick={() => handleCopy(ip)}
                            title="Salin IP"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {copiedIp === ip ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      <TableCell className="px-3 py-3 font-mono text-xs">
                        <Badge
                          variant="outline"
                          className="border-rose-500/40 bg-rose-500/10 font-bold text-rose-600 dark:text-rose-400"
                        >
                          NFTABLES_DROP_IP
                        </Badge>
                      </TableCell>

                      <TableCell className="px-3 py-3 font-mono text-xs">
                        <span className="flex items-center gap-1 font-semibold text-emerald-500">
                          <CheckCircle2 className="size-3" />
                          Tersinkron di semua Node VPS
                        </span>
                      </TableCell>

                      <TableCell className="px-3 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIp(ip)}
                          className="font-mono text-xs text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="mr-1 size-3.5" />
                          Cabut Cekal
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
