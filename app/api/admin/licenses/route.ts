import { NextRequest, NextResponse } from "next/server"
import { pasakStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId") || undefined
    const keys = pasakStore.getLicenseKeys(userId)
    return NextResponse.json({ status: "success", data: keys })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.userId) {
      return NextResponse.json(
        { status: "error", message: "Target userId diperlukan untuk membuat license key." },
        { status: 400 }
      )
    }

    const key = pasakStore.createLicenseKey(body.userId, body.name)
    if (!key) {
      return NextResponse.json(
        { status: "error", message: "User tidak ditemukan." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "License token baru berhasil di-generate.",
      data: key,
    })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.id) {
      return NextResponse.json({ status: "error", message: "ID license diperlukan." }, { status: 400 })
    }

    const key = pasakStore.toggleLicenseKey(body.id)
    if (!key) {
      return NextResponse.json({ status: "error", message: "License key tidak ditemukan." }, { status: 404 })
    }

    return NextResponse.json({
      status: "success",
      message: `Status license diubah menjadi: ${key.isActive ? "AKTIF" : "NONAKTIF"}`,
      data: key,
    })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}
