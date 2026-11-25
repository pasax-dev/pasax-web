import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxCloud } from "@/lib/pasax-cloud"
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

    if (ctx.role !== "Superadmin") {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Akses ditolak. Hanya role Superadmin yang dapat melihat intelijen pengunjung.",
        },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const result = await pasaxCloud.fetchVisitors({
      q: searchParams.get("q") || undefined,
      country: searchParams.get("country") || undefined,
      deviceType: searchParams.get("deviceType") || undefined,
      consentStatus: searchParams.get("consentStatus") || undefined,
      limit: Number(searchParams.get("limit") || 200),
      offset: Number(searchParams.get("offset") || 0),
    })

    return NextResponse.json({
      status: "success",
      ...result,
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err?.message || "Failed to load visitors" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const ctx = ensureSessionUser(session)
    if (!ctx) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      )
    }

    if (ctx.role !== "Superadmin") {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Akses ditolak. Hanya role Superadmin yang dapat menghapus log pengunjung.",
        },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID visitor wajib disertakan." },
        { status: 400 }
      )
    }

    const ok = await pasaxCloud.deleteVisitor(id)
    if (!ok) {
      return NextResponse.json(
        { status: "error", message: "Gagal menghapus log visitor." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Log visitor berhasil dihapus.",
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err?.message || "Failed to delete visitor" },
      { status: 500 }
    )
  }
}
