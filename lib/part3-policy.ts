export type AgentCategory = 'system' | 'contextual-copilot' | 'role';

export interface AgentDefinition {
  id: string;
  name: string;
  category: AgentCategory;
  purpose: string;
  triggers?: string[];
  outputs: string[];
  fallback: string[];
  failurePolicy: string;
}

export interface ActionCenterItem {
  id: string;
  sourceAgent: string;
  type: 'fix' | 'review' | 'approve' | 'rewrite' | 'present' | 'export' | 'retry' | 'investigate' | 'clarify' | 'redact';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  linkedArtifactId?: string;
  linkedSourceId?: string;
  nextStep: string;
  status: 'open' | 'in_progress' | 'blocked' | 'resolved';
  createdAt: string;
}

export const outputContractSections = [
  'What it is',
  'What matters most',
  'Detailed interpretation',
  'Risks / gaps / ambiguities',
  'Pros / cons',
  'Recommendations',
  'Next actions',
  'Overall summary',
  'Readiness / quality judgment',
  'Exact improvement path if not ready'
] as const;

export const shareReadinessLabels = [
  'Ready to share',
  'Needs minor polish',
  'Needs structural rewrite',
  'Not ready for external viewing'
] as const;

export const requiredRuntimeStates = ['ready', 'starting', 'unavailable', 'degraded', 'failed'] as const;

export const previewEvaluationDimensions = [
  'visual polish',
  'readability',
  'hierarchy',
  'density',
  'audience fit',
  'structure completeness',
  'source grounding',
  'evidence quality',
  'presentation safety',
  'production readiness'
] as const;

export const prePushBuildGates = ['npm install', 'npm run lint', 'npm run type-check', 'npm run build', 'npm test'] as const;

export const systemAgents: AgentDefinition[] = [
  {
    id: 'intake-agent',
    name: 'Intake Agent',
    category: 'system',
    purpose: 'Classify source files and suggest merge/replace/output paths.',
    triggers: ['file upload', 'Drive import', 'version replace'],
    outputs: ['file role', 'priority', 'merge suggestions', 'output suggestions'],
    fallback: ['classify as unknown and continue safely'],
    failurePolicy: 'Preserve raw file and route to manual review.'
  },
  {
    id: 'parse-normalize-agent',
    name: 'Parse / Normalize Agent',
    category: 'system',
    purpose: 'Choose parser and produce normalized blocks/entities with confidence.',
    outputs: ['extracted blocks', 'entities', 'parser used', 'confidence'],
    fallback: ['partial extraction', 'raw source mode'],
    failurePolicy: 'Never discard files and never block workspace.'
  },
  {
    id: 'validation-agent',
    name: 'Validation Agent',
    category: 'system',
    purpose: 'Validate parsed data, references, layouts, exports, restore safety.',
    outputs: ['validation issues', 'severity', 'readiness hints'],
    fallback: ['warn and continue'],
    failurePolicy: 'Isolate bad entities/surfaces and continue.'
  },
  {
    id: 'sync-history-agent',
    name: 'Sync / History Agent',
    category: 'system',
    purpose: 'Autosave and snapshot tracking for safe restore and sync.',
    outputs: ['snapshots', 'restore warnings', 'sync state'],
    fallback: ['local snapshot only'],
    failurePolicy: 'Preserve latest local version.'
  },
  {
    id: 'runtime-agent',
    name: 'Runtime Agent',
    category: 'system',
    purpose: 'Check runtime and startup/degraded state without blocking app shell.',
    outputs: ['runtime status', 'degraded mode state'],
    fallback: ['manual mode'],
    failurePolicy: 'Never block app shell.'
  },
  {
    id: 'fallback-agent',
    name: 'Fallback Agent',
    category: 'system',
    purpose: 'Central handler for degraded mode routing and recovery.',
    outputs: ['fallback route', 'recovery suggestion'],
    fallback: ['last valid state', 'manual mode'],
    failurePolicy: 'Prevent cascading crashes.'
  }
];

export function buildActionItem(input: Omit<ActionCenterItem, 'id' | 'createdAt'>): ActionCenterItem {
  return {
    ...input,
    id: `action-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString()
  };
}
