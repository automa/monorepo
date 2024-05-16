import React, { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { Loader, RoutesLoader } from 'shared';
import { orgUri } from 'utils';

import routes from './routes';
import { OrgSettingsProps } from './types';

import { Container, Nav, Item, Content } from './OrgSettings.styles';

const OrgSettings: React.FC<OrgSettingsProps> = ({ org }) => {
  const tabs = useMemo(() => {
    if (!org) return [];

    return [
      {
        name: 'Billing',
        path: '/billing',
      },
      {
        name: 'Bots',
        path: '/bots',
      },
    ];
  }, [org]);

  // Redirect to first tab if on settings page
  if (location.pathname === orgUri(org, '/settings')) {
    return <Navigate to={orgUri(org, `/settings${tabs[0].path}`)} />;
  }

  return (
    <Container>
      <NavigationMenu.Root orientation="vertical">
        <Nav>
          {tabs.map((tab) => {
            const uri = orgUri(org, `/settings${tab.path}`);

            return (
              <Item
                key={tab.name}
                $active={location.pathname.startsWith(uri)}
                asChild
              >
                <Link to={uri}>{tab.name}</Link>
              </Item>
            );
          })}
        </Nav>
      </NavigationMenu.Root>
      <Content direction="column" fullWidth>
        <RoutesLoader fallback={<Loader />} routes={routes} org={org} />
      </Content>
    </Container>
  );
};

export default OrgSettings;
