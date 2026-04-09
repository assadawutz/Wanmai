export interface RouteDefinition {
  title: string;
  description: string;
  nextStep: string;
  featureKey: string;
}

const define = (title: string, description: string, nextStep: string, featureKey: string): RouteDefinition => ({
  title,
  description,
  nextStep,
  featureKey
});

export const routeDefinitions: Record<string, RouteDefinition> = {
  '/': define('Wanmai Command Home', 'Workspace entry with suggested actions, recent work, jobs, and readiness pulse.', 'Open intake to add a source file and start the loop.', 'home'),
  '/home': define('Command Home', 'Workspace snapshot, actions, and status.', 'Pick a suggested action and continue.', 'home'),
  '/recent': define('Recent Work', 'Quick access to recently edited artifacts and workspaces.', 'Open the latest artifact and continue editing.', 'home'),
  '/jobs': define('Jobs', 'Background pipeline jobs and retries.', 'Resolve failed jobs first.', 'logsJobs'),
  '/notifications': define('Notifications', 'Actionable runtime, validation, and approval alerts.', 'Open persistent warning items and resolve blockers.', 'logsJobs'),
  '/settings': define('Settings', 'Global preferences for theme, density, and behavior.', 'Save defaults for daily use.', 'integrations'),

  '/intake': define('Intake Hub', 'Universal intake with upload, parse, normalize, and validation loop.', 'Upload a file and review parser confidence.', 'intake'),
  '/intake/queue': define('Upload Queue', 'Queue states across classifying, parsing, and validating.', 'Retry failed ingestion jobs or continue.', 'parseNormalize'),
  '/intake/library': define('File Library', 'Source library with metadata, confidence, and status.', 'Select source files for compare or merge.', 'intake'),
  '/intake/compare': define('Version Compare', 'Compare source versions, summaries, and structural changes.', 'Approve which version should remain canonical.', 'sourceTrace'),
  '/intake/merge': define('Source Merge', 'Merge related sources while preserving traceability.', 'Pick merge strategy and validate conflicts.', 'parseNormalize'),
  '/intake/import-drive': define('Drive Import', 'Google Drive import in safe local-first mode.', 'Connect or fallback to manual upload.', 'integrations'),
  '/intake/jobs': define('Ingestion Jobs', 'Ingestion progress with warnings and retries.', 'Resolve failed extraction jobs.', 'logsJobs'),

  '/understand/reader': define('Universal Reader', 'Source reader with extraction and evidence mapping.', 'Open a source and pin evidence.', 'reader'),
  '/understand/reader/[sourceId]': define('Reader Detail', 'Source-specific reader view with extraction state.', 'Validate high-impact claims with trace links.', 'reader'),
  '/understand/structure/[sourceId]': define('Extracted Structure', 'Section and block hierarchy extracted from source.', 'Confirm structure and fix low-confidence blocks.', 'extractedStructure'),
  '/understand/entities': define('Entity Explorer', 'Entities, metrics, terms, and relationships.', 'Confirm ambiguous entities.', 'entityExplorer'),
  '/understand/source-trace': define('Source Trace', 'Claim-to-source mapping and evidence confidence.', 'Link unresolved claims before sharing.', 'sourceTrace'),
  '/understand/summary': define('Deep Summary', 'Facts, interpretation, risks, and recommendations.', 'Promote validated insights to build surfaces.', 'deepSummary'),
  '/understand/insights': define('Insights', 'Pros/cons, risks/gaps, and recommendation lens.', 'Convert insights into actions.', 'insights'),
  '/understand/validation': define('Confidence / Validation', 'Validation panel for unresolved and weak evidence.', 'Fix blockers before export.', 'validation'),
  '/understand/compare': define('Compare Center', 'Cross-source and cross-summary compare center.', 'Finalize differences and update decisions.', 'sourceTrace'),

  '/build/docs': define('Smart Docs', 'Source-grounded document authoring and readiness checks.', 'Edit structure and validate evidence blocks.', 'smartDocs'),
  '/build/docs/[docId]': define('Document Editor', 'Document detail editor with autosave and preview.', 'Finalize draft then run readiness.', 'smartDocs'),
  '/build/sheets': define('Smart Sheets', 'Grid, KPI rail, and compare-friendly model table.', 'Validate formulas and anomalies.', 'smartSheets'),
  '/build/sheets/[sheetId]': define('Sheet Editor', 'Sheet detail with readonly fallback mode.', 'Resolve warnings and publish snapshot.', 'smartSheets'),
  '/build/slides': define('Smart Slides', 'Narrative deck building with audience framing.', 'Balance slide density and flow.', 'smartSlides'),
  '/build/slides/[deckId]': define('Deck Editor', 'Slide editor with notes and preview.', 'Tune transitions and key takeaways.', 'smartSlides'),
  '/build/board': define('Visual Board Studio', 'Widget board for operational visibility.', 'Group cards and clean hierarchy.', 'visualBoard'),
  '/build/board/[boardId]': define('Board Editor', 'Board detail with linked cards and inspector.', 'Reduce clutter and add source links.', 'visualBoard'),
  '/build/canvas': define('Workspace Canvas', 'Freeform visual map for artifacts and plans.', 'Arrange blocks and preserve last valid layout.', 'workspaceCanvas'),
  '/build/canvas/[canvasId]': define('Canvas Editor', 'Canvas detail with grouping and resize tools.', 'Confirm mobile readability.', 'workspaceCanvas'),
  '/build/flow': define('Flow Studio', 'Node and edge process design workspace.', 'Run flow validation overlay.', 'flowStudio'),
  '/build/flow/[flowId]': define('Flow Editor', 'Flow detail with export-safe checks.', 'Resolve loop/conflict warnings.', 'flowStudio'),
  '/build/mermaid': define('Mermaid Studio', 'Mermaid code and render split view.', 'Fix syntax and preserve last valid render.', 'mermaidStudio'),
  '/build/mermaid/[diagramId]': define('Mermaid Editor', 'Diagram-specific Mermaid surface.', 'Resolve render warnings and retry.', 'mermaidStudio'),
  '/build/storyboard': define('Storyboard Studio', 'Scene cards, transitions, and narrative lanes.', 'Sequence scenes then promote to slides.', 'storyboardStudio'),
  '/build/storyboard/[storyId]': define('Storyboard Editor', 'Storyboard detail with scene inspector.', 'Fix weak transitions before presentation.', 'storyboardStudio'),
  '/build/presentation': define('Presentation Builder', 'Build presentation from workspace context and sources.', 'Generate storyline and run readiness.', 'presentationBuilder'),
  '/build/presentation/[presentationId]': define('Presentation Editor', 'Presentation detail with presenter-safe view.', 'Finalize speaker notes and export.', 'presentationBuilder'),

  '/operate/issues': define('Issues Center', 'Issue triage, assignment, and escalation board.', 'Assign owner and due date.', 'issues'),
  '/operate/raid': define('RAID Center', 'Risk, assumption, issue, and dependency management.', 'Add mitigation for high-severity risks.', 'raid'),
  '/operate/decisions': define('Decision Log', 'Decision history with rationale and trace links.', 'Record approval outcome.', 'decisions'),
  '/operate/dependencies': define('Dependency Studio', 'Dependency mapping and conflict detection.', 'Resolve blockers on critical path.', 'dependencies'),
  '/operate/change-control': define('Change Control', 'Change requests and impact validation.', 'Approve, reject, or request clarification.', 'changes'),
  '/operate/resources': define('Resource Planner', 'Capacity and assignment balancing surface.', 'Rebalance overloaded owners.', 'resources'),
  '/operate/timeline': define('Timeline / Gantt', 'Milestone and sequencing overview.', 'Update risk tags on delayed milestones.', 'timeline'),
  '/operate/budget-impact': define('Budget / Impact', 'Budget variance and impact analysis.', 'Confirm corrective action for variance.', 'budget'),
  '/operate/approvals': define('Approval Center', 'Pending approvals and blockers.', 'Resolve persistent approval blockers.', 'approvals'),
  '/operate/meetings-actions': define('Meeting / Action Hub', 'Meeting transcript to action extraction.', 'Assign owners to extracted actions.', 'meetingActionHub'),
  '/operate/releases': define('Release / Environment Board', 'Release state, gates, and environment checks.', 'Clear release blockers.', 'releaseBoard'),
  '/operate/api-system-map': define('API / System Map', 'System topology and integration map.', 'Validate critical integration links.', 'apiSystemMap'),

  '/roles/pm': define('PM Ops', 'PM workbench for delivery, blockers, and decisions.', 'Resolve overdue actions.', 'pmOps'),
  '/roles/technical': define('Technical Ops', 'Technical manager workbench for reliability and debt.', 'Prioritize technical risks.', 'technicalOps'),
  '/roles/sales': define('Sales Ops', 'Sales workbench aligned with delivery and proposals.', 'Update commitment risks.', 'salesOps'),
  '/roles/executive': define('Executive Cockpit', 'Executive rollup with readiness and risk signals.', 'Review escalations and decisions.', 'executiveCockpit'),
  '/roles/proposal': define('Proposal Workspace', 'Proposal builder with source-backed claims.', 'Polish narrative and evidence.', 'proposalWorkspace'),

  '/review/preview': define('Preview Hub', 'Unified preview across artifacts and viewports.', 'Run desktop + mobile preview.', 'previewHub'),
  '/review/presentation': define('Presentation Mode', 'Audience and presenter display modes.', 'Run readiness before presenting.', 'presentationMode'),
  '/review/export': define('Export Center', 'Packaging and export retry center.', 'Validate export options before run.', 'exportCenter'),
  '/review/history': define('History / Restore', 'Snapshot history and guarded restore.', 'Restore latest stable snapshot if needed.', 'historyRestore'),
  '/review/readiness': define('Readiness Scores', 'Share-readiness verdict, gaps, and fix path.', 'Address not-ready findings exactly.', 'readinessScores'),

  '/system/runtime': define('AI Runtime', 'Provider runtime status and degraded mode handling.', 'Retry runtime and keep local-safe mode ready.', 'aiRuntime'),
  '/system/integrations': define('Integrations', 'Google, Drive, and external integration states.', 'Re-verify failed integrations.', 'integrations'),
  '/system/privacy': define('Privacy / Redaction', 'Redaction and privacy safety controls.', 'Run redaction before sharing.', 'privacyRedaction'),
  '/system/settings': define('Workspace Settings', 'Theme, brand, density, and motion controls.', 'Save defaults for team consistency.', 'integrations'),
  '/system/logs-jobs': define('Logs / Jobs', 'System logs and background jobs monitor.', 'Retry failed jobs and review errors.', 'logsJobs'),
  '/system/theme-brand': define('Theme / Brand', 'Visual identity and motion tuning.', 'Apply calm premium defaults.', 'integrations')
};


export type RouteKey = keyof typeof routeDefinitions;
