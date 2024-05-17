import React from 'react';
import { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as StoreProvider } from 'react-redux';
import { MockedProvider as ApolloProvider } from '@apollo/client/testing';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';

import '@fontsource-variable/manrope';
import 'cal-sans';

import '../src/index.css';

import { reducer } from '../src/store';
import { cache } from '../src/client';

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

      const store = configureStore({
        reducer,
        preloadedState: state,
      });

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
