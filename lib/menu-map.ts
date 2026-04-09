export interface WorkspaceFeatureDefinition {
  id: string;
  group: string;
  label: string;
  goal: string;
  agents: string[];
  mustOutput: string[];
  fallback: string[];
}

const defaultOutputs = [
  'What it is',
  'What matters most',
  'Detailed interpretation',
  'Risks / gaps / ambiguities',
  'Pros / cons',
  'Recommendations',
  'Next actions',
  'Overall summary',
  'Readiness / quality judgment',
  'Exact improvement path if not ready'
];

export const menuMap: WorkspaceFeatureDefinition[] = [
  { id: 'command-home', group: 'Home', label: 'Command Home', goal: 'เปิดมาแล้ว user ต้องรู้ว่าจะทำอะไรต่อทันที', agents: ['Home Agent'], mustOutput: ['best next step', 'unfinished work', 'pending approvals', 'failed jobs', 'suggested outputs'], fallback: ['start template state', 'upload-first empty state', 'static suggestion cards if AI down'] },
  { id: 'recent-work', group: 'Home', label: 'Recent Work', goal: 'เห็นงานล่าสุดและกลับไปทำต่อได้เร็ว', agents: ['History Agent'], mustOutput: defaultOutputs, fallback: ['show session snapshots only'] },
  { id: 'suggested-actions', group: 'Home', label: 'Suggested Actions', goal: 'ช่วยแนะนำ next action แบบ context-aware', agents: ['Recommendation Agent'], mustOutput: defaultOutputs, fallback: ['rule-based suggestions'] },
  { id: 'current-jobs', group: 'Home', label: 'Current Jobs', goal: 'ติดตามงานประมวลผลแบบ runtime-safe', agents: ['Jobs Agent'], mustOutput: defaultOutputs, fallback: ['persist queued jobs after refresh'] },
  { id: 'workspace-snapshot', group: 'Home', label: 'Workspace Snapshot', goal: 'มองภาพรวมพร้อมใช้งานภายใน 1 screen', agents: ['Readiness Evaluator'], mustOutput: defaultOutputs, fallback: ['static counters only'] },

  { id: 'intake-hub', group: 'Intake', label: 'Intake Hub', goal: 'รับไฟล์หลายชนิดและแปลงเป็นระบบงาน', agents: ['Intake Agent', 'Parse Agent', 'Validation Agent'], mustOutput: ['file classification', 'parse confidence', 'unresolved warnings', 'suggested merge/replace', 'suggested outputs'], fallback: ['raw file preserved', 'partial extraction mode', 'retry parse', 'manual continue'] },
  { id: 'upload-queue', group: 'Intake', label: 'Upload Queue', goal: 'ให้ user รู้ว่าไฟล์ไหนกำลังถูกประมวลผล', agents: ['Jobs Agent'], mustOutput: defaultOutputs, fallback: ['queued jobs survive refresh'] },
  { id: 'file-library', group: 'Intake', label: 'File Library', goal: 'เก็บ source ทั้งหมดใน project', agents: ['Library Agent'], mustOutput: defaultOutputs, fallback: ['raw library mode'] },
  { id: 'version-compare', group: 'Intake', label: 'Version Compare', goal: 'เทียบไฟล์เก่า/ใหม่แบบ side-by-side', agents: ['Compare Agent'], mustOutput: defaultOutputs, fallback: ['text-only compare mode'] },
  { id: 'source-merge', group: 'Intake', label: 'Source Merge', goal: 'รวมไฟล์ที่เกี่ยวข้องกันโดยไม่เสียข้อมูล', agents: ['Merge Agent'], mustOutput: defaultOutputs, fallback: ['keep files separate'] },
  { id: 'drive-import', group: 'Intake', label: 'Drive Import', goal: 'นำเข้าไฟล์จาก Google Drive แบบปลอดภัย', agents: ['Drive Agent', 'Sync Agent'], mustOutput: defaultOutputs, fallback: ['manual upload only mode'] },
  { id: 'ingestion-jobs', group: 'Intake', label: 'Ingestion Jobs', goal: 'ติดตาม ingestion pipeline ทั้งหมด', agents: ['Jobs Agent'], mustOutput: defaultOutputs, fallback: ['degraded status timeline'] },

  { id: 'universal-reader', group: 'Understand', label: 'Universal Reader', goal: 'อ่าน source จริงให้เข้าใจจริง', agents: ['Reader Copilot', 'Source Trace Agent'], mustOutput: ['section summary', 'key entities', 'important values', 'confidence', 'source location', 'convert-to actions'], fallback: ['raw source mode', 'partial extraction badges', 'low-confidence warnings'] },
  { id: 'extracted-structure', group: 'Understand', label: 'Extracted Structure', goal: 'แสดง headings / sections / tables / entities ที่ parse ได้', agents: ['Structure Agent'], mustOutput: defaultOutputs, fallback: ['minimal structure list'] },
  { id: 'deep-summary', group: 'Understand', label: 'Deep Summary', goal: 'สรุปหลายระดับหลายมิติ', agents: ['Summary Agent', 'Insight Agent', 'Recommendation Agent', 'Role Lens Agent'], mustOutput: ['facts', 'interpretation', 'risks', 'gaps', 'pros/cons', 'recommendations', 'next actions', 'overall summary'], fallback: ['raw key points only', 'mark interpretation unavailable'] },
  { id: 'insights', group: 'Understand', label: 'Insights', goal: 'แยก analysis ออกจาก summary ย่อ', agents: ['Insight Agent'], mustOutput: defaultOutputs, fallback: ['key point list only'] },
  { id: 'entity-explorer', group: 'Understand', label: 'Entity Explorer', goal: 'ดูคน/ทีม/ระบบ/ตัวเลข/คำสำคัญทั้งหมด', agents: ['Entity Agent'], mustOutput: defaultOutputs, fallback: ['entity tags only'] },
  { id: 'source-trace', group: 'Understand', label: 'Source Trace', goal: 'ให้ user เชื่อถือระบบ', agents: ['Source Trace Agent'], mustOutput: defaultOutputs, fallback: ['source id only'] },
  { id: 'compare-center', group: 'Understand', label: 'Compare Center', goal: 'compare file/version/summary', agents: ['Compare Agent'], mustOutput: defaultOutputs, fallback: ['single-axis compare'] },
  { id: 'confidence-validation', group: 'Understand', label: 'Confidence / Validation', goal: 'บอกว่าข้อมูลเชื่อถือได้ระดับไหน', agents: ['Validation Agent'], mustOutput: defaultOutputs, fallback: ['validation warnings only'] },

  { id: 'smart-docs', group: 'Build', label: 'Smart Docs', goal: 'สร้างเอกสารที่พร้อมใช้จริง', agents: ['Writing Agent', 'Structure Agent', 'Evidence Agent'], mustOutput: ['refined writing', 'section suggestions', 'evidence suggestions', 'readiness notes'], fallback: ['autosave snapshots', 'safe raw-text mode', 'print preview isolate failure'] },
  { id: 'smart-sheets', group: 'Build', label: 'Smart Sheets', goal: 'ทำงานกับข้อมูลแบบใช้จริง', agents: ['Sheet Analyst Agent', 'Formula Agent'], mustOutput: ['anomalies', 'formulas', 'charts', 'summaries', 'cleanup suggestions'], fallback: ['raw table mode', 'readonly fallback', 'preserve imported dataset'] },
  { id: 'smart-slides', group: 'Build', label: 'Smart Slides', goal: 'สร้าง deck ที่พร้อม present', agents: ['Storytelling Agent', 'Slide Design Agent', 'Audience Agent'], mustOutput: ['storyline', 'slide suggestions', 'density warnings', 'speaker notes', 'readiness judgment'], fallback: ['outline-only deck', 'static preview if live canvas fails'] },
  { id: 'visual-board-studio', group: 'Build', label: 'Visual Board Studio', goal: 'ทำ one-page operating board', agents: ['Layout Agent', 'Board Insight Agent', 'Grouping Agent'], mustOutput: defaultOutputs, fallback: ['list mode board', 'preserve last valid layout'] },
  { id: 'workspace-canvas', group: 'Build', label: 'Workspace Canvas', goal: 'visual-first freeform workspace', agents: ['Layout Agent'], mustOutput: defaultOutputs, fallback: ['list mode'] },
  { id: 'flow-studio', group: 'Build', label: 'Flow Studio', goal: 'สร้าง process/dependency flow', agents: ['Flow Builder Agent', 'Flow Validation Agent', 'Dependency Agent'], mustOutput: ['graph structure', 'missing step warnings', 'loop/conflict warnings', 'export suggestions'], fallback: ['linear list view', 'preserve last valid graph'] },
  { id: 'mermaid-studio', group: 'Build', label: 'Mermaid Studio', goal: 'diagram code + visual render', agents: ['Mermaid Conversion Agent', 'Mermaid Repair Agent'], mustOutput: defaultOutputs, fallback: ['preserve code if render fails', 'show last valid render'] },
  { id: 'storyboard-studio', group: 'Build', label: 'Storyboard Studio', goal: 'story/presentation flow planning', agents: ['Narrative Agent', 'Scene Arrangement Agent'], mustOutput: defaultOutputs, fallback: ['linear scene list'] },
  { id: 'presentation-builder', group: 'Build', label: 'Presentation Builder', goal: 'custom file → presentation', agents: ['Presentation Copilot', 'Speaker Notes Agent', 'Presentation Coach Agent'], mustOutput: ['deck title', 'audience framing', 'storyline', 'slide structure', 'notes', 'readiness score'], fallback: ['outline-only presentation', 'static deck preview'] },

  { id: 'issues-center', group: 'Operate', label: 'Issues Center', goal: 'track issues with triage', agents: ['Issue Triage Agent', 'Escalation Agent'], mustOutput: defaultOutputs, fallback: ['issue list only'] },
  { id: 'raid-center', group: 'Operate', label: 'RAID Center', goal: 'manage risks assumptions issues dependencies', agents: ['RAID Agent', 'Mitigation Agent'], mustOutput: defaultOutputs, fallback: ['table mode'] },
  { id: 'decision-log', group: 'Operate', label: 'Decision Log', goal: 'capture decision history', agents: ['Decision Agent', 'Approval Prep Agent'], mustOutput: defaultOutputs, fallback: ['timeline list'] },
  { id: 'dependency-studio', group: 'Operate', label: 'Dependency Studio', goal: 'dependency mapping and conflicts', agents: ['Dependency Mapper Agent', 'Conflict Detector Agent'], mustOutput: defaultOutputs, fallback: ['dependency list only'] },
  { id: 'change-control', group: 'Operate', label: 'Change Control', goal: 'evaluate change impacts', agents: ['Change Impact Agent'], mustOutput: defaultOutputs, fallback: ['manual impact table'] },
  { id: 'resource-planner', group: 'Operate', label: 'Resource Planner', goal: 'resource and capacity planning', agents: ['Capacity Agent'], mustOutput: defaultOutputs, fallback: ['readonly capacity board'] },
  { id: 'timeline-gantt', group: 'Operate', label: 'Timeline / Gantt', goal: 'timeline monitoring', agents: ['Timeline Agent'], mustOutput: defaultOutputs, fallback: ['list timeline'] },
  { id: 'budget-impact', group: 'Operate', label: 'Budget / Impact', goal: 'budget and impact analysis', agents: ['Budget Agent', 'Impact Agent'], mustOutput: defaultOutputs, fallback: ['manual budget table'] },
  { id: 'approval-center', group: 'Operate', label: 'Approval Center', goal: 'approval workflow', agents: ['Approval Agent'], mustOutput: defaultOutputs, fallback: ['pending approvals only'] },
  { id: 'meeting-action-hub', group: 'Operate', label: 'Meeting / Action Hub', goal: 'extract actions from meetings', agents: ['Meeting Summary Agent', 'Action Extraction Agent'], mustOutput: defaultOutputs, fallback: ['manual action capture'] },
  { id: 'release-environment-board', group: 'Operate', label: 'Release / Environment Board', goal: 'release readiness overview', agents: ['Release Readiness Agent'], mustOutput: defaultOutputs, fallback: ['status table only'] },
  { id: 'api-system-map', group: 'Operate', label: 'API / System Map', goal: 'system topology and api links', agents: ['Architecture Agent', 'API Mapping Agent'], mustOutput: defaultOutputs, fallback: ['raw endpoint list'] },

  { id: 'pm-ops', group: 'Role Workbenches', label: 'PM Ops', goal: 'PM execution cockpit', agents: ['PM Agent'], mustOutput: defaultOutputs, fallback: ['PM checklist mode'] },
  { id: 'technical-ops', group: 'Role Workbenches', label: 'Technical Ops', goal: 'technical manager cockpit', agents: ['Technical Manager Agent'], mustOutput: defaultOutputs, fallback: ['engineering queue only'] },
  { id: 'sales-ops', group: 'Role Workbenches', label: 'Sales Ops', goal: 'sales enablement operations', agents: ['Sales Agent'], mustOutput: defaultOutputs, fallback: ['pipeline table only'] },
  { id: 'executive-cockpit', group: 'Role Workbenches', label: 'Executive Cockpit', goal: 'executive status board', agents: ['Executive Agent'], mustOutput: defaultOutputs, fallback: ['executive digest only'] },
  { id: 'proposal-workspace', group: 'Role Workbenches', label: 'Proposal Workspace', goal: 'proposal authoring with evidence', agents: ['Proposal Agent'], mustOutput: defaultOutputs, fallback: ['proposal outline only'] },

  { id: 'preview-hub', group: 'Review & Output', label: 'Preview Hub', goal: 'ดู output ทุกชนิดแบบ runtime-safe', agents: ['Preview Copilot'], mustOutput: defaultOutputs, fallback: ['safe static preview'] },
  { id: 'presentation-mode', group: 'Review & Output', label: 'Presentation Mode', goal: 'clean fullscreen presentation', agents: ['Presentation Coach Agent'], mustOutput: defaultOutputs, fallback: ['simple slide mode'] },
  { id: 'export-center', group: 'Review & Output', label: 'Export Center', goal: 'ส่งออกแบบปลอดภัย', agents: ['Export Agent', 'Export Readiness Agent'], mustOutput: defaultOutputs, fallback: ['backup export only'] },
  { id: 'history', group: 'Review & Output', label: 'History', goal: 'work safety and recoverability', agents: ['History Agent'], mustOutput: defaultOutputs, fallback: ['local snapshots only'] },
  { id: 'restore-snapshots', group: 'Review & Output', label: 'Restore / Snapshots', goal: 'restore previous state safely', agents: ['Restore Agent'], mustOutput: defaultOutputs, fallback: ['manual rollback'] },
  { id: 'readiness-scores', group: 'Review & Output', label: 'Readiness Scores', goal: 'ตัดสินงานพร้อมโชว์หรือยัง', agents: ['Readiness Evaluator'], mustOutput: ['visual polish', 'readability', 'structure', 'density', 'audience fit', 'evidence strength', 'production readiness'], fallback: ['binary ready/not-ready only'] },

  { id: 'theme-brand', group: 'System', label: 'Theme & Brand', goal: 'ควบคุม visual identity', agents: ['Theme Agent'], mustOutput: defaultOutputs, fallback: ['default theme'] },
  { id: 'ai-runtime', group: 'System', label: 'AI Runtime', goal: 'จัดการ Ollama / remote / hybrid', agents: ['Runtime Agent', 'Model Routing Agent', 'Fallback Agent'], mustOutput: defaultOutputs, fallback: ['degraded mode'] },
  { id: 'integrations', group: 'System', label: 'Integrations', goal: 'integration management', agents: ['Sync Agent'], mustOutput: defaultOutputs, fallback: ['local-only mode'] },
  { id: 'google-sign-in', group: 'System', label: 'Google Sign-In', goal: 'identity and auth setup', agents: ['Sync Agent'], mustOutput: defaultOutputs, fallback: ['workspace local identity'] },
  { id: 'google-drive', group: 'System', label: 'Google Drive', goal: 'drive sync and import/export', agents: ['Drive Agent'], mustOutput: defaultOutputs, fallback: ['manual file pipeline'] },
  { id: 'privacy-redaction', group: 'System', label: 'Privacy / Redaction', goal: 'privacy controls and data masking', agents: ['Privacy Agent'], mustOutput: defaultOutputs, fallback: ['manual redact checklist'] },
  { id: 'workspace-settings', group: 'System', label: 'Workspace Settings', goal: 'workspace defaults and guards', agents: ['Workspace Agent'], mustOutput: defaultOutputs, fallback: ['read-only settings'] },
  { id: 'logs-jobs', group: 'System', label: 'Logs / Jobs', goal: 'runtime logging and queue observability', agents: ['Jobs Agent'], mustOutput: defaultOutputs, fallback: ['log viewer only'] }
];

export const menuGroups = Array.from(new Set(menuMap.map((item) => item.group)));
