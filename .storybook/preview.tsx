import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider as ApolloProvider } from '@apollo/client/testing';
import { withThemeByClassName } from '@storybook/addon-themes';
import { Preview } from '@storybook/react';
import * as Toast from '@radix-ui/react-toast';
import * as Tooltip from '@radix-ui/react-tooltip';

import '../src/index.css';

import { cache } from '../src/client';
import store, { reducer, RootState } from '../src/store';
import { Container as AppContainer } from '../src/views/App/App.styles';

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
      const { requests, cached, state } = parameters;

      cache.restore(cached);

      store.replaceReducer((_, { payload }) => payload as RootState);
      store.dispatch({ type: 'REPLACE', payload: state });
      store.replaceReducer(reducer);

      return (
        <ApolloProvider mocks={requests} cache={cache}>
          <StoreProvider store={store}>
            <BrowserRouter>
              <Tooltip.Provider delayDuration={500}>
                <Toast.Provider>
                  <AppContainer>
                    <Story />
                  </AppContainer>
                  <Toast.Viewport />
                </Toast.Provider>
              </Tooltip.Provider>
            </BrowserRouter>
          </StoreProvider>
        </ApolloProvider>
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
