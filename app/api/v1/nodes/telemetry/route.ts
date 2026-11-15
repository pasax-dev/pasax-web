import { NextRequest, NextResponse } from "next/server"
import { pasaxCloud } from "@/lib/pasax-cloud"

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

export async function GET() {
  const nodes = await pasaxCloud.fetchNodes()
  return NextResponse.json(nodes)
}
