import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#09142F',
        accent: '#DB475E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-cal-sans)', ...defaultTheme.fontFamily.sans],
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
  plugins: [animate],
};

export default config;
