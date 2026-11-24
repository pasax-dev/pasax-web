import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { pasaxStore } from "@/lib/store"
import { getScopedNodes } from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body || !body.node_id) {
      return NextResponse.json(
        { error: "Missing node_id in telemetry payload" },
        { status: 400 }
      )
    }

    const updatedNode = await pasaxCloud.ingestTelemetry(body)

    return NextResponse.json({
      status: "success",
      message: "Telemetry ingested and synced to Pasax Cloud",
      node_id: updatedNode.node_id,
      timestamp: Math.floor(Date.now() / 1000),
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process telemetry" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const allNodes = await pasaxCloud.fetchNodes()

  if (session?.user) {
    return NextResponse.json(getScopedNodes(session, allNodes))
  }

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
        return NextResponse.json(getScopedNodes(fakeSession, allNodes))
      }
    }
  }

  return NextResponse.json([], { status: 401 })
}
