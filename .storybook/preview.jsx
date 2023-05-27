import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components/macro';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';

import store from '../src/store';
import theme, { GlobalStyle } from '../src/theme';

export const decorators = [
  (Story) => {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Provider store={store}>
          <BrowserRouter>
            <Tooltip.Provider>
              <Toast.Provider>
                <Story />
                <Toast.Viewport />
              </Toast.Provider>
            </Tooltip.Provider>
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    );
  },
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
