import { Task, TaskStatus, RiskLevel, Doc } from '../types';

const TASKS_STORAGE_KEY = 'pm_command_center_tasks_v1';
const DOCS_STORAGE_KEY = 'pm_command_center_docs_v1';

// Initial Seed Data (Only used if LocalStorage is empty)
const DEFAULT_TASKS: Task[] = [
  {
    id: 'TSK-001',
    name: 'Project Scope Definition',
    assignee: 'Alice PM',
    status: TaskStatus.DONE,
    riskLevel: RiskLevel.LOW,
    dueDate: '2023-10-01',
    description: 'Finalize scope from Google Doc requirements.',
    isCriticalPath: true,
    position: { x: 250, y: 50 }
  },
  {
    id: 'TSK-002',
    name: 'Architecture Design',
    assignee: 'Bob Arch',
    status: TaskStatus.DONE,
    riskLevel: RiskLevel.MEDIUM,
    dueDate: '2023-10-05',
    description: 'Draft system architecture diagrams.',
    isCriticalPath: true,
    position: { x: 250, y: 200 }
  },
  {
    id: 'TSK-003',
    name: 'Frontend Development',
    assignee: 'Charlie Dev',
    status: TaskStatus.IN_PROGRESS,
    riskLevel: RiskLevel.HIGH,
    dueDate: '2023-10-20',
    description: 'Implement UI components using React.',
    isCriticalPath: true,
    position: { x: 100, y: 350 }
  },
  {
    id: 'TSK-004',
    name: 'Backend API Setup',
    assignee: 'Dave Backend',
    status: TaskStatus.IN_PROGRESS,
    riskLevel: RiskLevel.MEDIUM,
    dueDate: '2023-10-15',
    description: 'Setup Node.js Express server.',
    isCriticalPath: true,
    position: { x: 400, y: 350 }
  },
  {
    id: 'TSK-005',
    name: 'User Acceptance Testing',
    assignee: 'Eve QA',
    status: TaskStatus.TODO,
    riskLevel: RiskLevel.LOW,
    dueDate: '2023-10-25',
    description: 'Run UAT scenarios.',
    isCriticalPath: false,
    position: { x: 250, y: 500 }
  },
  {
    id: 'TSK-006',
    name: 'Deployment to Prod',
    assignee: 'Frank DevOps',
    status: TaskStatus.BLOCKED,
    riskLevel: RiskLevel.CRITICAL,
    dueDate: '2023-10-30',
    description: 'Deploy to AWS production environment.',
    isCriticalPath: true,
    position: { x: 250, y: 650 }
  }
];

const DEFAULT_DOCS: Doc[] = [
  {
    id: 'doc-1',
    title: 'Project Requirements v2.0',
    content: '<h1>Project Requirements</h1><p>This document outlines the core requirements for the PM Command Center.</p><h2>1. Overview</h2><p>The system must support two-way sync with Google Sheets...</p>',
    lastModified: new Date('2023-10-24T10:30:00'),
    owner: 'John Doe',
    status: 'Final'
  },
  {
    id: 'doc-2',
    title: 'Sprint 1 Retrospective',
    content: '<h1>Retrospective: Sprint 1</h1><p><strong>What went well:</strong></p><ul><li>Frontend deployment was smooth</li><li>Team velocity increased</li></ul>',
    lastModified: new Date('2023-10-25T14:15:00'),
    owner: 'Alice PM',
    status: 'Draft'
  },
  {
    id: 'doc-3',
    title: 'Deployment Guide',
    content: '<h1>Deployment Guide</h1><p>Steps to deploy to AWS:</p><ol><li>Build the React app</li><li>Configure S3 bucket</li></ol>',
    lastModified: new Date('2023-10-26T09:00:00'),
    owner: 'Frank DevOps',
    status: 'Review'
  }
];

// Helpers for LocalStorage
const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_TASKS;
  } catch (e) {
    console.error("Failed to load tasks", e);
    return DEFAULT_TASKS;
  }
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

const loadDocs = (): Doc[] => {
  try {
    const stored = localStorage.getItem(DOCS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_DOCS;
  } catch (e) {
    console.error("Failed to load docs", e);
    return DEFAULT_DOCS;
  }
};

const saveDocs = (docs: Doc[]) => {
  localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
};

// Artificial delay for "Network Feel" only
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const WorkspaceService = {
  // --- TASKS (Full Logic) ---
  fetchTasks: async (): Promise<Task[]> => {
    await delay(300); 
    const tasks = loadTasks();
    if (!localStorage.getItem(TASKS_STORAGE_KEY)) {
        saveTasks(tasks); // Initialize if empty
    }
    return tasks;
  },

  createTask: async (task: Task): Promise<Task> => {
    await delay(200);
    const currentTasks = loadTasks();
    const updatedTasks = [...currentTasks, task];
    saveTasks(updatedTasks);
    return task;
  },

  syncTaskUpdate: async (taskId: string, updates: Partial<Task>): Promise<boolean> => {
    // console.log(`[Persist] Updating Task ${taskId}...`, updates);
    const currentTasks = loadTasks();
    const updatedTasks = currentTasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
    saveTasks(updatedTasks);
    return true;
  },

  bulkSyncUpdate: async (taskIds: string[], updates: Partial<Task>): Promise<boolean> => {
    await delay(400);
    const currentTasks = loadTasks();
    const updatedTasks = currentTasks.map(t => taskIds.includes(t.id) ? { ...t, ...updates } : t);
    saveTasks(updatedTasks);
    return true;
  },

  // --- DOCS (Full Logic) ---
  fetchDocs: async (): Promise<Doc[]> => {
    await delay(300);
    const docs = loadDocs();
    if (!localStorage.getItem(DOCS_STORAGE_KEY)) {
        saveDocs(docs); // Initialize
    }
    return docs;
  },

  saveDoc: async (doc: Doc): Promise<boolean> => {
    await delay(400);
    const currentDocs = loadDocs();
    const index = currentDocs.findIndex(d => d.id === doc.id);
    let updatedDocs;
    if (index >= 0) {
      updatedDocs = currentDocs.map(d => d.id === doc.id ? doc : d);
    } else {
      updatedDocs = [doc, ...currentDocs];
    }
    saveDocs(updatedDocs);
    return true;
  },

  deleteDoc: async (docId: string): Promise<boolean> => {
    await delay(200);
    const currentDocs = loadDocs();
    const updatedDocs = currentDocs.filter(d => d.id !== docId);
    saveDocs(updatedDocs);
    return true;
  },

  // --- LINKS (Static) ---
  fetchProjectDocs: async () => {
    await delay(100);
    return {
      scopeDoc: 'https://docs.google.com/document/d/mock-scope',
      requirementsDoc: 'https://docs.google.com/document/d/mock-reqs',
      driveFolder: 'https://drive.google.com/drive/folders/mock-folder'
    };
  }
};