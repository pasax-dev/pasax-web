import { NextRequest, NextResponse } from "next/server"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const nodes = await pasaxCloud.fetchNodes()
  return NextResponse.json({
    status: "success",
    data: nodes,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.hostname || !body.ip_v4) {
      return NextResponse.json(
        { status: "error", message: "hostname dan ip_v4 wajib diisi" },
        { status: 400 }
      )
    }

    const created = pasaxStore.createNode({
      hostname: body.hostname,
      ip_v4: body.ip_v4,
      os: body.os || "Ubuntu 24.04 LTS (Noble)",
      ssh_port: body.ssh_port ? parseInt(body.ssh_port) : 22,
      description: body.description || "",
      tags: body.tags || ["Production"],
      assignedUserIds: body.assignedUserIds || [],
    })

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
