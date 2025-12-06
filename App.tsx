import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Workflow, 
  Kanban as KanbanIcon, 
  RefreshCcw, 
  FileText, 
  Folder,
  Settings,
  Bell,
  Search,
  Table2,
  FileEdit,
  Menu,
  X,
  CheckCircle,
  Info,
  Flower2
} from 'lucide-react';
import { WorkspaceService } from './services/workspaceService';
import { Task, ViewMode, TaskStatus } from './types';
import { Dashboard } from './components/Dashboard';
import { FlowEditor } from './components/FlowEditor';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskListView } from './components/TaskListView';
import { DocEditor } from './components/DocEditor';
import { AIAssistant } from './components/AIAssistant';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<ViewMode>('DASHBOARD');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [projectLinks, setProjectLinks] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Mobile & Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [fetchedTasks, links] = await Promise.all([
        WorkspaceService.fetchTasks(),
        WorkspaceService.fetchProjectDocs()
      ]);
      setTasks(fetchedTasks);
      setProjectLinks(links);
      setLoading(false);
    };
    init();
  }, []);

  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleSync = async () => {
    setSyncing(true);
    const [refreshedTasks, links] = await Promise.all([
      WorkspaceService.fetchTasks(),
      WorkspaceService.fetchProjectDocs()
    ]);
    setTasks(refreshedTasks);
    setProjectLinks(links);
    setSyncing(false);
    addNotification('Workspace synced successfully', 'success');
  };

  const handleTaskCreate = async (newTask: Task) => {
    // Optimistic update
    setTasks(prev => [...prev, newTask]);
    await WorkspaceService.createTask(newTask);
    addNotification(`Task "${newTask.name}" created`);
  };

  const handleTaskUpdate = async (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    await WorkspaceService.syncTaskUpdate(taskId, { status: newStatus });
    addNotification(`Task updated to ${newStatus}`, 'info');
  };

  const handleTaskChange = async (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    await WorkspaceService.syncTaskUpdate(taskId, updates);
  };

  const handleBulkUpdate = async (ids: string[], updates: Partial<Task>) => {
      setTasks(prev => prev.map(t => ids.includes(t.id) ? { ...t, ...updates } : t));
      await WorkspaceService.bulkSyncUpdate(ids, updates);
      addNotification(`Updated ${ids.length} tasks`, 'success');
  };

  const filteredTasks = tasks.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavClick = (mode: ViewMode) => {
    setView(mode);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const NavItem = ({ mode, icon: Icon, label }: { mode: ViewMode, icon: any, label: string }) => (
    <button
      onClick={() => handleNavClick(mode)}
      className={`relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full transition-all duration-500 border border-transparent ${
        view === mode 
          ? 'bg-gradient-to-r from-pink-500/90 to-rose-500/90 text-white shadow-xl shadow-pink-500/20 translate-x-1' 
          : 'text-slate-500 hover:bg-white/50 hover:text-pink-600 hover:pl-6 hover:border-pink-50 hover:shadow-sm'
      }`}
    >
      <Icon size={18} className={`${view === mode ? 'text-white' : 'group-hover:scale-110 transition-transform stroke-[2px]'}`} />
      <span className={`font-medium tracking-wide text-sm ${view === mode ? 'font-semibold' : ''}`}>{label}</span>
      {view === mode && (
        <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-md"></span>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6 relative animate-float">
          <div className="w-24 h-24 border-4 border-white/50 border-t-pink-400 rounded-full animate-spin shadow-2xl backdrop-blur-md" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Flower2 className="text-pink-400 animate-pulse" size={36} />
          </div>
          <p className="text-slate-600 font-serif italic text-xl animate-pulse tracking-wide bg-white/40 px-6 py-2 rounded-full shadow-sm backdrop-blur-md">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-sans selection:bg-pink-100 selection:text-pink-900">
      
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-[60] space-y-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="animate-slide-up bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-2xl p-4 flex items-center gap-3 pointer-events-auto min-w-[320px] ring-1 ring-black/5">
            <div className={`p-2 rounded-full ${n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              {n.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
            </div>
            <p className="text-sm font-semibold text-slate-700">{n.message}</p>
          </div>
        ))}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-white/60 backdrop-blur-2xl border-r border-white/40 
          z-40 shadow-2xl md:shadow-none transform transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex-shrink-0
        `}
      >
        <div className="h-full flex flex-col p-6 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-gradient-to-br from-pink-100/40 to-rose-100/40 rounded-full blur-3xl pointer-events-none"></div>

          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-10 relative z-10 pl-2">
            <div className="w-11 h-11 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25 transform hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20">
              <Flower2 className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none font-serif italic">PM Command</h1>
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-[0.2em] ml-0.5">Workspace</span>
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden ml-auto p-1 text-slate-400 hover:text-rose-500"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2 relative z-10 flex-1 overflow-y-auto no-scrollbar pb-4">
            <NavItem mode="DASHBOARD" icon={LayoutDashboard} label="Overview" />
            <NavItem mode="LIST" icon={Table2} label="Task Registry" />
            <NavItem mode="FLOW" icon={Workflow} label="Process Map" />
            <NavItem mode="KANBAN" icon={KanbanIcon} label="Kanban Board" />
            <NavItem mode="DOCS" icon={FileEdit} label="Documents" />
          </nav>

          {/* Bottom Assets Panel */}
          <div className="mt-auto pt-6 border-t border-pink-100/30 relative z-10">
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/60 hover:bg-white/60 transition-colors shadow-sm group">
               <h3 className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                 <Folder size={12} /> Project Artifacts
               </h3>
               <div className="space-y-3">
                 <a href={projectLinks?.scopeDoc} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-pink-600 transition-all hover:translate-x-1">
                   <div className="p-1.5 bg-white/80 rounded-lg shadow-sm group-hover:shadow text-pink-400"><FileText size={14} /></div>
                   <span className="font-medium">Scope Document</span>
                 </a>
                 <a href={projectLinks?.driveFolder} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-pink-600 transition-all hover:translate-x-1">
                   <div className="p-1.5 bg-white/80 rounded-lg shadow-sm group-hover:shadow text-pink-400"><Folder size={14} /></div>
                   <span className="font-medium">Drive Assets</span>
                 </a>
               </div>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 mt-6 pl-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-100 to-rose-50 border-2 border-white flex items-center justify-center shadow-md cursor-pointer hover:ring-2 hover:ring-pink-200 transition-all">
                <span className="font-bold text-pink-700 text-xs font-serif">JD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-700">John Doe</p>
                <p className="text-[10px] text-slate-400 font-medium">Project Manager</p>
              </div>
              <button className="text-slate-300 hover:text-slate-600 hover:bg-white/50 p-2 rounded-xl transition-colors">
                 <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full w-full transition-all bg-transparent relative">
        
        {/* Sticky Header */}
        <header className="h-16 md:h-20 bg-white/60 backdrop-blur-xl border-b border-white/40 flex items-center justify-between px-4 md:px-8 shadow-sm/30 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-500 hover:bg-white hover:text-pink-600 rounded-xl transition-all active:scale-95 md:hidden"
            >
               <Menu size={24} />
            </button>

            <div>
               <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2 font-serif italic tracking-wide">
                 {view === 'DASHBOARD' && 'Executive Dashboard'}
                 {view === 'LIST' && 'Task Registry'}
                 {view === 'FLOW' && 'Process Designer'}
                 {view === 'KANBAN' && 'Kanban Board'}
                 {view === 'DOCS' && 'Knowledge Base'}
               </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {view !== 'DOCS' && (
              <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-pink-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..." 
                  className="pl-10 pr-4 py-2.5 bg-white/50 border border-transparent focus:border-pink-200 focus:bg-white focus:ring-4 focus:ring-pink-50 rounded-full text-sm w-48 lg:w-64 transition-all shadow-sm group-hover:shadow-md placeholder-slate-400 text-slate-700 font-medium backdrop-blur-sm"
                />
              </div>
            )}
            
            <button 
              onClick={handleSync}
              disabled={syncing}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-pink-100 bg-white/60 backdrop-blur-md text-slate-600 hover:text-pink-600 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100/50 transition-all active:scale-95 ${syncing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <RefreshCcw size={16} className={`${syncing ? 'animate-spin text-pink-500' : ''}`} />
              <span className="hidden md:inline text-sm font-semibold">Sync</span>
            </button>

            <button className="relative p-2.5 bg-white/60 backdrop-blur-md border border-pink-100/50 text-slate-400 hover:text-pink-500 rounded-full hover:shadow-lg hover:shadow-pink-100/50 hover:-translate-y-0.5 transition-all active:scale-95">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-200"></span>
            </button>
          </div>
        </header>

        {/* Dynamic View Content - Scrollable Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 scroll-smooth" id="main-content">
          <div className="max-w-[1600px] mx-auto h-full flex flex-col">
            {view === 'DASHBOARD' && <Dashboard tasks={filteredTasks} />}
            {view === 'LIST' && <TaskListView tasks={filteredTasks} onBulkUpdate={handleBulkUpdate} onRefresh={handleSync} />}
            {view === 'FLOW' && (
              <div className="flex flex-col gap-4 h-full animate-fade-in">
                <FlowEditor 
                  tasks={filteredTasks} 
                  onTaskChange={handleTaskChange} 
                  onTaskCreate={handleTaskCreate}
                />
              </div>
            )}
            {view === 'KANBAN' && <KanbanBoard tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />}
            {view === 'DOCS' && <DocEditor />}
          </div>
        </div>
      </main>

      {/* AI Assistant - Floating Button */}
      <AIAssistant tasks={filteredTasks} onTaskCreate={handleTaskCreate} onTaskUpdate={handleTaskChange} />
    </div>
  );
};

export default App;