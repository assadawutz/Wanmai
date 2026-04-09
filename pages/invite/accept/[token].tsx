import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AcceptInvitePage(): JSX.Element {
  const { query } = useRouter();
  const token = typeof query.token === 'string' ? query.token : 'pending';

  return (
    <main className="min-h-screen py-6">
      <section>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl panel">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Invite acceptance</p>
            <h1 className="mt-2 text-2xl font-semibold text-[var(--text-heading)]">Join workspace</h1>
            <p className="mt-2 text-sm">Invite token: <span className="font-mono">{token}</span></p>
            <p className="mt-2 text-sm">Accepting invite routes you to onboarding and applies role-scoped access when auth is available.</p>
            <div className="mt-3 flex gap-2">
              <Link href="/onboarding" className="btn btn-primary">Accept and continue</Link>
              <Link href="/signin" className="btn btn-soft">Sign in first</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
