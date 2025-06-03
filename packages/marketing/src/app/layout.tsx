import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import './globals.css';

import { fonts } from 'theme';

import { Button, Flex } from 'components';

import Logo from 'assets/logo.svg';

import Footer from './Footer';
import Nav from './Nav';

import {
  Brand,
  Container,
  Header,
  NavContainer,
  PageContainer,
} from './layout.styles';

export const metadata = {
  title: 'Automa',
  description: 'A code automation platform',
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" className={fonts}>
      <link rel="icon" href="/favicon.svg" />
      <Container>
        <PageContainer>
          <Header>
            <Link href="/">
              <Flex className="gap-2 py-4">
                <Image src={Logo} alt="logo" className="size-8" />
                <Brand>Automa</Brand>
              </Flex>
            </Link>
            <NavContainer>
              <Button size="large" href={process.env.NEXT_PUBLIC_CONSOLE_URL!}>
                Get Started
              </Button>
              <Nav />
            </NavContainer>
          </Header>
          {children}
          <Footer />
        </PageContainer>
      </Container>
    </html>
  );
};

export default AppLayout;
