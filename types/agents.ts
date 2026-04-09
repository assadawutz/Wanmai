export const featureKeys = [
  'home','intake','parseNormalize','reader','extractedStructure','entityExplorer','sourceTrace','deepSummary','insights','validation','smartDocs','smartSheets','smartSlides','visualBoard','workspaceCanvas','flowStudio','mermaidStudio','storyboardStudio','presentationBuilder','issues','raid','decisions','dependencies','changes','resources','timeline','budget','approvals','meetingActionHub','releaseBoard','apiSystemMap','pmOps','technicalOps','salesOps','executiveCockpit','proposalWorkspace','previewHub','presentationMode','exportCenter','historyRestore','readinessScores','aiRuntime','integrations','privacyRedaction','logsJobs'
] as const;

export type FeatureKey = typeof featureKeys[number];

export interface FeaturePromptConfig {
  featureKey: FeatureKey;
  intent: string;
  outputShape: string[];
  qualityGoal: string;
  fallbackMode: string;
  readinessRequired: boolean;
  traceRequired: boolean;
  roleAware: boolean;
  visualFirst: boolean;
}

export interface FeatureRuleset {
  featureKey: FeatureKey;
  mandatorySections: string[];
  forbiddenBehaviors: string[];
  confidencePolicy: string;
  fallbackPolicy: string;
  readinessPolicy: string;
  sharePolicy: string;
  sourceGroundingPolicy: string;
  uiRenderPolicy: string;
}

export interface FeatureStateMachine {
  key:
    | 'appBoot'
    | 'intake'
    | 'reader'
    | 'summary'
    | 'docEditor'
    | 'sheet'
    | 'slide'
    | 'canvasBoard'
    | 'flow'
    | 'mermaid'
    | 'presentationBuilder'
    | 'export'
    | 'historyRestore'
    | 'aiRuntime';
  states: string[];
  transitions: string[];
  rules: string[];
}
