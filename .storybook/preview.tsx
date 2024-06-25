import React from 'react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { Preview } from '@storybook/react';

import '../src/app/globals.css';

import { fonts } from '../src/theme';

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
        <AppContainer asChild className={fonts}>
          <div>{Story()}</div>
        </AppContainer>
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
