export type ShellRegion = 'topAppBar' | 'workspaceSurface' | 'quickActions' | 'bottomActionRail' | 'bottomInspectorSheet' | 'statusOverlay' | 'fullScreenModal';

export interface GlobalShellSpec {
  mobile: readonly ShellRegion[];
  desktop: readonly string[];
}

export interface SurfaceContract {
  workingOn: string;
  systemRecommendation: string;
  riskOrUnresolved: string;
  moveForward: string;
  safeExit: string;
}

export interface ScreenBlueprint {
  id: string;
  title: string;
  purpose: string;
  mobileLayout: readonly string[];
  desktopLayout: readonly string[];
  keyInteractions: readonly string[];
  qualityGoal: string;
  surfaceContract: SurfaceContract;
}

export const globalShellSpec: GlobalShellSpec = {
  mobile: ['topAppBar', 'workspaceSurface', 'quickActions', 'bottomActionRail', 'bottomInspectorSheet', 'statusOverlay', 'fullScreenModal'],
  desktop: ['leftNavigation', 'topCommandBar', 'centerWorkspaceSurface', 'rightInspectorOrCopilotPanel', 'bottomStatusJobsValidationRail', 'modalOrDrawerSubflow']
};

export const globalLayoutHierarchy = 'main > section > div.container.mx-auto.px-4' as const;

export const globalColorRule = {
  baseBackground: ['petal white', 'daisy cream'],
  secondarySurfaces: ['blush pink tints', 'silver mist'],
  accents: ['dusty rose', 'warm plum'],
  support: {
    success: 'soft green',
    warning: 'muted amber',
    error: 'muted rose'
  },
  decoration: 'subtle daisy pattern only on calm surfaces'
} as const;

export const globalInteractionBlueprint = {
  primaryActions: ['Upload', 'Continue', 'Generate', 'Convert', 'Present', 'Export', 'Approve', 'Retry'],
  secondaryActions: ['Compare', 'Trace', 'Validate', 'Duplicate', 'Reorder', 'Save snapshot'],
  inspectorSections: ['Basics', 'Content', 'Links / Source', 'Style / Layout', 'Validation / Warnings', 'Actions', 'Readiness'],
  loadingModel: ['skeletons for cards/panels', 'progressive loading', 'stage-based labels for multi-step processes', 'no blank waiting states'],
  errorModel: ['what failed', 'where it failed', 'whether work is preserved', 'retry action', 'alternate safe path'],
  successModel: ['concise status', 'next meaningful action', 'where output went', 'optional open/view action']
} as const;

export const screenBlueprintByRoute: Record<string, ScreenBlueprint> = {
  '/home': {
    id: 'home',
    title: 'Home Screen',
    purpose: 'Orient user quickly, reduce decision fatigue, and start work fast.',
    mobileLayout: ['app bar', 'workspace title + runtime state chip', 'primary upload action', 'suggested next actions', 'recent work', 'active jobs strip', 'pinned outputs strip', 'bottom action rail'],
    desktopLayout: ['top command bar', 'left summary column', 'center suggested actions + recent work + current outputs', 'right assistant starter + blockers', 'bottom jobs/validation rail'],
    keyInteractions: ['continue recent work', 'upload immediately', 'jump to summaries', 'jump to presentation builder', 'review blockers'],
    qualityGoal: 'User understands next action instantly.',
    surfaceContract: {
      workingOn: 'current workspace snapshot and active jobs',
      systemRecommendation: 'suggested actions prioritized by urgency and readiness',
      riskOrUnresolved: 'failed jobs, pending approvals, and blockers',
      moveForward: 'continue, upload, or open role-focused workbench',
      safeExit: 'save snapshot before leaving active flow'
    }
  },
  '/intake': {
    id: 'intake-hub',
    title: 'Intake Hub',
    purpose: 'Receive files, classify them, and route correctly.',
    mobileLayout: ['upload zone card', 'queue list', 'file cards with role tags', 'parse progress cards', 'warnings cards', 'merge/replace suggestions', 'suggested outputs cards'],
    desktopLayout: ['left upload zone and import actions', 'center queue + role cards + ingestion pipeline', 'right warnings + merge/replace + next outputs'],
    keyInteractions: ['drag/drop upload', 'import from Drive', 'retry parse', 'merge/replace/keep separate', 'open file in reader'],
    qualityGoal: 'Every file is accounted for and actionable.',
    surfaceContract: {
      workingOn: 'source intake queue and file role classification',
      systemRecommendation: 'merge/replace and output generation suggestions',
      riskOrUnresolved: 'parse failures, low-confidence extraction, conflicts',
      moveForward: 'retry parse or route to reader/summary',
      safeExit: 'preserve raw source and queue state'
    }
  },
  '/reader': {
    id: 'universal-reader',
    title: 'Universal Reader',
    purpose: 'Read source, inspect structure, and act from trusted evidence.',
    mobileLayout: ['segmented control (Source/Summary/Insights/Trace/Actions)', 'active content surface', 'quick convert actions', 'bottom evidence sheet'],
    desktopLayout: ['left source preview + section navigation', 'center extracted structure + summaries', 'right source trace + confidence + suggestions + copilot'],
    keyInteractions: ['read source', 'tap section', 'open evidence', 'generate doc/slide/board/flow from selection'],
    qualityGoal: 'User trusts what is shown and can act immediately.',
    surfaceContract: {
      workingOn: 'source content with extraction context',
      systemRecommendation: 'convert high-value sections into artifacts',
      riskOrUnresolved: 'low-confidence claims or missing trace links',
      moveForward: 'select section and convert to next artifact',
      safeExit: 'return to source view with linked evidence retained'
    }
  },
  '/summary': {
    id: 'summary-insights',
    title: 'Summary / Insights',
    purpose: 'Show layered interpretation beyond compression.',
    mobileLayout: ['summary type tabs', 'quick summary card', 'key points chips', 'risks/gaps cards', 'recommendations cards', 'role lens tabs', 'readiness note'],
    desktopLayout: ['left summary navigation', 'center summary board + key points + pros/cons + risks/gaps', 'right recommendations + next actions + role lens + trace shortcuts'],
    keyInteractions: ['switch summary layer', 'compare role lenses', 'send to doc/slide/board', 'open source evidence'],
    qualityGoal: 'User understands what source means and what to do next.',
    surfaceContract: {
      workingOn: 'layered summary board with role context',
      systemRecommendation: 'next action recommendations and conversion targets',
      riskOrUnresolved: 'gaps, ambiguity, and confidence warnings',
      moveForward: 'promote selected insights into docs/slides/boards',
      safeExit: 'keep fact-only fallback summary accessible'
    }
  },
  '/docs': {
    id: 'smart-docs',
    title: 'Smart Docs',
    purpose: 'Create and refine structured documents.',
    mobileLayout: ['doc title', 'block editor surface', 'quick insert', 'formatting sheet', 'evidence sheet', 'readiness chip'],
    desktopLayout: ['left section tree + templates', 'center block editor', 'right inspector + evidence rail + copilot', 'bottom autosave/export/status rail'],
    keyInteractions: ['add section', 'reorder section', 'rewrite selection', 'attach evidence', 'print preview', 'export'],
    qualityGoal: 'Document is structured, grounded, and safe to share.',
    surfaceContract: {
      workingOn: 'active document and section structure',
      systemRecommendation: 'evidence-backed rewrites and readiness fixes',
      riskOrUnresolved: 'unsupported claims and unresolved readiness issues',
      moveForward: 'resolve warnings then export',
      safeExit: 'autosave snapshot + restore path'
    }
  },
  '/slides': {
    id: 'smart-slides',
    title: 'Smart Slides',
    purpose: 'Build presentation decks visually.',
    mobileLayout: ['deck title', 'horizontal thumbnail rail', 'active slide', 'notes sheet', 'layout/theme sheet', 'readiness chip'],
    desktopLayout: ['left thumbnail rail', 'center canvas', 'right inspector + notes + audience fit panel'],
    keyInteractions: ['reorder slides', 'drag blocks', 'change layout', 'refine notes', 'preview present mode'],
    qualityGoal: 'Deck feels like a true presentation tool.',
    surfaceContract: {
      workingOn: 'slide narrative and visual structure',
      systemRecommendation: 'layout and storyline improvements',
      riskOrUnresolved: 'dense slides, weak transitions, readiness blockers',
      moveForward: 'iterate slide sequence and open presentation preview',
      safeExit: 'save deck revision and return to storyboard'
    }
  },
  '/boards': {
    id: 'visual-board-canvas',
    title: 'Visual Board / Canvas',
    purpose: 'Create one-page visual workspaces.',
    mobileLayout: ['board title', 'canvas viewport', 'block rail trigger', 'layer sheet', 'inspector sheet', 'quick align actions'],
    desktopLayout: ['left layer tree + presets', 'center canvas', 'right inspector + layout copilot', 'bottom zoom/status/validation'],
    keyInteractions: ['drag widgets', 'group blocks', 'resize', 'align', 'link source', 'turn board into slides'],
    qualityGoal: 'Board is beautiful, readable, and operationally useful.',
    surfaceContract: {
      workingOn: 'visual block arrangement linked to artifacts',
      systemRecommendation: 'grouping and alignment suggestions',
      riskOrUnresolved: 'overlap, clutter, and unlinked critical blocks',
      moveForward: 'clean layout and convert board into slides',
      safeExit: 'restore last stable board layout'
    }
  },
  '/flow': {
    id: 'flow-studio',
    title: 'Flow Studio',
    purpose: 'Build logic, process, and dependency visuals.',
    mobileLayout: ['flow title', 'graph viewport', 'node tool sheet', 'validation sheet', 'minimap toggle', 'convert/export actions'],
    desktopLayout: ['left node palette + presets', 'center graph canvas', 'right inspector + validation panel', 'bottom minimap/status/export'],
    keyInteractions: ['add node', 'connect edges', 'label transitions', 'validate', 'convert to Mermaid', 'export'],
    qualityGoal: 'Flow is understandable and logically valid.',
    surfaceContract: {
      workingOn: 'node graph with transition semantics',
      systemRecommendation: 'validation-driven fixes and conversion options',
      riskOrUnresolved: 'orphan nodes, invalid edges, missing labels',
      moveForward: 'resolve validation warnings and export',
      safeExit: 'fallback to linear process list'
    }
  },
  '/mermaid': {
    id: 'mermaid-studio',
    title: 'Mermaid Studio',
    purpose: 'Maintain diagram code with safe live rendering.',
    mobileLayout: ['code/render segmented control', 'active editor or preview', 'issues sheet', 'template sheet', 'convert button'],
    desktopLayout: ['left template library', 'center-left editor', 'center-right live render', 'right issue + explain/repair panel'],
    keyInteractions: ['edit Mermaid', 'repair syntax', 'explain diagram', 'convert graph/code', 'embed output'],
    qualityGoal: 'Diagram work is safe, understandable, and never shell-breaking.',
    surfaceContract: {
      workingOn: 'diagram code and render output',
      systemRecommendation: 'syntax repair and clarity improvements',
      riskOrUnresolved: 'parse errors and unsupported nodes',
      moveForward: 'fix issues then embed into artifact',
      safeExit: 'preserve last valid render'
    }
  },
  '/present/build': {
    id: 'presentation-builder',
    title: 'Presentation Builder',
    purpose: 'Convert source and insights into a credible storyline and deck.',
    mobileLayout: ['progressive workflow: Source → Summary → Storyline → Slides → Preview', 'step content', 'notes sheet', 'readiness chip'],
    desktopLayout: ['left source rail', 'center-left summary/storyline', 'center-right live deck', 'right notes + readiness + coach'],
    keyInteractions: ['choose audience', 'reorder sections', 'drag insights into slides', 'judge readiness', 'present/export'],
    qualityGoal: 'Source-to-presentation flow is smooth and credible.',
    surfaceContract: {
      workingOn: 'storyline pipeline and live deck',
      systemRecommendation: 'audience-fit sequencing and readiness fixes',
      riskOrUnresolved: 'unsupported claims and narrative gaps',
      moveForward: 'promote ready storyline sections into deck',
      safeExit: 'save outline and continue later'
    }
  }
};

export function getScreenBlueprint(route: string): ScreenBlueprint | null {
  return screenBlueprintByRoute[route] ?? null;
}
