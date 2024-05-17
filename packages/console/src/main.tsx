import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as StoreProvider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import * as Tooltip from '@radix-ui/react-tooltip';

import '@fontsource-variable/manrope';
import 'cal-sans';

import 'index.css';

import 'env';
import 'telemetry';

import { ErrorBoundary } from 'error';
import client from 'client';
import store from 'store';
import { loadFonts } from 'theme';

import { AnalyticsProvider } from 'analytics';
import { Toasts } from 'shared';

import App from 'views/App';

loadFonts().then(() => {
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <React.StrictMode>
      <AnalyticsProvider>
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
      </AnalyticsProvider>
    </React.StrictMode>,
  );
});
