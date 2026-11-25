import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pasaxCloud } from "@/lib/pasax-cloud"
import {
  extractClientIp,
  lookupGeoAndAddress,
  parseUserAgent,
  sanitizeRequestHeaders,
} from "@/lib/visitor-parser"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const headers = req.headers

    const { ipAddress, forwardedFor } = extractClientIp(headers)
    const userAgent =
      typeof body?.userAgent === "string" && body.userAgent.trim()
        ? body.userAgent.trim()
        : headers.get("user-agent") || "Unknown"

    const parsedUa = parseUserAgent(userAgent)

    // Client hints header fallback / enhancement
    const chPlatform = headers.get("sec-ch-ua-platform")?.replace(/"/g, "")
    const chArch = headers.get("sec-ch-ua-arch")?.replace(/"/g, "")
    const chModel = headers.get("sec-ch-ua-model")?.replace(/"/g, "")
    const chMobile = headers.get("sec-ch-ua-mobile")

    const [geo, session] = await Promise.all([
      lookupGeoAndAddress({
        ipAddress,
        headers,
        gpsLat: body?.gpsLat,
        gpsLon: body?.gpsLon,
        clientTimezone: typeof body?.timezone === "string" ? body.timezone : null,
        isBot: parsedUa.isBot,
      }),
      getServerSession(authOptions).catch(() => null),
    ])

    const rawHeaders = sanitizeRequestHeaders(headers)

    const payload = {
      visitorId: typeof body?.visitorId === "string" ? body.visitorId : null,
      sessionId: typeof body?.sessionId === "string" ? body.sessionId : null,
      consentStatus:
        typeof body?.consentStatus === "string" ? body.consentStatus : "pending",
      consentPreferences: body?.consentPreferences || {
        essential: true,
        analytics: false,
        telemetry: false,
        geolocation: false,
      },

      ipAddress,
      forwardedFor,
      isp: geo.isp,
      asn: geo.asn,
      org: geo.org,
      isProxy: geo.isProxy,
      isHosting: geo.isHosting,

      country: geo.country,
      countryCode: geo.countryCode,
      region: geo.region,
      regionCode: geo.regionCode,
      city: geo.city,
      district: geo.district,
      streetAddress: geo.streetAddress,
      fullAddress: geo.fullAddress,
      postalCode: geo.postalCode,
      latitude: geo.latitude,
      longitude: geo.longitude,
      geoSource: geo.geoSource,
      timezone: geo.timezone || (typeof body?.timezone === "string" ? body.timezone : null),
      currency: geo.currency,

      userAgent,
      osName:
        (typeof body?.osName === "string" && body.osName) ||
        parsedUa.osName ||
        chPlatform ||
        null,
      osVersion:
        (typeof body?.osVersion === "string" && body.osVersion) ||
        parsedUa.osVersion ||
        null,
      browserName:
        (typeof body?.browserName === "string" && body.browserName) ||
        parsedUa.browserName,
      browserVersion:
        (typeof body?.browserVersion === "string" && body.browserVersion) ||
        parsedUa.browserVersion,
      browserEngine: parsedUa.browserEngine,
      deviceType: parsedUa.deviceType,
      deviceVendor:
        (typeof body?.deviceVendor === "string" && body.deviceVendor) ||
        parsedUa.deviceVendor ||
        null,
      deviceModel:
        (typeof body?.deviceModel === "string" && body.deviceModel) ||
        chModel ||
        parsedUa.deviceModel ||
        null,
      platform:
        (typeof body?.platform === "string" && body.platform) ||
        chPlatform ||
        null,
      architecture:
        (typeof body?.architecture === "string" && body.architecture) ||
        chArch ||
        null,
      isMobile:
        chMobile === "?1" ? true : parsedUa.isMobile,
      isBot: parsedUa.isBot,

      screenResolution: body?.screenResolution || null,
      viewportSize: body?.viewportSize || null,
      pixelRatio: body?.pixelRatio != null ? String(body.pixelRatio) : null,
      colorDepth: body?.colorDepth ?? null,
      cpuCores: body?.cpuCores ?? null,
      deviceMemoryGb:
        body?.deviceMemoryGb != null ? String(body.deviceMemoryGb) : null,
      touchSupport: Boolean(body?.touchSupport),
      maxTouchPoints: body?.maxTouchPoints ?? 0,
      gpuRenderer: body?.gpuRenderer || null,
      batteryInfo: body?.batteryInfo || null,

      language:
        (typeof body?.language === "string" && body.language) ||
        headers.get("accept-language")?.split(",")[0] ||
        null,
      languages: Array.isArray(body?.languages) ? body.languages : [],
      connectionType: body?.connectionType || null,
      downlinkMbps:
        body?.downlinkMbps != null ? String(body.downlinkMbps) : null,
      rttMs: body?.rttMs ?? null,

      pagePath: typeof body?.pagePath === "string" ? body.pagePath : "/",
      pageUrl: typeof body?.pageUrl === "string" ? body.pageUrl : null,
      pageTitle: typeof body?.pageTitle === "string" ? body.pageTitle : null,
      referrer:
        (typeof body?.referrer === "string" && body.referrer) ||
        headers.get("referer") ||
        null,
      utmSource: body?.utmSource || null,
      utmMedium: body?.utmMedium || null,
      utmCampaign: body?.utmCampaign || null,
      cookiesEnabled: body?.cookiesEnabled !== false,
      doNotTrack:
        Boolean(body?.doNotTrack) || headers.get("dnt") === "1",
      authenticatedEmail: session?.user?.email?.toLowerCase() || null,
      authenticatedRole: (session?.user as any)?.role || null,

      rawHeaders,
      extraMetadata: {
        uaDataBrands: body?.uaDataBrands || null,
        prefersColorScheme: body?.prefersColorScheme || null,
        cookieConsentCookie:
          req.cookies.get("pasax_cookie_consent")?.value || null,
      },
    }

    const saved = await pasaxCloud.recordVisitor(payload)
    return NextResponse.json(
      {
        status: "success",
        id: saved?.id || null,
        ipAddress,
        country: geo.country,
        city: geo.city,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err?.message || "Failed to capture visitor" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body.id !== "string" || !body.id.trim()) {
      return NextResponse.json(
        { status: "error", message: "Visitor record id is required" },
        { status: 400 }
      )
    }

    const headers = req.headers
    const { ipAddress } = extractClientIp(headers)
    const session = await getServerSession(authOptions).catch(() => null)

    const updatePayload: Record<string, unknown> = {
      consentStatus: body.consentStatus,
      consentPreferences: body.consentPreferences,
      visitorId: body.visitorId,
      screenResolution: body.screenResolution,
      viewportSize: body.viewportSize,
      pixelRatio: body.pixelRatio,
      colorDepth: body.colorDepth,
      cpuCores: body.cpuCores,
      deviceMemoryGb: body.deviceMemoryGb,
      touchSupport: body.touchSupport,
      maxTouchPoints: body.maxTouchPoints,
      gpuRenderer: body.gpuRenderer,
      batteryInfo: body.batteryInfo,
      language: body.language,
      languages: body.languages,
      connectionType: body.connectionType,
      downlinkMbps: body.downlinkMbps,
      rttMs: body.rttMs,
      architecture: body.architecture,
      deviceModel: body.deviceModel,
      osVersion: body.osVersion,
      authenticatedEmail: session?.user?.email?.toLowerCase() || undefined,
      authenticatedRole: (session?.user as any)?.role || undefined,
    }

    if (body.gpsLat != null && body.gpsLon != null) {
      const geo = await lookupGeoAndAddress({
        ipAddress,
        headers,
        gpsLat: body.gpsLat,
        gpsLon: body.gpsLon,
        clientTimezone: typeof body.timezone === "string" ? body.timezone : null,
      })
      Object.assign(updatePayload, {
        country: geo.country,
        countryCode: geo.countryCode,
        region: geo.region,
        regionCode: geo.regionCode,
        city: geo.city,
        district: geo.district,
        streetAddress: geo.streetAddress,
        fullAddress: geo.fullAddress,
        postalCode: geo.postalCode,
        latitude: geo.latitude,
        longitude: geo.longitude,
        geoSource: geo.geoSource,
        timezone: geo.timezone,
      })
    }

    const updated = await pasaxCloud.updateVisitor(body.id, updatePayload)
    return NextResponse.json({
      status: "success",
      data: updated,
    })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err?.message || "Failed to update visitor" },
      { status: 500 }
    )
  }
}
