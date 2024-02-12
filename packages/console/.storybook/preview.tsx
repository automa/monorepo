import React from 'react';
import { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';

import '../src/index.css';

import store from '../src/store';

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
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
