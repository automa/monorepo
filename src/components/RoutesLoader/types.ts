import { ReactNode } from 'react';
import { Location } from 'react-router-dom';

import { Route } from 'types';

export interface RoutesLoaderProps {
  routes: Route[];
  fallback?: ReactNode;
  location?: Location;
}
