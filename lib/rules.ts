import type { FeatureKey, FeatureRuleset } from '../types/agents';

const defaultMandatorySections = [
  'whatItIs',
  'whatMattersMost',
  'detailedInterpretation',
  'risksAndGaps',
  'prosAndCons',
  'recommendations',
  'nextActions',
  'overallSummary',
  'readinessJudgment'
];

const defaultForbiddenBehaviors = [
  'shallowCompressionOnly',
  'unsupportedConfidence',
  'missingRecommendations',
  'blankReadinessVerdict'
];

export const rulesRegistry: Record<FeatureKey, FeatureRuleset> = Object.fromEntries(
  ([
    'home','intake','parseNormalize','reader','extractedStructure','entityExplorer','sourceTrace','deepSummary','insights','validation','smartDocs','smartSheets','smartSlides','visualBoard','workspaceCanvas','flowStudio','mermaidStudio','storyboardStudio','presentationBuilder','issues','raid','decisions','dependencies','changes','resources','timeline','budget','approvals','meetingActionHub','releaseBoard','apiSystemMap','pmOps','technicalOps','salesOps','executiveCockpit','proposalWorkspace','previewHub','presentationMode','exportCenter','historyRestore','readinessScores','aiRuntime','integrations','privacyRedaction','logsJobs'
  ] as FeatureKey[]).map((featureKey) => [
    featureKey,
    {
      featureKey,
      mandatorySections: defaultMandatorySections,
      forbiddenBehaviors: defaultForbiddenBehaviors,
      confidencePolicy: 'facts and inference separated',
      fallbackPolicy: 'if deep analysis unavailable, keep fact-only summary and mark interpretation unavailable',
      readinessPolicy: 'always produce readiness verdict for shareable outputs',
      sharePolicy: 'not ready outputs must list exact fixes',
      sourceGroundingPolicy: 'important claims linked to source where possible',
      uiRenderPolicy: 'summary cards first, long text secondary'
    }
  ])
) as Record<FeatureKey, FeatureRuleset>;
