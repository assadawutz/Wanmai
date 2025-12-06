import React, { memo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position, NodeProps } from 'reactflow';
import { AlertTriangle, CheckCircle2, Clock, Ban, Activity, X, Calendar, User, AlignLeft, ShieldAlert } from 'lucide-react';
import { NodeData, TaskStatus, RiskLevel } from '../types';

/**
 * CustomTaskNode
 * 
 * A custom node for React Flow that visualizes project tasks.
 * It displays status color coding, risk level indicators, and task details.
 * Click to open a detailed modal.
 */
const CustomTaskNode = ({ data }: NodeProps<NodeData>) => {
  const { taskId, taskName, status, riskLevel, assignee, dueDate, description } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  // Helper to determine the border color based on status
  const getStatusBorder = (currentStatus: TaskStatus): string => {
    switch (currentStatus) {
      case TaskStatus.DONE:
        return 'border-teal-400';
      case TaskStatus.IN_PROGRESS:
        return 'border-pink-400';
      case TaskStatus.REVIEW:
        return 'border-violet-400';
      case TaskStatus.BLOCKED:
        return 'border-rose-400';
      case TaskStatus.TODO:
      default:
        return 'border-slate-300';
    }
  };

  // Helper to determine background color based on Risk Level
  const getRiskBackground = (level: RiskLevel): string => {
    switch (level) {
      case RiskLevel.CRITICAL:
        return 'bg-rose-100'; // Critical (Highest)
      case RiskLevel.HIGH:
        return 'bg-red-50'; // High - Red (As requested)
      case RiskLevel.MEDIUM:
        return 'bg-yellow-50'; // Medium - Yellow (As requested)
      case RiskLevel.LOW:
      default:
        return 'bg-white'; // Low - Clean
    }
  };

  // Helper for right-side risk border accent
  const getRiskBorder = (level: RiskLevel): string => {
    switch (level) {
      case RiskLevel.CRITICAL:
        return 'border-r-4 border-r-rose-600';
      case RiskLevel.HIGH:
        return 'border-r-4 border-r-red-500';
      case RiskLevel.MEDIUM:
        return 'border-r-4 border-r-yellow-400';
      default:
        return 'border-r-0'; 
    }
  };

  // Helper to get status badge styling
  const getStatusBadgeStyle = (currentStatus: TaskStatus): string => {
    switch (currentStatus) {
      case TaskStatus.DONE: return 'bg-teal-100 text-teal-700 ring-1 ring-teal-200';
      case TaskStatus.IN_PROGRESS: return 'bg-pink-100 text-pink-700 ring-1 ring-pink-200';
      case TaskStatus.REVIEW: return 'bg-violet-100 text-violet-700 ring-1 ring-violet-200';
      case TaskStatus.BLOCKED: return 'bg-rose-100 text-rose-700 ring-1 ring-rose-200';
      default: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    }
  };

  // Helper to get the risk indicator icon and color
  const getRiskIndicator = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL:
        return <div className="flex items-center gap-1 text-[10px] font-extrabold text-rose-700 bg-rose-200 px-2 py-0.5 rounded-full border border-rose-300 animate-pulse"><ShieldAlert size={10} /> CRITICAL</div>;
      case RiskLevel.HIGH:
        return <div className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200"><AlertTriangle size={10} /> HIGH</div>;
      case RiskLevel.MEDIUM:
        return <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200"><Activity size={10} /> MED</div>;
      case RiskLevel.LOW:
      default:
        return null;
    }
  };

  const StatusIcon = () => {
    switch (status) {
      case TaskStatus.DONE: return <CheckCircle2 size={16} className="text-teal-600" />;
      case TaskStatus.IN_PROGRESS: return <Clock size={16} className="text-pink-600 animate-spin-slow" />; 
      case TaskStatus.BLOCKED: return <Ban size={16} className="text-rose-600" />;
      case TaskStatus.REVIEW: return <Activity size={16} className="text-violet-600" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-slate-300" />;
    }
  };

  // Render modal content using Portal
  const Modal = () => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Trap focus and handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        
        // Focus the close button when modal opens
        if (closeButtonRef.current) {
            closeButtonRef.current.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Return focus to the node when modal closes
            if (nodeRef.current) {
                nodeRef.current.focus();
            }
        };
    }, []);

    return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm animate-fade-in" 
      onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div 
        className="bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] w-full max-w-lg mx-4 overflow-hidden border border-white/50 animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-50/50 to-white p-6 border-b border-pink-100 flex justify-between items-start">
           <div>
              <div className="flex items-center gap-2 mb-3">
                 <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200" aria-label={`Task ID ${taskId}`}>{taskId}</span>
                 {getRiskIndicator(riskLevel)}
              </div>
              <h2 id="modal-title" className="text-xl font-bold text-slate-800 leading-snug font-sans">{taskName}</h2>
           </div>
           <button 
             ref={closeButtonRef}
             onClick={() => setIsModalOpen(false)}
             className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
             aria-label="Close details"
           >
             <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6" id="modal-desc">
           {/* Status Row */}
           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Current Status</span>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusBadgeStyle(status)}`}>
                 <StatusIcon />
                 {status}
              </div>
           </div>

           {/* Info Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} /> Assignee
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-100 to-rose-200 flex items-center justify-center text-xs font-extrabold text-pink-700 ring-2 ring-white shadow-sm" aria-hidden="true">
                        {assignee ? assignee.charAt(0) : '?'}
                     </div>
                     <span className="text-sm font-bold text-slate-700 truncate">{assignee}</span>
                  </div>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={14} /> Due Date
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 h-[58px] shadow-sm">
                     <span className="text-sm font-bold text-slate-700">{dueDate}</span>
                  </div>
              </div>
           </div>

           {/* Description */}
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                 <AlignLeft size={14} /> Description
              </label>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed min-h-[80px] max-h-[200px] overflow-y-auto">
                 {description || 'No description provided for this task.'}
              </div>
           </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }} 
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-sm transition-all shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
                Close Details
            </button>
        </div>
      </div>
    </div>,
    document.body
  );
  };

  const handleNodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  return (
    <>
    <div 
      ref={nodeRef}
      onClick={() => setIsModalOpen(true)}
      onKeyDown={handleNodeKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Task ${taskId}: ${taskName}, Status ${status}, Risk ${riskLevel}`}
      className={`shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl border-l-[6px] w-[300px] transition-all duration-300 hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-1 ${getStatusBorder(status)} ${getRiskBorder(riskLevel)} ${getRiskBackground(riskLevel)} backdrop-blur-md cursor-pointer group bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2`}
    >
      {/* Input Handle */}
      <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-3 !h-3 !border-2 !border-white transition-colors group-hover:!bg-pink-400" />

      <div className="p-4">
        {/* Header: ID & Risk */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider bg-white px-2 py-0.5 rounded border border-slate-100 group-hover:border-pink-200 transition-colors">
            {taskId}
          </span>
          {getRiskIndicator(riskLevel)}
        </div>

        {/* Body: Task Name */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-pink-600 transition-colors">
            {taskName}
          </h3>
        </div>

        {/* Footer: Assignee & Status */}
        <div className="flex justify-between items-end border-t border-slate-100 pt-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Owner</span>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-100 to-rose-200 border border-white flex items-center justify-center text-[9px] font-bold text-pink-700 shadow-sm" aria-hidden="true">
                {assignee.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-600 truncate max-w-[90px]">{assignee.split(' ')[0]}</span>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${getStatusBadgeStyle(status)}`}>
            <StatusIcon />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">{status}</span>
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-3 !h-3 !border-2 !border-white transition-colors group-hover:!bg-pink-400" />
    </div>
    {isModalOpen && <Modal />}
    </>
  );
};

export default memo(CustomTaskNode);