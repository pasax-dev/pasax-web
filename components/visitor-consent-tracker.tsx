"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Cookie,
  ShieldCheck,
  SlidersHorizontal,
  MapPin,
  X,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ConsentStatus = "pending" | "accepted_all" | "essential_only" | "custom"

interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  telemetry: boolean
  geolocation: boolean
}

const CONSENT_COOKIE_KEY = "pasax_cookie_consent"
const CONSENT_PREFS_STORAGE_KEY = "pasax_cookie_prefs_v1"
const VISITOR_ID_COOKIE_KEY = "pasax_visitor_id"

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const prefix = `${name}=`
  const parts = document.cookie.split(";")
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length))
    }
  }
  return null
}

function writeCookie(name: string, value: string, maxAgeDays = 365) {
  if (typeof document === "undefined") return
  const maxAge = maxAgeDays * 86400
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "sess_ssr"
  try {
    let sid = sessionStorage.getItem("pasax_visit_session_id")
    if (!sid) {
      sid = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
      sessionStorage.setItem("pasax_visit_session_id", sid)
    }
    return sid
  } catch {
    return `sess_${Date.now().toString(36)}`
  }
}

function getOrCreateVisitorId(allowPersistentCookie: boolean): string | null {
  if (typeof window === "undefined") return null
  const existing = readCookie(VISITOR_ID_COOKIE_KEY)
  if (existing) return existing
  if (!allowPersistentCookie) return null

  const newId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? `psk_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`
      : `psk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`
  writeCookie(VISITOR_ID_COOKIE_KEY, newId, 365)
  return newId
}

function getGpuRenderer(): string | null {
  try {
    const canvas = document.createElement("canvas")
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) return null
    const webgl = gl as WebGLRenderingContext
    const debugInfo = webgl.getExtension("WEBGL_debug_renderer_info")
    if (debugInfo) {
      const renderer = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      if (typeof renderer === "string" && renderer.trim()) {
        return renderer.trim().slice(0, 250)
      }
    }
    const fallback = webgl.getParameter(webgl.RENDERER)
    return typeof fallback === "string" ? fallback.slice(0, 250) : null
  } catch {
    return null
  }
}

async function collectClientTelemetry() {
  const nav = navigator as any
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection
  const search = new URLSearchParams(window.location.search || "")

  let uaHints: {
    architecture?: string
    deviceModel?: string
    osVersion?: string
    platform?: string
    uaDataBrands?: string[]
  } = {}

  if (nav.userAgentData?.getHighEntropyValues) {
    try {
      const high = await Promise.race([
        nav.userAgentData.getHighEntropyValues([
          "architecture",
          "model",
          "platform",
          "platformVersion",
          "fullVersionList",
        ]),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 250)),
      ])
      if (high) {
        uaHints = {
          architecture: high.architecture || undefined,
          deviceModel: high.model || undefined,
          osVersion: high.platformVersion || undefined,
          platform: high.platform || undefined,
          uaDataBrands: Array.isArray(high.fullVersionList)
            ? high.fullVersionList.map((b: any) => `${b.brand}/${b.version}`)
            : undefined,
        }
      }
    } catch {
      // Ignore client hints errors
    }
  }

  let batteryInfo: { level?: number; charging?: boolean } | null = null
  if (typeof nav.getBattery === "function") {
    try {
      const bat = await Promise.race([
        nav.getBattery(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 250)),
      ])
      if (bat) {
        batteryInfo = {
          level:
            typeof bat.level === "number" ? Math.round(bat.level * 100) : undefined,
          charging: typeof bat.charging === "boolean" ? bat.charging : undefined,
        }
      }
    } catch {
      // Ignore battery API restrictions
    }
  }

  let timezone: string | null = null
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null
  } catch {
    timezone = null
  }

  return {
    userAgent: navigator.userAgent,
    platform: uaHints.platform || navigator.platform || null,
    architecture: uaHints.architecture || null,
    deviceModel: uaHints.deviceModel || null,
    osVersion: uaHints.osVersion || null,
    uaDataBrands: uaHints.uaDataBrands || null,

    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio || 1,
    colorDepth: window.screen.colorDepth || null,
    cpuCores:
      typeof navigator.hardwareConcurrency === "number"
        ? navigator.hardwareConcurrency
        : null,
    deviceMemoryGb:
      typeof nav.deviceMemory === "number" ? String(nav.deviceMemory) : null,
    touchSupport:
      "ontouchstart" in window || (navigator.maxTouchPoints || 0) > 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    gpuRenderer: getGpuRenderer(),
    batteryInfo,

    language: navigator.language || null,
    languages: Array.isArray(navigator.languages) ? navigator.languages : [],
    timezone,
    connectionType: conn?.effectiveType || conn?.type || null,
    downlinkMbps:
      typeof conn?.downlink === "number" ? String(conn.downlink) : null,
    rttMs: typeof conn?.rtt === "number" ? conn.rtt : null,

    pagePath: window.location.pathname || "/",
    pageUrl: window.location.href,
    pageTitle: document.title || null,
    referrer: document.referrer || null,
    utmSource: search.get("utm_source"),
    utmMedium: search.get("utm_medium"),
    utmCampaign: search.get("utm_campaign"),
    cookiesEnabled: navigator.cookieEnabled !== false,
    doNotTrack:
      navigator.doNotTrack === "1" || (window as any).doNotTrack === "1",
    prefersColorScheme: window.matchMedia?.("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light",
  }
}

export function VisitorConsentTracker() {
  const pathname = usePathname()
  const [bannerOpen, setBannerOpen] = React.useState(false)
  const [showCustomize, setShowCustomize] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [prefs, setPrefs] = React.useState<ConsentPreferences>({
    essential: true,
    analytics: true,
    telemetry: true,
    geolocation: false,
  })

  const latestVisitIdRef = React.useRef<string | null>(null)
  const lastTrackedPathRef = React.useRef<string | null>(null)

  // Check stored cookie consent on mount & listen for manual reopen trigger
  React.useEffect(() => {
    const cookieVal = readCookie(CONSENT_COOKIE_KEY)
    if (!cookieVal) {
      setBannerOpen(true)
    } else {
      setBannerOpen(false)
      try {
        const savedPrefs = localStorage.getItem(CONSENT_PREFS_STORAGE_KEY)
        if (savedPrefs) {
          const parsed = JSON.parse(savedPrefs)
          setPrefs({
            essential: true,
            analytics: Boolean(parsed.analytics),
            telemetry: Boolean(parsed.telemetry),
            geolocation: Boolean(parsed.geolocation),
          })
        }
      } catch {
        // ignore storage errors
      }
    }

    const onOpenSettings = () => {
      setShowCustomize(true)
      setBannerOpen(true)
    }
    window.addEventListener("pasax:open-cookie-settings", onOpenSettings)
    return () => {
      window.removeEventListener("pasax:open-cookie-settings", onOpenSettings)
    }
  }, [])

  // Capture visitor visit per route navigation (deduped for React StrictMode)
  React.useEffect(() => {
    if (!pathname) return
    const routeKey = `${pathname}${typeof window !== "undefined" ? window.location.search : ""}`
    if (lastTrackedPathRef.current === routeKey) return
    try {
      const dedupKey = `pasax_vt_${routeKey}`
      const prevTs = Number(sessionStorage.getItem(dedupKey) || "0")
      if (prevTs && Date.now() - prevTs < 60_000) {
        lastTrackedPathRef.current = routeKey
        return
      }
      sessionStorage.setItem(dedupKey, String(Date.now()))
    } catch {
      // ignore storage restrictions
    }
    lastTrackedPathRef.current = routeKey

    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const cookieConsent = readCookie(CONSENT_COOKIE_KEY) as ConsentStatus | null
        const consentStatus: ConsentStatus =
          cookieConsent && ["accepted_all", "essential_only", "custom"].includes(cookieConsent)
            ? cookieConsent
            : "pending"

        let activePrefs: ConsentPreferences = {
          essential: true,
          analytics: consentStatus === "accepted_all",
          telemetry: consentStatus === "accepted_all",
          geolocation: false,
        }
        try {
          const rawPrefs = localStorage.getItem(CONSENT_PREFS_STORAGE_KEY)
          if (rawPrefs) {
            const p = JSON.parse(rawPrefs)
            activePrefs = {
              essential: true,
              analytics: Boolean(p.analytics),
              telemetry: Boolean(p.telemetry),
              geolocation: Boolean(p.geolocation),
            }
          }
        } catch {
          // ignore
        }

        const allowPersistent =
          consentStatus === "accepted_all" ||
          (consentStatus === "custom" && (activePrefs.analytics || activePrefs.telemetry))

        const visitorId = getOrCreateVisitorId(allowPersistent)
        const sessionId = getOrCreateSessionId()
        const clientData = await collectClientTelemetry()

        if (cancelled) return

        const res = await fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...clientData,
            visitorId,
            sessionId,
            consentStatus,
            consentPreferences: activePrefs,
          }),
        })

        if (res.ok) {
          const json = await res.json().catch(() => null)
          if (json?.id) {
            latestVisitIdRef.current = json.id
          }
        }
      } catch {
        // Non-blocking background telemetry
      }
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [pathname])

  const saveConsentChoice = async (
    nextStatus: Exclude<ConsentStatus, "pending">,
    nextPrefs: ConsentPreferences
  ) => {
    setIsSaving(true)
    try {
      writeCookie(CONSENT_COOKIE_KEY, nextStatus, 365)
      try {
        localStorage.setItem(CONSENT_PREFS_STORAGE_KEY, JSON.stringify(nextPrefs))
      } catch {
        // ignore
      }

      const allowPersistent =
        nextStatus === "accepted_all" ||
        (nextStatus === "custom" && (nextPrefs.analytics || nextPrefs.telemetry))

      let visitorId: string | null = null
      if (allowPersistent) {
        visitorId = getOrCreateVisitorId(true)
      } else {
        deleteCookie(VISITOR_ID_COOKIE_KEY)
      }

      let gpsLat: number | undefined
      let gpsLon: number | undefined

      if (nextPrefs.geolocation && "geolocation" in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 4500,
              maximumAge: 60000,
            })
          })
          gpsLat = pos.coords.latitude
          gpsLon = pos.coords.longitude
        } catch {
          // User denied or browser timed out — IP geo still captured on server
        }
      }

      const clientData = await collectClientTelemetry()
      const sessionId = getOrCreateSessionId()

      if (latestVisitIdRef.current) {
        await fetch("/api/visitors", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: latestVisitIdRef.current,
            visitorId,
            consentStatus: nextStatus,
            consentPreferences: nextPrefs,
            gpsLat,
            gpsLon,
            ...clientData,
          }),
        })
      } else {
        const res = await fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...clientData,
            visitorId,
            sessionId,
            consentStatus: nextStatus,
            consentPreferences: nextPrefs,
            gpsLat,
            gpsLon,
          }),
        })
        if (res.ok) {
          const json = await res.json().catch(() => null)
          if (json?.id) latestVisitIdRef.current = json.id
        }
      }

      setPrefs(nextPrefs)
      setBannerOpen(false)
      setShowCustomize(false)
    } finally {
      setIsSaving(false)
    }
  }

  if (!bannerOpen) return null

  return (
    <aside
      aria-label="Persetujuan Akses Cookie"
      data-testid="cookie-consent-banner"
      className={cn(
        "fixed right-4 bottom-10 z-[60] w-[calc(100vw-2rem)] max-w-md rounded-xl border-2 border-border bg-card/95 p-4 text-card-foreground shadow-2xl backdrop-blur-md",
        "sm:right-6 sm:bottom-11"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/15 text-amber-500">
            <Cookie className="size-4" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold tracking-wider text-amber-500 uppercase">
              COOKIE &amp; PRIVASI AKSES
            </p>
            <h2 className="font-heading text-sm font-bold text-foreground">
              Persetujuan Akses Cookie Pasax
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            saveConsentChoice("essential_only", {
              essential: true,
              analytics: false,
              telemetry: false,
              geolocation: false,
            })
          }
          aria-label="Tutup dan gunakan hanya cookie esensial"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
        Kami menggunakan cookie esensial untuk autentikasi serta telemetri
        kunjungan (alamat IP, lokasi wilayah, OS, browser, dan perangkat) guna
        menjaga keamanan SOC dan kualitas layanan. Baca detail di{" "}
        <Link
          href="/privacy"
          className="font-medium text-foreground underline underline-offset-4 hover:text-amber-500"
        >
          Kebijakan Privasi
        </Link>
        .
      </p>

      {showCustomize && (
        <div className="mt-3 space-y-2 rounded-lg border border-border bg-background/70 p-3 text-xs">
          <label className="flex items-start justify-between gap-3">
            <div>
              <span className="font-semibold text-foreground">
                Cookie Esensial &amp; Keamanan
              </span>
              <p className="text-[11px] text-muted-foreground">
                Wajib aktif untuk sesi login, preferensi tema, dan proteksi WAF.
              </p>
            </div>
            <span className="shrink-0 rounded border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-500">
              WAJIB
            </span>
          </label>

          <label className="flex cursor-pointer items-start justify-between gap-3 border-t border-border/60 pt-2">
            <div>
              <span className="font-semibold text-foreground">
                Analitik &amp; Telemetri Perangkat
              </span>
              <p className="text-[11px] text-muted-foreground">
                Menyimpan ID pengunjung, OS, browser, resolusi layar, dan rujukan.
              </p>
            </div>
            <input
              type="checkbox"
              checked={prefs.analytics && prefs.telemetry}
              onChange={(e) =>
                setPrefs((prev) => ({
                  ...prev,
                  analytics: e.target.checked,
                  telemetry: e.target.checked,
                }))
              }
              className="mt-0.5 size-4 accent-amber-500"
            />
          </label>

          <label className="flex cursor-pointer items-start justify-between gap-3 border-t border-border/60 pt-2">
            <div>
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <MapPin className="size-3 text-amber-500" />
                Lokasi Geografis Presisi
              </span>
              <p className="text-[11px] text-muted-foreground">
                Izinkan browser membagikan koordinat untuk akurasi alamat &amp; kota.
              </p>
            </div>
            <input
              type="checkbox"
              checked={prefs.geolocation}
              onChange={(e) =>
                setPrefs((prev) => ({
                  ...prev,
                  geolocation: e.target.checked,
                }))
              }
              className="mt-0.5 size-4 accent-amber-500"
            />
          </label>
        </div>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isSaving}
          data-testid="cookie-accept-all"
          onClick={() =>
            saveConsentChoice("accepted_all", {
              essential: true,
              analytics: true,
              telemetry: true,
              geolocation: prefs.geolocation,
            })
          }
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Check className="size-3.5" />
          <span>Terima Semua</span>
        </button>

        <button
          type="button"
          disabled={isSaving}
          data-testid="cookie-essential-only"
          onClick={() =>
            saveConsentChoice("essential_only", {
              essential: true,
              analytics: false,
              telemetry: false,
              geolocation: false,
            })
          }
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <ShieldCheck className="size-3.5" />
          <span>Esensial</span>
        </button>

        {showCustomize ? (
          <button
            type="button"
            disabled={isSaving}
            data-testid="cookie-save-custom"
            onClick={() => saveConsentChoice("custom", prefs)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 font-mono text-[11px] font-semibold text-amber-500 transition-colors hover:bg-amber-500/25 disabled:opacity-50"
          >
            Simpan Preferensi Kustom
          </button>
        ) : (
          <button
            type="button"
            disabled={isSaving}
            data-testid="cookie-customize-btn"
            onClick={() => setShowCustomize(true)}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-background px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            title="Atur Preferensi Cookie"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Atur</span>
          </button>
        )}
      </div>
    </aside>
  )
}
