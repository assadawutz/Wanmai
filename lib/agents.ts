import { systemAgents } from './part3-policy';
import type { WorkspaceModel } from '../types/workspace';

export function runAgents(state: WorkspaceModel): string[] {
  const outputs: string[] = [];
  const hasFiles = state.sourceFiles.length > 0;
  const parseFailures = state.sourceFiles.filter((file) => file.status === 'failed-extraction').length;

  outputs.push(`Home Agent: best next step is ${hasFiles ? 'review Deep Summary and readiness scores' : 'upload source files in Intake Hub'}.`);
  outputs.push(`Intake Agent: ${state.sourceFiles.length} file(s) staged, ${parseFailures} parse warning(s).`);
  outputs.push(`Validation Agent: ${state.validation.length} issue(s) tracked for release safety.`);
  outputs.push(`Readiness Evaluator: docs/slides/presentation are ${state.validation.length > 0 ? 'not ready for external viewing' : 'needs minor polish'} for external sharing.`);
  outputs.push(`Runtime Agent: workspace continues in degraded-safe mode when AI runtime is unavailable.`);
  outputs.push(`Export Agent: ${state.smartSlides.length} slide(s) and ${state.smartDocs.length} doc(s) ready for packaging.`);
  outputs.push(`System coverage: ${systemAgents.map((agent) => agent.name).join(', ')}.`);

  return outputs;
}
