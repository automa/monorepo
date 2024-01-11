import { routes as orgsRoutes } from 'orgs';
import { routes as reposRoutes } from 'repos';
import { routes as usersRoutes } from 'users';
import type { Route } from 'shared';

const routes = [...orgsRoutes, ...reposRoutes, ...usersRoutes] as Route[];

export default routes;
