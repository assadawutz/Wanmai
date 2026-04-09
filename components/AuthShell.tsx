import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps): JSX.Element {
  return (
    <main className="min-h-screen py-6">
      <section>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md rounded-3xl border border-[var(--border-soft)] bg-white/85 p-6 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Wanmai Account</p>
            <h1 className="mt-2 text-2xl font-semibold text-[var(--text-heading)]">{title}</h1>
            <p className="mt-2 text-sm">{subtitle}</p>
            <div className="mt-4">{children}</div>
            {footer ? <div className="mt-4 text-sm">{footer}</div> : null}
          </div>
          <div className="mx-auto mt-3 flex max-w-md items-center justify-between text-xs text-rose-900">
            <Link href="/signin" className="hover:underline">Sign in</Link>
            <Link href="/signup" className="hover:underline">Create account</Link>
            <Link href="/w/workspace-1/home" className="hover:underline">Continue local mode</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
