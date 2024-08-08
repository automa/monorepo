import { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import scrollbar from 'tailwind-scrollbar';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        border: 'inset 0 -1px rgba(0, 0, 0, 0.08)',
        tooltip:
          '0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        card: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)',
        cardHover:
          '0 0 0 1px rgba(0, 0, 0, 0.08), 0 6px 14px rgba(0, 0, 0, 0.08)',
        menu: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 1px rgba(0, 0, 0, 0.02), 0px 4px 8px -4px rgba(0, 0, 0, .04), 0px 16px 24px -8px rgba(0, 0, 0, .06)',
        modal:
          '0 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 1px rgba(0, 0, 0, 0.02), 0px 8px 16px -4px rgba(0, 0, 0, 0.04), 0px 24px 32px -8px rgba(0, 0, 0, 0.06)',
      },
      colors: {
        github: '#24292F',
        gitlab: '#FCA326',
        bitbucket: '#0052CC',
        primary: '#09142F',
        accent: '#DB475E',
      },
      data: {
        on: 'state="on"',
        off: 'state="off"',
      },
      fontFamily: {
        sans: ['Manrope Variable', ...defaultTheme.fontFamily.sans],
        display: ['Cal sans', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      gridTemplateColumns: {
        '2': 'repeat(auto-fill, minmax(29rem, 1fr))',
        '3': 'repeat(auto-fill, minmax(23rem, 1fr))',
        '4': 'repeat(auto-fill, minmax(17rem, 1fr))',
      },
      height: {
        '0.25': '0.0625rem',
      },
      padding: {
        'cal-sans': '0.1em',
      },
      width: {
        '0.25': '0.0625rem',
        '180': '45rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [animate, scrollbar],
};

export default config;
