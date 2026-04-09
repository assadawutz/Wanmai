import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { RouteSurface } from '../../../components/RouteSurface';
import { routeDefinitions, type RouteKey } from '../../../lib/route-definitions';

function toCanonicalRoute(slug: string[] | undefined): RouteKey | null {
  if (!slug || slug.length === 0) return '/home';

  const joined = `/${slug.join('/')}`;
  if (joined in routeDefinitions) return joined as RouteKey;

  if (joined === '/understand/reader') return '/understand/reader';

  if (slug[0] === 'home') return '/home';
  return null;
}

const WorkspaceRoutePage: NextPage = () => {
  const router = useRouter();
  const route = toCanonicalRoute(router.query.slug as string[] | undefined);

  if (!route) {
    return (
      <main className="min-h-screen">
        <section>
          <div className="container mx-auto px-4 py-6">
            <div className="panel">
              <h1 className="text-2xl font-semibold text-[var(--text-heading)]">Unknown workspace route</h1>
              <p className="mt-2 text-sm">This route is not in the locked workspace map. Use a valid route from the navigation.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const def = routeDefinitions[route];
  return <RouteSurface route={route} title={def.title} description={def.description} nextStep={def.nextStep} featureKey={def.featureKey} />;
};

export default WorkspaceRoutePage;
