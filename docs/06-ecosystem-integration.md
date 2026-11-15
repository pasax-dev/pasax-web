# Chapter 06: Ecosystem Integration & Laravel WAF (`pasax-dev/secure-monitor`)

## 1. Overview
The **Pasax Security Ecosystem** (`pasax-suit`) provides unified defense across the infrastructure stack:
- **Application Layer**: `pasax-dev/secure-monitor` (Laravel package, namespace `Pasax\SecureMonitor`)
- **Host & Kernel Layer**: `pasax-sentinel` (Go Linux daemon + nftables + inotify)
- **Management & SOC Plane**: `pasax-web` (Next.js 16 + React 19) backed by `pasax-api`

This chapter details how Laravel applications protected by `pasax-dev/secure-monitor` seamlessly connect with both `pasax-sentinel` on the local VPS and `pasax-web` in the cloud.

---

## 2. Package Specifications & Architecture

| Parameter | Specification |
| :--- | :--- |
| **Package Name** | `pasax-dev/secure-monitor` |
| **PHP Namespace** | `Pasax\SecureMonitor\` |
| **PHP Compatibility** | `^8.2 \| ^8.3 \| ^8.4 \| ^8.5` |
| **Laravel Compatibility** | `^10.0 \| ^11.0 \| ^12.0 \| ^13.0` |
| **Design Standard** | 100% Pure PHP & Decoupled Standalone Library (Zero NPM) |
| **Local Bridge** | Unix Domain Socket `/run/pasax/agent.sock` or `http://127.0.0.1:9099` |
| **Cloud Bridge** | `PasaxCloudService` connecting to `https://pasax-service.vercel.app` |

---

## 3. Communication Pathways

```
+--------------------------------------------------------------------------------+
|                        LARAVEL HOST APPLICATION (PHP)                          |
|                                                                                |
|   HTTP Request                                                                 |
|        |                                                                       |
|   +----v-------------------------------------------------------------------+   |
|   | Pasax\SecureMonitor\Http\Middleware\PasaxDetectSecurityThreats         |   |
|   | - Payload Inspection (SQLi, XSS, Webshells, Path Traversal)            |   |
|   | - Stepped Login Lockout (1m -> 5m -> 30m -> 2h -> 24h)                |   |
|   | - Device-Level Quarantine on Shared NAT/Proxy                          |   |
|   +------------------------------------+-----------------------------------+   |
+----------------------------------------|---------------------------------------+
                                         |
                         +---------------+---------------+
                         |                               |
       (Local Kernel Offload: Sub-0.2ms)    (Cloud Telemetry & Fleet Alert)
                         |                               |
                         v                               v
+------------------------------------+   +---------------------------------------+
| pasax-sentinel (Host Daemon)       |   | pasax-web / pasax-api           |
| Path: /run/pasax/agent.sock        |   | Endpoint: /api/v1/events/threat       |
| Actions:                           |   | Headers:                              |
| - Drops IP via nftables kernel     |   |   X-Cloud-Key: psk_live_...           |
| - Defends all vhosts instantaneously|  | Actions:                              |
|                                    |   | - Live incident feed display          |
|                                    |   | - Aggregated attack analytics         |
|                                    |   | - Global crowd-defense sync           |
+------------------------------------+   +---------------------------------------+
```

---

## 4. Laravel Configuration (`config/pasax.php`)

In the host Laravel application, cloud telemetry and sentinel connectivity are configured in `.env` and `config/pasax.php`:

```env
# Enable Pasax WAF & Security Engine
PASAX_ENABLED=true
PASAX_BLOCK_ENFORCEMENT=true

# Connect to Pasax Cloud Dashboard
PASAX_CLOUD_ENABLED=true
PASAX_CLOUD_URL=https://pasax-service.vercel.app
PASAX_CLOUD_KEY=psk_live_8f9c2d14b901a1c3

# Local Sentinel Daemon Unix Socket
PASAX_SENTINEL_SOCKET=/run/pasax/agent.sock
```

### Key Service Classes in `Pasax\SecureMonitor`:
- **`Pasax\SecureMonitor\Services\PasaxCloudService`**:
  Handles outbound HTTP heartbeats, app metadata (`APP_NAME`, `APP_URL`), and security log dispatches to the central dashboard.
- **`Pasax\SecureMonitor\Services\PasaxSentinelBridge`**:
  Communicates with the local `pasax-sentinel` daemon via Unix Domain Socket (`/run/pasax/agent.sock`) to push instant IP drops to the kernel before web servers process future packets.
- **`Pasax\SecureMonitor\Facades\Pasax`**:
  Developer-facing facade for manual IP unblocking, whitelist checks, and tenant security status queries.

---

## 5. Backward-Compatibility Aliases

To maintain 100% compatibility for older applications migrating from legacy namespaces (`Internal\Pasax` or `Internal\SecurityMonitor`), the package ships with `src/compat.php` which automatically registers aliases:

```php
// Existing code using legacy namespaces continues to function:
use Internal\Pasax\Facades\Pasax;
use Internal\Pasax\Models\PasaxBlockedIp;
use Internal\SecurityMonitor\Services\PasaxService;
```

All classes seamlessly resolve to their canonical `Pasax\SecureMonitor` targets.

---

## 6. Automated Pentest Reports & Date Range Aggregation

Starting in v1.1.2+, `pasax-dev/secure-monitor` provides an automated server security hardening & penetration testing audit report engine in standard Markdown (`.md`):

- **Executive & Compliance Export**: Evaluates 42 server hardening parameters, SHA-256 file integrity status, webshell scanner results, and maps findings directly to **OWASP Top 10 (2021)** standards.
- **Date Range Recap Timeline**: Supports single date (`?date=YYYY-MM-DD`) and full date ranges (`?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`), automatically compiling daily threat breakdown timelines (`| Tanggal | Total | Kritis | Tinggi | Sedang | Rendah | Diblokir |`).
- **Dedicated Dashboard Panel**: Accessible via `/pasax/reports` with dual tab previews (live rendered HTML and raw Markdown) plus quick export modal triggers in `/pasax/server`.
- **REST API Endpoints**:
  - `GET /pasax/server/report/export?start_date=...&end_date=...`
  - `GET /api/pasax/server/report/export?start_date=...&end_date=...`
