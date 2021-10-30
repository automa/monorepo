import { LazyExoticComponent, ReactElement } from 'react';

export interface Route {
  Component: LazyExoticComponent<() => ReactElement>;
  exact?: boolean;
  path: string;
  props: any;
}
