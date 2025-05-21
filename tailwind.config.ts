import { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      data: {
        on: 'state="on"',
        off: 'state="off"',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      height: {
        '0.25': '0.0625rem',
      },
      maxWidth: {
        '8xl': '90rem',
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
