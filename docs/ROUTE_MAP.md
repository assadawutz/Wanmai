# ROUTE MAP

Canonical route inventory is maintained in `lib/route-definitions.ts` and rendered through `pages/w/[workspaceId]/[[...slug]].tsx` with alias route support at `pages/app/[workspaceId]/[[...slug]].tsx`.

## SaaS Core (direct pages)

- `/signin`
- `/signup`
- `/forgot-password`
- `/invite/accept/[token]`
- `/onboarding`
- `/account/profile`
- `/account/security`
- `/account/preferences`
- `/account/notifications`
- `/account/billing`
- `/account/usage`

## Workspace Shell (workspace-scoped)

All routes below are available with workspace prefix `/w/[workspaceId]` and `/app/[workspaceId]`.

- `/home`
- `/recent`
- `/jobs`
- `/notifications`
- `/settings`
- `/intake`
- `/intake/queue`
- `/intake/library`
- `/intake/compare`
- `/intake/merge`
- `/intake/import-drive`
- `/intake/jobs`
- `/understand/reader`
- `/understand/reader/[sourceId]`
- `/understand/structure/[sourceId]`
- `/understand/entities`
- `/understand/source-trace`
- `/understand/summary`
- `/understand/insights`
- `/understand/validation`
- `/understand/compare`
- `/build/docs`
- `/build/docs/[docId]`
- `/build/sheets`
- `/build/sheets/[sheetId]`
- `/build/slides`
- `/build/slides/[deckId]`
- `/build/board`
- `/build/board/[boardId]`
- `/build/canvas`
- `/build/canvas/[canvasId]`
- `/build/flow`
- `/build/flow/[flowId]`
- `/build/mermaid`
- `/build/mermaid/[diagramId]`
- `/build/storyboard`
- `/build/storyboard/[storyId]`
- `/build/presentation`
- `/build/presentation/[presentationId]`
- `/review/preview`
- `/review/presentation`
- `/review/export`
- `/review/history`
- `/review/readiness`
- `/operate/issues`
- `/operate/raid`
- `/operate/decisions`
- `/operate/dependencies`
- `/operate/change-control`
- `/operate/resources`
- `/operate/timeline`
- `/operate/budget-impact`
- `/operate/approvals`
- `/operate/meetings-actions`
- `/operate/releases`
- `/operate/api-system-map`
- `/roles/pm`
- `/roles/technical`
- `/roles/sales`
- `/roles/executive`
- `/roles/proposal`
- `/system/runtime`
- `/system/integrations`
- `/system/privacy`
- `/system/settings`
- `/system/logs-jobs`
- `/system/theme-brand`
