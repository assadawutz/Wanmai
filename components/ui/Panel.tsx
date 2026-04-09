import type { ReactNode } from 'react';

export function Panel({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  return (
    <article className="panel">
      <h3 className="mb-2 text-sm font-semibold text-[var(--text-heading)]">{title}</h3>
      {children}
    </article>
  );
}
