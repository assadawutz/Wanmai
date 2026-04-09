# Wanmai

Wanmai is a production-oriented, local-first SaaS workspace built with **Next.js Pages Router + TypeScript strict + Tailwind v4**.
It combines SaaS workspace management and Wanmai domain workflows for source intake, understanding, build surfaces, operations, and readiness-gated output.

## Architecture

- **SaaS shell:** account/workspace/team/settings/notifications/jobs/usage/audit-ready structure.
- **Wanmai domain:** intake → understand → build → review → operate → role workbenches.
- **State model:** strongly typed root model in `types/workspace.ts`, persisted with defensive recovery.
- **Prompt/rule registry:** `lib/prompts.ts`, `lib/rules.ts`, `types/agents.ts`.

## Route map

Canonical route map is in `lib/route-definitions.ts` and reachable through `/w/[workspaceId]/[[...slug]]`.
See `docs/ROUTE_MAP.md` for route grouping.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment variables

Defined in `.env.example`:
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_DEFAULT_WORKSPACE`
- `WANMAI_STORAGE_MODE`

## Commands

- `npm run dev`
- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build`
- `npm run validate:all`
- `npm run smoke:routes`
- `npm run smoke:degraded`
- `npm run smoke:export`
- `npm run smoke:history`
- `npm run smoke:readiness`

## Quality gates

Use `npm run validate:all` and all `smoke:*` commands before deployment.

## Degraded mode

When runtime/integration fails, Wanmai remains usable with local-first persistence, warnings, and manual workflows.

## History / restore

Snapshots are available via review history; restore paths are guarded and preserve recoverability.

## Readiness / export

Readiness verdicts and validation policies must pass before external presentation/export.

## Vercel deployment

This repo includes `vercel.json`, `.vercelignore`, and `.env.example` for clean deployment.
Link and deploy with:

```bash
npx vercel link
npx vercel --prod
```

If Vercel auth is unavailable, keep local gates green and deploy once credentials are provided.
