import { NextRequest, NextResponse } from "next/server"
import { pasaxCloud } from "@/lib/pasax-cloud"

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

    const event = await pasaxCloud.reportThreat({
      node_id: body.node_id || "unknown_node",
      project_id: body.project_id || "default",
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
  const threats = await pasaxCloud.fetchThreats(limit)
  return NextResponse.json(threats)
}
