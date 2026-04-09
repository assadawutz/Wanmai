import Link from 'next/link';
import { useWorkspace } from '../lib/workspace-context';

export function SaasWorkspaceEntry({ workspaceId }: { workspaceId: string }): JSX.Element {
  const { state } = useWorkspace();

  return (
    <main className="min-h-screen">
      <section>
        <div className="container mx-auto px-4 py-4">
          <header className="panel mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">Platform</p>
            <h1 className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">Workspace SaaS Entry</h1>
            <p className="mt-2 text-sm">Manage workspace access, health, billing, integrations, and open Wanmai instantly.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/app/${workspaceId}/wanmai/home`} className="btn btn-primary">Open Wanmai Workspace</Link>
              <Link href={`/app/${workspaceId}/wanmai/review/history`} className="btn btn-soft">Continue Last Work</Link>
            </div>
          </header>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="panel">
              <h2 className="text-base font-semibold text-[var(--text-heading)]">Recent Wanmai Artifacts</h2>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="rounded-xl bg-white p-2">{state.smartDocs[0]?.label ?? 'Executive Summary'}</li>
                <li className="rounded-xl bg-white p-2">{state.smartSlides[0]?.label ?? 'Slide Deck'}</li>
                <li className="rounded-xl bg-white p-2">{state.mermaidDocuments[0]?.label ?? 'Process Diagram'}</li>
              </ul>
            </div>
            <div className="panel">
              <h2 className="text-base font-semibold text-[var(--text-heading)]">System Health</h2>
              <ul className="mt-2 space-y-1 text-sm">
                <li>Runtime: {state.runtime.state}</li>
                <li>Provider: {state.runtime.provider}</li>
                <li>Open actions: {state.actionCenter.filter((item) => item.status === 'open').length}</li>
              </ul>
            </div>
            <div className="panel">
              <h2 className="text-base font-semibold text-[var(--text-heading)]">Notifications</h2>
              <p className="mt-2 text-sm">{state.validation.length > 0 ? `${state.validation.length} validation notices need review.` : 'No critical warnings.'}</p>
              <Link href={`/app/${workspaceId}/wanmai/review/readiness`} className="btn btn-soft mt-3">Open Readiness</Link>
            </div>
            <div className="panel">
              <h2 className="text-base font-semibold text-[var(--text-heading)]">Workspace Settings</h2>
              <div className="mt-2 grid gap-2 text-sm">
                <Link href="/settings" className="btn btn-soft text-left">General Settings</Link>
                <Link href="/system/integrations" className="btn btn-soft text-left">Integrations</Link>
                <Link href="/account/billing" className="btn btn-soft text-left">Usage & Billing</Link>
              </div>
            </div>
            <div className="panel">
              <h2 className="text-base font-semibold text-[var(--text-heading)]">Workspace Access</h2>
              <div className="mt-2 grid gap-2 text-sm">
                <Link href="/notifications" className="btn btn-soft text-left">Member Activity</Link>
                <Link href="/invite/accept/demo-token" className="btn btn-soft text-left">Invite Members</Link>
                <Link href="/account/security" className="btn btn-soft text-left">Privacy & Security</Link>
              </div>
            </div>
            <div className="panel">
              <h2 className="text-base font-semibold text-[var(--text-heading)]">Files & Jobs</h2>
              <div className="mt-2 grid gap-2 text-sm">
                <Link href={`/app/${workspaceId}/wanmai/intake`} className="btn btn-soft text-left">Source Files</Link>
                <Link href="/jobs" className="btn btn-soft text-left">Background Jobs</Link>
                <Link href={`/app/${workspaceId}/wanmai/system/runtime`} className="btn btn-soft text-left">Runtime</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
