import { NextRequest, NextResponse } from "next/server"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, organization, phone } = body

    if (!email || !name) {
      return NextResponse.json(
        {
          status: "error",
          message: "Nama dan email wajib diisi untuk registrasi.",
        },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()
    const existing = pasaxStore.getUser(cleanEmail)

    if (existing) {
      return NextResponse.json(
        {
          status: "success",
          message: "Pengguna sudah terdaftar. Silakan login.",
          data: existing,
        },
        { status: 200 }
      )
    }

    // Every registered user in Pasak gets the role "Admin" per core specification,
    // starting with an isolated clean fleet (0 nodes until they connect their own VPS).
    const result = pasaxStore.createUser({
      name: name.trim(),
      email: cleanEmail,
      role: "Admin",
      plan: "pro", // 14-Day Pro Trial
      serverQuota: 10,
      organization: organization || `Armada ${name.trim()}`,
      phone: phone || "",
      assignedNodeIds: [],
    })

    return NextResponse.json({
      status: "success",
      message:
        "Registrasi Administrator Pasak berhasil dengan akses Pro Trial 14 Hari.",
      data: {
        user: result.user,
        licenseKey: result.defaultKey.key,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message: err.message || "Gagal melakukan registrasi.",
      },
      { status: 500 }
    )
  }
}
