import { NextRequest, NextResponse } from "next/server"
import { pasaxCloud } from "@/lib/pasax-cloud"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const blocklist = await pasaxCloud.fetchBlocklist()
  // Returns direct JSON array of string IPs: ["1.2.3.4", ...] for Sentinel sync
  return NextResponse.json(blocklist)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ip = body.ip || body.attacker_ip
    if (!ip) {
      return NextResponse.json(
        { error: "Missing ip in request" },
        { status: 400 }
      )
    }
    pasaxStore.addToBlocklist(ip)
    return NextResponse.json({
      status: "success",
      added: ip,
      blocklist: pasaxStore.getBlocklist(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ip = searchParams.get("ip")
    if (ip) {
      pasaxStore.removeFromBlocklist(ip)
    }
    return NextResponse.json({
      status: "success",
      removed: ip,
      blocklist: pasaxStore.getBlocklist(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
