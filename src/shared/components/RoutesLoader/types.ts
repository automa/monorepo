import { ReactNode } from 'react';
import { Location } from 'react-router-dom';

import { Route } from 'shared/types';

export interface RoutesLoaderProps extends Record<string, any> {
  routes: Route[];
  fallback?: ReactNode;
  location?: Location;
}
