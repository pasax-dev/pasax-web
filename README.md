# Pasax Cloud Dashboard 🛡️

**Pasax Cloud** is the central SaaS monitoring console, intelligence hub, and Security Operations Center (SOC) for the **Pasax Security Ecosystem** (`pasax-suit`).

Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and the authentic **[Neobrutalism Design System](https://www.neobrutalism.dev/)**, Pasax Cloud unifies host-level Linux telemetry (`pasax-sentinel`), application-layer Laravel WAF tripwires (`pasax-dev/secure-monitor` / `Pasax\SecureMonitor`), and global crowdsourced threat intelligence into a single retro-modern command center.

---

## ✨ Features at a Glance

- 🖥️ **Server Fleet & Host Telemetry**: Real-time heartbeat monitoring of connected VPS nodes (CPU & RAM utilization bars, Linux distribution, uptime, and inotify FIM status).
- 🚨 **Real-Time Threat Incidents Feed**: Live searchable log of File Integrity Monitoring (FIM) tampered secrets (`.env`), WAF tripwire blocks, and directory traversal probes.
- 🔬 **Forensic Evidence Inspector**: Interactive modal inspecting raw incident JSON payloads, attacker IPs, process PIDs, and cryptographic SHA-256 before/after hash comparisons.
- 🌐 **VHost & SSL Reconnaissance**: Auto-discovered virtual hosts across Nginx and Apache2 instances with active SSL certificate expiration countdowns.
- 🔥 **Crowd Defense Blocklist**: Centralized malicious IP list automatically distributed and enforced across all client nodes at the kernel layer via `nftables` or `iptables`.
- ⚡ **One-Line Agent Provisioning**: Built-in modal generating one-click curl commands (`curl -sSL https://get.pasax.is-a.dev/install.sh | sudo bash ...`) to onboard new Linux servers in under 10 seconds.
- 🔌 **High-Throughput Ingestion REST APIs**: Native `/api/v1/` endpoints for `pasax-sentinel` heartbeats, WAF threat dispatches, and blocklist synchronization.

---

## 🎨 Neobrutalism Design System

The user interface follows the **[Neobrutalism](https://www.neobrutalism.dev/docs/installation)** design movement:

- **High-Contrast Borders**: Prominent 2px black borders (`border-2 border-border`).
- **Hard Box Shadows**: Zero-blur displacement shadows (`shadow-[4px_4px_0px_0px_var(--border)]`).
- **Tactile Button Physics**: Depresses upon hover (`hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`).
- **Vibrant Alert Color Palette**: Vivid cyan brand tone (`--main: hsl(204, 100%, 50%)`), warning yellows, and sharp alert reds.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `^20.0` or `^22.0`
- **Package Manager**: `pnpm` (recommended), `npm`, or `bun`

### 1. Installation

Clone the repository and install dependencies:

```bash
cd pasax-web
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the control plane.

### 3. Production Build & Typecheck

```bash
# Verify strict TypeScript compilation
pnpm typecheck

# Build optimized production bundle with Turbopack
pnpm build

# Start production server
pnpm start
```

---

## 🧩 Adding Neobrutalism Components

This project is configured with the remote [Neobrutalism Component Registry](https://www.neobrutalism.dev/docs/installation). To install new components into `components/ui/`:

```bash
# Example: Adding accordion, alert, or popover
pnpm dlx shadcn@latest add https://neobrutalism.dev/r/accordion.json --overwrite -y
```

### Component Usage Example

```tsx
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ShieldCard() {
  return (
    <Card className="rounded-base border-2 border-border bg-secondary-background shadow-shadow">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-bold">
          Server Protected
        </CardTitle>
        <Badge variant="success">100% ONLINE</Badge>
      </CardHeader>
      <CardContent>
        <Button variant="default" className="font-bold">
          View Audit Logs
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

## 📡 Control Plane Ingestion APIs

`pasax-web` provides REST endpoints designed for `pasax-sentinel` Go agents and `pasax-dev/secure-monitor` Laravel WAF instances:

| Method   | Endpoint                               | Description                                                          |
| :------- | :------------------------------------- | :------------------------------------------------------------------- |
| `POST`   | `/api/v1/nodes/telemetry`              | Ingests server CPU, RAM, uptime, and discovered Nginx/Apache vhosts. |
| `GET`    | `/api/v1/nodes`                        | Returns array of all active and monitored server nodes.              |
| `POST`   | `/api/v1/events/threat`                | Ingests real-time security events (FIM alerts, WAF blocks).          |
| `GET`    | `/api/v1/events/threat`                | Returns chronological feed of security incidents with limit filter.  |
| `GET`    | `/api/v1/threats/global-blocklist`     | Returns JSON array of string IPs to be banned in kernel `nftables`.  |
| `POST`   | `/api/v1/threats/global-blocklist`     | Adds an IP address to the global crowd defense blocklist.            |
| `DELETE` | `/api/v1/threats/global-blocklist?ip=` | Removes an IP address from the global blocklist.                     |

---

## 📚 Documentation & Ecosystem

- **Detailed Technical Documentation**: Explore the 6-chapter suite in [`docs/`](./docs/README.md).
- **Release Changelog**: Track all updates in [`CHANGELOG.md`](./CHANGELOG.md).
- **AI Agent Guidelines**: Operational invariants and rules in [`AGENTS.md`](./AGENTS.md).
- **Go Host Daemon**: Located in `../pasax-sentinel/`.
- **Laravel WAF Core**: Located in `../pasax-secure-monitor-laravel/` (Composer package: `pasax-dev/secure-monitor`, namespace: `Pasax\SecureMonitor`).

---

## 📄 License

Proprietary & Confidential — Part of the **Pasax Security Ecosystem** (`pasax-suit`).
