import { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem',
      },
      height: {
        '0.25': '0.0625rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      width: {
        '0.25': '0.0625rem',
      },
    },
  },
  plugins: [animate],
};

export default config;
