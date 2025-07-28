import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { MockedProvider as ApolloProvider } from '@apollo/client/testing';
import { withThemeByClassName } from '@storybook/addon-themes';
import { Preview } from '@storybook/react';
import * as Toast from '@radix-ui/react-toast';
import * as Tooltip from '@radix-ui/react-tooltip';

import '@fontsource-variable/manrope';
import 'cal-sans';

import '../src/index.css';

import { AnalyticsProvider } from '../src/analytics';
import { cache } from '../src/client';
import { OptimizerProvider } from '../src/optimizer';
import store, { reducer, RootState } from '../src/store';
import { Container as AppContainer } from '../src/views/App/App.styles';

store.replaceReducer((state, { type, payload }) => {
  if (type === 'REPLACE') {
    return { ...state, ...(payload as RootState) };
  }

  return reducer(state, { type, payload });
});

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story, { parameters }) => {
      const { requests, cached, state, route } = parameters;

      cache.restore(cached);

      store.dispatch({ type: 'REPLACE', payload: state });

      return (
        <AnalyticsProvider>
          <OptimizerProvider>
            <ApolloProvider mocks={requests} cache={cache}>
              <StoreProvider store={store}>
                <Tooltip.Provider delayDuration={500}>
                  <Toast.Provider>
                    <Toast.Viewport />
                    <AppContainer>
                      <RouterProvider
                        router={createMemoryRouter([
                          {
                            element: <Outlet context={route?.context} />,
                            children: [
                              {
                                path: '*',
                                Component: Story,
                              },
                            ],
                          },
                        ])}
                      />
                    </AppContainer>
                  </Toast.Provider>
                </Tooltip.Provider>
              </StoreProvider>
            </ApolloProvider>
          </OptimizerProvider>
        </AnalyticsProvider>
      );
    },
  ],
  parameters: {
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'fullscreen',
  },
};

export default preview;
