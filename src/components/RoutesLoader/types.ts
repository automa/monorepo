import { ReactNode } from 'react';

import { Route } from 'types';

export interface RoutesLoaderProps {
  fallback: ReactNode;
  routes: Route[];
}
