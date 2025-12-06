import React, { useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Save, ArrowLeft, Trash2, Share2, FileText, Plus, Search, Clock, Cloud,
  X, Undo, Redo, Link as LinkIcon, Image as ImageIcon, Printer
} from 'lucide-react';
import { Doc } from '../types';
import { WorkspaceService } from '../services/workspaceService';

export const DocEditor: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'EDITOR'>('LIST');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeDoc, setActiveDoc] = useState<Doc | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [editorContent, setEditorContent] = useState('');
  const [editorTitle, setEditorTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch docs on mount
  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    const fetchedDocs = await WorkspaceService.fetchDocs();
    setDocs(fetchedDocs);
    setLoading(false);
  };

  const handleCreateDoc = async () => {
    const newDoc: Doc = {
      id: `doc-${Date.now()}`,
      title: 'Untitled Document',
      content: '<p>Start typing...</p>',
      lastModified: new Date(),
      owner: 'John Doe',
      status: 'Draft'
    };
    
    // Save immediately
    await WorkspaceService.saveDoc(newDoc);
    setDocs([newDoc, ...docs]);
    handleOpenDoc(newDoc);
  };

  const handleOpenDoc = (doc: Doc) => {
    setActiveDoc(doc);
    setEditorTitle(doc.title);
    setEditorContent(doc.content);
    setViewMode('EDITOR');
  };

  const handleDeleteDoc = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      await WorkspaceService.deleteDoc(id);
      setDocs(docs.filter(d => d.id !== id));
    }
  };

  const handleSave = async () => {
    if (!activeDoc) return;
    setIsSaving(true);
    
    const updatedDoc: Doc = {
      ...activeDoc,
      title: editorTitle,
      content: editorContent,
      lastModified: new Date()
    };

    await WorkspaceService.saveDoc(updatedDoc);
    
    // Update local state list
    setDocs(docs.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    setActiveDoc(updatedDoc);
    
    setIsSaving(false);
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const insertLink = () => {
    const url = prompt('Enter Link URL:', 'https://');
    if (url) execCmd('createLink', url);
  };

  const insertImage = () => {
    const url = prompt('Enter Image URL:', 'https://via.placeholder.com/150');
    if (url) execCmd('insertImage', url);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('doc-canvas')?.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            <html><head><title>${editorTitle}</title><script src="https://cdn.tailwindcss.com"></script><style>body { padding: 40px; font-family: serif; }</style></head><body class="prose max-w-none">
                <h1 class="text-3xl font-bold mb-4 border-b pb-2">${editorTitle}</h1>${printContent}
            </body></html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
  };

  if (viewMode === 'LIST') {
    const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col h-full animate-fade-in relative overflow-hidden transition-all duration-300 ring-1 ring-white/50">
        {/* Header */}
        <div className="p-6 border-b border-pink-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Smart Docs</h2>
            <p className="text-sm text-gray-500 font-medium">Knowledge Base & Requirements.</p>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-3">
             <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-white border border-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all w-full sm:w-64 shadow-sm"
                />
             </div>
             <button 
                onClick={handleCreateDoc}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl hover:shadow-lg hover:shadow-slate-500/20 transition-all active:scale-95 shadow-md font-bold text-xs uppercase tracking-wide"
             >
                <Plus size={16} /> New Doc
             </button>
          </div>
        </div>

        {/* Grid */}
        <div className="p-6 overflow-y-auto flex-1 bg-pink-50/20">
          {loading ? (
             <div className="flex justify-center items-center h-full flex-col gap-3">
                 <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                 <span className="text-pink-400 text-sm font-bold animate-pulse">Loading Workspace Docs...</span>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDocs.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => handleOpenDoc(doc)}
                    className="bg-white rounded-2xl border border-white shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-64 overflow-hidden"
                  >
                    <div className="p-5 flex-1 bg-slate-50 relative overflow-hidden group-hover:bg-white transition-colors">
                      <div className="absolute inset-4 bg-white shadow-sm border border-gray-100 p-4 text-[7px] text-gray-300 overflow-hidden select-none opacity-80 group-hover:scale-105 transition-transform duration-500 rounded-lg">
                        <div dangerouslySetInnerHTML={{__html: doc.content}} />
                      </div>
                    </div>
                    <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-50 relative">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-700 truncate pr-6 group-hover:text-pink-600 transition-colors text-sm">{doc.title}</h3>
                        <button onClick={(e) => handleDeleteDoc(doc.id, e)} className="text-gray-300 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 transition-all"><Trash2 size={14} /></button>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium mt-3">
                        <Clock size={10} /> {new Date(doc.lastModified).toLocaleDateString()}
                        <span className={`ml-auto px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${
                          doc.status === 'Final' ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>{doc.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden animate-fade-in relative ring-4 ring-pink-50/50">
      
      {/* Top Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('LIST')} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <input 
              value={editorTitle}
              onChange={(e) => setEditorTitle(e.target.value)}
              className="text-lg font-bold text-slate-800 border-none focus:outline-none focus:ring-0 p-0 bg-transparent placeholder-gray-300"
              placeholder="Untitled Document"
            />
            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
              {isSaving ? <span className="flex items-center gap-1 text-pink-500 animate-pulse"><Cloud size={10} /> Saving...</span> : 'Saved to Cloud'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="p-2 text-gray-400 hover:text-slate-700 hover:bg-gray-50 rounded-lg transition-colors"><Printer size={18} /></button>
          <button onClick={() => setShowShareModal(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-xs font-bold uppercase tracking-wide"><Share2 size={16} /> Share</button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-200 transition-all active:scale-95 text-xs font-bold uppercase tracking-wide shadow-md"><Save size={16} /> Save</button>
        </div>
      </div>

      {/* Toolbar - Sticky */}
      <div className="bg-white border-b border-gray-100 py-3 px-6 flex items-center gap-1 overflow-x-auto shrink-0 z-10 sticky top-0 no-scrollbar shadow-sm">
         <ToolbarBtn icon={Undo} action={() => execCmd('undo')} />
         <ToolbarBtn icon={Redo} action={() => execCmd('redo')} />
         <div className="w-px h-5 bg-gray-200 mx-3" />
         <ToolbarBtn icon={Bold} action={() => execCmd('bold')} />
         <ToolbarBtn icon={Italic} action={() => execCmd('italic')} />
         <ToolbarBtn icon={Underline} action={() => execCmd('underline')} />
         <div className="w-px h-5 bg-gray-200 mx-3" />
         <ToolbarBtn icon={AlignLeft} action={() => execCmd('justifyLeft')} />
         <ToolbarBtn icon={AlignCenter} action={() => execCmd('justifyCenter')} />
         <ToolbarBtn icon={AlignRight} action={() => execCmd('justifyRight')} />
         <div className="w-px h-5 bg-gray-200 mx-3" />
         <ToolbarBtn icon={List} action={() => execCmd('insertUnorderedList')} />
         <ToolbarBtn icon={ListOrdered} action={() => execCmd('insertOrderedList')} />
         <div className="w-px h-5 bg-gray-200 mx-3" />
         <ToolbarBtn icon={LinkIcon} action={insertLink} />
         <ToolbarBtn icon={ImageIcon} action={insertImage} />
         <div className="w-px h-5 bg-gray-200 mx-3" />
         <select onChange={(e) => execCmd('formatBlock', e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 focus:outline-none focus:border-pink-300 ml-2 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
           <option value="p">Normal</option>
           <option value="h1">Header 1</option>
           <option value="h2">Header 2</option>
           <option value="blockquote">Quote</option>
         </select>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 md:p-12 flex justify-center cursor-text" onClick={() => document.getElementById('doc-canvas')?.focus()}>
        <div 
          id="doc-canvas"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: editorContent }}
          className="bg-white w-full max-w-[850px] min-h-[900px] shadow-sm hover:shadow-md transition-shadow p-12 focus:outline-none text-slate-800 leading-relaxed font-serif prose prose-lg prose-pink max-w-none rounded-sm border border-gray-200"
        />
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowShareModal(false)}>
           <div className="bg-white rounded-3xl shadow-2xl w-[400px] p-8 transform scale-100 transition-all border border-white" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl text-slate-800">Invite Team</h3>
                 <button onClick={() => setShowShareModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
              </div>
              <div className="space-y-5">
                 <div className="flex gap-3">
                    <input type="email" placeholder="email@company.com" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-300 outline-none" />
                    <button className="bg-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-pink-600 transition-colors">Send</button>
                 </div>
                 <div className="pt-4 border-t border-gray-50">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Copy Link</label>
                    <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-100 group cursor-pointer hover:border-pink-200 transition-colors">
                       <span className="text-sm text-gray-500 truncate flex-1 font-mono">https://pm.app/d/x8s9d</span>
                       <button className="text-pink-600 hover:text-pink-700 text-xs font-bold uppercase bg-pink-50 px-2 py-1 rounded hover:bg-pink-100">Copy</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ToolbarBtn = ({ icon: Icon, action }: { icon: any, action: () => void }) => (
  <button onClick={action} className="p-2 text-gray-500 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all active:scale-95">
    <Icon size={18} />
  </button>
);