import React, { useMemo } from 'react';
import { Link, Navigate, NavLink, useLocation } from 'react-router-dom';
import { CreditCard, Robot } from '@phosphor-icons/react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { Flex, Loader, RoutesLoader } from 'shared';
import { orgUri } from 'utils';

import routes from './routes';
import { OrgSettingsProps } from './types';

import { Container, Content, Item, Nav } from './OrgSettings.styles';

const OrgSettings: React.FC<OrgSettingsProps> = ({ org }) => {
  const location = useLocation();

  const tabs = useMemo(() => {
    if (!org) return [];

    return [
      {
        name: 'Billing',
        path: '/billing',
        icon: CreditCard,
      },
      {
        name: 'Bots',
        path: '/bots',
        icon: Robot,
      },
    ];
  }, [org]);

  // Redirect to first tab if on settings page
  if (location.pathname === orgUri(org, '/settings')) {
    return <Navigate to={`.${tabs[0].path}`} replace />;
  }

  return (
    <Container>
      <NavigationMenu.Root orientation="vertical">
        <Nav>
          {tabs.map((tab) => (
            <NavLink key={tab.name} to={orgUri(org, `/settings${tab.path}`)}>
              {({ isActive }) => (
                <Item $active={isActive} asChild>
                  <Flex alignItems="center" className="gap-2">
                    <tab.icon className="size-4" />
                    {tab.name}
                  </Flex>
                </Item>
              )}
            </NavLink>
          ))}
        </Nav>
      </NavigationMenu.Root>
      <Content direction="column" fullWidth>
        <RoutesLoader fallback={<Loader />} routes={routes} org={org} />
      </Content>
    </Container>
  );
};

export default OrgSettings;
