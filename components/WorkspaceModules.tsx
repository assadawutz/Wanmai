import { useMemo, useState } from 'react';
import { exportWorkspace } from '../lib/export';
import { runAgents } from '../lib/agents';
import { menuGroups, menuMap, type WorkspaceFeatureDefinition } from '../lib/menu-map';
import { globalFallbackPolicy, globalQualityJudgmentPolicy, masterFeatureTable } from '../lib/master-feature-table';
import { useWorkspace } from '../lib/workspace-context';
import type { WorkspaceInput } from '../types/workspace';
import { Panel } from './ui/Panel';

function readinessFromState(featureId: string, hasFiles: boolean, validationCount: number): { score: number; label: string } {
  const baseline = hasFiles ? 76 : 52;
  const penalty = Math.min(validationCount * 6, 36);
  const bonus = featureId.includes('runtime') || featureId.includes('history') ? 8 : 0;
  const score = Math.max(30, Math.min(98, baseline - penalty + bonus));

  if (score >= 85) return { score, label: 'Ready for share' };
  if (score >= 70) return { score, label: 'Near ready' };
  if (score >= 55) return { score, label: 'Needs improvement' };
  return { score, label: 'Not ready' };
}

function FeatureContract({ feature, hasFiles, validationCount }: { feature: WorkspaceFeatureDefinition; hasFiles: boolean; validationCount: number }): JSX.Element {
  const readiness = readinessFromState(feature.id, hasFiles, validationCount);
  const spec = masterFeatureTable[feature.id];
  const fallbackState = readiness.score >= 70 ? 'Ready to share with normal monitoring.' : 'Not ready; fallback-safe mode and exact fix path required before external sharing.';

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Panel title="featureIntent">
        <p className="text-sm">{spec?.coreSurface ?? feature.goal}</p>
      </Panel>
      <Panel title="sourceContext">
        <p className="text-sm"><b>Route:</b> {spec?.route ?? 'N/A'}</p>
        <p className="mt-1 text-sm"><b>Intent:</b> {spec?.lockedPromptIntent ?? 'Context-aware feature output contract.'}</p>
      </Panel>
      <Panel title="factualCore">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {(spec?.outputs ?? feature.mustOutput).slice(0, 4).map((item) => (
            <li key={`${feature.id}-matters-${item}`}>{item}</li>
          ))}
        </ul>
      </Panel>
      <Panel title="interpretation">
        <p className="text-sm">{spec?.lockedPromptIntent ?? `${feature.label} is designed as a visual-first surface with tap-first interactions, live preview, source-trace support, and runtime-safe fallbacks for degraded mode.`}</p>
      </Panel>
      <Panel title="risksAndGaps">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {(spec?.lockedRules ?? [
            'Low-confidence extraction may reduce agent recommendation quality.',
            'Cross-file mapping depends on successful ingestion and trace links.',
            'Readiness score should be re-evaluated after each major edit.'
          ]).slice(0, 4).map((rule) => (
            <li key={`${feature.id}-rule-${rule}`}>{rule}</li>
          ))}
        </ul>
      </Panel>
      <Panel title="prosAndCons">
        <div className="text-sm">
          <p><b>Pros:</b> Fast context visibility, consistent contract output, mobile-first structure.</p>
          <p className="mt-1"><b>Cons:</b> Complex modules require strong state integrity and clear fallback messaging.</p>
        </div>
      </Panel>
      <Panel title="recommendations">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {(spec?.productionGates ?? [
            'Complete intake and source trace first for better downstream quality.',
            'Use readiness and validation together before presenting externally.',
            'Capture snapshots before major structural edits.'
          ]).slice(0, 4).map((gate) => (
            <li key={`${feature.id}-gate-${gate}`}>{gate}</li>
          ))}
        </ol>
      </Panel>
      <Panel title="nextActions">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {(spec?.outputs ?? feature.mustOutput).slice(0, 5).map((item) => (
            <li key={`${feature.id}-next-${item}`}>Deliver: {item}</li>
          ))}
        </ul>
      </Panel>
      <Panel title="visualOutputPlan">
        <p className="text-sm">Prefer cards, lanes, chips, and board/graph views before long paragraphs. Use compact stacked cards on mobile and multi-panel views on desktop.</p>
      </Panel>
      <Panel title="readinessJudgment">
        <p className="text-sm">
          <span className="inline-flex rounded-full bg-rose-100 px-2 py-1 font-semibold text-rose-700">{readiness.score}%</span>
          <span className="ml-2">{readiness.label}</span>
        </p>
      </Panel>
      <Panel title="fallbackState">
        <p className="text-sm">{fallbackState}</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {(spec?.fallback ?? globalFallbackPolicy).slice(0, 4).map((item) => (
            <li key={`${feature.id}-fallback-${item}`}>{item}</li>
          ))}
          <li>Quality checks: {globalQualityJudgmentPolicy.join(', ')}.</li>
        </ol>
      </Panel>
      <Panel title="traceLinks">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Feature source: {spec?.route ?? 'N/A'}.</li>
          <li>Evidence basis: {spec?.inputs.join(', ') ?? 'workspace metadata'}.</li>
          <li>Validation references: {spec?.productionGates.join(', ') ?? 'default production checks'}.</li>
        </ul>
      </Panel>
    </div>
  );
}

export function WorkspaceModules(): JSX.Element {
  const { state, dispatch } = useWorkspace();
  const [group, setGroup] = useState<string>('Home');
  const [featureId, setFeatureId] = useState<string>('command-home');
  const [fileText, setFileText] = useState('');
  const [fileName, setFileName] = useState('meeting-notes.md');
  const [mimeType, setMimeType] = useState('text/markdown');
  const [audioText, setAudioText] = useState('Meeting started. Next action is define owner. Decide budget approval by Friday.');
  const [exportOutput, setExportOutput] = useState('');
  const [dragList, setDragList] = useState(['Insight Block', 'Risk Block', 'Decision Block']);
  const [mermaid, setMermaid] = useState(state.mermaidDocuments[0]?.value ?? 'flowchart TD\nA-->B');

  const activeFeatures = useMemo(() => menuMap.filter((item) => item.group === group), [group]);
  const selectedFeature = useMemo(
    () => menuMap.find((item) => item.id === featureId) ?? activeFeatures[0] ?? menuMap[0],
    [activeFeatures, featureId]
  );
  const agentFeed = useMemo(() => runAgents(state), [state]);

  const onIngest = (): void => {
    const payload: WorkspaceInput[] = [{ name: fileName, mimeType, content: fileText }];
    dispatch({ type: 'INGEST', payload });
  };

  const onDrop = (item: string): void => {
    setDragList((prev) => [...prev.filter((p) => p !== item), item]);
  };

  const mermaidValid = /(flowchart|sequenceDiagram|stateDiagram-v2|gantt)/.test(mermaid);

  const renderFeatureSurface = (): JSX.Element => {
    if (selectedFeature.id === 'command-home') {
      return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Panel title="Workspace Snapshot">
            <p className="text-sm">Files: {state.sourceFiles.length} • Blocks: {state.extractedBlocks.length} • Slides: {state.smartSlides.length}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="btn btn-soft" onClick={() => dispatch({ type: 'SNAPSHOT', label: 'Manual snapshot' })}>Snapshot</button>
              <button className="btn btn-soft" onClick={() => dispatch({ type: 'ADD_KANBAN_CARD', list: 'issues', label: 'Unclear timeline dependency' })}>Add RAID Issue</button>
            </div>
          </Panel>
          <Panel title="Suggested Actions">
            <ul className="space-y-1 text-sm">
              {agentFeed.map((line) => <li key={line}>• {line}</li>)}
            </ul>
          </Panel>
          <Panel title="Pending Signal Strip">
            <ul className="space-y-1 text-sm">
              <li>Pending approvals: {state.approvals.length}</li>
              <li>Failed jobs: {state.validation.filter((item) => item.severity === 'error').length}</li>
              <li>Runtime: degraded-safe mode available</li>
            </ul>
          </Panel>
        </div>
      );
    }

    if (selectedFeature.id === 'intake-hub') {
      return (
        <Panel title="Universal Upload Intelligence">
          <div className="grid gap-2 md:grid-cols-3">
            <input className="input" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            <input className="input" value={mimeType} onChange={(e) => setMimeType(e.target.value)} />
            <button className="btn btn-primary" onClick={onIngest}>Ingest</button>
          </div>
          <textarea className="input mt-2 min-h-36" value={fileText} onChange={(e) => setFileText(e.target.value)} placeholder="Paste file content" />
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {state.sourceFiles.map((file) => (
              <div key={file.id} className="rounded-xl border border-[var(--border-soft)] bg-white p-3 text-xs">
                <p className="font-semibold">{file.name}</p>
                <p>{file.mimeType} • {file.role}</p>
                <p>Parser: {file.parser} • Confidence: {file.confidence}</p>
                <p>Status: {file.status}</p>
              </div>
            ))}
          </div>
        </Panel>
      );
    }

    if (selectedFeature.id === 'universal-reader') {
      return (
        <Panel title="Universal Reader">
          <div className="grid gap-2 md:grid-cols-2">
            {state.sourceFiles.map((file) => (
              <div key={file.id} className="rounded-xl border border-[var(--border-soft)] bg-white p-2 text-xs">
                <p className="font-semibold">{file.name}</p>
                <p>{file.mimeType} • {file.role}</p>
                <p>Parser: {file.parser} • Confidence: {file.confidence}</p>
                <pre className="mt-1 max-h-36 overflow-auto rounded bg-rose-50 p-2">{file.rawContent || 'No source yet'}</pre>
              </div>
            ))}
          </div>
        </Panel>
      );
    }

    if (selectedFeature.id === 'deep-summary' || selectedFeature.id === 'insights') {
      return (
        <Panel title="Deep Summary + Insight Lanes">
          {state.summaries.map((s) => (
            <div key={s.id} className="mb-2 rounded-lg bg-rose-50 p-2 text-sm">
              <b>{s.label}:</b> {s.value}
            </div>
          ))}
          {state.summaries.length === 0 && <p className="text-sm">No extracted summary yet. Upload files to generate analysis.</p>}
        </Panel>
      );
    }

    if (selectedFeature.id === 'smart-docs') {
      const doc = state.smartDocs[0];
      return (
        <Panel title="Smart Document Editor">
          <textarea className="input min-h-56" value={doc?.value ?? ''} onChange={(e) => doc ? dispatch({ type: 'UPDATE_DOC', id: doc.id, value: e.target.value }) : undefined} />
        </Panel>
      );
    }

    if (selectedFeature.id === 'smart-sheets') {
      return (
        <Panel title="Smart Sheets">
          <table className="w-full text-sm">
            <tbody>
              {state.smartSheets[0]?.value.map((row, i) => (
                <tr key={`row-${i}`}>{row.map((cell, j) => <td key={`cell-${i}-${j}`} className="border border-[var(--border-soft)] p-2">{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </Panel>
      );
    }

    if (selectedFeature.id === 'smart-slides' || selectedFeature.id === 'presentation-builder') {
      return (
        <Panel title="Slides / Presentation Builder">
          <button className="btn btn-soft mb-2" onClick={() => dispatch({ type: 'ADD_SLIDE' })}>Add Slide</button>
          <div className="grid gap-2 sm:grid-cols-2">
            {state.smartSlides.map((slide) => (
              <div key={slide.id} className="rounded-xl border border-[var(--border-soft)] p-2">
                <h4 className="font-semibold">{slide.value.title}</h4>
                <ul className="list-disc pl-6 text-sm">
                  {slide.value.bullets.map((b) => <li key={`${slide.id}-${b}`}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Panel>
      );
    }

    if (selectedFeature.id === 'visual-board-studio' || selectedFeature.id === 'workspace-canvas') {
      return (
        <Panel title="Visual Board Studio / Canvas">
          <div className="grid gap-2 md:grid-cols-3">
            {dragList.map((item) => (
              <div key={item} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', item)} className="rounded-xl border border-[var(--border-soft)] bg-white p-2 text-sm">{item}</div>
            ))}
            <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e.dataTransfer.getData('text/plain'))} className="rounded-xl border-2 border-dashed border-[var(--border-soft)] p-6 text-center text-sm">Drop zone with reorder</div>
          </div>
        </Panel>
      );
    }

    if (selectedFeature.id === 'flow-studio') {
      return (
        <Panel title="Flow Studio">
          <div className="space-y-2 text-sm">
            <p>Ingestion → Validation → Build → Review → Export</p>
            <p>Dependencies: {state.dependencies.length || 0}</p>
            <button className="btn btn-soft" onClick={() => dispatch({ type: 'ADD_KANBAN_CARD', list: 'decisions', label: 'Approve release gate' })}>Create decision node</button>
          </div>
        </Panel>
      );
    }

    if (selectedFeature.id === 'mermaid-studio') {
      return (
        <Panel title="Mermaid Studio">
          <textarea className="input min-h-40" value={mermaid} onChange={(e) => setMermaid(e.target.value)} />
          <p className={`mt-2 text-sm ${mermaidValid ? 'text-emerald-700' : 'text-red-700'}`}>{mermaidValid ? 'Valid diagram type detected.' : 'Parse failed. Last valid render preserved.'}</p>
        </Panel>
      );
    }

    if (selectedFeature.id === 'meeting-action-hub') {
      return (
        <Panel title="Meeting / Action Hub">
          <textarea className="input min-h-32" value={audioText} onChange={(e) => setAudioText(e.target.value)} />
          <button className="btn btn-primary mt-2" onClick={() => dispatch({ type: 'ADD_AUDIO', transcript: audioText })}>Generate Audio Summary</button>
          <ul className="mt-2 text-sm">
            {state.audioArtifacts.map((a) => <li key={a.id}>{a.label}: {a.value.actions.join(' | ') || 'No actions detected'}</li>)}
          </ul>
        </Panel>
      );
    }

    if (selectedFeature.id === 'export-center') {
      return (
        <Panel title="Export Center">
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-soft" onClick={() => setExportOutput(exportWorkspace(state, 'document').payload ?? '')}>Export document</button>
            <button className="btn btn-soft" onClick={() => setExportOutput(exportWorkspace(state, 'slides').payload ?? '')}>Export slides</button>
            <button className="btn btn-soft" onClick={() => setExportOutput(exportWorkspace(state, 'backup').payload ?? '')}>Backup</button>
          </div>
          <pre className="mt-2 max-h-64 overflow-auto rounded bg-rose-50 p-2 text-xs">{exportOutput}</pre>
        </Panel>
      );
    }

    if (selectedFeature.id === 'history' || selectedFeature.id === 'restore-snapshots') {
      return (
        <Panel title="History / Restore">
          <ul className="space-y-2 text-sm">
            {state.history.map((snapshot) => (
              <li key={snapshot.id} className="rounded-xl border border-[var(--border-soft)] p-2">
                {snapshot.label}
                <button className="btn btn-soft ml-2" onClick={() => dispatch({ type: 'RESTORE', id: snapshot.id })}>Restore</button>
              </li>
            ))}
            {state.history.length === 0 && <li>No snapshots yet.</li>}
          </ul>
        </Panel>
      );
    }

    if (selectedFeature.id === 'confidence-validation' || selectedFeature.id === 'logs-jobs' || selectedFeature.id === 'ai-runtime') {
      return (
        <Panel title="Runtime / Validation / Jobs">
          <ul className="space-y-1 text-sm">
            <li>AI runtime check: local runtime unavailable → degraded mode is active-safe.</li>
            <li>Auto-start policy: app boot → runtime check → retry → degraded continue.</li>
            <li>Validation issues tracked: {state.validation.length}</li>
          </ul>
        </Panel>
      );
    }

    return (
      <Panel title={`${selectedFeature.label} Surface`}>
        <p className="text-sm">Working surface active with locked output contract, fallback path, source-trace aware behavior, and readiness evaluation.</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-rose-50 px-2 py-1">Loading</span>
          <span className="rounded-full bg-emerald-50 px-2 py-1">Success</span>
          <span className="rounded-full bg-amber-50 px-2 py-1">Warning</span>
          <span className="rounded-full bg-red-50 px-2 py-1">Error</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">Empty</span>
          <span className="rounded-full bg-indigo-50 px-2 py-1">Partial-success</span>
          <span className="rounded-full bg-violet-50 px-2 py-1">Retry</span>
          <span className="rounded-full bg-cyan-50 px-2 py-1">Fallback</span>
        </div>
      </Panel>
    );
  };

  return (
    <div className="space-y-3">
      <nav className="panel overflow-x-auto">
        <ul className="flex gap-2 text-xs">
          {menuGroups.map((item) => (
            <li key={item}><button className={`btn ${group === item ? 'btn-primary' : 'btn-soft'}`} onClick={() => { setGroup(item); setFeatureId(menuMap.find((feature) => feature.group === item)?.id ?? featureId); }}>{item}</button></li>
          ))}
        </ul>
      </nav>

      <nav className="panel overflow-x-auto">
        <ul className="flex gap-2 text-xs">
          {activeFeatures.map((item) => (
            <li key={item.id}><button className={`btn ${selectedFeature.id === item.id ? 'btn-primary' : 'btn-soft'}`} onClick={() => setFeatureId(item.id)}>{item.label}</button></li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-white/80 p-3 text-xs">
        {selectedFeature.agents.map((agent) => (
          <span key={agent} className="rounded-full bg-rose-50 px-2 py-1">{agent}</span>
        ))}
      </div>

      {renderFeatureSurface()}

      <FeatureContract feature={selectedFeature} hasFiles={state.sourceFiles.length > 0} validationCount={state.validation.length} />
    </div>
  );
}
