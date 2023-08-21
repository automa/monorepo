import React, { Suspense } from 'react';
import { Routes, Route as ReactRoute } from 'react-router-dom';
import { Statsig } from 'statsig-react';

import { RoutesLoaderProps } from './types';

const RoutesLoader: React.FC<RoutesLoaderProps> = ({
  routes,
  fallback = null,
  location,
}) => {
  if (!routes.length) {
    return null;
  }

  return (
    <Suspense fallback={fallback}>
      <Routes location={location} key={location?.pathname}>
        {routes
          .filter(({ gate }) => !gate || Statsig.checkGate(gate))
          .map(({ path, Component, props }, index) => {
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
