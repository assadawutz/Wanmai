import Link from 'next/link';
import { menuMap } from '../lib/menu-map';
import { getScreenBlueprint } from '../lib/part7-screen-map';
import { useWorkspace } from '../lib/workspace-context';

export interface RouteSurfaceProps {
  route: string;
  title: string;
  description: string;
  nextStep: string;
  featureKey: string;
}

const globalLinks = [
  { href: '/recent', label: 'Recent' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/settings', label: 'Settings' }
];

export function RouteSurface({ route, title, description, nextStep, featureKey }: RouteSurfaceProps): JSX.Element {
  const { state } = useWorkspace();
  const blueprint = getScreenBlueprint(route);
  const menuFeature = menuMap.find((item) => item.id.toLowerCase().includes(featureKey.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()));
  const validationErrors = state.validation.filter((item) => item.severity === 'error').length;
  const hasData = state.sourceFiles.length > 0;

  return (
    <main className="min-h-screen">
      <section>
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <article className="panel">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Wanmai Workspace Studio</p>
              <h1 className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{title}</h1>
              <p className="mt-2 text-sm">{description}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--border-soft)] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Route status</p>
                  <p className="mt-1 font-mono text-xs">{route}</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>Sources: {state.sourceFiles.length}</li>
                    <li>Validation warnings: {state.validation.length}</li>
                    <li>Critical errors: {validationErrors}</li>
                    <li>Runtime: {state.runtime.state}</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-[var(--border-soft)] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Readiness</p>
                  <p className="mt-1 text-sm">{hasData ? 'Needs minor polish' : 'Needs structural rewrite'}</p>
                  <p className="mt-2 text-sm"><b>Exact next step:</b> {nextStep}</p>
                  <p className="mt-2 text-xs text-rose-900">If not ready: add source evidence, resolve validation, re-run preview and export checks.</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--border-soft)] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Visual-first surface</p>
                  <p className="mt-1 text-sm">{menuFeature?.goal ?? blueprint?.purpose ?? 'Cards, boards, and traces remain visible even in degraded mode.'}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li>Factual extraction</li>
                    <li>Interpretation layer</li>
                    <li>Recommendations and next actions</li>
                    <li>Source trace links</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-[var(--border-soft)] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Fallback-safe mode</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                    <li>Original source preserved</li>
                    <li>Partial extraction remains usable</li>
                    <li>Retry actions always visible</li>
                    <li>No silent failures</li>
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href="/w/workspace-1/intake" className="btn btn-primary">Go to Intake</Link>
                    <Link href="/w/workspace-1/review/readiness" className="btn btn-soft">Readiness</Link>
                  </div>
                </div>
              </div>
            </article>

            <aside className="panel h-fit">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Global navigation</p>
              <div className="mt-2 grid gap-2">
                {globalLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="btn btn-soft text-left">{link.label}</Link>
                ))}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-rose-700">Workspace quick links</p>
              <div className="mt-2 grid gap-2 text-sm">
                <Link href="/w/workspace-1/home" className="btn btn-soft text-left">Home</Link>
                <Link href="/w/workspace-1/understand/reader" className="btn btn-soft text-left">Reader</Link>
                <Link href="/w/workspace-1/build/docs" className="btn btn-soft text-left">Docs</Link>
                <Link href="/w/workspace-1/review/export" className="btn btn-soft text-left">Export</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
