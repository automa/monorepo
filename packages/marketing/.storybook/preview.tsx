import React from 'react';
import { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/app/globals.css';

import { Container as AppContainer } from '../src/app/layout.styles';

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
        <AppContainer>
          <Story />
        </AppContainer>
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
