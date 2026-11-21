import { NextRequest, NextResponse } from "next/server"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const users = pasaxStore.getUsers()
    const allNodes = pasaxStore.getNodes()

    // Enrich users with detailed VPS nodes info
    const enriched = users.map((u) => {
      const assignedNodes = allNodes.filter(
        (n) =>
          u.assignedNodeIds?.includes(n.node_id) ||
          n.assignedUserIds?.includes(u.id)
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
    const body = await req.json()
    if (!body.email || !body.name) {
      return NextResponse.json(
        { status: "error", message: "Email dan nama pengguna wajib diisi." },
        { status: 400 }
      )
    }

    const result = pasaxStore.createUser({
      name: body.name,
      email: body.email,
      role: body.role || "Admin", // Default role is Admin
      plan: body.plan || "pro",
      serverQuota: body.serverQuota ? parseInt(body.serverQuota) : undefined,
      organization: body.organization,
      phone: body.phone,
      assignedNodeIds: Array.isArray(body.assignedNodeIds)
        ? body.assignedNodeIds
        : [],
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
    const body = await req.json()
    if (!body.id) {
      return NextResponse.json(
        { status: "error", message: "ID pengguna diperlukan." },
        { status: 400 }
      )
    }

    const updates = body.updates || body
    delete updates.id

    const updated = pasaxStore.updateUser(body.id, updates)
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
    const { searchParams } = new URL(req.url)
    let id = searchParams.get("id")

    if (!id) {
      try {
        const body = await req.json()
        id = body?.id
      } catch {
        // body might be empty
      }
    }

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID pengguna diperlukan." },
        { status: 400 }
      )
    }

    const deleted = pasaxStore.deleteUser(id)
    if (!deleted) {
      return NextResponse.json(
        {
          status: "error",
          message: "Pengguna tidak ditemukan atau gagal dihapus.",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Pengguna berhasil dihapus.",
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}
