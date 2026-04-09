import { useMemo, useState } from 'react';
import { exportWorkspace } from '../lib/export';
import { runAgents } from '../lib/agents';
import { useWorkspace } from '../lib/workspace-context';
import type { WorkspaceInput } from '../types/workspace';
import { Panel } from './ui/Panel';

const TABS = ['Dashboard', 'Intake Hub', 'Reader', 'Summary', 'Smart Docs', 'Smart Sheets', 'Smart Slides', 'Canvas', 'Flow', 'Mermaid', 'Audio', 'Validation', 'History', 'Export'];

export function WorkspaceModules(): JSX.Element {
  const { state, dispatch } = useWorkspace();
  const [tab, setTab] = useState<string>('Dashboard');
  const [fileText, setFileText] = useState('');
  const [fileName, setFileName] = useState('meeting-notes.md');
  const [mimeType, setMimeType] = useState('text/markdown');
  const [audioText, setAudioText] = useState('Meeting started. Next action is define owner. Decide budget approval by Friday.');
  const [exportOutput, setExportOutput] = useState('');
  const [dragList, setDragList] = useState(['Insight Block', 'Risk Block', 'Decision Block']);
  const [mermaid, setMermaid] = useState(state.mermaidDocuments[0]?.value ?? 'flowchart TD\nA-->B');

  const agentFeed = useMemo(() => runAgents(state), [state]);

  const onIngest = (): void => {
    const payload: WorkspaceInput[] = [{ name: fileName, mimeType, content: fileText }];
    dispatch({ type: 'INGEST', payload });
  };

  const onDrop = (item: string): void => {
    setDragList((prev) => [...prev.filter((p) => p !== item), item]);
  };

  const mermaidValid = /(flowchart|sequenceDiagram|stateDiagram-v2|gantt)/.test(mermaid);

  return (
    <div className="space-y-3">
      <nav className="panel overflow-x-auto">
        <ul className="flex gap-2 text-xs">
          {TABS.map((item) => (
            <li key={item}><button className={`btn ${tab === item ? 'btn-primary' : 'btn-soft'}`} onClick={() => setTab(item)}>{item}</button></li>
          ))}
        </ul>
      </nav>
      {tab === 'Dashboard' && (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="Command Center">
            <p className="text-sm">Files: {state.sourceFiles.length} • Blocks: {state.extractedBlocks.length} • Slides: {state.smartSlides.length}</p>
            <div className="mt-2 flex gap-2"><button className="btn btn-soft" onClick={() => dispatch({ type: 'SNAPSHOT', label: 'Manual snapshot' })}>Snapshot</button><button className="btn btn-soft" onClick={() => dispatch({ type: 'ADD_KANBAN_CARD', list: 'issues', label: 'Unclear timeline dependency' })}>Add RAID Issue</button></div>
          </Panel>
          <Panel title="Agent Action Center"><ul className="space-y-1 text-sm">{agentFeed.map((line) => <li key={line}>• {line}</li>)}</ul></Panel>
        </div>
      )}
      {tab === 'Intake Hub' && <Panel title="Universal Upload Intelligence"><div className="grid gap-2 md:grid-cols-3"><input className="input" value={fileName} onChange={(e) => setFileName(e.target.value)} /><input className="input" value={mimeType} onChange={(e) => setMimeType(e.target.value)} /><button className="btn btn-primary" onClick={onIngest}>Ingest</button></div><textarea className="input mt-2 min-h-36" value={fileText} onChange={(e) => setFileText(e.target.value)} placeholder="Paste file content" /></Panel>}
      {tab === 'Reader' && <Panel title="Universal Reader"><div className="grid gap-2 md:grid-cols-2">{state.sourceFiles.map((file) => <div key={file.id} className="rounded-xl border p-2 text-xs"><p className="font-semibold">{file.name}</p><p>{file.mimeType} • {file.role}</p><p>Parser: {file.parser} • Confidence: {file.confidence}</p><pre className="mt-1 max-h-32 overflow-auto rounded bg-rose-50 p-2">{file.rawContent}</pre></div>)}</div></Panel>}
      {tab === 'Summary' && <Panel title="Multi-dimensional Summary">{state.summaries.map((s) => <div key={s.id} className="mb-2 rounded-lg bg-rose-50 p-2 text-sm"><b>{s.label}:</b> {s.value}</div>)}</Panel>}
      {tab === 'Smart Docs' && <Panel title="Smart Document Editor"><textarea className="input min-h-56" value={state.smartDocs[0]?.value ?? ''} onChange={(e) => dispatch({ type: 'UPDATE_DOC', id: state.smartDocs[0].id, value: e.target.value })} /></Panel>}
      {tab === 'Smart Sheets' && <Panel title="Smart Sheets"><table className="w-full text-sm"><tbody>{state.smartSheets[0]?.value.map((row, i) => <tr key={`row-${i}`}>{row.map((cell, j) => <td key={`cell-${i}-${j}`} className="border p-2">{cell}</td>)}</tr>)}</tbody></table></Panel>}
      {tab === 'Smart Slides' && <Panel title="Smart Slides"><button className="btn btn-soft mb-2" onClick={() => dispatch({ type: 'ADD_SLIDE' })}>Add Slide</button><div className="grid gap-2 sm:grid-cols-2">{state.smartSlides.map((slide) => <div key={slide.id} className="rounded-xl border p-2"><h4 className="font-semibold">{slide.value.title}</h4><ul className="list-disc pl-6 text-sm">{slide.value.bullets.map((b) => <li key={`${slide.id}-${b}`}>{b}</li>)}</ul></div>)}</div></Panel>}
      {tab === 'Canvas' && <Panel title="Drag-and-Drop Visual Builder"><div className="grid gap-2 md:grid-cols-3">{dragList.map((item) => <div key={item} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', item)} className="rounded-xl border bg-white p-2 text-sm">{item}</div>)}<div onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e.dataTransfer.getData('text/plain'))} className="rounded-xl border-2 border-dashed p-6 text-center text-sm">Drop zone with reorder</div></div></Panel>}
      {tab === 'Flow' && <Panel title="Flow / Pipeline Studio"><div className="space-y-2 text-sm"><p>Ingestion → Validation → Build → Review → Export</p><p>Dependencies: {state.dependencies.length || 0}</p><button className="btn btn-soft" onClick={() => dispatch({ type: 'ADD_KANBAN_CARD', list: 'decisions', label: 'Approve release gate' })}>Create decision node</button></div></Panel>}
      {tab === 'Mermaid' && <Panel title="Mermaid Studio"><textarea className="input min-h-40" value={mermaid} onChange={(e) => setMermaid(e.target.value)} /><p className={`mt-2 text-sm ${mermaidValid ? 'text-emerald-700' : 'text-red-700'}`}>{mermaidValid ? 'Valid diagram type detected.' : 'Parse failed. Last valid render preserved.'}</p></Panel>}
      {tab === 'Audio' && <Panel title="Audio Summary Studio"><textarea className="input min-h-32" value={audioText} onChange={(e) => setAudioText(e.target.value)} /><button className="btn btn-primary mt-2" onClick={() => dispatch({ type: 'ADD_AUDIO', transcript: audioText })}>Generate Audio Summary</button><ul className="mt-2 text-sm">{state.audioArtifacts.map((a) => <li key={a.id}>{a.label}: {a.value.actions.join(' | ') || 'No actions detected'}</li>)}</ul></Panel>}
      {tab === 'Validation' && <Panel title="Validation Center"><ul className="text-sm">{state.validation.map((issue) => <li key={issue.code + issue.affectedSection}>[{issue.severity}] {issue.message}</li>)}</ul></Panel>}
      {tab === 'History' && <Panel title="History / Restore"><ul className="space-y-2 text-sm">{state.history.map((snapshot) => <li key={snapshot.id} className="rounded-xl border p-2">{snapshot.label}<button className="btn btn-soft ml-2" onClick={() => dispatch({ type: 'RESTORE', id: snapshot.id })}>Restore</button></li>)}</ul></Panel>}
      {tab === 'Export' && <Panel title="Export Center"><div className="flex gap-2"><button className="btn btn-soft" onClick={() => setExportOutput(exportWorkspace(state, 'document').payload ?? '')}>Export document</button><button className="btn btn-soft" onClick={() => setExportOutput(exportWorkspace(state, 'slides').payload ?? '')}>Export slides</button><button className="btn btn-soft" onClick={() => setExportOutput(exportWorkspace(state, 'backup').payload ?? '')}>Backup</button></div><pre className="mt-2 max-h-64 overflow-auto rounded bg-rose-50 p-2 text-xs">{exportOutput}</pre></Panel>}
    </div>
  );
}
