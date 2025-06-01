'use client';

import React from 'react';
import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { NavProps } from './types';

import { Container, List } from './Nav.styles';

const Nav: React.FC<NavProps> = ({ ...props }) => {
  return (
    <Container {...props} asChild>
      <NavigationMenu.Root>
        <List>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/manifesto">Manifesto</Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/pricing">Pricing</Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/agents">Agents</Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="https://docs.automa.app">Docs</Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/changelog">Changelog</Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </List>
      </NavigationMenu.Root>
    </Container>
  );
};

export default Nav;
