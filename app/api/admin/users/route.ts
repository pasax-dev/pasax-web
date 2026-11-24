import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxStore } from "@/lib/store"
import { pasaxCloud } from "@/lib/pasax-cloud"
import {
  ensureSessionUser,
  getScopedUsers,
  getScopedNodes,
  canManageTargetUser,
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

    const users = getScopedUsers(session)
    const allNodes = await pasaxCloud.fetchNodes()
    const visibleNodes = getScopedNodes(session, allNodes)

    // Enrich users with detailed VPS nodes info (only within caller's scope)
    const enriched = users.map((u) => {
      const assignedNodes = visibleNodes.filter(
        (n) =>
          u.assignedNodeIds?.includes(n.node_id) ||
          n.assignedUserIds?.includes(u.id) ||
          n.project_id === u.id
      )
      return {
        ...u,
        assignedNodes: assignedNodes.map((n) => ({
          node_id: n.node_id,
          hostname: n.hostname,
          ip_v4: n.ip_v4,
          status: n.status,
          os: n.os,
        })),
        assignedNodesCount: assignedNodes.length,
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
            "Hanya Admin atau Superadmin yang dapat membuat pengguna baru.",
        },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.email || !body.name) {
      return NextResponse.json(
        { status: "error", message: "Email dan nama pengguna wajib diisi." },
        { status: 400 }
      )
    }

    const requestedRole = body.role || "Admin"
    const safeRole =
      ctx.role === "Superadmin"
        ? requestedRole
        : requestedRole === "Superadmin"
          ? "Admin"
          : requestedRole

    // Scope assignedNodeIds to nodes owned/accessible by this Admin
    const allNodes = await pasaxCloud.fetchNodes()
    const visibleNodeIds = new Set(
      getScopedNodes(session, allNodes).map((n) => n.node_id)
    )
    const rawAssigned = Array.isArray(body.assignedNodeIds)
      ? body.assignedNodeIds
      : []
    const safeNodeIds =
      ctx.role === "Superadmin"
        ? rawAssigned
        : rawAssigned.filter((nid: string) => visibleNodeIds.has(nid))

    const result = pasaxStore.createUser({
      name: body.name,
      email: body.email,
      role: safeRole,
      plan: body.plan || ctx.user.plan || "pro",
      serverQuota: body.serverQuota ? parseInt(body.serverQuota) : undefined,
      organization: body.organization || ctx.user.organization,
      phone: body.phone,
      assignedNodeIds: safeNodeIds,
      createdBy:
        ctx.role === "Superadmin" ? body.createdBy || ctx.email : ctx.email,
    })

    return NextResponse.json({
      status: "success",
      message: "Pengguna pemegang VPS dan license key berhasil dibuat.",
      data: result,
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

    const body = await req.json()
    const targetId = body.id || body.userId
    if (!targetId) {
      return NextResponse.json(
        { status: "error", message: "ID pengguna diperlukan." },
        { status: 400 }
      )
    }

    if (!canManageTargetUser(session, targetId)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Anda tidak memiliki akses ke pengguna ini.",
        },
        { status: 403 }
      )
    }

    if (ctx.role !== "Superadmin" && ctx.role !== "Admin") {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Hanya Admin atau Superadmin yang dapat mengubah konfigurasi pengguna.",
        },
        { status: 403 }
      )
    }

    const updates = { ...(body.updates || body) }
    delete updates.id
    delete updates.userId

    if (ctx.role !== "Superadmin") {
      if (updates.role === "Superadmin") {
        delete updates.role
      }
      if (updates.createdBy !== undefined) {
        delete updates.createdBy
      }
      if (Array.isArray(updates.assignedNodeIds)) {
        const allNodes = await pasaxCloud.fetchNodes()
        const visibleNodeIds = new Set(
          getScopedNodes(session, allNodes).map((n) => n.node_id)
        )
        updates.assignedNodeIds = updates.assignedNodeIds.filter(
          (nid: string) => visibleNodeIds.has(nid)
        )
      }
    }

    const updated = pasaxStore.updateUser(targetId, updates)
    if (!updated) {
      return NextResponse.json(
        { status: "error", message: "Pengguna tidak ditemukan." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Data pengguna berhasil diperbarui.",
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
        { status: "error", message: "Akses ditolak." },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID pengguna diperlukan." },
        { status: 400 }
      )
    }

    if (id === ctx.user.id) {
      return NextResponse.json(
        {
          status: "error",
          message: "Tidak dapat menghapus akun yang sedang login.",
        },
        { status: 400 }
      )
    }

    if (!canManageTargetUser(session, id)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Anda tidak memiliki akses untuk menghapus pengguna ini.",
        },
        { status: 403 }
      )
    }

    const deleted = pasaxStore.deleteUser(id)
    if (!deleted) {
      return NextResponse.json(
        { status: "error", message: "Pengguna tidak ditemukan." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Pengguna dan akses lisensi berhasil dihapus.",
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}
