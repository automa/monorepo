import { routes as orgsRoutes } from 'orgs';
import { routes as usersRoutes } from 'users';
import type { Route } from 'shared';

const routes = [...orgsRoutes, ...usersRoutes] as Route[];

export default routes;
