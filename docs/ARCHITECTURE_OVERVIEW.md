# ARCHITECTURE OVERVIEW

- `pages/`: route surfaces and workspace catch-all.
- `components/`: shared UI shell and modules.
- `lib/`: domain policies, rules, prompts, history, ingestion, export.
- `types/`: canonical workspace + agent schemas.
- `scripts/`: smoke checks.

State is persisted from `lib/workspace-context.tsx` using a persisted local-first context model.
