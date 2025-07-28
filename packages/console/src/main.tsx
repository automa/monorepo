import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import * as Tooltip from '@radix-ui/react-tooltip';

import '@fontsource-variable/manrope';
import 'cal-sans';

import 'index.css';

import 'telemetry';
import { isProduction, isTest } from 'env';

import client from 'client';
import { ErrorBoundary } from 'error';
import store from 'store';
import { loadFonts } from 'theme';

import { AnalyticsProvider } from 'analytics';
import { OptimizerProvider } from 'optimizer';
import { Toasts } from 'shared';

import App from 'views/App';

loadFonts().then(async () => {
  const root = createRoot(document.getElementById('root')!);

  const DevTools = await devtools();

  root.render(
    <React.StrictMode>
      <DevTools />
      <AnalyticsProvider>
        <OptimizerProvider>
          <ApolloProvider client={client}>
            <StoreProvider store={store}>
              <BrowserRouter>
                <Tooltip.Provider delayDuration={500}>
                  <Toasts />
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                </Tooltip.Provider>
              </BrowserRouter>
            </StoreProvider>
          </ApolloProvider>
        </OptimizerProvider>
      </AnalyticsProvider>
    </React.StrictMode>,
  );
});

// Dynamically import the devtools to avoid increasing the bundle size in production builds
const devtools = async () => {
  if (isProduction || isTest) {
    return () => null;
  }

  const [{ StagewiseToolbar }, { ReactPlugin }] = await Promise.all([
    import('@stagewise/toolbar-react'),
    import('@stagewise-plugins/react'),
  ]);

  const DevTools = () => (
    <>
      <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
    </>
  );

  return DevTools;
};
