import type { FeatureKey, FeaturePromptConfig } from '../types/agents';

const sharedOutputShape = [
  'factualCore',
  'interpretation',
  'risksAndGaps',
  'recommendations',
  'nextActions',
  'readinessJudgment',
  'traceLinks'
];

const featureIntentMap: Record<FeatureKey, string> = {
  home: 'Prioritize best next action and unfinished work immediately.',
  intake: 'Classify sources and preserve raw input while parsing safely.',
  parseNormalize: 'Extract normalized blocks/entities with confidence and warnings.',
  reader: 'Render original source with extracted insight and trace.',
  extractedStructure: 'Represent parsed structure clearly even when partial.',
  entityExplorer: 'Cluster and link entities to evidence and artifacts.',
  sourceTrace: 'Expose confidence and source grounding for major claims.',
  deepSummary: 'Produce layered summary and interpretation.',
  insights: 'Surface strengths, risks, gaps, ambiguity, and options.',
  validation: 'Evaluate confidence and report remediation hints.',
  smartDocs: 'Generate and edit share-ready documents with evidence.',
  smartSheets: 'Transform imported data into analysis-friendly grids/charts.',
  smartSlides: 'Build coherent slide narratives and readiness notes.',
  visualBoard: 'Create scannable one-page visual boards.',
  workspaceCanvas: 'Compose mixed artifacts in a visual-first operating canvas.',
  flowStudio: 'Model process/dependency flows with non-fatal validation.',
  mermaidStudio: 'Create valid Mermaid code with resilient render flow.',
  storyboardStudio: 'Structure scene sequence and transition path.',
  presentationBuilder: 'Assemble audience-ready presentation flow and deck.',
  issues: 'Track issues with ownership, severity, and actionability.',
  raid: 'Manage risks/assumptions/issues/dependencies with mitigation clarity.',
  decisions: 'Capture options, rationale, impact, and approval state.',
  dependencies: 'Map critical dependency paths and conflicts.',
  changes: 'Assess cross-domain change impact before approval.',
  resources: 'Model capacity allocations and conflicts.',
  timeline: 'Track milestones and schedule risks safely.',
  budget: 'Present budget confidence, deltas, and scenarios.',
  approvals: 'Support explicit review decisions with notes.',
  meetingActionHub: 'Convert transcript lines into actions and decisions.',
  releaseBoard: 'Track release readiness by environment with blockers.',
  apiSystemMap: 'Visualize service/API map and unknown ownership.',
  pmOps: 'Provide PM control tower with readiness and risks.',
  technicalOps: 'Provide technical operating view for architecture and release health.',
  salesOps: 'Convert evidence into sales-facing opportunities and next steps.',
  executiveCockpit: 'Deliver concise leadership signal with explicit tradeoffs.',
  proposalWorkspace: 'Build proposal artifacts with grounded claims.',
  previewHub: 'Preview artifacts and evaluate readiness before share.',
  presentationMode: 'Provide clean audience-safe presentation mode.',
  exportCenter: 'Package exports with retries and explicit outcomes.',
  historyRestore: 'Protect workspace snapshots and safe restoration.',
  readinessScores: 'Score readiness dimensions and exact fix paths.',
  aiRuntime: 'Operate runtime in ready/degraded/failure-safe modes.',
  integrations: 'Track sync/auth states and degradation warnings.',
  privacyRedaction: 'Apply and verify privacy-safe output handling.',
  logsJobs: 'Monitor logs/jobs without blocking primary flows.'
};

export const promptRegistry: Record<FeatureKey, FeaturePromptConfig> = Object.fromEntries(
  (Object.keys(featureIntentMap) as FeatureKey[]).map((featureKey) => [
    featureKey,
    {
      featureKey,
      intent: featureIntentMap[featureKey],
      outputShape: sharedOutputShape,
      qualityGoal: 'Detailed, understandable, actionable, grounded.',
      fallbackMode: 'factOnly',
      readinessRequired: true,
      traceRequired: true,
      roleAware: true,
      visualFirst: true
    }
  ])
) as Record<FeatureKey, FeaturePromptConfig>;
