export type ItemStatus = 'extracted' | 'confirmed' | 'edited' | 'user-added' | 'unresolved' | 'failed-extraction' | 'migrated-legacy';
export type JobState =
  | 'queued'
  | 'running'
  | 'success'
  | 'warning'
  | 'partial-success'
  | 'failed'
  | 'cancelled'
  | 'retrying'
  | 'fallback-running'
  | 'fallback-success'
  | 'fallback-failed';

export type ReadinessVerdict =
  | 'Ready to share'
  | 'Needs minor polish'
  | 'Needs structural rewrite'
  | 'Not ready for external viewing';

export interface TraceableItem<T = unknown> {
  id: string;
  type: string;
  label: string;
  value: T;
  sourceFileId?: string;
  sourceLocation?: string;
  parserUsed?: string;
  confidence: number;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export type RuntimeState = 'ready' | 'starting' | 'unavailable' | 'degraded' | 'failed';

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

export interface SourceFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  role: string;
  parser: string;
  confidence: number;
  status: ItemStatus;
  rawContent: string;
}

export interface ValidationIssue {
  isValid: boolean;
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  affectedEntityId?: string;
  affectedFileId?: string;
  affectedSection: string;
}

export interface JobItem extends TraceableItem<string> {
  state: JobState;
}

export interface SceneNode extends TraceableItem<Record<string, unknown>> {
  parentId?: string;
  children: string[];
  visible: boolean;
  locked: boolean;
  selected: boolean;
}

export interface WorkspaceModel {
  workspaceMeta: { id: string; name: string; createdAt: string; updatedAt: string; originalSchemaVersion: number; migratedSchemaVersion: number; migrationWarnings: string[]; migratedAt?: string; };
  sourceFiles: SourceFile[];
  extractedBlocks: TraceableItem<string>[];
  entities: TraceableItem<string>[];
  summaries: TraceableItem<string>[];
  smartDocs: TraceableItem<string>[];
  smartSheets: TraceableItem<string[][]>[];
  smartSlides: TraceableItem<{ title: string; bullets: string[] }>[];
  storyboard: SceneNode[];
  processMaps: TraceableItem<string>[];
  mermaidDocuments: TraceableItem<string>[];
  raid: TraceableItem<string>[];
  issues: TraceableItem<string>[];
  decisions: TraceableItem<string>[];
  dependencies: TraceableItem<string>[];
  changes: TraceableItem<string>[];
  resources: TraceableItem<string>[];
  budgets: TraceableItem<string>[];
  releases: TraceableItem<string>[];
  approvals: TraceableItem<string>[];
  audioArtifacts: TraceableItem<{ transcript: string; actions: string[] }> [];
  history: { id: string; label: string; createdAt: string; state: WorkspaceModel }[];
  jobs: JobItem[];
  actionCenter: ActionCenterItem[];
  glossary: TraceableItem<string>[];
  validation: ValidationIssue[];
  customization: { theme: string; density: 'compact'|'comfortable'; motion: 'low'|'normal'; };
  runtime: { provider: 'ollama' | 'remote' | 'hybrid' | 'manual'; state: RuntimeState; modelAvailable: boolean; startupStatus: string; degradedNotice: string; };
}

export interface WorkspaceInput {
  name: string;
  mimeType: string;
  content: string;
}
