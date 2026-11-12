# Chapter 01: Architecture & Technical Foundations

## 1. Overview
`pasak-dashboard` is the centralized SaaS cloud management portal and intelligence hub for the Pasak Ecosystem. It ingests telemetry and threat events from client VPS hosts running `pasak-sentinel` and provides security operators with real-time visibility and control.

```
+-------------------------------------------------------------------------+
|                         PASAK DASHBOARD ARCHITECTURE                    |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                  Next.js 16 App Router (React 19)                 |  |
|  |   - /dashboard (Security Operations Console)                      |  |
|  |   - /api/v1/* (High-Throughput Ingestion Endpoints)               |  |
|  +---------------------------------+---------------------------------+  |
|                                    |                                    |
|       +----------------------------+----------------------------+       |
|       |                                                         |       |
|  +----v-----------------------+                            +----v----+  |
|  | Neobrutalism UI Components |                            |  State  |  |
|  |  - Base UI Primitives      |                            |  Store  |  |
|  |  - Tailwind CSS v4 Tokens  |                            | (Memory |  |
|  |  - Lucide Icons            |                            | & JSON) |  |
|  +----------------------------+                            +---------+  |
+-------------------------------------------------------------------------+
                                     ^
                         HTTPS (Port 443) / REST
                                     |
                [ Pasak Sentinel Host Daemons across VPS ]
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
- Ready for plug-and-play adapter to PostgreSQL / ClickHouse for production multi-tenant deployments.
- Seeded out-of-the-box with realistic telemetry and threat history so development is instant without setup overhead.
