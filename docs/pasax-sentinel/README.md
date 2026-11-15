# Pasax Sentinel Documentation Suite

Welcome to the technical documentation for **Pasax Sentinel**, the high-performance, low-footprint Linux Host Security Daemon written in Go.

---

## Documentation Index

| Chapter | Document | Focus & Description |
| :--- | :--- | :--- |
| **01** | [Architecture & Runtime](./01-architecture.md) | Daemon lifecycle, low-memory footprint (<25MB), systemd service, and goroutine supervision. |
| **02** | [File Integrity Monitoring](./02-fim-controller.md) | Kernel inotify monitoring via `fsnotify`, `.env` protection, SHA-256 hash tracking, and automated `0600` locking. |
| **03** | [Unix Domain Socket IPC](./03-ipc-socket.md) | High-speed IPC (`/run/pasax/agent.sock`), sub-millisecond (<0.2ms) response time, and protocol commands. |
| **04** | [Kernel Firewall Drivers](./04-firewall-drivers.md) | `nftables` sets, `iptables` chains, atomic packet dropping, and mock driver for local development. |
| **05** | [Log Watcher & Tripping](./05-log-watcher.md) | Asynchronous tailing of Nginx & Apache logs, regex pattern matching, and automated threat banning. |
| **06** | [VHost & SSL Reconnaissance](./06-vhost-recon.md) | Dynamic inspection of webserver configurations, PHP-FPM upstream mapping, and X.509 SSL expiry watcher. |
| **07** | [Cloud Telemetry & Sync](./07-cloud-telemetry.md) | Heartbeat reporting, threat alert push, crowdsourced blocklist pulling, and offline FIFO buffering. |
| **08** | [AI Agent VPS Runbook & Prompting](./08-ai-agent-vps-runbook.md) | Autonomous prompt & runbook for AI agents running on VPS to audit, install, and link the security mesh. |
| **09** | [Installation & Deployment Guide](./09-installation-guide.md) | Complete one-line and manual installation guides for Linux servers and Laravel WAF wiring. |

---

## Quick Reference
- **Source Code**: `cmd/pasax-sentinel/main.go` & `internal/`
- **Config file**: `/etc/pasax/sentinel.yaml` (template: `config/sentinel.example.yaml`)
- **Socket Path**: `/run/pasax/agent.sock` (fallback: `/tmp/pasax/agent.sock`)
- **Unit File**: `scripts/pasax-sentinel.service`
- **Cloud Control Plane**: `https://pasax-service.vercel.app`
- **Public Market Portal**: `https://pasax-web.vercel.app`
