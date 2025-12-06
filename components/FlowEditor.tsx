import React, { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection, 
  Edge,
  MarkerType,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Node,
  BackgroundVariant
} from 'reactflow';
import { 
  Plus, 
  LayoutTemplate, 
  Save, 
  Move, 
  RotateCcw,
  MousePointer2,
  Grid,
  ArrowRight,
  ArrowDown,
  Circle,
  ChevronDown,
  Workflow,
  Settings2,
  X,
  User,
  Calendar,
  Type
} from 'lucide-react';
import CustomTaskNode from './CustomTaskNode';
import { Task, TaskStatus, RiskLevel } from '../types';
import { WorkspaceService } from '../services/workspaceService';

interface FlowEditorProps {
  tasks: Task[];
  onTaskChange?: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate?: (task: Task) => void;
}

// Layout Types
type LayoutType = 'GRID' | 'HORIZONTAL' | 'VERTICAL' | 'CIRCLE';

// Helper to generate initial nodes from tasks based on layout
const getLayoutedNodes = (tasks: Task[], type: LayoutType = 'GRID'): Node[] => {
  return tasks.map((task, index) => {
    let position = { x: 0, y: 0 };
    
    // If we are in the default view (GRID) and the task has a saved position, use it.
    if (type === 'GRID' && task.position) {
      position = task.position;
    } else {
      // Otherwise, calculate layout
      switch (type) {
        case 'HORIZONTAL':
          position = { x: index * 450, y: 100 }; // Linear left-to-right
          break;
        case 'VERTICAL':
          position = { x: 250, y: index * 300 }; // Linear top-to-bottom
          break;
        case 'CIRCLE':
          const angle = (index / tasks.length) * 2 * Math.PI;
          const radius = 400 + (tasks.length * 20); // Dynamic radius
          position = { 
            x: 400 + radius * Math.cos(angle), 
            y: 400 + radius * Math.sin(angle) 
          };
          break;
        case 'GRID':
        default:
          position = { x: 100 + (index % 3) * 400, y: 100 + Math.floor(index / 3) * 300 };
          break;
      }
    }

    return {
      id: task.id,
      type: 'customTask',
      position,
      data: { 
        taskId: task.id, 
        taskName: task.name, 
        status: task.status, 
        riskLevel: task.riskLevel,
        assignee: task.assignee,
        dueDate: task.dueDate,
        description: task.description
      }
    };
  });
};

// Helper to generate initial dependency edges
const getInitialEdges = (tasks: Task[]): Edge[] => {
  const edges: Edge[] = [];
  for (let i = 0; i < tasks.length - 1; i++) {
    edges.push({
      id: `e${tasks[i].id}-${tasks[i+1].id}`,
      source: tasks[i].id,
      target: tasks[i+1].id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#fda4af', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#fda4af' },
    });
  }
  return edges;
};

const FlowEditorInner: React.FC<FlowEditorProps> = ({ tasks, onTaskChange, onTaskCreate }) => {
  const { fitView } = useReactFlow();
  const nodeTypes = useMemo(() => ({ customTask: CustomTaskNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('GRID');
  
  // Selection State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Initialize or Sync Logic
  useEffect(() => {
    // If we have no nodes yet, perform initial layout
    if (nodes.length === 0 && tasks.length > 0) {
      setNodes(getLayoutedNodes(tasks, 'GRID'));
      setEdges(getInitialEdges(tasks));
      setTimeout(() => fitView({ padding: 0.4 }), 100);
    } else {
      // Sync updates: Merge prop data into existing nodes AND add new nodes if missing
      setNodes((currentNodes) => {
        const existingNodeIds = new Set(currentNodes.map(n => n.id));
        
        // 1. Update existing nodes with new data from props
        const updatedNodes = currentNodes.map((node) => {
          const task = tasks.find(t => t.id === node.id);
          if (task) {
            return {
              ...node,
              data: {
                ...node.data,
                status: task.status,
                riskLevel: task.riskLevel,
                assignee: task.assignee,
                dueDate: task.dueDate,
                description: task.description,
                taskName: task.name // Ensure name updates too
              }
            };
          }
          return node;
        });

        // 2. Add new nodes for tasks that don't exist in currentNodes
        const newTasks = tasks.filter(t => !existingNodeIds.has(t.id));
        const newNodes = newTasks.map(task => {
            return {
                id: task.id,
                type: 'customTask',
                position: task.position || { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
                data: {
                    taskId: task.id,
                    taskName: task.name,
                    status: task.status,
                    riskLevel: task.riskLevel,
                    assignee: task.assignee,
                    dueDate: task.dueDate,
                    description: task.description
                }
            };
        });

        return [...updatedNodes, ...newNodes];
      });
    }
  }, [tasks, fitView, setNodes, setEdges]); // Removed 'nodes.length' to allow continuous sync

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      type: 'smoothstep', 
      animated: true, 
      style: { stroke: '#fda4af', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#fda4af' }
    }, eds)),
    [setEdges]
  );

  // --- Actions ---

  // Handle Drag Stop to Sync Position
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (onTaskChange) {
      onTaskChange(node.id, { position: node.position });
    } else {
      WorkspaceService.syncTaskUpdate(node.id, { position: node.position });
    }
  }, [onTaskChange]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleApplyLayout = (type: LayoutType) => {
    setCurrentLayout(type);
    setNodes(getLayoutedNodes(tasks, type));
    setShowLayoutMenu(false);
    setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 50);
  };

  const handleAddNode = () => {
    const id = `TSK-${Math.floor(Math.random() * 10000)}`;
    const newTask: Task = {
        id,
        name: 'New Task',
        status: TaskStatus.TODO,
        riskLevel: RiskLevel.LOW,
        assignee: 'Unassigned',
        dueDate: new Date().toISOString().split('T')[0],
        description: 'Created via Flow Editor',
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 }
    };
    
    // Notify parent to create the task in global state
    if (onTaskCreate) {
        onTaskCreate(newTask);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Explicit save logic handled by drag-stop and input change, but showing visual feedback
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Derived state for the settings panel
  const selectedTask = useMemo(() => 
    tasks.find(t => t.id === selectedNodeId), 
  [tasks, selectedNodeId]);

  const handleInputChange = (field: keyof Task, value: string) => {
     if (selectedNodeId && onTaskChange) {
         onTaskChange(selectedNodeId, { [field]: value });
     }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fff1f2] group font-sans relative">
      
      {/* 1. Dedicated Toolbar Header */}
      <div className="h-16 bg-white/90 backdrop-blur-md border-b border-pink-100 px-6 flex items-center justify-between shrink-0 z-20">
          
          <div className="flex items-center gap-4">
              {/* Title Section */}
              <div className="flex items-center gap-2 text-gray-700 mr-2">
                  <div className="p-2 bg-pink-100 rounded-lg text-pink-600 shadow-sm">
                      <Workflow size={18} />
                  </div>
                  <div>
                      <h3 className="text-sm font-bold leading-none">Process Map</h3>
                      <p className="text-[10px] text-gray-400 font-medium">Interactive Designer</p>
                  </div>
              </div>

              <div className="h-8 w-px bg-gray-100 mx-2"></div>

              {/* Primary Actions */}
               <button onClick={handleAddNode} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50 transition-all text-xs font-semibold shadow-sm hover:shadow-md active:scale-95">
                  <Plus size={14} /> Add Node
               </button>
               
               {/* Layout Dropdown */}
               <div className="relative">
                  <button 
                    onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all shadow-sm ${showLayoutMenu ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50'}`}
                  >
                      <LayoutTemplate size={14} /> Layouts <ChevronDown size={12} />
                  </button>
                  {/* Dropdown content */}
                   {showLayoutMenu && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-pink-100 overflow-hidden animate-fade-in z-50">
                          <div className="p-1.5 space-y-1">
                            <button onClick={() => handleApplyLayout('GRID')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${currentLayout === 'GRID' ? 'bg-pink-50 text-pink-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <Grid size={16} /> Grid Matrix
                            </button>
                            <button onClick={() => handleApplyLayout('HORIZONTAL')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${currentLayout === 'HORIZONTAL' ? 'bg-pink-50 text-pink-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <ArrowRight size={16} /> Pipeline
                            </button>
                            <button onClick={() => handleApplyLayout('VERTICAL')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${currentLayout === 'VERTICAL' ? 'bg-pink-50 text-pink-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <ArrowDown size={16} /> Waterfall
                            </button>
                            <button onClick={() => handleApplyLayout('CIRCLE')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${currentLayout === 'CIRCLE' ? 'bg-pink-50 text-pink-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <Circle size={16} /> Radar View
                            </button>
                         </div>
                      </div>
                    )}
               </div>
          </div>

          <div className="flex items-center gap-2">
             {/* View Controls */}
             <button onClick={() => fitView({ duration: 800 })} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Fit View">
                <Move size={18} />
             </button>

             <div className="h-8 w-px bg-gray-100 mx-2"></div>

             {/* Save Action */}
             <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${isSaving ? 'bg-teal-500 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-100'}`}>
                {isSaving ? <RotateCcw size={14} className="animate-spin" /> : <Save size={14} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
      </div>

      {/* 2. Canvas Area */}
      <div className="flex-1 w-full relative bg-[#fff1f2] overflow-hidden flex">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          className="bg-slate-50"
        >
          <Background 
            color="#fbcfe8" // pink-200
            gap={24} 
            size={1.5} 
            variant={BackgroundVariant.Dots} 
          />
          
          {/* Legend / Info Panel */}
          <Panel position="bottom-left" className="m-4">
             <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-pink-50 shadow-sm text-xs space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="font-bold text-gray-400 mb-1 flex items-center gap-1 uppercase tracking-wider text-[10px]">
                   <MousePointer2 size={10} /> Interaction
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                   <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                   Drag to move
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                   <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                   Click for details
                </div>
             </div>
          </Panel>

          <Controls className="!bg-white !border-pink-100 !shadow-lg !rounded-xl !p-1 [&>button]:!border-none [&>button]:!rounded-lg [&>button:hover]:!bg-pink-50 [&>button]:!text-gray-500 [&>button:hover]:!text-pink-500" />
          
          <MiniMap 
            className="!bg-white !border-pink-100 !shadow-lg !rounded-xl !m-4"
            nodeStrokeColor={(n) => {
              if (n.type === 'customTask') return '#f472b6'; // pink-400
              return '#eee';
            }}
            nodeColor={(n) => {
              if (n.type === 'customTask') return '#fce7f3'; // pink-100
              return '#fff';
            }}
            maskColor="rgba(255, 241, 242, 0.6)" // rose-50 with opacity
          />
        </ReactFlow>

        {/* Settings Panel Overlay */}
        {selectedTask && (
             <div className="absolute top-4 right-4 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-100 p-5 z-50 animate-slide-up">
                 {/* Header */}
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Settings2 size={18} className="text-pink-500"/>
                        Node Settings
                    </h3>
                    <button onClick={() => setSelectedNodeId(null)} className="text-gray-400 hover:text-rose-500 transition-colors bg-white hover:bg-rose-50 p-1 rounded-full"><X size={18}/></button>
                 </div>
                 
                 <div className="space-y-4">
                    {/* Task Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task Name</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="text" 
                                value={selectedTask.name} 
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Assignee */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assignee</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="text" 
                                value={selectedTask.assignee}
                                onChange={(e) => handleInputChange('assignee', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</label>
                         <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="date" 
                                value={selectedTask.dueDate}
                                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                             Changes auto-save
                        </div>
                    </div>
                 </div>
             </div>
          )}
      </div>
    </div>
  );
};

export const FlowEditor: React.FC<FlowEditorProps> = (props) => {
  return (
    <div className="h-[650px] w-full border border-pink-200 rounded-3xl overflow-hidden shadow-2xl bg-white ring-4 ring-pink-50/50">
      <ReactFlowProvider>
        <FlowEditorInner {...props} />
      </ReactFlowProvider>
    </div>
  );
};