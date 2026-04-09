import type { ReactNode } from 'react';

export function AppShell({ left, top, main, right, bottom }: { left: ReactNode; top: ReactNode; main: ReactNode; right: ReactNode; bottom: ReactNode }): JSX.Element {
  return (
    <main className="min-h-screen">
      <section>
        <div className="container mx-auto px-4 py-4">
          <div className="grid gap-3 lg:grid-cols-[240px_1fr_280px]">
            <aside className="panel hidden lg:block">{left}</aside>
            <div className="space-y-3">
              <header className="panel">{top}</header>
              <div>{main}</div>
            </div>
            <aside className="panel hidden lg:block">{right}</aside>
          </div>
          <footer className="panel mt-3">{bottom}</footer>
        </div>
      </section>
    </main>
  );
}
