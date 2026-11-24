import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxStore } from "@/lib/store"
import { ensureSessionUser } from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const ctx = ensureSessionUser(session)
    if (!ctx) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const requestedEmail = searchParams.get("email")
    const targetEmail =
      ctx.role === "Superadmin" && requestedEmail ? requestedEmail : ctx.email

    const overview = pasaxStore.getUserTenantOverview(targetEmail)
    return NextResponse.json({ status: "success", data: overview })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}
