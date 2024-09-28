import React, { useMemo } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { CreditCard, Robot } from '@phosphor-icons/react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import {
  Flex,
  Loader,
  RoutesLoader,
  Typography,
  useRelativeMatch,
} from 'shared';

import routes from './routes';
import { OrgSettingsProps } from './types';

import { Container, Content, Item, Nav } from './OrgSettings.styles';

const OrgSettings: React.FC<OrgSettingsProps> = ({ org }) => {
  const isOrgSettingsView = useRelativeMatch('.');

  const tabs = useMemo(() => {
    if (!org) return [];

    return [
      {
        name: 'Bots',
        path: 'bots',
        icon: Robot,
      },
      // {
      //   name: 'Billing',
      //   path: 'billing',
      //   icon: CreditCard,
      // },
    ];
  }, [org]);

  // Redirect to first tab if on settings page
  if (isOrgSettingsView) {
    return <Navigate to={tabs[0].path} replace />;
  }

  return (
    <Container>
      <NavigationMenu.Root orientation="vertical">
        <Nav>
          {tabs.map((tab) => (
            <NavLink key={tab.name} to={tab.path}>
              {({ isActive }) => (
                <Item $active={isActive} asChild>
                  <Flex alignItems="center" className="gap-2">
                    <tab.icon className="size-4" />
                    <Typography variant="small">{tab.name}</Typography>
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
