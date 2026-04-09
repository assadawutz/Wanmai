import type { TraceableItem, WorkspaceModel } from '../types/workspace';

export function generateSummary(workspace: WorkspaceModel): TraceableItem<string>[] {
  const combined = workspace.extractedBlocks.map((b) => b.value).join(' ');
  const words = combined.split(/\s+/).filter(Boolean);
  const quick = words.slice(0, 35).join(' ');
  const risks = workspace.issues.map((i) => i.label).join(', ') || 'No material risks detected';
  const actions = workspace.decisions.map((d) => d.label).join(', ') || 'Define next actions';
  const now = new Date().toISOString();
  return [
    { id: 'summary-quick', type: 'summary', label: 'Quick Summary', value: quick || 'No parsed text yet.', confidence: 0.75, status: 'extracted', createdAt: now, updatedAt: now },
    { id: 'summary-deep', type: 'summary', label: 'Deep Summary', value: `Risks: ${risks}. Recommendations: ${actions}.`, confidence: 0.67, status: 'extracted', createdAt: now, updatedAt: now }
  ];
}
