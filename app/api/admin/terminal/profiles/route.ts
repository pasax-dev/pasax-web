import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxCloud } from "@/lib/pasax-cloud"
import {
  ensureSessionUser,
  getScopedNodes,
  getSshProfileEntitlement,
} from "@/lib/tenant-scope"
import {
  execSshCommandOnce,
  formatSshErrorMessage,
  validateTargetHost,
} from "@/lib/ssh-terminal-manager"
import { decryptSshSecret, encryptSshSecret } from "@/lib/ssh-profile-crypto"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function isPrivateOrLocalHost(host: string): boolean {
  return (
    host === "127.0.0.1" ||
    host === "localhost" ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  )
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)
  if (!ctx) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 }
    )
  }

  const [allNodes, rawProfiles] = await Promise.all([
    pasaxCloud.fetchNodes(),
    pasaxCloud.fetchSshProfiles(ctx.email),
  ])
  const scopedNodeIds = new Set(
    getScopedNodes(session, allNodes).map((n) => n.node_id)
  )

  const profiles = rawProfiles.filter(
    (p) => !p.nodeId || scopedNodeIds.has(p.nodeId)
  )
  const entitlement = getSshProfileEntitlement(ctx)

  return NextResponse.json({
    status: "success",
    data: profiles,
    entitlement,
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

    const entitlement = getSshProfileEntitlement(ctx)
    if (!entitlement.allowed) {
      return NextResponse.json(
        { status: "error", message: entitlement.reason || "Langganan diperlukan." },
        { status: 403 }
      )
    }

    const existingProfiles = await pasaxCloud.fetchSshProfiles(ctx.email)
    if (existingProfiles.length >= entitlement.maxProfiles) {
      return NextResponse.json(
        {
          status: "error",
          message: `Batas maksimum ${entitlement.maxProfiles} konfigurasi SSH tersimpan untuk paket ${entitlement.plan.toUpperCase()} telah tercapai.`,
        },
        { status: 403 }
      )
    }

    const body = await req.json()
    const nodeId = String(body?.nodeId || "").trim()
    if (!nodeId) {
      return NextResponse.json(
        { status: "error", message: "Pilih Server VPS target terlebih dahulu." },
        { status: 400 }
      )
    }

    const allNodes = await pasaxCloud.fetchNodes()
    const scopedNodes = getScopedNodes(session, allNodes)
    const targetNode = scopedNodes.find((n) => n.node_id === nodeId)
    if (!targetNode) {
      return NextResponse.json(
        {
          status: "error",
          message: "Akses ditolak: Anda tidak memiliki izin ke VPS Node ini.",
        },
        { status: 403 }
      )
    }

    const label = String(body?.label || "").trim()
    if (!label) {
      return NextResponse.json(
        { status: "error", message: "Nama/label konfigurasi wajib diisi." },
        { status: 400 }
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
    if (!username) {
      return NextResponse.json(
        { status: "error", message: "Username SSH wajib diisi." },
        { status: 400 }
      )
    }

    const authMethod: "password" | "key" =
      body?.authMethod === "key" ? "key" : "password"
    const transportMode: "pty" | "command" =
      body?.transportMode === "command" ? "command" : "pty"
    const password = typeof body?.password === "string" ? body.password : undefined
    const privateKey =
      typeof body?.privateKey === "string" ? body.privateKey : undefined

    const secretPlaintext =
      authMethod === "key" ? privateKey?.trim() : password
    if (!secretPlaintext) {
      return NextResponse.json(
        {
          status: "error",
          message:
            authMethod === "key"
              ? "Private Key SSH wajib diisi untuk verifikasi."
              : "Password SSH wajib diisi untuk verifikasi.",
        },
        { status: 400 }
      )
    }

    const isVercel = process.env.VERCEL === "1"
    const allowUnverifiedLocal =
      isVercel &&
      isPrivateOrLocalHost(hostCheck.host) &&
      body?.allowUnverifiedLocal === true

    let verifiedAt: string | null = null
    if (!allowUnverifiedLocal) {
      try {
        await execSshCommandOnce({
          host: hostCheck.host,
          port,
          username,
          password: authMethod === "password" ? secretPlaintext : undefined,
          privateKey: authMethod === "key" ? secretPlaintext : undefined,
          command: "echo PASAX_SSH_VERIFY_OK",
        })
        verifiedAt = new Date().toISOString()
      } catch (err) {
        return NextResponse.json(
          {
            status: "error",
            message: `Koneksi SSH gagal diverifikasi (konfigurasi tidak disimpan): ${formatSshErrorMessage(err, hostCheck.host, port)}`,
          },
          { status: 422 }
        )
      }
    }

    const saveSecret = body?.saveSecret !== false
    const encryptedSecret = saveSecret
      ? encryptSshSecret(secretPlaintext)
      : null

    const created = await pasaxCloud.createSshProfile({
      ownerEmail: ctx.email,
      nodeId: targetNode.node_id,
      label,
      host: hostCheck.host,
      port,
      username,
      authMethod,
      transportMode,
      encryptedSecret,
      verifiedAt,
    })

    if (!created.ok || !created.data) {
      return NextResponse.json(
        {
          status: "error",
          message: created.message || "Gagal menyimpan konfigurasi ke database.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Konfigurasi SSH berhasil diverifikasi dan disimpan ke database.",
        data: created.data,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error"
    return NextResponse.json({ status: "error", message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const ctx = ensureSessionUser(session)
    if (!ctx) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      )
    }

    const entitlement = getSshProfileEntitlement(ctx)
    if (!entitlement.allowed) {
      return NextResponse.json(
        { status: "error", message: entitlement.reason || "Langganan diperlukan." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const id = String(body?.id || "").trim()
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID konfigurasi wajib disertakan." },
        { status: 400 }
      )
    }

    const existing = await pasaxCloud.resolveSshProfile(id, ctx.email)
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Konfigurasi SSH tidak ditemukan." },
        { status: 404 }
      )
    }

    const nextNodeId =
      body?.nodeId !== undefined ? String(body.nodeId || "").trim() : existing.nodeId
    if (nextNodeId) {
      const allNodes = await pasaxCloud.fetchNodes()
      const scopedNodes = getScopedNodes(session, allNodes)
      if (!scopedNodes.some((n) => n.node_id === nextNodeId)) {
        return NextResponse.json(
          { status: "error", message: "Anda tidak memiliki akses ke VPS Node ini." },
          { status: 403 }
        )
      }
    }

    const nextHost = String(body?.host || existing.host).trim()
    const hostCheck = validateTargetHost(nextHost)
    if (!hostCheck.valid) {
      return NextResponse.json(
        { status: "error", message: hostCheck.reason },
        { status: 400 }
      )
    }

    const nextPort = Number(body?.port || existing.port)
    if (!Number.isInteger(nextPort) || nextPort < 1 || nextPort > 65535) {
      return NextResponse.json(
        { status: "error", message: "Port SSH harus di antara 1 - 65535." },
        { status: 400 }
      )
    }

    const nextUsername = String(body?.username || existing.username).trim()
    const nextAuthMethod: "password" | "key" =
      body?.authMethod === "key"
        ? "key"
        : body?.authMethod === "password"
          ? "password"
          : existing.authMethod

    const newSecretPlaintext =
      nextAuthMethod === "key"
        ? typeof body?.privateKey === "string" && body.privateKey.trim()
          ? body.privateKey.trim()
          : undefined
        : typeof body?.password === "string" && body.password.length > 0
          ? body.password
          : undefined

    const storedPlaintext = existing.encryptedSecret
      ? decryptSshSecret(existing.encryptedSecret)
      : null
    const effectiveSecret = newSecretPlaintext || storedPlaintext

    let verifiedAt = existing.verifiedAt || null
    const shouldVerify = body?.verifyConnection !== false && effectiveSecret
    const isVercel = process.env.VERCEL === "1"
    const allowUnverifiedLocal =
      isVercel &&
      isPrivateOrLocalHost(hostCheck.host) &&
      body?.allowUnverifiedLocal === true

    if (shouldVerify && !allowUnverifiedLocal) {
      try {
        await execSshCommandOnce({
          host: hostCheck.host,
          port: nextPort,
          username: nextUsername,
          password: nextAuthMethod === "password" ? effectiveSecret : undefined,
          privateKey: nextAuthMethod === "key" ? effectiveSecret : undefined,
          command: "echo PASAX_SSH_VERIFY_OK",
        })
        verifiedAt = new Date().toISOString()
      } catch (err) {
        return NextResponse.json(
          {
            status: "error",
            message: `Pembaruan gagal — koneksi SSH tidak dapat diverifikasi: ${formatSshErrorMessage(err, hostCheck.host, nextPort)}`,
          },
          { status: 422 }
        )
      }
    }

    const encryptedSecretUpdate =
      body?.saveSecret === false
        ? undefined
        : newSecretPlaintext
          ? encryptSshSecret(newSecretPlaintext)
          : undefined

    const updated = await pasaxCloud.updateSshProfile(id, {
      ownerEmail: ctx.email,
      nodeId: nextNodeId,
      label: typeof body?.label === "string" ? body.label.trim() : existing.label,
      host: hostCheck.host,
      port: nextPort,
      username: nextUsername,
      authMethod: nextAuthMethod,
      transportMode:
        body?.transportMode === "command"
          ? "command"
          : body?.transportMode === "pty"
            ? "pty"
            : existing.transportMode,
      encryptedSecret: encryptedSecretUpdate,
      clearSecret: body?.clearSecret === true,
      verifiedAt,
    })

    if (!updated.ok || !updated.data) {
      return NextResponse.json(
        { status: "error", message: updated.message || "Gagal memperbarui profil." },
        { status: 502 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Konfigurasi SSH berhasil diperbarui.",
      data: updated.data,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error"
    return NextResponse.json({ status: "error", message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)
  if (!ctx) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) {
    return NextResponse.json(
      { status: "error", message: "ID konfigurasi wajib disertakan." },
      { status: 400 }
    )
  }

  const ok = await pasaxCloud.deleteSshProfile(id, ctx.email)
  if (!ok) {
    return NextResponse.json(
      { status: "error", message: "Konfigurasi SSH tidak ditemukan atau gagal dihapus." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    status: "success",
    message: "Konfigurasi SSH dihapus dari database.",
  })
}
