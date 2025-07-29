import React, { Suspense, useMemo } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { Gear, Plugs } from '@phosphor-icons/react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { Flex, Loader, Typography, useRelativeMatch } from 'shared';

import { EmptyTopNav } from 'orgs';

import { Container, Content, Item, Nav } from './UserSettings.styles';

const UserSettings: React.FC = () => {
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
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </Content>
      </Container>
    </>
  );
};

export default UserSettings;
