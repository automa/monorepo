import React from 'react';
import Image from 'next/image';

import { Flex, Typography } from 'components';

import Logo from 'assets/logo.svg';

import { FooterProps } from './types';

import Socials from './Socials';

import {
  Brand,
  Container,
  Link,
  LinkGroup,
  LinkGroupTitle,
  LinkGroupWrapper,
  Links,
  Wrapper,
} from './Footer.styles';

const Footer: React.FC<FooterProps> = ({ ...props }) => {
  return (
    <Container {...props}>
      <Wrapper>
        <Brand>
          <Flex className="h-fit gap-1.5">
            <Image src={Logo} alt="logo" className="size-6" />
            <Typography variant="large" className="!font-bold lg:text-base">
              Automa
            </Typography>
          </Flex>
          <Socials className="flex md:hidden" />
        </Brand>
        <Links>
          <LinkGroupWrapper>
            <LinkGroup>
              <LinkGroupTitle>Product</LinkGroupTitle>
              <Link href="/">Features</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/self-hosting">Self-hosting</Link>
              <Link href="/changelog">Changelog</Link>
            </LinkGroup>
          </LinkGroupWrapper>
          <LinkGroupWrapper>
            <LinkGroup>
              <LinkGroupTitle>Resources</LinkGroupTitle>
              <Link href="/manifesto">Manifesto</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </LinkGroup>
          </LinkGroupWrapper>
          <LinkGroupWrapper>
            <LinkGroup>
              <LinkGroupTitle>Support</LinkGroupTitle>
              <Link href="https://docs.automa.app">Documentation</Link>
              <Link href="https://discord.gg/z4Gqd7T2WQ">Community</Link>
              <Link href="https://github.com/automa/monorepo/issues">
                Issues
              </Link>
              <Link href="https://github.com/automa/feedback/issues">
                Feedback
              </Link>
              <Link href="mailto:support@automa.app">Support</Link>
            </LinkGroup>
          </LinkGroupWrapper>
        </Links>
        <Socials className="hidden md:flex" />
      </Wrapper>
    </Container>
  );
};

export default Footer;
