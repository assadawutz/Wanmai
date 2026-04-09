import type { WorkspaceModel } from '../types/workspace';

export function createSnapshot(state: WorkspaceModel, label: string): WorkspaceModel['history'][number] {
  return {
    id: `snapshot-${Date.now()}`,
    label,
    createdAt: new Date().toISOString(),
    state: structuredClone(state)
  };
}

export function restoreSnapshot(state: WorkspaceModel, snapshotId: string): WorkspaceModel {
  const snapshot = state.history.find((entry) => entry.id === snapshotId);
  if (!snapshot) return state;
  return { ...structuredClone(snapshot.state), history: state.history };
}
