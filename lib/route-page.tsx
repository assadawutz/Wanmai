import type { NextPage } from 'next';
import { RouteSurface } from '../components/RouteSurface';
import { routeDefinitions } from './route-definitions';

export function createRoutePage(route: keyof typeof routeDefinitions): NextPage {
  const config = routeDefinitions[route];

  const RoutePage: NextPage = () => (
    <RouteSurface
      route={route}
      title={config.title}
      description={config.description}
      nextStep={config.nextStep}
    />
  );

  return RoutePage;
}
