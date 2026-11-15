import { NextResponse } from "next/server"
import { pasaxCloud } from "@/lib/pasax-cloud"

export const dynamic = "force-dynamic"

export async function GET() {
  const nodes = await pasaxCloud.fetchNodes()
  return NextResponse.json(nodes)
}
