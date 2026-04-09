import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { ingestInputs } from './ingestion';
import { generateSummary } from './summary';
import { validateWorkspace } from './validation';
import { createSnapshot, restoreSnapshot } from './history';
import type { TraceableItem, WorkspaceInput, WorkspaceModel } from '../types/workspace';

type Action =
  | { type: 'INGEST'; payload: WorkspaceInput[] }
  | { type: 'UPDATE_DOC'; id: string; value: string }
  | { type: 'ADD_SLIDE' }
  | { type: 'UPDATE_THEME'; payload: WorkspaceModel['customization'] }
  | { type: 'SNAPSHOT'; label: string }
  | { type: 'RESTORE'; id: string }
  | { type: 'ADD_AUDIO'; transcript: string }
  | { type: 'ADD_KANBAN_CARD'; list: 'issues' | 'decisions'; label: string };

const now = new Date().toISOString();

const initialState: WorkspaceModel = {
  workspaceMeta: { id: 'workspace-1', name: 'Wanmai Workspace Studio', createdAt: now, updatedAt: now, originalSchemaVersion: 1, migratedSchemaVersion: 1, migrationWarnings: [] },
  sourceFiles: [], extractedBlocks: [], entities: [], summaries: [], smartDocs: [{ id: 'doc-1', type: 'document', label: 'Executive Summary', value: 'Start writing here…', confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }],
  smartSheets: [{ id: 'sheet-1', type: 'sheet', label: 'Planning Sheet', value: [['Task', 'Owner', 'Status'], ['Kickoff', 'PM', 'Open']], confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }],
  smartSlides: [{ id: 'slide-1', type: 'slide', label: 'Opening', value: { title: 'Project Overview', bullets: ['Objective', 'Scope', 'Milestones'] }, confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }],
  storyboard: [], processMaps: [], mermaidDocuments: [{ id: 'mermaid-1', type: 'diagram', label: 'Flow', value: 'flowchart TD\nA[Upload]-->B[Analyze]\nB-->C[Build]\nC-->D[Present]', confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }],
  raid: [], issues: [], decisions: [], dependencies: [], changes: [], resources: [], budgets: [], releases: [], approvals: [],
  audioArtifacts: [], history: [], jobs: [], glossary: [], validation: [], customization: { theme: 'Lady Premium', density: 'comfortable', motion: 'normal' }
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
      return updated;
    }
    case 'UPDATE_DOC':
      return { ...state, smartDocs: state.smartDocs.map((doc) => doc.id === action.id ? { ...doc, value: action.value, updatedAt: new Date().toISOString(), status: 'edited' } : doc) };
    case 'ADD_SLIDE': {
      const id = `slide-${state.smartSlides.length + 1}`;
      return { ...state, smartSlides: [...state.smartSlides, { id, type: 'slide', label: `Slide ${state.smartSlides.length + 1}`, value: { title: 'New Slide', bullets: ['Insight', 'Evidence', 'Action'] }, confidence: 1, status: 'user-added', createdAt: now, updatedAt: now }] };
    }
    case 'UPDATE_THEME':
      return { ...state, customization: action.payload };
    case 'SNAPSHOT':
      return { ...state, history: [createSnapshot(state, action.label), ...state.history] };
    case 'RESTORE':
      return restoreSnapshot(state, action.id);
    case 'ADD_AUDIO': {
      const actions = action.transcript.split('.').filter((t) => /action|next|decide/i.test(t)).map((t) => t.trim());
      return { ...state, audioArtifacts: [...state.audioArtifacts, { id: `audio-${state.audioArtifacts.length + 1}`, type: 'audio-summary', label: `Audio Summary ${state.audioArtifacts.length + 1}`, value: { transcript: action.transcript, actions }, confidence: 0.7, status: 'extracted', createdAt: now, updatedAt: now }] };
    }
    case 'ADD_KANBAN_CARD': {
      const collection = action.list === 'issues' ? state.issues : state.decisions;
      const item: TraceableItem<string> = { id: `${action.list}-${collection.length + 1}`, type: action.list, label: action.label, value: action.label, confidence: 1, status: 'user-added', createdAt: now, updatedAt: now };
      return action.list === 'issues' ? { ...state, issues: [...state.issues, item] } : { ...state, decisions: [...state.decisions, item] };
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
