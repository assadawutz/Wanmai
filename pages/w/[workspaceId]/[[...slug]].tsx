import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RouteSurface } from '../../../components/RouteSurface';
import { routeDefinitions, type RouteKey } from '../../../lib/route-definitions';

const legacySegmentMap: Record<string, string> = {
  overview: 'home',
  present: 'review/presentation',
  notifications: 'notifications',
  jobs: 'jobs'
};

function mapToCanonicalRoute(slug: string[] | undefined): RouteKey {
  if (!slug || slug.length === 0) return '/home';

  const withoutWanmai = slug[0] === 'wanmai' ? slug.slice(1) : slug;
  const joined = `/${withoutWanmai.join('/')}`;
  if (joined in routeDefinitions) return joined as RouteKey;

  const mapped = withoutWanmai.length > 0 ? [legacySegmentMap[withoutWanmai[0]] ?? withoutWanmai[0], ...withoutWanmai.slice(1)] : [];
  const normalized = `/${mapped.join('/')}`;
  if (normalized in routeDefinitions) return normalized as RouteKey;

  if (mapped[0] === 'understand') {
    const understandRoute = `/${mapped.join('/')}`;
    if (understandRoute in routeDefinitions) return understandRoute as RouteKey;
  }

  return '/home';
}

const WorkspaceRoutePage: NextPage = () => {
  const router = useRouter();
  const route = mapToCanonicalRoute(router.query.slug as string[] | undefined);
  const def = routeDefinitions[route];

  return (
    <>
      <RouteSurface route={route} title={def.title} description={def.description} nextStep={def.nextStep} featureKey={def.featureKey} />
      <div className="fixed bottom-20 right-4 z-30 hidden lg:block">
        <Link href="/app/workspace-1/wanmai/home" className="btn btn-soft rounded-full px-4 py-2 shadow-sm">
          Daisy helper
        </Link>
      </div>
    </>
  );
};

export default WorkspaceRoutePage;
