<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Guidelines for `pasak-dashboard`

## 1. Project Overview & Foundational Context

This repository is **`pasak-dashboard`**, the central SaaS cloud monitoring console and control plane for the Pasak Security Ecosystem. It receives live telemetry, FIM tamper alerts, and WAF trips from connected `pasak-sentinel` Linux host daemons and provides an interactive Security Operations Center (SOC) web portal.

- **Framework**: Next.js `16.4+` (App Router, Turbopack)
- **Runtime**: React `19+`, Node.js `20+`
- **Design System**: **Neobrutalism UI** (`neobrutalism.dev`) with Base UI primitives and Tailwind CSS `v4`
- **Package Manager**: `pnpm` only

---

## 2. Neobrutalism Design System Invariants

All AI agents creating or editing UI components in this repository **MUST** adhere to the Neobrutalism aesthetic:

1. **High Contrast Borders**: Always use `border-2 border-border` for cards, dialogs, badges, and controls.
2. **Hard Box Shadows**: Always use `--shadow: 4px 4px 0px 0px var(--border);` (`shadow-shadow`). Never use diffuse/blurred drop shadows.
3. **Tactile Button Physics**: Buttons must depress on hover (`hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`).
4. **Bold Typography**: Heavy headers (`font-heading font-black`) combined with monospaced data badges and values.
5. **Vivid Color Accents**: Use `--main: hsl(204, 100%, 50%)` as the primary cyan brand color, paired with high-visibility alert badges.
6. **Component Registry**: Always prefer components in `components/ui/` installed from `neobrutalism.dev/r/*.json`.

---

## 3. CHANGELOG-First Discipline (MANDATORY FOR ALL AI AGENTS)

Whenever you add new pages, components, API endpoints, or modify dashboard behavior, you **MUST** update [`CHANGELOG.md`](./CHANGELOG.md) before concluding your turn:

1. Open `CHANGELOG.md`.
2. Record the change under the current unreleased version or target version header.
3. Categorize into standard sections:
   - `Added`: For new pages, UI components, or API routes.
   - `Changed`: For changes in existing UI/UX or data contracts.
   - `Fixed`: For bug fixes or layout repairs.
   - `Security`: For authentication, authorization, or security fixes.
4. Maintain clean, human-readable bullet points.

---

## 4. Skills & Workflow Automation

When performing tasks in this repository, activate the relevant skills in `.agents/skills/`:

1. **`neobrutalism-ui`** (`.agents/skills/neobrutalism-ui/SKILL.md`):
   - Activate when designing or modifying UI components, layout pages, dialogs, or color schemes.
2. **`dashboard-release`** (`.agents/skills/dashboard-release/SKILL.md`):
   - Activate when tagging versions, running pre-release verification, or updating the changelog.
3. **`activity-sync`** (`.agents/skills/activity-sync/SKILL.md`):
   - Activate when reporting user-facing release notes to the portfolio API (`ajoroby.is-a.dev`).

---

## 5. Verification & Testing Standards

Before completing any task, ensure that the codebase compiles with **zero errors**:

```bash
# 1. Strict TypeScript check (must output 0 errors)
pnpm typecheck

# 2. Next.js production build test (must compile successfully)
pnpm build
```

---

## 6. Directory Structure

```text
pasak-dashboard/
├── app/
│   ├── api/v1/              # Ingestion API routes (telemetry, threats, blocklist)
│   ├── dashboard/           # Main SOC monitoring dashboard page
│   ├── globals.css          # Neobrutalism CSS tokens and color definitions
│   ├── layout.tsx           # Root layout with ThemeProvider and fonts
│   └── page.tsx             # Root redirect to /dashboard
├── components/
│   ├── ui/                  # 60+ Neobrutalism UI components (neobrutalism.dev)
│   ├── app-sidebar.tsx      # Neobrutalism collapsible navigation sidebar
│   ├── chart-area-interactive.tsx # Interactive threat velocity area chart
│   ├── install-agent-dialog.tsx   # One-line provisioning modal
│   ├── pasak-operations-panel.tsx # 4-tab SOC operations matrix
│   ├── section-cards.tsx    # Fleet metric stat cards
│   └── site-header.tsx      # Top bar with live Sentinel mesh status
├── docs/                    # Authoritative 6-chapter documentation suite
├── lib/
│   ├── store.ts             # Shared in-memory and persistent state store
│   └── utils.ts             # Tailwind class merging helper (cn)
├── releases/                # Consolidated daily release JSON logs for portfolio sync
├── CHANGELOG.md             # Authoritative release changelog
└── AGENTS.md                # This operational guide for AI agents
```

---

## 7. Activity Sync — lapor kegiatan ke portfolio (WAJIB, berlaku ke depan)

Setiap selesai mengerjakan perubahan yang **dirasakan pengguna** (fitur baru, perbaikan bug, perubahan perilaku, rilis, deploy, atau UI baru) dan **sebelum melakukan push**, AI WAJIB:

1. **Tulis/perbarui berkas rilis** `releases/YYYY-MM-DD-*.json`:
   - Konsolidasi 1 berkas JSON per hari di folder `releases/`.
   - Wajib dwibahasa (`id` + `en`) dengan bahasa pelayanan publik (dilarang menyebut nama file kode teknis).
   - Format standar:
     ```json
     {
       "date": "YYYY-MM-DD",
       "type": "feature",
       "project": { "name": "Pasak Cloud Dashboard" },
       "title": { "id": "...", "en": "..." },
       "body": { "id": "...", "en": "..." },
       "items": [{ "type": "feature", "id": "...", "en": "..." }]
     }
     ```
2. **Kirim ke API Portfolio**:
   - Baca kunci `X-project` dari `.agents/skills/activity-sync/.ACTIVITY_PROJECT_KEYS`.
   - Jalankan perintah cURL:
     ```bash
     curl -s -X POST "https://ajoroby.is-a.dev/api/activities" \
       -H "Content-Type: application/json" \
       -H "X-project: <KEY_DARI_FILE>" \
       -d @releases/YYYY-MM-DD-*.json
     ```
3. **Verifikasi Hasil**:
   - Pastikan respons bernilai `{"ok": true, "id": ..., ...}`.
4. **Git Commit & Push**:
   - Setelah sync berhasil, lakukan commit dan push ke remote branch git.
