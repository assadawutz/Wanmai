import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, RiskLevel } from '../types';
import { 
  CheckSquare, Square, Trash2, ArrowUpCircle, DownloadCloud, 
  Filter, MoreHorizontal, ArrowRight, Upload, FileDown, ArrowUpDown, ArrowUp, ArrowDown, X, Ghost
} from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  onBulkUpdate: (ids: string[], updates: Partial<Task>) => void;
  onRefresh: () => void;
}

type SortKey = keyof Task;
type SortDirection = 'asc' | 'desc';

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onBulkUpdate, onRefresh }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');

  // Sorting Handler
  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Process Data (Filter + Sort)
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Filter
    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter);
    }
    if (riskFilter !== 'ALL') {
      result = result.filter(t => t.riskLevel === riskFilter);
    }

    // 2. Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tasks, sortConfig, statusFilter, riskFilter]);

  // Toggle selection
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === processedTasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(processedTasks.map(t => t.id)));
    }
  };

  const handleBulkStatusChange = (status: TaskStatus) => {
    if (selectedIds.size === 0) return;
    onBulkUpdate(Array.from(selectedIds), { status });
    setSelectedIds(new Set());
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Assignee', 'Status', 'Risk Level', 'Due Date', 'Description'];
    const rows = processedTasks.map(t => [t.id, `"${t.name}"`, t.assignee, t.status, t.riskLevel, t.dueDate, `"${t.description}"`]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `project_tasks_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-pink-500" /> : <ArrowDown size={14} className="text-pink-500" />;
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white/60 flex flex-col h-full animate-fade-in relative overflow-hidden transition-all duration-300 ring-1 ring-white/60">
      
      {/* Toolbar / Header */}
      <div className="p-5 md:p-6 border-b border-white/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/30 backdrop-blur-lg sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight font-serif italic">Task Sheet</h2>
            <span className="bg-pink-50/80 text-pink-600 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                {processedTasks.length}
            </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:shadow-md transition-all active:scale-95 text-xs font-bold uppercase tracking-wide ${showFilters ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-white/60 border-white/60 text-slate-600 hover:border-pink-200 hover:text-pink-600 shadow-sm'}`}
            >
                <Filter size={16} /> Filter
            </button>
            <button 
                onClick={onRefresh}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/60 border border-white/60 text-slate-600 rounded-xl hover:border-teal-300 hover:text-teal-600 hover:shadow-md transition-all active:scale-95 text-xs font-bold uppercase tracking-wide shadow-sm"
            >
                <ArrowUpCircle size={16} /> Pull
            </button>
            <button 
                onClick={handleExportCSV}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-teal-200 transition-all active:scale-95 text-xs font-bold uppercase tracking-wide"
            >
                <FileDown size={16} /> Export
            </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-pink-50/20 border-b border-pink-100/50 p-4 flex flex-wrap gap-4 animate-slide-up backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-white/80 border border-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-300 text-slate-700 font-medium shadow-sm"
                >
                    <option value="ALL">All Statuses</option>
                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk</span>
                <select 
                    value={riskFilter} 
                    onChange={(e) => setRiskFilter(e.target.value as any)}
                    className="bg-white/80 border border-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-300 text-slate-700 font-medium shadow-sm"
                >
                    <option value="ALL">All Risks</option>
                    {Object.values(RiskLevel).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
            {(statusFilter !== 'ALL' || riskFilter !== 'ALL') && (
                <button 
                    onClick={() => { setStatusFilter('ALL'); setRiskFilter('ALL'); }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded hover:bg-rose-100 transition-colors"
                >
                    <X size={12} /> Clear
                </button>
            )}
        </div>
      )}

      {/* Bulk Action Bar - Floats */}
      <div className={`absolute top-[85px] left-4 right-4 md:left-6 md:right-6 bg-slate-800/90 backdrop-blur-md text-white p-3 px-6 rounded-2xl flex justify-between items-center transition-all duration-300 z-30 shadow-2xl ${selectedIds.size > 0 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
         <div className="flex items-center gap-4">
             <span className="font-bold text-sm bg-slate-700 px-2 py-1 rounded">{selectedIds.size} selected</span>
             <div className="h-4 w-px bg-slate-600 hidden sm:block"></div>
             <div className="flex items-center gap-2">
                 <span className="text-xs text-slate-400 uppercase font-bold hidden sm:inline">Set Status:</span>
                 <button onClick={() => handleBulkStatusChange(TaskStatus.DONE)} className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-teal-900/50">Done</button>
                 <button onClick={() => handleBulkStatusChange(TaskStatus.IN_PROGRESS)} className="px-3 py-1.5 bg-pink-500 hover:bg-pink-400 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-pink-900/50">In Progress</button>
             </div>
         </div>
         <button onClick={() => setSelectedIds(new Set())} className="text-slate-400 hover:text-white text-xs font-medium hover:bg-white/10 px-2 py-1 rounded transition-colors">Cancel</button>
      </div>

      {/* Table Container - Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50/40 sticky top-0 z-10 backdrop-blur-md border-b border-pink-100/30">
                <tr>
                    <th className="px-6 py-4 w-12">
                        <button onClick={toggleSelectAll} className="text-slate-400 hover:text-pink-500 transition-colors">
                            {selectedIds.size === processedTasks.length && processedTasks.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/30 transition-colors group" onClick={() => handleSort('id')}>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-pink-500">
                            ID <SortIcon column="id" />
                        </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/30 transition-colors group" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-pink-500">
                            Task Name <SortIcon column="name" />
                        </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/30 transition-colors group" onClick={() => handleSort('assignee')}>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-pink-500">
                            Owner <SortIcon column="assignee" />
                        </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/30 transition-colors group" onClick={() => handleSort('dueDate')}>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-pink-500">
                            Due Date <SortIcon column="dueDate" />
                        </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/30 transition-colors group" onClick={() => handleSort('riskLevel')}>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-pink-500">
                            Risk <SortIcon column="riskLevel" />
                        </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-white/30 transition-colors group" onClick={() => handleSort('status')}>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-pink-500">
                            Status <SortIcon column="status" />
                        </div>
                    </th>
                    <th className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-pink-50/20 bg-white/10">
                {processedTasks.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center justify-center gap-3 opacity-60">
                                <Ghost size={48} className="text-pink-200" />
                                <p className="text-slate-500 font-medium">No tasks found matching your criteria.</p>
                                <button onClick={() => {setStatusFilter('ALL'); setRiskFilter('ALL')}} className="text-pink-500 text-sm font-bold hover:underline">Clear Filters</button>
                            </div>
                        </td>
                    </tr>
                ) : (
                    processedTasks.map(task => {
                        const isSelected = selectedIds.has(task.id);
                        return (
                            <tr key={task.id} className={`group hover:bg-white/60 hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-200 ${isSelected ? 'bg-pink-50/40' : ''}`}>
                                <td className="px-6 py-4">
                                    <button onClick={() => toggleSelect(task.id)} className={`${isSelected ? 'text-pink-500' : 'text-slate-300 group-hover:text-pink-400'} transition-colors`}>
                                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-white/60 border border-white px-2 py-1 rounded shadow-sm">{task.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-semibold text-slate-700 group-hover:text-pink-600 transition-colors">{task.name}</p>
                                    <p className="text-xs text-slate-400 truncate w-48 mt-0.5">{task.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-50 to-violet-100 border border-white text-indigo-600 flex items-center justify-center text-[10px] font-bold shadow-sm">
                                            {task.assignee.charAt(0)}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600">{task.assignee}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-500 font-mono tracking-tight">{task.dueDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide border shadow-sm ${
                                        task.riskLevel === RiskLevel.HIGH || task.riskLevel === RiskLevel.CRITICAL 
                                        ? 'bg-rose-50/80 text-rose-600 border-rose-100' 
                                        : 'bg-emerald-50/80 text-emerald-600 border-emerald-100'
                                    }`}>
                                        {task.riskLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide border shadow-sm ${
                                        task.status === TaskStatus.DONE ? 'bg-teal-50/80 text-teal-700 border-teal-100' :
                                        task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-50/80 text-blue-700 border-blue-100' :
                                        'bg-slate-50/80 text-slate-600 border-slate-100'
                                    }`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-300 hover:text-pink-500 p-2 hover:bg-pink-50 rounded-full transition-all">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};