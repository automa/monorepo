import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'marketing-next',
  description: 'marketing-next',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
