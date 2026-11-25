export interface ParsedUserAgent {
  osName: string
  osVersion: string
  browserName: string
  browserVersion: string
  browserEngine: string
  deviceType: "desktop" | "mobile" | "tablet" | "bot" | "unknown"
  deviceVendor: string
  deviceModel: string
  isMobile: boolean
  isBot: boolean
}

export function parseUserAgent(uaRaw: string): ParsedUserAgent {
  const ua = (uaRaw || "").trim()
  if (!ua) {
    return {
      osName: "Unknown",
      osVersion: "",
      browserName: "Unknown",
      browserVersion: "",
      browserEngine: "Unknown",
      deviceType: "unknown",
      deviceVendor: "",
      deviceModel: "",
      isMobile: false,
      isBot: false,
    }
  }

  // Bot detection
  const botMatch =
    /(googlebot|bingbot|yandexbot|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|whatsapp|telegrambot|slackbot|discordbot|curl|wget|python-requests|python-urllib|axios|node-fetch|undici|postman|insomnia|headlesschrome|lighthouse|playwright|puppeteer|crawler|spider|bot\/)/i.exec(
      ua
    )
  const isBot = Boolean(botMatch)

  // OS detection
  let osName = "Unknown"
  let osVersion = ""

  if (/Windows NT 10\.0/i.test(ua)) {
    osName = "Windows"
    osVersion = "10/11"
  } else if (/Windows NT 6\.3/i.test(ua)) {
    osName = "Windows"
    osVersion = "8.1"
  } else if (/Windows NT 6\.2/i.test(ua)) {
    osName = "Windows"
    osVersion = "8"
  } else if (/Windows NT 6\.1/i.test(ua)) {
    osName = "Windows"
    osVersion = "7"
  } else if (/Windows/i.test(ua)) {
    osName = "Windows"
  } else if (/Android/i.test(ua)) {
    osName = "Android"
    const m = /Android\s+([\d.]+)/i.exec(ua)
    osVersion = m ? m[1] : ""
  } else if (/iPhone OS|CPU OS|iPad; CPU OS|iOS/i.test(ua)) {
    osName = "iOS"
    const m = /(?:iPhone OS|CPU OS|CPU iPhone OS)\s+([\d_]+)/i.exec(ua)
    osVersion = m ? m[1].replace(/_/g, ".") : ""
  } else if (/Mac OS X|Macintosh/i.test(ua)) {
    osName = "macOS"
    const m = /Mac OS X\s+([\d_]+)/i.exec(ua)
    osVersion = m ? m[1].replace(/_/g, ".") : ""
  } else if (/CrOS/i.test(ua)) {
    osName = "ChromeOS"
  } else if (/Ubuntu/i.test(ua)) {
    osName = "Ubuntu Linux"
  } else if (/Fedora/i.test(ua)) {
    osName = "Fedora Linux"
  } else if (/Debian/i.test(ua)) {
    osName = "Debian Linux"
  } else if (/Linux/i.test(ua)) {
    osName = "Linux"
  }

  // Browser & engine detection
  let browserName = "Unknown"
  let browserVersion = ""
  let browserEngine = "Unknown"

  if (isBot && !/HeadlessChrome/i.test(ua)) {
    browserName = botMatch ? botMatch[1] : "Automated Bot"
    const vMatch = new RegExp(`${browserName}[/\\s]([\\d.]+)`, "i").exec(ua)
    browserVersion = vMatch ? vMatch[1] : ""
    browserEngine = "Bot"
  } else if (/EdgA?\/([\d.]+)/i.test(ua)) {
    const m = /EdgA?\/([\d.]+)/i.exec(ua)
    browserName = "Microsoft Edge"
    browserVersion = m?.[1] || ""
    browserEngine = "Blink"
  } else if (/OPR\/([\d.]+)|Opera\/([\d.]+)/i.test(ua)) {
    const m = /(?:OPR|Opera)\/([\d.]+)/i.exec(ua)
    browserName = "Opera"
    browserVersion = m?.[1] || ""
    browserEngine = "Blink"
  } else if (/SamsungBrowser\/([\d.]+)/i.test(ua)) {
    const m = /SamsungBrowser\/([\d.]+)/i.exec(ua)
    browserName = "Samsung Internet"
    browserVersion = m?.[1] || ""
    browserEngine = "Blink"
  } else if (/Firefox\/([\d.]+)/i.test(ua)) {
    const m = /Firefox\/([\d.]+)/i.exec(ua)
    browserName = "Mozilla Firefox"
    browserVersion = m?.[1] || ""
    browserEngine = "Gecko"
  } else if (/FxiOS\/([\d.]+)/i.test(ua)) {
    const m = /FxiOS\/([\d.]+)/i.exec(ua)
    browserName = "Firefox iOS"
    browserVersion = m?.[1] || ""
    browserEngine = "WebKit"
  } else if (/CriOS\/([\d.]+)/i.test(ua)) {
    const m = /CriOS\/([\d.]+)/i.exec(ua)
    browserName = "Chrome iOS"
    browserVersion = m?.[1] || ""
    browserEngine = "WebKit"
  } else if (/HeadlessChrome\/([\d.]+)/i.test(ua)) {
    const m = /HeadlessChrome\/([\d.]+)/i.exec(ua)
    browserName = "Headless Chrome"
    browserVersion = m?.[1] || ""
    browserEngine = "Blink"
  } else if (/Chrome\/([\d.]+)/i.test(ua) && !/Chromium/i.test(ua)) {
    const m = /Chrome\/([\d.]+)/i.exec(ua)
    browserName = /Brave/i.test(ua) ? "Brave" : "Google Chrome"
    browserVersion = m?.[1] || ""
    browserEngine = "Blink"
  } else if (/Chromium\/([\d.]+)/i.test(ua)) {
    const m = /Chromium\/([\d.]+)/i.exec(ua)
    browserName = "Chromium"
    browserVersion = m?.[1] || ""
    browserEngine = "Blink"
  } else if (/Safari\/([\d.]+)/i.test(ua) && /Version\/([\d.]+)/i.test(ua)) {
    const m = /Version\/([\d.]+)/i.exec(ua)
    browserName = "Safari"
    browserVersion = m?.[1] || ""
    browserEngine = "WebKit"
  } else if (/curl\/([\d.]+)/i.test(ua)) {
    const m = /curl\/([\d.]+)/i.exec(ua)
    browserName = "cURL"
    browserVersion = m?.[1] || ""
    browserEngine = "CLI"
  }

  // Device type, vendor & model
  let deviceType: ParsedUserAgent["deviceType"] = "desktop"
  let deviceVendor = ""
  let deviceModel = ""

  if (isBot) {
    deviceType = "bot"
  } else if (/iPad|Tablet|PlayBook|Silk|Kindle/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) {
    deviceType = "tablet"
  } else if (/Mobile|iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry/i.test(ua)) {
    deviceType = "mobile"
  }

  if (/iPhone/i.test(ua)) {
    deviceVendor = "Apple"
    deviceModel = "iPhone"
  } else if (/iPad/i.test(ua)) {
    deviceVendor = "Apple"
    deviceModel = "iPad"
  } else if (/Macintosh/i.test(ua)) {
    deviceVendor = "Apple"
    deviceModel = "Mac"
  } else if (/Android/i.test(ua)) {
    const androidModel = /Android\s+[\d.]+;\s*([^;)]+?)(?:\s+Build\/|[;)])/i.exec(ua)
    if (androidModel && androidModel[1] && androidModel[1] !== "K") {
      deviceModel = androidModel[1].trim()
      if (/^(SM-|SAMSUNG|Galaxy)/i.test(deviceModel)) deviceVendor = "Samsung"
      else if (/^(Redmi|POCO|Mi |Xiaomi|M2\d|2\d{3})/i.test(deviceModel)) deviceVendor = "Xiaomi"
      else if (/^(CPH|OPPO)/i.test(deviceModel)) deviceVendor = "OPPO"
      else if (/^(V\d|vivo)/i.test(deviceModel)) deviceVendor = "vivo"
      else if (/^(RMX|realme)/i.test(deviceModel)) deviceVendor = "realme"
      else if (/^(Pixel)/i.test(deviceModel)) deviceVendor = "Google"
      else if (/^(ASUS|ROG|Zenfone)/i.test(deviceModel)) deviceVendor = "ASUS"
      else deviceVendor = "Android Device"
    } else {
      deviceVendor = "Android"
    }
  } else if (/Windows/i.test(ua)) {
    deviceVendor = "PC"
    deviceModel = "Windows Workstation"
  } else if (/Linux/i.test(ua)) {
    deviceVendor = "PC"
    deviceModel = "Linux Workstation"
  }

  return {
    osName,
    osVersion,
    browserName,
    browserVersion,
    browserEngine,
    deviceType,
    deviceVendor,
    deviceModel,
    isMobile: deviceType === "mobile" || deviceType === "tablet",
    isBot,
  }
}

export function extractClientIp(headers: Headers): {
  ipAddress: string
  forwardedFor: string | null
} {
  const xff = headers.get("x-forwarded-for")
  const realIp =
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-vercel-forwarded-for") ||
    (xff ? xff.split(",")[0]?.trim() : null) ||
    "127.0.0.1"

  const normalized = realIp.replace(/^::ffff:/i, "").trim() || "127.0.0.1"
  return {
    ipAddress: normalized,
    forwardedFor: xff ? xff.slice(0, 512) : null,
  }
}

export function isPrivateOrLocalIp(ip: string): boolean {
  if (!ip) return true
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost" ||
    ip === "0.0.0.0" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd") ||
    ip.startsWith("fe80:")
  ) {
    return true
  }
  const match172 = /^172\.(\d+)\./.exec(ip)
  if (match172) {
    const second = Number(match172[1])
    if (second >= 16 && second <= 31) return true
  }
  return false
}

export interface GeoAddressResult {
  country: string | null
  countryCode: string | null
  region: string | null
  regionCode: string | null
  city: string | null
  district: string | null
  streetAddress: string | null
  fullAddress: string | null
  postalCode: string | null
  latitude: string | null
  longitude: string | null
  geoSource: string
  timezone: string | null
  currency: string | null
  isp: string | null
  asn: string | null
  org: string | null
  isProxy: boolean
  isHosting: boolean
}

function decodeHeaderVal(val: string | null): string | null {
  if (!val) return null
  try {
    return decodeURIComponent(val)
  } catch {
    return val
  }
}

export async function lookupGeoAndAddress(params: {
  ipAddress: string
  headers: Headers
  gpsLat?: number | string | null
  gpsLon?: number | string | null
  clientTimezone?: string | null
  isBot?: boolean
}): Promise<GeoAddressResult> {
  const { ipAddress, headers, gpsLat, gpsLon, clientTimezone, isBot = false } = params

  const result: GeoAddressResult = {
    country: null,
    countryCode: decodeHeaderVal(headers.get("x-vercel-ip-country")) || decodeHeaderVal(headers.get("cf-ipcountry")),
    region: decodeHeaderVal(headers.get("x-vercel-ip-country-region")),
    regionCode: decodeHeaderVal(headers.get("x-vercel-ip-country-region")),
    city: decodeHeaderVal(headers.get("x-vercel-ip-city")),
    district: null,
    streetAddress: null,
    fullAddress: null,
    postalCode: null,
    latitude: decodeHeaderVal(headers.get("x-vercel-ip-latitude")),
    longitude: decodeHeaderVal(headers.get("x-vercel-ip-longitude")),
    geoSource: headers.get("x-vercel-ip-country") ? "vercel_edge" : "ip",
    timezone: decodeHeaderVal(headers.get("x-vercel-ip-timezone")) || clientTimezone || null,
    currency: null,
    isp: null,
    asn: headers.get("x-vercel-ip-as-number") ? `AS${headers.get("x-vercel-ip-as-number")}` : null,
    org: null,
    isProxy: false,
    isHosting: false,
  }

  const isLocal = isPrivateOrLocalIp(ipAddress)

  // 1. Enrich from IP GeoIP when public IP
  if (!isLocal) {
    try {
      const geoRes = await fetch(`https://ipwho.is/${encodeURIComponent(ipAddress)}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(1600),
      })
      if (geoRes.ok) {
        const g = await geoRes.json()
        if (g && g.success !== false) {
          result.country = g.country || result.country
          result.countryCode = g.country_code || result.countryCode
          result.region = g.region || result.region
          result.regionCode = g.region_code || result.regionCode
          result.city = g.city || result.city
          result.postalCode = g.postal || result.postalCode
          result.latitude = g.latitude != null ? String(g.latitude) : result.latitude
          result.longitude = g.longitude != null ? String(g.longitude) : result.longitude
          result.timezone = g.timezone?.id || result.timezone
          result.currency = g.currency?.code || result.currency
          result.isp = g.connection?.isp || result.isp
          result.asn = g.connection?.asn ? `AS${g.connection.asn}` : result.asn
          result.org = g.connection?.org || result.org
          result.isProxy = Boolean(g.security?.proxy || g.security?.vpn || g.security?.tor)
          result.isHosting = Boolean(g.security?.hosting)
          if (result.geoSource === "ip") {
            result.geoSource = "ip_geoip"
          }
        }
      }
    } catch {
      // Ignore transient GeoIP lookup timeouts
    }
  } else if (gpsLat == null || gpsLon == null) {
    result.country = "Local Network"
    result.countryCode = "LAN"
    result.region = "Loopback / Private"
    result.city = "Localhost"
    result.fullAddress = "Localhost / Jaringan Lokal Privat"
    result.geoSource = "local_loopback"
    result.isp = "Local Loopback Interface"
  }

  // 2. If exact GPS coords provided by consented browser OR we have public lat/lon,
  //    resolve detailed street/district/postal/full address via OpenStreetMap Nominatim
  const hasGps =
    gpsLat !== undefined &&
    gpsLat !== null &&
    gpsLat !== "" &&
    gpsLon !== undefined &&
    gpsLon !== null &&
    gpsLon !== "" &&
    Number.isFinite(Number(gpsLat)) &&
    Number.isFinite(Number(gpsLon))

  const targetLat = hasGps ? String(gpsLat) : result.latitude
  const targetLon = hasGps ? String(gpsLon) : result.longitude

  if (hasGps) {
    result.latitude = String(gpsLat)
    result.longitude = String(gpsLon)
    result.geoSource = "browser_gps"
  }

  if (targetLat && targetLon && (!isBot || hasGps)) {
    try {
      const latNum = Number(targetLat)
      const lonNum = Number(targetLon)
      const cacheLat = Number.isFinite(latNum) ? latNum.toFixed(hasGps ? 4 : 3) : targetLat
      const cacheLon = Number.isFinite(lonNum) ? lonNum.toFixed(hasGps ? 4 : 3) : targetLon
      const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        cacheLat
      )}&lon=${encodeURIComponent(cacheLon)}&zoom=18&addressdetails=1`
      const nomRes = await fetch(nomUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "PasaxSecuritySuite/1.0 (https://pasax.web.id)",
        },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(1800),
      })
      if (nomRes.ok) {
        const n = await nomRes.json()
        const addr = n?.address || {}
        const road = [addr.road, addr.house_number].filter(Boolean).join(" ")
        const district =
          addr.suburb ||
          addr.village ||
          addr.neighbourhood ||
          addr.city_district ||
          addr.municipality ||
          addr.county ||
          null
        const city =
          addr.city ||
          addr.town ||
          addr.regency ||
          addr.state_district ||
          result.city
        const region = addr.state || addr.province || result.region
        const postal = addr.postcode || result.postalCode
        const country = addr.country || result.country
        const countryCode = addr.country_code
          ? String(addr.country_code).toUpperCase()
          : result.countryCode

        if (road) result.streetAddress = road
        if (district) result.district = district
        if (city) result.city = city
        if (region) result.region = region
        if (postal) result.postalCode = postal
        if (country) result.country = country
        if (countryCode) result.countryCode = countryCode
        if (n?.display_name) {
          result.fullAddress = n.display_name
        }
      }
    } catch {
      // Fallback to formatted string below
    }
  }

  if (!result.fullAddress) {
    const parts = [
      result.streetAddress,
      result.district,
      result.city,
      result.region,
      result.postalCode,
      result.country || result.countryCode,
    ].filter(Boolean)
    result.fullAddress = parts.length > 0 ? parts.join(", ") : null
  }

  return result
}

const SAFE_HEADER_KEYS = [
  "user-agent",
  "accept-language",
  "referer",
  "origin",
  "host",
  "dnt",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "sec-ch-ua-platform-version",
  "sec-ch-ua-model",
  "sec-ch-ua-arch",
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "cf-ipcountry",
  "x-vercel-ip-country",
  "x-vercel-ip-country-region",
  "x-vercel-ip-city",
  "x-vercel-ip-latitude",
  "x-vercel-ip-longitude",
  "x-vercel-ip-timezone",
  "x-vercel-ip-as-number",
]

export function sanitizeRequestHeaders(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of SAFE_HEADER_KEYS) {
    const val = headers.get(key)
    if (val) out[key] = val.slice(0, 500)
  }
  return out
}
