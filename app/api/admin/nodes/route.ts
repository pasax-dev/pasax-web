import { NextRequest, NextResponse } from "next/server"
import { pasaxStore } from "@/lib/store"
import { pasaxCloud } from "@/lib/pasax-cloud"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const nodes = await pasaxCloud.fetchNodes()
    const users = pasaxStore.getUsers()

    // Enrich each node with details of assigned users (Pemegang VPS)
    const enriched = nodes.map((node) => {
      const assignedUserIds = node.assignedUserIds || (node.project_id ? [node.project_id] : [])
      const assignedUsers = users
        .filter((u) => assignedUserIds.includes(u.id) || u.assignedNodeIds?.includes(node.node_id))
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
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.hostname || !body.ip_v4) {
      return NextResponse.json(
        { status: "error", message: "Hostname dan IP Address VPS wajib diisi." },
        { status: 400 }
      )
    }

    const createdNode = pasaxStore.createNode({
      hostname: body.hostname,
      ip_v4: body.ip_v4,
      os: body.os || "Ubuntu 24.04 LTS (Noble)",
      ssh_port: body.ssh_port ? parseInt(body.ssh_port) : 22,
      description: body.description || "",
      tags: Array.isArray(body.tags) ? body.tags : ["Production"],
      assignedUserIds: Array.isArray(body.assignedUserIds) ? body.assignedUserIds : [],
      status: body.status || "ONLINE",
    })

    return NextResponse.json({
      status: "success",
      message: "VPS Node berhasil didaftarkan ke jaringan armada SOC.",
      data: createdNode,
    })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const nodeId = body.node_id || body.id

    if (!nodeId) {
      return NextResponse.json({ status: "error", message: "ID Node (node_id) wajib disertakan." }, { status: 400 })
    }

    const updates = body.updates || body
    delete updates.node_id
    delete updates.id

    const updated = pasaxStore.updateNode(nodeId, updates)
    if (!updated) {
      return NextResponse.json({ status: "error", message: "VPS Node tidak ditemukan." }, { status: 404 })
    }

    return NextResponse.json({
      status: "success",
      message: "Konfigurasi VPS Node berhasil diperbarui.",
      data: updated,
    })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
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
      return NextResponse.json({ status: "error", message: "ID Node wajib disertakan." }, { status: 400 })
    }

    const deleted = pasaxStore.deleteNode(nodeId)
    if (!deleted) {
      return NextResponse.json({ status: "error", message: "Node tidak ditemukan atau gagal dihapus." }, { status: 404 })
    }

    return NextResponse.json({
      status: "success",
      message: "VPS Node berhasil dihapus dari sistem pengawasan.",
    })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}
