# Chapter 06: Ecosystem Integration & Laravel WAF (`pasak-dev/secure-monitor`)

## 1. Overview
The **Pasak Security Ecosystem** (`pasak-suit`) provides unified defense across the infrastructure stack:
- **Application Layer**: `pasak-dev/secure-monitor` (Laravel package, namespace `Pasak\SecureMonitor`)
- **Host & Kernel Layer**: `pasak-sentinel` (Go Linux daemon + nftables + inotify)
- **Management & SOC Plane**: `pasak-dashboard` (Next.js 16 + React 19) backed by `pasak-api`

This chapter details how Laravel applications protected by `pasak-dev/secure-monitor` seamlessly connect with both `pasak-sentinel` on the local VPS and `pasak-dashboard` in the cloud.

---

## 2. Package Specifications & Architecture

| Parameter | Specification |
| :--- | :--- |
| **Package Name** | `pasak-dev/secure-monitor` |
| **PHP Namespace** | `Pasak\SecureMonitor\` |
| **PHP Compatibility** | `^8.2 \| ^8.3 \| ^8.4 \| ^8.5` |
| **Laravel Compatibility** | `^10.0 \| ^11.0 \| ^12.0 \| ^13.0` |
| **Design Standard** | 100% Pure PHP & Decoupled Standalone Library (Zero NPM) |
| **Local Bridge** | Unix Domain Socket `/run/pasak/agent.sock` or `http://127.0.0.1:9099` |
| **Cloud Bridge** | `PasakCloudService` connecting to `https://pasak-api.vercel.app` |

---

## 3. Communication Pathways

```
+--------------------------------------------------------------------------------+
|                        LARAVEL HOST APPLICATION (PHP)                          |
|                                                                                |
|   HTTP Request                                                                 |
|        |                                                                       |
|   +----v-------------------------------------------------------------------+   |
|   | Pasak\SecureMonitor\Http\Middleware\PasakDetectSecurityThreats         |   |
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
| pasak-sentinel (Host Daemon)       |   | pasak-dashboard / pasak-api           |
| Path: /run/pasak/agent.sock        |   | Endpoint: /api/v1/events/threat       |
| Actions:                           |   | Headers:                              |
| - Drops IP via nftables kernel     |   |   X-Cloud-Key: psk_live_...           |
| - Defends all vhosts instantaneously|  | Actions:                              |
|                                    |   | - Live incident feed display          |
|                                    |   | - Aggregated attack analytics         |
|                                    |   | - Global crowd-defense sync           |
+------------------------------------+   +---------------------------------------+
```

---

## 4. Laravel Configuration (`config/pasak.php`)

In the host Laravel application, cloud telemetry and sentinel connectivity are configured in `.env` and `config/pasak.php`:

```env
# Enable Pasak WAF & Security Engine
PASAK_ENABLED=true
PASAK_BLOCK_ENFORCEMENT=true

# Connect to Pasak Cloud Dashboard
PASAK_CLOUD_ENABLED=true
PASAK_CLOUD_URL=https://pasak-api.vercel.app
PASAK_CLOUD_KEY=psk_live_8f9c2d14b901a1c3

# Local Sentinel Daemon Unix Socket
PASAK_SENTINEL_SOCKET=/run/pasak/agent.sock
```

### Key Service Classes in `Pasak\SecureMonitor`:
- **`Pasak\SecureMonitor\Services\PasakCloudService`**:
  Handles outbound HTTP heartbeats, app metadata (`APP_NAME`, `APP_URL`), and security log dispatches to the central dashboard.
- **`Pasak\SecureMonitor\Services\PasakSentinelBridge`**:
  Communicates with the local `pasak-sentinel` daemon via Unix Domain Socket (`/run/pasak/agent.sock`) to push instant IP drops to the kernel before web servers process future packets.
- **`Pasak\SecureMonitor\Facades\Pasak`**:
  Developer-facing facade for manual IP unblocking, whitelist checks, and tenant security status queries.

---

## 5. Backward-Compatibility Aliases

To maintain 100% compatibility for older applications migrating from legacy namespaces (`Internal\Pasak` or `Internal\SecurityMonitor`), the package ships with `src/compat.php` which automatically registers aliases:

```php
// Existing code using legacy namespaces continues to function:
use Internal\Pasak\Facades\Pasak;
use Internal\Pasak\Models\PasakBlockedIp;
use Internal\SecurityMonitor\Services\PasakService;
```

All classes seamlessly resolve to their canonical `Pasak\SecureMonitor` targets.
