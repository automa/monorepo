import { routes as authRoutes } from 'auth';
import { routes as orgsRoutes } from 'orgs';
import { routes as reposRoutes } from 'repos';
import { Route } from 'shared';

const routes = [...authRoutes, ...orgsRoutes, ...reposRoutes] as Route[];

export default routes;
