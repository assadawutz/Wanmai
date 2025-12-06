import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Task, TaskStatus, RiskLevel } from '../types';
import { AlertTriangle, CheckSquare, Clock, ShieldAlert, Sparkles, Activity, Printer, TrendingUp, ArrowRight, Layers } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
}

const COLORS = ['#14B8A6', '#EC4899', '#8B5CF6', '#F43F5E'];

export const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const highRiskTasks = tasks.filter(t => t.riskLevel === RiskLevel.HIGH || t.riskLevel === RiskLevel.CRITICAL).length;
  const criticalPathTasks = tasks.filter(t => t.isCriticalPath).length;

  const statusData = [
    { name: 'Done', value: completedTasks, color: '#14B8A6' },
    { name: 'In Progress', value: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length, color: '#EC4899' },
    { name: 'Review', value: tasks.filter(t => t.status === TaskStatus.REVIEW).length, color: '#8B5CF6' },
    { name: 'Blocked', value: tasks.filter(t => t.status === TaskStatus.BLOCKED).length, color: '#F43F5E' },
  ].filter(d => d.value > 0);

  const workloadMap: Record<string, number> = {};
  tasks.forEach(t => {
    if (t.status !== TaskStatus.DONE) {
      workloadMap[t.assignee] = (workloadMap[t.assignee] || 0) + 1;
    }
  });
  const workloadData = Object.entries(workloadMap).map(([name, count]) => ({
    name: name.split(' ')[0],
    tasks: count
  }));

  const handlePrint = () => {
    window.print();
  };

  const KPICard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-white/60 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden ring-1 ring-white/60">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-[0.08] rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}></div>
      
      <div className="flex justify-between items-start mb-4 relative">
        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg shadow-pink-500/10 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50/60 px-2 py-1 rounded-lg border border-emerald-100 flex items-center gap-1 backdrop-blur-sm">
          <TrendingUp size={10} /> +{trend}%
        </span>
      </div>
      <div className="relative">
        <h3 className="text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 group-hover:text-pink-600 transition-colors">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up pb-20">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
         <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2 font-serif italic">
               <Layers className="text-pink-500" size={24} /> Executive Dashboard
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Real-time performance metrics and insights.</p>
         </div>
         <button 
           onClick={handlePrint}
           className="flex items-center gap-2 text-slate-600 hover:text-pink-600 bg-white/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-wide active:scale-95"
         >
           <Printer size={16} /> <span className="hidden sm:inline">Export Report</span>
         </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Completion Rate" 
          value={`${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`} 
          icon={CheckSquare} 
          color="from-teal-400 to-teal-600" 
          trend={12}
        />
        <KPICard 
          title="High Risk Items" 
          value={highRiskTasks} 
          icon={ShieldAlert} 
          color="from-rose-400 to-rose-600" 
          trend={5}
        />
        <KPICard 
          title="Critical Path" 
          value={criticalPathTasks} 
          icon={Activity} 
          color="from-amber-400 to-amber-600" 
          trend={8}
        />
        <KPICard 
          title="Active Workload" 
          value={totalTasks - completedTasks} 
          icon={Clock} 
          color="from-violet-400 to-violet-600" 
          trend={15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Chart */}
        <div className="bg-white/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-white/60 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-500 page-break-inside-avoid ring-1 ring-white/60">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-serif italic">
               <div className="w-1 h-5 bg-pink-500 rounded-full"></div>
               Team Workload
            </h3>
            <button className="text-slate-400 hover:text-pink-500 transition-colors p-2 hover:bg-pink-50/50 rounded-full"><ArrowRight size={20}/></button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} dy={10} />
                <YAxis allowDecimals={false} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#fff1f2', opacity: 0.5}} 
                  contentStyle={{borderRadius: '16px', border: '1px solid #fff', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', padding: '12px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)'}} 
                  itemStyle={{color: '#1e293b', fontWeight: 700}}
                />
                <Bar dataKey="tasks" fill="url(#colorPink)" radius={[6, 6, 6, 6]} barSize={48} animationDuration={1500}>
                   {workloadData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ec4899' : '#f472b6'} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie */}
        <div className="bg-white/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-white/60 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-500 page-break-inside-avoid flex flex-col ring-1 ring-white/60">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-serif italic">
               <div className="w-1 h-5 bg-teal-400 rounded-full"></div>
               Status Distribution
            </h3>
             <button className="text-slate-400 hover:text-teal-500 transition-colors p-2 hover:bg-teal-50/50 rounded-full"><ArrowRight size={20}/></button>
          </div>
          
          <div className="flex items-center h-full">
            {/* Chart Section */}
            <div className="flex-1 h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                    >
                    {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #fff', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#334155', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)'}} />
                </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-extrabold text-slate-800">{totalTasks}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total Tasks</span>
                </div>
            </div>

            {/* Legend */}
            <div className="w-40 flex flex-col justify-center gap-4 pl-8 border-l border-white/40">
                {statusData.map((item) => (
                    <div key={item.name} className="flex flex-col group cursor-default">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">
                            <span className="w-2 h-2 rounded-full shadow-sm ring-1 ring-white" style={{backgroundColor: item.color}}></span>
                            {item.name}
                        </div>
                        <div className="flex items-baseline gap-1 pl-4 mt-0.5">
                            <span className="text-lg font-bold text-slate-700">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Path Table */}
      <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-white/60 overflow-hidden page-break-inside-avoid hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-500 ring-1 ring-white/60">
        <div className="p-6 border-b border-pink-50/30 flex items-center gap-3 bg-white/20">
          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl shadow-sm ring-1 ring-rose-100">
            <Activity size={20} />
          </div>
          <div>
              <h3 className="text-lg font-bold text-slate-800 font-serif italic">Critical Path Items</h3>
              <p className="text-xs text-rose-400 font-medium">Tasks that directly impact project timeline</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/30 text-[10px] uppercase font-bold text-slate-400 tracking-wider backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4">Task ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {tasks.filter(t => t.isCriticalPath).map(task => (
                <tr key={task.id} className="hover:bg-pink-50/20 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-mono text-xs text-pink-400 font-bold group-hover:text-pink-600">{task.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-pink-700 transition-colors">{task.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-100 to-rose-100 flex items-center justify-center text-[10px] text-pink-700 font-bold border-2 border-white shadow-sm">
                        {task.assignee.charAt(0)}
                      </div>
                      <span className="text-slate-600 font-semibold text-xs">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-rose-500 font-bold flex items-center gap-1.5 text-xs">
                    <Clock size={14} />
                    {task.dueDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-sm ${
                      task.status === TaskStatus.DONE ? 'bg-teal-50/80 text-teal-600 border-teal-100' : 
                      task.status === TaskStatus.BLOCKED ? 'bg-rose-50/80 text-rose-600 border-rose-100' : 
                      task.status === TaskStatus.IN_PROGRESS ? 'bg-pink-50/80 text-pink-600 border-pink-100' :
                      'bg-violet-50/80 text-violet-600 border-violet-100'}`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};