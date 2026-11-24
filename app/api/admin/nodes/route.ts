import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxStore } from "@/lib/store"
import { pasaxCloud } from "@/lib/pasax-cloud"
import {
  ensureSessionUser,
  getScopedNodes,
  getScopedUsers,
} from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const ctx = ensureSessionUser(session)
    if (!ctx) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      )
    }

    const allNodes = await pasaxCloud.fetchNodes()
    const nodes = getScopedNodes(session, allNodes)
    const scopedUsers = getScopedUsers(session)

    // Enrich each node ONLY with users inside caller's scope
    const enriched = nodes.map((node) => {
      const assignedUserIds =
        node.assignedUserIds || (node.project_id ? [node.project_id] : [])
      const assignedUsers = scopedUsers
        .filter(
          (u) =>
            assignedUserIds.includes(u.id) ||
            u.assignedNodeIds?.includes(node.node_id) ||
            node.project_id === u.id
        )
        .map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          plan: u.plan,
          organization: u.organization,
        }))

      return {
        ...node,
        assignedUserIds: Array.from(new Set(assignedUsers.map((u) => u.id))),
        assignedUsers,
        assignedUsersCount: assignedUsers.length,
      }
    })

    return NextResponse.json({ status: "success", data: enriched })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
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

    if (ctx.role !== "Superadmin" && ctx.role !== "Admin") {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Hanya Admin atau Superadmin yang dapat mendaftarkan VPS Node.",
        },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.hostname || !body.ip_v4) {
      return NextResponse.json(
        {
          status: "error",
          message: "Hostname dan IP Address VPS wajib diisi.",
        },
        { status: 400 }
      )
    }

    const scopedUserIds = new Set(getScopedUsers(session).map((u) => u.id))
    const rawUserIds = Array.isArray(body.assignedUserIds)
      ? body.assignedUserIds
      : []

    let finalUserIds =
      ctx.role === "Superadmin"
        ? rawUserIds
        : rawUserIds.filter((uid: string) => scopedUserIds.has(uid))

    if (ctx.role !== "Superadmin" && !finalUserIds.includes(ctx.user.id)) {
      finalUserIds = [ctx.user.id, ...finalUserIds]
    }

    const createdNode = pasaxStore.createNode({
      hostname: body.hostname,
      ip_v4: body.ip_v4,
      os: body.os || "Ubuntu 24.04 LTS (Noble)",
      ssh_port: body.ssh_port ? parseInt(body.ssh_port) : 22,
      description: body.description || "",
      tags: Array.isArray(body.tags) ? body.tags : ["Production"],
      assignedUserIds: finalUserIds,
      status: body.status || "ONLINE",
    })
    pasaxStore.updateNode(createdNode.node_id, { project_id: ctx.user.id })

    return NextResponse.json({
      status: "success",
      message: "VPS Node berhasil didaftarkan ke jaringan armada SOC.",
      data: createdNode,
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
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

    if (ctx.role !== "Superadmin" && ctx.role !== "Admin") {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Hanya Admin atau Superadmin yang dapat mengubah konfigurasi VPS Node.",
        },
        { status: 403 }
      )
    }

    const body = await req.json()
    const nodeId = body.node_id || body.id

    if (!nodeId) {
      return NextResponse.json(
        { status: "error", message: "ID Node (node_id) wajib disertakan." },
        { status: 400 }
      )
    }

    const visibleNodes = getScopedNodes(session, await pasaxCloud.fetchNodes())
    if (!visibleNodes.some((n) => n.node_id === nodeId)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Anda tidak memiliki akses ke VPS Node ini.",
        },
        { status: 403 }
      )
    }

    const updates = { ...(body.updates || body) }
    delete updates.node_id
    delete updates.id

    if (ctx.role !== "Superadmin" && Array.isArray(updates.assignedUserIds)) {
      const scopedUserIds = new Set(getScopedUsers(session).map((u) => u.id))
      updates.assignedUserIds = updates.assignedUserIds.filter((uid: string) =>
        scopedUserIds.has(uid)
      )
      if (!updates.assignedUserIds.includes(ctx.user.id)) {
        updates.assignedUserIds.unshift(ctx.user.id)
      }
    }

    const updated = pasaxStore.updateNode(nodeId, updates)
    if (!updated) {
      return NextResponse.json(
        { status: "error", message: "VPS Node tidak ditemukan." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Konfigurasi VPS Node berhasil diperbarui.",
      data: updated,
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const ctx = ensureSessionUser(session)
    if (!ctx) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      )
    }

    if (ctx.role !== "Superadmin" && ctx.role !== "Admin") {
      return NextResponse.json(
        {
          status: "error",
          message: "Hanya Admin atau Superadmin yang dapat menghapus VPS Node.",
        },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    let nodeId = searchParams.get("id") || searchParams.get("node_id")

    if (!nodeId) {
      try {
        const body = await req.json()
        nodeId = body?.node_id || body?.id
      } catch {
        // body might be empty
      }
    }

    if (!nodeId) {
      return NextResponse.json(
        { status: "error", message: "ID Node wajib disertakan." },
        { status: 400 }
      )
    }

    const visibleNodes = getScopedNodes(session, await pasaxCloud.fetchNodes())
    if (!visibleNodes.some((n) => n.node_id === nodeId)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Anda tidak memiliki akses untuk menghapus node ini.",
        },
        { status: 403 }
      )
    }

    const deleted = pasaxStore.deleteNode(nodeId)
    if (!deleted) {
      return NextResponse.json(
        {
          status: "error",
          message: "Node tidak ditemukan atau gagal dihapus.",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "VPS Node berhasil dihapus dari sistem pengawasan.",
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}
