import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useStatsigClient } from '@statsig/react-bindings';

import { RoutesLoaderProps } from './types';

const RoutesLoader: React.FC<RoutesLoaderProps> = ({
  routes,
  fallback = null,
  location,
  ...commonProps
}) => {
  const {
    client: { checkGate },
  } = useStatsigClient();

  if (!routes.length) {
    return null;
  }

  return (
    <Suspense fallback={fallback}>
      <Routes location={location} key={location?.pathname}>
        {routes
          .filter(({ gate }) => !gate || checkGate(gate))
          .map(({ path, Component, props }, index) => {
            return (
              <Route
                key={index}
                path={path}
                element={<Component {...commonProps} {...props} />}
              />
            );
          })}
      </Routes>
    </Suspense>
  );
};

export default RoutesLoader;
