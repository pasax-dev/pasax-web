import { NextRequest, NextResponse } from "next/server"
import { pasakStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email") || "user@pasak.id"
    const overview = pasakStore.getUserTenantOverview(email)
    return NextResponse.json({ status: "success", data: overview })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}
