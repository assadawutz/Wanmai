import Link from 'next/link';
import { useMemo } from 'react';
import { menuMap } from '../lib/menu-map';
import { useWorkspace } from '../lib/workspace-context';

export interface RouteSurfaceProps {
  route: string;
  title: string;
  description: string;
  nextStep: string;
  featureKey: string;
}

const topLinks = [
  { href: '/app/workspace-1/wanmai/home', label: 'Home' },
  { href: '/app/workspace-1/wanmai/intake', label: 'Intake' },
  { href: '/app/workspace-1/wanmai/understand/summary', label: 'Understand' },
  { href: '/app/workspace-1/wanmai/build/docs', label: 'Build' },
  { href: '/app/workspace-1/wanmai/review/preview', label: 'Review' },
  { href: '/app/workspace-1/wanmai/operate/issues', label: 'Operate' },
  { href: '/app/workspace-1/wanmai/roles/proposal', label: 'Roles' },
  { href: '/app/workspace-1/wanmai/system/runtime', label: 'System' }
];

const deskNav = [
  {
    section: 'Workspace',
    items: [
      { href: '/app/workspace-1/overview', label: 'Overview' },
      { href: '/app/workspace-1/notifications', label: 'Notifications' },
      { href: '/app/workspace-1/jobs', label: 'Jobs & Logs' },
      { href: '/app/workspace-1/settings/general', label: 'Settings' }
    ]
  },
  {
    section: 'Wanmai',
    items: [
      { href: '/app/workspace-1/wanmai/intake', label: 'Intake Hub' },
      { href: '/app/workspace-1/wanmai/understand/reader/src-1', label: 'Reader' },
      { href: '/app/workspace-1/wanmai/build/docs', label: 'Smart Docs' },
      { href: '/app/workspace-1/wanmai/build/slides', label: 'Smart Slides' },
      { href: '/app/workspace-1/wanmai/build/mermaid', label: 'Mermaid Studio' },
      { href: '/app/workspace-1/wanmai/review/export', label: 'Export Center' }
    ]
  }
];

function cleanFeatureId(value: string): string {
  return value.toLowerCase().replace(/([A-Z])/g, '-$1');
}

function getJourneyCards(route: string): { title: string; caption: string }[] {
  if (route.includes('/intake')) {
    return [
      { title: 'Drop source files', caption: 'Queue uploads and preserve originals for safe retries.' },
      { title: 'Validate extraction', caption: 'Review low-confidence sections before summary generation.' },
      { title: 'Continue to Understand', caption: 'Promote validated sources into reader and summary.' }
    ];
  }
  if (route.includes('/understand')) {
    return [
      { title: 'Evidence-first reading', caption: 'Keep facts and interpretation separated for safer outputs.' },
      { title: 'Entity and trace checks', caption: 'Confirm names, dates, and claims against source traces.' },
      { title: 'Promote insight blocks', caption: 'Send validated insights to docs, slides, and operations.' }
    ];
  }
  if (route.includes('/build')) {
    return [
      { title: 'Compose artifacts quickly', caption: 'Use summaries, evidence, and templates to build outputs.' },
      { title: 'Autosave and rollback safety', caption: 'Every edit is snapshot-safe and recoverable.' },
      { title: 'Prepare for review', caption: 'Run preview and readiness before presentation/export.' }
    ];
  }
  if (route.includes('/review')) {
    return [
      { title: 'Preview all artifacts', caption: 'Check readability and layout across mobile and desktop.' },
      { title: 'Readiness with exact fix path', caption: 'Get explicit blockers, not generic confidence claims.' },
      { title: 'Export safely', caption: 'Retry failed exports without losing any prior result.' }
    ];
  }
  if (route.includes('/operate')) {
    return [
      { title: 'Track risk and issues', caption: 'Keep RAID, issues, and dependencies visible and linked.' },
      { title: 'Control approvals', caption: 'Use explicit approval states with ownership and next actions.' },
      { title: 'Plan releases', caption: 'Coordinate timeline, resources, and release gates together.' }
    ];
  }

  return [
    { title: 'Continue latest draft', caption: 'Resume your most recent document safely.' },
    { title: 'Run readiness check', caption: 'Review confidence, gaps, and exact fix path.' },
    { title: 'Prepare proposal package', caption: 'Bundle summary, slides, and export deliverables.' }
  ];
}

export function RouteSurface({ route, title, description, nextStep, featureKey }: RouteSurfaceProps): JSX.Element {
  const { state } = useWorkspace();
  const hasData = state.sourceFiles.length > 0;
  const validationErrors = state.validation.filter((item) => item.severity === 'error').length;
  const unresolvedWarnings = state.validation.filter((item) => item.severity !== 'error').length;
  const openActions = state.actionCenter.filter((item) => item.status === 'open').slice(0, 3);

  const feature = useMemo(
    () => menuMap.find((item) => cleanFeatureId(item.id).includes(cleanFeatureId(featureKey))),
    [featureKey]
  );

  const journeyCards = useMemo(() => getJourneyCards(route), [route]);

  return (
    <main className="min-h-screen">
      <section>
        <div className="container mx-auto px-4 py-4">
          <header className="panel mb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Wanmai</p>
                <h1 className="text-xl font-semibold text-[var(--text-heading)]">Soft Premium Workspace</h1>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-rose-100 px-2 py-1">Runtime: {state.runtime.state}</span>
                <span className="rounded-full bg-violet-100 px-2 py-1">Sources: {state.sourceFiles.length}</span>
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-auto pb-1">
              {topLinks.map((item) => (
                <Link key={item.href} href={item.href} className="btn btn-soft shrink-0">
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <div className="grid gap-3 lg:grid-cols-[250px_1fr_320px]">
            <aside className="panel hidden lg:block">
              {deskNav.map((group) => (
                <div key={group.section} className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">{group.section}</p>
                  <div className="mt-2 grid gap-2">
                    {group.items.map((item) => (
                      <Link key={item.href} href={item.href} className="btn btn-soft text-left">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            <article className="space-y-3">
              <div className="panel">
                <h2 className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{title}</h2>
                <p className="mt-2 text-sm">{description}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {journeyCards.map((card) => (
                    <div key={card.title} className="rounded-2xl border border-[var(--border-soft)] bg-white p-3">
                      <p className="font-semibold text-[var(--text-heading)]">{card.title}</p>
                      <p className="mt-1 text-sm">{card.caption}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <h3 className="text-base font-semibold text-[var(--text-heading)]">Current module readiness</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-3 text-sm">
                    <p><b>Intent:</b> {feature?.goal ?? 'Deliver a reliable, visual-first workspace module.'}</p>
                    <p className="mt-2"><b>Next useful action:</b> {nextStep}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-3 text-sm">
                    <p><b>Readiness:</b> {hasData ? 'Needs minor polish' : 'Needs structural rewrite'}</p>
                    <p className="mt-2">Warnings: {unresolvedWarnings} · Critical blockers: {validationErrors}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/app/workspace-1/wanmai/intake" className="btn btn-primary">Add source</Link>
                  <Link href="/app/workspace-1/wanmai/review/readiness" className="btn btn-soft">Open readiness</Link>
                  <Link href="/app/workspace-1/wanmai/review/history" className="btn btn-soft">History & restore</Link>
                </div>
              </div>
            </article>

            <aside className="space-y-3">
              <div className="panel">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Action center</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {openActions.length > 0 ? openActions.map((item) => (
                    <li key={item.id} className="rounded-xl bg-white p-2">
                      <p className="font-semibold text-[var(--text-heading)]">{item.title}</p>
                      <p className="text-xs text-slate-600">{item.description}</p>
                    </li>
                  )) : (
                    <li className="rounded-xl bg-white p-2">No open actions. Start by importing sources in Intake.</li>
                  )}
                </ul>
              </div>
              <div className="panel">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Degraded mode safety</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  <li>Raw source is preserved before parsing.</li>
                  <li>Last valid preview remains available.</li>
                  <li>History snapshots allow guarded restore.</li>
                </ul>
              </div>
            </aside>
          </div>

          <nav className="panel fixed inset-x-2 bottom-2 z-20 flex gap-2 overflow-auto lg:hidden">
            {topLinks.map((item) => (
              <Link key={`mobile-${item.href}`} href={item.href} className="btn btn-soft shrink-0">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
