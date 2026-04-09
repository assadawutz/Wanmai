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
  { href: '/w/workspace-1/home', label: 'Home' },
  { href: '/w/workspace-1/intake', label: 'Intake' },
  { href: '/w/workspace-1/understand/summary', label: 'Understand' },
  { href: '/w/workspace-1/build/docs', label: 'Build' },
  { href: '/w/workspace-1/review/preview', label: 'Review' },
  { href: '/w/workspace-1/operate/issues', label: 'Operate' },
  { href: '/w/workspace-1/roles/proposal', label: 'Roles' },
  { href: '/w/workspace-1/system/runtime', label: 'System' }
];

const deskNav = [
  {
    section: 'Workspace',
    items: [
      { href: '/w/workspace-1/home', label: 'Overview' },
      { href: '/w/workspace-1/notifications', label: 'Notifications' },
      { href: '/w/workspace-1/jobs', label: 'Jobs & Logs' },
      { href: '/w/workspace-1/settings', label: 'Settings' }
    ]
  },
  {
    section: 'Wanmai',
    items: [
      { href: '/w/workspace-1/intake', label: 'Intake Hub' },
      { href: '/w/workspace-1/understand/reader', label: 'Reader' },
      { href: '/w/workspace-1/build/docs', label: 'Smart Docs' },
      { href: '/w/workspace-1/build/slides', label: 'Smart Slides' },
      { href: '/w/workspace-1/build/mermaid', label: 'Mermaid Studio' },
      { href: '/w/workspace-1/review/export', label: 'Export Center' }
    ]
  }
];

const homeActionCards = [
  { title: 'Continue latest draft', caption: 'Resume your most recent document safely.' },
  { title: 'Run readiness check', caption: 'Review confidence, gaps, and exact fix path.' },
  { title: 'Prepare proposal package', caption: 'Bundle summary, slides, and export deliverables.' }
];

function cleanFeatureId(value: string): string {
  return value.toLowerCase().replace(/([A-Z])/g, '-$1');
}

export function RouteSurface({ route, title, description, nextStep, featureKey }: RouteSurfaceProps): JSX.Element {
  const { state } = useWorkspace();
  const hasData = state.sourceFiles.length > 0;
  const validationErrors = state.validation.filter((item) => item.severity === 'error').length;
  const unresolvedWarnings = state.validation.filter((item) => item.severity !== 'error').length;

  const feature = useMemo(
    () => menuMap.find((item) => cleanFeatureId(item.id).includes(cleanFeatureId(featureKey))),
    [featureKey]
  );

  const pathGroup = route.split('/')[1] || 'home';

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
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">{pathGroup} surface</p>
                <h2 className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{title}</h2>
                <p className="mt-2 text-sm">{description}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {homeActionCards.map((card) => (
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
                  <Link href="/w/workspace-1/intake" className="btn btn-primary">Add source</Link>
                  <Link href="/w/workspace-1/review/readiness" className="btn btn-soft">Open readiness</Link>
                  <Link href="/w/workspace-1/review/history" className="btn btn-soft">History & restore</Link>
                </div>
              </div>
            </article>

            <aside className="space-y-3">
              <div className="panel">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Recent activity</p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="rounded-xl bg-white p-2">Summary updated from latest source extraction.</li>
                  <li className="rounded-xl bg-white p-2">One export package ready for retry-safe delivery.</li>
                  <li className="rounded-xl bg-white p-2">Proposal workspace synced with current insights.</li>
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
