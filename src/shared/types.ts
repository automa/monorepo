import { FC, LazyExoticComponent } from 'react';

export interface Route {
  Component: FC<any> | LazyExoticComponent<FC<any>>;
  path: string;
  props?: any;
  gate?: string;
}
