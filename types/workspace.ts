export type ItemStatus = 'extracted' | 'confirmed' | 'edited' | 'user-added' | 'unresolved' | 'failed-extraction' | 'migrated-legacy';

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
  jobs: TraceableItem<string>[];
  glossary: TraceableItem<string>[];
  validation: ValidationIssue[];
  customization: { theme: string; density: 'compact'|'comfortable'; motion: 'low'|'normal'; };
}

export interface WorkspaceInput {
  name: string;
  mimeType: string;
  content: string;
}
