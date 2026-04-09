import Link from 'next/link';
import { useState } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

interface OnboardingState {
  workspaceName: string;
  role: 'PM' | 'Technical' | 'Sales' | 'Executive';
  completedAt?: string;
}

export default function OnboardingPage(): JSX.Element {
  const [state, setState] = usePersistentState<OnboardingState>('wanmai.onboarding', { workspaceName: 'Team Workspace', role: 'PM' });
  const [saved, setSaved] = useState(false);

  return (
    <main className="min-h-screen py-6">
      <section>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl panel">
            <h1 className="text-2xl font-semibold text-[var(--text-heading)]">Onboarding</h1>
            <p className="mt-1 text-sm">Configure your default workspace and role. Local state persists so onboarding can resume safely.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="text-sm">Workspace name
                <input className="input mt-1" value={state.workspaceName} onChange={(event) => setState({ ...state, workspaceName: event.target.value })} />
              </label>
              <label className="text-sm">Primary role
                <select className="input mt-1" value={state.role} onChange={(event) => setState({ ...state, role: event.target.value as OnboardingState['role'] })}>
                  <option>PM</option>
                  <option>Technical</option>
                  <option>Sales</option>
                  <option>Executive</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setState({ ...state, completedAt: new Date().toISOString() });
                  setSaved(true);
                }}
              >
                Save onboarding
              </button>
              <Link href="/w/workspace-1/home" className="btn btn-soft">Open workspace</Link>
            </div>
            {saved ? <p className="mt-2 text-xs text-emerald-700">Onboarding saved at {state.completedAt ?? 'now'}.</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
