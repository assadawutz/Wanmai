import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Send, Zap, Workflow, Image as ImageIcon, Bot, 
  CheckCircle, Plus, Edit3, List, PieChart, TrendingUp, AlertTriangle, 
  Calendar, User, ArrowRight
} from 'lucide-react';
import { Task, RiskLevel, TaskStatus } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';

interface AIAssistantProps {
  tasks: Task[];
  onTaskCreate?: (task: Task) => void;
  onTaskUpdate?: (id: string, updates: Partial<Task>) => void;
}

type MessageType = 'text' | 'flow' | 'chart' | 'code' | 'success' | 'task-list' | 'kpi';

interface Message {
  role: 'user' | 'ai';
  content: string;
  type: MessageType;
  data?: any;
  timestamp: Date;
}

const COLORS = ['#14B8A6', '#EC4899', '#8B5CF6', '#F43F5E', '#F59E0B'];

export const AIAssistant: React.FC<AIAssistantProps> = ({ tasks, onTaskCreate, onTaskUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: "Hello! I'm your PM Command Agent. I'm connected to your workspace live data.\n\nAsk me to:\n• Analyze project risks\n• Check team workload\n• Create or update tasks",
      type: 'text',
      timestamp: new Date()
    }
  ]);

  // Proactive Suggestions based on data
  const suggestions = [
    tasks.some(t => t.riskLevel === RiskLevel.HIGH) ? "Show high risk tasks" : null,
    "Summarize project status",
    "Who has the most work?",
    "Generate process flow"
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (isOpen && inputRef.current) {
        inputRef.current.focus();
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (text: string = inputValue) => {
    if (!text.trim()) return;
    
    const newMessage: Message = { role: 'user', content: text, type: 'text', timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    processAIResponse(text);
  };

  const findTaskFuzzy = (query: string): Task | undefined => {
      const lowerQuery = query.toLowerCase();
      // Exact ID match
      const exactId = tasks.find(t => t.id.toLowerCase() === lowerQuery);
      if (exactId) return exactId;
      // Name includes
      return tasks.find(t => t.name.toLowerCase().includes(lowerQuery));
  };

  const processAIResponse = (input: string) => {
    // Simulate AI thinking time
    setTimeout(() => {
      let responseMsg: Message = { role: 'ai', content: "I didn't quite catch that.", type: 'text', timestamp: new Date() };
      const lowerInput = input.toLowerCase();

      // --- LOGIC: ANALYTICS & QUERIES ---

      // 1. Summarize Project
      if (/(summary|status|overview)/i.test(lowerInput)) {
          const total = tasks.length;
          const done = tasks.filter(t => t.status === TaskStatus.DONE).length;
          const blocked = tasks.filter(t => t.status === TaskStatus.BLOCKED).length;
          const critical = tasks.filter(t => t.riskLevel === RiskLevel.CRITICAL).length;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;

          responseMsg = {
              role: 'ai',
              content: "Here is your real-time project snapshot:",
              type: 'kpi',
              data: { total, done, blocked, critical, progress },
              timestamp: new Date()
          };
      }
      // 2. Risk Analysis
      else if (/(risk|critical|attention)/i.test(lowerInput)) {
          const riskyTasks = tasks.filter(t => t.riskLevel === RiskLevel.HIGH || t.riskLevel === RiskLevel.CRITICAL);
          
          if (riskyTasks.length > 0) {
            responseMsg = {
                role: 'ai',
                content: `I found ${riskyTasks.length} tasks that require attention.`,
                type: 'task-list',
                data: riskyTasks,
                timestamp: new Date()
            };
          } else {
            responseMsg = { role: 'ai', content: "Great news! No high-risk items detected.", type: 'success', timestamp: new Date() };
          }
      }
      // 3. Workload / Chart
      else if (/(workload|who|resource|busy)/i.test(lowerInput)) {
         const workloadMap: Record<string, number> = {};
         tasks.forEach(t => { 
             if (t.status !== TaskStatus.DONE) {
                workloadMap[t.assignee] = (workloadMap[t.assignee] || 0) + 1; 
             }
         });
         const chartData = Object.entries(workloadMap)
            .map(([name, count]) => ({ name: name.split(' ')[0], tasks: count }))
            .sort((a, b) => b.tasks - a.tasks); // Sort by busiest
        
        const busiest = chartData.length > 0 ? chartData[0].name : "No one";

        responseMsg = {
            role: 'ai',
            content: `According to active tasks, **${busiest}** has the highest workload.`,
            type: 'chart',
            data: chartData,
            timestamp: new Date()
        };
      }
      
      // --- LOGIC: ACTIONS ---

      // 4. Create Task
      else if (/^(create|add|new) task/i.test(lowerInput)) {
         const nameMatch = input.match(/(?:task|add|create) (?:for )?(.+?)(?:$| priority)/i);
         const taskName = nameMatch ? nameMatch[1].replace(/^(task )/i, '').trim() : "New Task";
         
         const newTask: Task = {
             id: `AI-${Math.floor(Math.random() * 9999)}`,
             name: taskName.charAt(0).toUpperCase() + taskName.slice(1),
             status: TaskStatus.TODO,
             riskLevel: RiskLevel.LOW,
             assignee: "AI Agent",
             dueDate: new Date().toISOString().split('T')[0],
             description: "Created automatically by AI Agent based on user command.",
             position: { x: Math.random() * 400, y: Math.random() * 400 }
         };

         if (onTaskCreate) {
             onTaskCreate(newTask);
             responseMsg = {
                role: 'ai',
                content: `Created task "${newTask.name}"`,
                type: 'success',
                data: newTask,
                timestamp: new Date()
            };
         }
      }
      // 5. Update Status
      else if (/(?:mark|set|update) (.+) (?:as|to) (done|in progress|todo|blocked|review)/i.test(lowerInput)) {
          const match = lowerInput.match(/(?:mark|set|update) (.+) (?:as|to) (done|in progress|todo|blocked|review)/i);
          if (match && onTaskUpdate) {
              const taskQuery = match[1].trim();
              const statusQuery = match[2].trim();
              const targetTask = findTaskFuzzy(taskQuery);

              if (targetTask) {
                  const statusMap: Record<string, TaskStatus> = {
                      'done': TaskStatus.DONE,
                      'in progress': TaskStatus.IN_PROGRESS,
                      'todo': TaskStatus.TODO,
                      'blocked': TaskStatus.BLOCKED,
                      'review': TaskStatus.REVIEW
                  };
                  const newStatus = statusMap[statusQuery];
                  onTaskUpdate(targetTask.id, { status: newStatus });
                  
                  responseMsg = {
                      role: 'ai',
                      content: `Updated "${targetTask.name}" to ${newStatus}`,
                      type: 'success',
                      data: { ...targetTask, status: newStatus },
                      timestamp: new Date()
                  };
              } else {
                  responseMsg = { role: 'ai', content: `I couldn't find a task matching "${taskQuery}".`, type: 'text', timestamp: new Date() };
              }
          }
      }
      // 6. Generate Flow
      else if (/flow|diagram|process/i.test(lowerInput)) {
        responseMsg = {
            role: 'ai',
            content: "I've analyzed the critical path and generated this Mermaid flow:",
            type: 'flow',
            data: `graph TD\n  Start[Start Project] --> Plan[Planning]\n  Plan --> Dev[Development]\n  Dev --> Review[Code Review]\n  Review --> QA[Testing]\n  QA --> Deploy[Deployment]`,
            timestamp: new Date()
        };
      } 
      // Fallback
      else {
          responseMsg = {
              role: 'ai',
              content: "I can help with project management tasks. Try asking for a 'Summary' or 'High risk tasks'.",
              type: 'text',
              timestamp: new Date()
          };
      }

      setMessages(prev => [...prev, responseMsg]);
      setIsTyping(false);
    }, 800);
  };

  const renderContent = (msg: Message) => {
      switch(msg.type) {
          case 'success':
              return (
                  <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-3 animate-scale-in shadow-sm">
                      <div className="p-1 bg-emerald-100 rounded-full text-emerald-600 mt-0.5">
                          <CheckCircle size={14} />
                      </div>
                      <div>
                          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Action Complete</p>
                          <p className="text-sm text-emerald-700 leading-tight mt-1">
                             {msg.data?.name ? `Task "${msg.data.name}" processed successfully.` : msg.content}
                          </p>
                      </div>
                  </div>
              );
          case 'kpi':
              return (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                     <div className="bg-pink-50 p-2 rounded-lg border border-pink-100 text-center">
                        <div className="text-xl font-bold text-pink-600">{msg.data.progress}%</div>
                        <div className="text-[10px] text-pink-400 font-bold uppercase">Progress</div>
                     </div>
                     <div className="bg-rose-50 p-2 rounded-lg border border-rose-100 text-center">
                        <div className="text-xl font-bold text-rose-600">{msg.data.critical}</div>
                        <div className="text-[10px] text-rose-400 font-bold uppercase">Critical</div>
                     </div>
                     <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center col-span-2 flex justify-between px-4 items-center">
                        <span className="text-xs text-slate-500 font-medium">Total Tasks</span>
                        <span className="text-sm font-bold text-slate-700">{msg.data.total}</span>
                     </div>
                  </div>
              );
          case 'chart':
              return (
                  <div className="mt-2 w-full h-32 bg-white rounded-lg p-2 border border-gray-100 shadow-sm">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={msg.data} layout="vertical" margin={{left: 0, right: 10, top: 0, bottom: 0}}>
                            <XAxis type="number" hide />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px'}} />
                            <Bar dataKey="tasks" radius={[0, 4, 4, 0]} barSize={12}>
                                {msg.data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                             <XAxis type="category" dataKey="name" hide />
                        </BarChart>
                     </ResponsiveContainer>
                     <div className="flex flex-wrap gap-2 mt-1 justify-center">
                        {msg.data.slice(0, 3).map((d: any, i: number) => (
                            <div key={i} className="flex items-center gap-1 text-[10px] text-gray-500">
                                <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS[i]}}></span>
                                {d.name} ({d.tasks})
                            </div>
                        ))}
                     </div>
                  </div>
              );
          case 'task-list':
              return (
                  <div className="mt-3 space-y-2">
                      {msg.data.map((task: Task) => (
                          <div key={task.id} className="bg-white border border-gray-100 p-2 rounded-lg shadow-sm flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                  <AlertTriangle size={12} className="text-rose-500" />
                                  <span className="font-semibold text-slate-700 truncate max-w-[120px]">{task.name}</span>
                              </div>
                              <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[9px]">{task.riskLevel}</span>
                          </div>
                      ))}
                  </div>
              );
          case 'flow':
              return (
                  <div className="mt-2 bg-slate-900 rounded-lg p-3 overflow-x-auto border border-slate-700 shadow-inner">
                      <pre className="text-[9px] font-mono text-emerald-400 leading-tight">
                        {msg.data}
                      </pre>
                  </div>
              );
          default:
              return null;
      }
  };

  if (!isOpen) {
    return (
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-tr from-pink-600 to-rose-500 rounded-full shadow-[0_8px_30px_rgb(236,72,153,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform z-50 group border-2 border-white/20 backdrop-blur-sm"
        >
            <Bot size={28} />
            <span className="absolute -top-12 right-0 bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-xl w-max opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0">
                AI Agent Ready
            </span>
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-rose-500"></div>
        </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-[90vw] md:w-[400px] h-[550px] md:h-[650px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 z-50 flex flex-col overflow-hidden animate-scale-in font-sans ring-1 ring-black/5">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
                    <Bot size={20} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-sm leading-none tracking-wide">PM Command Agent</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-pink-100 font-medium opacity-90">Workspace Connected</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                 <button onClick={() => setMessages([])} className="hover:bg-white/20 p-2 rounded-lg transition-colors text-pink-100 hover:text-white" title="Clear Chat">
                    <Workflow size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-lg transition-colors text-pink-100 hover:text-white">
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 scroll-smooth">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black shadow-sm border border-white ${
                        msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-tr from-pink-500 to-rose-500 text-white'
                    }`}>
                        {msg.role === 'user' ? 'ME' : 'AI'}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                            : 'bg-white border border-gray-100 text-slate-700 rounded-tl-sm'
                        }`}>
                             {msg.type === 'success' ? null : (
                                 <div className="whitespace-pre-wrap">{msg.content}</div>
                             )}
                            {renderContent(msg)}
                        </div>
                        <span className="text-[9px] text-gray-300 mt-1 px-1 font-medium">
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                </div>
            ))}
            
            {isTyping && (
                <div className="flex gap-3 animate-fade-in">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center text-[10px] font-black shadow-sm border border-white">AI</div>
                     <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            )}
        </div>

        {/* Proactive Suggestions */}
        <div className="px-4 py-3 bg-white border-t border-gray-50 overflow-x-auto no-scrollbar">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles size={10} className="text-pink-400" /> Suggestions
            </p>
            <div className="flex gap-2">
                {suggestions.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSendMessage(s)} 
                        className="flex-shrink-0 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-full text-xs font-medium hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all active:scale-95 whitespace-nowrap shadow-sm"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 pl-4 ring-1 ring-transparent focus-within:ring-pink-400 focus-within:bg-white transition-all shadow-inner">
                <input 
                    ref={inputRef}
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask AI to analyze or update..." 
                    className="flex-1 bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 focus:outline-none py-1"
                />
                
                <div className="flex items-center gap-1 pr-1">
                    <button 
                        className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-colors"
                        title="Upload Image Context"
                    >
                        <ImageIcon size={18} />
                    </button>
                    <button 
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim()}
                        className="p-2 bg-gradient-to-tr from-pink-500 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-200 disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};