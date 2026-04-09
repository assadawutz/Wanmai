import Link from 'next/link';
import { getScreenBlueprint } from '../lib/part7-screen-map';

export interface RouteSurfaceProps {
  route: string;
  title: string;
  description: string;
  nextStep: string;
}

export function RouteSurface({ route, title, description, nextStep }: RouteSurfaceProps): JSX.Element {
  const blueprint = getScreenBlueprint(route);
  const contract = blueprint?.surfaceContract;

  return (
    <main className="min-h-screen">
      <section>
        <div className="container mx-auto px-4 py-6">
          <div className="panel">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Wanmai Workspace Studio</p>
            <h1 className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{title}</h1>
            <p className="mt-2 text-sm">{description}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-soft)] bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Route</p>
                <p className="mt-1 font-mono text-sm">{route}</p>
                <p className="mt-2 text-sm"><b>Purpose:</b> {blueprint?.purpose ?? 'Route-ready working surface with safe fallbacks.'}</p>
                <p className="mt-2 text-sm"><b>What you are working on:</b> {contract?.workingOn ?? 'Current artifact and linked workspace context.'}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-soft)] bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Next recommended action</p>
                <p className="mt-1 text-sm">{contract?.systemRecommendation ?? nextStep}</p>
                <p className="mt-2 text-sm"><b>Risk / unresolved:</b> {contract?.riskOrUnresolved ?? 'Review validation warnings and unresolved trace links.'}</p>
                <p className="mt-2 text-sm"><b>Move forward:</b> {contract?.moveForward ?? nextStep}</p>
                <p className="mt-2 text-sm"><b>Safe exit:</b> {contract?.safeExit ?? 'Take a snapshot before navigating away.'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/home" className="btn btn-soft">Go to Home</Link>
                  <Link href="/intake" className="btn btn-primary">Open Intake Hub</Link>
                </div>
              </div>
            </div>

            {blueprint && (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="rounded-xl border border-[var(--border-soft)] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Mobile-first layout</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                    {blueprint.mobileLayout.slice(0, 6).map((item) => <li key={`${route}-mobile-${item}`}>{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-[var(--border-soft)] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Desktop layout + interactions</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                    {blueprint.desktopLayout.slice(0, 4).map((item) => <li key={`${route}-desktop-${item}`}>{item}</li>)}
                  </ul>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {blueprint.keyInteractions.slice(0, 4).map((item) => <span key={`${route}-interaction-${item}`} className="rounded-full bg-rose-50 px-2 py-1">{item}</span>)}
                  </div>
                </div>
              </div>
            )}

            <p className="mt-4 rounded-xl border border-dashed border-[var(--border-soft)] bg-rose-50/60 p-3 text-sm">
              Empty-state safe: if no linked artifacts are available yet, this route remains fully usable and shows a direct next step instead of a blank failure.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
