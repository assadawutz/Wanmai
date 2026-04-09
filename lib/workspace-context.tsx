import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { ingestInputs } from './ingestion';
import { generateSummary } from './summary';
import { validateWorkspace } from './validation';
import { createSnapshot, restoreSnapshot } from './history';
import { exportWorkspace } from './export';
import { buildActionItem } from './part3-policy';
import type { TraceableItem, WorkspaceInput, WorkspaceModel } from '../types/workspace';

type Action =
  | { type: 'INGEST'; payload: WorkspaceInput[] }
  | { type: 'UPDATE_DOC'; id: string; value: string }
  | { type: 'CREATE_DOC'; title: string; sourceId?: string }
  | { type: 'DUPLICATE_DOC'; id: string }
  | { type: 'SAVE_AS_DOC'; id: string; title: string }
  | { type: 'ADD_SLIDE' }
  | { type: 'UPDATE_SLIDE'; id: string; title: string; bullets: string[] }
  | { type: 'REORDER_SLIDES'; ids: string[] }
  | { type: 'UPDATE_THEME'; payload: WorkspaceModel['customization'] }
  | { type: 'SNAPSHOT'; label: string }
  | { type: 'RESTORE'; id: string }
  | { type: 'ADD_AUDIO'; transcript: string }
  | { type: 'ADD_KANBAN_CARD'; list: 'issues' | 'decisions'; label: string }
  | { type: 'SET_RUNTIME'; state: WorkspaceModel['runtime']['state']; provider?: WorkspaceModel['runtime']['provider']; notice?: string }
  | { type: 'EXPORT'; mode: 'document' | 'slides' | 'backup' };

const now = new Date().toISOString();

const initialState: WorkspaceModel = {
  workspaceMeta: { id: 'workspace-1', name: 'Wanmai Workspace Studio', createdAt: now, updatedAt: now, originalSchemaVersion: 1, migratedSchemaVersion: 1, migrationWarnings: [] },
  sourceFiles: [], extractedBlocks: [], entities: [], summaries: [], smartDocs: [{ id: 'doc-1', type: 'document', label: 'Executive Summary', value: 'Start writing here…', confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }],
  smartSheets: [{ id: 'sheet-1', type: 'sheet', label: 'Planning Sheet', value: [['Task', 'Owner', 'Status'], ['Kickoff', 'PM', 'Open']], confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }],
  smartSlides: [{ id: 'slide-1', type: 'slide', label: 'Opening', value: { title: 'Project Overview', bullets: ['Objective', 'Scope', 'Milestones'] }, confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }],
  storyboard: [], processMaps: [], mermaidDocuments: [{ id: 'mermaid-1', type: 'diagram', label: 'Flow', value: 'flowchart TD\nA[Upload]-->B[Analyze]\nB-->C[Build]\nC-->D[Present]', confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }],
  raid: [], issues: [], decisions: [], dependencies: [], changes: [], resources: [], budgets: [], releases: [], approvals: [],
  audioArtifacts: [], history: [], jobs: [], glossary: [], validation: [], customization: { theme: 'Lady Premium', density: 'comfortable', motion: 'normal' },
  runtime: { provider: 'ollama', state: 'degraded', modelAvailable: false, startupStatus: 'Auto-start pending runtime check', degradedNotice: 'Manual mode active. Workspace remains fully usable without AI.' },
  actionCenter: []
};

function reducer(state: WorkspaceModel, action: Action): WorkspaceModel {
  switch (action.type) {
    case 'INGEST': {
      const data = ingestInputs(action.payload);
      const updated: WorkspaceModel = {
        ...state,
        sourceFiles: [...state.sourceFiles, ...data.sourceFiles],
        extractedBlocks: [...state.extractedBlocks, ...data.extractedBlocks]
      };
      updated.summaries = generateSummary(updated);
      updated.validation = validateWorkspace(updated);
      updated.actionCenter = [
        buildActionItem({
          sourceAgent: 'Intake Agent',
          type: updated.validation.length > 0 ? 'review' : 'approve',
          severity: updated.validation.length > 0 ? 'warning' : 'info',
          title: updated.validation.length > 0 ? 'Validation review required' : 'Intake completed',
          description: `Processed ${data.sourceFiles.length} file(s) with parser normalization.`,
          nextStep: updated.validation.length > 0 ? 'Review validation cards and resolve warnings.' : 'Continue to Deep Summary.',
          status: 'open'
        }),
        ...state.actionCenter
      ];
      return updated;
    }
    case 'UPDATE_DOC':
      return { ...state, smartDocs: state.smartDocs.map((doc) => doc.id === action.id ? { ...doc, value: action.value, updatedAt: new Date().toISOString(), status: 'edited' } : doc) };
    case 'CREATE_DOC': {
      const id = `doc-${state.smartDocs.length + 1}`;
      const source = action.sourceId ? state.sourceFiles.find((file) => file.id === action.sourceId)?.rawContent ?? '' : '';
      const nowIso = new Date().toISOString();
      const value = source ? `# ${action.title}\n\n${source.slice(0, 3000)}` : `# ${action.title}\n\nStart drafting your document.`;
      return {
        ...state,
        smartDocs: [
          {
            id,
            type: 'document',
            label: action.title,
            value,
            confidence: 1,
            status: 'user-added',
            createdAt: nowIso,
            updatedAt: nowIso
          },
          ...state.smartDocs
        ]
      };
    }
    case 'DUPLICATE_DOC': {
      const source = state.smartDocs.find((doc) => doc.id === action.id);
      if (!source) return state;
      const id = `doc-${state.smartDocs.length + 1}`;
      const nowIso = new Date().toISOString();
      return {
        ...state,
        smartDocs: [
          {
            ...source,
            id,
            label: `${source.label} (Copy)`,
            createdAt: nowIso,
            updatedAt: nowIso
          },
          ...state.smartDocs
        ]
      };
    }
    case 'SAVE_AS_DOC':
      return {
        ...state,
        smartDocs: state.smartDocs.map((doc) => (
          doc.id === action.id
            ? { ...doc, label: action.title, updatedAt: new Date().toISOString(), status: 'confirmed' }
            : doc
        ))
      };
    case 'ADD_SLIDE': {
      const id = `slide-${state.smartSlides.length + 1}`;
      return { ...state, smartSlides: [...state.smartSlides, { id, type: 'slide', label: `Slide ${state.smartSlides.length + 1}`, value: { title: 'New Slide', bullets: ['Insight', 'Evidence', 'Action'] }, confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }] };
    }
    case 'UPDATE_SLIDE':
      return {
        ...state,
        smartSlides: state.smartSlides.map((slide) => (
          slide.id === action.id
            ? {
                ...slide,
                label: action.title,
                value: { title: action.title, bullets: action.bullets },
                updatedAt: new Date().toISOString(),
                status: 'edited'
              }
            : slide
        ))
      };
    case 'REORDER_SLIDES': {
      const mapped = new Map(state.smartSlides.map((slide) => [slide.id, slide]));
      const reordered = action.ids.map((id) => mapped.get(id)).filter((slide): slide is NonNullable<typeof slide> => Boolean(slide));
      const rest = state.smartSlides.filter((slide) => !action.ids.includes(slide.id));
      return { ...state, smartSlides: [...reordered, ...rest] };
    }
    case 'UPDATE_THEME':
      return { ...state, customization: action.payload };
    case 'SNAPSHOT':
      return { ...state, history: [createSnapshot(state, action.label), ...state.history] };
    case 'RESTORE': {
      const restored = restoreSnapshot(state, action.id);
      return {
        ...restored,
        actionCenter: [
          buildActionItem({
            sourceAgent: 'Sync / History Agent',
            type: 'review',
            severity: 'info',
            title: 'Snapshot restored',
            description: `Restore operation completed for snapshot ${action.id}.`,
            nextStep: 'Run validation before external export.',
            status: 'open'
          }),
          ...restored.actionCenter
        ]
      };
    }
    case 'ADD_AUDIO': {
      const actions = action.transcript.split('.').filter((t) => /action|next|decide/i.test(t)).map((t) => t.trim());
      return { ...state, audioArtifacts: [...state.audioArtifacts, { id: `audio-${state.audioArtifacts.length + 1}`, type: 'audio-summary', label: `Audio Summary ${state.audioArtifacts.length + 1}`, value: { transcript: action.transcript, actions }, confidence: 0.7, status: 'extracted', createdAt: now, updatedAt: now }],
        actionCenter: [
          buildActionItem({
            sourceAgent: 'Meeting / Action Hub',
            type: actions.length > 0 ? 'approve' : 'clarify',
            severity: actions.length > 0 ? 'info' : 'warning',
            title: actions.length > 0 ? 'Meeting actions extracted' : 'No clear actions detected',
            description: actions.length > 0 ? `Detected ${actions.length} follow-up action(s).` : 'Transcript needs clearer decision/action phrases.',
            nextStep: actions.length > 0 ? 'Assign owners in Operate modules.' : 'Edit transcript and rerun extraction.',
            status: 'open'
          }),
          ...state.actionCenter
        ] };
    }
    case 'ADD_KANBAN_CARD': {
      const collection = action.list === 'issues' ? state.issues : state.decisions;
      const item: TraceableItem<string> = { id: `${action.list}-${collection.length + 1}`, type: action.list, label: action.label, value: action.label, confidence: 1, status: 'user-added', createdAt: now, updatedAt: now };
      return action.list === 'issues' ? { ...state, issues: [...state.issues, item] } : { ...state, decisions: [...state.decisions, item] };
    }
    case 'SET_RUNTIME':
      return {
        ...state,
        runtime: {
          ...state.runtime,
          state: action.state,
          provider: action.provider ?? state.runtime.provider,
          degradedNotice: action.notice ?? state.runtime.degradedNotice
        }
      };
    case 'EXPORT': {
      const result = exportWorkspace(state, action.mode);
      return {
        ...state,
        jobs: [
          {
            id: `job-export-${Date.now()}`,
            type: 'export',
            label: `${action.mode} export`,
            value: result.message,
            confidence: result.success ? 1 : 0.3,
            status: result.success ? 'confirmed' : 'failed-extraction',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            state: result.success ? 'succeeded' : 'failed'
          },
          ...state.jobs
        ]
      };
    }
    default:
      return state;
  }
}

const WorkspaceContext = createContext<{ state: WorkspaceModel; dispatch: React.Dispatch<Action> } | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): { state: WorkspaceModel; dispatch: React.Dispatch<Action> } {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider');
  return ctx;
}
