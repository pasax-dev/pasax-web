import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxStore } from "@/lib/store"
import { ensureSessionUser, getScopedUsers } from "@/lib/tenant-scope"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const licenseKey =
      req.headers.get("x-pasax-key") ||
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      body.license_key ||
      body.key

    if (!licenseKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "Header X-Pasax-Key atau license_key diperlukan.",
        },
        { status: 401 }
      )
    }

    const appName = body.app_name || body.appName || "Laravel"
    const appUrl = body.app_url || body.appUrl || "http://localhost:8000"
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      body.ip ||
      "127.0.0.1"

    const app = pasaxStore.registerConnectedApp({
      licenseKey,
      appName,
      appUrl,
      ip,
      wafVersion: body.waf_version || "v1.2.0",
      environment: body.environment,
      threatsBlocked: body.threats_blocked,
    })

    if (!app) {
      return NextResponse.json(
        {
          status: "error",
          message: "License key tidak valid atau sedang dinonaktifkan.",
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: `Aplikasi ${appName} (${appUrl}) terverifikasi aman & terhubung ke Pasax SOC Mesh.`,
      data: app,
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const ctx = ensureSessionUser(session)
  if (!ctx) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized", data: [] },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const requestedUserId = searchParams.get("userId") || undefined

  if (ctx.role === "Superadmin") {
    const apps = pasaxStore.getConnectedApps(requestedUserId)
    return NextResponse.json({ status: "success", data: apps })
  }

  const scopedUserIds = new Set(getScopedUsers(session).map((u) => u.id))
  const apps = pasaxStore
    .getConnectedApps(requestedUserId)
    .filter((a) => scopedUserIds.has(a.userId))

  return NextResponse.json({ status: "success", data: apps })
}
