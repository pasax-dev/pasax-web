import { NextResponse } from "next/server"
import { getPasaxApiUrl } from "@/lib/pasax-cloud"
import { pasaxStore, PricingPlan } from "@/lib/store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isPublicOnly = searchParams.get("public") === "true"

  const apiUrl = getPasaxApiUrl()
  const targetEndpoint = isPublicOnly
    ? `${apiUrl}/api/v1/pricing`
    : `${apiUrl}/api/v1/pricing/all`

  try {
    const res = await fetch(targetEndpoint, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (err: any) {
    console.warn(
      "[Admin Pricing API] Remote pasax-service fetch failed:",
      err?.message
    )
  }

  // Fallback to local store
  const plans = pasaxStore.getPricingPlans()
  const filtered = isPublicOnly ? plans.filter((p) => p.isActive) : plans

  return NextResponse.json({
    status: "success",
    count: filtered.length,
    data: filtered,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || !body.name || !body.description) {
      return NextResponse.json(
        { status: "error", message: "Nama paket dan deskripsi wajib diisi" },
        { status: 400 }
      )
    }

    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          pasaxStore.upsertPricingPlan(json.data)
        }
        return NextResponse.json(json, { status: 201 })
      }
    } catch (err: any) {
      console.warn(
        "[Admin Pricing POST] Remote pasax-service failed:",
        err?.message
      )
    }

    // Local store fallback creation
    const planId =
      body.id ||
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    const created: PricingPlan = {
      id: planId,
      name: body.name,
      slug: body.slug || planId,
      category: body.category || "standard",
      badge: body.badge || undefined,
      description: body.description,
      targetAudience: body.targetAudience || undefined,
      vpsQuota: Number(body.vpsQuota || 1),
      appsPerVps: body.appsPerVps || "Unlimited",
      priceMonthlyIdr: Number(body.priceMonthlyIdr || 0),
      priceYearlyIdr: Number(body.priceYearlyIdr || 0),
      priceMonthlyUsd: Number(body.priceMonthlyUsd || 0),
      priceYearlyUsd: Number(body.priceYearlyUsd || 0),
      discountMonthlyPercent: body.discountMonthlyPercent
        ? Number(body.discountMonthlyPercent)
        : 0,
      discountYearlyPercent: body.discountYearlyPercent
        ? Number(body.discountYearlyPercent)
        : 0,
      isFirstPurchaseOnly: Boolean(body.isFirstPurchaseOnly),
      promoTag: body.promoTag || undefined,
      features: Array.isArray(body.features) ? body.features : [],
      highlightFeatures: Array.isArray(body.highlightFeatures)
        ? body.highlightFeatures
        : [],
      logRetentionDays: Number(body.logRetentionDays || 14),
      maxSeats: Number(body.maxSeats || 1),
      crowdDefenseSync: body.crowdDefenseSync || "1h",
      supportSla: body.supportSla || "Standard",
      complianceCert: body.complianceCert || undefined,
      isCustomQuote: Boolean(body.isCustomQuote),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      sortOrder: Number(body.sortOrder || 99),
    }

    pasaxStore.upsertPricingPlan(created)
    return NextResponse.json(
      {
        status: "success",
        message: "Paket harga berhasil ditambahkan",
        data: created,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || !body.id) {
      return NextResponse.json(
        { status: "error", message: "ID paket diperlukan untuk update" },
        { status: 400 }
      )
    }

    const apiUrl = getPasaxApiUrl()
    try {
      const res = await fetch(`${apiUrl}/api/v1/pricing/${body.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          pasaxStore.upsertPricingPlan(json.data)
        }
        return NextResponse.json(json)
      }
    } catch (err: any) {
      console.warn(
        "[Admin Pricing PATCH] Remote pasax-service failed:",
        err?.message
      )
    }

    // Local fallback update
    const updated = pasaxStore.upsertPricingPlan(body)
    return NextResponse.json({
      status: "success",
      message: "Paket berhasil diperbarui",
      data: updated,
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { status: "error", message: "ID paket diperlukan" },
      { status: 400 }
    )
  }

  const apiUrl = getPasaxApiUrl()
  try {
    const res = await fetch(`${apiUrl}/api/v1/pricing/${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      pasaxStore.deletePricingPlan(id)
      return NextResponse.json({
        status: "success",
        message: "Paket berhasil dihapus",
      })
    }
  } catch (err: any) {
    console.warn(
      "[Admin Pricing DELETE] Remote pasax-service failed:",
      err?.message
    )
  }

  pasaxStore.deletePricingPlan(id)
  return NextResponse.json({
    status: "success",
    message: "Paket berhasil dihapus",
  })
}
