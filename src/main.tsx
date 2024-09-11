import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import * as Tooltip from '@radix-ui/react-tooltip';

import 'index.css';

import 'env';
import 'telemetry';

import client from 'client';
import { ErrorBoundary } from 'error';
import store from 'store';
import { loadFonts } from 'theme';

import { AnalyticsProvider } from 'analytics';
import { OptimizerProvider } from 'optimizer';
import { Toasts } from 'shared';

import App from 'views/App';

loadFonts().then(() => {
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <React.StrictMode>
      <AnalyticsProvider>
        <OptimizerProvider>
          <ApolloProvider client={client}>
            <StoreProvider store={store}>
              <BrowserRouter>
                <Tooltip.Provider delayDuration={500}>
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                  <Toasts />
                </Tooltip.Provider>
              </BrowserRouter>
            </StoreProvider>
          </ApolloProvider>
        </OptimizerProvider>
      </AnalyticsProvider>
    </React.StrictMode>,
  );
});
