import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,md,mdx}', './pages/**/*.{md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [animate],
};

export default config;
