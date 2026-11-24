import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { ensureSessionUser, getScopedNodes } from "@/lib/tenant-scope"
import {
  closeSshTerminalSession,
  createSshTerminalSession,
  execSshCommandOnce,
  formatSshErrorMessage,
  getSshTerminalSession,
  resizeSshTerminal,
  validateTargetHost,
  writeSshTerminalInput,
} from "@/lib/ssh-terminal-manager"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)
  if (!ctx) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")

  if (!sessionId) {
    const allNodes = await pasaxCloud.fetchNodes()
    const scopedNodes = getScopedNodes(session, allNodes)
    return NextResponse.json({
      status: "success",
      data: {
        nodesCount: scopedNodes.length,
        isVercelCloud: process.env.VERCEL === "1",
      },
    })
  }

  const sshSession = getSshTerminalSession(sessionId, ctx.email)
  if (!sshSession) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Sesi terminal SSH tidak ditemukan atau bukan milik akun Anda.",
      },
      { status: 404 }
    )
  }

  const encoder = new TextEncoder()

  let cleanupFn: (() => void) | null = null

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const sendEvent = (event: string, payload: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`)
          )
        } catch {
          // stream already closed
        }
      }

      sendEvent("ready", {
        sessionId: sshSession.id,
        hostname: sshSession.hostname,
        host: sshSession.host,
        port: sshSession.port,
        username: sshSession.username,
      })

      if (sshSession.backlog) {
        sendEvent("output", { data: sshSession.backlog })
      }

      if (sshSession.closed) {
        sendEvent("closed", { reason: "Sesi SSH telah berakhir." })
        try {
          controller.close()
        } catch {
          // ignore
        }
        return
      }

      const onData = (chunk: string) => {
        sendEvent("output", { data: chunk })
      }

      const onClose = (reason: string) => {
        sendEvent("closed", { reason })
        cleanup()
        try {
          controller.close()
        } catch {
          // ignore
        }
      }

      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive\n\n`))
        } catch {
          cleanup()
        }
      }, 20_000)

      const cleanup = () => {
        clearInterval(keepAlive)
        sshSession.listeners.delete(onData)
        sshSession.closeListeners.delete(onClose)
      }

      cleanupFn = cleanup
      sshSession.listeners.add(onData)
      sshSession.closeListeners.add(onClose)

      req.signal.addEventListener("abort", cleanup, { once: true })
    },
    cancel() {
      cleanupFn?.()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const ctx = ensureSessionUser(session)
    if (!ctx) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const action = String(body?.action || "")

    if (action === "input") {
      const sessionId = String(body?.sessionId || "")
      const data = typeof body?.data === "string" ? body.data : ""
      if (!sessionId) {
        return NextResponse.json(
          { status: "error", message: "sessionId wajib disertakan." },
          { status: 400 }
        )
      }
      const ok = writeSshTerminalInput(sessionId, ctx.email, data)
      if (!ok) {
        return NextResponse.json(
          {
            status: "error",
            message: "Sesi terminal aktif tidak ditemukan atau sudah terputus.",
          },
          { status: 404 }
        )
      }
      return NextResponse.json({ status: "success" })
    }

    if (action === "resize") {
      const sessionId = String(body?.sessionId || "")
      const cols = Number(body?.cols || 100)
      const rows = Number(body?.rows || 28)
      const ok = resizeSshTerminal(sessionId, ctx.email, cols, rows)
      return NextResponse.json({ status: ok ? "success" : "ignored" })
    }

    if (action === "disconnect") {
      const sessionId = String(body?.sessionId || "")
      closeSshTerminalSession(sessionId, ctx.email)
      return NextResponse.json({ status: "success" })
    }

    if (action === "connect" || action === "exec") {
      const nodeId = String(body?.nodeId || "")
      if (!nodeId) {
        return NextResponse.json(
          { status: "error", message: "Pilih VPS Node tujuan terlebih dahulu." },
          { status: 400 }
        )
      }

      // Enforce multi-tenant VPS node ownership before any network attempt
      const allNodes = await pasaxCloud.fetchNodes()
      const scopedNodes = getScopedNodes(session, allNodes)
      const targetNode = scopedNodes.find((n) => n.node_id === nodeId)

      if (!targetNode) {
        return NextResponse.json(
          {
            status: "error",
            message:
              "Akses ditolak: Anda tidak memiliki izin terminal ke VPS Node ini.",
          },
          { status: 403 }
        )
      }

      const rawHost = String(body?.host || targetNode.ip_v4 || "").trim()
      const hostCheck = validateTargetHost(rawHost)
      if (!hostCheck.valid) {
        return NextResponse.json(
          { status: "error", message: hostCheck.reason },
          { status: 400 }
        )
      }

      const port = Number(body?.port || targetNode.ssh_port || 22)
      if (!Number.isInteger(port) || port < 1 || port > 65535) {
        return NextResponse.json(
          { status: "error", message: "Port SSH harus di antara 1 - 65535." },
          { status: 400 }
        )
      }

      const username = String(body?.username || "").trim()
      const password = typeof body?.password === "string" ? body.password : undefined
      const privateKey =
        typeof body?.privateKey === "string" ? body.privateKey : undefined

      if (!username) {
        return NextResponse.json(
          { status: "error", message: "Username SSH wajib diisi." },
          { status: 400 }
        )
      }
      if (!password && !privateKey?.trim()) {
        return NextResponse.json(
          {
            status: "error",
            message: "Password atau Private Key SSH wajib diisi.",
          },
          { status: 400 }
        )
      }

      if (action === "exec") {
        const command = String(body?.command || "").trim()
        if (!command) {
          return NextResponse.json(
            { status: "error", message: "Perintah SSH tidak boleh kosong." },
            { status: 400 }
          )
        }

        try {
          const result = await execSshCommandOnce({
            host: hostCheck.host,
            port,
            username,
            password,
            privateKey,
            command,
          })
          return NextResponse.json({
            status: "success",
            data: result,
          })
        } catch (err) {
          return NextResponse.json(
            {
              status: "error",
              message: formatSshErrorMessage(err, hostCheck.host, port),
            },
            { status: 502 }
          )
        }
      }

      // action === "connect" (Interactive PTY Shell)
      try {
        const cols = Number(body?.cols || 100)
        const rows = Number(body?.rows || 28)
        const sshSession = await createSshTerminalSession({
          ownerEmail: ctx.email,
          nodeId: targetNode.node_id,
          hostname: targetNode.hostname,
          host: hostCheck.host,
          port,
          username,
          password,
          privateKey,
          cols,
          rows,
        })

        return NextResponse.json({
          status: "success",
          data: {
            sessionId: sshSession.id,
            nodeId: sshSession.nodeId,
            hostname: sshSession.hostname,
            host: sshSession.host,
            port: sshSession.port,
            username: sshSession.username,
          },
        })
      } catch (err) {
        return NextResponse.json(
          {
            status: "error",
            message: formatSshErrorMessage(err, hostCheck.host, port),
          },
          { status: 502 }
        )
      }
    }

    return NextResponse.json(
      { status: "error", message: "Aksi terminal tidak dikenali." },
      { status: 400 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error"
    return NextResponse.json({ status: "error", message }, { status: 500 })
  }
}
