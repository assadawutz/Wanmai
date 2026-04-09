import type { WorkspaceModel } from '../types/workspace';

export function runAgents(state: WorkspaceModel): string[] {
  const outputs: string[] = [];
  outputs.push(`Intake Agent: ${state.sourceFiles.length} files staged.`);
  outputs.push(`Validation Agent: ${state.validation.length} issue(s) tracked.`);
  outputs.push(`PM Agent: ${state.issues.length} issues, ${state.decisions.length} decisions.`);
  outputs.push(`Export Agent: ${state.smartSlides.length} slides ready for packaging.`);
  return outputs;
}
