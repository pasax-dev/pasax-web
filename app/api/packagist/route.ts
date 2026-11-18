import { NextResponse } from "next/server"
import { fetchPackagistData } from "@/lib/packagist"

export const dynamic = "force-dynamic"
export const revalidate = 60

/**
 * Dynamic Packagist API Route
 * Sourced directly from https://packagist.org/packages/pasax/secure-monitor.json
 */
export async function GET() {
  try {
    const data = await fetchPackagistData()
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dynamic Packagist data", details: String(error) },
      { status: 500 }
    )
  }
}
