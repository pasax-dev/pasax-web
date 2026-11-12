---
name: dashboard-release
description: Standard release procedure for pasak-dashboard including CHANGELOG updating, TypeScript verification, and production build checks.
---

# `dashboard-release` Skill

Use this skill whenever tagging, bumping version, or deploying `pasak-dashboard`.

## 1. Release Invariant: CHANGELOG First
Before tagging or deploying:
1. Ensure [`CHANGELOG.md`](../../../CHANGELOG.md) has an entry for the target release.
2. Group all changes into `Added`, `Changed`, `Fixed`, or `Security`.
3. Date the release in `YYYY-MM-DD` ISO format.

## 2. Pre-Release Quality Gates
Run both verification steps:
```bash
# 1. Verify strict TypeScript types (0 errors allowed)
pnpm typecheck

# 2. Verify Next.js production build (Turbopack)
pnpm build
```

## 3. Production Deployment
Run `pnpm start` or containerize with standard Docker build.
Ensure environment variable `PORT` is passed if deploying behind a reverse proxy.
