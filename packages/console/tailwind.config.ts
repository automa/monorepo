import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';
import scrollbar from 'tailwind-scrollbar';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        menu: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 1px rgba(0, 0, 0, 0.02), 0px 4px 8px -4px rgba(0, 0, 0, .04), 0px 16px 24px -8px rgba(0, 0, 0, .06)',
      },
      colors: {
        github: '#24292F',
        gitlab: '#FCA326',
        bitbucket: '#0052CC',
        primary: '#09142F',
        accent: '#DB475E',
      },
      fontFamily: {
        sans: ['Manrope Variable', ...defaultTheme.fontFamily.sans],
        display: ['Cal sans', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      height: {
        '0.25': '0.0625rem',
      },
      width: {
        '0.25': '0.0625rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [animate, scrollbar],
};

export default config;
