import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Logo from 'assets/logo.svg';

import { Button, Flex, Typography } from 'components';

import './globals.css';

import Nav from './Nav';

import { Container } from './layout.styles';

export const metadata = {
  title: 'Automa',
  description: 'A code automation platform',
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.svg" />
      <Container>
        <Flex direction="column" className="mx-auto w-screen max-w-7xl px-6">
          <Flex justifyContent="space-between">
            <Link href="/">
              <Flex className="gap-2 py-4">
                <Image src={Logo} alt="logo" className="size-8" />
                <Typography className="text-2xl font-bold lg:text-2xl">
                  Automa
                </Typography>
              </Flex>
            </Link>
            <Flex alignItems="center" className="gap-6">
              <Nav />
              <Button size="large" href={process.env.NEXT_PUBLIC_CONSOLE_URL}>
                Log In
              </Button>
            </Flex>
          </Flex>
          {children}
        </Flex>
      </Container>
    </html>
  );
};

export default AppLayout;
