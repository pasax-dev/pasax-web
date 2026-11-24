"use client"

import * as React from "react"
import Link from "next/link"
import "@xterm/xterm/css/xterm.css"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { NodeTelemetry } from "@/lib/store"
import {
  TerminalSquare,
  Plug,
  Unplug,
  Server,
  ShieldCheck,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  KeyRound,
  Lock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

interface TerminalClientProps {
  nodes: NodeTelemetry[]
  initialNodeId?: string
  currentRole: string
  currentEmail: string
  isVercelCloud?: boolean
}

type ConnectionStatus = "idle" | "connecting" | "connected" | "error"
type TerminalTransportMode = "pty" | "command"

interface QuickSnippet {
  label: string
  command: string
  description: string
}

const QUICK_SNIPPETS: QuickSnippet[] = [
  {
    label: "Sentinel Ping",
    command: "cd /var/www/pasax-app && php artisan pasax:sentinel --ping",
    description: "Cek koneksi IPC socket Laravel WAF ke daemon Sentinel",
  },
  {
    label: "Kernel nftables",
    command: "sudo nft list table inet pasax",
    description: "Lihat aturan blokir IP aktif di Linux Kernel nftables",
  },
  {
    label: "Status Daemon",
    command: "systemctl status pasax-sentinel --no-pager",
    description: "Periksa status systemd service pasax-sentinel",
  },
  {
    label: "System & RAM",
    command: "uname -a && uptime && free -h",
    description: "Informasi kernel Linux, uptime, dan pemakaian memori",
  },
  {
    label: "Nginx VHosts",
    command: "ls -la /etc/nginx/sites-enabled/",
    description: "Daftar Virtual Host aktif di Nginx",
  },
  {
    label: "Laravel WAF Logs",
    command: "tail -n 25 /var/www/pasax-app/storage/logs/laravel.log",
    description: "Pantau 25 baris log terbaru aplikasi Laravel",
  },
]

const inputClass =
  "h-9 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-main focus-visible:ring-0"

const selectClass =
  "h-9 w-full rounded-base border-2 border-border bg-background px-3 font-mono text-xs font-semibold text-foreground focus:border-main focus:outline-hidden"

function getDefaultUsername(node: NodeTelemetry | undefined, role: string): string {
  const isVBox =
    node?.ip_v4 === "10.0.2.15" ||
    node?.ip_v4 === "127.0.0.1" ||
    node?.hostname.toLowerCase().includes("virtualbox") ||
    node?.hostname.toLowerCase().includes("vbox")

  if (isVBox) {
    if (role === "Programmer") return "programmer"
    if (role === "DevOps") return "maintainer"
    return "roby"
  }
  return "root"
}

function isVirtualBoxLikeNode(node: NodeTelemetry | undefined): boolean {
  if (!node) return false
  return (
    node.ip_v4 === "10.0.2.15" ||
    node.ip_v4 === "127.0.0.1" ||
    node.hostname.toLowerCase().includes("virtualbox") ||
    node.hostname.toLowerCase().includes("vbox")
  )
}

export function TerminalClient({
  nodes = [],
  initialNodeId,
  currentRole,
  currentEmail,
  isVercelCloud = false,
}: TerminalClientProps) {
  const defaultNode =
    nodes.find((n) => n.node_id === initialNodeId) || nodes[0] || undefined

  const [selectedNodeId, setSelectedNodeId] = React.useState<string>(
    defaultNode?.node_id || ""
  )
  const [host, setHost] = React.useState<string>(
    isVirtualBoxLikeNode(defaultNode) && !isVercelCloud
      ? "127.0.0.1"
      : defaultNode?.ip_v4 || ""
  )
  const [port, setPort] = React.useState<string>(
    isVirtualBoxLikeNode(defaultNode) && !isVercelCloud
      ? "2222"
      : String(defaultNode?.ssh_port || 22)
  )
  const [username, setUsername] = React.useState<string>(
    getDefaultUsername(defaultNode, currentRole)
  )
  const [authMethod, setAuthMethod] = React.useState<"password" | "key">(
    "password"
  )
  const [password, setPassword] = React.useState<string>("")
  const [privateKey, setPrivateKey] = React.useState<string>("")
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const [transportMode, setTransportMode] =
    React.useState<TerminalTransportMode>(isVercelCloud ? "command" : "pty")
  const [status, setStatus] = React.useState<ConnectionStatus>("idle")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [sessionId, setSessionId] = React.useState<string | null>(null)
  const [dimensions, setDimensions] = React.useState<{ cols: number; rows: number }>({
    cols: 100,
    rows: 28,
  })
  const [fontSize, setFontSize] = React.useState<number>(13)
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false)
  const [copiedOutput, setCopiedOutput] = React.useState<boolean>(false)

  const selectedNode = React.useMemo(
    () => nodes.find((n) => n.node_id === selectedNodeId),
    [nodes, selectedNodeId]
  )

  // Refs for Xterm.js & live callbacks
  const terminalHostRef = React.useRef<HTMLDivElement | null>(null)
  const xtermRef = React.useRef<any>(null)
  const fitAddonRef = React.useRef<any>(null)
  const eventSourceRef = React.useRef<EventSource | null>(null)

  const statusRef = React.useRef<ConnectionStatus>("idle")
  const modeRef = React.useRef<TerminalTransportMode>(transportMode)
  const sessionIdRef = React.useRef<string | null>(null)
  const localLineBufferRef = React.useRef<string>("")
  const cmdHistoryRef = React.useRef<string[]>([])
  const cmdHistoryIdxRef = React.useRef<number>(-1)
  const inputQueueRef = React.useRef<Promise<void>>(Promise.resolve())
  const pendingInputBufferRef = React.useRef<string>("")
  const flushTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep refs synced with latest state & connection form values
  const connConfigRef = React.useRef({
    nodeId: selectedNodeId,
    host,
    port,
    username,
    authMethod,
    password,
    privateKey,
  })

  React.useEffect(() => {
    connConfigRef.current = {
      nodeId: selectedNodeId,
      host,
      port,
      username,
      authMethod,
      password,
      privateKey,
    }
  }, [selectedNodeId, host, port, username, authMethod, password, privateKey])

  React.useEffect(() => {
    statusRef.current = status
  }, [status])

  React.useEffect(() => {
    modeRef.current = transportMode
  }, [transportMode])

  React.useEffect(() => {
    sessionIdRef.current = sessionId
  }, [sessionId])

  const writeLocalPrompt = React.useCallback(() => {
    const term = xtermRef.current
    if (!term) return
    if (statusRef.current === "connected" && modeRef.current === "command") {
      const cfg = connConfigRef.current
      term.write(
        `\r\n\x1b[38;5;45m${cfg.username}@${cfg.host}\x1b[0m:\x1b[38;5;214m~$\x1b[0m `
      )
    } else if (statusRef.current !== "connected") {
      term.write(`\r\n\x1b[38;5;39mpasax-local\x1b[0m:\x1b[38;5;245m~$\x1b[0m `)
    }
  }, [])

  const runLocalShellCommand = React.useCallback(
    async (rawCmd: string) => {
      const term = xtermRef.current
      if (!term) return
      const cmd = rawCmd.trim()
      if (!cmd) {
        writeLocalPrompt()
        return
      }

      if (cmd === "clear") {
        term.clear()
        writeLocalPrompt()
        return
      }

      // If connected in Stateless Command mode -> execute via SSH exec endpoint
      if (statusRef.current === "connected" && modeRef.current === "command") {
        const cfg = connConfigRef.current
        try {
          const res = await fetch("/api/admin/terminal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "exec",
              nodeId: cfg.nodeId,
              host: cfg.host,
              port: Number(cfg.port || 22),
              username: cfg.username,
              password: cfg.authMethod === "password" ? cfg.password : undefined,
              privateKey: cfg.authMethod === "key" ? cfg.privateKey : undefined,
              command: cmd,
            }),
          })
          const json = await res.json()
          if (!res.ok || json.status !== "success") {
            term.writeln(
              `\r\n\x1b[31m[SSH ERROR]\x1b[0m ${json.message || "Gagal mengeksekusi perintah."}`
            )
          } else {
            const out = (json.data?.stdout || "").replace(/\r?\n/g, "\r\n")
            const errOut = (json.data?.stderr || "").replace(/\r?\n/g, "\r\n")
            if (out) term.write(`\r\n${out}`)
            if (errOut) term.write(`\r\n\x1b[33m${errOut}\x1b[0m`)
            if (!out && !errOut) {
              term.write(`\r\n\x1b[90m(exit code: ${json.data?.exitCode ?? 0})\x1b[0m`)
            }
          }
        } catch (err: any) {
          term.writeln(`\r\n\x1b[31m[NETWORK ERROR]\x1b[0m ${err.message}`)
        }
        writeLocalPrompt()
        return
      }

      // Otherwise run built-in local Pasax Telemetry Console commands
      term.write("\r\n")
      if (cmd === "help") {
        term.writeln("\x1b[1;36mPasax Local Telemetry Console (Pre-SSH)\x1b[0m")
        term.writeln("  \x1b[33mhelp\x1b[0m      Tampilkan bantuan perintah lokal")
        term.writeln("  \x1b[33mnodes\x1b[0m     Daftar VPS Node dalam cakupan akun Anda")
        term.writeln("  \x1b[33mstatus\x1b[0m    Ringkasan status node terpilih & konfigurasi SSH")
        term.writeln("  \x1b[33mvhosts\x1b[0m    Daftar Virtual Host terdeteksi pada node terpilih")
        term.writeln("  \x1b[33mclear\x1b[0m     Bersihkan layar terminal")
        term.writeln(
          "\x1b[90mTip: Isi kredensial SSH di panel atas lalu klik 'Hubungkan SSH' untuk shell Linux penuh.\x1b[0m"
        )
      } else if (cmd === "nodes") {
        if (nodes.length === 0) {
          term.writeln("\x1b[33mBelum ada VPS Node terdaftar pada akun Anda.\x1b[0m")
        } else {
          nodes.forEach((n, i) => {
            term.writeln(
              `  [${i + 1}] \x1b[1;32m${n.hostname}\x1b[0m  IP: ${n.ip_v4}:${n.ssh_port || 22}  Status: ${n.status}  ID: ${n.node_id}`
            )
          })
        }
      } else if (cmd === "status") {
        const node = nodes.find((n) => n.node_id === connConfigRef.current.nodeId)
        if (!node) {
          term.writeln("\x1b[33mTidak ada node yang dipilih.\x1b[0m")
        } else {
          term.writeln(`Hostname : \x1b[1m${node.hostname}\x1b[0m (${node.node_id})`)
          term.writeln(`IP / Port: ${node.ip_v4}:${node.ssh_port || 22}`)
          term.writeln(`OS       : ${node.os}`)
          term.writeln(
            `Metrics  : CPU ${node.cpu_used_percent}% | RAM ${node.memory_used_percent}% | Status ${node.status}`
          )
        }
      } else if (cmd === "vhosts") {
        const node = nodes.find((n) => n.node_id === connConfigRef.current.nodeId)
        const vhosts = [
          ...(node?.webservers?.nginx?.vhosts || []),
          ...(node?.webservers?.apache2?.vhosts || []),
        ]
        if (vhosts.length === 0) {
          term.writeln("\x1b[90mBelum ada VHost terdeteksi pada node ini.\x1b[0m")
        } else {
          vhosts.forEach((v) => {
            term.writeln(
              `  • \x1b[36m${v.domain}\x1b[0m  SSL: ${v.ssl_status}  Upstream: ${v.upstream || "-"}`
            )
          })
        }
      } else {
        term.writeln(
          `\x1b[33mShell SSH belum terhubung.\x1b[0m Perintah '${cmd}' tidak dijalankan di VPS. Ketik \x1b[36mhelp\x1b[0m atau klik \x1b[32mHubungkan SSH\x1b[0m.`
        )
      }
      writeLocalPrompt()
    },
    [nodes, writeLocalPrompt]
  )

  const enqueuePtyInput = React.useCallback((chunk: string) => {
    const sid = sessionIdRef.current
    if (!sid) return
    pendingInputBufferRef.current += chunk
    if (flushTimerRef.current) return

    flushTimerRef.current = setTimeout(() => {
      flushTimerRef.current = null
      const payload = pendingInputBufferRef.current
      pendingInputBufferRef.current = ""
      if (!payload || !sessionIdRef.current) return

      const targetSid = sessionIdRef.current
      inputQueueRef.current = inputQueueRef.current
        .then(async () => {
          await fetch("/api/admin/terminal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "input",
              sessionId: targetSid,
              data: payload,
            }),
          })
        })
        .catch(() => {
          // ignore transient input error
        })
    }, 12)
  }, [])

  // Mount Xterm.js strictly in browser
  React.useEffect(() => {
    let disposed = false
    let resizeObserver: ResizeObserver | null = null
    let termInstance: any = null

    const initTerminal = async () => {
      if (!terminalHostRef.current) return
      const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
        import("@xterm/addon-web-links"),
      ])

      if (disposed || !terminalHostRef.current) return

      const fitAddon = new FitAddon()
      const webLinksAddon = new WebLinksAddon()

      const term = new Terminal({
        cursorBlink: true,
        cursorStyle: "block",
        fontSize,
        lineHeight: 1.32,
        fontFamily:
          '"JetBrains Mono", "Space Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        scrollback: 5000,
        convertEol: true,
        theme: {
          background: "#090d16",
          foreground: "#e2e8f0",
          cursor: "#38bdf8",
          cursorAccent: "#090d16",
          selectionBackground: "rgba(56, 189, 248, 0.3)",
          black: "#0f172a",
          red: "#fb7185",
          green: "#34d399",
          yellow: "#fbbf24",
          blue: "#38bdf8",
          magenta: "#c084fc",
          cyan: "#22d3ee",
          white: "#f1f5f9",
          brightBlack: "#475569",
          brightRed: "#fda4af",
          brightGreen: "#6ee7b7",
          brightYellow: "#fde68a",
          brightBlue: "#7dd3fc",
          brightMagenta: "#d8b4fe",
          brightCyan: "#67e8f9",
          brightWhite: "#ffffff",
        },
      })

      term.loadAddon(fitAddon)
      term.loadAddon(webLinksAddon)
      term.open(terminalHostRef.current)
      fitAddon.fit()

      termInstance = term
      xtermRef.current = term
      fitAddonRef.current = fitAddon
      setDimensions({ cols: term.cols, rows: term.rows })

      // Initial SOC banner
      term.writeln("\x1b[1;36m╔══════════════════════════════════════════════════════════════╗\x1b[0m")
      term.writeln("\x1b[1;36m║  PASAX CLOUD SOC — WEB SSH TERMINAL (XTERM.JS ENGINE)       ║\x1b[0m")
      term.writeln("\x1b[1;36m╚══════════════════════════════════════════════════════════════╝\x1b[0m")
      term.writeln(
        `\x1b[90mOperator:\x1b[0m ${currentEmail} (${currentRole})  |  \x1b[90mScoped VPS:\x1b[0m ${nodes.length} node`
      )
      term.writeln(
        "\x1b[90mKetik 'help' untuk perintah lokal atau klik 'Hubungkan SSH' untuk shell VPS.\x1b[0m"
      )
      term.write(`\r\n\x1b[38;5;39mpasax-local\x1b[0m:\x1b[38;5;245m~$\x1b[0m `)

      term.onData((data: string) => {
        if (statusRef.current === "connected" && modeRef.current === "pty") {
          enqueuePtyInput(data)
          return
        }

        // Local or Stateless Command readline emulator
        for (let i = 0; i < data.length; i++) {
          const ch = data[i]
          if (ch === "\r") {
            const cmd = localLineBufferRef.current
            if (cmd.trim()) {
              cmdHistoryRef.current.unshift(cmd)
              if (cmdHistoryRef.current.length > 50) cmdHistoryRef.current.pop()
            }
            cmdHistoryIdxRef.current = -1
            localLineBufferRef.current = ""
            void runLocalShellCommand(cmd)
            return
          }
          if (ch === "\u0003") {
            // Ctrl+C
            localLineBufferRef.current = ""
            term.write("^C")
            writeLocalPrompt()
            return
          }
          if (ch === "\u000c") {
            // Ctrl+L
            term.clear()
            writeLocalPrompt()
            return
          }
          if (ch === "\u007f" || ch === "\b") {
            if (localLineBufferRef.current.length > 0) {
              localLineBufferRef.current = localLineBufferRef.current.slice(0, -1)
              term.write("\b \b")
            }
            continue
          }
          if (data === "\x1b[A") {
            // ArrowUp
            const nextIdx = cmdHistoryIdxRef.current + 1
            if (nextIdx < cmdHistoryRef.current.length) {
              while (localLineBufferRef.current.length > 0) {
                localLineBufferRef.current = localLineBufferRef.current.slice(0, -1)
                term.write("\b \b")
              }
              cmdHistoryIdxRef.current = nextIdx
              const hist = cmdHistoryRef.current[nextIdx]
              localLineBufferRef.current = hist
              term.write(hist)
            }
            return
          }
          if (data === "\x1b[B") {
            // ArrowDown
            const prevIdx = cmdHistoryIdxRef.current - 1
            while (localLineBufferRef.current.length > 0) {
              localLineBufferRef.current = localLineBufferRef.current.slice(0, -1)
              term.write("\b \b")
            }
            if (prevIdx >= 0) {
              cmdHistoryIdxRef.current = prevIdx
              const hist = cmdHistoryRef.current[prevIdx]
              localLineBufferRef.current = hist
              term.write(hist)
            } else {
              cmdHistoryIdxRef.current = -1
            }
            return
          }
          if (ch >= " " && ch !== "\u007f") {
            localLineBufferRef.current += ch
            term.write(ch)
          }
        }
      })

      const syncResize = () => {
        if (!fitAddonRef.current || !xtermRef.current) return
        try {
          fitAddonRef.current.fit()
          const cols = xtermRef.current.cols
          const rows = xtermRef.current.rows
          setDimensions({ cols, rows })
          if (
            statusRef.current === "connected" &&
            modeRef.current === "pty" &&
            sessionIdRef.current
          ) {
            void fetch("/api/admin/terminal", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "resize",
                sessionId: sessionIdRef.current,
                cols,
                rows,
              }),
            }).catch(() => {})
          }
        } catch {
          // ignore fit while hidden
        }
      }

      resizeObserver = new ResizeObserver(() => {
        syncResize()
      })
      resizeObserver.observe(terminalHostRef.current)
      window.addEventListener("resize", syncResize)
    }

    void initTerminal()

    return () => {
      disposed = true
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
      resizeObserver?.disconnect()
      eventSourceRef.current?.close()
      termInstance?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update font size & refit
  React.useEffect(() => {
    if (xtermRef.current && fitAddonRef.current) {
      xtermRef.current.options.fontSize = fontSize
      fitAddonRef.current.fit()
      setDimensions({ cols: xtermRef.current.cols, rows: xtermRef.current.rows })
    }
  }, [fontSize, isFullscreen])

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId)
    const node = nodes.find((n) => n.node_id === nodeId)
    if (!node) return
    const isVBox = isVirtualBoxLikeNode(node)
    setHost(isVBox && !isVercelCloud ? "127.0.0.1" : node.ip_v4)
    setPort(isVBox && !isVercelCloud ? "2222" : String(node.ssh_port || 22))
    setUsername(getDefaultUsername(node, currentRole))
  }

  const applyVirtualBoxPreset = () => {
    setHost("127.0.0.1")
    setPort("2222")
    if (currentRole === "Programmer") setUsername("programmer")
    else if (currentRole === "DevOps") setUsername("maintainer")
    else setUsername("roby")
    setErrorMessage(null)
  }

  const handleDisconnect = async () => {
    eventSourceRef.current?.close()
    eventSourceRef.current = null
    if (sessionId) {
      try {
        await fetch("/api/admin/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "disconnect", sessionId }),
        })
      } catch {
        // ignore
      }
    }
    setSessionId(null)
    setStatus("idle")
    xtermRef.current?.writeln("\r\n\x1b[33m[DISCONNECTED] Sesi SSH ditutup oleh operator.\x1b[0m")
    statusRef.current = "idle"
    writeLocalPrompt()
  }

  const handleConnect = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!selectedNodeId) {
      setErrorMessage("Tidak ada VPS Node yang tersedia untuk akun Anda.")
      return
    }
    if (!host.trim() || !username.trim()) {
      setErrorMessage("Host SSH dan Username wajib diisi.")
      return
    }
    if (authMethod === "password" && !password) {
      setErrorMessage("Masukkan password SSH VPS tujuan.")
      return
    }
    if (authMethod === "key" && !privateKey.trim()) {
      setErrorMessage("Tempelkan SSH Private Key (PEM/OpenSSH).")
      return
    }

    eventSourceRef.current?.close()
    eventSourceRef.current = null
    setErrorMessage(null)
    setStatus("connecting")

    const term = xtermRef.current
    term?.writeln(
      `\r\n\x1b[36m[SSH] Menghubungkan ke ${username.trim()}@${host.trim()}:${port} (${transportMode.toUpperCase()})...\x1b[0m`
    )

    if (transportMode === "command") {
      // Verify credentials cleanly with `whoami && hostname`
      try {
        const res = await fetch("/api/admin/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "exec",
            nodeId: selectedNodeId,
            host: host.trim(),
            port: Number(port || 22),
            username: username.trim(),
            password: authMethod === "password" ? password : undefined,
            privateKey: authMethod === "key" ? privateKey : undefined,
            command: "whoami && hostname && uname -sr",
          }),
        })
        const json = await res.json()
        if (!res.ok || json.status !== "success") {
          const msg = json.message || "Gagal terhubung via SSH."
          setStatus("error")
          setErrorMessage(msg)
          term?.writeln(`\x1b[31m[SSH FAILED]\x1b[0m ${msg}`)
          writeLocalPrompt()
          return
        }

        setStatus("connected")
        statusRef.current = "connected"
        const info = (json.data?.stdout || "").trim().replace(/\r?\n/g, " | ")
        term?.writeln(`\x1b[32m[SSH CONNECTED - COMMAND MODE]\x1b[0m ${info}`)
        writeLocalPrompt()
        term?.focus()
      } catch (err: any) {
        setStatus("error")
        setErrorMessage(err.message)
        term?.writeln(`\x1b[31m[SSH ERROR]\x1b[0m ${err.message}`)
        writeLocalPrompt()
      }
      return
    }

    // Interactive PTY Mode
    try {
      const res = await fetch("/api/admin/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "connect",
          nodeId: selectedNodeId,
          host: host.trim(),
          port: Number(port || 22),
          username: username.trim(),
          password: authMethod === "password" ? password : undefined,
          privateKey: authMethod === "key" ? privateKey : undefined,
          cols: term?.cols || dimensions.cols,
          rows: term?.rows || dimensions.rows,
        }),
      })
      const json = await res.json()
      if (!res.ok || json.status !== "success" || !json.data?.sessionId) {
        const msg = json.message || "Gagal membuka shell PTY SSH."
        setStatus("error")
        setErrorMessage(msg)
        term?.writeln(`\x1b[31m[SSH FAILED]\x1b[0m ${msg}`)
        writeLocalPrompt()
        return
      }

      const sid = json.data.sessionId as string
      setSessionId(sid)
      sessionIdRef.current = sid
      setStatus("connected")
      statusRef.current = "connected"
      term?.writeln(`\x1b[32m[SSH PTY LIVE]\x1b[0m Terhubung ke ${json.data.hostname}.`)

      const es = new EventSource(
        `/api/admin/terminal?sessionId=${encodeURIComponent(sid)}`
      )
      eventSourceRef.current = es

      es.addEventListener("output", (evt) => {
        try {
          const parsed = JSON.parse((evt as MessageEvent).data)
          if (parsed?.data) {
            xtermRef.current?.write(parsed.data)
          }
        } catch {
          // ignore malformed event
        }
      })

      es.addEventListener("closed", (evt) => {
        try {
          const parsed = JSON.parse((evt as MessageEvent).data)
          xtermRef.current?.writeln(
            `\r\n\x1b[33m[SSH CLOSED]\x1b[0m ${parsed?.reason || "Sesi berakhir."}`
          )
        } catch {
          xtermRef.current?.writeln("\r\n\x1b[33m[SSH CLOSED]\x1b[0m")
        }
        es.close()
        setSessionId(null)
        setStatus("idle")
        statusRef.current = "idle"
        writeLocalPrompt()
      })

      es.onerror = () => {
        if (statusRef.current === "connected") {
          es.close()
          setStatus("error")
          statusRef.current = "error"
          setErrorMessage("Stream SSE terminal terputus.")
          xtermRef.current?.writeln(
            "\r\n\x1b[31m[STREAM ERROR] Koneksi live SSE terputus.\x1b[0m"
          )
        }
      }

      term?.focus()
    } catch (err: any) {
      setStatus("error")
      setErrorMessage(err.message)
      term?.writeln(`\x1b[31m[SSH ERROR]\x1b[0m ${err.message}`)
      writeLocalPrompt()
    }
  }

  const handleRunSnippet = (snippet: QuickSnippet) => {
    const term = xtermRef.current
    if (!term) return
    if (status === "connected" && transportMode === "pty") {
      enqueuePtyInput(`${snippet.command}\r`)
      term.focus()
      return
    }
    if (status === "connected" && transportMode === "command") {
      term.write(snippet.command)
      void runLocalShellCommand(snippet.command)
      term.focus()
      return
    }
    navigator.clipboard.writeText(snippet.command)
    term.writeln(
      `\r\n\x1b[90m[CLIPBOARD]\x1b[0m Disalin: \x1b[36m${snippet.command}\x1b[0m`
    )
    writeLocalPrompt()
  }

  const handleCopyTerminal = () => {
    const term = xtermRef.current
    if (!term) return
    const selected = term.getSelection()
    if (selected) {
      navigator.clipboard.writeText(selected)
    } else {
      term.selectAll()
      const all = term.getSelection()
      term.clearSelection()
      navigator.clipboard.writeText(all)
    }
    setCopiedOutput(true)
    setTimeout(() => setCopiedOutput(false), 1800)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Header & Status */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-heading text-2xl font-black tracking-tight text-balance text-foreground sm:text-3xl">
              Web Terminal VPS (Xterm.js)
            </h1>
            <Badge
              variant="outline"
              className={`font-mono text-[11px] font-bold tracking-wider ${
                status === "connected"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : status === "connecting"
                    ? "border-sky-500/50 bg-sky-500/10 text-sky-500"
                    : status === "error"
                      ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
                      : "border-border bg-secondary-background text-muted-foreground"
              }`}
            >
              {status === "connected"
                ? `SSH LIVE • ${transportMode.toUpperCase()}`
                : status === "connecting"
                  ? "MENGHUBUNGKAN..."
                  : status === "error"
                    ? "KONEKSI GAGAL"
                    : "TELEMETRY SHELL READY"}
            </Badge>
          </div>
          <p className="max-w-3xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
            Akses konsol SSH Linux interaktif berbasis Xterm.js langsung dari browser
            hanya ke server VPS yang menjadi hak akses akun{" "}
            <span className="font-mono font-semibold text-foreground">
              {currentEmail}
            </span>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href="/node"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "border-2 border-border font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)]",
            })}
          >
            <Server className="mr-1.5 size-3.5" />
            Kelola Node VPS ({nodes.length})
          </Link>
        </div>
      </div>

      {/* 2. Empty State if no scoped VPS nodes */}
      {nodes.length === 0 ? (
        <Card className="border-2 border-amber-500/50 bg-amber-500/5 shadow-[4px_4px_0px_0px_var(--border)]">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-base border-2 border-border bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-5" />
              </div>
              <div className="space-y-1">
                <h2 className="font-heading text-base font-bold text-foreground">
                  Belum Ada VPS Node Terdaftar di Akun Anda
                </h2>
                <p className="max-w-2xl font-sans text-xs leading-relaxed text-muted-foreground">
                  Demi isolasi keamanan multi-tenant, Web Terminal SSH hanya mengizinkan
                  koneksi ke node VPS milik Anda sendiri. Daftarkan VPS terlebih dahulu di
                  halaman Server Nodes atau minta Admin menugaskan node ke akun Anda.
                </p>
              </div>
            </div>
            <Link
              href="/node"
              className={buttonVariants({
                className:
                  "shrink-0 border-2 border-border bg-main font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90",
              })}
            >
              Daftarkan VPS Sekarang
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {/* 3. Connection Control Bar */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TerminalSquare className="size-4 text-main" />
              <CardTitle className="font-heading text-sm font-black tracking-tight text-foreground sm:text-base">
                Konfigurasi Sesi SSH Target
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedNode && isVirtualBoxLikeNode(selectedNode) && (
                <button
                  type="button"
                  onClick={applyVirtualBoxPreset}
                  className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-sky-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
                >
                  <Sparkles className="size-3" />
                  Preset VirtualBox NAT (127.0.0.1:2222)
                </button>
              )}
              <Badge
                variant="outline"
                className="border-border font-mono text-[10px] font-bold tracking-wider uppercase"
              >
                <ShieldCheck className="mr-1 size-3 text-emerald-500" />
                Tenant Scoped
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
              {/* Target VPS Selector */}
              <div className="space-y-1.5 lg:col-span-3">
                <label className="block font-sans text-xs font-semibold text-foreground">
                  Pilih Server VPS
                </label>
                <select
                  value={selectedNodeId}
                  onChange={(e) => handleSelectNode(e.target.value)}
                  disabled={status === "connected"}
                  className={selectClass}
                >
                  {nodes.length === 0 ? (
                    <option value="">-- Belum ada VPS --</option>
                  ) : (
                    nodes.map((node) => (
                      <option key={node.node_id} value={node.node_id}>
                        {node.hostname} ({node.ip_v4})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Host */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="block font-sans text-xs font-semibold text-foreground">
                  Host / IP SSH
                </label>
                <Input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="103.x.x.x / 127.0.0.1"
                  disabled={status === "connected"}
                  className={inputClass}
                />
              </div>

              {/* Port */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="block font-sans text-xs font-semibold text-foreground">
                  Port
                </label>
                <Input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  min={1}
                  max={65535}
                  disabled={status === "connected"}
                  className={`${inputClass} tabular-nums`}
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="block font-sans text-xs font-semibold text-foreground">
                  Username SSH
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="roby / programmer / root"
                  disabled={status === "connected"}
                  className={inputClass}
                />
              </div>

              {/* Transport Mode */}
              <div className="space-y-1.5 lg:col-span-3">
                <label className="block font-sans text-xs font-semibold text-foreground">
                  Mode Transport
                </label>
                <select
                  value={transportMode}
                  onChange={(e) =>
                    setTransportMode(e.target.value as TerminalTransportMode)
                  }
                  disabled={status === "connected"}
                  className={selectClass}
                >
                  <option value="pty">Interactive PTY (Live Stream)</option>
                  <option value="command">Command Mode (Serverless-Safe)</option>
                </select>
              </div>
            </div>

            {/* Auth Credentials + Connect Action */}
            <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-12">
              <div className="space-y-1.5 lg:col-span-3">
                <label className="block font-sans text-xs font-semibold text-foreground">
                  Metode Otentikasi
                </label>
                <div className="grid grid-cols-2 gap-1.5 rounded-base border-2 border-border bg-muted/20 p-1">
                  <button
                    type="button"
                    disabled={status === "connected"}
                    onClick={() => setAuthMethod("password")}
                    className={`flex items-center justify-center gap-1.5 rounded px-2 py-1.5 font-mono text-xs font-bold transition-colors ${
                      authMethod === "password"
                        ? "bg-main text-black"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Lock className="size-3" />
                    Password
                  </button>
                  <button
                    type="button"
                    disabled={status === "connected"}
                    onClick={() => setAuthMethod("key")}
                    className={`flex items-center justify-center gap-1.5 rounded px-2 py-1.5 font-mono text-xs font-bold transition-colors ${
                      authMethod === "key"
                        ? "bg-main text-black"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <KeyRound className="size-3" />
                    SSH Key
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 lg:col-span-6">
                <label className="block font-sans text-xs font-semibold text-foreground">
                  {authMethod === "password"
                    ? "Password SSH (Ephemeral — Tidak Disimpan di Server)"
                    : "Private Key OpenSSH / PEM"}
                </label>
                {authMethod === "password" ? (
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password SSH user VPS..."
                      disabled={status === "connected"}
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
                      title={showPassword ? "Sembunyikan" : "Tampilkan"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <textarea
                    rows={2}
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    disabled={status === "connected"}
                    placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                    className="w-full rounded-base border-2 border-border bg-background p-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-main focus:outline-hidden"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:col-span-3 lg:justify-end">
                {status === "connected" ? (
                  <Button
                    type="button"
                    onClick={handleDisconnect}
                    className="h-9 w-full border-2 border-border bg-rose-500 font-mono text-xs font-bold text-white shadow-[2px_2px_0px_0px_var(--border)] hover:bg-rose-600 lg:w-auto"
                  >
                    <Unplug className="mr-1.5 size-3.5" />
                    Putuskan Sesi
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={status === "connecting" || nodes.length === 0}
                    className="h-9 w-full border-2 border-border bg-main font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-0.5 hover:translate-y-0.5 lg:w-auto"
                  >
                    {status === "connecting" ? (
                      <>
                        <RefreshCw className="mr-1.5 size-3.5 animate-spin" />
                        Menyambung...
                      </>
                    ) : (
                      <>
                        <Plug className="mr-1.5 size-3.5" />
                        Hubungkan SSH
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-base border-2 border-rose-500/50 bg-rose-500/10 p-3 font-mono text-xs text-rose-500">
                {errorMessage}
              </div>
            )}

            {isVercelCloud && (
              <div className="rounded-base border-2 border-sky-500/40 bg-sky-500/10 px-3 py-2 font-mono text-[11px] text-sky-700 dark:text-sky-300">
                Catatan Runtime Cloud: Saat berjalan di Vercel Serverless, gunakan{" "}
                <strong>Command Mode (Serverless-Safe)</strong> untuk VPS ber-IP publik.
                Untuk mengakses VM VirtualBox lokal (<code>127.0.0.1:2222</code>), buka
                Pasax Web dari host lokal Anda.
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* 4. Quick Security Snippets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Quick Commands:
        </span>
        {QUICK_SNIPPETS.map((snippet) => (
          <button
            key={snippet.label}
            type="button"
            onClick={() => handleRunSnippet(snippet)}
            title={`${snippet.description} — ${snippet.command}`}
            className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-transform hover:-translate-y-0.5 hover:border-main"
          >
            <span className="text-main">$</span>
            <span>{snippet.label}</span>
          </button>
        ))}
      </div>

      {/* 5. Xterm.js Interactive Canvas Frame */}
      <Card
        className={`overflow-hidden border-2 border-border bg-[#090d16] shadow-[4px_4px_0px_0px_var(--border)] ${
          isFullscreen ? "fixed inset-3 z-50 flex flex-col" : ""
        }`}
      >
        {/* Terminal Titlebar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-800 bg-slate-950 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-500" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="min-w-0 truncate font-mono text-xs font-bold text-slate-200">
              {status === "connected"
                ? `${username}@${host}:${port} (${selectedNode?.hostname || "VPS"})`
                : `pasax-xterm • ${selectedNode ? `${selectedNode.hostname} (${selectedNode.ip_v4})` : "Local Console"}`}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className="hidden rounded border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-400 tabular-nums sm:inline-block">
              {dimensions.cols}x{dimensions.rows}
            </span>
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.max(10, f - 1))}
              title="Perkecil Font"
              className="rounded border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-sky-500 hover:text-white"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.min(20, f + 1))}
              title="Perbesar Font"
              className="rounded border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-sky-500 hover:text-white"
            >
              <ZoomIn className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCopyTerminal}
              title="Salin Output Terminal"
              className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-[11px] text-slate-300 hover:border-sky-500 hover:text-white"
            >
              {copiedOutput ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span className="hidden sm:inline">
                {copiedOutput ? "Tersalin" : "Salin"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                xtermRef.current?.clear()
                writeLocalPrompt()
              }}
              title="Bersihkan Terminal"
              className="rounded border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-amber-400 hover:text-white"
            >
              <Trash2 className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
              className="rounded border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-sky-500 hover:text-white"
            >
              {isFullscreen ? (
                <Minimize2 className="size-3.5" />
              ) : (
                <Maximize2 className="size-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Xterm.js Container */}
        <div
          className={`w-full overflow-hidden bg-[#090d16] p-2.5 sm:p-3 ${
            isFullscreen ? "flex-1" : "h-[430px] sm:h-[490px]"
          }`}
        >
          <div
            ref={terminalHostRef}
            data-testid="xterm-container"
            className="h-full w-full"
          />
        </div>
      </Card>
    </div>
  )
}
