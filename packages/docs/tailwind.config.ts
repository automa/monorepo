import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{md,mdx}',
    './components/**/*.{ts,tsx}',
    './theme.config.tsx',
    './.storybook/preview.tsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
