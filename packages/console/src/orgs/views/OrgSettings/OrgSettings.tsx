import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { Flex, Loader, RoutesLoader } from 'shared';

import routes from './routes';
import { OrgSettingsProps } from './types';

import { Container, Nav, Item, Content } from './OrgSettings.styles';

const OrgSettings: React.FC<OrgSettingsProps> = ({ org, ...props }) => {
  const navigate = useNavigate();

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
  useEffect(() => {
    if (location.pathname === `/${org.provider_type}/${org.name}/settings`) {
      navigate(`/${org.provider_type}/${org.name}/settings${tabs[0].path}`);
    }
  }, [org, tabs, navigate]);

  return (
    <Container {...props}>
      <NavigationMenu.Root orientation="vertical">
        <Nav>
          {tabs.map((tab) => {
            const uri = `/${org.provider_type}/${org.name}/settings${tab.path}`;
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
