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

export interface BoardArtifact { id: string; title: string; boardType: 'one-page-summary' | 'pm-board' | 'executive-board' | 'sales-board' | 'stakeholder-board' | 'risk-board' | 'action-board' | 'launch-board' | 'planning-board' | 'custom'; widgetIds: string[]; linkedSourceIds: string[]; linkedSummaryIds: string[]; layoutState: string; readinessVerdict?: string; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface CanvasArtifact { id: string; title: string; nodeIds: string[]; edgeIds: string[]; viewport: string; layerTree: string; linkedSourceIds: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface FlowArtifact { id: string; title: string; flowType: 'process' | 'dependency' | 'release' | 'sales-pipeline' | 'ingestion' | 'system-map' | 'custom'; nodeIds: string[]; edgeIds: string[]; validationResults: string[]; linkedSourceIds: string[]; linkedSummaryIds: string[]; exportRefs: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface MermaidArtifact { id: string; title: string; diagramType: 'flowchart' | 'sequenceDiagram' | 'stateDiagram-v2' | 'gantt' | 'journey' | 'classDiagram' | 'erDiagram'; code: string; linkedFlowId?: string; linkedSourceIds: string[]; validationState: string; lastValidCode?: string; renderWarnings: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface StoryboardArtifact { id: string; title: string; sceneIds: string[]; routeEdges: string[]; linkedSourceIds: string[]; linkedDeckId?: string; readinessVerdict?: string; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface PresentationArtifact { id: string; title: string; audience: string; sourceArtifactIds: string[]; storyline: string; sectionOrder: string[]; slideDeckId?: string; linkedStoryboardId?: string; notes?: string; readinessVerdict?: string; presentModeConfig?: string; exportState?: string; createdAt: IsoDateString; updatedAt: IsoDateString; }

export interface IssueItem { id: string; title: string; description: string; severity: 'low' | 'medium' | 'high' | 'critical'; status: 'open' | 'in_progress' | 'blocked' | 'resolved'; owner?: string; dueDate?: string; linkedSourceIds: string[]; linkedDecisionIds: string[]; linkedRiskIds: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; label?: string; value?: string; confidence?: number; }
export interface RaidItem { id: string; raidType: 'risk' | 'assumption' | 'issue' | 'dependency'; title: string; description: string; impact: string; likelihood: string; severity: 'low' | 'medium' | 'high' | 'critical'; owner?: string; mitigation?: string; trigger?: string; linkedSourceIds: string[]; linkedArtifactIds: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface DecisionItem { id: string; title: string; context: string; options: string[]; chosenOption?: string; rationale: string; impact: string; evidenceRefs: string[]; approvalState: 'pending' | 'approved' | 'rejected'; linkedSourceIds: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; label?: string; value?: string; confidence?: number; }
export interface DependencyItem { id: string; title: string; dependencyType: string; sourceRef: string; targetRef: string; severity: 'low' | 'medium' | 'high' | 'critical'; note?: string; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface ChangeRequest { id: string; title: string; reason: string; scopeImpact: string; timelineImpact: string; budgetImpact: string; technicalImpact: string; approvalState: 'pending' | 'approved' | 'rejected'; linkedSourceIds: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface ResourceItem { id: string; personOrRole: string; allocationPercent: number; period: string; projectRef: string; conflictState: 'none' | 'warning' | 'conflict'; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface BudgetItem { id: string; category: string; label: string; amount: number; confidence: number; linkedSourceIds: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface ReleaseItem { id: string; environment: string; version: string; readinessState: string; blockers: string[]; checklist: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface ApprovalItem { id: string; artifactType: string; artifactId: string; state: 'requested' | 'approved' | 'rejected' | 'revise'; requestedBy: string; reviewedBy?: string; note?: string; createdAt: IsoDateString; updatedAt: IsoDateString; }

export interface TranscriptLine { id: string; speaker: string; startMs: number; endMs: number; text: string; confidence: number; }
export interface AudioArtifact { id: string; sourceFileId?: string; title: string; transcriptLines: TranscriptLine[]; speakerMap: Record<string, string>; speedOptions: number[]; summaryRefs: string[]; createdAt: IsoDateString; updatedAt: IsoDateString; }

export interface ActionCenterItem {
  id: string;
  sourceAgent: string;
  type: 'fix' | 'review' | 'approve' | 'rewrite' | 'present' | 'export' | 'retry' | 'investigate' | 'clarify' | 'redact';
  severity: 'info' | 'warning' | 'critical' | 'error';
  title: string;
  description: string;
  linkedArtifactId?: string;
  linkedArtifactType?: string;
  linkedSourceId?: string;
  nextStep: string;
  status: 'open' | 'in_progress' | 'blocked' | 'resolved' | ItemStatus;
  createdAt: IsoDateString;
  updatedAt?: IsoDateString;
}

export interface ReadinessReport { id: string; artifactType: string; artifactId: string; verdict: string; visualPolishScore: number; readabilityScore: number; structureScore: number; densityScore: number; audienceFitScore: number; evidenceScore: number; presentationSafetyScore: number; overallScore: number; whatWorks: string; whatFails: string; improvementPath: string; createdAt: IsoDateString; updatedAt: IsoDateString; }
export interface ValidationResult { id: string; targetType: string; targetId: string; code: string; severity: 'info' | 'warning' | 'error'; message: string; detail: string; fixHint: string; createdAt: IsoDateString; }
export interface WorkspaceSnapshot { id: string; label: string; createdAt: IsoDateString; createdBy?: string; snapshotVersion?: number; payloadRef?: string; validationState?: string; migrationWarnings?: string[]; state?: WorkspaceState; }

export interface AiRuntimeState { provider: string; status: 'checking' | 'ready' | 'starting-local' | 'degraded' | 'failed' | 'retrying'; autoStartEnabled: boolean; localEndpoint?: string; activeModel?: string; availableModels: string[]; degradedMode: boolean; lastCheckedAt?: IsoDateString; lastError?: string; }
export interface IntegrationState { googleAuth: string; googleDrive: string; aiRuntime: AiRuntimeState; syncState: string; lastSyncAt?: IsoDateString; warnings: string[]; }

export interface WorkspaceState {
  version: number;
  workspaceMeta: WorkspaceMeta;
  sourceFiles: SourceFile[];
  extractedBlocks: ExtractedBlock[];
  entities: Entity[];
  summaries: SummaryArtifact[];
  documents: DocumentArtifact[];
  spreadsheets: SpreadsheetArtifact[];
  slides: SlideArtifact[];
  boards: BoardArtifact[];
  canvases: CanvasArtifact[];
  flows: FlowArtifact[];
  mermaidDocuments: MermaidArtifact[];
  storyboards: StoryboardArtifact[];
  presentations: PresentationArtifact[];
  issues: IssueItem[];
  raid: RaidItem[];
  decisions: DecisionItem[];
  dependencies: DependencyItem[];
  changes: ChangeRequest[];
  resources: ResourceItem[];
  budgets: BudgetItem[];
  releases: ReleaseItem[];
  approvals: ApprovalItem[];
  audioArtifacts: AudioArtifact[];
  actionCenter: ActionCenterItem[];
  readinessReports: ReadinessReport[];
  validationResults: ValidationResult[];
  history: WorkspaceSnapshot[];
  exports: string[];
  integrations: IntegrationState;
  runtime: AiRuntimeState;
  ui: { mobile: boolean; activePanel: string; density: 'airy' | 'calm' | 'dense'; degradedShell: boolean };
  jobs: { id: string; label: string; state: 'queued' | 'running' | 'success' | 'failed' | 'retrying' }[];
  glossary: { id: string; term: string; definition: string }[];

  // legacy compatibility aliases
  smartDocs: DocumentArtifact[];
  smartSheets: SpreadsheetArtifact[];
  smartSlides: SlideArtifact[];
  storyboard: SceneNode[];
  processMaps: { id: string; label: string; value: string }[];
  validation: ValidationResult[];
  customization: { theme: string; density: 'compact' | 'comfortable'; motion: 'low' | 'normal' };
}

export type WorkspaceModel = WorkspaceState;

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

export interface SceneNode extends TraceableItem<Record<string, unknown>> {
  parentId?: string;
  children: string[];
  visible: boolean;
  locked: boolean;
  selected: boolean;
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

export interface WorkspaceInput {
  name: string;
  mimeType: string;
  content: string;
}
