import { NextResponse } from "next/server"
import { getPasaxApiUrl } from "@/lib/pasax-cloud"

interface CachedRate {
  rate: number
  timestamp: string
  cachedAt: number
}

const rateCache = new Map<string, CachedRate>()
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const source = (searchParams.get("source") || "USD").toUpperCase()
  const target = (searchParams.get("target") || "IDR").toUpperCase()
  const cacheKey = `${source}_${target}`
  const now = Date.now()

  const cached = rateCache.get(cacheKey)
  if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
    return NextResponse.json({
      status: "success",
      provider: "Wise (TransferWise)",
      source,
      target,
      rate: cached.rate,
      inverseRate: cached.rate > 0 ? 1 / cached.rate : 0,
      timestamp: cached.timestamp,
      cached: true,
    })
  }

  // 1. Try remote pasax-service first if configured
  const apiUrl = getPasaxApiUrl()
  try {
    const res = await fetch(
      `${apiUrl}/api/v1/currency/rate?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 600 },
      }
    )
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data.rate === "number" && data.rate > 0) {
        rateCache.set(cacheKey, {
          rate: data.rate,
          timestamp: data.timestamp || new Date().toISOString(),
          cachedAt: now,
        })
        return NextResponse.json(data)
      }
    }
  } catch (err: any) {
    console.warn("[Currency Rate API] Remote pasax-service fetch failed:", err?.message)
  }

  // 2. Direct fetch to Wise Quotes API (live mid-market rate, unauthenticated)
  try {
    const quoteAmount = source === "USD" ? 100 : 1000000
    const res = await fetch("https://api.wise.com/v3/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sourceCurrency: source,
        targetCurrency: target,
        sourceAmount: quoteAmount,
      }),
      next: { revalidate: 600 },
    })

    if (res.ok) {
      const data = await res.json()
      if (typeof data.rate === "number" && data.rate > 0) {
        const timestamp = data.rateTimestamp || new Date().toISOString()
        rateCache.set(cacheKey, {
          rate: data.rate,
          timestamp,
          cachedAt: now,
        })

        return NextResponse.json({
          status: "success",
          provider: "Wise (TransferWise)",
          source,
          target,
          rate: data.rate,
          inverseRate: 1 / data.rate,
          timestamp,
          cached: false,
        })
      }
    }
  } catch (err: any) {
    console.warn("[Currency Rate API] Wise quotes fetch failed:", err?.message)
  }

  // 3. Fallback to open exchange rate API
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(source)}`, {
      next: { revalidate: 600 },
    })
    if (res.ok) {
      const data = await res.json()
      const rate = data?.rates?.[target]
      if (typeof rate === "number" && rate > 0) {
        const timestamp = data.time_last_update_utc || new Date().toISOString()
        rateCache.set(cacheKey, { rate, timestamp, cachedAt: now })
        return NextResponse.json({
          status: "success",
          provider: "ExchangeRate API (Fallback)",
          source,
          target,
          rate,
          inverseRate: 1 / rate,
          timestamp,
          cached: false,
        })
      }
    }
  } catch (err: any) {
    console.warn("[Currency Rate API] Fallback API failed:", err?.message)
  }

  // 4. Return cached if available
  if (cached) {
    return NextResponse.json({
      status: "success",
      provider: "Wise (TransferWise - Stale Cache)",
      source,
      target,
      rate: cached.rate,
      inverseRate: cached.rate > 0 ? 1 / cached.rate : 0,
      timestamp: cached.timestamp,
      cached: true,
    })
  }

  // 5. Ultimate fallback default
  const defaultRate =
    source === "USD" && target === "IDR"
      ? 18290.0
      : source === "IDR" && target === "USD"
        ? 1 / 18290.0
        : 1.0

  return NextResponse.json({
    status: "success",
    provider: "Default Static Rate",
    source,
    target,
    rate: defaultRate,
    inverseRate: 1 / defaultRate,
    timestamp: new Date().toISOString(),
    cached: false,
  })
}
