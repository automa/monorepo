import React from 'react';
import { Preview } from '@storybook/react';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';

import store from '../src/store';
import theme, { GlobalStyle } from '../src/theme';

const preview: Preview = {
  decorators: [
    withThemeFromJSXProvider({
      themes: {
        normal: theme,
      },
      defaultTheme: 'normal',
      Provider: ThemeProvider,
      GlobalStyles: GlobalStyle,
    }),
    (Story) => {
      return (
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
      );
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
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
