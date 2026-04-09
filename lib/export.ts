import type { WorkspaceModel } from '../types/workspace';

export interface ExportResult { success: boolean; code: string; message: string; payload?: string; }

export function exportWorkspace(state: WorkspaceModel, mode: 'document' | 'slides' | 'backup'): ExportResult {
  try {
    if (mode === 'document') {
      return { success: true, code: 'EXPORT_DOCUMENT_OK', message: 'Document export ready.', payload: state.smartDocs.map((d) => d.value).join('\n\n') };
    }
    if (mode === 'slides') {
      return { success: true, code: 'EXPORT_SLIDES_OK', message: 'Slides export ready.', payload: JSON.stringify(state.smartSlides, null, 2) };
    }
    return { success: true, code: 'EXPORT_BACKUP_OK', message: 'Workspace backup ready.', payload: JSON.stringify(state) };
  } catch (error) {
    return { success: false, code: 'EXPORT_FAILED', message: error instanceof Error ? error.message : 'Unknown export error' };
  }
}
