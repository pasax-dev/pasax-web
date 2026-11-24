"use client"

import * as React from "react"
import Link from "next/link"
import "@xterm/xterm/css/xterm.css"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { SavedSshProfile } from "@/lib/pasax-cloud"
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
  Plus,
  Pencil,
  CheckCircle2,
  Database,
  X,
} from "lucide-react"

interface SshProfileEntitlement {
  allowed: boolean
  plan: string
  maxProfiles: number
  reason?: string
}

interface TerminalClientProps {
  nodes: NodeTelemetry[]
  savedProfiles: SavedSshProfile[]
  entitlement: SshProfileEntitlement
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

function getDefaultUsername(
  node: NodeTelemetry | undefined,
  role: string
): string {
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

function isPrivateOrLocalHost(host: string): boolean {
  const trimmed = host.trim()
  return (
    trimmed === "127.0.0.1" ||
    trimmed === "localhost" ||
    trimmed.startsWith("10.") ||
    trimmed.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(trimmed)
  )
}

export function TerminalClient({
  nodes = [],
  savedProfiles = [],
  entitlement,
  initialNodeId,
  currentRole,
  currentEmail,
  isVercelCloud = false,
}: TerminalClientProps) {
  // Saved SSH configurations persisted in Neon PostgreSQL via pasax-service
  const [profiles, setProfiles] =
    React.useState<SavedSshProfile[]>(savedProfiles)

  const initialMatchedProfile = React.useMemo(() => {
    if (initialNodeId) {
      const byNode = savedProfiles.find((p) => p.nodeId === initialNodeId)
      if (byNode) return byNode
    }
    return savedProfiles[0] || undefined
  }, [savedProfiles, initialNodeId])

  const [selectedProfileId, setSelectedProfileId] = React.useState<string>(
    initialMatchedProfile?.id || ""
  )

  const selectedProfile = React.useMemo(
    () => profiles.find((p) => p.id === selectedProfileId),
    [profiles, selectedProfileId]
  )

  const selectedProfileNode = React.useMemo(() => {
    if (!selectedProfile?.nodeId) return undefined
    return nodes.find((n) => n.node_id === selectedProfile.nodeId)
  }, [nodes, selectedProfile])

  // Ephemeral credential override when selected saved profile does not store secret
  const [ephemeralSecret, setEphemeralSecret] = React.useState<string>("")
  const [showEphemeralSecret, setShowEphemeralSecret] = React.useState(false)
  const [transportOverride, setTransportOverride] =
    React.useState<TerminalTransportMode>(
      initialMatchedProfile?.transportMode ||
        (isVercelCloud ? "command" : "pty")
    )

  // Add / Edit Profile Form State
  const defaultDraftNode =
    nodes.find((n) => n.node_id === initialNodeId) || nodes[0] || undefined
  const shouldAutoOpenForm =
    savedProfiles.length === 0 ||
    (Boolean(initialNodeId) && !initialMatchedProfile)

  const [showProfileForm, setShowProfileForm] = React.useState<boolean>(
    shouldAutoOpenForm && entitlement.allowed
  )
  const [editingProfileId, setEditingProfileId] = React.useState<string | null>(
    null
  )
  const [formNodeId, setFormNodeId] = React.useState<string>(
    defaultDraftNode?.node_id || ""
  )
  const [formLabel, setFormLabel] = React.useState<string>(() => {
    if (!defaultDraftNode) return ""
    const user = getDefaultUsername(defaultDraftNode, currentRole)
    return `${defaultDraftNode.hostname} (${user})`
  })
  const [formHost, setFormHost] = React.useState<string>(
    isVirtualBoxLikeNode(defaultDraftNode) && !isVercelCloud
      ? "127.0.0.1"
      : defaultDraftNode?.ip_v4 || ""
  )
  const [formPort, setFormPort] = React.useState<string>(
    isVirtualBoxLikeNode(defaultDraftNode) && !isVercelCloud
      ? "2222"
      : String(defaultDraftNode?.ssh_port || 22)
  )
  const [formUsername, setFormUsername] = React.useState<string>(
    getDefaultUsername(defaultDraftNode, currentRole)
  )
  const [formTransportMode, setFormTransportMode] =
    React.useState<TerminalTransportMode>(isVercelCloud ? "command" : "pty")
  const [formAuthMethod, setFormAuthMethod] = React.useState<
    "password" | "key"
  >("password")
  const [formPassword, setFormPassword] = React.useState<string>("")
  const [formPrivateKey, setFormPrivateKey] = React.useState<string>("")
  const [showFormPassword, setShowFormPassword] = React.useState<boolean>(false)
  const [formSaveSecret, setFormSaveSecret] = React.useState<boolean>(true)
  const [formAllowUnverifiedLocal, setFormAllowUnverifiedLocal] =
    React.useState<boolean>(false)

  const [isSavingProfile, setIsSavingProfile] = React.useState<boolean>(false)
  const [deletingProfileId, setDeletingProfileId] = React.useState<
    string | null
  >(null)
  const [profileFormError, setProfileFormError] = React.useState<string | null>(
    null
  )
  const [profileNotice, setProfileNotice] = React.useState<string | null>(null)

  // Terminal Runtime State
  const [status, setStatus] = React.useState<ConnectionStatus>("idle")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [sessionId, setSessionId] = React.useState<string | null>(null)
  const [dimensions, setDimensions] = React.useState<{
    cols: number
    rows: number
  }>({
    cols: 100,
    rows: 28,
  })
  const [fontSize, setFontSize] = React.useState<number>(13)
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false)
  const [copiedOutput, setCopiedOutput] = React.useState<boolean>(false)

  // Refs for Xterm.js & live callbacks
  const terminalHostRef = React.useRef<HTMLDivElement | null>(null)
  const xtermRef = React.useRef<any>(null)
  const fitAddonRef = React.useRef<any>(null)
  const eventSourceRef = React.useRef<EventSource | null>(null)

  const statusRef = React.useRef<ConnectionStatus>("idle")
  const modeRef = React.useRef<TerminalTransportMode>(transportOverride)
  const sessionIdRef = React.useRef<string | null>(null)
  const localLineBufferRef = React.useRef<string>("")
  const cmdHistoryRef = React.useRef<string[]>([])
  const cmdHistoryIdxRef = React.useRef<number>(-1)
  const inputQueueRef = React.useRef<Promise<void>>(Promise.resolve())
  const pendingInputBufferRef = React.useRef<string>("")
  const flushTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const connConfigRef = React.useRef({
    profileId: selectedProfile?.id || "",
    nodeId: selectedProfile?.nodeId || "",
    host: selectedProfile?.host || "",
    port: selectedProfile?.port || 22,
    username: selectedProfile?.username || "",
    authMethod: selectedProfile?.authMethod || ("password" as const),
    ephemeralSecret,
  })

  React.useEffect(() => {
    connConfigRef.current = {
      profileId: selectedProfile?.id || "",
      nodeId: selectedProfile?.nodeId || "",
      host: selectedProfile?.host || "",
      port: selectedProfile?.port || 22,
      username: selectedProfile?.username || "",
      authMethod: selectedProfile?.authMethod || "password",
      ephemeralSecret,
    }
  }, [selectedProfile, ephemeralSecret])

  React.useEffect(() => {
    statusRef.current = status
  }, [status])

  React.useEffect(() => {
    modeRef.current = transportOverride
  }, [transportOverride])

  React.useEffect(() => {
    sessionIdRef.current = sessionId
  }, [sessionId])

  const syncResize = React.useCallback(() => {
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
      // ignore fit while container hidden
    }
  }, [])

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
              profileId: cfg.profileId || undefined,
              nodeId: cfg.nodeId || undefined,
              password:
                cfg.authMethod === "password" && cfg.ephemeralSecret
                  ? cfg.ephemeralSecret
                  : undefined,
              privateKey:
                cfg.authMethod === "key" && cfg.ephemeralSecret
                  ? cfg.ephemeralSecret
                  : undefined,
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
              term.write(
                `\r\n\x1b[90m(exit code: ${json.data?.exitCode ?? 0})\x1b[0m`
              )
            }
          }
        } catch (err: any) {
          term.writeln(`\r\n\x1b[31m[NETWORK ERROR]\x1b[0m ${err.message}`)
        }
        writeLocalPrompt()
        return
      }

      // Built-in local Pasax Telemetry Console commands
      term.write("\r\n")
      if (cmd === "help") {
        term.writeln("\x1b[1;36mPasax Local Telemetry Console (Pre-SSH)\x1b[0m")
        term.writeln(
          "  \x1b[33mhelp\x1b[0m      Tampilkan bantuan perintah lokal"
        )
        term.writeln(
          "  \x1b[33mprofiles\x1b[0m  Daftar konfigurasi SSH tersimpan di database"
        )
        term.writeln(
          "  \x1b[33mnodes\x1b[0m     Daftar VPS Node dalam cakupan akun Anda"
        )
        term.writeln(
          "  \x1b[33mstatus\x1b[0m    Ringkasan status target terpilih"
        )
        term.writeln(
          "  \x1b[33mvhosts\x1b[0m    Daftar Virtual Host terdeteksi pada node target"
        )
        term.writeln("  \x1b[33mclear\x1b[0m     Bersihkan layar terminal")
        term.writeln(
          "\x1b[90mTip: Simpan konfigurasi SSH terverifikasi lalu klik 'Hubungkan SSH'.\x1b[0m"
        )
      } else if (cmd === "profiles") {
        if (profiles.length === 0) {
          term.writeln(
            "\x1b[33mBelum ada konfigurasi SSH yang tersimpan dan terverifikasi.\x1b[0m"
          )
        } else {
          profiles.forEach((p, i) => {
            term.writeln(
              `  [${i + 1}] \x1b[1;32m${p.label}\x1b[0m  ${p.username}@${p.host}:${p.port}  (${p.transportMode.toUpperCase()})`
            )
          })
        }
      } else if (cmd === "nodes") {
        if (nodes.length === 0) {
          term.writeln(
            "\x1b[33mBelum ada VPS Node terdaftar pada akun Anda.\x1b[0m"
          )
        } else {
          nodes.forEach((n, i) => {
            term.writeln(
              `  [${i + 1}] \x1b[1;32m${n.hostname}\x1b[0m  IP: ${n.ip_v4}:${n.ssh_port || 22}  Status: ${n.status}  ID: ${n.node_id}`
            )
          })
        }
      } else if (cmd === "status") {
        const node = nodes.find(
          (n) => n.node_id === connConfigRef.current.nodeId
        )
        if (!node) {
          term.writeln(
            "\x1b[33mBelum ada target konfigurasi SSH terpilih.\x1b[0m"
          )
        } else {
          term.writeln(
            `Target   : \x1b[1m${connConfigRef.current.username}@${connConfigRef.current.host}:${connConfigRef.current.port}\x1b[0m`
          )
          term.writeln(`Node VPS : ${node.hostname} (${node.node_id})`)
          term.writeln(`OS       : ${node.os}`)
          term.writeln(
            `Metrics  : CPU ${node.cpu_used_percent}% | RAM ${node.memory_used_percent}% | Status ${node.status}`
          )
        }
      } else if (cmd === "vhosts") {
        const node = nodes.find(
          (n) => n.node_id === connConfigRef.current.nodeId
        )
        const vhosts = [
          ...(node?.webservers?.nginx?.vhosts || []),
          ...(node?.webservers?.apache2?.vhosts || []),
        ]
        if (vhosts.length === 0) {
          term.writeln(
            "\x1b[90mBelum ada VHost terdeteksi pada node ini.\x1b[0m"
          )
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
    [nodes, profiles, writeLocalPrompt]
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

  // Mount Xterm.js strictly in browser (never unmount when toggling fullscreen)
  React.useEffect(() => {
    let disposed = false
    let resizeObserver: ResizeObserver | null = null
    let termInstance: any = null

    const initTerminal = async () => {
      if (!terminalHostRef.current) return
      const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all(
        [
          import("@xterm/xterm"),
          import("@xterm/addon-fit"),
          import("@xterm/addon-web-links"),
        ]
      )

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

      term.writeln(
        "\x1b[1;36m╔══════════════════════════════════════════════════════════════╗\x1b[0m"
      )
      term.writeln(
        "\x1b[1;36m║  PASAX CLOUD SOC — WEB SSH TERMINAL (XTERM.JS ENGINE)       ║\x1b[0m"
      )
      term.writeln(
        "\x1b[1;36m╚══════════════════════════════════════════════════════════════╝\x1b[0m"
      )
      term.writeln(
        `\x1b[90mOperator:\x1b[0m ${currentEmail} (${currentRole})  |  \x1b[90mSaved SSH:\x1b[0m ${savedProfiles.length} profil`
      )
      term.writeln(
        "\x1b[90mKetik 'help' untuk perintah lokal atau pilih profil tersimpan lalu klik 'Hubungkan SSH'.\x1b[0m"
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
            localLineBufferRef.current = ""
            term.write("^C")
            writeLocalPrompt()
            return
          }
          if (ch === "\u000c") {
            term.clear()
            writeLocalPrompt()
            return
          }
          if (ch === "\u007f" || ch === "\b") {
            if (localLineBufferRef.current.length > 0) {
              localLineBufferRef.current = localLineBufferRef.current.slice(
                0,
                -1
              )
              term.write("\b \b")
            }
            continue
          }
          if (data === "\x1b[A") {
            const nextIdx = cmdHistoryIdxRef.current + 1
            if (nextIdx < cmdHistoryRef.current.length) {
              while (localLineBufferRef.current.length > 0) {
                localLineBufferRef.current = localLineBufferRef.current.slice(
                  0,
                  -1
                )
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
            const prevIdx = cmdHistoryIdxRef.current - 1
            while (localLineBufferRef.current.length > 0) {
              localLineBufferRef.current = localLineBufferRef.current.slice(
                0,
                -1
              )
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
      window.removeEventListener("resize", syncResize)
      resizeObserver?.disconnect()
      eventSourceRef.current?.close()
      termInstance?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync font size, body scroll lock, and terminal dimensions on fullscreen / font toggle
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isFullscreen ? "hidden" : ""
    }
    if (xtermRef.current) {
      xtermRef.current.options.fontSize = fontSize
    }
    const rafId = requestAnimationFrame(() => syncResize())
    const timerId = setTimeout(() => syncResize(), 70)
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timerId)
      if (typeof document !== "undefined") {
        document.body.style.overflow = ""
      }
    }
  }, [fontSize, isFullscreen, syncResize])

  // Keep selected profile coherent if profiles list changes
  React.useEffect(() => {
    if (profiles.length === 0) {
      setSelectedProfileId("")
      return
    }
    if (!profiles.some((p) => p.id === selectedProfileId)) {
      const next = profiles[0]
      setSelectedProfileId(next.id)
      setTransportOverride(next.transportMode)
    }
  }, [profiles, selectedProfileId])

  const handleSelectSavedProfile = (profileId: string) => {
    setSelectedProfileId(profileId)
    setEphemeralSecret("")
    setErrorMessage(null)
    const found = profiles.find((p) => p.id === profileId)
    if (found) {
      setTransportOverride(found.transportMode)
    }
  }

  const openAddForm = () => {
    const baseNode =
      nodes.find((n) => n.node_id === formNodeId) || nodes[0] || undefined
    const isVBox = isVirtualBoxLikeNode(baseNode)
    const nextUser = getDefaultUsername(baseNode, currentRole)
    setEditingProfileId(null)
    setFormNodeId(baseNode?.node_id || "")
    setFormUsername(nextUser)
    setFormHost(isVBox && !isVercelCloud ? "127.0.0.1" : baseNode?.ip_v4 || "")
    setFormPort(
      isVBox && !isVercelCloud ? "2222" : String(baseNode?.ssh_port || 22)
    )
    setFormLabel(baseNode ? `${baseNode.hostname} (${nextUser})` : "")
    setFormTransportMode(isVercelCloud ? "command" : "pty")
    setFormAuthMethod("password")
    setFormPassword("")
    setFormPrivateKey("")
    setFormSaveSecret(true)
    setFormAllowUnverifiedLocal(false)
    setProfileFormError(null)
    setShowProfileForm(true)
  }

  const openEditForm = (profile: SavedSshProfile) => {
    setEditingProfileId(profile.id)
    setFormNodeId(profile.nodeId || nodes[0]?.node_id || "")
    setFormLabel(profile.label)
    setFormHost(profile.host)
    setFormPort(String(profile.port))
    setFormUsername(profile.username)
    setFormTransportMode(profile.transportMode)
    setFormAuthMethod(profile.authMethod)
    setFormPassword("")
    setFormPrivateKey("")
    setFormSaveSecret(profile.hasSecret)
    setFormAllowUnverifiedLocal(false)
    setProfileFormError(null)
    setShowProfileForm(true)
  }

  const handleFormNodeChange = (nodeId: string) => {
    setFormNodeId(nodeId)
    const node = nodes.find((n) => n.node_id === nodeId)
    if (!node || editingProfileId) return
    const isVBox = isVirtualBoxLikeNode(node)
    const nextUser = getDefaultUsername(node, currentRole)
    setFormHost(isVBox && !isVercelCloud ? "127.0.0.1" : node.ip_v4)
    setFormPort(isVBox && !isVercelCloud ? "2222" : String(node.ssh_port || 22))
    setFormUsername(nextUser)
    setFormLabel(`${node.hostname} (${nextUser})`)
  }

  const applyVirtualBoxPreset = () => {
    const nextUser =
      currentRole === "Programmer"
        ? "programmer"
        : currentRole === "DevOps"
          ? "maintainer"
          : "roby"
    setFormHost("127.0.0.1")
    setFormPort("2222")
    setFormUsername(nextUser)
    if (!editingProfileId) {
      const node = nodes.find((n) => n.node_id === formNodeId)
      setFormLabel(`${node?.hostname || "VirtualBox-VM"} (${nextUser})`)
    }
    setProfileFormError(null)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileFormError(null)
    setProfileNotice(null)

    if (!formNodeId) {
      setProfileFormError("Pilih Server VPS terdaftar untuk konfigurasi ini.")
      return
    }
    if (!formLabel.trim()) {
      setProfileFormError("Nama / label konfigurasi wajib diisi.")
      return
    }
    if (!formHost.trim() || !formUsername.trim()) {
      setProfileFormError("Host / IP SSH dan Username wajib diisi.")
      return
    }
    const isEdit = Boolean(editingProfileId)
    const editingTarget = editingProfileId
      ? profiles.find((p) => p.id === editingProfileId)
      : undefined
    const hasNewSecret =
      formAuthMethod === "key"
        ? formPrivateKey.trim().length > 0
        : formPassword.length > 0

    if (!isEdit && !hasNewSecret) {
      setProfileFormError(
        formAuthMethod === "key"
          ? "Tempelkan Private Key SSH agar koneksi dapat diuji sebelum disimpan."
          : "Masukkan Password SSH agar koneksi dapat diuji sebelum disimpan."
      )
      return
    }
    if (isEdit && !editingTarget?.hasSecret && !hasNewSecret) {
      setProfileFormError(
        "Profil ini belum menyimpan kredensial. Masukkan password/key untuk memverifikasi perubahan."
      )
      return
    }

    setIsSavingProfile(true)
    try {
      const res = await fetch("/api/admin/terminal/profiles", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEdit ? { id: editingProfileId } : {}),
          nodeId: formNodeId,
          label: formLabel.trim(),
          host: formHost.trim(),
          port: Number(formPort || 22),
          username: formUsername.trim(),
          authMethod: formAuthMethod,
          transportMode: formTransportMode,
          password: formAuthMethod === "password" ? formPassword : undefined,
          privateKey: formAuthMethod === "key" ? formPrivateKey : undefined,
          saveSecret: formSaveSecret,
          clearSecret: isEdit && !formSaveSecret,
          allowUnverifiedLocal: formAllowUnverifiedLocal,
        }),
      })

      const json = await res.json()
      if (!res.ok || json.status !== "success" || !json.data) {
        setProfileFormError(
          json.message ||
            "Koneksi SSH gagal diverifikasi sehingga konfigurasi tidak disimpan."
        )
        return
      }

      const saved = json.data as SavedSshProfile
      setProfiles((prev) => {
        if (isEdit) {
          return prev.map((p) => (p.id === saved.id ? saved : p))
        }
        return [saved, ...prev]
      })
      setSelectedProfileId(saved.id)
      setTransportOverride(saved.transportMode)
      setShowProfileForm(false)
      setEditingProfileId(null)
      setFormPassword("")
      setFormPrivateKey("")
      setProfileNotice(
        isEdit
          ? `Konfigurasi "${saved.label}" berhasil diverifikasi dan diperbarui.`
          : `Konfigurasi "${saved.label}" terverifikasi SSH dan tersimpan di database.`
      )
      xtermRef.current?.writeln(
        `\r\n\x1b[32m[SAVED PROFILE]\x1b[0m ${saved.label} (${saved.username}@${saved.host}:${saved.port})`
      )
      writeLocalPrompt()
    } catch (err: any) {
      setProfileFormError(
        err?.message || "Gagal menghubungi server untuk verifikasi SSH."
      )
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleDeleteProfile = async (profile: SavedSshProfile) => {
    setDeletingProfileId(profile.id)
    setProfileNotice(null)
    setErrorMessage(null)
    try {
      const res = await fetch(
        `/api/admin/terminal/profiles?id=${encodeURIComponent(profile.id)}`,
        { method: "DELETE" }
      )
      const json = await res.json()
      if (!res.ok || json.status !== "success") {
        setErrorMessage(json.message || "Gagal menghapus konfigurasi SSH.")
        return
      }
      if (status === "connected" && selectedProfileId === profile.id) {
        await handleDisconnect()
      }
      setProfiles((prev) => prev.filter((p) => p.id !== profile.id))
      setProfileNotice(`Konfigurasi "${profile.label}" dihapus dari database.`)
    } catch (err: any) {
      setErrorMessage(err?.message || "Gagal menghapus konfigurasi SSH.")
    } finally {
      setDeletingProfileId(null)
    }
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
    xtermRef.current?.writeln(
      "\r\n\x1b[33m[DISCONNECTED] Sesi SSH ditutup oleh operator.\x1b[0m"
    )
    statusRef.current = "idle"
    writeLocalPrompt()
  }

  const handleConnect = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!selectedProfile) {
      setErrorMessage(
        "Pilih atau simpan terlebih dahulu konfigurasi SSH target yang terverifikasi."
      )
      return
    }
    if (!selectedProfile.hasSecret && !ephemeralSecret.trim()) {
      setErrorMessage(
        "Konfigurasi ini tidak menyimpan password/key. Masukkan kredensial sementara di bawah untuk membuka sesi."
      )
      return
    }

    eventSourceRef.current?.close()
    eventSourceRef.current = null
    setErrorMessage(null)
    setStatus("connecting")

    const activeTransport = transportOverride
    modeRef.current = activeTransport
    const term = xtermRef.current
    term?.writeln(
      `\r\n\x1b[36m[SSH] Menghubungkan ke ${selectedProfile.username}@${selectedProfile.host}:${selectedProfile.port} [${selectedProfile.label}] (${activeTransport.toUpperCase()})...\x1b[0m`
    )

    if (activeTransport === "command") {
      try {
        const res = await fetch("/api/admin/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "exec",
            profileId: selectedProfile.id,
            password:
              selectedProfile.authMethod === "password" && ephemeralSecret
                ? ephemeralSecret
                : undefined,
            privateKey:
              selectedProfile.authMethod === "key" && ephemeralSecret
                ? ephemeralSecret
                : undefined,
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
          profileId: selectedProfile.id,
          password:
            selectedProfile.authMethod === "password" && ephemeralSecret
              ? ephemeralSecret
              : undefined,
          privateKey:
            selectedProfile.authMethod === "key" && ephemeralSecret
              ? ephemeralSecret
              : undefined,
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
      term?.writeln(
        `\x1b[32m[SSH PTY LIVE]\x1b[0m Terhubung ke ${json.data.hostname}.`
      )

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
    if (status === "connected" && transportOverride === "pty") {
      enqueuePtyInput(`${snippet.command}\r`)
      term.focus()
      return
    }
    if (status === "connected" && transportOverride === "command") {
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

  const canAddMoreProfiles =
    entitlement.allowed && profiles.length < entitlement.maxProfiles

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
                ? `SSH LIVE • ${transportOverride.toUpperCase()}`
                : status === "connecting"
                  ? "MENGHUBUNGKAN..."
                  : status === "error"
                    ? "KONEKSI GAGAL"
                    : "TELEMETRY SHELL READY"}
            </Badge>
            <Badge
              variant="outline"
              className={`font-mono text-[11px] font-bold ${
                entitlement.allowed
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              <Database className="mr-1 size-3" />
              {entitlement.allowed
                ? `Paket ${entitlement.plan.toUpperCase()} • ${profiles.length}/${entitlement.maxProfiles} Profil`
                : "Langganan Diperlukan"}
            </Badge>
          </div>
          <p className="max-w-3xl font-sans text-sm leading-relaxed text-pretty text-muted-foreground">
            Simpan banyak konfigurasi SSH terverifikasi ke database akun{" "}
            <span className="font-mono font-semibold text-foreground">
              {currentEmail}
            </span>{" "}
            dan akses konsol Linux interaktif langsung dari browser.
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
                  Demi isolasi keamanan multi-tenant, Web Terminal SSH hanya
                  mengizinkan koneksi ke node VPS milik Anda sendiri. Daftarkan
                  VPS terlebih dahulu di halaman Server Nodes atau minta Admin
                  menugaskan node ke akun Anda.
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

      {/* 3. Saved SSH Profiles Target Selector & Control Bar */}
      <Card className="border-2 shadow-[4px_4px_0px_0px_var(--border)]">
        <CardHeader className="border-b-2 border-border/80 bg-muted/20 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TerminalSquare className="size-4 text-main" />
              <CardTitle className="font-heading text-sm font-black tracking-tight text-foreground sm:text-base">
                Konfigurasi Sesi SSH Target
              </CardTitle>
              <Badge
                variant="outline"
                className="border-border font-mono text-[10px] font-bold tracking-wider uppercase"
              >
                <ShieldCheck className="mr-1 size-3 text-emerald-500" />
                Saved &amp; Verified Only ({profiles.length})
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {entitlement.allowed ? (
                <Button
                  type="button"
                  size="sm"
                  variant={showProfileForm ? "outline" : "default"}
                  disabled={
                    status === "connected" ||
                    (!showProfileForm && !canAddMoreProfiles)
                  }
                  onClick={() => {
                    if (showProfileForm) {
                      setShowProfileForm(false)
                      setEditingProfileId(null)
                      setProfileFormError(null)
                    } else {
                      openAddForm()
                    }
                  }}
                  className={
                    showProfileForm
                      ? "h-8 border-2 border-border font-mono text-xs font-bold shadow-[2px_2px_0px_0px_var(--border)]"
                      : "h-8 border-2 border-border bg-main font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-main/90"
                  }
                >
                  {showProfileForm ? (
                    <>
                      <X className="mr-1.5 size-3.5" />
                      Tutup Form
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1.5 size-3.5" />
                      Tambah Konfigurasi
                    </>
                  )}
                </Button>
              ) : (
                <Link
                  href="/billing"
                  className={buttonVariants({
                    size: "sm",
                    className:
                      "h-8 border-2 border-border bg-amber-400 font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_var(--border)]",
                  })}
                >
                  Aktifkan Langganan Pro
                </Link>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4 sm:p-5">
          {profileNotice && (
            <div className="flex items-center gap-2 rounded-base border-2 border-emerald-500/40 bg-emerald-500/10 px-3 py-2 font-mono text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{profileNotice}</span>
            </div>
          )}

          {!entitlement.allowed && entitlement.reason && (
            <div className="rounded-base border-2 border-amber-500/50 bg-amber-500/10 px-3 py-2.5 font-sans text-xs text-amber-700 dark:text-amber-300">
              {entitlement.reason}
            </div>
          )}

          {/* Active Saved-Only Connection Selector */}
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-12">
              <div className="space-y-1.5 lg:col-span-6">
                <label className="block font-sans text-xs font-semibold text-foreground">
                  Pilih Server Target (Konfigurasi SSH Tersimpan &amp;
                  Terverifikasi)
                </label>
                <select
                  data-testid="saved-profile-select"
                  value={selectedProfileId}
                  onChange={(e) => handleSelectSavedProfile(e.target.value)}
                  disabled={status === "connected" || profiles.length === 0}
                  className={selectClass}
                >
                  {profiles.length === 0 ? (
                    <option value="">
                      -- Belum ada konfigurasi SSH tersimpan --
                    </option>
                  ) : (
                    profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label} — {p.username}@{p.host}:{p.port} (
                        {p.transportMode.toUpperCase()})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5 lg:col-span-3">
                <label className="block font-sans text-xs font-semibold text-foreground">
                  Mode Transport Sesi
                </label>
                <select
                  value={transportOverride}
                  onChange={(e) =>
                    setTransportOverride(
                      e.target.value as TerminalTransportMode
                    )
                  }
                  disabled={status === "connected" || !selectedProfile}
                  className={selectClass}
                >
                  <option value="pty">Interactive PTY (Live Stream)</option>
                  <option value="command">
                    Command Mode (Serverless-Safe)
                  </option>
                </select>
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
                    data-testid="connect-ssh-btn"
                    disabled={status === "connecting" || !selectedProfile}
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

            {/* Saved Profile Cards Strip */}
            {profiles.length > 0 && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {profiles.map((profile) => {
                  const isActive = profile.id === selectedProfileId
                  const linkedNode = nodes.find(
                    (n) => n.node_id === profile.nodeId
                  )
                  return (
                    <div
                      key={profile.id}
                      data-testid={`saved-profile-card-${profile.id}`}
                      className={`flex flex-col justify-between gap-2.5 rounded-base border-2 p-3 transition-colors ${
                        isActive
                          ? "border-main bg-main/10 shadow-[2px_2px_0px_0px_var(--border)]"
                          : "border-border bg-secondary-background/60 hover:border-foreground/40"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={status === "connected"}
                        onClick={() => handleSelectSavedProfile(profile.id)}
                        className="min-w-0 text-left disabled:opacity-70"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-heading text-xs font-black text-foreground">
                            {profile.label}
                          </span>
                          <Badge
                            variant="outline"
                            className={`shrink-0 font-mono text-[10px] font-bold ${
                              profile.verifiedAt
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                            }`}
                          >
                            {profile.verifiedAt ? "Verified" : "Local Preset"}
                          </Badge>
                        </div>
                        <div className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
                          {profile.username}@{profile.host}:{profile.port}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                          <span className="rounded border border-border bg-background px-1.5 py-0.5">
                            {linkedNode?.hostname || "VPS Node"}
                          </span>
                          <span className="rounded border border-border bg-background px-1.5 py-0.5">
                            {profile.hasSecret
                              ? "Secret Tersimpan"
                              : "Secret Ephemeral"}
                          </span>
                          <span className="rounded border border-border bg-background px-1.5 py-0.5 uppercase">
                            {profile.transportMode}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center justify-end gap-1.5 border-t border-border/60 pt-2">
                        <button
                          type="button"
                          disabled={status === "connected"}
                          onClick={() => openEditForm(profile)}
                          className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1 font-mono text-[10px] font-semibold text-foreground hover:border-main disabled:opacity-50"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={
                            deletingProfileId === profile.id ||
                            (status === "connected" && isActive)
                          }
                          onClick={() => void handleDeleteProfile(profile)}
                          className="inline-flex items-center gap-1 rounded border border-rose-500/40 bg-rose-500/10 px-2 py-1 font-mono text-[10px] font-semibold text-rose-600 hover:bg-rose-500/20 disabled:opacity-50 dark:text-rose-400"
                        >
                          <Trash2 className="size-3" />
                          {deletingProfileId === profile.id
                            ? "Menghapus..."
                            : "Hapus"}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Ephemeral credential prompt only if selected profile chose not to store secret */}
            {selectedProfile && !selectedProfile.hasSecret && (
              <div className="rounded-base border-2 border-amber-500/40 bg-amber-500/5 p-3">
                <label className="mb-1.5 block font-sans text-xs font-semibold text-foreground">
                  {selectedProfile.authMethod === "key"
                    ? `Private Key SSH sementara untuk ${selectedProfile.label}`
                    : `Password SSH sementara untuk ${selectedProfile.label} (tidak tersimpan di DB)`}
                </label>
                {selectedProfile.authMethod === "key" ? (
                  <textarea
                    rows={2}
                    value={ephemeralSecret}
                    onChange={(e) => setEphemeralSecret(e.target.value)}
                    disabled={status === "connected"}
                    placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                    className="w-full rounded-base border-2 border-border bg-background p-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-main focus:outline-hidden"
                  />
                ) : (
                  <div className="relative">
                    <Input
                      type={showEphemeralSecret ? "text" : "password"}
                      value={ephemeralSecret}
                      onChange={(e) => setEphemeralSecret(e.target.value)}
                      placeholder="Masukkan password SSH..."
                      disabled={status === "connected"}
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEphemeralSecret((p) => !p)}
                      className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showEphemeralSecret ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedProfile && selectedProfileNode && (
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono">
                  Target aktif:{" "}
                  <strong className="text-foreground">
                    {selectedProfile.username}@{selectedProfile.host}:
                    {selectedProfile.port}
                  </strong>
                </span>
                <span>•</span>
                <span className="font-mono">
                  Node: {selectedProfileNode.hostname} ({selectedProfileNode.os}
                  )
                </span>
                {selectedProfile.verifiedAt && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      Terverifikasi SSH
                    </span>
                  </>
                )}
              </div>
            )}

            {errorMessage && (
              <div className="rounded-base border-2 border-rose-500/50 bg-rose-500/10 p-3 font-mono text-xs text-rose-500">
                {errorMessage}
              </div>
            )}
          </form>

          {/* Add / Edit SSH Configuration Drawer */}
          {showProfileForm && (
            <form
              onSubmit={handleSaveProfile}
              data-testid="ssh-profile-form"
              className="space-y-4 rounded-base border-2 border-border bg-secondary-background/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-2.5">
                <div>
                  <h3 className="font-heading text-sm font-black text-foreground">
                    {editingProfileId
                      ? "Edit & Verifikasi Ulang Konfigurasi SSH"
                      : "Tambah & Verifikasi Konfigurasi SSH Baru"}
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground">
                    Konfigurasi diuji langsung ke VPS via SSH handshake dan
                    hanya disimpan ke database jika verifikasi berhasil.
                  </p>
                </div>
                {isVirtualBoxLikeNode(
                  nodes.find((n) => n.node_id === formNodeId)
                ) && (
                  <button
                    type="button"
                    onClick={applyVirtualBoxPreset}
                    className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-sky-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
                  >
                    <Sparkles className="size-3" />
                    Preset VirtualBox NAT (127.0.0.1:2222)
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                <div className="space-y-1.5 lg:col-span-3">
                  <label className="block font-sans text-xs font-semibold text-foreground">
                    Label Konfigurasi
                  </label>
                  <Input
                    data-testid="profile-label-input"
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="cth: VirtualBox Admin (roby)"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5 lg:col-span-3">
                  <label className="block font-sans text-xs font-semibold text-foreground">
                    Server VPS Terdaftar
                  </label>
                  <select
                    data-testid="profile-node-select"
                    value={formNodeId}
                    onChange={(e) => handleFormNodeChange(e.target.value)}
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

                <div className="space-y-1.5 lg:col-span-2">
                  <label className="block font-sans text-xs font-semibold text-foreground">
                    Host / IP SSH
                  </label>
                  <Input
                    data-testid="profile-host-input"
                    value={formHost}
                    onChange={(e) => setFormHost(e.target.value)}
                    placeholder="103.x.x.x / 127.0.0.1"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5 lg:col-span-1">
                  <label className="block font-sans text-xs font-semibold text-foreground">
                    Port
                  </label>
                  <Input
                    data-testid="profile-port-input"
                    type="number"
                    value={formPort}
                    onChange={(e) => setFormPort(e.target.value)}
                    min={1}
                    max={65535}
                    className={`${inputClass} tabular-nums`}
                  />
                </div>

                <div className="space-y-1.5 lg:col-span-3">
                  <label className="block font-sans text-xs font-semibold text-foreground">
                    Username SSH &amp; Transport
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      data-testid="profile-username-input"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      placeholder="roby / root"
                      className={inputClass}
                    />
                    <select
                      value={formTransportMode}
                      onChange={(e) =>
                        setFormTransportMode(
                          e.target.value as TerminalTransportMode
                        )
                      }
                      className={selectClass}
                    >
                      <option value="pty">PTY Live</option>
                      <option value="command">Command</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-12">
                <div className="space-y-1.5 lg:col-span-3">
                  <label className="block font-sans text-xs font-semibold text-foreground">
                    Metode Otentikasi
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 rounded-base border-2 border-border bg-background p-1">
                    <button
                      type="button"
                      onClick={() => setFormAuthMethod("password")}
                      className={`flex items-center justify-center gap-1.5 rounded px-2 py-1.5 font-mono text-xs font-bold transition-colors ${
                        formAuthMethod === "password"
                          ? "bg-main text-black"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Lock className="size-3" />
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormAuthMethod("key")}
                      className={`flex items-center justify-center gap-1.5 rounded px-2 py-1.5 font-mono text-xs font-bold transition-colors ${
                        formAuthMethod === "key"
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
                    {formAuthMethod === "password"
                      ? editingProfileId
                        ? "Password SSH (Kosongkan jika tetap gunakan secret tersimpan)"
                        : "Password SSH"
                      : "Private Key OpenSSH / PEM"}
                  </label>
                  {formAuthMethod === "password" ? (
                    <div className="relative">
                      <Input
                        data-testid="profile-password-input"
                        type={showFormPassword ? "text" : "password"}
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder={
                          editingProfileId
                            ? "Kosongkan jika tidak diubah..."
                            : "Masukkan password SSH untuk uji koneksi..."
                        }
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowFormPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showFormPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <textarea
                      rows={2}
                      value={formPrivateKey}
                      onChange={(e) => setFormPrivateKey(e.target.value)}
                      placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                      className="w-full rounded-base border-2 border-border bg-background p-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-main focus:outline-hidden"
                    />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:col-span-3 lg:justify-end">
                  <Button
                    type="submit"
                    data-testid="save-ssh-profile-btn"
                    disabled={isSavingProfile || nodes.length === 0}
                    className="h-9 w-full border-2 border-border bg-emerald-400 font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_var(--border)] hover:bg-emerald-300 lg:w-auto"
                  >
                    {isSavingProfile ? (
                      <>
                        <RefreshCw className="mr-1.5 size-3.5 animate-spin" />
                        Menguji &amp; Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-1.5 size-3.5" />
                        {editingProfileId
                          ? "Verifikasi & Perbarui"
                          : "Uji Koneksi & Simpan"}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <label className="inline-flex cursor-pointer items-center gap-2 font-sans">
                  <input
                    type="checkbox"
                    checked={formSaveSecret}
                    onChange={(e) => setFormSaveSecret(e.target.checked)}
                    className="size-4 rounded border-border accent-main"
                  />
                  <span>
                    Simpan kredensial terenkripsi di database (koneksi 1-klik)
                  </span>
                </label>

                {isVercelCloud && isPrivateOrLocalHost(formHost) && (
                  <label className="inline-flex cursor-pointer items-center gap-2 font-sans text-sky-600 dark:text-sky-400">
                    <input
                      type="checkbox"
                      checked={formAllowUnverifiedLocal}
                      onChange={(e) =>
                        setFormAllowUnverifiedLocal(e.target.checked)
                      }
                      className="size-4 rounded border-border accent-sky-500"
                    />
                    <span>
                      Simpan preset lokal tanpa verifikasi langsung dari Cloud
                    </span>
                  </label>
                )}
              </div>

              {profileFormError && (
                <div
                  data-testid="profile-form-error"
                  className="rounded-base border-2 border-rose-500/50 bg-rose-500/10 p-3 font-mono text-xs text-rose-500"
                >
                  {profileFormError}
                </div>
              )}
            </form>
          )}

          {isVercelCloud && (
            <div className="rounded-base border-2 border-sky-500/40 bg-sky-500/10 px-3 py-2 font-mono text-[11px] text-sky-700 dark:text-sky-300">
              Catatan Runtime Cloud: Saat berjalan di Vercel Serverless, gunakan{" "}
              <strong>Command Mode (Serverless-Safe)</strong> untuk VPS ber-IP
              publik. Untuk mengakses VM VirtualBox lokal (
              <code>127.0.0.1:2222</code>), buka Pasax Web dari host lokal Anda.
            </div>
          )}
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

      {/* 5. Xterm.js Interactive Canvas Frame (Single persistent container, never Card) */}
      <div
        data-testid="terminal-frame"
        className={
          isFullscreen
            ? "fixed inset-0 z-[100] flex h-dvh w-screen flex-col overflow-hidden bg-[#090d16]"
            : "flex flex-col overflow-hidden rounded-base border-2 border-border bg-[#090d16] shadow-[4px_4px_0px_0px_var(--border)]"
        }
      >
        {/* Terminal Titlebar */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b-2 border-slate-800 bg-slate-950 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-500" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="min-w-0 truncate font-mono text-xs font-bold text-slate-200">
              {status === "connected" && selectedProfile
                ? `${selectedProfile.username}@${selectedProfile.host}:${selectedProfile.port} • ${selectedProfile.label}`
                : selectedProfile
                  ? `pasax-xterm • ${selectedProfile.label} (${selectedProfile.username}@${selectedProfile.host}:${selectedProfile.port})`
                  : "pasax-xterm • Local Console"}
            </div>
            {status === "connected" && (
              <span className="hidden rounded border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 sm:inline-block">
                LIVE
              </span>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            {isFullscreen && status === "connected" && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex items-center gap-1 rounded border border-rose-500/50 bg-rose-500/20 px-2.5 py-1 font-mono text-[11px] font-bold text-rose-300 hover:bg-rose-500/30"
              >
                <Unplug className="size-3.5" />
                Putuskan
              </button>
            )}
            <span
              data-testid="terminal-dimensions"
              className="hidden rounded border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-400 tabular-nums sm:inline-block"
            >
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
              data-testid="toggle-fullscreen-btn"
              onClick={() => setIsFullscreen((v) => !v)}
              title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
              className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] font-bold transition-colors ${
                isFullscreen
                  ? "border-sky-400 bg-sky-500/20 text-sky-200 hover:bg-sky-500/30"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-500 hover:text-white"
              }`}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="size-3.5" />
                  <span>Keluar Layar Penuh</span>
                </>
              ) : (
                <>
                  <Maximize2 className="size-3.5" />
                  <span className="hidden sm:inline">Layar Penuh</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Xterm.js Container */}
        <div
          className={`w-full overflow-hidden bg-[#090d16] p-2.5 sm:p-3 ${
            isFullscreen ? "min-h-0 flex-1" : "h-[430px] sm:h-[490px]"
          }`}
        >
          <div
            ref={terminalHostRef}
            data-testid="xterm-container"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}
