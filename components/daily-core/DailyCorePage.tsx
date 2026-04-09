import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useWorkspace } from '../../lib/workspace-context';
import type { WorkspaceInput } from '../../types/workspace';

type CoreRoute =
  | 'home'
  | 'intake'
  | 'library'
  | 'reader'
  | 'summary'
  | 'validation'
  | 'docs'
  | 'doc-detail'
  | 'slides'
  | 'slide-detail'
  | 'preview'
  | 'export'
  | 'history'
  | 'readiness'
  | 'ai';

interface DailyCorePageProps {
  route: CoreRoute;
  id?: string;
}

const nav = [
  ['Home', '/home'],
  ['Intake', '/intake'],
  ['Library', '/intake/library'],
  ['Reader', '/reader'],
  ['Summary', '/summary'],
  ['Docs', '/docs'],
  ['Slides', '/slides'],
  ['Preview', '/review/preview'],
  ['Export', '/review/export'],
  ['History', '/review/history'],
  ['AI', '/system/ai']
] as const;

function chipsForRuntime(state: string): string {
  if (state === 'ready') return 'bg-emerald-100 text-emerald-900';
  if (state === 'degraded') return 'bg-amber-100 text-amber-900';
  if (state === 'failed' || state === 'unavailable') return 'bg-rose-100 text-rose-900';
  return 'bg-slate-100 text-slate-900';
}

export function DailyCorePage({ route, id }: DailyCorePageProps): JSX.Element {
  const { state, dispatch } = useWorkspace();
  const [docTitle, setDocTitle] = useState('Untitled Working Doc');
  const [exportResult, setExportResult] = useState('');
  const [query, setQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredFiles = useMemo(() => (
    state.sourceFiles.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()))
  ), [query, state.sourceFiles]);

  const activeDoc = id ? state.smartDocs.find((doc) => doc.id === id) : state.smartDocs[0];
  const activeSlide = id ? state.smartSlides.find((slide) => slide.id === id) : state.smartSlides[0];

  const onUpload = async (event: any): Promise<void> => {
    const files = Array.from((event?.target?.files ?? []) as any[]);
    const payload: WorkspaceInput[] = await Promise.all(files.map(async (file) => ({
      name: file?.name ?? 'upload.bin',
      mimeType: file?.type || 'application/octet-stream',
      content: typeof file?.text === 'function' ? await file.text() : ''
    })));
    if (payload.length > 0) dispatch({ type: 'INGEST', payload });
    event.target.value = '';
  };

  const quickActions = (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <Link href="/intake" className="rounded-xl bg-slate-900 px-3 py-2 text-center text-white">Upload files</Link>
      <Link href="/summary" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center">Generate summary</Link>
      <Link href="/docs" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center">Continue docs</Link>
      <Link href="/review/readiness" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center">Readiness check</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <section>
        <div className="container mx-auto px-4 py-4">
          <header className="sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-base font-semibold text-slate-900">Wanmai Workspace Studio</h1>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${chipsForRuntime(state.runtime.state)}`}>
                Runtime: {state.runtime.state}
              </span>
            </div>
            <nav className="mt-3 flex gap-2 overflow-auto pb-1 text-sm">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                  {label}
                </Link>
              ))}
            </nav>
          </header>

          <div className="mt-3 space-y-3">
            {route === 'home' && (
              <>
                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Daily Core</p>
                  <h2 className="mt-1 text-xl font-semibold">What to do next</h2>
                  <p className="mt-2 text-sm text-slate-600">Upload files, validate extraction, summarize with trace, then ship docs or slides.</p>
                  <div className="mt-3">{quickActions}</div>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="font-semibold">Recent work</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    {state.jobs.slice(0, 4).map((job) => (
                      <li key={job.id} className="rounded-xl bg-slate-50 p-2">{job.label}: {job.value}</li>
                    ))}
                    {state.jobs.length === 0 && <li className="rounded-xl bg-slate-50 p-2">No recent jobs. Start by uploading sources.</li>}
                  </ul>
                </article>
              </>
            )}

            {route === 'intake' && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Intake</h2>
                <ol className="mt-2 flex gap-2 overflow-auto text-xs">
                  {['Upload', 'Classify', 'Parse', 'Validate'].map((step) => <li key={step} className="rounded-full bg-slate-100 px-3 py-1">{step}</li>)}
                </ol>
                <label className="mt-3 block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm">
                  Select files
                  <input className="mt-2 block w-full" type="file" multiple onChange={onUpload} />
                </label>
                <ul className="mt-3 space-y-2 text-sm">
                  {state.sourceFiles.map((file) => (
                    <li key={file.id} className="rounded-xl border border-slate-200 p-2">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-slate-600">Role: {file.role ?? file.fileRole ?? 'unknown'} · Parse: {file.status ?? file.parseStatus ?? 'queued'}</p>
                    </li>
                  ))}
                  {state.sourceFiles.length === 0 && <li className="rounded-xl border border-slate-200 p-2">No files yet. Upload to begin.</li>}
                </ul>
              </article>
            )}

            {route === 'library' && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Source Library</h2>
                <input value={query} onChange={(event: any) => setQuery(event.target.value)} placeholder="Search files" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <div className="mt-3 space-y-2">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="rounded-xl border border-slate-200 p-2">
                      <p className="font-medium text-sm">{file.name}</p>
                      <div className="mt-1 flex gap-2 text-xs">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5">{file.mimeType}</span>
                        <Link href="/reader" className="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-900">Open reader</Link>
                      </div>
                    </div>
                  ))}
                  {filteredFiles.length === 0 && <p className="rounded-xl border border-slate-200 p-2 text-sm">Nothing found. Try another query.</p>}
                </div>
              </article>
            )}

            {route === 'reader' && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Reader</h2>
                <div className="mt-2 flex gap-2 overflow-auto text-xs">
                  {['Source', 'Structure', 'Summary', 'Trace'].map((tab) => <span key={tab} className="rounded-full bg-slate-100 px-3 py-1">{tab}</span>)}
                </div>
                <div className="mt-3 max-h-80 overflow-auto rounded-xl bg-slate-50 p-3 text-sm">
                  {state.sourceFiles[0]?.rawContent || 'Raw source view is empty. Upload a file in Intake.'}
                </div>
                <p className="mt-2 text-xs text-slate-600">Facts and interpretation stay separated in Summary and Validation.</p>
              </article>
            )}

            {route === 'summary' && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Summary</h2>
                <div className="mt-3 space-y-2 text-sm">
                  {state.summaries.map((item) => <div key={item.id} className="rounded-xl bg-slate-50 p-2"><p className="font-medium">{item.label}</p><p>{item.value}</p></div>)}
                  {state.summaries.length === 0 && <div className="rounded-xl bg-slate-50 p-2">No summary yet. Ingest files first.</div>}
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs">Risks/Gaps: {state.validation.map((issue) => issue.message).join(' | ') || 'No unresolved gaps currently.'}</div>
                </div>
              </article>
            )}

            {(route === 'validation' || route === 'readiness') && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Validation & Readiness</h2>
                <p className="mt-2 text-sm">Verdict: {state.validation.some((issue) => issue.severity === 'error') ? 'Needs structural rewrite' : state.validation.length > 0 ? 'Needs minor polish' : 'Ready to share'}</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {state.validation.map((issue) => <li key={issue.code} className="rounded-xl border border-slate-200 p-2">{issue.message}</li>)}
                  {state.validation.length === 0 && <li className="rounded-xl border border-slate-200 p-2">No unresolved validation items.</li>}
                </ul>
              </article>
            )}

            {(route === 'docs' || route === 'doc-detail') && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Smart Docs</h2>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  <input value={docTitle} onChange={(event: any) => setDocTitle(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2" />
                  <button onClick={() => dispatch({ type: 'CREATE_DOC', title: docTitle, sourceId: state.sourceFiles[0]?.id })} className="rounded-xl bg-slate-900 px-3 py-2 text-white">Create from source</button>
                  {activeDoc && <button onClick={() => dispatch({ type: 'DUPLICATE_DOC', id: activeDoc.id })} className="rounded-xl border border-slate-200 px-3 py-2">Duplicate</button>}
                </div>
                {activeDoc && (
                  <textarea value={activeDoc.value} onChange={(event: any) => dispatch({ type: 'UPDATE_DOC', id: activeDoc.id, value: event.target.value })} className="mt-3 min-h-64 w-full rounded-xl border border-slate-200 p-3 text-sm" />
                )}
                {!activeDoc && <p className="mt-3 rounded-xl bg-slate-50 p-2 text-sm">No document yet.</p>}
              </article>
            )}

            {(route === 'slides' || route === 'slide-detail') && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Smart Slides</h2>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => dispatch({ type: 'ADD_SLIDE' })} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">Add slide</button>
                  <button
                    onClick={() => dispatch({ type: 'REORDER_SLIDES', ids: [...state.smartSlides].reverse().map((slide) => slide.id) })}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  >Reverse order</button>
                </div>
                <div className="mt-3 space-y-2">
                  {state.smartSlides.map((slide) => (
                    <div key={slide.id} className="rounded-xl border border-slate-200 p-2">
                      <input
                        value={slide.value?.title ?? slide.label}
                        onChange={(event: any) => dispatch({ type: 'UPDATE_SLIDE', id: slide.id, title: event.target.value, bullets: slide.value?.bullets ?? [] })}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
                      />
                      <p className="mt-1 text-xs text-slate-600">{(slide.value?.bullets ?? []).join(' • ')}</p>
                    </div>
                  ))}
                </div>
                {activeSlide && <p className="mt-3 text-xs text-slate-600">Speaker notes: {activeSlide.value?.bullets?.[0] ?? 'Add key note here.'}</p>}
              </article>
            )}

            {route === 'preview' && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Preview</h2>
                <div className="mt-3 grid gap-3">
                  <div className="rounded-xl border border-slate-200 p-2">
                    <p className="text-xs text-slate-500">Document preview</p>
                    <p className="text-sm">{state.smartDocs[0]?.value.slice(0, 250) || 'No document yet.'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-2">
                    <p className="text-xs text-slate-500">Slide preview</p>
                    <p className="text-sm">{state.smartSlides[0]?.value?.title || 'No slides yet.'}</p>
                  </div>
                </div>
              </article>
            )}

            {route === 'export' && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Export</h2>
                <ol className="mt-2 flex gap-2 overflow-auto text-xs">
                  {['Prepare', 'Package', 'Verify', 'Deliver'].map((step) => <li key={step} className="rounded-full bg-slate-100 px-3 py-1">{step}</li>)}
                </ol>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { dispatch({ type: 'EXPORT', mode: 'document' }); setExportResult('Document export queued.'); }} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">Export docs</button>
                  <button onClick={() => { dispatch({ type: 'EXPORT', mode: 'slides' }); setExportResult('Slide export queued.'); }} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">Export slides</button>
                </div>
                <p className="mt-2 text-sm">{exportResult || 'No export started.'}</p>
              </article>
            )}

            {route === 'history' && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">History / Restore</h2>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => dispatch({ type: 'SNAPSHOT', label: 'Manual safety snapshot' })} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">Save snapshot</button>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {state.history.map((snapshot) => (
                    <li key={snapshot.id} className="rounded-xl border border-slate-200 p-2">
                      <p>{snapshot.label}</p>
                      <button onClick={() => dispatch({ type: 'RESTORE', id: snapshot.id })} className="mt-1 rounded-lg bg-amber-100 px-2 py-1 text-xs">Restore (safe)</button>
                    </li>
                  ))}
                  {state.history.length === 0 && <li className="rounded-xl border border-slate-200 p-2">No snapshots yet.</li>}
                </ul>
              </article>
            )}

            {route === 'ai' && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">AI Runtime</h2>
                <p className="mt-2 text-sm">Provider: {state.runtime.provider} · State: {state.runtime.state}</p>
                <p className="mt-1 text-xs text-slate-600">{state.runtime.degradedNotice}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <button onClick={() => dispatch({ type: 'SET_RUNTIME', state: 'starting' })} className="rounded-xl border border-slate-200 px-3 py-2">Retry runtime</button>
                  <button onClick={() => dispatch({ type: 'SET_RUNTIME', state: 'ready', provider: 'hybrid', notice: 'Gemini + Ollama operational.' })} className="rounded-xl border border-slate-200 px-3 py-2">Switch to hybrid</button>
                  <button onClick={() => dispatch({ type: 'SET_RUNTIME', state: 'degraded', provider: 'manual', notice: 'Manual mode active.' })} className="rounded-xl border border-slate-200 px-3 py-2">Degraded/manual</button>
                </div>
              </article>
            )}
          </div>

          <button onClick={() => setSheetOpen((v) => !v)} className="fixed bottom-20 right-4 rounded-full bg-slate-900 px-4 py-2 text-sm text-white md:hidden">
            {sheetOpen ? 'Hide details' : 'Details'}
          </button>
          {sheetOpen && (
            <aside className="fixed inset-x-2 bottom-2 z-30 rounded-2xl border border-slate-300 bg-white p-3 shadow-lg md:hidden">
              <p className="text-xs uppercase tracking-wide text-slate-500">Inspector</p>
              <p className="mt-1 text-sm">Files: {state.sourceFiles.length} · Docs: {state.smartDocs.length} · Slides: {state.smartSlides.length}</p>
              <p className="mt-1 text-xs text-slate-600">Autosave status: visible (drafts update live in workspace state).</p>
            </aside>
          )}

          <footer className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-3">
            <div className="mx-auto flex max-w-xl items-center justify-between gap-2 text-sm">
              <span>Save status: Live draft</span>
              <div className="flex gap-2">
                <button onClick={() => dispatch({ type: 'SNAPSHOT', label: 'Sticky action snapshot' })} className="rounded-lg border border-slate-200 px-3 py-1.5">Snapshot</button>
                <Link href="/review/export" className="rounded-lg bg-slate-900 px-3 py-1.5 text-white">Export</Link>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
