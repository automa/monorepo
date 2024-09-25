import { Inter, Manrope } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({
  subsets: ['latin'],
  display: 'block',
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'block',
  variable: '--font-manrope',
});

const calSans = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  display: 'block',
  variable: '--font-cal-sans',
});

export const fonts = `${inter.variable} ${manrope.variable} ${calSans.variable}`;
