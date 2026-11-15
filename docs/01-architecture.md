# Chapter 01: Architecture & Technical Foundations

## 1. Overview
`pasax-web` is the centralized SaaS cloud management portal and intelligence hub for the Pasax Security Ecosystem (`pasax-suit`). It ingests telemetry, audit metrics, and threat events from:
1. **Linux VPS Hosts** running the `pasax-sentinel` kernel daemon (Go + nftables + inotify FIM).
2. **Laravel Host Applications** running `pasax-dev/secure-monitor` (PHP + WAF + Stepped Login Throttling, namespace `Pasax\SecureMonitor`).

Security operators and incident responders utilize `pasax-web` for real-time visibility, automated fleet-wide IP blacklisting, forensic file integrity analysis, and virtual host inventory.

```
+-----------------------------------------------------------------------------------+
|                           PASAX DASHBOARD ARCHITECTURE                            |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                     Next.js 16 App Router (React 19)                        |  |
|  |   - /dashboard (Security Operations Console / SOC)                          |  |
|  |   - /docs/* (Dedicated Product Documentation Hub)                           |  |
|  |   - /api/v1/* (High-Throughput Telemetry & Threat Ingestion Endpoints)      |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|       +--------------------------------+-------------------------------+          |
|       |                                                                |          |
|  +----v-----------------------+                                   +----v-------+  |
|  | Neobrutalism UI Components |                                   | Dynamic    |  |
|  |  - Base UI Primitives      |                                   | State / DB |  |
|  |  - Tailwind CSS v4 Tokens  |                                   | (Memory &  |  |
|  |  - Recharts & Lucide Icons |                                   | Neon PG)   |  |
|  +----------------------------+                                   +------------+  |
+-----------------------------------------------------------------------------------+
                                         ^
                             HTTPS (Port 443) / REST API
                                         |
         +-------------------------------+-------------------------------+
         |                                                               |
+--------v-------------------------------+             +-----------------v---------+
| Host Layer: pasax-sentinel             |             | App Layer: Secure Monitor |
| - Linux Kernel Daemon (Go 1.24)        |             | - Laravel WAF & Throttler |
| - Sub-0.2ms nftables drop rules        | <========== | - pasax-dev/secure-monitor|
| - inotify File Integrity Monitor (FIM) |  Unix Sock  | - Pasax\SecureMonitor     |
| - /run/pasax/agent.sock bridge         |             | - Zero NPM, Pure PHP      |
+----------------------------------------+             +---------------------------+
```

## 2. Technology Stack
- **Framework**: Next.js 16.4 with Turbopack bundler.
- **UI Architecture**: React 19 Server & Client Components.
- **Styling**: Tailwind CSS v4 using modern `@theme inline` tokens.
- **Component Primitives**: Base UI (`@base-ui/react`) and Class Variance Authority (`cva`).
- **Data Visualization**: Recharts 3.8.
- **Icons**: Lucide React.
- **Package Manager**: pnpm.

## 3. Storage Layer
- High-performance in-memory cache shared across API routes (`lib/store.ts`).
- Ready for plug-and-play adapter to Neon Serverless PostgreSQL / ClickHouse for production multi-tenant deployments.
- Seeded out-of-the-box with realistic telemetry and threat history so development is instant without setup overhead.

## 4. Ecosystem Integration Pillars
The Pasax defense suite operates in three coordinated tiers:
1. **Application Shield (`pasax-dev/secure-monitor`)**:
   - Installed inside Laravel host applications under namespace `Pasax\SecureMonitor`.
   - Protects HTTP endpoints against SQL injection, XSS, remote shell uploads, and brute force credential attacks.
   - Forwards local block requests to Sentinel via `/run/pasax/agent.sock` and telemetry to Pasax Cloud via `PasaxCloudService`.
2. **Host & Kernel Sentinel (`pasax-sentinel`)**:
   - Runs as a systemd service on Linux VPS servers.
   - Drops attacker packets at the kernel network level before they hit web servers (Nginx/Apache/PHP-FPM).
   - Monitors `.env` and sensitive application files using inotify.
3. **Cloud Control Plane (`pasax-web` & `pasax-api`)**:
   - Aggregates multi-node and multi-app telemetry into an operational dashboard.
   - Maintains and distributes the global crowd defense blocklist.
