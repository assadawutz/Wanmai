export interface MasterFeatureSpec {
  route: string;
  coreSurface: string;
  lockedPromptIntent: string;
  lockedRules: string[];
  inputs: string[];
  outputs: string[];
  mobileUI: string[];
  desktopUI: string[];
  fallback: string[];
  productionGates: string[];
}

export const universalFeatureResponseShape = [
  'featureIntent',
  'sourceContext',
  'factualCore',
  'interpretation',
  'risksAndGaps',
  'prosAndCons',
  'recommendations',
  'nextActions',
  'visualOutputPlan',
  'readinessJudgment',
  'fallbackState',
  'traceLinks'
] as const;

export type UniversalFeatureResponseBlock = typeof universalFeatureResponseShape[number];

export const masterFeatureTable: Record<string, MasterFeatureSpec> = {
  'command-home': {
    route: '/home',
    coreSurface: 'Visual dashboard, suggested actions, recent work, active jobs',
    lockedPromptIntent: 'Identify best next action, unfinished work, blockers, and continuation path.',
    lockedRules: ['Never overload first screen', 'Show only top useful next actions', 'Prioritize unfinished work, failed jobs, approvals, degraded runtime', 'If no workspace exists, move to upload/template first state'],
    inputs: ['workspace meta', 'recent files', 'recent outputs', 'active jobs', 'pending approvals'],
    outputs: ['suggested action cards', 'continue working cards', 'blocker strip', 'status summary'],
    mobileUI: ['top greeting', 'primary upload CTA', 'stacked action cards', 'recent work carousel', 'bottom quick actions'],
    desktopUI: ['3-column summary layout', 'recent outputs panel', 'action panel', 'status/jobs rail'],
    fallback: ['static starter home if data unavailable', 'deterministic suggestions when AI unavailable'],
    productionGates: ['No blank state without action', 'Action cards always actionable', 'Recent work safe on empty/null']
  },
  'intake-hub': {
    route: '/intake',
    coreSurface: 'Upload canvas, queue, classification, parse pipeline',
    lockedPromptIntent: 'Classify files, preserve source truth, suggest merge/replace, drive next outputs.',
    lockedRules: ['Never silently discard files', 'Always preserve raw source', 'Classify by role not only MIME', 'Mark partial extraction clearly'],
    inputs: ['local files', 'Drive imports', 'historical versions'],
    outputs: ['file cards', 'classification labels', 'parse progress', 'warnings', 'merge/replace suggestions', 'next output suggestions'],
    mobileUI: ['large drop area', 'queue sheet', 'stacked file cards', 'inline warnings'],
    desktopUI: ['upload left', 'queue center', 'warnings/inspector right'],
    fallback: ['raw file preserved', 'partial extraction mode', 'retry parse', 'manual continue'],
    productionGates: ['Multi-file upload safe', 'Retry works', 'No crash on malformed file', 'Progress states accurate']
  },
  'upload-queue': {
    route: '/intake/queue',
    coreSurface: 'Job list with progress and retry/cancel',
    lockedPromptIntent: 'Keep user aware of running, blocked, failed, retryable jobs.',
    lockedRules: ['Every job must show state', 'Failed jobs show cause and next action'],
    inputs: ['active upload/parse jobs'],
    outputs: ['queued/running/failed/completed lists'],
    mobileUI: ['sheet-based job cards'],
    desktopUI: ['persistent jobs rail'],
    fallback: ['persisted queue snapshot'],
    productionGates: ['No orphan job state', 'Retry resumes safely']
  },
  'file-library': {
    route: '/intake/library',
    coreSurface: 'Source cards, filters, tags, versions',
    lockedPromptIntent: 'Organize sources for find/group/compare/reuse.',
    lockedRules: ['Stable naming', 'Group by project, relevance, type, version'],
    inputs: ['source files'],
    outputs: ['searchable library', 'grouping', 'quick open'],
    mobileUI: ['stacked cards with filter sheet'],
    desktopUI: ['file grid with filter sidebar'],
    fallback: ['simple list view'],
    productionGates: ['Search safe on empty library', 'Filters safe when metadata missing']
  },
  'version-compare': {
    route: '/intake/compare',
    coreSurface: 'Side-by-side compare and diff summary cards',
    lockedPromptIntent: 'Show what changed, why it matters, and readiness impact.',
    lockedRules: ['Separate factual diff from interpretation', 'Highlight added/removed/changed sections'],
    inputs: ['source file A', 'source file B'],
    outputs: ['changed section cards', 'diff summary', 'replace/keep-both recommendation'],
    mobileUI: ['tabbed A/B compare'],
    desktopUI: ['side-by-side with diff rail'],
    fallback: ['metadata compare when full compare fails'],
    productionGates: ['Handle unequal structures', 'No false certainty for missing sections']
  },
  'source-merge': {
    route: '/intake/merge',
    coreSurface: 'Relationship map with merge recommendations',
    lockedPromptIntent: 'Determine merge/link/keep-separate strategy.',
    lockedRules: ['Never auto-merge destructively', 'Show confidence and rationale'],
    inputs: ['multiple related files'],
    outputs: ['merge plan', 'relationship graph', 'duplicate alerts'],
    mobileUI: ['merge cards with accept/reject'],
    desktopUI: ['relationship graph with merge inspector'],
    fallback: ['keep separate by default'],
    productionGates: ['No destructive merge without explicit user action']
  },
  'universal-reader': {
    route: '/reader',
    coreSurface: 'Source preview, extracted structure, insight rail, action rail',
    lockedPromptIntent: 'Explain source, extract what matters, connect to outputs.',
    lockedRules: ['Distinguish facts from inference', 'Expose source trace for important claims', 'Never hide parse uncertainty'],
    inputs: ['source file', 'extracted blocks'],
    outputs: ['section summaries', 'key entities', 'values', 'risks', 'convert-to actions'],
    mobileUI: ['source/summary/trace/actions segmented tabs'],
    desktopUI: ['source left, summary center, inspector right'],
    fallback: ['raw mode', 'partial extraction badges'],
    productionGates: ['Safe render for document/table/image/transcript modes', 'No source trace breakage']
  },
  'extracted-structure': {
    route: '/reader/structure',
    coreSurface: 'Heading tree, entities, blocks, table index',
    lockedPromptIntent: 'Show usable parsed layout and content blocks.',
    lockedRules: ['Show unresolved blocks', 'Reflect parser confidence'],
    inputs: ['extracted blocks'],
    outputs: ['structure tree', 'unresolved flags'],
    mobileUI: ['accordion list'],
    desktopUI: ['persistent structure rail'],
    fallback: ['raw block list'],
    productionGates: ['Invalid block types do not break tree']
  },
  'entity-explorer': {
    route: '/reader/entities',
    coreSurface: 'Entity chips, clusters, linked source cards',
    lockedPromptIntent: 'Extract and link entities to sources and outputs.',
    lockedRules: ['Do not fabricate entities', 'Cluster by relevance/type'],
    inputs: ['parsed content'],
    outputs: ['entity map', 'entity detail cards'],
    mobileUI: ['chip grid with detail sheet'],
    desktopUI: ['cluster view with linked source panel'],
    fallback: ['keyword list only'],
    productionGates: ['Missing metadata safe']
  },
  'source-trace': {
    route: '/reader/trace',
    coreSurface: 'Evidence panel, source location, confidence',
    lockedPromptIntent: 'Make insights auditable and trustworthy.',
    lockedRules: ['Expose exact source locations when possible', 'Mark low confidence clearly'],
    inputs: ['extracted values', 'source mappings'],
    outputs: ['source references', 'confidence labels', 'original vs edited state'],
    mobileUI: ['bottom sheet detail'],
    desktopUI: ['right evidence rail'],
    fallback: ['source file only when exact location unavailable'],
    productionGates: ['No broken evidence link', 'Low confidence styling always clear']
  },
  'deep-summary': {
    route: '/summary',
    coreSurface: 'Visual summary cards, role tabs, recommendation lanes',
    lockedPromptIntent: 'Provide detailed actionable interpretation, not just shortening.',
    lockedRules: ['Separate facts from interpretation', 'Include recommendations and next actions', 'Include role lenses when applicable'],
    inputs: ['source files', 'extracted blocks', 'entities'],
    outputs: ['quick summary', 'deep summary', 'role summaries', 'key points', 'risks', 'gaps', 'recommendations', 'overall summary'],
    mobileUI: ['stacked cards with tabs'],
    desktopUI: ['card grid + role panel + actions panel'],
    fallback: ['fact-only summary when interpretation unavailable'],
    productionGates: ['Always includes usefulness layer', 'No vague filler output']
  },
  insights: {
    route: '/summary/insights', coreSurface: 'Pros/cons/risk/gap/recommendation cards', lockedPromptIntent: 'Surface strengths, weaknesses, ambiguities, risks, decisions.',
    lockedRules: ['Do not overstate risk without evidence', 'List gaps explicitly'], inputs: ['summaries', 'extracted content'], outputs: ['pros', 'cons', 'risks', 'gaps', 'assumptions', 'open questions'], mobileUI: ['card stack'], desktopUI: ['multi-column insight board'], fallback: ['show insight unavailable cards'], productionGates: ['Insight categories stay distinct']
  },
  'confidence-validation': {
    route: '/summary/validation', coreSurface: 'Confidence badges, validation issues, readiness hints', lockedPromptIntent: 'Judge data quality, confidence, unresolved areas, readiness.',
    lockedRules: ['Never mark weak evidence as strong', 'Show unresolved items prominently'], inputs: ['parsed data', 'source mappings'], outputs: ['validation list', 'readiness hints'], mobileUI: ['issue cards'], desktopUI: ['validation table + side detail'], fallback: ['minimum confidence-only mode'], productionGates: ['Invalid data never shown as clean pass']
  },
  'smart-docs': {
    route: '/docs', coreSurface: 'Block editor, structure tree, evidence rail, print preview', lockedPromptIntent: 'Build accurate, structured, readable, share-ready docs.', lockedRules: ['Preserve factual grounding', 'Insert evidence where useful', 'Judge share-readiness honestly'], inputs: ['summaries', 'extracted blocks', 'manual edits'], outputs: ['refined sections', 'structure suggestions', 'linked evidence', 'overall quality judgment'], mobileUI: ['full editor + formatting sheet'], desktopUI: ['left tree / center editor / right evidence'], fallback: ['raw text editor mode', 'autosave snapshots'], productionGates: ['No editor crash', 'Print preview isolated', 'Undo/redo works']
  },
  'smart-sheets': {
    route: '/sheets', coreSurface: 'Grid, KPI rail, chart panel, compare panel', lockedPromptIntent: 'Transform data into usable analysis and visuals.', lockedRules: ['Never fabricate formulas from unknown intent', 'Identify anomalies and dirty data'], inputs: ['spreadsheet data', 'CSV/TSV/XLSX imports'], outputs: ['analyzed table', 'formulas', 'charts', 'KPI cards', 'cleanup suggestions'], mobileUI: ['sheet tabs + summary rail + bottom tools'], desktopUI: ['grid center + chart panel + inspector'], fallback: ['readonly table mode', 'raw import preserved'], productionGates: ['Large tables safe', 'Invalid values do not crash charts']
  },
  'smart-slides': {
    route: '/slides', coreSurface: 'Thumbnails, slide canvas, notes, theme/layout controls', lockedPromptIntent: 'Create coherent, readable, audience-appropriate decks.', lockedRules: ['One message per slide or clear grouped cluster', 'Flag over-dense slides'], inputs: ['summaries', 'boards', 'docs', 'manual edits'], outputs: ['deck structure', 'slide suggestions', 'speaker notes', 'readiness evaluation'], mobileUI: ['thumbnail rail + active slide + notes sheet'], desktopUI: ['thumbnails left / slide center / inspector right'], fallback: ['outline-only deck', 'static render if canvas fails'], productionGates: ['Slide reorder safe', 'Notes persist', 'No broken theme application']
  },
  'visual-board-studio': {
    route: '/boards', coreSurface: 'Freeform canvas, widgets, layer tree, layout controls', lockedPromptIntent: 'Organize complex information into scannable visual boards.', lockedRules: ['Reduce clutter', 'Preserve hierarchy', 'Recommend grouping/spacing improvements'], inputs: ['summaries', 'issues', 'risks', 'metrics', 'source references'], outputs: ['board widgets', 'layout suggestions', 'executive board suggestions'], mobileUI: ['single-canvas focus + bottom edit rail'], desktopUI: ['canvas center / tree left / inspector right'], fallback: ['list-mode board', 'preserve last valid layout'], productionGates: ['Drag/drop stable', 'Zoom/pan stable', 'Widget linking safe']
  },
  'workspace-canvas': {
    route: '/canvas', coreSurface: 'Visual operating board for project/system/work output', lockedPromptIntent: 'Provide all-purpose visual workspace to compose outputs.', lockedRules: ['Canvas is not decorative only', 'Every block must be actionable or informative'], inputs: ['all normalized objects'], outputs: ['mixed boards', 'linked objects', 'draft presentation surfaces'], mobileUI: ['focused canvas mode'], desktopUI: ['expansive multi-panel canvas'], fallback: ['block list fallback'], productionGates: ['Selection model stable', 'No invisible orphan blocks']
  },
  'flow-studio': {
    route: '/flow', coreSurface: 'Node graph, minimap, validation overlay, edge inspector', lockedPromptIntent: 'Convert process/logic into valid explainable flows.', lockedRules: ['Show missing nodes/loops/orphans', 'Distinguish dependency from order when needed'], inputs: ['summaries', 'issues', 'process descriptions'], outputs: ['flow graph', 'validation warnings', 'export options'], mobileUI: ['active graph + bottom node tools'], desktopUI: ['graph center / minimap / inspector'], fallback: ['linear process list'], productionGates: ['Graph interactions stable', 'Invalid graph does not crash editor']
  },
  'mermaid-studio': {
    route: '/mermaid', coreSurface: 'Code editor, live render, syntax warnings, template library', lockedPromptIntent: 'Build Mermaid diagrams that render correctly and stay understandable.', lockedRules: ['Valid syntax first', 'Prefer simple clear structure'], inputs: ['flow graph', 'manual code'], outputs: ['Mermaid code', 'render', 'explanation', 'repair suggestions'], mobileUI: ['code/render tab switch'], desktopUI: ['split editor/render'], fallback: ['preserve code', 'preserve last valid render'], productionGates: ['Broken syntax never breaks app shell']
  },
  'storyboard-studio': {
    route: '/storyboard', coreSurface: 'Scene cards, transition links, sequence lane, audience mode', lockedPromptIntent: 'Structure story sequence and presentation flow visually.', lockedRules: ['Each scene has purpose', 'Avoid redundant sequences'], inputs: ['slides', 'boards', 'docs', 'summaries'], outputs: ['scene order', 'transition suggestions', 'presentation route'], mobileUI: ['scene stack + reorder drag'], desktopUI: ['card board + link map + inspector'], fallback: ['linear scene list'], productionGates: ['Reorder safe', 'Broken links visible']
  },
  'presentation-builder': {
    route: '/present/build', coreSurface: 'Source rail, summary rail, storyline rail, live deck, notes, readiness evaluator', lockedPromptIntent: 'Turn files and insights into audience-ready presentation.', lockedRules: ['Build storyline before visual polish', 'Evaluate readiness honestly'], inputs: ['uploaded files', 'summaries', 'board elements', 'slides'], outputs: ['proposed deck', 'storyline', 'sections', 'notes', 'readiness verdict'], mobileUI: ['source→storyline→slides progressive flow'], desktopUI: ['multi-column editor + live preview'], fallback: ['outline-only presentation', 'no blank deck failure'], productionGates: ['Deck generation deterministic enough to review', 'Readiness evaluator always runs']
  },
  'issues-center': {
    route: '/ops/issues', coreSurface: 'Issue cards with board/list/timeline views', lockedPromptIntent: 'Normalize issue handling into prioritized actionable work.', lockedRules: ['No orphan issue', 'Link issue to source/risk/decision when possible'], inputs: ['extracted issues', 'manual issues'], outputs: ['issue views', 'escalation flags', 'next actions'], mobileUI: ['issue stack + detail sheet'], desktopUI: ['board/list toggle + inspector'], fallback: ['list-only issue mode'], productionGates: ['No broken owner/due metadata handling']
  },
  'raid-center': {
    route: '/ops/raid', coreSurface: 'Risk/assumption/issue/dependency grouped board + heatmap', lockedPromptIntent: 'Make uncertainty visible and actionable.', lockedRules: ['Keep categories distinct', 'Show owner/mitigation if known'], inputs: ['risks', 'assumptions', 'issues', 'dependencies'], outputs: ['RAID board', 'heatmap', 'mitigation plan'], mobileUI: ['category tabs'], desktopUI: ['4-column board + heatmap'], fallback: ['categorized list view'], productionGates: ['Category integrity maintained']
  },
  'decision-log': {
    route: '/ops/decisions', coreSurface: 'Decision cards, evidence, approval state', lockedPromptIntent: 'Make decisions understandable, evidence-backed, reviewable.', lockedRules: ['Separate options from chosen decision', 'Show rationale and impact'], inputs: ['summaries', 'stakeholder notes', 'manual entries'], outputs: ['decision record', 'options considered', 'rationale', 'approval needs'], mobileUI: ['decision list + full-screen detail'], desktopUI: ['list + detail + evidence rail'], fallback: ['note-style decision record'], productionGates: ['No missing metadata crash']
  },
  'dependency-studio': {
    route: '/ops/dependencies', coreSurface: 'Graph, matrix, conflict list', lockedPromptIntent: 'Expose dependency structure and bottlenecks clearly.', lockedRules: ['Identify conflicts and bottlenecks', 'Distinguish internal/external/team dependencies'], inputs: ['tasks', 'flows', 'issues', 'milestones'], outputs: ['dependency graph', 'matrix', 'conflict report'], mobileUI: ['matrix/cards tabs'], desktopUI: ['graph + matrix + warnings'], fallback: ['list view'], productionGates: ['No graph lockup on dense data']
  },
  'change-control': {
    route: '/ops/changes', coreSurface: 'Change request cards + impact summary', lockedPromptIntent: 'Assess scope/time/budget/technical impact before approval.', lockedRules: ['Separate impact domains', 'Indicate uncertainty'], inputs: ['change requests', 'linked artifacts'], outputs: ['impact cards', 'approval path', 'recommendations'], mobileUI: ['change cards + impact sheet'], desktopUI: ['request list + impact detail'], fallback: ['minimal change request form'], productionGates: ['No missing approval path crash']
  },
  'resource-planner': {
    route: '/ops/resources', coreSurface: 'Utilization views, allocation matrix, conflicts', lockedPromptIntent: 'Show workload and capacity gaps.', lockedRules: ['Highlight overloads', 'Respect role-based allocation'], inputs: ['people', 'roles', 'tasks'], outputs: ['capacity views', 'conflicts', 'recommendations'], mobileUI: ['compact allocation cards'], desktopUI: ['matrix + charts'], fallback: ['simple utilization list'], productionGates: ['Empty team state safe']
  },
  'timeline-gantt': {
    route: '/ops/timeline', coreSurface: 'Milestone timeline, dependency overlays, overdue markers', lockedPromptIntent: 'Make schedule status easy to scan and act on.', lockedRules: ['Show overdue/blocked states visibly', 'Preserve chronology integrity'], inputs: ['milestones', 'tasks', 'dependencies'], outputs: ['timeline', 'critical markers', 'schedule alerts'], mobileUI: ['condensed timeline strip'], desktopUI: ['expanded gantt'], fallback: ['milestone list'], productionGates: ['Invalid date data handled safely']
  },
  'budget-impact': {
    route: '/ops/budget', coreSurface: 'Budget cards, tradeoff view, scenario compare', lockedPromptIntent: 'Show cost/tradeoffs in decision-friendly format.', lockedRules: ['Never fabricate budget confidence', 'Highlight missing budget basis'], inputs: ['cost data', 'assumptions'], outputs: ['budget views', 'impact cards', 'scenario compare'], mobileUI: ['card-first'], desktopUI: ['compare grid + charts'], fallback: ['manual budget notes mode'], productionGates: ['Missing numerics do not break charts']
  },
  'approval-center': {
    route: '/ops/approvals', coreSurface: 'Approval queue, review cards, approve/reject/revise', lockedPromptIntent: 'Support human review before external sharing.', lockedRules: ['Approval status always explicit', 'Rejected items need revision reason'], inputs: ['pending artifacts'], outputs: ['approval states', 'review notes'], mobileUI: ['approval stack'], desktopUI: ['queue + detail panel'], fallback: ['manual review list'], productionGates: ['No state mismatch between approval and artifact']
  },
  'meeting-action-hub': {
    route: '/ops/meetings', coreSurface: 'Transcript summary, actions, decisions, follow-ups', lockedPromptIntent: 'Turn meetings into useful follow-up structures.', lockedRules: ['Separate decisions/actions/questions', 'Assign owners when possible'], inputs: ['transcript/audio summary'], outputs: ['meeting recap', 'action items', 'decisions', 'follow-up list'], mobileUI: ['recap cards + actions sheet'], desktopUI: ['transcript left / actions center / inspector right'], fallback: ['transcript-only mode'], productionGates: ['Transcript unavailability does not break hub']
  },
  'release-environment-board': {
    route: '/ops/releases', coreSurface: 'Environment status cards, blockers, checklist', lockedPromptIntent: 'Make release readiness visible and auditable.', lockedRules: ['Always show blockers', 'Never mark ready with unmet critical checks undisclosed'], inputs: ['env states', 'blockers', 'release notes'], outputs: ['readiness summary', 'blocker cards', 'checklist state'], mobileUI: ['environment cards'], desktopUI: ['env grid + blocker rail'], fallback: ['checklist-only mode'], productionGates: ['Missing env metadata safe']
  },
  'api-system-map': {
    route: '/ops/system', coreSurface: 'Service map, API links, data flow', lockedPromptIntent: 'Help technical users understand system shape and dependencies.', lockedRules: ['Distinguish observed vs inferred architecture', 'Flag missing ownership/unknown links'], inputs: ['system docs', 'extracted entities'], outputs: ['service graph', 'API mapping', 'unknown areas'], mobileUI: ['service cards + map tab'], desktopUI: ['graph + detail panel'], fallback: ['service list'], productionGates: ['Graph safe on incomplete topology']
  },
  'pm-ops': {
    route: '/workbench/pm', coreSurface: 'PM command board', lockedPromptIntent: 'Provide PM operational view with actions/risks/status/comms readiness.', lockedRules: ['Compress complexity without hiding risk', 'Prioritize blockers and due actions'], inputs: ['issues', 'RAID', 'timeline', 'decisions'], outputs: ['PM board', 'weekly status summary', 'next actions', 'stakeholder update suggestions'], mobileUI: ['status cards + action lanes'], desktopUI: ['PM board + KPI summary + risk rail'], fallback: ['summary-only PM view'], productionGates: ['Stakeholder summary generation safe']
  },
  'technical-ops': {
    route: '/workbench/technical', coreSurface: 'Architecture/release/defect/dependency command board', lockedPromptIntent: 'Coordinate architecture, risk, defects, release readiness.', lockedRules: ['Ground technical claims in source', 'Highlight blockers and fragile dependencies'], inputs: ['system map', 'defects', 'releases'], outputs: ['technical summary', 'release readiness', 'architecture risk view'], mobileUI: ['technical cards + status tabs'], desktopUI: ['map + issues + readiness panels'], fallback: ['list summary mode'], productionGates: ['No broken system map dependency']
  },
  'sales-ops': {
    route: '/workbench/sales', coreSurface: 'Opportunity pipeline, stakeholder map, proposal/deck hooks', lockedPromptIntent: 'Turn source material into sales-ready insights and next steps.', lockedRules: ['Emphasize value with evidence', 'Surface objections and unresolved questions'], inputs: ['summaries', 'proposals', 'stakeholder data'], outputs: ['sales summary', 'next-step plan', 'proposal hooks', 'pitch angles'], mobileUI: ['opportunity cards + next-step stack'], desktopUI: ['pipeline + stakeholder map + proposal panel'], fallback: ['opportunity list only'], productionGates: ['No fabricated sales confidence']
  },
  'executive-cockpit': {
    route: '/workbench/executive', coreSurface: 'One-page decision-ready dashboard', lockedPromptIntent: 'Condense project/system to leadership signal.', lockedRules: ['Keep high-signal information only', 'Include recommendations and decisions needed'], inputs: ['summaries', 'risks', 'blockers', 'decisions'], outputs: ['exec summary', 'decision cards', 'risk highlights', 'action summary'], mobileUI: ['one-page cards'], desktopUI: ['executive board + decision strip'], fallback: ['summary memo'], productionGates: ['No clutter overload']
  },
  'proposal-workspace': {
    route: '/workbench/proposal', coreSurface: 'Proposal doc/deck builder, value blocks, readiness evaluator', lockedPromptIntent: 'Assemble proposal-ready outputs grounded in source truth.', lockedRules: ['Link claims to evidence when possible', 'Flag weak sections honestly'], inputs: ['source files', 'summaries', 'decks/docs'], outputs: ['proposal structure', 'value statements', 'risk notes', 'readiness verdict'], mobileUI: ['proposal section cards'], desktopUI: ['proposal editor + evidence rail + deck sync'], fallback: ['proposal outline only'], productionGates: ['Unsupported claims flagged']
  },
  'preview-hub': {
    route: '/review/preview', coreSurface: 'Universal preview for docs/sheets/slides/boards/flow/mermaid/decks', lockedPromptIntent: 'Show artifact as seen and judge readiness.', lockedRules: ['Evaluate readability/structure/density/polish', 'Never pretend output is ready'], inputs: ['artifacts'], outputs: ['preview', 'readiness verdict', 'fixes needed'], mobileUI: ['fullscreen preview tabs'], desktopUI: ['preview center + evaluation panel'], fallback: ['static snapshot preview'], productionGates: ['Every artifact previewable or marked unsupported']
  },
  'presentation-mode': {
    route: '/review/present', coreSurface: 'Fullscreen audience mode', lockedPromptIntent: 'Ensure presentation is safe to show and easy to navigate.', lockedRules: ['Keep audience view clean', 'Surface presenter notes separately'], inputs: ['deck/storyboard/board'], outputs: ['live presentation', 'presenter hints'], mobileUI: ['swipe/step presentation'], desktopUI: ['fullscreen + notes mode'], fallback: ['static slide stepping'], productionGates: ['Keyboard/touch navigation works', 'No UI chrome leakage']
  },
  'export-center': {
    route: '/review/export', coreSurface: 'Export queue, readiness, output list, retry', lockedPromptIntent: 'Export safely and accurately with clear status.', lockedRules: ['Validate before export', 'Preserve backup on failure'], inputs: ['artifacts'], outputs: ['exported files', 'export status', 'retry guidance'], mobileUI: ['export cards'], desktopUI: ['export queue + detail panel'], fallback: ['local backup bundle'], productionGates: ['Failed export does not lose data']
  },
  history: {
    route: '/review/history', coreSurface: 'Snapshots, compare metadata, restore flow', lockedPromptIntent: 'Preserve work safety and recoverability.', lockedRules: ['Validate before restore', 'Warn on partial restore or migration'], inputs: ['history snapshots'], outputs: ['snapshot list', 'restore actions', 'warnings'], mobileUI: ['snapshot cards'], desktopUI: ['history list + compare panel'], fallback: ['latest stable snapshot only'], productionGates: ['Restore safe on corrupted snapshot with warning']
  },
  'restore-snapshots': {
    route: '/review/history', coreSurface: 'Snapshots, compare metadata, restore flow', lockedPromptIntent: 'Preserve work safety and recoverability.', lockedRules: ['Validate before restore', 'Warn on partial restore or migration'], inputs: ['history snapshots'], outputs: ['snapshot list', 'restore actions', 'warnings'], mobileUI: ['snapshot cards'], desktopUI: ['history list + compare panel'], fallback: ['latest stable snapshot only'], productionGates: ['Restore safe on corrupted snapshot with warning']
  },
  'readiness-scores': {
    route: '/review/readiness', coreSurface: 'Scored cards with rationale and fix path', lockedPromptIntent: 'Judge whether artifacts are ready to show.', lockedRules: ['Evaluate honestly', 'If not ready, provide exact fixes'], inputs: ['shareable artifacts'], outputs: ['readiness score', 'what works', 'what fails', 'fix path'], mobileUI: ['score cards'], desktopUI: ['score dashboard + issue list'], fallback: ['binary pass/warn mode'], productionGates: ['Always returns actionable output']
  },
  'ai-runtime': {
    route: '/system/ai', coreSurface: 'Provider/model status, auto-start control, logs', lockedPromptIntent: 'Manage local/remote AI cleanly and safely.', lockedRules: ['Never block workspace if AI down', 'Auto-start Ollama if enabled'], inputs: ['runtime state'], outputs: ['provider status', 'model availability', 'retry/start actions', 'degraded notice'], mobileUI: ['runtime cards'], desktopUI: ['provider panel + logs'], fallback: ['degraded/manual mode'], productionGates: ['Startup check safe', 'Failed auto-start does not crash app']
  },
  integrations: {
    route: '/system/integrations', coreSurface: 'Auth status, Drive import/export, sync state', lockedPromptIntent: 'Allow cloud import/export without breaking local-first work.', lockedRules: ['Local mode usable when auth/sync fails', 'No work loss on failed sync'], inputs: ['auth/session', 'Drive files'], outputs: ['sync status', 'import/export options'], mobileUI: ['integration cards'], desktopUI: ['auth + Drive panel'], fallback: ['local-only mode'], productionGates: ['Auth failure isolated', 'Sync retry safe']
  },
  'google-sign-in': {
    route: '/system/integrations', coreSurface: 'Auth status, Drive import/export, sync state', lockedPromptIntent: 'Allow cloud import/export without breaking local-first work.', lockedRules: ['Local mode usable when auth/sync fails', 'No work loss on failed sync'], inputs: ['auth/session', 'Drive files'], outputs: ['sync status', 'import/export options'], mobileUI: ['integration cards'], desktopUI: ['auth + Drive panel'], fallback: ['local-only mode'], productionGates: ['Auth failure isolated', 'Sync retry safe']
  },
  'google-drive': {
    route: '/system/integrations', coreSurface: 'Auth status, Drive import/export, sync state', lockedPromptIntent: 'Allow cloud import/export without breaking local-first work.', lockedRules: ['Local mode usable when auth/sync fails', 'No work loss on failed sync'], inputs: ['auth/session', 'Drive files'], outputs: ['sync status', 'import/export options'], mobileUI: ['integration cards'], desktopUI: ['auth + Drive panel'], fallback: ['local-only mode'], productionGates: ['Auth failure isolated', 'Sync retry safe']
  },
  'privacy-redaction': {
    route: '/system/privacy', coreSurface: 'Confidential markers, redaction controls, safe export mode', lockedPromptIntent: 'Protect sensitive content before sharing/export.', lockedRules: ['Never auto-share unredacted content', 'Clearly mark confidential sections'], inputs: ['artifacts'], outputs: ['redacted views', 'safe export options'], mobileUI: ['redact sheet'], desktopUI: ['redact inspector'], fallback: ['manual hide block mode'], productionGates: ['Redaction state preserved in export flow']
  },
  'logs-jobs': {
    route: '/system/jobs', coreSurface: 'Background jobs, logs, retry states', lockedPromptIntent: 'Make background work transparent and controllable.', lockedRules: ['Every failed job shows retry path'], inputs: ['jobs', 'logs'], outputs: ['job list', 'failure reasons', 'retry actions'], mobileUI: ['job cards'], desktopUI: ['jobs table + log panel'], fallback: ['summarized jobs only'], productionGates: ['No orphan background states']
  }
};

export const globalFallbackPolicy = [
  'preserve raw input',
  'preserve last valid render',
  'preserve last valid preview',
  'preserve autosave snapshot',
  'use degraded/manual mode instead of crashing',
  'surface warnings visually',
  'never silently fail'
];

export const globalQualityJudgmentPolicy = [
  'visual polish',
  'readability',
  'structure',
  'density',
  'audience fit',
  'evidence quality',
  'readiness to show others'
];

export const universalRenderRules = {
  document: ['structured sections', 'source-linked callouts', 'evidence blocks', 'print-safe pages', 'fallback: raw section list'],
  sheet: ['grid', 'KPI rails', 'charts', 'compare panels', 'fallback: readonly table'],
  slide: ['thumbnails', 'active slide canvas', 'notes', 'presenter-safe preview', 'fallback: outline deck'],
  board: ['widgets', 'group containers', 'linked cards', 'zoom/pan canvas', 'fallback: list board'],
  flow: ['node graph', 'minimap', 'validation overlays', 'fallback: linear process list'],
  mermaid: ['live diagram', 'code + warning split', 'fallback: preserve code + last valid render'],
  storyboard: ['scene cards', 'transition lines', 'sequence lane', 'fallback: scene list'],
  presentation: ['live deck', 'audience mode', 'presenter mode', 'fallback: static deck stepping']
} as const;

export const prePushQAChecks = {
  home: ['home never blank', 'suggested actions always present', 'recent work safe if empty/null'],
  intake: ['malformed file safe', 'retry safe', 'raw file preserved', 'queue states accurate'],
  reader: ['all supported reader modes safe', 'source trace no crash', 'partial extraction visible'],
  summary: ['layered summary present', 'no empty recommendation state when enough context exists', 'fact vs interpretation distinct'],
  docs: ['autosave works', 'editor no crash', 'print preview isolated', 'evidence rail safe'],
  sheets: ['grid safe on empty data', 'charts safe on bad values', 'no formula crash'],
  slides: ['reorder safe', 'notes persist', 'preview safe'],
  boards: ['drag/drop safe', 'layout persists', 'invalid widget metadata safe'],
  flow: ['orphan/cycle warnings visible', 'graph editor no hard crash'],
  mermaid: ['broken syntax isolated', 'render failure does not affect app shell'],
  storyboard: ['broken scene links visible', 'reorder safe'],
  presentation: ['readiness evaluator active', 'no fullscreen shell break', 'touch + keyboard navigation safe'],
  ops: ['CRUD safe', 'linked references safe', 'empty states present'],
  history: ['invalid snapshot warning safe', 'restore never destroys current work silently'],
  aiRuntime: ['auto-start check safe', 'degraded mode safe', 'provider switch safe'],
  integrations: ['failed auth/sync does not break local use', 'retry safe']
} as const;
