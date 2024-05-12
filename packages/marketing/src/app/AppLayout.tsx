import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Logo from 'assets/logo.svg';

import { Flex, Typography } from 'components';

import Nav from './Nav';

import { Container } from './AppLayout.styles';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.svg" />
      <Container>
        <Flex direction="column" className="mx-auto w-screen max-w-7xl px-6">
          <Flex justifyContent="space-between" className="py-4">
            <Link href="/">
              <Flex className="gap-2">
                <Image src={Logo} alt="logo" className="size-8" />
                <Typography className="text-2xl font-bold">Automa</Typography>
              </Flex>
            </Link>
            <Flex direction="row-reverse" alignItems="center" className="gap-4">
              <button>Log In</button>
              <Nav />
            </Flex>
          </Flex>
          {children}
        </Flex>
      </Container>
    </html>
  );
};

export default AppLayout;
