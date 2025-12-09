import React, { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Ban, 
  Activity, 
  Calendar, 
  User, 
  ShieldAlert, 
  X, 
  AlignLeft, 
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import { NodeData, TaskStatus, RiskLevel } from '../types';

/**
 * CustomTaskNode - AI Diagram Engine v5 Style
 * 
 * Implements the "Project Workspace" design language:
 * - Rounded 20px containers
 * - Soft pastel palettes (Pink/Mint/Rose)
 * - Glassmorphism effects
 * - Interactive states (Scale, Shadow, Glow)
 */

// --- Style Generators ---

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.DONE: return { 
      border: 'border-teal-400', 
      bg: 'bg-teal-50', 
      text: 'text-teal-700', 
      icon: 'text-teal-500',
      badge: 'bg-teal-100 text-teal-800'
    };
    case TaskStatus.IN_PROGRESS: return { 
      border: 'border-pink-400', 
      bg: 'bg-pink-50', 
      text: 'text-pink-700', 
      icon: 'text-pink-500',
      badge: 'bg-pink-100 text-pink-800'
    };
    case TaskStatus.REVIEW: return { 
      border: 'border-violet-400', 
      bg: 'bg-violet-50', 
      text: 'text-violet-700', 
      icon: 'text-violet-500',
      badge: 'bg-violet-100 text-violet-800'
    };
    case TaskStatus.BLOCKED: return { 
      border: 'border-rose-400', 
      bg: 'bg-rose-50', 
      text: 'text-rose-700', 
      icon: 'text-rose-500',
      badge: 'bg-rose-100 text-rose-800'
    };
    default: return { 
      border: 'border-slate-300', 
      bg: 'bg-slate-50', 
      text: 'text-slate-700', 
      icon: 'text-slate-400',
      badge: 'bg-slate-100 text-slate-700'
    };
  }
};

const getRiskStyles = (level: RiskLevel) => {
  switch (level) {
    case RiskLevel.CRITICAL:
      return 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse';
    case RiskLevel.HIGH:
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case RiskLevel.MEDIUM:
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'hidden'; // Don't show low risk tag to keep UI clean
  }
};

const StatusIcon = ({ status, className }: { status: TaskStatus, className?: string }) => {
  switch (status) {
    case TaskStatus.DONE: return <CheckCircle2 size={14} className={className} />;
    case TaskStatus.IN_PROGRESS: return <Clock size={14} className={`${className} animate-spin-slow`} />; 
    case TaskStatus.BLOCKED: return <Ban size={14} className={className} />;
    case TaskStatus.REVIEW: return <Activity size={14} className={className} />;
    default: return <div className={`w-3 h-3 rounded-full border-2 border-current ${className}`} />;
  }
};

// --- Modal Component ---

const TaskDetailModal = ({ 
  isOpen, 
  onClose, 
  data 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  data: NodeData 
}) => {
  if (!isOpen) return null;

  const styles = getStatusColor(data.status);

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-white/60 overflow-hidden animate-scale-in ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`px-6 py-5 border-b border-slate-100 bg-gradient-to-r ${styles.bg} to-white flex justify-between items-start`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] font-bold text-slate-500 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-200/50">
                {data.taskId}
              </span>
              {data.riskLevel !== RiskLevel.LOW && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getRiskStyles(data.riskLevel)}`}>
                  <ShieldAlert size={10} /> {data.riskLevel} Risk
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-800 leading-tight">{data.taskName}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm ${styles.badge}`}>
              <StatusIcon status={data.status} />
              {data.status}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
              <AlignLeft size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Description</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed min-h-[80px]">
              {data.description || "No description provided for this task."}
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-100 to-rose-50 flex items-center justify-center text-pink-600 font-bold text-xs border-2 border-white shadow-sm">
                {data.assignee.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assignee</p>
                <p className="text-sm font-semibold text-slate-700 truncate">{data.assignee}</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 border-2 border-white shadow-sm">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Due Date</p>
                <p className="text-sm font-semibold text-slate-700">{data.dueDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:border-pink-300 hover:text-pink-600 shadow-sm transition-all active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Main Node Component ---

const CustomTaskNode = ({ data, selected }: NodeProps<NodeData>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const styles = getStatusColor(data.status);

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        onClick={handleNodeClick}
        className={`
          group relative w-[280px] bg-white rounded-[20px] 
          border-l-[6px] ${styles.border}
          shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.12)]
          transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          cursor-pointer
          ${selected ? 'ring-4 ring-pink-400/30 scale-[1.02] z-10' : 'hover:-translate-y-1 hover:scale-[1.01]'}
        `}
      >
        {/* Top Handle */}
        <Handle 
          type="target" 
          position={Position.Top} 
          className="!w-3 !h-3 !bg-white !border-2 !border-slate-300 !top-[-6px] transition-colors group-hover:!border-pink-400 group-hover:!bg-pink-50" 
        />

        {/* Card Content */}
        <div className="p-4 relative overflow-hidden rounded-r-[14px]">
          
          {/* Subtle Background Gradient based on status */}
          <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} opacity-30 pointer-events-none`} />

          {/* Header Row: ID & Risk */}
          <div className="relative flex justify-between items-start mb-3 z-10">
            <span className="font-mono text-[10px] font-bold text-slate-400 bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/50 group-hover:border-pink-200 transition-colors">
              {data.taskId}
            </span>
            
            {data.riskLevel !== RiskLevel.LOW && (
              <div className={`flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${getRiskStyles(data.riskLevel)}`}>
                {data.riskLevel === RiskLevel.CRITICAL && <ShieldAlert size={10} />}
                {data.riskLevel === RiskLevel.HIGH && <AlertTriangle size={10} />}
                {data.riskLevel}
              </div>
            )}
          </div>

          {/* Body: Task Name */}
          <div className="relative z-10 mb-4 pr-6">
            <h3 className="text-sm font-bold text-slate-700 leading-snug group-hover:text-pink-600 transition-colors line-clamp-2">
              {data.taskName}
            </h3>
          </div>

          {/* Footer: Assignee & Status */}
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-100/50">
            
            {/* Assignee */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600 shadow-sm">
                {data.assignee.charAt(0)}
              </div>
              <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[80px]">
                {data.assignee.split(' ')[0]}
              </span>
            </div>

            {/* Status Pill */}
            <div className={`flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full border border-white/50 shadow-sm ${styles.badge}`}>
              <StatusIcon status={data.status} />
              <span className="text-[9px] font-extrabold uppercase tracking-wider">{data.status}</span>
            </div>

          </div>

          {/* Hover Action Hint */}
          <div className="absolute top-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 translate-x-2">
            <MoreHorizontal size={16} />
          </div>

        </div>

        {/* Bottom Handle */}
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="!w-3 !h-3 !bg-white !border-2 !border-slate-300 !bottom-[-6px] transition-colors group-hover:!border-pink-400 group-hover:!bg-pink-50" 
        />
      </div>

      <TaskDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={data} 
      />
    </>
  );
};

export default memo(CustomTaskNode);