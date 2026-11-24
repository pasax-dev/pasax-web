import crypto from "node:crypto"
import { Client, type ClientChannel } from "ssh2"

export interface SshSessionEntry {
  id: string
  ownerEmail: string
  nodeId: string
  hostname: string
  host: string
  port: number
  username: string
  client: Client
  stream: ClientChannel
  backlog: string
  closed: boolean
  createdAt: number
  lastActivityAt: number
  listeners: Set<(chunk: string) => void>
  closeListeners: Set<(reason: string) => void>
}

export interface SshConnectParams {
  ownerEmail: string
  nodeId: string
  hostname: string
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  cols?: number
  rows?: number
}

const MAX_BACKLOG_CHARS = 64_000
const IDLE_TIMEOUT_MS = 15 * 60 * 1000
const MAX_SESSIONS_PER_USER = 5

declare global {
  var __pasaxSshSessions: Map<string, SshSessionEntry> | undefined
}

function getSessionMap(): Map<string, SshSessionEntry> {
  if (!globalThis.__pasaxSshSessions) {
    globalThis.__pasaxSshSessions = new Map<string, SshSessionEntry>()
  }
  return globalThis.__pasaxSshSessions
}

export function validateTargetHost(rawHost: string): { valid: boolean; host: string; reason?: string } {
  const host = rawHost.trim()
  if (!host || host.length > 253) {
    return { valid: false, host, reason: "Host SSH tidak valid." }
  }
  if (/[\s;|&$`<>\\]/.test(host)) {
    return { valid: false, host, reason: "Karakter host SSH tidak diizinkan." }
  }
  // Prevent cloud instance metadata SSRF
  if (
    host === "169.254.169.254" ||
    host.startsWith("169.254.") ||
    host === "0.0.0.0" ||
    host === "::" ||
    host.toLowerCase().includes("metadata.google.internal")
  ) {
    return {
      valid: false,
      host,
      reason: "Target metadata internal atau alamat nol diblokir oleh kebijakan keamanan.",
    }
  }
  return { valid: true, host }
}

export function formatSshErrorMessage(err: unknown, host: string, port: number): string {
  const msg = err instanceof Error ? err.message : String(err)
  const isVercel = process.env.VERCEL === "1"
  const isPrivateOrLocal =
    host === "127.0.0.1" ||
    host === "localhost" ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)

  if (msg.includes("ECONNREFUSED")) {
    if (isVercel && isPrivateOrLocal) {
      return `Koneksi ke ${host}:${port} ditolak dari runtime Vercel Cloud. IP lokal/NAT VirtualBox (${host}) hanya dapat diakses dari Pasax Web lokal (http://localhost:3000/terminal) atau via public SSH tunnel.`
    }
    return `Koneksi SSH ke ${host}:${port} ditolak (ECONNREFUSED). Pastikan sshd aktif dan port ${port} terbuka.`
  }
  if (msg.includes("ETIMEDOUT") || msg.includes("Timed out")) {
    if (isVercel && isPrivateOrLocal) {
      return `Timeout menjangkau ${host}:${port} dari Vercel Cloud. Gunakan IP publik VPS atau jalankan Pasax Web lokal untuk akses VirtualBox NAT (127.0.0.1:2222).`
    }
    return `Koneksi SSH ke ${host}:${port} timeout. Periksa firewall / port forwarding VPS Anda.`
  }
  if (msg.toLowerCase().includes("authentication")) {
    return `Otentikasi SSH ditolak oleh ${host}:${port}. Periksa kembali username dan password atau private key.`
  }
  return `Koneksi SSH gagal (${host}:${port}): ${msg}`
}

function cleanupExpiredSessions() {
  const map = getSessionMap()
  const now = Date.now()
  for (const [id, entry] of map.entries()) {
    if (entry.closed || now - entry.lastActivityAt > IDLE_TIMEOUT_MS) {
      try {
        entry.stream.close()
        entry.client.end()
      } catch {
        // ignore cleanup errors
      }
      map.delete(id)
    }
  }
}

export async function createSshTerminalSession(params: SshConnectParams): Promise<SshSessionEntry> {
  cleanupExpiredSessions()

  const map = getSessionMap()
  const userSessions = Array.from(map.values()).filter(
    (s) => s.ownerEmail === params.ownerEmail && !s.closed
  )
  if (userSessions.length >= MAX_SESSIONS_PER_USER) {
    const oldest = userSessions.sort((a, b) => a.lastActivityAt - b.lastActivityAt)[0]
    if (oldest) {
      closeSshTerminalSession(oldest.id, params.ownerEmail)
    }
  }

  return await new Promise<SshSessionEntry>((resolve, reject) => {
    const client = new Client()
    let settled = false
    const sessionId = `ssh_${crypto.randomUUID()}`

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true
        try {
          client.end()
        } catch {
          // ignore
        }
        reject(new Error("Timed out while establishing SSH connection"))
      }
    }, 8500)

    client.on("ready", () => {
      client.shell(
        {
          term: "xterm-256color",
          cols: Math.max(20, Math.min(300, params.cols || 100)),
          rows: Math.max(10, Math.min(120, params.rows || 28)),
        },
        (err, stream) => {
          clearTimeout(timer)
          if (err || !stream) {
            if (!settled) {
              settled = true
              try {
                client.end()
              } catch {
                // ignore
              }
              reject(err || new Error("Failed to open PTY shell channel"))
            }
            return
          }

          const entry: SshSessionEntry = {
            id: sessionId,
            ownerEmail: params.ownerEmail,
            nodeId: params.nodeId,
            hostname: params.hostname,
            host: params.host,
            port: params.port,
            username: params.username,
            client,
            stream,
            backlog: "",
            closed: false,
            createdAt: Date.now(),
            lastActivityAt: Date.now(),
            listeners: new Set(),
            closeListeners: new Set(),
          }

          const pushOutput = (data: Buffer | string) => {
            const text = typeof data === "string" ? data : data.toString("utf8")
            entry.lastActivityAt = Date.now()
            entry.backlog = (entry.backlog + text).slice(-MAX_BACKLOG_CHARS)
            for (const listener of entry.listeners) {
              listener(text)
            }
          }

          stream.on("data", pushOutput)
          stream.stderr.on("data", pushOutput)

          const handleClose = (reason: string) => {
            if (entry.closed) return
            entry.closed = true
            for (const cb of entry.closeListeners) {
              cb(reason)
            }
            entry.listeners.clear()
            entry.closeListeners.clear()
            setTimeout(() => {
              map.delete(entry.id)
            }, 10_000)
          }

          stream.on("close", () => handleClose("Shell stream closed"))
          client.on("close", () => handleClose("SSH connection closed"))
          client.on("error", (cErr) => handleClose(cErr.message))

          map.set(entry.id, entry)
          if (!settled) {
            settled = true
            resolve(entry)
          }
        }
      )
    })

    client.on("error", (err) => {
      clearTimeout(timer)
      if (!settled) {
        settled = true
        reject(err)
      }
    })

    const connectConfig: Record<string, unknown> = {
      host: params.host,
      port: params.port,
      username: params.username,
      readyTimeout: 8000,
      keepaliveInterval: 15000,
    }
    if (params.privateKey?.trim()) {
      connectConfig.privateKey = params.privateKey.trim()
    } else if (params.password !== undefined) {
      connectConfig.password = params.password
    }

    client.connect(connectConfig as any)
  })
}

export function getSshTerminalSession(
  sessionId: string,
  ownerEmail: string
): SshSessionEntry | null {
  const entry = getSessionMap().get(sessionId)
  if (!entry || entry.ownerEmail !== ownerEmail) {
    return null
  }
  return entry
}

export function writeSshTerminalInput(
  sessionId: string,
  ownerEmail: string,
  data: string
): boolean {
  const entry = getSshTerminalSession(sessionId, ownerEmail)
  if (!entry || entry.closed) return false
  entry.lastActivityAt = Date.now()
  entry.stream.write(data)
  return true
}

export function resizeSshTerminal(
  sessionId: string,
  ownerEmail: string,
  cols: number,
  rows: number
): boolean {
  const entry = getSshTerminalSession(sessionId, ownerEmail)
  if (!entry || entry.closed) return false
  const safeCols = Math.max(20, Math.min(300, Math.round(cols)))
  const safeRows = Math.max(10, Math.min(120, Math.round(rows)))
  entry.stream.setWindow(safeRows, safeCols, 0, 0)
  return true
}

export function closeSshTerminalSession(sessionId: string, ownerEmail: string): boolean {
  const entry = getSshTerminalSession(sessionId, ownerEmail)
  if (!entry) return false
  entry.closed = true
  try {
    entry.stream.close()
  } catch {
    // ignore
  }
  try {
    entry.client.end()
  } catch {
    // ignore
  }
  for (const cb of entry.closeListeners) {
    cb("Disconnected by operator")
  }
  getSessionMap().delete(sessionId)
  return true
}

export async function execSshCommandOnce(params: {
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  command: string
}): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
  return await new Promise((resolve, reject) => {
    const client = new Client()
    let settled = false
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true
        try {
          client.end()
        } catch {
          // ignore
        }
        reject(new Error("Timed out executing SSH command"))
      }
    }, 10_000)

    client.on("ready", () => {
      client.exec(params.command, (err, stream) => {
        if (err || !stream) {
          clearTimeout(timer)
          if (!settled) {
            settled = true
            client.end()
            reject(err || new Error("Failed to execute SSH command"))
          }
          return
        }

        let stdout = ""
        let stderr = ""

        stream.on("data", (chunk: Buffer) => {
          if (stdout.length < MAX_BACKLOG_CHARS) {
            stdout += chunk.toString("utf8")
          }
        })
        stream.stderr.on("data", (chunk: Buffer) => {
          if (stderr.length < MAX_BACKLOG_CHARS) {
            stderr += chunk.toString("utf8")
          }
        })
        stream.on("close", (code: number | null) => {
          clearTimeout(timer)
          if (!settled) {
            settled = true
            client.end()
            resolve({ stdout, stderr, exitCode: code })
          }
        })
      })
    })

    client.on("error", (err) => {
      clearTimeout(timer)
      if (!settled) {
        settled = true
        reject(err)
      }
    })

    const connectConfig: Record<string, unknown> = {
      host: params.host,
      port: params.port,
      username: params.username,
      readyTimeout: 8000,
    }
    if (params.privateKey?.trim()) {
      connectConfig.privateKey = params.privateKey.trim()
    } else if (params.password !== undefined) {
      connectConfig.password = params.password
    }

    client.connect(connectConfig as any)
  })
}
