# VERCEL RECONNECT STATUS

Date: 2026-04-09 (UTC)

## Current repository status

- `.vercel/project.json`: **missing** (not currently linked to a local Vercel project binding)
- `vercel.json`: present and normalized for Next.js Pages Router builds
- Canonical workspace route renderer is available with both `/w/[workspaceId]/[[...slug]]` and `/app/[workspaceId]/[[...slug]]`

## Reconnect playbook

1. Authenticate: `npx vercel login`
2. Link repository: `npx vercel link`
3. Configure environment variables from `.env.example`
4. Trigger production deployment: `npx vercel --prod`
5. Verify core paths:
   - `/`
   - `/app/<workspaceId>/home`
   - `/app/<workspaceId>/wanmai/review/readiness`

## Honest blocker handling

If authentication is unavailable in the current execution environment, deployment cannot be verified from this environment. In that case, keep all local gates green and run the reconnect playbook in an authenticated terminal.
