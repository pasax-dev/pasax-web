import { NextRequest, NextResponse } from "next/server"
import { pasaxStore } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, organization, phone } = body

    if (!email || !name) {
      return NextResponse.json(
        { status: "error", message: "Nama dan email wajib diisi untuk registrasi." },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()
    const existing = pasaxStore.getUser(cleanEmail)

    if (existing) {
      // User already exists
      return NextResponse.json(
        { status: "success", message: "Pengguna sudah terdaftar. Silakan login.", data: existing },
        { status: 200 }
      )
    }

    // Every registered user in Pasak gets the role "Admin" per core specification!
    const result = pasaxStore.createUser({
      name: name.trim(),
      email: cleanEmail,
      role: "Admin", // STRICTLY ADMIN
      plan: "pro", // 14-Day Pro Trial
      serverQuota: 10,
      organization: organization || `Armada ${name.trim()}`,
      phone: phone || "",
      assignedNodeIds: ["nd_01HW8P9Y124XQW7V6B9R41ZX9A"], // Default starter cluster
    })

    return NextResponse.json({
      status: "success",
      message: "Registrasi Administrator Pasak berhasil dengan akses Pro Trial 14 Hari.",
      data: {
        user: result.user,
        licenseKey: result.defaultKey.key,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message || "Gagal melakukan registrasi." },
      { status: 500 }
    )
  }
}
