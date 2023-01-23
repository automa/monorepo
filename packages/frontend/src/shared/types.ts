import { LazyExoticComponent, ReactElement } from 'react';

export interface Route {
  Component: LazyExoticComponent<() => ReactElement>;
  path: string;
  props: any;
}
