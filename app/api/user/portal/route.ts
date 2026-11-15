import { NextRequest, NextResponse } from "next/server"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email") || "user@pasax.id"
    const overview = pasaxStore.getUserTenantOverview(email)
    return NextResponse.json({ status: "success", data: overview })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}
