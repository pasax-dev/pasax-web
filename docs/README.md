# Pasax Dashboard Documentation Suite

Welcome to the technical documentation for **Pasax Dashboard**, the central SaaS cloud console and monitoring control plane for the Pasax Ecosystem.

---

## Documentation Index

| Chapter | Document | Focus & Description |
| :--- | :--- | :--- |
| **01** | [Architecture & Tech Stack](./01-architecture.md) | Next.js 16 App Router, Turbopack, Tailwind CSS v4, Base UI, in-memory/JSON store, and 3-pillar ecosystem. |
| **02** | [Neobrutalism Design System](./02-neobrutalism-design-system.md) | Neobrutalism tokens, hard box-shadows, 2px borders, component variants, and styling rules. |
| **03** | [Cloud Ingestion API Reference](./03-api-reference.md) | REST endpoints for Sentinel telemetry (`/api/v1/nodes/telemetry`), threat alerts, and global blocklists. |
| **04** | [Security Operations Matrix](./04-operations-console.md) | Fleet overview, Threat incidents feed, VHost/SSL recon, and Crowd Defense blocklist. |
| **05** | [Agent Provisioning & Onboarding](./05-agent-provisioning.md) | Host registration workflow, one-line curl command generator, and token authentication. |
| **06** | [Ecosystem Integration & Laravel WAF](./06-ecosystem-integration.md) | Integration between `pasax-web`, `pasax-sentinel`, and `pasax-dev/secure-monitor` (`Pasax\SecureMonitor`). |

---

## Quick Reference
- **Frontend Framework**: Next.js `16.4+`, React `19+`, Tailwind CSS `v4`
- **UI Component Registry**: Neobrutalism Base-Vega (`neobrutalism.dev`)
- **Port**: Default `3000` (`pnpm dev` or `pnpm start`)
- **Key Commands**:
  ```bash
  # Start local development server
  pnpm dev

  # Run strict TypeScript typechecking
  pnpm typecheck

  # Run optimized production build
  pnpm build
  ```
