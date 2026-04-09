import type { ValidationIssue, WorkspaceModel } from '../types/workspace';

export function validateWorkspace(workspace: WorkspaceModel): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!workspace.workspaceMeta.name.trim()) {
    issues.push({ isValid: false, code: 'META_NAME_MISSING', message: 'Workspace name is required.', severity: 'error', affectedSection: 'workspaceMeta' });
  }
  if (workspace.sourceFiles.length === 0) {
    issues.push({ isValid: false, code: 'NO_FILES', message: 'No source files uploaded.', severity: 'warning', affectedSection: 'sourceFiles' });
  }
  workspace.sourceFiles.forEach((file) => {
    if (file.status === 'failed-extraction') {
      issues.push({ isValid: false, code: 'FILE_PARSE_FAILED', message: `Could not parse ${file.name}`, severity: 'warning', affectedFileId: file.id, affectedSection: 'ingestion' });
    }
  });
  workspace.storyboard.forEach((node) => {
    if (node.parentId && !workspace.storyboard.some((target) => target.id === node.parentId)) {
      issues.push({ isValid: false, code: 'BROKEN_STORYBOARD_LINK', message: `Node ${node.label} references missing parent.`, severity: 'error', affectedEntityId: node.id, affectedSection: 'storyboard' });
    }
  });
  return issues;
}
