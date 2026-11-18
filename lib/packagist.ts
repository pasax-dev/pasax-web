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
}

export const PACKAGIST_PACKAGE = "pasax/secure-monitor"
export const PACKAGIST_URL = "https://packagist.org/packages/pasax/secure-monitor"
export const GITHUB_MONITOR_REPO = "https://github.com/pasax-dev/pasax-secure-monitor-laravel"

/**
 * Verified Packagist payload synced with:
 * https://packagist.org/packages/pasax/secure-monitor.json
 */
export const FALLBACK_PACKAGIST_DATA: PackagistData = {
  name: "pasax/secure-monitor",
  description:
    "Pasax - enterprise-grade headless self-hosted WAF, threat detection engine, zero-tolerance blocking, stepped login lockout, and security auditing toolkit for Laravel.",
  latestVersion: "1.0.2",
  versions: ["1.0.2", "1.0.1", "1.0.0"],
  versionDetails: {
    "1.0.2": {
      version: "v1.0.2",
      normalized: "1.0.2.0",
      time: "2026-11-15T10:58:19Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl: "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.2",
      summary:
        "Autoload src/compat.php, penyesuaian dependensi Laravel 12 & 13, perbaikan auto-service provider discovery, dan mitigasi ReDoS.",
    },
    "1.0.1": {
      version: "v1.0.1",
      normalized: "1.0.1.0",
      time: "2026-11-15T10:42:35Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl: "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.1",
      summary:
        "Perbaikan kompatibilitas migrasi SQLite & MySQL, trait HasPasaxSecurityRelations, dan isolasi token karantina.",
    },
    "1.0.0": {
      version: "v1.0.0",
      normalized: "1.0.0.0",
      time: "2026-11-15T10:11:48Z",
      php: "^8.2 | ^8.3 | ^8.4 | ^8.5",
      laravel: "10.x - 13.x",
      releaseNotesUrl: "https://github.com/pasax-dev/pasax-secure-monitor-laravel/releases/tag/v1.0.0",
      summary:
        "Rilis publik awal di Packagist: engine WAF murni PHP, zero NPM dependency, artisan CLI scanner, dan middleware interceptor.",
    },
  },
  repository: GITHUB_MONITOR_REPO,
  packagistUrl: PACKAGIST_URL,
  downloadsTotal: 14,
}

/**
 * Fetch live data from Packagist with fallback
 */
export async function fetchPackagistData(): Promise<PackagistData> {
  try {
    const res = await fetch("https://packagist.org/packages/pasax/secure-monitor.json", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return FALLBACK_PACKAGIST_DATA
    const json = await res.json()
    const pkg = json?.package
    if (!pkg) return FALLBACK_PACKAGIST_DATA

    const rawVersions = Object.keys(pkg.versions || {})
      .filter((v) => !v.includes("dev"))
      .map((v) => v.replace(/^v/, ""))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

    const versions = rawVersions.length > 0 ? rawVersions : FALLBACK_PACKAGIST_DATA.versions
    const latest = versions[0] || "1.0.2"

    return {
      name: pkg.name || FALLBACK_PACKAGIST_DATA.name,
      description: pkg.description || FALLBACK_PACKAGIST_DATA.description,
      latestVersion: latest,
      versions,
      versionDetails: FALLBACK_PACKAGIST_DATA.versionDetails,
      repository: pkg.repository || FALLBACK_PACKAGIST_DATA.repository,
      packagistUrl: PACKAGIST_URL,
      downloadsTotal: pkg.downloads?.total || FALLBACK_PACKAGIST_DATA.downloadsTotal,
    }
  } catch {
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
    latestVersion: "1.0.2",
    versions: ["1.0.2", "1.0.1", "1.0.0"],
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

export function getEcosystemProduct(productId?: string): EcosystemProductInfo {
  if (productId && productId in ECOSYSTEM_PRODUCTS) {
    return ECOSYSTEM_PRODUCTS[productId]
  }
  return ECOSYSTEM_PRODUCTS["pasax-secure-monitor"]
}
