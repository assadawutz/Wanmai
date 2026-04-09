import type { NextPage } from 'next';
import { RouteSurface } from '../components/RouteSurface';
import { routeDefinitions } from './route-definitions';

export function createRoutePage(route: string): NextPage {
  const config = routeDefinitions[route] ?? routeDefinitions['/home'];

  const RoutePage: NextPage = () => (
    <RouteSurface
      route={route}
      title={config.title}
      description={config.description}
      nextStep={config.nextStep}
      featureKey={config.featureKey}
    />
  );

  return RoutePage;
}
