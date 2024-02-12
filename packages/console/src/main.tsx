import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';

import 'index.css';

import 'env';
import 'telemetry';

import { ErrorBoundary } from 'error';
import client from 'client';
import store from 'store';
import { loadFonts } from 'theme';

import { AnalyticsProvider } from 'analytics';

import App from 'views/App';

loadFonts().then(() => {
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <React.StrictMode>
      <AnalyticsProvider>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <BrowserRouter>
              <Tooltip.Provider delayDuration={500}>
                <Toast.Provider>
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                  <Toast.Viewport />
                </Toast.Provider>
              </Tooltip.Provider>
            </BrowserRouter>
          </Provider>
        </ApolloProvider>
      </AnalyticsProvider>
    </React.StrictMode>,
  );
});
