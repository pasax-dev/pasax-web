import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { pasaxStore } from "@/lib/store"
import { ensureSessionUser, getScopedNodes } from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const allNodes = await pasaxCloud.fetchNodes()

  if (session?.user) {
    const scoped = getScopedNodes(session, allNodes)
    return NextResponse.json({
      status: "success",
      data: scoped,
    })
  }

  // Fallback for authenticated CLI/daemon requests using license key
  const rawToken =
    req.headers.get("x-api-key") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (rawToken) {
    const keyRecord = pasaxStore.getLicenseKeyByToken(rawToken)
    if (keyRecord) {
      const owner = pasaxStore.getUser(keyRecord.userId)
      if (owner) {
        const fakeSession = {
          user: {
            id: owner.id,
            email: owner.email,
            role: owner.role,
            name: owner.name,
          },
        }
        const scoped = getScopedNodes(fakeSession, allNodes)
        return NextResponse.json({ status: "success", data: scoped })
      }
    }
  }

  return NextResponse.json(
    { status: "error", message: "Unauthorized", data: [] },
    { status: 401 }
  )
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const ctx = ensureSessionUser(session)
    const body = await req.json()
    if (!body.hostname || !body.ip_v4) {
      return NextResponse.json(
        { status: "error", message: "hostname dan ip_v4 wajib diisi" },
        { status: 400 }
      )
    }

    const assignedUserIds = Array.isArray(body.assignedUserIds)
      ? [...body.assignedUserIds]
      : []
    if (ctx && !assignedUserIds.includes(ctx.user.id)) {
      assignedUserIds.unshift(ctx.user.id)
    }

    const created = pasaxStore.createNode({
      hostname: body.hostname,
      ip_v4: body.ip_v4,
      os: body.os || "Ubuntu 24.04 LTS (Noble)",
      ssh_port: body.ssh_port ? parseInt(body.ssh_port) : 22,
      description: body.description || "",
      tags: body.tags || ["Production"],
      assignedUserIds,
    })
    if (ctx) {
      pasaxStore.updateNode(created.node_id, { project_id: ctx.user.id })
    }

    return NextResponse.json({
      status: "success",
      data: created,
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}
