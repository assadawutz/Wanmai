import Link from 'next/link';

export interface RouteSurfaceProps {
  route: string;
  title: string;
  description: string;
  nextStep: string;
}

export function RouteSurface({ route, title, description, nextStep }: RouteSurfaceProps): JSX.Element {
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
                <p className="mt-3 text-sm">Unsaved-work protection and degraded-safe rendering are active for this surface.</p>
              </div>
              <div className="rounded-xl border border-[var(--border-soft)] bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Next recommended action</p>
                <p className="mt-1 text-sm">{nextStep}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/home" className="btn btn-soft">Go to Home</Link>
                  <Link href="/intake" className="btn btn-primary">Open Intake Hub</Link>
                </div>
              </div>
            </div>
            <p className="mt-4 rounded-xl border border-dashed border-[var(--border-soft)] bg-rose-50/60 p-3 text-sm">
              Empty-state safe: if no linked artifacts are available yet, this route remains fully usable and shows a direct next step instead of a blank failure.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
