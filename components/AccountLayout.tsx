import Link from 'next/link';
import type { ReactNode } from 'react';

const links = [
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/security', label: 'Security' },
  { href: '/account/preferences', label: 'Preferences' },
  { href: '/account/notifications', label: 'Notifications' },
  { href: '/account/billing', label: 'Billing' },
  { href: '/account/usage', label: 'Usage' }
];

export function AccountLayout({ title, description, children }: { title: string; description: string; children: ReactNode }): JSX.Element {
  return (
    <main className="min-h-screen py-6">
      <section>
        <div className="container mx-auto px-4">
          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <aside className="panel h-fit">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Account</p>
              <nav className="mt-3 grid gap-2 text-sm">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="btn btn-soft text-left">{link.label}</Link>
                ))}
              </nav>
            </aside>
            <article className="panel">
              <h1 className="text-2xl font-semibold text-[var(--text-heading)]">{title}</h1>
              <p className="mt-2 text-sm">{description}</p>
              <div className="mt-4">{children}</div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
