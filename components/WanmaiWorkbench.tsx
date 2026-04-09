import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useWorkspace } from '../lib/workspace-context';

type WanmaiRoute =
  | 'home'
  | 'intake'
  | 'understand'
  | 'build/docs'
  | 'build/slides'
  | 'build/board'
  | 'build/canvas'
  | 'build/storyboard'
  | 'build/presentation'
  | 'review/preview'
  | 'review/export'
  | 'review/history'
  | 'system/runtime'
  | 'roles/proposal';

function detectRoute(slug: string[]): WanmaiRoute {
  const path = slug.join('/');
  if (path.startsWith('intake')) return 'intake';
  if (path.startsWith('understand')) return 'understand';
  if (path.startsWith('build/docs')) return 'build/docs';
  if (path.startsWith('build/slides')) return 'build/slides';
  if (path.startsWith('build/board')) return 'build/board';
  if (path.startsWith('build/canvas')) return 'build/canvas';
  if (path.startsWith('build/storyboard')) return 'build/storyboard';
  if (path.startsWith('build/presentation')) return 'build/presentation';
  if (path.startsWith('review/preview')) return 'review/preview';
  if (path.startsWith('review/export')) return 'review/export';
  if (path.startsWith('review/history')) return 'review/history';
  if (path.startsWith('system/runtime')) return 'system/runtime';
  if (path.startsWith('roles/proposal')) return 'roles/proposal';
  return 'home';
}

function MobileRail({ workspaceId }: { workspaceId: string }): JSX.Element {
  const items = [
    ['Home', `/app/${workspaceId}/wanmai/home`],
    ['Intake', `/app/${workspaceId}/wanmai/intake`],
    ['Understand', `/app/${workspaceId}/wanmai/understand/summary`],
    ['Build', `/app/${workspaceId}/wanmai/build/slides`],
    ['Review', `/app/${workspaceId}/wanmai/review/preview`]
  ];

  return (
    <nav className="fixed inset-x-2 bottom-2 z-40 grid grid-cols-5 gap-2 rounded-2xl border border-[var(--border-soft)] bg-white/95 p-2 shadow-lg lg:hidden">
      {items.map(([label, href]) => (
        <Link key={href} href={href} className="rounded-xl bg-rose-50 px-2 py-2 text-center text-xs font-semibold text-rose-700 active:scale-[0.98]">
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function WanmaiWorkbench({ workspaceId, slug }: { workspaceId: string; slug: string[] }): JSX.Element {
  const route = detectRoute(slug);
  const { state, dispatch } = useWorkspace();
  const [intakeText, setIntakeText] = useState('Paste source notes here.');
  const [slideDrafts, setSlideDrafts] = useState(state.smartSlides.map((slide) => slide.value.title));
  const [boardCards, setBoardCards] = useState(['Insight', 'Risk', 'Decision', 'Next Step']);
  const [storyScenes, setStoryScenes] = useState(['Context', 'Problem', 'Options', 'Recommendation']);

  const recentArtifacts = useMemo(
    () => [
      state.smartDocs[0]?.label,
      state.smartSlides[0]?.label,
      state.mermaidDocuments[0]?.label
    ].filter(Boolean) as string[],
    [state.smartDocs, state.smartSlides, state.mermaidDocuments]
  );

  const reorder = (items: string[], from: number, to: number): string[] => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  };

  const intakeSurface = (
    <div className="panel">
      <h2 className="text-lg font-semibold text-[var(--text-heading)]">Intake</h2>
      <p className="mt-1 text-sm">Upload source or paste text, then continue directly to Understand.</p>
      <textarea className="input mt-3 min-h-36" value={intakeText} onChange={(event: any) => setIntakeText(event.target.value)} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="btn btn-primary"
          onClick={() =>
            dispatch({ type: 'INGEST', payload: [{ name: 'quick-intake.md', mimeType: 'text/markdown', content: intakeText }] })
          }
        >
          Upload source
        </button>
        <Link href={`/app/${workspaceId}/wanmai/understand/summary`} className="btn btn-soft">
          Continue to summary
        </Link>
      </div>
    </div>
  );

  const buildSurface = (
    <div className="space-y-3">
      <div className="panel">
        <h2 className="text-lg font-semibold text-[var(--text-heading)]">Smart Slides · drag reorder</h2>
        <div className="mt-3 grid gap-2">
          {slideDrafts.map((title, index) => (
            <div
              key={`${title}-${index}`}
              draggable
              onDragStart={(event: any) => event.dataTransfer.setData('text/plain', String(index))}
              onDragOver={(event: any) => event.preventDefault()}
              onDrop={(event: any) => {
                const from = Number(event.dataTransfer.getData('text/plain'));
                setSlideDrafts((prev) => reorder(prev, from, index));
              }}
              className="rounded-2xl border border-[var(--border-soft)] bg-white p-3 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-[var(--text-heading)]">{index + 1}. {title}</span>
                <span className="rounded-full bg-rose-50 px-2 py-1 text-xs text-rose-700">Drag</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h2 className="text-lg font-semibold text-[var(--text-heading)]">Visual Board · touch-first cards</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {boardCards.map((card, index) => (
            <button
              key={card}
              draggable
              onDragStart={(event: any) => event.dataTransfer.setData('text/plain', String(index))}
              onDragOver={(event: any) => event.preventDefault()}
              onDrop={(event: any) => {
                const from = Number(event.dataTransfer.getData('text/plain'));
                setBoardCards((prev) => reorder(prev, from, index));
              }}
              className="rounded-2xl border border-[var(--border-soft)] bg-white p-4 text-left text-sm font-semibold text-[var(--text-heading)] active:scale-[0.98]"
            >
              {card}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const homeSurface = (
    <div className="space-y-3">
      <div className="panel">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Wanmai Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">Resume real work in one tap</h1>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Link href={`/app/${workspaceId}/wanmai/intake`} className="btn btn-primary text-center">Start Intake</Link>
          <Link href={`/app/${workspaceId}/wanmai/understand/summary`} className="btn btn-soft text-center">Open Reader + Summary</Link>
          <Link href={`/app/${workspaceId}/wanmai/build/slides`} className="btn btn-soft text-center">Build Slides/Board</Link>
          <Link href={`/app/${workspaceId}/wanmai/review/preview`} className="btn btn-soft text-center">Preview & Export</Link>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <div className="panel">
          <h2 className="text-base font-semibold text-[var(--text-heading)]">Current work</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {recentArtifacts.length > 0 ? (
              recentArtifacts.map((artifact) => (
                <button key={artifact} className="rounded-2xl border border-[var(--border-soft)] bg-white p-3 text-left text-sm font-semibold text-[var(--text-heading)] active:scale-[0.98]">
                  Continue {artifact}
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--border-soft)] bg-white p-4 text-sm">
                Starter workspace ready. Upload source to create your first artifact.
              </div>
            )}
          </div>
        </div>
        <aside className="panel">
          <h3 className="text-base font-semibold text-[var(--text-heading)]">Suggested next step</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            <li>Intake source</li>
            <li>Validate summary</li>
            <li>Build slides + board</li>
            <li>Preview and export</li>
          </ol>
        </aside>
      </div>
    </div>
  );

  const understandSurface = (
    <div className="panel">
      <h2 className="text-lg font-semibold text-[var(--text-heading)]">Reader + Summary</h2>
      <p className="mt-1 text-sm">Facts and interpretation stay separate for safer outputs.</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-3 text-sm">
          <p className="font-semibold text-[var(--text-heading)]">Source Reader</p>
          <p className="mt-1">{state.sourceFiles.length} file(s) ingested</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-3 text-sm">
          <p className="font-semibold text-[var(--text-heading)]">Summary</p>
          <p className="mt-1">{state.summaries[0]?.value ?? 'No summary yet. Upload source from Intake.'}</p>
        </div>
      </div>
    </div>
  );

  const reviewSurface = (
    <div className="panel">
      <h2 className="text-lg font-semibold text-[var(--text-heading)]">Preview · Export · History</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Link href={`/app/${workspaceId}/wanmai/review/preview`} className="btn btn-soft text-center">Preview</Link>
        <Link href={`/app/${workspaceId}/wanmai/review/export`} className="btn btn-soft text-center">Export</Link>
        <Link href={`/app/${workspaceId}/wanmai/review/history`} className="btn btn-soft text-center">History</Link>
      </div>
      <button className="btn btn-primary mt-3" onClick={() => dispatch({ type: 'SNAPSHOT', label: 'Manual restore point' })}>
        Save restore point
      </button>
    </div>
  );

  const proposalSurface = (
    <div className="panel">
      <h2 className="text-lg font-semibold text-[var(--text-heading)]">Proposal Workspace</h2>
      <p className="mt-1 text-sm">Build narrative directly from validated source blocks.</p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {storyScenes.map((scene, index) => (
          <button
            key={scene}
            draggable
            onDragStart={(event: any) => event.dataTransfer.setData('text/plain', String(index))}
            onDragOver={(event: any) => event.preventDefault()}
            onDrop={(event: any) => {
              const from = Number(event.dataTransfer.getData('text/plain'));
              setStoryScenes((prev) => reorder(prev, from, index));
            }}
            className="rounded-2xl border border-[var(--border-soft)] bg-white p-3 text-left text-sm font-semibold active:scale-[0.98]"
          >
            {scene}
          </button>
        ))}
      </div>
    </div>
  );

  const systemSurface = (
    <div className="panel">
      <h2 className="text-lg font-semibold text-[var(--text-heading)]">System Runtime</h2>
      <p className="mt-1 text-sm">Provider: {state.runtime.provider} · state: {state.runtime.state}</p>
      <p className="mt-2 text-sm">{state.runtime.degradedNotice}</p>
    </div>
  );

  const surface =
    route === 'home'
      ? homeSurface
      : route === 'intake'
        ? intakeSurface
        : route === 'understand'
          ? understandSurface
          : route.startsWith('build')
            ? buildSurface
            : route.startsWith('review')
              ? reviewSurface
              : route === 'roles/proposal'
                ? proposalSurface
                : systemSurface;

  return (
    <main className="min-h-screen pb-20 lg:pb-4">
      <section>
        <div className="container mx-auto px-4 py-4">
          <header className="panel mb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Wanmai</p>
                <p className="text-lg font-semibold text-[var(--text-heading)]">Direct product flow</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/app/${workspaceId}`} className="btn btn-soft">Back to Platform</Link>
                <Link href={`/app/${workspaceId}/wanmai/home`} className="btn btn-primary">Home</Link>
              </div>
            </div>
          </header>
          {surface}
        </div>
      </section>
      <MobileRail workspaceId={workspaceId} />
    </main>
  );
}
