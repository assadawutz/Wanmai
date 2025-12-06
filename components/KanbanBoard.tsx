import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { MoreHorizontal, Plus, Calendar } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, status: TaskStatus) => void;
}

const COLUMNS = [
  { id: TaskStatus.TODO, title: 'To Do', color: 'bg-slate-50/20 border-slate-100', dot: 'bg-slate-400', headerText: 'text-slate-600' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-pink-50/20 border-pink-100', dot: 'bg-pink-500', headerText: 'text-pink-600' },
  { id: TaskStatus.REVIEW, title: 'Review', color: 'bg-violet-50/20 border-violet-100', dot: 'bg-violet-500', headerText: 'text-violet-600' },
  { id: TaskStatus.DONE, title: 'Done', color: 'bg-teal-50/20 border-teal-100', dot: 'bg-teal-500', headerText: 'text-teal-600' }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskUpdate }) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onTaskUpdate(taskId, status);
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="flex h-full overflow-x-auto gap-6 pb-6 px-1 snap-x snap-mandatory">
      {COLUMNS.map(col => {
        const isDragOver = dragOverColumn === col.id;
        
        return (
          <div 
            key={col.id} 
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex-shrink-0 w-80 md:w-96 flex flex-col rounded-3xl ${col.color} border backdrop-blur-xl h-full max-h-full snap-center shadow-sm transition-all duration-300 ring-1 ring-white/40 ${isDragOver ? 'ring-2 ring-pink-300 bg-pink-50/40 scale-[1.01]' : ''}`}
          >
            {/* Column Header */}
            <div className="p-5 flex justify-between items-center border-b border-white/20 sticky top-0 bg-white/20 backdrop-blur-lg rounded-t-3xl z-10">
              <h3 className={`font-bold text-sm flex items-center gap-3 ${col.headerText} font-serif tracking-wide`}>
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot} shadow-sm ring-1 ring-white`} />
                {col.title}
                <span className="bg-white/50 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm border border-white/40 backdrop-blur-sm text-slate-500">
                  {getTasksByStatus(col.id).length}
                </span>
              </h3>
              <button className="text-slate-400 hover:text-slate-600 hover:bg-white/40 p-1.5 rounded-full transition-all"><MoreHorizontal size={18} /></button>
            </div>

            {/* Task List */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {getTasksByStatus(col.id).map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className={`bg-white/60 backdrop-blur-md hover:bg-white/80 p-5 rounded-2xl shadow-sm border border-white/60 hover:border-pink-200 cursor-grab active:cursor-grabbing hover:shadow-[0_8px_30px_-5px_rgba(236,72,153,0.1)] transition-all duration-300 group relative ${draggedTaskId === task.id ? 'opacity-40 scale-95' : 'opacity-100'}`}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold font-mono text-slate-400 bg-white/50 px-2 py-0.5 rounded border border-white/50">{task.id}</span>
                    {task.riskLevel !== 'Low' && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                        task.riskLevel === 'High' || task.riskLevel === 'Critical' 
                          ? 'bg-rose-50/80 text-rose-600 border-rose-100' 
                          : 'bg-amber-50/80 text-amber-600 border-amber-100'
                      }`}>
                        {task.riskLevel}
                      </span>
                    )}
                  </div>

                  {/* Card Title */}
                  <h4 className="text-sm font-semibold text-slate-800 mb-4 leading-relaxed group-hover:text-pink-600 transition-colors">{task.name}</h4>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100/50">
                     <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-100 to-rose-100 border border-white text-pink-600 text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                        {task.assignee.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-slate-500 truncate max-w-[80px]">{task.assignee.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 bg-slate-50/50 px-2 py-1 rounded-lg border border-slate-100/50">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold">{task.dueDate}</span>
                    </div>
                  </div>
                  
                  {/* Simplified Status Changer Overlay (for non-drag) */}
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-10 rounded-2xl pointer-events-none group-hover:pointer-events-auto">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Move To</span>
                     <div className="flex gap-2">
                        {col.id !== TaskStatus.DONE && (
                          <button onClick={() => onTaskUpdate(task.id, TaskStatus.DONE)} className="px-3 py-1.5 bg-teal-500 text-white rounded-lg text-xs font-bold shadow-md hover:bg-teal-600 hover:scale-105 transition-all">Done</button>
                        )}
                        {col.id !== TaskStatus.IN_PROGRESS && (
                           <button onClick={() => onTaskUpdate(task.id, TaskStatus.IN_PROGRESS)} className="px-3 py-1.5 bg-pink-500 text-white rounded-lg text-xs font-bold shadow-md hover:bg-pink-600 hover:scale-105 transition-all">Progress</button>
                        )}
                     </div>
                  </div>
                </div>
              ))}
              
              {/* Drop Target Placeholder / Add Button */}
              {isDragOver && (
                <div className="h-24 border-2 border-dashed border-pink-300 bg-pink-50/20 rounded-2xl flex items-center justify-center text-pink-400 text-xs font-bold animate-pulse backdrop-blur-sm">
                  Drop Here
                </div>
              )}

              <button className="w-full py-3.5 border border-dashed border-slate-300 rounded-2xl text-slate-400 text-sm hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50/20 transition-all flex items-center justify-center gap-2 font-bold group bg-white/20 backdrop-blur-sm">
                <div className="p-1 bg-white/50 rounded group-hover:bg-pink-100 transition-colors"><Plus size={14} /></div>
                Add Task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};