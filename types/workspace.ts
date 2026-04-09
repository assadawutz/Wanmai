export type IsoDateString = string;

export type ParseStatus = 'queued' | 'parsing' | 'partial' | 'complete' | 'failed';
export type ItemStatus = 'extracted' | 'confirmed' | 'edited' | 'user-added' | 'unresolved' | 'failed-extraction' | 'migrated-legacy';

export type FileRole =
  | 'report'
  | 'executive-summary'
  | 'meeting-notes'
  | 'proposal'
  | 'presentation-deck'
  | 'spreadsheet'
  | 'roadmap'
  | 'architecture-doc'
  | 'image-reference'
  | 'transcript-source'
  | 'mixed-material'
  | 'unknown';

export interface WorkspaceMeta {
  id: string;
  title: string;
  description: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  owner: string;
  tags: string[];
  themeId: string;
  currentProjectId?: string;
  activeArtifactId?: string;
  activeArtifactType?: string;
  preferredAudience?: string;
  preferredLanguage: string;
  preferredViewMode: 'mobile' | 'desktop' | 'auto';
  autosaveEnabled: boolean;
  degradedMode: boolean;
  privacyMode: boolean;
  startupChecksComplete: boolean;

  // legacy compatibility
  name?: string;
  originalSchemaVersion?: number;
  migratedSchemaVersion?: number;
  migrationWarnings?: string[];
  migratedAt?: IsoDateString;
}

export interface SourceFile {
  id: string;
  name: string;
  fileType?: string;
  mimeType: string;
  sizeBytes?: number;
  extension?: string;
  sourceOrigin?: 'upload' | 'drive' | 'api' | 'import' | 'manual' | 'unknown';
  sourceUri?: string;
  uploadedAt?: IsoDateString;
  uploadedBy?: string;
  fingerprint?: string;
  fileRole?: FileRole;
  versionLabel?: string;
  previousVersionId?: string;
  parseStatus?: ParseStatus;
  parseConfidence?: number;
  parserUsed?: string;
  extractionMode?: 'full' | 'partial' | 'metadata-only' | 'manual';
  warningCodes?: string[];
  errorMessage?: string;
  previewAvailable?: boolean;
  transcriptAvailable?: boolean;
  isMergedCandidate?: boolean;
  isDuplicateCandidate?: boolean;
  isArchived?: boolean;

  // legacy compatibility
  size?: number;
  role?: string;
  parser?: string;
  confidence?: number;
  status?: ItemStatus;
  rawContent?: string;
}

export type ExtractedBlockType =
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'bullet-list'
  | 'numbered-list'
  | 'table'
  | 'row'
  | 'cell'
  | 'image'
  | 'chart'
  | 'metric'
  | 'timeline-item'
  | 'quote'
  | 'transcript-line'
  | 'json'
  | 'unknown';

export interface ExtractedBlock {
  id: string;
  sourceFileId: string;
  type: ExtractedBlockType;
  label: string;
  value: string;
  rawValue?: string;
  normalizedValue?: string;
  sourceLocation?: string;
  parserUsed: string;
  confidence: number;
  status: ItemStatus;
  pageNumber?: number;
  sectionPath?: string[];
  visualRegion?: string;
  entityRefs: string[];
  note?: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export type EntityType =
  | 'person'
  | 'team'
  | 'company'
  | 'system'
  | 'service'
  | 'API'
  | 'feature'
  | 'requirement'
  | 'metric'
  | 'date'
  | 'location'
  | 'budget-item'
  | 'risk'
  | 'decision'
  | 'task'
  | 'milestone'
  | 'stakeholder'
  | 'term'
  | 'unknown';

export interface Entity {
  id: string;
  type: EntityType;
  label: string;
  value: string;
  aliases: string[];
  sourceFileId?: string;
  sourceLocation?: string;
  parserUsed?: string;
  confidence: number;
  status: ItemStatus;
  linkedBlockIds: string[];
  linkedArtifactIds: string[];
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export type SummaryType = 'quick' | 'deep' | 'executive' | 'pm' | 'technical' | 'sales' | 'proposal' | 'cross-file' | 'comparison' | 'transcript' | 'meeting-recap';

export interface SummaryArtifact {
  id: string;
  summaryType: SummaryType;
  title: string;
  linkedSourceIds: string[];
  linkedBlockIds: string[];
  factualCore: string;
  interpretation: string;
  risksAndGaps: string;
  prosAndCons: string;
  recommendations: string;
  nextActions: string;
  overallSummary: string;
  roleLens?: string;
  readinessVerdict?: string;
  readinessNotes?: string;
  confidence: number;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;

  // legacy compatibility
  label?: string;
  value?: string;
}

export interface DocumentArtifact {
  id: string;
  title: string;
  templateType:
    | 'project-overview'
    | 'executive-summary'
    | 'kickoff-summary'
    | 'scope-summary'
    | 'delivery-plan'
    | 'communication-plan'
    | 'risk-report'
    | 'stakeholder-brief'
    | 'pm-summary'
    | 'marketing-summary'
    | 'sales-summary'
    | 'proposal-summary'
    | 'meeting-recap'
    | 'technical-brief'
    | 'custom';
  sectionOrder: string[];
  blockIds: string[];
  linkedSourceIds: string[];
  linkedSummaryIds: string[];
  evidenceRefs: string[];
  notes?: string;
  readinessVerdict?: string;
  exportState?: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;

  // legacy compatibility
  type?: string;
  label?: string;
  value?: string;
  confidence?: number;
  status?: ItemStatus;
}

export interface SpreadsheetArtifact {
  id: string;
  title: string;
  sheetTabs: SheetTab[];
  linkedSourceIds: string[];
  formulaMap: Record<string, string>;
  chartRefs: string[];
  summaryRefs: string[];
  readinessVerdict?: string;
  exportState?: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;

  // legacy compatibility
  type?: string;
  label?: string;
  value?: string[][];
  confidence?: number;
  status?: ItemStatus;
}

export interface SheetTab {
  id: string;
  title: string;
  rows: number;
  columns: number;
  frozenRows: number;
  frozenColumns: number;
  filters: string[];
  sorts: string[];
  validationRules: string[];
}

export interface SlideDeckArtifact {
  id: string;
  title: string;
  audience: string;
  themeId: string;
  slideIds: string[];
  storyline: string;
  linkedSourceIds: string[];
  linkedSummaryIds: string[];
  notes?: string;
  readinessVerdict?: string;
  exportState?: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface SlideArtifact {
  id: string;
  deckId?: string;
  title: string;
  layoutType: string;
  blockIds: string[];
  notes?: string;
  order: number;
  readinessNotes?: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;

  // legacy compatibility
  type?: string;
  label?: string;
  value?: { title: string; bullets: string[] };
  confidence?: number;
  status?: ItemStatus;
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
