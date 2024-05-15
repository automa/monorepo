import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({
  subsets: ['latin'],
  display: 'block',
  variable: '--font-inter',
});

const calSans = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  display: 'block',
  variable: '--font-cal-sans',
});

export const fonts = `${inter.variable} ${calSans.variable}`;
