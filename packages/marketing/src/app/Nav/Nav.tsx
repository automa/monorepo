'use client';

import React from 'react';
import Link from 'next/link';
import { List } from '@phosphor-icons/react/dist/ssr';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { NavProps } from './types';

import {
  Container,
  MobileContainer,
  MobileMenuContent,
  MobileMenuLink,
  MobileMenuOverlay,
  MobileMenuToggle,
  NavList,
} from './Nav.styles';

const Nav: React.FC<NavProps> = ({ ...props }) => {
  const navigationItems = [
    { href: '/manifesto', label: 'Manifesto' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/bots', label: 'Bots' },
    { href: 'https://docs.automa.app', label: 'Docs' },
    { href: '/changelog', label: 'Changelog' },
  ];

  const mobileNavigationItems = [
    ...navigationItems,
    { href: process.env.NEXT_PUBLIC_CONSOLE_URL!, label: 'Get Started' },
  ];

  const hideMobileMenu = () => {
    const checkbox = document.getElementById(
      'mobile-menu-toggle',
    ) as HTMLInputElement;

    if (checkbox?.checked) {
      checkbox.checked = false;
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <Container {...props} asChild>
        <NavigationMenu.Root>
          <NavList>
            {navigationItems.map((item) => (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link asChild>
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavList>
        </NavigationMenu.Root>
      </Container>

      {/* Mobile Navigation - CSS Only */}
      <MobileContainer>
        <input
          type="checkbox"
          id="mobile-menu-toggle"
          className="peer hidden"
        />

        {/* Mobile Menu Toggle Button */}
        <MobileMenuToggle htmlFor="mobile-menu-toggle">
          <List className="size-10" />
        </MobileMenuToggle>

        {/* Mobile Menu Overlay */}
        <MobileMenuOverlay>
          <MobileMenuContent>
            <NavigationMenu.Root orientation="vertical">
              <NavList>
                {mobileNavigationItems.map((item) => (
                  <NavigationMenu.Item key={item.href}>
                    <NavigationMenu.Link asChild>
                      <Link href={item.href} onClick={hideMobileMenu}>
                        <MobileMenuLink>{item.label}</MobileMenuLink>
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ))}
              </NavList>
            </NavigationMenu.Root>
          </MobileMenuContent>
        </MobileMenuOverlay>
      </MobileContainer>
    </>
  );
};

export default Nav;
