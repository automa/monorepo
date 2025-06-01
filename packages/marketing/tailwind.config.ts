import { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        tooltip:
          '0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05)',
      },
      colors: {
        primary: '#09142F',
        accent: '#DB475E',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-cal-sans)', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      gridTemplateColumns: {
        '2': 'repeat(2, minmax(0, 1fr))',
        '3': 'repeat(3, minmax(0, 1fr))',
        '4': 'repeat(4, minmax(0, 1fr))',
      },
      height: {
        '0.25': '0.0625rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      padding: {
        'cal-sans': '0.1em',
      },
      screens: {
        short: { raw: '(max-height: 700px)' },
      },
      width: {
        '0.25': '0.0625rem',
      },
    },
  },
  plugins: [animate],
};

export default config;
