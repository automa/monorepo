import React, { Suspense } from 'react';
import { Routes, Route as ReactRoute } from 'react-router-dom';

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
