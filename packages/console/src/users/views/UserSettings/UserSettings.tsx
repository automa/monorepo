import React, { useMemo } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { Gear, Plugs } from '@phosphor-icons/react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import {
  Flex,
  Loader,
  RoutesLoader,
  Typography,
  useRelativeMatch,
} from 'shared';

import { EmptyTopNav } from 'orgs';

import routes from './routes';
import { UserSettingsProps } from './types';

import { Container, Content, Item, Nav } from './UserSettings.styles';

const UserSettings: React.FC<UserSettingsProps> = () => {
  const isUserSettingsView = useRelativeMatch('.');

  const tabs = useMemo(() => {
    return [
      {
        name: 'General',
        path: 'general',
        icon: Gear,
      },
      {
        name: 'Connections',
        path: 'connections',
        icon: Plugs,
      },
    ];
  }, []);

  // Redirect to first tab if on org page
  if (isUserSettingsView) {
    return <Navigate to={tabs[0].path} replace />;
  }

  return (
    <>
      <EmptyTopNav />
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
          <RoutesLoader fallback={<Loader />} routes={routes} />
        </Content>
      </Container>
    </>
  );
};

export default UserSettings;
