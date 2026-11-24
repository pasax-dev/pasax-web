import { NextRequest, NextResponse } from "next/server"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId") || undefined
    const keys = pasaxStore.getLicenseKeys(userId)
    return NextResponse.json({ status: "success", data: keys })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.userId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Target userId diperlukan untuk membuat license key.",
        },
        { status: 400 }
      )
    }

    const key = pasaxStore.createLicenseKey(body.userId, body.name)
    if (!key) {
      return NextResponse.json(
        { status: "error", message: "User tidak ditemukan." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "License token baru (Trial 14 Hari) berhasil di-generate.",
      data: key,
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.id) {
      return NextResponse.json(
        { status: "error", message: "ID license diperlukan." },
        { status: 400 }
      )
    }

    if (body.action === "convert_pro" || body.action === "upgrade") {
      const key = pasaxStore.updateLicenseKey(body.id, {
        isTrial: false,
        subscriptionStatus: "active",
        isActive: true,
      })
      if (!key) {
        return NextResponse.json(
          { status: "error", message: "License key tidak ditemukan." },
          { status: 404 }
        )
      }
      return NextResponse.json({
        status: "success",
        message: "Lisensi berhasil di-upgrade ke Pro Aktif (Berbayar).",
        data: key,
      })
    }

    if (body.action === "extend_trial") {
      const now = Math.floor(Date.now() / 1000)
      const days = Number(body.days) || 14
      const key = pasaxStore.updateLicenseKey(body.id, {
        isTrial: true,
        trialEndsAt: now + days * 86400,
        subscriptionStatus: "trialing",
        isActive: true,
      })
      if (!key) {
        return NextResponse.json(
          { status: "error", message: "License key tidak ditemukan." },
          { status: 404 }
        )
      }
      return NextResponse.json({
        status: "success",
        message: `Masa trial lisensi berhasil diperpanjang +${days} hari.`,
        data: key,
      })
    }

    const key = pasaxStore.toggleLicenseKey(body.id)
    if (!key) {
      return NextResponse.json(
        { status: "error", message: "License key tidak ditemukan." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: `Status license diubah menjadi: ${key.isActive ? "AKTIF" : "NONAKTIF"}`,
      data: key,
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    let id = searchParams.get("id")

    if (!id) {
      try {
        const body = await req.json()
        id = body?.id
      } catch {
        // body empty
      }
    }

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID license diperlukan." },
        { status: 400 }
      )
    }

    const deleted = pasaxStore.deleteLicenseKey(id)
    if (!deleted) {
      return NextResponse.json(
        { status: "error", message: "License key tidak ditemukan." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      message: "License key berhasil dihapus.",
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}
