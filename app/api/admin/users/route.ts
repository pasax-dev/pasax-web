import { NextRequest, NextResponse } from "next/server"
import { pasakStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const users = pasakStore.getUsers()
    return NextResponse.json({ status: "success", data: users })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.email || !body.name) {
      return NextResponse.json(
        { status: "error", message: "Email dan nama pengguna wajib diisi." },
        { status: 400 }
      )
    }

    const result = pasakStore.createUser({
      name: body.name,
      email: body.email,
      role: body.role || "User",
      plan: body.plan || "pro",
      serverQuota: body.serverQuota ? parseInt(body.serverQuota) : undefined,
      organization: body.organization,
      phone: body.phone,
    })

    return NextResponse.json({
      status: "success",
      message: "Pengguna baru dan license key berhasil dibuat.",
      data: result,
    })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.id) {
      return NextResponse.json({ status: "error", message: "ID pengguna diperlukan." }, { status: 400 })
    }

    const updated = pasakStore.updateUser(body.id, body.updates || {})
    if (!updated) {
      return NextResponse.json({ status: "error", message: "Pengguna tidak ditemukan." }, { status: 404 })
    }

    return NextResponse.json({ status: "success", data: updated })
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 })
  }
}
