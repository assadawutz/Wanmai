# MASTER CODEX TASK

Wanmai is a Pages Router, local-first SaaS workspace with Wanmai domain workflows for intake, understanding, building, review, operations, and role workbenches.

## Delivery lock
- Maintain strict TypeScript and production build gate.
- Keep route map and prompt/rule registry as single source.
- Preserve degraded mode and history restore.

==================================================
16. COEXISTENCE + INTEGRATION RULE — SAAS AND WANMAI MUST BOTH WORK TOGETHER
==================================================

It is not enough for SaaS to work alone.
It is not enough for Wanmai to work alone.
The combined system must also work normally when both layers exist together.

The final product must satisfy all 3 conditions:
1. SaaS works normally by itself
2. Wanmai works normally by itself
3. SaaS + Wanmai work normally together as one integrated product

This is mandatory.

==================================================
17. INTEGRATED PRODUCT RULE
==================================================

The product is a combined platform.

That means:
- the SaaS shell must be usable
- the Wanmai product flow must be usable
- the bridge between SaaS and Wanmai must be usable
- navigation between both layers must be smooth
- no layer may break the other
- no shell may swallow the product
- no product route may bypass core workspace safety incorrectly
- no duplicate or conflicting navigation models may remain

The combined experience must feel like:
- one coherent app
- one workspace
- one navigation logic
- one state model
- one visual language
- one permission model
- one jobs/history/runtime model

==================================================
18. BOTH-ALONE + TOGETHER RULE
==================================================

The system must be valid in all of these modes:

MODE A — SAAS ONLY USAGE
User can:
- enter workspace
- open files/jobs/notifications/settings/team
- manage workspace/admin surfaces
- continue recent work
- open Wanmai

MODE B — WANMAI ONLY USAGE
User can:
- jump directly into Wanmai
- use Home / Intake / Understand / Build / Review / Operate / Roles / System
- continue current work fast
- avoid admin clutter

MODE C — COMBINED USAGE
User can:
- enter through SaaS
- jump into Wanmai
- return to SaaS
- continue work without losing context
- access shared files/jobs/history/runtime
- move naturally between platform and product
- use shared workspace context safely

All 3 modes must work.

==================================================
19. SHARED WORKSPACE CONTRACT
==================================================

SaaS and Wanmai must share the same workspace context correctly.

Shared workspace objects must behave consistently across both layers:
- workspace identity
- current user/session
- team/member access
- files
- jobs
- notifications where relevant
- history/snapshots where relevant
- runtime state where relevant
- integrations where relevant
- permissions where relevant

Do not create conflicting duplicated workspace states between SaaS and Wanmai.
Do not create separate fake parallel app worlds.

==================================================
20. NAVIGATION INTEGRATION RULE
==================================================

Navigation must work both separately and together.

Required behavior:
- SaaS entry opens platform shell
- Wanmai entry opens product flow directly
- SaaS must provide a strong Open Wanmai action
- Wanmai must provide a clear Back to Platform action where appropriate
- recent work from SaaS must deep-link into Wanmai artifacts correctly
- jobs/files/history opened from SaaS must connect to relevant Wanmai work where relevant
- no dead-end transitions
- no broken back navigation
- no context loss on switching between SaaS and Wanmai

==================================================
21. STATE / DATA INTEGRATION RULE
==================================================

The combined product must not break because SaaS and Wanmai use conflicting state models.

Rules:
- one workspace-scoped source of truth for persisted shared entities
- no duplicated conflicting route-local ownership of important workspace data
- no separate fake “SaaS state” and “Wanmai state” for the same persisted concepts
- UI state can be local
- persisted artifact state must remain canonical
- shared data contracts must be typed and consistent
- switching between SaaS and Wanmai must preserve current context safely

==================================================
22. SHARED SYSTEM SURFACES MUST WORK IN BOTH WORLDS
==================================================

These system surfaces must work properly from both SaaS and Wanmai contexts where relevant:
- files
- jobs
- runtime
- integrations
- privacy
- history/restore
- notifications/activity
- workspace settings

No system surface may break because it was built only for one side.

==================================================
23. UX COEXISTENCE RULE
==================================================

The two layers must coexist without harming usability.

SaaS must feel:
- structured
- clear
- operational
- light enough not to block work

Wanmai must feel:
- direct
- fast
- product-focused
- mobile-friendly
- ready to work in immediately

Together they must feel:
- cohesive
- not duplicated
- not confusing
- not over-wrapped
- not like two apps forced together badly

==================================================
24. MOBILE COEXISTENCE RULE
==================================================

This combined behavior must work on mobile too.

Mobile rules:
- entering SaaS must not bury Wanmai
- entering Wanmai must not lose workspace identity
- back/forth between platform and product must remain safe
- shared files/jobs/history/runtime must remain reachable
- no desktop-style wrapper complexity on mobile
- no broken deep-links between SaaS and Wanmai
- no oversized platform chrome blocking product use

==================================================
25. INTEGRATION GATES — REQUIRED
==================================================

Add explicit integration gates and do not pass the task unless they pass.

INTEGRATION GATES
- SaaS entry works
- Wanmai entry works
- SaaS -> Wanmai transition works
- Wanmai -> SaaS transition works
- current workspace context preserved
- recent work deep-links open correctly
- shared files usable from both layers
- shared jobs usable from both layers
- runtime state consistent across both layers
- settings/integrations/privacy accessible without shell break
- no duplicate navigation confusion
- no route registry UI exposed
- mobile transitions work
- desktop transitions work
- no context loss between layers

==================================================
26. FINAL ACCEPTANCE RULE
==================================================

The system is not complete if:
- SaaS works but Wanmai breaks
- Wanmai works but SaaS breaks
- both work alone but break when combined
- navigation between them is awkward
- state conflicts appear
- the user loses context between layers

The system is complete only when:
- SaaS works normally
- Wanmai works normally
- SaaS and Wanmai work normally together as one integrated product
