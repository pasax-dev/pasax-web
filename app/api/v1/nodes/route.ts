import { NextResponse } from "next/server"
import { pasakCloud } from "@/lib/pasak-cloud"

export const dynamic = "force-dynamic"

export async function GET() {
  const nodes = await pasakCloud.fetchNodes()
  return NextResponse.json(nodes)
}
