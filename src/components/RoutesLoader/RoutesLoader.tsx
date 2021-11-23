import React, { ReactNode, Suspense } from 'react';
import { Routes, Route as ReactRoute } from 'react-router-dom';

import { Route } from 'types';

export interface RoutesLoaderProps {
  fallback: ReactNode;
  routes: Route[];
}

const RoutesLoader: React.FC<RoutesLoaderProps> = ({
  fallback = null,
  routes,
}) => {
  if (!routes.length) {
    return null;
  }

  return (
    <Suspense fallback={fallback}>
      <Routes>
        {routes.map(({ path, Component, props }, index) => {
          return (
            <ReactRoute
              key={index}
              path={path}
              element={<Component {...props} />}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default RoutesLoader;
