import React from 'react';

import './globals.css';

import { Container } from './layout.styles';

export const metadata = {
  title: 'marketing-next',
  description: 'marketing-next',
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <Container>{children}</Container>
    </html>
  );
};

export default AppLayout;
