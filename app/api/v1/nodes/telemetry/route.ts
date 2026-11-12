import { NextRequest, NextResponse } from "next/server"
import { pasakCloud } from "@/lib/pasak-cloud"

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

    const updatedNode = await pasakCloud.ingestTelemetry(body)

    return NextResponse.json({
      status: "success",
      message: "Telemetry ingested and synced to Pasak Cloud",
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
  const nodes = await pasakCloud.fetchNodes()
  return NextResponse.json(nodes)
}
