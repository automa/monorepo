import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import * as Tooltip from '@radix-ui/react-tooltip';

import 'index.css';

import 'env';
import 'telemetry';

import client from 'client';
import { ErrorBoundary } from 'error';
import router from 'router';
import store from 'store';
import { loadFonts } from 'theme';

import { AnalyticsProvider } from 'analytics';
import { OptimizerProvider } from 'optimizer';
import { Loader, Toasts } from 'shared';

loadFonts().then(async () => {
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <React.StrictMode>
      <AnalyticsProvider>
        <OptimizerProvider>
          <ApolloProvider client={client}>
            <StoreProvider store={store}>
              <Tooltip.Provider delayDuration={500}>
                <Toasts />
                <ErrorBoundary>
                  <Suspense fallback={<Loader />}>
                    <RouterProvider router={router} />
                  </Suspense>
                </ErrorBoundary>
              </Tooltip.Provider>
            </StoreProvider>
          </ApolloProvider>
        </OptimizerProvider>
      </AnalyticsProvider>
    </React.StrictMode>,
  );
});
