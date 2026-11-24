import { NextRequest, NextResponse } from "next/server"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization")
    const { searchParams } = new URL(req.url)
    const token = (
      searchParams.get("api_key") ||
      searchParams.get("key") ||
      (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader)
    )?.trim()

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          valid: false,
          message:
            "Missing license API key. Provide ?api_key=... or Authorization: Bearer <key>.",
        },
        { status: 400 }
      )
    }

    const key = pasaxStore.getLicenseKeyByToken(token)
    if (!key || !key.isActive) {
      return NextResponse.json(
        {
          status: "error",
          valid: false,
          message: "License API key is invalid or has been deactivated.",
        },
        { status: 401 }
      )
    }

    const user = pasaxStore.getUser(key.userId)

    return NextResponse.json({
      status: "success",
      valid: true,
      message: "License key is active and valid.",
      data: {
        license_key: {
          id: key.id,
          name: key.name,
          created_at: key.createdAt,
        },
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              plan: user.plan,
            }
          : null,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", valid: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const authHeader = req.headers.get("Authorization")
    const token = (
      body.api_key ||
      body.license_key ||
      body.key ||
      (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader)
    )?.trim()

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          valid: false,
          message: "Missing license API key.",
        },
        { status: 400 }
      )
    }

    const key = pasaxStore.getLicenseKeyByToken(token)
    if (!key || !key.isActive) {
      return NextResponse.json(
        {
          status: "error",
          valid: false,
          message: "License API key is invalid or has been deactivated.",
        },
        { status: 401 }
      )
    }

    const user = pasaxStore.getUser(key.userId)

    return NextResponse.json({
      status: "success",
      valid: true,
      message: "License key is active and valid.",
      data: {
        license_key: {
          id: key.id,
          name: key.name,
          created_at: key.createdAt,
        },
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              plan: user.plan,
            }
          : null,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", valid: false, message: err.message },
      { status: 500 }
    )
  }
}
