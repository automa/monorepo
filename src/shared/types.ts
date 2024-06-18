import { FC, LazyExoticComponent } from 'react';

export interface Route {
  Component: LazyExoticComponent<FC<any>>;
  path: string;
  props?: any;
  gate?: string;
}
