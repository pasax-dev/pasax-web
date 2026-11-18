/**
 * Central Packagist and Ecosystem Version Authority
 * Pasax is an ecosystem group; versions belong strictly to each component:
 * - pasax-secure-monitor: Composer package on Packagist (pasax/secure-monitor)
 * - pasax-sentinel: Linux Kernel & FIM Go Daemon
 * - core / pasax-web: Control Plane & Web Portal
 */

export interface PackagistVersionInfo {
  version: string
  normalized: string
  time: string
  php: string
  laravel: string
  releaseNotesUrl: string
  summary: string
}

export interface PackagistData {
  name: string
  description: string
  latestVersion: string
  versions: string[]
  versionDetails: Record<string, PackagistVersionInfo>
  repository: string
  packagistUrl: string
  downloadsTotal: number
  downloadsMonthly?: number
  downloadsDaily?: number
  favers?: number
}

export const PACKAGIST_PACKAGE = "pasax/secure-monitor"
export const PACKAGIST_URL =
  "https://packagist.org/packages/pasax/secure-monitor"
export const GITHUB_MONITOR_REPO =
  "https://github.com/pasax-dev/pasax-secure-monitor-laravel"

export const KNOWN_VERSION_SUMMARIES: Record<string, string> = {
  "1.0.6":
    "Smart backups tanpa redundansi berkas, pembersihan penamaan paket resmi pasax/secure-monitor, dan perbaikan assertion pengujian CI.",
  "1.0.5":
    "Pencegahan pembuatan berkas cadangan redundant pada direktori config, routes, dan views jika konten berkas target tidak mengalami perubahan.",
  "1.0.4":
    "Deteksi dinamis nama package Composer terpasang pada command upgrade dan uninstall, serta perbaikan resolusi dependensi.",
  "1.0.3":
    "Mekanisme backward-compatibility alias (pasax_safe_class_alias) untuk mencegah collision kelas pada aplikasi host lawas.",
  "1.0.2":
    "Autoload src/compat.php langsung via composer.json, penyesuaian dependensi Laravel 12 & 13, auto-service provider discovery, dan mitigasi ReDoS.",
  "1.0.1":
    "Pendaftaran otomatis Facade Pasax, mode installer default tanpa prompt interaktif, isolasi token karantina, dan trait relasi Eloquent.",
  "1.0.0":
    "Rilis publik resmi Packagist: engine WAF murni PHP, zero NPM dependency, artisan CLI scanner, dan middleware interceptor.",
}

/**
 * Fallback Packagist data synced with live packagist.org payload
 */
export const FALLBACK_PACKAGIST_DATA: PackagistData = {
  name: "pasax/secure-monitor",
  description:
    "Pasax - enterprise-grade headless self-hosted WAF, threat detection engine, zero-tolerance blocking, stepped login lockout, and security auditing toolkit for Laravel.",
  latestVersion: "1.0.6",
  versions: ["1.0.6", "1.0.5", "1.0.4", "1.0.3", "1.0.2", "1.0.1", "1.0.0"],
  versionDetails: {
    "1.0.6": {
      version: "v1.0.6",
      normalized: "1.0.6.0",
      time: "2026-11-16T08:51:18Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl:
        "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.6",
      summary: KNOWN_VERSION_SUMMARIES["1.0.6"],
    },
    "1.0.5": {
      version: "v1.0.5",
      normalized: "1.0.5.0",
      time: "2026-11-16T08:18:09Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl:
        "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.5",
      summary: KNOWN_VERSION_SUMMARIES["1.0.5"],
    },
    "1.0.4": {
      version: "v1.0.4",
      normalized: "1.0.4.0",
      time: "2026-11-16T08:05:08Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl:
        "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.4",
      summary: KNOWN_VERSION_SUMMARIES["1.0.4"],
    },
    "1.0.3": {
      version: "v1.0.3",
      normalized: "1.0.3.0",
      time: "2026-11-16T07:58:51Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl:
        "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.3",
      summary: KNOWN_VERSION_SUMMARIES["1.0.3"],
    },
    "1.0.2": {
      version: "v1.0.2",
      normalized: "1.0.2.0",
      time: "2026-11-15T10:58:19Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl:
        "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.2",
      summary: KNOWN_VERSION_SUMMARIES["1.0.2"],
    },
    "1.0.1": {
      version: "v1.0.1",
      normalized: "1.0.1.0",
      time: "2026-11-15T10:42:35Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl:
        "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.1",
      summary: KNOWN_VERSION_SUMMARIES["1.0.1"],
    },
    "1.0.0": {
      version: "v1.0.0",
      normalized: "1.0.0.0",
      time: "2026-11-15T10:11:48Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl:
        "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.0",
      summary: KNOWN_VERSION_SUMMARIES["1.0.0"],
    },
  },
  repository: GITHUB_MONITOR_REPO,
  packagistUrl: PACKAGIST_URL,
  downloadsTotal: 14,
  downloadsMonthly: 14,
  downloadsDaily: 1,
  favers: 0,
}

/**
 * Fetch live dynamic data directly from Packagist API
 * URL: https://packagist.org/packages/pasax/secure-monitor.json
 */
export async function fetchPackagistData(): Promise<PackagistData> {
  try {
    const res = await fetch(
      "https://packagist.org/packages/pasax/secure-monitor.json",
      {
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      return FALLBACK_PACKAGIST_DATA
    }

    const json = await res.json()
    const pkg = json?.package
    if (!pkg) {
      return FALLBACK_PACKAGIST_DATA
    }

    const rawVersionsMap: Record<string, any> = pkg.versions || {}

    // Extract all release versions (excluding dev-*)
    const rawVersions = Object.keys(rawVersionsMap)
      .filter((v) => !v.includes("dev"))
      .map((v) => v.replace(/^v/, ""))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

    const versions =
      rawVersions.length > 0 ? rawVersions : FALLBACK_PACKAGIST_DATA.versions
    const latest = versions[0] || "1.0.6"

    const versionDetails: Record<string, PackagistVersionInfo> = {}

    for (const v of versions) {
      const raw = rawVersionsMap[`v${v}`] || rawVersionsMap[v] || {}
      const time =
        raw.time ||
        FALLBACK_PACKAGIST_DATA.versionDetails[v]?.time ||
        new Date().toISOString()
      const php = raw.require?.php || "^8.2 | ^8.3 | ^8.4 | ^8.5"
      const laravel = raw.require?.["illuminate/support"]
        ? raw.require["illuminate/support"]
            .replace(/\^/g, "")
            .replace(/\|/g, " · ")
        : "10.x - 13.x"
      const summary =
        KNOWN_VERSION_SUMMARIES[v] ||
        raw.description ||
        FALLBACK_PACKAGIST_DATA.versionDetails[v]?.summary ||
        `Pembaruan rilis resmi v${v} untuk pasax/secure-monitor.`

      versionDetails[v] = {
        version: `v${v}`,
        normalized: raw.version_normalized || `${v}.0`,
        time,
        php,
        laravel,
        releaseNotesUrl: `https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v${v}`,
        summary,
      }
    }

    return {
      name: pkg.name || PACKAGIST_PACKAGE,
      description: pkg.description || FALLBACK_PACKAGIST_DATA.description,
      latestVersion: latest,
      versions,
      versionDetails,
      repository: pkg.repository || GITHUB_MONITOR_REPO,
      packagistUrl: PACKAGIST_URL,
      downloadsTotal:
        pkg.downloads?.total ?? FALLBACK_PACKAGIST_DATA.downloadsTotal,
      downloadsMonthly: pkg.downloads?.monthly ?? 14,
      downloadsDaily: pkg.downloads?.daily ?? 1,
      favers: pkg.favers ?? 0,
    }
  } catch (err) {
    console.error("Failed to fetch live Packagist data:", err)
    return FALLBACK_PACKAGIST_DATA
  }
}

/**
 * Ecosystem Product Definitions
 * Pasax is an ecosystem group; each product has its own individual version.
 */
export interface EcosystemProductInfo {
  id: "pasax-secure-monitor" | "pasax-sentinel" | "core"
  name: string
  shortName: string
  source: "Packagist" | "Daemon" | "Platform"
  sourceLabel: string
  packageName?: string
  packageUrl?: string
  repoUrl: string
  latestVersion: string
  versions: string[]
}

export const ECOSYSTEM_PRODUCTS: Record<string, EcosystemProductInfo> = {
  "pasax-secure-monitor": {
    id: "pasax-secure-monitor",
    name: "Pasax Secure Monitor",
    shortName: "PHP WAF Shield",
    source: "Packagist",
    sourceLabel: "Packagist: pasax/secure-monitor",
    packageName: "pasax/secure-monitor",
    packageUrl: PACKAGIST_URL,
    repoUrl: GITHUB_MONITOR_REPO,
    latestVersion: "1.0.6",
    versions: ["1.0.6", "1.0.5", "1.0.4", "1.0.3", "1.0.2", "1.0.1", "1.0.0"],
  },
  "pasax-sentinel": {
    id: "pasax-sentinel",
    name: "Pasax Sentinel",
    shortName: "Kernel Daemon & FIM",
    source: "Daemon",
    sourceLabel: "Go Linux Kernel Daemon",
    repoUrl: "https://github.com/pasax-dev/pasax-sentinel",
    latestVersion: "1.0.0",
    versions: ["1.0.0"],
  },
  core: {
    id: "core",
    name: "Pasax Core Engine",
    shortName: "Mesh & Threat Ledger",
    source: "Platform",
    sourceLabel: "Cloud Platform & Control Plane",
    repoUrl: "https://github.com/pasax-dev/pasax-suit",
    latestVersion: "1.0.0",
    versions: ["1.0.0"],
  },
}

export function getEcosystemProduct(
  productId?: string,
  dynamicPackagist?: PackagistData | null
): EcosystemProductInfo {
  const base =
    productId && productId in ECOSYSTEM_PRODUCTS
      ? { ...ECOSYSTEM_PRODUCTS[productId] }
      : { ...ECOSYSTEM_PRODUCTS["pasax-secure-monitor"] }

  // If dynamic Packagist data is available and this is secure-monitor, inject live versions
  if (base.id === "pasax-secure-monitor" && dynamicPackagist) {
    base.latestVersion = dynamicPackagist.latestVersion
    base.versions = dynamicPackagist.versions
  }

  return base
}
