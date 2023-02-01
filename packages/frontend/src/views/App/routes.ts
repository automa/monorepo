import { routes as authRoutes } from 'auth';
import { routes as orgsRoutes } from 'orgs';
import { Route } from 'shared';

const routes = [...authRoutes, ...orgsRoutes] as Route[];

export default routes;
