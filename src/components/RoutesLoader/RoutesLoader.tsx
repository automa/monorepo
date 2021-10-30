import React, { ReactNode, Suspense } from 'react';
import { Switch, Route as ReactRoute, useRouteMatch } from 'react-router-dom';

import { Route } from 'types';

export interface RoutesLoaderProps {
  fallback: ReactNode;
  routes: Route[];
}

const RoutesLoader: React.FC<RoutesLoaderProps> = ({
  fallback = null,
  routes,
}) => {
  const { url } = useRouteMatch();

  if (!routes.length) {
    return null;
  }

  return (
    <Suspense fallback={fallback}>
      <Switch>
        {routes.map(({ exact, path, Component, props }, index) => {
          return (
            <ReactRoute
              key={index}
              exact={exact}
              path={url === '/' ? path : `${url}${path}`}
            >
              {(routeProps) => <Component {...routeProps} {...props} />}
            </ReactRoute>
          );
        })}
      </Switch>
    </Suspense>
  );
};

export default RoutesLoader;
