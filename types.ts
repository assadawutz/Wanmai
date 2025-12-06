export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done',
  BLOCKED = 'Blocked'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Task {
  id: string;
  name: string;
  assignee: string;
  status: TaskStatus;
  riskLevel: RiskLevel;
  dueDate: string;
  description: string;
  isCriticalPath?: boolean;
  position?: { x: number; y: number };
}

export interface NodeData {
  taskId: string;
  taskName: string;
  status: TaskStatus;
  riskLevel: RiskLevel;
  assignee: string;
  dueDate: string;
  description: string;
  onStatusChange?: (id: string, newStatus: TaskStatus) => void;
}

export interface Doc {
  id: string;
  title: string;
  content: string; // HTML string
  lastModified: Date;
  owner: string;
  status: 'Draft' | 'Final' | 'Review';
}

export type ViewMode = 'DASHBOARD' | 'FLOW' | 'KANBAN' | 'LIST' | 'DOCS';