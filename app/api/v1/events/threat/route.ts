import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { pasaxStore } from "@/lib/store"
import { getScopedNodes, getScopedThreats } from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const eventType = body.event_type || body.threat_type
    if (!body || !eventType) {
      return NextResponse.json(
        { error: "Missing event_type or threat_type in threat payload" },
        { status: 400 }
      )
    }

    const nodeId = body.node_id || "unknown_node"
    const existingNode = pasaxStore.getNode(nodeId)
    const projectId =
      body.project_id && body.project_id !== "default"
        ? body.project_id
        : existingNode?.project_id || "default"

    const event = await pasaxCloud.reportThreat({
      node_id: nodeId,
      project_id: projectId,
      event_type: eventType,
      severity: body.severity || "HIGH",
      details: body.details || {},
      timestamp: body.timestamp || Math.floor(Date.now() / 1000),
    })

    return NextResponse.json({
      status: "success",
      message: "Threat alert recorded and propagated to Cloud",
      incident_id: event.id,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to record threat" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get("limit") || "50", 10)
  const session = await getServerSession(authOptions)

  if (session?.user) {
    const [allThreats, allNodes] = await Promise.all([
      pasaxCloud.fetchThreats(limit),
      pasaxCloud.fetchNodes(),
    ])
    const scopedNodes = getScopedNodes(session, allNodes)
    const scopedThreats = getScopedThreats(session, allThreats, scopedNodes)
    return NextResponse.json(scopedThreats)
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
        const [allThreats, allNodes] = await Promise.all([
          pasaxCloud.fetchThreats(limit),
          pasaxCloud.fetchNodes(),
        ])
        const scopedNodes = getScopedNodes(fakeSession, allNodes)
        const scopedThreats = getScopedThreats(
          fakeSession,
          allThreats,
          scopedNodes
        )
        return NextResponse.json(scopedThreats)
      }
    }
  }

  return NextResponse.json([], { status: 401 })
}
