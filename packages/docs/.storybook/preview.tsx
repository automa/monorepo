import React from 'react';
import { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-styling';

import 'components/index.css';

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => {
      return (
        // eslint-disable-next-line tailwindcss/no-arbitrary-value
        <div className="bg-white text-slate-700 dark:bg-[#111111] dark:text-slate-200">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
