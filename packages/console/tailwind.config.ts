import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        github: '#24292F',
        gitlab: '#FCA326',
        bitbucket: '#0052CC',
        primary: '#09142F',
        accent: '#DB475E',
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [animate],
};

export default config;
