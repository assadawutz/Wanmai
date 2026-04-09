import type { FeatureStateMachine } from '../types/agents';

export const featureStateMachines: FeatureStateMachine[] = [
  {
    key: 'appBoot',
    states: ['booting', 'restoring-session', 'checking-runtime', 'ready', 'degraded', 'failed-safe'],
    transitions: ['booting->restoring-session', 'restoring-session->checking-runtime', 'checking-runtime->ready', 'checking-runtime->degraded', 'restoring-session->failed-safe', 'failed-safe->degraded'],
    rules: ['failed-safe must still give user a usable shell', 'never trap user in fatal blank state']
  },
  {
    key: 'intake',
    states: ['idle', 'file-selected', 'classifying', 'parsing', 'normalizing', 'validating', 'ready', 'partial', 'failed'],
    transitions: ['idle->file-selected', 'file-selected->classifying', 'classifying->parsing', 'parsing->normalizing', 'normalizing->validating', 'validating->ready|partial|failed'],
    rules: ['partial must still allow downstream use', 'failed must preserve raw file', 'retry allowed from failed or partial']
  },
  {
    key: 'reader',
    states: ['loading-source', 'source-ready', 'extracted-ready', 'partial-extraction', 'trace-ready', 'degraded-view'],
    transitions: ['loading-source->source-ready', 'source-ready->extracted-ready|partial-extraction', 'extracted-ready->trace-ready'],
    rules: ['source-ready must not depend on extracted-ready', 'degraded-view must still show original source']
  },
  {
    key: 'summary',
    states: ['summary-idle', 'generating', 'fact-ready', 'interpretation-ready', 'role-ready', 'partial-summary', 'failed-summary'],
    transitions: ['summary-idle->generating', 'generating->fact-ready', 'fact-ready->interpretation-ready|partial-summary', 'generating->failed-summary'],
    rules: ['fact-ready may appear before interpretation-ready', 'partial-summary allowed', 'failed-summary must preserve source and structure']
  },
  {
    key: 'docEditor',
    states: ['loading-doc', 'editing', 'autosaving', 'saved', 'previewing', 'export-ready', 'degraded-editor'],
    transitions: ['loading-doc->editing', 'editing->autosaving->saved', 'saved->previewing|export-ready'],
    rules: ['autosave errors must not destroy draft', 'degraded-editor must fallback to simpler editor mode']
  },
  {
    key: 'sheet',
    states: ['loading-grid', 'grid-ready', 'formula-evaluating', 'chart-rendering', 'compare-ready', 'degraded-sheet'],
    transitions: ['loading-grid->grid-ready', 'grid-ready->formula-evaluating|chart-rendering|compare-ready'],
    rules: ['bad formulas isolated', 'chart failure must not break grid']
  },
  {
    key: 'slide',
    states: ['loading-deck', 'editing-slide', 'reordering', 'preview-ready', 'presenting', 'degraded-deck'],
    transitions: ['loading-deck->editing-slide', 'editing-slide->reordering|preview-ready|presenting'],
    rules: ['presentation mode isolated from editor chrome', 'degraded-deck preserves slide order and content']
  },
  {
    key: 'canvasBoard',
    states: ['loading-board', 'ready', 'dragging', 'resizing', 'grouping', 'autosaving', 'degraded-board'],
    transitions: ['loading-board->ready', 'ready->dragging|resizing|grouping|autosaving'],
    rules: ['last valid layout preserved', 'drag failure cannot destroy model state']
  },
  {
    key: 'flow',
    states: ['loading-graph', 'ready', 'editing-nodes', 'editing-edges', 'validating', 'export-ready', 'degraded-flow'],
    transitions: ['loading-graph->ready', 'ready->editing-nodes|editing-edges|validating|export-ready'],
    rules: ['invalid graph remains editable', 'validation errors visible but non-fatal']
  },
  {
    key: 'mermaid',
    states: ['editing-code', 'validating-syntax', 'rendering', 'render-ready', 'render-failed', 'last-valid-render'],
    transitions: ['editing-code->validating-syntax->rendering', 'rendering->render-ready|render-failed', 'render-failed->last-valid-render'],
    rules: ['render-failed must preserve code and last valid render']
  },
  {
    key: 'presentationBuilder',
    states: ['gathering-sources', 'generating-storyline', 'building-deck', 'editing-deck', 'preview-ready', 'present-ready', 'not-ready', 'degraded-presentation'],
    transitions: ['gathering-sources->generating-storyline->building-deck->editing-deck', 'editing-deck->preview-ready|present-ready|not-ready'],
    rules: ['not-ready is valid productive state', 'must include exact fix path']
  },
  {
    key: 'export',
    states: ['export-idle', 'validating-export', 'packaging', 'exporting', 'partial-success', 'success', 'failed', 'retrying'],
    transitions: ['export-idle->validating-export->packaging->exporting', 'exporting->partial-success|success|failed', 'failed->retrying->exporting'],
    rules: ['partial-success must say what succeeded', 'failed must preserve local backup']
  },
  {
    key: 'historyRestore',
    states: ['snapshot-idle', 'saving-snapshot', 'snapshot-saved', 'preparing-restore', 'validating-restore', 'restore-ready', 'restore-blocked', 'restore-failed-safe'],
    transitions: ['snapshot-idle->saving-snapshot->snapshot-saved', 'snapshot-saved->preparing-restore->validating-restore', 'validating-restore->restore-ready|restore-blocked|restore-failed-safe'],
    rules: ['restore-blocked must explain why', 'current workspace never silently overwritten']
  },
  {
    key: 'aiRuntime',
    states: ['checking', 'ready', 'starting-local', 'degraded', 'failed', 'retrying'],
    transitions: ['checking->ready|starting-local|degraded|failed', 'failed->retrying->checking'],
    rules: ['degraded is always usable', 'failed never blocks app shell']
  }
];
